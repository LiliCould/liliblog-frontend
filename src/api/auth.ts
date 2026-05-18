import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { LoginByPwdDTO, LoginByEmailDTO, RegisterDTO, LoginVO } from '@/types/auth'

export function loginByPwd(data: LoginByPwdDTO) {
    return request.post<ApiResponse<LoginVO>>('/auth/login/pwd', data)
}

export function loginByEmail(data: LoginByEmailDTO) {
    return request.post<ApiResponse<LoginVO>>('/auth/login/email', data)
}

export function register(data: RegisterDTO) {
    return request.post<ApiResponse<null>>('/auth/register', data)
}

export function refreshToken() {
    return request.post<ApiResponse<{ token: string }>>('/auth/refresh')
}

export function logout() {
    return request.post<ApiResponse<null>>('/auth/logout')
}

export function getCaptcha(email: string) {
    return request.get<ApiResponse<null>>('/auth/captcha', { params: { email } })
}
