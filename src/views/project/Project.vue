<template>
    <div class="project-main">
        <div class="panel-left">
            <div class="wrapper" style="margin: 0px 20px;">
                <Tooltip content="添加一个新项目" placement="bottom-start">
                    <Button type="primary" shape="circle" icon="plus" @click="addProject"></Button>
                </Tooltip>
                <span class="panel-title">项目</span>
            </div>
            <div class="wrapper" v-for="project in projectList" :key="project._id" style="margin: 0px 20px;">
                <Button @click="openProject(project._id)" size="large" long type="text">
                    <transition name="current-project">
                        <Icon v-show="openedProject === project._id" type="checkmark"></Icon>
                    </transition>
                    <span class="text-name">{{ project.name }}</span>
                </Button>
            </div>
        </div>

        <transition name="slide-fade" mode="out-in">
            <div class="panel-center version-list" v-show="!edit.project">
                <div class="wrapper">
                    <Tooltip content="添加一个新版本" placement="bottom-start">
                        <Button type="primary" shape="circle" icon="plus" @click="addVersion"></Button>
                    </Tooltip>
                    <span class="panel-title">版本</span>
                </div>
                <div class="wrapper timeline-container">
                    <div class="timeline-col">
                        <Timeline>
                            <TimelineItem v-for="version in versionList" :key="version._id">
                                <span>
                                    <p class="time">{{ new Date(version.modifiedTime) | formatDateStr('yyyy/MM/dd hh:mm') }}</p>
                                    <p class="content">
                                        <Button @click="openVersion(version)" type="text">
                                            <Icon v-if="openedVersion && openedVersion._id === version._id" type="checkmark"></Icon>
                                            <span class="text-name">{{version.name}}</span>
                                        </Button>
                                    </p>
                                </span>
                            </TimelineItem>
                        </Timeline>
                    </div>
                    <div class="detail-col" v-show="versionList.length > 0">
                        <div class="detail-title">
                            <span class="detail-title-text">{{openedVersion.name}} 版本说明</span>
                            <Tooltip content="打开模块列表" placement="bottom-start">
                                <Button type="primary" shape="circle" size="small" icon="arrow-return-right" @click="showModList"></Button>
                            </Tooltip>
                            <Tooltip content="编辑版本信息" placement="bottom-start">
                                <Button type="primary" shape="circle" size="small" icon="edit" @click="editVersion(openedVersion)"></Button>
                            </Tooltip>
                        </div>
                        <Input v-model="openedVersion.desc" type="textarea" :autosize="{ minRows: 3 }" readonly></Input>
                    </div>
                </div>
            </div>
        </transition>
        <transition name="slide-fade" mode="out-in">
            <div class="panel-center form" v-show="edit.project">
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

        <transition name="slide-up-fade" mode="out-in">
            <div class="panel-right" v-show="edit.modlist">
                <div class="wrapper" style="margin: 5px 20px;">
                    <Tooltip content="返回版本说明" placement="bottom-start">
                        <Button type="default" shape="circle" icon="arrow-return-left" @click="edit.modlist = false" style="margin-right: 10px;"></Button>
                    </Tooltip>
                    <Tooltip content="添加一个新模块" placement="bottom-start">
                        <Button type="primary" shape="circle" icon="plus" @click="addMod"></Button>
                    </Tooltip>
                    <span class="panel-title">模块</span>
                </div>
                <div class="panel-right-content">
                    <Table ref="modList" :columns="columns" :data="modList" :loading="loading"></Table>
                </div>
            </div>
        </transition>
        <transition name="slide-up-fade" mode="out-in">
            <div class="panel-right form" v-show="edit.mod">
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
        <transition name="slide-up-fade" mode="out-in">
            <div class="panel-right form" v-show="edit.version">
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

        <Modal v-model="edit.delete" width="360">
            <p slot="header" style="color:#f60; text-align:center;">
                <Icon type="information-circled"></Icon>
                <span>操作警告</span>
            </p>
            <div style="text-align:center">
                <p>执行删除操作后，该条数据将不可恢复</p>
                <p>确认继续吗?</p>
            </div>
            <div slot="footer">
                <Button type="error" size="large" long :loading="loading" @click="removeMod">删除</Button>
            </div>
        </Modal>
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
    updateVersion,
    saveMod,
    updateMod,
    deleteMod
} from '@/services/project'
import modDetail from './ModDetail'
import { fetchCategoryTree } from '@/services/category'
import { formatDateStr } from '@/filters'

