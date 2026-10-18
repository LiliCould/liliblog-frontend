import request from '~/utils/request'
import type { ApiResponse, LoginByEmailDTO, LoginByPwdDTO, LoginVO, RegisterDTO } from '~/types'

export function loginByPwd(data: LoginByPwdDTO): Promise<ApiResponse<LoginVO>> {
  return request.post('/auth/login/pwd', data) as unknown as Promise<ApiResponse<LoginVO>>
}

export function loginByEmail(data: LoginByEmailDTO): Promise<ApiResponse<LoginVO>> {
  return request.post('/auth/login/email', data) as unknown as Promise<ApiResponse<LoginVO>>
}

export function register(data: RegisterDTO): Promise<ApiResponse<null>> {
  return request.post('/auth/register', data) as unknown as Promise<ApiResponse<null>>
}

export function logout(): Promise<ApiResponse<null>> {
  return request.post('/auth/logout') as unknown as Promise<ApiResponse<null>>
}

export function getCaptcha(email: string): Promise<ApiResponse<null>> {
  return request.get('/auth/login/email/code', { params: { email } }) as unknown as Promise<ApiResponse<null>>
}
