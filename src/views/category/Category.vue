<template>
    <div class="category-main">
        <div class="category-list">
            <div v-for="(category, index) in categoryList" :key="index">
                <Button @click="openOne(category.file)" size="large" long type="text">
                    <transition name="current-category">
                        <Icon v-show="opendCategory === category.file" type="checkmark"></Icon>
                    </transition>
                    <span class="category-name">{{ category.file }}</span>
                </Button>
            </div>
        </div>
        <div class="category-content">
            <div class="category-item-list">
                <Table ref="itemList" :columns="columns" :data="itemList" :no-data-text="'暂无文件'" :loading="loading" :height="height"></Table>
            </div>
        </div>
        <form ref="hiddenform" target="_blank">
            <input type="hidden" name="filename" ref="form_filename">
            <input type="hidden" name="dir" ref="form_dir">
            <input type="hidden" name="token" v-model="$store.state.user.token">
        </form>
    </div>
</template>

<script>
import { fetchCategoryList } from '@/services/category'
import { formatDateStr } from '@/filters'
import { debounce } from '@/services/util'
let autoResize
export default {
    name: 'category',
    data() {
        return {
            categoryList: [],
            itemList: [],
            opendCategory: '',
            columns: [
                // {
                //     type: 'selection',
                //     width: 50,
                //     align: 'center'
                // },
                {
                    title: '文件名',
                    key: 'file',
                    align: 'left',
                    ellipsis: true,
                    sortable: true,
                    render: (h, params) => {
                        return h(
                            'a',
                            {
                                on: {
                                    click: () => {
                                        this.download(params.row.file)
                                    }
                                }
                            },
                            params.row.file
                        )
                    }
                },
                {
                    title: ' ',
                    key: 'time',
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
                                    new Date(params.row.time),
                                    'yyyy/MM/dd hh:mm'
                                )
                            )
                        ])
                    }
                }
            ],
            loading: false,
            height: 200
        }
    },
    mounted() {
        this.loadCategoryList()
        autoResize = debounce(() => {
            this.height = window.innerHeight - 140
        }, 500)
        window.addEventListener('resize', autoResize, false)
        autoResize()
    },
    destroyed() {
        window.removeEventListener('resize', autoResize, false)
    },
    methods: {
        openOne(dir) {
            if (dir) {
                this.opendCategory = dir
                this.refreshItemList(dir)
            }
        },
        async loadCategoryList() {
            this.loading = true
            try {
                const { data } = await fetchCategoryList({
                    type: 'dir'
                })
                this.categoryList = data.files
                this.$nextTick(() => {
                    this.openOne(this.categoryList[0].file)
                })
            } catch (err) {
                console.dir(err)
                this.$Message.error(err.message || '查询失败，请稍后再试')
            }
            this.loading = false
        },
        async refreshItemList(dir) {
            this.loading = true
            try {
                const { data } = await fetchCategoryList({
                    type: 'file',
                    dir
                })
                this.itemList = data.files
            } catch (err) {
                console.dir(err)
                this.$Message.error(err.message || '查询失败，请稍后再试')
            }
            this.loading = false
        },
        download(file) {
            const $form = this.$refs['hiddenform']
            this.$refs['form_filename'].value = file
            this.$refs['form_dir'].value = this.opendCategory
            $form.action = '/api/pkg/download'
            $form.method = 'GET'
            $form.submit()
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.category {
    &-main {
        position: absolute;
        left: 0px;
        top: 0px;
        right: 0px;
        bottom: 0px;
    }
    &-list {
        position: absolute;
        left: 0;
        top: 10px;
        width: 300px;
        bottom: 0;
        padding: 10px 0;
        overflow: auto;
        div {
            padding: 10px;
            margin: 0 20px;
            border-bottom: 1px dashed #d2d3d2;
            &:last-child {
                border: none;
            }
            .category-count-badge-outer {
                float: right;
            }
            .category-count-badge {
                background: #d2d3d2;
            }
            &:first-child .category-count-badge {
                background: #ed3f14;
            }
            .category-name {
                margin-left: 10px;
            }
        }
    }
    &-content {
        position: absolute;
        top: 10px;
        right: 10px;
        bottom: 10px;
        left: 300px;
        background: white;
        border-radius: 3px;
        box-shadow: 2px 2px 10px 2px rgba(0, 0, 0, 0.1);
        overflow: auto;
        .category-item-list {
            width: 100%;
            height: 100%;
            padding: 10px;
        }
    }
}

.current-category-enter,
.current-category-leave-to {
    opacity: 0;
    width: 0;
}
.current-category-enter-active,
.current-category-leave-active {
    transition: all 0.3s;
}
.current-category-enter-to,
.current-category-leave {
    opacity: 1;
    width: 12px;
}
</style>