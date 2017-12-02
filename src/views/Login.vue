<template>
    <div class="login" v-waves @keydown.enter="handleSubmit">
        <div class="login-con" v-show="mode === 'login'">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎登录
                </p>
                <div class="form-con">
                    <Form ref="loginForm" :model="form" :rules="rules">
                        <FormItem prop="email">
                            <Input v-model="form.email" placeholder="请输入email账号">
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
                            <Button @click="handleLogin" type="primary" long :loading="loading">登录</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">还没有账号？去
                        <a @click.prevent="mode = 'reg'">注册</a>
                    </p>
                </div>
            </Card>
        </div>
        <div class="login-con" v-show="mode === 'reg'">
            <Card :bordered="false">
                <p slot="title">
                    <Icon type="log-in"></Icon>
                    欢迎注册
                </p>
                <div class="form-con">
                    <Form ref="regForm" :model="regForm" :rules="rules">
                        <FormItem prop="email">
                            <Input v-model="regForm.email" placeholder="请输入email作为账号">
                            <span slot="prepend">
                                <Icon :size="16" type="email"></Icon>
                            </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="name">
                            <Input v-model="regForm.name" placeholder="请输入姓名">
                            <span slot="prepend">
                                <Icon :size="16" type="person"></Icon>
                            </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password">
                            <Input type="password" v-model="regForm.password" placeholder="请输入密码">
                            <span slot="prepend">
                                <Icon :size="14" type="locked"></Icon>
                            </span>
                            </Input>
                        </FormItem>
                        <FormItem prop="password2">
                            <Input type="password" v-model="regForm.password2" placeholder="再次确认密码">
                            <span slot="prepend">
                                <Icon :size="14" type="locked"></Icon>
                            </span>
                            </Input>
                        </FormItem>
                        <FormItem>
                            <Button @click="handleRegister" type="primary" long :loading="loading">提交</Button>
                        </FormItem>
                    </Form>
                    <p class="login-tip">已有账号，去
                        <a @click.prevent="mode = 'login'">登录</a>
                    </p>
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
import { submitLogin, submitRegister } from '@/services/auth'
import md5 from 'blueimp-md5'

Vue.directive('waves', waves)

export default {
    data() {
        return {
            mode: 'login',
            loading: false,
            form: {
                email: 'xx@xx.xx',
                password: '11111111_'
            },
            regForm: {
                name: '',
                email: '',
                password: '',
                password2: ''
            },
            rules: {
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                    {
                        pattern: /((?=.*\d)(?=.*\D)|(?=.*[a-zA-Z])(?=.*[^a-zA-Z]))^.{8,16}$/,
                        message: '数字、字母、特殊符号至少包含两种，长度8~16位',
                        trigger: 'blur'
                    }
                ],
                password2: [
                    { required: true, message: '请再次输入新密码', trigger: 'blur' },
                    {
                        validator: (rule, value, callback) => {
                            if (value !== this.regForm.password) {
                                callback(new Error('两次输入的密码不一致'))
                            } else {
                                callback()
                            }
                        },
                        trigger: 'blur'
                    }
                ],
                name: [
                    { required: true, message: '姓名不能为空', trigger: 'blur' }
                ],
                email: [
                    {
                        required: true,
                        message: 'email账号不能为空',
                        trigger: 'blur'
                    },
                    {
                        type: 'email',
                        message: 'email格式不对',
                        trigger: 'blur'
                    }
                ]
            }
        }
    },
    methods: {
        ...mapActions([USER_SIGNIN, INIT_SIDEBAR_MENUS]),
        handleSubmit() {
            if (this.mode === 'login') this.handleLogin()
            else this.handleRegister()
        },
        handleLogin() {
            this.$refs.loginForm.validate(valid => {
                if (valid) {
                    const list = [
                        {
                            name: 'project',
                            title: '项目',
                            icon: 'cube'
                        },
                        {
                            name: 'category',
                            title: '安装包',
                            icon: 'network'
                        },
                        {
                            name: 'settings',
                            title: '系统配置',
                            icon: 'settings',
                            children: [
                                {
                                    name: 'user',
                                    title: '用户',
                                    icon: 'person'
                                },
                                {
                                    name: 'group',
                                    title: '项目组',
                                    icon: 'gear-a'
                                }
                            ]
                        }
                    ]
                    this.INIT_SIDEBAR_MENUS(list)
                    const p = {
                        email: this.form.email,
                        password: md5(this.form.password)
                    }
                    this.loading = true
                    submitLogin(p)
                        .then(({ data }) => {
                            if (data) {
                                this.USER_SIGNIN(data)
                                this.$router.push({
                                    name: 'home'
                                })
                            } else {
                                this.$Message.error('请输入正确的账号')
                            }
                        })
                        .catch(err => {
                            console.dir(err)
                            this.$Message.error(err.message || '登录失败')
                        })
                        .finally(() => {
                            this.loading = false
                        })
                }
            })
        },
        handleRegister() {
            this.$refs.regForm.validate(valid => {
                if (valid) {
                    const p = {
                        name: this.regForm.name,
                        email: this.regForm.email,
                        password: md5(this.regForm.password)
                    }
                    this.loading = true
                    submitRegister(p)
                        .then(({ data }) => {
                            if (data) {
                                this.$refs.regForm.resetFields()
                                this.$Message.success({
                                    content: '注册成功',
                                    onClose: () => {
                                        this.form.email = data.email
                                        this.mode = 'login'
                                    }
                                })
                            }
                        })
                        .catch(err => {
                            console.dir(err)
                            this.$Message.error(err.message || '注册失败')
                        })
                        .finally(() => {
                            this.loading = false
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
