<template>
    <div>
        <template v-for="(item, index) in menuList">
            <div class="center" :key="index">
                <Dropdown transfer v-if="item.children" placement="right-start" :key="index" @on-click="changeMenu">
                    <Button class="dd-btn" type="text">
                        <Icon :size="20" :color="iconColor" :type="item.icon"></Icon>
                    </Button>
                    <DropdownMenu class="dd-menu" slot="list">
                        <template v-for="(child, i) in item.children">
                            <DropdownItem :name="child.name" :key="i">
                                <Icon :type="child.icon"></Icon>
                                <span class="dd-text">{{ child.title }}</span>
                            </DropdownItem>
                        </template>
                    </DropdownMenu>
                </Dropdown>
                <Dropdown transfer v-else placement="right-start" :key="index" @on-click="changeMenu">
                    <Button @click="changeMenu(item.name)" class="dd-btn" type="text">
                        <Icon :size="20" :color="iconColor" :type="item.icon"></Icon>
                    </Button>
                    <DropdownMenu class="dd-menu" slot="list">
                        <DropdownItem :name="item.name">
                            <Icon :type="item.icon"></Icon>
                            <span class="dd-text">{{ item.title }}</span>
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </template>
    </div>
</template>

<script>
export default {
    props: {
        menuList: {
            type: Array,
            default: () => []
        },
        iconColor: {
            type: String,
            default: '#fff'
        }
    },
    methods: {
        changeMenu(active) {
            this.$router.push({
                name: active
            })
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.center {
    text-align: center;
}
.dd-btn {
    width: 70px;
    margin-left: -5px;
    padding: 10px 0;
}
.dd-menu {
    width: 200px;
}
.dd-text {
    padding-left: 10px;
}
</style>
