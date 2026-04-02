import request from '@/utils/request'
import type { ApiResponse } from '@/types/api.d'
import type { LoginDTO, RegisterDTO, PasswordChangeDTO, LoginVO, UserVO } from '@/types/auth.d'

export function login(data: LoginDTO) {
    return request.post<ApiResponse<LoginVO>>('/api/auth/login', data)
}

export function register(data: RegisterDTO) {
    return request.post<ApiResponse<null>>('/api/auth/register', data)
}

export function changePassword(username: string, data: PasswordChangeDTO) {
    return request.put<ApiResponse<null>>('/api/auth/password', data, {
        params: { username },
    })
}

export function getProfile(username: string) {
    return request.get<ApiResponse<UserVO>>('/api/auth/profile', {
        params: { username },
    })
}

export function logout() {
    return request.post<ApiResponse<null>>('/api/auth/logout')
}
