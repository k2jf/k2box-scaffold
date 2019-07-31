# k2box-scaffold

A starting template for k2-box embedded vue apps (using iView as component library).

## what have I done on this project
1. use newest vue-cli to create the project
```bash
npm upgrade -g @vue/cli
```
2. create a repo and `git clone` it down.
3. initialize a vue project using vue-cli.
```bash
cd k2box-scaffold
vue create .
```
4. tweaks on eslint

## deploy

This is a embedded app. To deploy, simply build this project (`npm run build`) and 
copy all files inside `/dist` to the corresponding folder in box server.

> note pay attention to the relative path & proxy setting
>
> for development, `webpack-dev-server` will proxy requests from `localhost:<port>/api/*`
> to `server:<port>/*`.
>
> when in production, the `nginx` server for the front-end host will do the same thing again.
> thus, all requests for this embedded project should still work without modification.
>
> in vue.config.js, the default value for 'publicPath' is `/`, making all path url relative
> to the front-end's root, which fails embedded resources locating.
> So, this `publicPath` must be either an empty string `''` or `'./'` (these two are the same) 
>  

## known limitation

1. you must use hash mode in router, and the project should be a 'Single-Paged-Application'

2. you must specify `publicPath` as `''` or `'./'` in vue.config

3. all api requests should follow the same baseURL as the front-end host

## k2box app general contract

1. app should expose a bundle of static files with `index.html` and `cover.png` under the root.

2. app should be SPA (Single Page Application), and use `hash-mode`.

3. app should request api with the same `baseURL` as the host k2box-app. 

## maintainer 

zhangzhenbang
