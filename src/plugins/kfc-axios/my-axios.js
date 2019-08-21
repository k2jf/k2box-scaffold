import Axios from 'axios'
import { Message } from 'iview'

export default function internalInstall (Vue, options) {
  const baseUrl = options.baseUrl || ''

  let login = options.login || function () {
    console.warn('currently no login method is provided. You may add this through: \n' +
      '1. in main.js, Vue.use(kfcFetch, {login: ...}) \n' +
      '2. in App.vue created() hook, use `this.$axios.updateLoginMethod()` .\n' +
      '(remember to opt `this` for `that` in supplied login method!)')
  };

  // for this constructor, I use adapter to manually plugin Fetch API inside axios.
  const axios = Axios.create({
    baseURL: baseUrl
  });

  /*
   * manually install $Message in case iview not being globally installed
   *
   * `Message` is kind of an expensive instance but is lazy-initialized.
   * Thus `import { Message } from 'iview'` is safe.
   * If tip is assigned to `Message`, it will be a stand-alone message instance
   */
  const tip = Vue.prototype.$Message || Message;

  axios.interceptors.response.use(function onSuccess (resp) {
    return resp
  }, function onFailure (error) {
    // extract option 'silent' from all kinds of rejected Promises
    const allowPopup = !(error.config && error.config.silent);

    if (error.response) {
      var statusCode = error.response.status;

      if (statusCode === 401) { // 3.1. 401 UnAuthorized
        allowPopup && tip.error('登录信息失效，请重新登录！');
        login();
        throw new Error('need login')
      } else if (statusCode === 403) { // 3.2 403 Forbidden
        allowPopup && tip.error({
          content: '操作被阻止：权限不足',
          duration: 3
        });
        throw new Error('forbidden')
      } else if (statusCode === 404) { // 3.3 404 Not Found
        allowPopup && tip.warning({
          content: '[404 Not Found] 您要访问的接口不存在<br/>' + error.config.url,
          duration: 3
        });
        throw new Error('404')
      } else if (statusCode === 500) { // 3.4 500 internal error
        allowPopup && tip.error({
          content: `服务器开小差了：${error.response.data.message}`,
          duration: 3
        });
        throw new Error('api server error')
      } else { // 3.5 400, or other error in response
        allowPopup && tip.error({
          content: `[${statusCode}] ${error.response.data.message}`,
          duration: 3
        });
        throw new Error('unspecified error: ' + statusCode)
      }
    } else if (error.request) { // 4. request valid, but no response
      console.error('request error: %o', error.request);
      allowPopup && tip.error({
        content: `${error.message}`,
        duration: 3
      })
    } else { // 5. request broken
      console.error('other error: %s', error.message)
    }

    // console.log('error --> %o', error.config);
    return Promise.reject(error)
  });

  axios.updateBaseUrl = function (newBaseUrl) {
    axios.defaults.baseUrl = newBaseUrl
  };

  axios.updateLoginMethod = function (newMethod) {
    login = newMethod
  };

  return axios
}
