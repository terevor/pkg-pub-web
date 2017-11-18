<template>
    <Menu ref="sideMenu" :active-name="$route.name" :open-names="opened" :theme="theme" width="auto" @on-select="changeMenu">
        <template v-for="item in menuList">
            <MenuItem v-if="!item.children" :name="item.name" :key="item.name" class="menu-item">
            <Icon :type="item.icon" :size="iconSize" :key="`icon-${item.name}`"></Icon>
            {{ item.title }}
            </MenuItem>

            <Submenu v-if="item.children" :name="item.name" :key="item.name">
                <template slot="title">
                    <Icon :type="item.icon" :size="iconSize"></Icon>
                    {{ item.title }}
                </template>
                <template v-for="child in item.children">
                    <MenuItem :name="child.name" :key="child.name">
                    <Icon :type="child.icon" :size="iconSize" :key="`icon-${child.name}`"></Icon>
                    {{ child.title }}
                    </MenuItem>
                </template>
            </Submenu>
        </template>
    </Menu>
</template>

<script>
import { mapState } from 'vuex'

export default {
    props: {
        menuList: {
            type: Array,
            default: () => []
        },
        iconSize: {
            type: Number,
            default: 14
        }
    },
    computed: mapState({
        opened: state => state.layout.sidebar.opened,
        theme: state => state.layout.sidebar.menuTheme
    }),
    methods: {
        changeMenu(active) {
            this.$router.push({
                name: active
            })
        }
    },
    updated() {
        this.$nextTick(() => {
            if (this.$refs.sideMenu) {
                this.$refs.sideMenu.updateOpened()
            }
        })
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.menu-item {
    width: 200px;
}
</style>