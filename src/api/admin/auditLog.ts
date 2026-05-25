import request from '@/utils/request'
import type { ApiResponse } from '@/types/api'
import type { PageResult } from '@/types/common'
import type { AdminAuditLog, AdminAuditLogQuery } from '@/types/admin'

export function getAdminAuditLogs(params: AdminAuditLogQuery) {
    return request.get<ApiResponse<PageResult<AdminAuditLog>>>('/api/admin/auditLog', { params })
}

export function deleteAdminAuditLog(id: number) {
    return request.delete<ApiResponse<null>>(`/api/admin/auditLog/${id}`)
}

export function batchDeleteAdminAuditLogs(ids: number[]) {
    return request.delete<ApiResponse<null>>('/api/admin/auditLog', { data: ids })
}
