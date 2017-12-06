<template>
    <div class="home-main markdown-body">
        <h2 id="-">常见问题</h2>
        <p>
            <strong>Q: 关于注册</strong>
        </p>
        <p>A: 请各位同事实名注册，并使用工作邮箱作为账号，目前通过邮箱可以重置个人密码，后期系统会扩展一些功能，通过邮件方式推送消息提醒</p>
        <p>
            <strong>Q: 怎么发布安装包，该上传到哪？</strong>
        </p>
        <p>A: 统一上传至开发服务器<code>192.168.6.75</code>，访问该ip需连接至WIFI <code>partnfire</code>或<code>partnfire_5G</code>，如有自动化编译发布工具，配置参数如下：</p>
<pre><code><span class="hljs-selector-tag">ssh</span>: {
    <span class="hljs-attribute">host</span>: <span class="hljs-string">'192.168.6.75'</span>,
    port: <span class="hljs-number">22</span>,
    username: <span class="hljs-string">'publisher'</span>,
    password: <span class="hljs-string">'sigma5tdev777'</span>,

    // 安装包上传至此目录，目录名自行命名，最好是英文，系统会根据此目录在界面自动生成下载链接
    remoteDir: <span class="hljs-string">'/home/publisher/pkg-pub/app/public/安装包目录名'</span>
}</code></pre>
        <p>
            <strong>Q: 项目、里程碑、模块的关系？</strong>
        </p>
        <p>A: 为了适用于公司不同的产品线，统一发布流程，暂定三级结构：</p>
        <blockquote>
            <p>项目 --&gt; 产品</p>
            <p>里程碑 --&gt; 大版本号，包含整体功能说明</p>
            <p>模块 --&gt; web、server、app、桌面应用、sql脚本等交付内容，含各自的版本号、change log</p>
        </blockquote>
        <p>
            <strong>Q: 操作流程？</strong>
        </p>
        <p>A: 步骤如下：</p>
        <ol>
            <li>
                <p>1. 项目经理建立项目</p>
            </li>
            <li>
                <p>2. 根据开发计划建立阶段性的里程碑大版本号，填写总体功能说明</p>
            </li>
            <li>
                <p>3. 各模块的研发负责人，先上传安装包，再建立模块，填写版本号、功能说明（安装配置说明），关联安装包</p>
            </li>
            <li>
                <p>4. 测试人员登录系统，根据项目、里程碑，查找模块列表，下载安装包部署至测试环境。</p>
            </li>
        </ol>
        <p>
            <strong>Q: 操作权限？</strong>
        </p>
        <p>A: 目前包括项目、里程碑、模块，所有人都可查看，但只有创建者拥有修改、删除的权限</p>
    </div>
</template>

<script>
import '@/assets/styles/github-markdown.css'
export default {
    name: 'home'
}
</script>

<style scoped>
.home-main {
    margin: 30px;
}
</style>
