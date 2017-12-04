<template>
    <div>
        <v-portlet title="条件过滤" icon="search">
            <Form inline>
                <FormItem>
                    <Input type="text" v-model="query.name" placeholder="姓名">
                    </Input>
                </FormItem>
                <FormItem>
                    <Button type="primary" @click="handleSearch" :loading="loading">查询</Button>
                </FormItem>
            </Form>
        </v-portlet>
        <v-portlet title="用户列表" icon="ios-list">
            <Table ref="userList" :columns="columns" :data="userList" :loading="loading"></Table>
            <Page :total="page.total" :current="page.current" :page-size="page.size" :page-size-opts="page.sizes" @on-change="handlePageCurrentChange" @on-page-size-change="handlePageSizeChange" size="small" placement="top" show-elevator show-sizer show-total></Page>
        </v-portlet>
    </div>
</template>

<script>
import { pagination } from '@/mixins'
import { formatDateStr } from '@/filters'
import { fetchUserList } from '@/services/auth'
export default {
    name: 'user',
    mixins: [pagination],
    data() {
        return {
            query: {
                name: ''
            },
            userList: [],
            loading: false,
            columns: [
                {
                    title: '邮箱',
                    key: 'email',
                    ellipsis: true
                },
                {
                    title: '姓名',
                    key: 'name',
                    ellipsis: true,
                    sortable: true
                },
                {
                    title: '注册时间',
                    key: 'createTime',
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
                                    new Date(params.row.createTime),
                                    'yyyy/MM/dd hh:mm'
                                )
                            )
                        ])
                    }
                }
            ]
        }
    },
    mounted() {
        this.handleSearch()
    },
    methods: {
        handleSearch() {
            this.loading = true
            fetchUserList({
                ...this.query,
                page: this.page.current,
                limit: this.page.size
            })
                .then(({ data }) => {
                    this.userList = data.list
                    this.page.total = data.total
                })
                .catch(err => {
                    console.dir(err)
                    this.$Message.error(err.message || '查询失败，请稍后再试')
                })
                .finally(() => {
                    this.loading = false
                })
        }
    }
}
</script>

<style scoped>

</style>