export default {
    name: 'project',
    components: { modDetail },
    data() {
        return {
            projectList: [],
            versionList: [],
            modList: [],
            fileList: [],
            openedProject: '',
            openedVersion: {
                name: '',
                desc: ''
            },
            openedMod: '',
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
                    key: '_id',
                    align: 'center',
                    render: (h, params) => {
                        if (params.row.creator !== this.user.name) {
                            return ''
                        }
                        return h(
                            'ButtonGroup',
                            {
                                props: {
                                    size: 'small'
                                }
                            },
                            [
                                h('Button', {
                                    props: {
                                        type: 'dashed',
                                        icon: 'gear-b'
                                    },
                                    on: {
                                        click: () => {
                                            this.editMod(params.row)
                                        }
                                    }
                                }),
                                h('Button', {
                                    props: {
                                        type: 'dashed',
                                        icon: 'trash-b'
                                    },
                                    on: {
                                        click: () => {
                                            this.openedMod = params.row._id
                                            this.edit.delete = true
                                        }
                                    }
                                })
                            ]
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
                                formatDateStr(
                                    new Date(params.row.modifiedTime),
                                    'yyyy/MM/dd hh:mm'
                                )
                            )
                        ])
                    }
                }
            ],
            loading: false,
            edit: {
                project: false,
                version: false,
                modlist: false,
                mod: false,
                delete: false
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
        user() {
            return this.$store.state.user
        }
    },
    mounted() {
        this.loadProjectList()
        this.loadFileList()
    },
    methods: {
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
                this.openedProject = id
                this.versionList = []
                this.modList = []
                this.loadVersionList(id)
                this.edit = {
                    project: false,
                    version: false,
                    modlist: false,
                    mod: false,
                    delete: false
                }
            }
        },
        openVersion(version) {
            if (version) {
                this.openedVersion = version
                this.edit = {
                    project: false,
                    version: false,
                    modlist: false,
                    mod: false,
                    delete: false
                }
            }
        },
        showModList() {
            this.edit.modlist = true
            this.modList = []
            this.loadModList(this.openedVersion._id)
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
                            this.openVersion(this.versionList[0])
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
                                this.$Message.success('添加成功')
                                this.$refs['prjForm'].resetFields()
                                this.edit.project = false
                            }
                        })
                        .catch(err => {
                            console.dir(err)
                            this.$Message.error(err.message || '添加失败')
                        })
                        .finally(() => {
                            this.loading = false
                            if (!this.edit.project) {
                                this.loadProjectList()
                            }
                        })
                }
            })
        },
        addProject() {
            this.edit = {
                project: true,
                version: false,
                modlist: false,
                mod: false,
                delete: false
            }
        },
        saveVersion() {
            this.$refs['verForm'].validate(valid => {
                if (valid) {
                    const p = {
                        ...this.versionForm
                    }
                    this.loading = true
                    const act = p._id ? updateVersion : saveVersion
                    act(p)
                        .then(({ data }) => {
                            if (data) {
                                this.$Message.success('操作成功')
                                this.$refs['verForm'].resetFields()
                                this.edit.version = false
                            }
                        })
                        .catch(err => {
                            console.dir(err)
                            this.$Message.error(err.message || '操作失败')
                        })
                        .finally(() => {
                            this.loading = false
                            if (!this.edit.version) {
                                this.loadVersionList(this.openedProject)
                            }
                        })
                }
            })
        },
        addVersion() {
            this.edit.version = true
            this.versionForm._id = undefined
            this.versionForm.name = ''
            this.versionForm.desc = ''
            this.versionForm.projectId = this.openedProject
        },
        editVersion(version) {
            this.edit.version = true
            this.versionForm._id = version._id
            this.versionForm.name = version.name
            this.versionForm.desc = version.desc
            this.versionForm.projectId = undefined
        },
        saveMod() {
            this.$refs['modForm'].validate(valid => {
                if (valid) {
                    const p = {
                        ...this.modForm
                    }
                    this.loading = true
                    const act = p._id ? updateMod : saveMod
                    act(p)
                        .then(({ data }) => {
                            if (data) {
                                this.$Message.success('操作成功')
                                this.$refs['modForm'].resetFields()
                                this.edit.mod = false
                            }
                        })
                        .catch(err => {
                            console.dir(err)
                            this.$Message.error(err.message || '操作失败')
                        })
                        .finally(() => {
                            this.loading = false
                            if (!this.edit.mod) {
                                this.loadModList(this.openedVersion._id)
                            }
                        })
                }
            })
        },
        addMod() {
            this.edit.mod = true
            this.modForm._id = undefined
            this.modForm.name = ''
            this.modForm.desc = ''
            this.modForm.url = []
            this.modForm.versionId = this.openedVersion._id
        },
        editMod(mod) {
            this.edit.mod = true
            this.modForm._id = mod._id
            this.modForm.name = mod.name
            this.modForm.desc = mod.desc
            this.modForm.url = mod.url
            this.modForm.versionId = undefined
        },
        removeMod() {
            this.loading = true
            deleteMod(this.openedMod)
                .then(({ data }) => {
                    this.$Message.success('删除成功')
                    this.edit.delete = false
                    this.openedMod = null
                })
                .catch(err => {
                    console.dir(err)
                    this.$Message.error(err.message || '删除失败')
                })
                .finally(() => {
                    this.loading = false
                    if (!this.edit.delete) {
                        this.loadModList(this.openedVersion._id)
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
    overflow: hidden;
    .wrapper {
        position: relative;
        padding: 10px;
        margin: 10px 20px;
        border-bottom: 1px dashed #d2d3d2;
        &:last-child {
            border: none;
        }
        &.timeline-container {
            position: absolute;
            top: 54px;
            left: 0;
            bottom: 0;
            right: 0;
        }
        .timeline-col {
            position: absolute;
            top: 10px;
            bottom: 0;
            left: 10px;
            width: 180px;
            overflow-y: auto;
            overflow-x: hidden;
            border-right: 1px dashed #d2d3d2;
        }
        .detail-col {
            margin-left: 190px;
            .detail-title {
                padding: 10px;
                border-bottom: 1px dashed #d2d3d2;
                margin-bottom: 10px;
                &-text {
                    font-size: 14px;
                    vertical-align: middle;
                }
                button {
                    // float: right;
                    margin-left: 10px;
                }
            }
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
    .panel-left {
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
    .form {
        padding: 30px;
    }
    .panel-center {
        position: absolute;
        top: 10px;
        right: 10px;
        bottom: 10px;
        left: 200px;
        background: white;
        border-radius: 3px;
        box-shadow: 2px 2px 10px 2px rgba(0, 0, 0, 0.1);
        overflow: auto;
    }
    .panel-right {
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
</style>