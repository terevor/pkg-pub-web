export default {
    data() {
        return {
            page: {
                current: 1,
                size: 10,
                total: 0,
                sizes: [10, 30, 50, 100],
                layout: 'prev, pager, next, jumper, ->, total, sizes' // for element-ui only
            }
        }
    },
    // 如果vue里的分页查询方法不叫handleSearch，那就自己在页面上override handlePageSizeChange/handlePageCurrentChange方法，
    // 或者自己定义方法，绑定到pagination组件的相应的change事件上
    methods: {
        handlePageSizeChange(val) {
            this.page.size = val
            this.page.current = 1
            if (typeof this.handleSearch === 'function') this.handleSearch()
        },
        handlePageCurrentChange(val) {
            this.page.current = val
            if (typeof this.handleSearch === 'function') this.handleSearch()
        }
    }
}
