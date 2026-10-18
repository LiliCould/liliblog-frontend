import request from '~/utils/request'
import type { ApiResponse, PageResult } from '~/types'
import type { AdminAuditLog, AdminAuditLogQuery } from '~/types/admin'

export function getAdminAuditLogs(params: AdminAuditLogQuery): Promise<ApiResponse<PageResult<AdminAuditLog>>> {
  return request.get('/api/admin/auditLog', { params }) as unknown as Promise<ApiResponse<PageResult<AdminAuditLog>>>
}

export function deleteAdminAuditLog(id: number): Promise<ApiResponse<null>> {
  return request.delete(`/api/admin/auditLog/${id}`) as unknown as Promise<ApiResponse<null>>
}

export function batchDeleteAdminAuditLogs(ids: number[]): Promise<ApiResponse<null>> {
  return request.delete('/api/admin/auditLog', { data: ids }) as unknown as Promise<ApiResponse<null>>
}
