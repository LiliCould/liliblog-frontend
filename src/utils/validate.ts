import type { FormItemRule } from 'element-plus'

export const usernameRules: FormItemRule[] = [
    { required: true, message: '请输入用户名', trigger: 'blur' },
    { min: 3, max: 20, message: '用户名长度为 3-20 个字符', trigger: 'blur' },
]

export const passwordRules: FormItemRule[] = [
    { required: true, message: '请输入密码', trigger: 'blur' },
    { min: 6, max: 20, message: '密码长度为 6-20 个字符', trigger: 'blur' },
]

export const emailRules: FormItemRule[] = [
    { required: true, message: '请输入邮箱', trigger: 'blur' },
    { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' },
]

export const nicknameRules: FormItemRule[] = [
    { required: true, message: '请输入昵称', trigger: 'blur' },
    { min: 1, max: 20, message: '昵称长度为 1-20 个字符', trigger: 'blur' },
]

export const titleRules: FormItemRule[] = [
    { required: true, message: '请输入标题', trigger: 'blur' },
    { min: 1, max: 100, message: '标题长度不能超过 100 个字符', trigger: 'blur' },
]
