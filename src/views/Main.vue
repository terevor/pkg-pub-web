<template>
    <div class="main" :class="{ 'main-hide-text': layout.sidebar.toggle }">
        <div class="sidebar-menu-con" :style="menuStyles">
            <div class="logo-con">
                <img v-show="!layout.sidebar.toggle" src="../assets/images/logo-mini.png" key="max-logo" />
                <img v-show="layout.sidebar.toggle" src="../assets/images/logo-mini.png" key="min-logo" class="logo-mini" />
            </div>
            <sidebar-menu v-if="!layout.sidebar.toggle" :menuList="layout.sidebar.menus" :iconSize="14" />
            <sidebar-menu-shrink :icon-color="iconColor" v-else :menuList="layout.sidebar.menus" />
        </div>
        <div class="main-header-con" :style="{ paddingLeft: layout.sidebar.toggle ? '60px' : '200px' }">
            <div class="main-header">
                <div class="navicon-con">
                    <Button :style="{ transform: `rotateZ(${this.layout.sidebar.toggle ? '-90' : '0'}deg)` }" type="text" @click="toggleClick">
                        <Icon type="navicon" size="32"></Icon>
                    </Button>
                </div>
                <div class="header-middle-con">
                    <div class="main-breadcrumb">
                        <breadcrumb-nav></breadcrumb-nav>
                    </div>
                </div>
                <div class="header-theme-con">
                    <i-switch v-model="themeSwitch" @on-change="changeTheme" size="large" class="header-theme-switch" :disabled="changing">
                        <span slot="open">light</span>
                        <span slot="close">dark</span>
                    </i-switch>
                </div>
                <div class="header-avatar-con">
                    <div class="user-dropdown-menu-con">
                        <Row type="flex" justify="end" align="middle" class="user-dropdown-innercon">
                            <Dropdown transfer trigger="click" @on-click="handleDropdown">
                                <a href="javascript:void(0)">
                                    <span class="main-user-name">{{ user.name }}</span>
                                    <Icon type="arrow-down-b"></Icon>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="profile">个人中心</DropdownItem>
                                    <DropdownItem name="logout" divided>退出登录</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Avatar :src="defaultAvatar" style="background: #619fe7; margin-left: 10px;"></Avatar>
                        </Row>
                    </div>
                </div>
            </div>
            <div class="tags-con">
                <tags-page-opened :pageTagsList="layout.tags"></tags-page-opened>
            </div>
        </div>
        <div class="single-page-con" :style="{ left: layout.sidebar.toggle ? '60px' : '200px' }">
            <div class="single-page">
                <transition name="fade" mode="out-in">
                    <keep-alive :include="cachePage">
                        <router-view></router-view>
                    </keep-alive>
                </transition>
            </div>
        </div>
    </div>
</template>
<script>
import sidebarMenu from './layout/SidebarMenu.vue'
import sidebarMenuShrink from './layout/SidebarMenuShrink.vue'
import breadcrumbNav from './layout/BreadcrumbNav.vue'
import tagsPageOpened from './layout/TagsPageOpened.vue'
import { mapState, mapActions } from 'vuex'
import {
    TOGGLE_SIDEBAR,
    SWITCH_THEME,
    UPDATE_OPENED_MENUS,
    UPDATE_TAGS,
    RESET_LAYOUT
} from '@/store/modules/layout'
import { USER_SIGNOUT } from '@/store/modules/user'
import avatar from '@/assets/images/avatar.png'

