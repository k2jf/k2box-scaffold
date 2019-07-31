# k2box-scaffold

A starting template for k2-box embedded vue apps (using iView as component library).

## install

> you first need a new git repo; then pull this template into that repo by using:
```bash
git pull --allow-unrelated-histories git@github.com:k2jf/k2box-scaffold.git master
npm install
```
**please do not PUSH back to this repo. `git pull` will keep track of the latest change and update YOUR project**

## project file structure
<pre>
.
├── babel.config.js
├── package.json
├── package-lock.json
├── postcss.config.js
├── public
│   ├── cover.png ----------> Your app thumbnail when deployed
│   ├── favicon.ico
│   └── index.html
├── README.md
├── src
│   ├── api ----------------> methods about http requests
│   │   └── index.js
│   ├── App.vue ------------> Root Vue component
│   ├── assets -------------> images used in project, such as wallpaper, icons, etc
│   │   └── logo.png
│   ├── components ----------------> project-wide reusable components
│   │   └── HelloWorld.vue
│   ├── iview-variables.less ------> use this to override iView's default theme
│   ├── libs ----------------------> useful functions
│   │   ├── color-palette.js
│   │   ├── date-time.js
│   │   └── utils.js
│   ├── main.js -------------------> Project Entry. APP_ID is specified here.
│   ├── plugins -------------------> Vue plugins.
│   │   ├── iview.js
│   │   └── kfc-axios
│   │       ├── index.js
│   │       ├── my-fetch-axios.js
│   │       └── README.md
│   ├── router.js ----------------> simple-structured route map
│   ├── store.js -----------------> global state-management util
│   └── views --------------------> your pages
│       ├── About.vue
│       └── Home.vue
└── vue.config.js ----------------> vue config, containing proxy settings.

</pre>

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
