<template>
    <div class="login" @keydown.enter="handleSubmit" v-waves>
        <div class="login-con">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="account">
                            <Input v-model="form.account" placeholder="请输入用户名">
                            <span slot="prepend">
                                <Icon :size="16" type="person"></Icon>
                            </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="form.password" placeholder="请输入密码">
                            <span slot="prepend">
                                <Icon :size="14" type="locked"></Icon>
                            </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleSubmit" type="primary" long>登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">输入任意用户名和密码</p>
                </div>
            </Card>
        </div>
    </div>
</template>

<script>
import Vue from 'vue'
import waves from '@/directives/waves'
import { mapActions } from 'vuex'
import { USER_SIGNIN } from '@/store/modules/user'
import { INIT_SIDEBAR_MENUS } from '@/store/modules/layout'

Vue.directive('waves', waves)

export default {
    data() {
        return {
            form: {
                account: 'admin',
                password: '123'
            },
            rules: {
                account: [
                    { required: true, message: '账号不能为空', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' }
                ]
            }
        }
    },
    methods: {
        ...mapActions([USER_SIGNIN, INIT_SIDEBAR_MENUS]),
        handleSubmit() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    const list = [
                        {
                            name: 'category',
                            title: '版本目录',
                            icon: 'network'
                        },
                        {
                            name: 'settings',
                            title: '系统配置',
                            icon: 'settings',
                            children: [
                                {
                                    name: 'settings_user',
                                    title: '用户',
                                    icon: 'person'
                                },
                                {
                                    name: 'settings_group',
                                    title: '项目组',
                                    icon: 'gear-a'
                                }
                            ]
                        }
                    ]
                    this.INIT_SIDEBAR_MENUS(list)
                    this.USER_SIGNIN({
                        account: this.form.account
                    })
                    this.$router.push({
                        name: 'home'
                    })
                }
            })
        }
    }
}
</script>

<style rel="stylesheet/scss" lang="scss" scoped>
.login {
    width: 100%;
    height: 100%;
    position: relative;
    &-con {
        position: absolute;
        right: 160px;
        top: 50%;
        transform: translateY(-60%);
        width: 300px;
        .form-con {
            padding: 10px 0 0;
        }
        .login-tip {
            font-size: 10px;
            text-align: center;
            color: #c3c3c3;
        }
    }
}
</style>
