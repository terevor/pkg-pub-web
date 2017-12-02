<template>
    <Card class="portlet-box" :bordered="false">
        <div slot="title" class="portlet-title" :class="titleClass">
            <Icon :type="icon"></Icon> {{title}}
        </div>
        <div class="portlet-body">
            <slot></slot>
        </div>
    </Card>
</template>

<script>
export default {
    name: 'portlet',
    props: {
        title: {
            type: String,
            default: ''
        },
        titleClass: {
            type: String,
            default: ''
        },
        icon: {
            type: String,
            default: ''
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.portlet-box {
    margin: 15px 5px;
    .portlet-title {
        font-size: 1.2em;
        color: #666;
    }
}
</style>