export default {
    components: {
        sidebarMenu,
        sidebarMenuShrink,
        breadcrumbNav,
        tagsPageOpened
    },
    data() {
        return {
            themeSwitch: true,
            changing: false
        }
    },
    computed: {
        ...mapState({
            env: state => state.env,
            user: state => state.user,
            layout: state => state.layout
        }),
        cachePage() {
            return this.layout.tags.map(t => t.name)
        },
        defaultAvatar() {
            return this.user.picUrl && this.env.ossUrl
                ? `${this.env.ossUrl}${this.user.picUrl}?_=${+new Date()}`
                : avatar
        },
        iconColor() {
            return this.layout.sidebar.menuTheme === 'dark' ? '#fff' : '#495060'
        },
        menuStyles() {
            return {
                width: this.layout.sidebar.toggle ? '60px' : '200px',
                overflow: this.layout.sidebar.toggle ? 'visible' : 'auto',
                background:
                    this.layout.sidebar.menuTheme === 'dark'
                        ? '#495060'
                        : '#fff'
            }
        }
    },
    mounted() {
        this.UPDATE_TAGS({
            name: 'home',
            title: '首页'
        })
        this.themeSwitch = this.layout.sidebar.menuTheme === 'light'
    },
    methods: {
        ...mapActions([
            TOGGLE_SIDEBAR,
            SWITCH_THEME,
            UPDATE_OPENED_MENUS,
            UPDATE_TAGS,
            USER_SIGNOUT,
            RESET_LAYOUT
        ]),
        toggleClick() {
            this.TOGGLE_SIDEBAR()
        },
        changeTheme() {
            this.changing = true
            this.SWITCH_THEME()
            setTimeout(() => {
                this.changing = false
            }, 500)
        },
        handleDropdown(name) {
            if (name === 'profile') {
                this.$router.push({
                    name: 'profile'
                })
            } else if (name === 'logout') {
                this.USER_SIGNOUT()
                this.RESET_LAYOUT()
                this.$router.push({
                    name: 'login'
                })
            }
        }
    },
    watch: {
        $route(to) {
            this.UPDATE_OPENED_MENUS(to.name)
            this.UPDATE_TAGS({
                name: to.name,
                title: to.meta.title,
                query: to.query,
                params: to.params
            })
        }
    }
}
</script>
<style rel="stylesheet/scss" lang="scss" scoped>
.main {
    position: absolute;
    width: 100%;
    height: 100%;
    .sidebar-menu-con {
        height: 100%;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 21;
        transition: width 0.3s;
        .logo-con {
            padding: 8px;
            text-align: center;
            img {
                height: 44px;
                width: auto;
            }
            .logo-mini {
                width: 44px;
            }
        }
    }
    &-header-con {
        box-sizing: border-box;
        position: fixed;
        display: block;
        padding-left: 200px;
        width: 100%;
        height: 100px;
        z-index: 20;
        box-shadow: 0 2px 1px 1px rgba(100, 100, 100, 0.1);
        transition: padding 0.3s;
        .main-header {
            height: 60px;
            background: #fff;
            box-shadow: 0 2px 1px 1px rgba(100, 100, 100, 0.1);
            position: relative;
            z-index: 11;
            .navicon-con {
                margin: 6px;
                display: inline-block;
            }
            .header-middle-con {
                position: absolute;
                left: 60px;
                top: 0;
                right: 340px;
                bottom: 0;
                padding: 10px;
                overflow: hidden;
                .main-breadcrumb {
                    padding: 8px 15px 0;
                }
            }
            .header-theme-con {
                position: absolute;
                right: 150px;
                top: 0;
                height: 100%;
                padding-top: 18px;
                .header-theme-switch:not(.ivu-switch-disabled) {
                    border-color: #2d8cf0;
                    background-color: #2d8cf0;
                }
            }
            .header-avatar-con {
                position: absolute;
                right: 0;
                top: 0;
                height: 100%;
                width: 150px;
                .user-dropdown {
                    &-menu-con {
                        position: absolute;
                        right: 0;
                        top: 0;
                        width: 150px;
                        height: 100%;
                        .main-user-name {
                            display: inline-block;
                            width: 80px;
                            word-break: keep-all;
                            white-space: nowrap;
                            vertical-align: middle;
                            overflow: hidden;
                            text-overflow: ellipsis;
                            text-align: right;
                        }
                    }
                    &-innercon {
                        height: 100%;
                        padding-right: 14px;
                    }
                }
            }
        }
        .tags-con {
            height: 40px;
            z-index: -1;
            overflow: hidden;
            background: #f0f0f0;
        }
    }
    .single-page-con {
        position: absolute;
        top: 100px;
        right: 0;
        bottom: 0;
        overflow: auto;
        background-color: #f0f0f0;
        z-index: 1;
        transition: left 0.3s;
        .single-page {
            margin: 10px;
        }
    }
}
</style>
