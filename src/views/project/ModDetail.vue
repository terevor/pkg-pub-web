<template>
    <div class="mod-detail">
        <p>发布人: {{row.creator}}</p>
        <p>安装包位置: {{url}}</p>
        <p>功能描述:</p>
        <p>
            <Input class="my-textarea" v-model="row.desc" type="textarea" :autosize="{ minRows: 3, maxRows: 10 }" readonly></Input>
        </p>
    </div>
</template>
<script>
export default {
    props: {
        row: Object
    },
    computed: {
        url() {
            const url = this.row.url
            if (!url || url.length !== 2) {
                return '未指定'
            }
            return `/${url[0]}/${url[1]}`
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss">
.mod-detail {
    p {
        padding: 5px 0;
    }
}
</style>
