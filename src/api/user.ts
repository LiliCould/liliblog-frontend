import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { User, UserUpdateDTO } from '@/types/user'

export function getCurrentUser() {
    return request.get<ApiResponse<User>>('/api/user/me')
}

export function getUserById(id: number) {
    return request.get<ApiResponse<User>>(`/api/user/${id}`)
}

export function updateUser(data: UserUpdateDTO) {
    return request.put<ApiResponse<null>>('/api/user', data)
}
