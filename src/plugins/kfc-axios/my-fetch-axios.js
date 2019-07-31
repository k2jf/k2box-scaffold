import Axios from 'axios'
import { Message } from 'iview'

const getQueryString = function (params) {
  if (!params) { return '' }
  var esc = encodeURIComponent
  return Object.keys(params)
    .map(k => esc(k) + '=' + esc(params[k]))
    .join('&')
}

const composeUrl = function (url, params) {
  if (params) {
    let urlObject = new URL(url)
    return url + (urlObject.search ? '&' : '?') + getQueryString(params)
  } else {
    return url
  }
}

/**
 * an axios implementation using Fetch API
 * @param config axios's config, already constructed by axios
 * @returns {Promise<Response>} succeed with resp and fail with error
 */
const fetchEngine = function (config) {
  /* todo Fetch impl. Refer to -> https://github.com/axios/axios/tree/master/lib/adapters */

  // note print out axios config
  // console.log(config);

  const request = new Request(composeUrl(config.url, config.params), {
    method: config.method,
    // todo is this header correctly configured?
    headers: config.headers,
    body: config.data,
    mode: 'cors', // enable cross origin
    credentials: 'include',
    // cache: null,
    redirect: 'manual',
    referrer: 'client',
    referrerPolicy: 'origin'
    // integrity: undefined,
    // keepalive: false,
    // signal: null
  })

  // note print out request (Request) object
  // console.log('fetchEngine: Request -> %o', request);

  return fetch(request).then(
    resp => {
      // 1. 302
      if (resp.status === 0 && resp.type === 'opaqueredirect') {
        // detect a redirect. Ready to turn to CAS login
        return Promise.reject(new Error('302'))
      }

      /*
        fetch behaves differently from axios most in the promise-returning-condition.
        in Fetch, only network error (preventing the request from sending) will cause a rejected promise.
        but in axios, only successful request will generate a resolved promise.
        So, when implementing axios using Fetch, there is part of code in the 'promise.then()' section
        that generates rejected promise for further use.
       */

      if (resp.ok) {
        // pre 2.1: if requesting a text, then should return a text
        if (config.responseType && config.responseType.toLowerCase() === 'text') {
          return resp.text().then(str => {
            return {
              data: str,
              status: resp.status,
              statusText: resp.statusText,
              headers: resp.headers,
              config: config
              // request: {/* fixme supply with this request object! */},
            }
          })
        }

        // 2.1 success
        // classic 'ok' state, will be resolved
        return resp.json().then(data => {
          return {
            data: data,
            status: resp.status,
            statusText: resp.statusText,
            headers: resp.headers,
            config: config
            // request: {/* fixme supply with this request object! */},
          }
        })
      } else if (resp.status >= 400) {
        // 2.2 failure
        return resp.json().then(data => {
          const error = { // the error object
            response: {
              data: data,
              status: resp.status,
              statusText: resp.statusText,
              headers: resp.headers
            },
            config: config,
            request: config.request,
            message: data.message
          }

          return Promise.reject(error)
        })
      }
    },

    // note failure callback should be put as 2nd argument, not a following .catch()!
    // (because the then() before DID return some rejected Promises. If chained, those Promises
    // will be immediately handled here.)
    error => {
      console.error('axios-fetch has problem with this request: error -> %o', error.message)

      if (error.message.endsWith('Access-Control-Allow-Origin.')) {
        console.log('fetchEngin: axios-fetch seems catching a typeError by CORS on safari.')
        return Promise.reject(new Error('302'))
      }

      // fixme add more subtle check for this error
      return Promise.reject(new Error('network'))
    })
}

export default function internalInstall (Vue, options) {
  const baseUrl = options.baseUrl || ''
  const keyName = options.keyName || 'K2_KEY'

  let login = options.login || function () {
    console.warn('currently no login method is provided. You may add this through: \n' +
      '1. in main.js, Vue.use(kfcFetch, {login: ...}) \n' +
      '2. in App.vue created() hook, use `this.$axios.updateLoginMethod()` .\n' +
      '(remember to opt `this` for `that` in supplied login method!)')
  }

  // for this constructor, I use adapter to manually plugin Fetch API inside axios.
  var axios = Axios.create({
    baseURL: baseUrl,
    adapter: fetchEngine
  })

  // recover the token
  let token = sessionStorage.getItem('$kmx-auth-token') || ''
  if (token) {
    axios.defaults.headers.common[keyName] = token
  }
  window.addEventListener('unload', function saveTokenToSessionStorageAndSurviveThePageReload () {
    // console.info('window is to unload');
    if (token) {
      sessionStorage.setItem('$kmx-auth-token', token)
    }
  })

  /*
   * manually install $Message in case iview not being globally installed
   *
   * `Message` is kind of an expensive instance but is lazy-initialized.
   * Thus `import { Message } from 'iview'` is safe.
   * If tip is assigned to `Message`, it will be a stand-alone message instance
   */
  const tip = Vue.prototype.$Message || Message

  axios.interceptors.response.use(function onSuccess (resp) {
    return resp
  }, function onFailure (error) {
    // extract option 'silent' from all kinds of rejected Promises
    const allowPopup = !(error.config && error.config.silent)

    if (error.message === '302') { // 1. handle CAS Login redirect
      allowPopup && tip.error('登录信息失效，请重新登录！')
      login()
      throw new Error('need login')
    } else if (error.message === 'network') { // 2. handle network error
      allowPopup && tip.error('网络中断，请稍候重试')
      throw new Error('network error')
    } else if (error.response) {
      var statusCode = error.response.status

      if (statusCode === 401) { // 3.1. 401 UnAuthorized
        allowPopup && tip.error('登录信息失效，请重新登录！')
        login()
        throw new Error('need login')
      } else if (statusCode === 403) { // 3.2 403 Forbidden
        allowPopup && tip.error({
          content: '操作被阻止：权限不足',
          duration: 3
        })
        throw new Error('forbidden')
      } else if (statusCode === 404) { // 3.3 404 Not Found
        allowPopup && tip.warning({
          content: '[404 Not Found] 您要访问的接口不存在<br/>' + error.config.url,
          duration: 3
        })
        throw new Error('404')
      } else if (statusCode === 500) { // 3.4 500 internal error
        allowPopup && tip.error({
          content: `服务器开小差了：${error.response.data.message}`,
          duration: 3
        })
        throw new Error('api server error')
      } else { // 3.5 400, or other error in response
        allowPopup && tip.error({
          content: `[${statusCode}] ${error.response.data.message}`,
          duration: 3
        })
        throw new Error('unspecified error: ' + statusCode)
      }
    } else if (error.request) { // 4. request valid, but no response
      console.error('request error: %o', error.request)
      allowPopup && tip.error({
        content: `${error.message}`,
        duration: 3
      })
    } else { // 5. request broken
      console.error('other error: %s', error.message)
    }

    // console.log('error --> %o', error.config);
    return Promise.reject(error)
  })

  axios.updateBaseUrl = function (newBaseUrl) {
    axios.defaults.baseUrl = newBaseUrl
  }

  axios.updateToken = function (newToken) {
    if (newToken && token !== newToken) {
      token = newToken
      axios.defaults.headers.common[keyName] = token
    }
  }

  axios.updateLoginMethod = function (newMethod) {
    login = newMethod
  }

  return axios
}
