<template>
    <div class="project-main">
        <div class="project-list">
            <div class="wrapper" style="margin: 0px 20px;">
                <Button type="primary" shape="circle" icon="plus" @click="edit.project = true"></Button>
                <span class="panel-title">项目</span>
            </div>
            <div class="wrapper" v-for="project in projectList" :key="project._id" style="margin: 0px 20px;">
                <Button @click="openProject(project._id)" size="large" long type="text">
                    <transition name="current-project">
                        <Icon v-show="opendProject === project._id" type="checkmark"></Icon>
                    </transition>
                    <span class="text-name">{{ project.name }}</span>
                </Button>
            </div>
        </div>
        <transition name="slide-fade" mode="out-in">
            <div class="pannel version-list" v-show="!editing">
                <div class="wrapper">
                    <Button type="primary" shape="circle" icon="plus" @click="edit.version = true"></Button>
                    <span class="panel-title">版本</span>
                </div>
                <div class="wrapper">
                    <Timeline>
                        <TimelineItem v-for="version in versionList" :key="version._id">
                            <span>
                                <p class="time">{{formatDate(version.modifiedTime)}}</p>
                                <p class="content">
                                    <Button @click="openVersion(version._id)" type="text">
                                        <Icon v-if="opendVersion === version._id" type="checkmark"></Icon>
                                        <span class="text-name">{{version.name}}</span>
                                    </Button>
                                </p>
                            </span>
                        </TimelineItem>
                    </Timeline>
                </div>
            </div>
        </transition>
        <transition name="slide-fade" mode="out-in">
            <div class="mod-list" v-show="!editing">
                <div class="wrapper" style="margin: 5px 20px;">
                    <Button type="primary" shape="circle" icon="plus" @click="edit.mod = true"></Button>
                    <span class="panel-title">模块</span>
                </div>
                <div class="mod-list-content">
                    <Table ref="modList" :columns="columns" :data="modList" :loading="loading"></Table>
                </div>
            </div>
        </transition>
        <transition name="slide-fade" mode="out-in">
            <div class="pannel form" v-show="edit.project">
                <Form ref="prjForm" :model="projectForm" :rules="rules" :label-width="80">
                    <FormItem label="项目名称" prop="name">
                        <Input v-model="projectForm.name" placeholder="请输入项目名称"></Input>
                    </FormItem>
                    <FormItem label="项目简介" prop="desc">
                        <Input v-model="projectForm.desc" type="textarea" :autosize="{ minRows: 3, maxRows: 15 }" placeholder="请输入项目简介"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="saveProject" :loading="loading">提交</Button>
                        <Button type="ghost" style="margin-left: 8px" @click="edit.project = false">取消</Button>
                    </FormItem>
                </Form>
            </div>
        </transition>
        <transition name="slide-fade" mode="out-in">
            <div class="pannel form" v-show="edit.version">
                <Form ref="verForm" :model="versionForm" :rules="rules" :label-width="80">
                    <FormItem label="版本号" prop="name">
                        <Input v-model="versionForm.name" placeholder="请输入版本号"></Input>
                    </FormItem>
                    <FormItem label="版本说明" prop="desc">
                        <Input v-model="versionForm.desc" type="textarea" :autosize="{ minRows: 3, maxRows: 15 }" placeholder="请输入版本说明"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="saveVersion" :loading="loading">提交</Button>
                        <Button type="ghost" style="margin-left: 8px" @click="edit.version = false">取消</Button>
                    </FormItem>
                </Form>
            </div>
        </transition>
        <transition name="slide-fade" mode="out-in">
            <div class="pannel form" v-show="edit.mod">
                <Form ref="modForm" :model="modForm" :rules="rules" :label-width="80">
                    <FormItem label="模块名称" prop="name">
                        <Input v-model="modForm.name" placeholder="请输入模块名称"></Input>
                    </FormItem>
                    <FormItem label="安装包" prop="url">
                        <Cascader :data="fileList" v-model="modForm.url"></Cascader>
                    </FormItem>
                    <FormItem label="功能说明" prop="desc">
                        <Input v-model="modForm.desc" type="textarea" :autosize="{ minRows: 3, maxRows: 15 }" placeholder="请输入功能说明"></Input>
                    </FormItem>
                    <FormItem>
                        <Button type="primary" @click="saveMod" :loading="loading">提交</Button>
                        <Button type="ghost" style="margin-left: 8px" @click="edit.mod = false">取消</Button>
                    </FormItem>
                </Form>
            </div>
        </transition>
        <form ref="hiddenform" target="_blank">
            <input type="hidden" name="filename" ref="form_filename">
            <input type="hidden" name="dir" ref="form_dir">
            <input type="hidden" name="token" v-model="user.token">
        </form>
    </div>
</template>

