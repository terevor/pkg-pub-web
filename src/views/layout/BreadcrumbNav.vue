<template>
    <Breadcrumb>
        <BreadcrumbItem v-for="(item, index) in breadcrumbs" :href="item.path" :key="index">{{ item.title }}</BreadcrumbItem>
    </Breadcrumb>
</template>

<script>
import { mapState, mapActions } from 'vuex'
import { INIT_BREADCRUMB } from '@/store/modules/layout'

export default {
    created() {
        this.refreshBreadcrumb()
    },
    computed: mapState({
        breadcrumbs: (state) => state.layout.breadcrumbs
    }),
    methods: {
        ...mapActions([INIT_BREADCRUMB]),
        refreshBreadcrumb() {
            const list = [...this.breadcrumbs]
            let { level, title, parent } = this.$route.meta
            if (level === undefined) { // 首页level=0
                level = 1
            } else if (level === 2 && parent) {
                list.splice(1, 1, {
                    title: parent
                })
            }
            list.splice(level, list.length - level, {
                path: this.$route.path,
                title
            })
            if (list[0].title !== '首页') {
                list.unshift({
                    path: '/home',
                    title: '首页'
                })
            }
            this.INIT_BREADCRUMB(list)
        }
    },
    watch: {
        $route() {
            this.refreshBreadcrumb()
        }
    }
}
</script>
