## 常见问题

**Q: 关于注册**

A: 请各位同事实名注册，并使用工作邮箱作为账号，后期系统会开发一些功能，通过邮件方式推送消息提醒

**Q: 怎么发布安装包，该上传到哪？**

A: 统一上传至开发服务器`192.168.6.75`，访问该ip需连接至WIFI `partnfire`或`partnfire_5G`，如有自动化编译发布工具，配置参数如下：
```
ssh: {
    host: '192.168.6.75',
    port: 22,
    username: 'publisher',
    password: 'sigma5tdev777',

    // 安装包上传至此目录，目录名自行命名，最好是英文，系统会根据此目录在界面自动生成下载链接
    remoteDir: '/home/publisher/pkg-pub/app/public/安装包目录名'
}
```

**Q: 项目、里程碑、模块的关系？**

A: 为了适用于公司不同的产品线，统一发布流程，暂定三级结构：

> 项目 --> 产品

> 里程碑 --> 大版本号，包含整体功能说明

> 模块 --> web、server、app、桌面应用、sql脚本等交付内容，含各自的版本号、change log

**Q: 操作流程？**

A: 步骤如下：

1. 项目经理建立项目

2. 根据开发计划建立阶段性的里程碑大版本号，填写总体功能说明

3. 各模块的研发负责人，先上传安装包，再建立模块，填写版本号、功能说明（安装配置说明），关联安装包

4. 测试人员登录系统，根据项目、里程碑，查找模块列表，下载安装包部署至测试环境。

**Q: 操作权限？**

A: 目前包括项目、里程碑、模块，所有人都可查看，但只有创建者拥有修改、删除的权限
