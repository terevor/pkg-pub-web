# pkg-pub-web

> A Vue.js project

## Build Setup

> 推荐将npm源切换到淘宝镜像：`npm set registry https://registry.npm.taobao.org/`，具体参考 [淘宝NPM镜像](https://npm.taobao.org/)

> 备选使用`cnpm`(有时候cnpm安装的依赖会出一些诡异的问题，一般还是推荐使用npm)，安装方法：`npm install -g cnpm --registry=https://registry.npm.taobao.org` 

> npm安装node-sass时，由于被墙可能装不上，可以等npm install结束以后，`cnpm install node-sass` 补装一下

> win系统下推荐先安装 [Windows-Build-Tools](https://github.com/felixrieseberg/windows-build-tools)，解决node-sass编译失败的问题

``` bash
# install dependencies
npm install

# serve with hot reload at localhost:7002
npm run dev

# build for production with minification
npm run build

# build for production and view the bundle analyzer report
npm run build --report
```

For a detailed explanation on how things work, check out the [guide](http://vuejs-templates.github.io/webpack/) and [docs for vue-loader](http://vuejs.github.io/vue-loader).

## Development Configuration

> 编辑器推荐使用 `VSCode`，搭配插件：`Beautify`、`Prettier`(Alt + Shift + F 格式化当前文档)、`Vetur`(Vue语法高亮及Snippet)，并在用户设置里添加如下配置：
``
{
    "emmet.syntaxProfiles": {
        "vue-html": "html",
        "vue": "html"
    },
    "javascript.format.insertSpaceAfterFunctionKeywordForAnonymousFunctions": false,
    "vetur.format.js.InsertSpaceBeforeFunctionParenthesis": false,
    "vetur.format.js.InsertSpaceAfterFunctionKeywordForAnonymousFunctions": false,
    "vetur.format.defaultFormatter.html": "js-beautify-html",
    "prettier.tabWidth": 4,
    "prettier.singleQuote": true,
    "prettier.semi": false
}
``