<script>
import {
    fetchProjectList,
    fetchVersionList,
    fetchModList,
    saveProject,
    saveVersion,
    saveMod
} from '@/services/project'
import modDetail from './ModDetail'
import { fetchCategoryTree } from '@/services/category'

function lpad(s) {
    return `00${s}`.slice(s.toString().length)
}

export default {
    name: 'project',
    components: { modDetail },
    data() {
        return {
            projectList: [],
            versionList: [],
            modList: [],
            fileList: [],
            opendProject: '',
            opendVersion: '',
            columns: [
                {
                    type: 'expand',
                    width: 50,
                    render: (h, params) => {
                        return h(modDetail, {
                            props: {
                                row: params.row
                            }
                        })
                    }
                },
                {
                    title: '名称',
                    key: 'name',
                    align: 'left',
                    ellipsis: true,
                    sortable: true,
                    render: (h, params) => {
                        return h(
                            'a',
                            {
                                on: {
                                    click: () => {
                                        const url = params.row.url
                                        if (!url || url.length !== 2) {
                                            this.$Message.error('未指定安装包位置，无法下载')
                                            return
                                        }
                                        this.download(url[0], url[1])
                                    }
                                }
                            },
                            params.row.name
                        )
                    }
                },
                {
                    title: ' ',
                    key: 'modifiedTime',
                    align: 'center',
                    width: 180,
                    render: (h, params) => {
                        return h('span', [
                            h('Icon', {
                                props: {
                                    type: 'android-time',
                                    size: 12
                                },
                                style: {
                                    margin: '0 5px'
                                }
                            }),
                            h(
                                'span',
                                {},
                                this.formatDate(params.row.modifiedTime)
                            )
                        ])
                    }
                }
            ],
            loading: false,
            edit: {
                project: false,
                version: false,
                mod: false
            },
            projectForm: {
                name: '',
                desc: '',
                url: ''
            },
            versionForm: {
                name: '',
                desc: ''
            },
            modForm: {
                name: '',
                desc: '',
                url: []
            },
            rules: {
                name: [{ required: true, message: '不能为空', trigger: 'blur' }],
                desc: [{ required: true, message: '不能为空', trigger: 'blur' }],
                url: [
                    {
                        type: 'array',
                        required: true,
                        message: '不能为空',
                        trigger: 'change'
                    }
                ]
            }
        }
    },
    computed: {
        editing() {
            return this.edit.project || this.edit.version || this.edit.mod
        },
        user() {
            return this.$store.state.user
        }
    },
    mounted() {
        this.loadProjectList()
        this.loadFileList()
    },
    methods: {
        formatDate(time) {
            let date = new Date(time)
            let year = date.getFullYear()
            let month = date.getMonth() + 1
            let day = date.getDate()
            let hour = date.getHours()
            let minute = date.getMinutes()
            return (
                year +
                '/' +
                lpad(month) +
                '/' +
                lpad(day) +
                '  ' +
                lpad(hour) +
                ':' +
                lpad(minute)
            )
        },
        loadFileList() {
            fetchCategoryTree()
                .then(({ data }) => {
                    this.fileList = data
                })
                .catch(err => {
                    console.dir(err)
                    this.$Message.error(err.message || '查询安装包文件列表失败，请稍后再试')
                })
        },
        openProject(id) {
            if (id) {
                this.opendProject = id
                this.versionList = []
                this.modList = []
                this.loadVersionList(id)
            }
        },
        openVersion(id) {
            if (id) {
                this.opendVersion = id
                this.modList = []
                this.loadModList(id)
            }
        },
        loadProjectList() {
            this.loading = true
            fetchProjectList()
                .then(({ data }) => {
                    this.projectList = data
                    this.$nextTick(() => {
                        if (this.projectList.length > 0) {
                            this.openProject(this.projectList[0]._id)
                        }
                    })
                })
                .catch(err => {
                    console.dir(err)
                    this.$Message.error(err.message || '查询失败，请稍后再试')
                })
                .finally(() => {
                    this.loading = false
                })
        },
        loadVersionList(id) {
            this.loading = true
            fetchVersionList({
                projectId: id
            })
                .then(({ data }) => {
                    this.versionList = data
                    this.$nextTick(() => {
                        if (this.versionList.length > 0) {
                            this.openVersion(this.versionList[0]._id)
                        }
                    })
                })
                .catch(err => {
                    console.dir(err)
                    this.$Message.error(err.message || '查询失败，请稍后再试')
                })
                .finally(() => {
                    this.loading = false
                })
        },
        loadModList(id) {
            this.loading = true
            fetchModList({
                versionId: id
            })
                .then(({ data }) => {
                    this.modList = data
                })
                .catch(err => {
                    console.dir(err)
                    this.$Message.error(err.message || '查询失败，请稍后再试')
                })
                .finally(() => {
                    this.loading = false
                })
        },
        saveProject() {
            this.$refs['prjForm'].validate(valid => {
                if (valid) {
                    const p = {
                        name: this.projectForm.name,
                        desc: this.projectForm.desc
                    }
                    this.loading = true
                    saveProject(p)
                        .then(({ data }) => {
                            if (data) {
                                this.$Message.success({
                                    content: '添加成功',
                                    onClose: () => {
                                        this.$refs['prjForm'].resetFields()
                                        this.edit.project = false
                                        this.loadProjectList()
                                    }
                                })
                            }
                        })
                        .catch(err => {
                            console.dir(err)
                            this.$Message.error(err.message || '添加失败')
                        })
                        .finally(() => {
                            this.loading = false
                        })
                }
            })
        },
        saveVersion() {
            this.$refs['verForm'].validate(valid => {
                if (valid) {
                    const p = {
                        name: this.versionForm.name,
                        desc: this.versionForm.desc,
                        projectId: this.opendProject
                    }
                    this.loading = true
                    saveVersion(p)
                        .then(({ data }) => {
                            if (data) {
                                this.$Message.success({
                                    content: '添加成功',
                                    onClose: () => {
                                        this.$refs['verForm'].resetFields()
                                        this.edit.version = false
                                        this.loadVersionList(data.projectId)
                                    }
                                })
                            }
                        })
                        .catch(err => {
                            console.dir(err)
                            this.$Message.error(err.message || '添加失败')
                        })
                        .finally(() => {
                            this.loading = false
                        })
                }
            })
        },
        saveMod() {
            this.$refs['modForm'].validate(valid => {
                if (valid) {
                    const p = {
                        name: this.modForm.name,
                        desc: this.modForm.desc,
                        url: this.modForm.url,
                        versionId: this.opendVersion
                    }
                    this.loading = true
                    saveMod(p)
                        .then(({ data }) => {
                            if (data) {
                                this.$Message.success({
                                    content: '添加成功',
                                    onClose: () => {
                                        this.$refs['modForm'].resetFields()
                                        this.edit.mod = false
                                        this.loadModList(data.versionId)
                                    }
                                })
                            }
                        })
                        .catch(err => {
                            console.dir(err)
                            this.$Message.error(err.message || '添加失败')
                        })
                        .finally(() => {
                            this.loading = false
                        })
                }
            })
        },
        download(dir, file) {
            const $form = this.$refs['hiddenform']
            this.$refs['form_filename'].value = file
            this.$refs['form_dir'].value = dir
            $form.action = '/api/pkg/download'
            $form.method = 'GET'
            $form.submit()
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.project-main {
    position: absolute;
    left: 0px;
    top: 0px;
    right: 0px;
    bottom: 0px;
    .wrapper {
        padding: 10px;
        margin: 10px 20px;
        border-bottom: 1px dashed #d2d3d2;
        &:last-child {
            border: none;
        }
    }
    .panel-title {
        margin: 0 20px;
        font-size: 16px;
        vertical-align: middle;
    }
    .text-name {
        margin-left: 10px;
    }
    .project-list {
        position: absolute;
        left: 0;
        top: 10px;
        width: 200px;
        bottom: 0;
        padding: 10px 0;
        .project-count-badge-outer {
            float: right;
        }
        .project-count-badge {
            background: #d2d3d2;
        }
        &:first-child .project-count-badge {
            background: #ed3f14;
        }
    }
    .version-list {
        .time {
            font-size: 12px;
            color: #666;
        }
        .content {
            button {
                font-size: 14px;
                font-weight: bold;
            }
        }
    }
    .mod-list {
        position: absolute;
        top: 15px;
        right: 15px;
        bottom: 15px;
        left: 400px;
        background: white;
        border-radius: 3px;
        box-shadow: 2px 2px 10px 2px rgba(0, 0, 0, 0.1);
        overflow: auto;
        z-index: 2;
        &-content {
            width: 100%;
            padding: 10px;
        }
    }
    .pannel {
        position: absolute;
        top: 10px;
        right: 10px;
        bottom: 10px;
        left: 200px;
        background: white;
        border-radius: 3px;
        box-shadow: 2px 2px 10px 2px rgba(0, 0, 0, 0.1);
        overflow: auto;
        &.form {
            padding: 30px;
        }
    }
}

.current-project-enter,
.current-project-leave-to {
    opacity: 0;
    width: 0;
}
.current-project-enter-active,
.current-project-leave-active {
    transition: all 0.3s;
}
.current-project-enter-to,
.current-project-leave {
    opacity: 1;
    width: 12px;
}

.slide-fade-enter-active {
    transition: all 0.3s ease;
}

.slide-fade-leave-active {
    transition: all 0.8s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter,
.slide-fade-leave-to {
    transform: translateX(10px);
    opacity: 0;
}
</style>