# kfc-axios
generic fetch plugin with integration of iview $notice popup and token management

## install
1. add axios dependency in npm
    ```bash
    npm install --save axios
    ```
2. clone kfc-axios into `src/plugins`
    ```bash
    git remote add -f kfc-axios https://github.com/k2jf/kfc-axios.git
    git subtree add -P src/plugins/kfc-axios kfc-axios master --squash
    ```
3. import and use in `main.js`
    ```js
    /* main.js */
    import kfcAxios from 'plugins/kfc-axios'
    
    // and, before new Vue() ...
    Vue.use(kfcAxios)
    ```

> **optional** here inside `Vue.use(...)`, you can specify some options
> ```js
> Vue.use(kfcAxios, {
>   baseUrl: 'baseUrl-can-be-overridden-per-request.com',
>   keyName: 'key-of-the-auth-header', // default to 'K2_KEY'
>   login: function () {
>     window.location.href = '...'
>   } 
> })
> ``` 
> 

## what you get from this routine
- one axios instance
  - `global.axios` (used in src/api)
  - `this.$axios` (**preferred**, in components only)
- automatically 302/400+/500+ status handling
  - 302/401: a poptip with message '登录信息失效，请重新登录！' 
  followed by custom `login()` and a rejected Promise (`err.message === 'need login'`)
  
  - 403: a poptip with message '操作被阻止：权限不足' and a rejected
  Promise (`err.message === 'forbidden'`)
  
  - 404: a poptip with message like '\[404 Not Found] 您要访问的接口不存在...'
  and a rejected Promise (`err.message === '404'`)
  
  - 500: a poptip with message like '服务器开小差了：...' and a rejected Promise
  (`err.message === 'api server error'`)
  
  - others please see the code
  
## other ways of customization
- `this.$axios.updateBaseUrl(newBaseUrl)`  
  globally change the axios's base url
  
- `this.$axios.updateToken(newToken)`  
  globally change the auth token
  
- `this.$axios.updateLoginMethod(loginMethod)`  
  globally change the login method (where you can use router)
  ```js
  /* App.vue */
  ...
  created () {
    const that = this
    this.$axios.updateLoginMethod(function () {
      that.$Message.warning('This is a warning tip') // an iview message popup
      that.$router.push('/login?from=xxx'); // jump to login with params
    })
  }
  ```
  
## how to use axios?

basically this is an axios's implementation so usage are the same. See 
[the doc](https://github.com/axios/axios) for help. Here are some examples:

```js
/**
 * GET 系统管理-微服务管理-目录树
 */
// design in src/api/sample.js
export const listMsCategory = () => {
  return global.axios.get(`/ms/category/trees`).then(res => {
    return res.data.data.map(item => ({
      id: item.id,
      pId: item.parentId,  
      name: item.categoryName,
      msCount: parseInt(item.msCount) || 0
    }))
  })
}


// use in component
import {listMsCategory} from '@/api/sample'
export default {
  mounted () {
    listMsCategory().then(data => {
      // process your data
    }).catch(err => {
      // ... if you DO need to handle err
    })
  }
}
```
(more to be added...) 
