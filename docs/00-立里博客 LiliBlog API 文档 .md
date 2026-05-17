# 立里博客 LiliBlog API 文档

## 说明

### url地址说明

开发环境地址为：http://localhost:8080

生产环境地址为：https://api.lilicould.cn

### 认证机制说明

本程序采用双令牌机制，访问令牌建议前端存放在LocalStorage以便使用，刷新令牌在登陆时会自动存储到前端的http-only-cookie中，同时会在redis中存储一份，登出时会清除刷新令牌。前端应该注意访问令牌的失效，及时利用刷新令牌获取访问令牌，同时如果在请求过程中访问令牌以及过期并报错，前端应该有容错机制，重新刷新访问令牌并重新请求失败的接口，而不是一直报错，影响用户体验。需要让用户有无感体验。同时要由于刷新令牌不是无限期的，所以前端检测到刷新令牌过期之后也要主动进入到退出状态，并提醒用户登录（理论上不登录大部分接口也可以访问，为了用户的体验，只要让用户知道现在处于非登录状态就可以了）。

## 所有接口

### 标签接口

#### 获取标签列表

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>GET /api/tag</strong></div>

- 这个接口对管理员和普通用户没有区分

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求参数

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| name（查询参数） | string | 否 | 标签名称 | - |
| current（查询参数） | integer | 否 | 当前页码 | 1 |
| size（查询参数） | integer | 否 | 每页数量 | 10 |

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | 分页对象视图标签信息 | 否 | 数据 | - |
| &nbsp;&nbsp;current | integer | 否 | 当前页码 | 1 |
| &nbsp;&nbsp;size | integer | 否 | 每页数量 | 10 |
| &nbsp;&nbsp;totalPage | integer | 否 | 总页数 | - |
| &nbsp;&nbsp;total | integer | 否 | 总记录数 | - |
| &nbsp;&nbsp;hasPrevious | boolean | 否 | 是否有上一页 | - |
| &nbsp;&nbsp;hasNext | boolean | 否 | 是否有下一页 | - |
| &nbsp;&nbsp;records | array<标签信息> | 否 | 数据列表 | - |
| &nbsp;&nbsp;records[] | 标签信息 | 是 | - | - |
| &nbsp;&nbsp;&nbsp;&nbsp;id | integer | 否 | 标签id | - |
| &nbsp;&nbsp;&nbsp;&nbsp;name | string | 否 | 标签名称 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;color | string | 否 | 标签颜色 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "current": 1,
    "size": 10,
    "totalPage": 0,
    "total": 0,
    "hasPrevious": false,
    "hasNext": false,
    "records": [
      {
        "id": 0,
        "name": "string",
        "color": "#666666"
      }
    ]
  },
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 获取指定ID的标签

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>GET /api/tag/{id}</strong></div>

- 这个接口对管理员和普通用户没有区分

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求参数

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| id（路径参数） | integer | 是 | 标签ID | - |

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | 标签信息 | 否 | 数据 | - |
| &nbsp;&nbsp;id | integer | 否 | 标签id | - |
| &nbsp;&nbsp;name | string | 否 | 标签名称 | - |
| &nbsp;&nbsp;color | string | 否 | 标签颜色 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "id": 0,
    "name": "string",
    "color": "#666666"
  },
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 删除标签

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>DELETE /api/tag/{id}</strong></div>

- 需要管理员权限

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求参数

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| id（路径参数） | integer | 是 | 标签ID | - |

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | - | 否 | 数据 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": null,
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 添加标签

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>POST /api/tag</strong></div>

- 需要管理员权限

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求体参数（application/json）

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| name | string | 是 | 标签名称 | 生活 |
| color | string | 是 | 标签颜色,格式为标准CSS十六进制颜色代码 | #000000 |

###### JSON 示例

```json
{
  "name": "生活",
  "color": "#000000"
}
```

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | - | 否 | 数据 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": null,
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 修改标签

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>PUT /api/tag/{id}</strong></div>

- 需要管理员权限

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求参数

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| id（路径参数） | integer | 是 | 标签ID | - |

##### 请求体参数（application/json）

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| name | string | 否 | 标签名称 | 随笔 |
| color | string | 否 | 标签颜色,格式为标准CSS十六进制颜色代码 | #000000 |

###### JSON 示例

```json
{
  "name": "随笔",
  "color": "#000000"
}
```

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | - | 否 | 数据 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": null,
  "time": "2026-01-01T00:00:00Z"
}
```

### 分类接口

---

#### 分页获取分类列表

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>GET /api/category</strong></div>

- 暂无描述

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求参数

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| name（查询参数） | string | 否 | 分类名称 | - |
| slug（查询参数） | string | 否 | 分类别名,精准查询,可以由唯一slug指定单个分类 | the-use-method-of-aop |
| description（查询参数） | string | 否 | 分类描述 | - |
| current（查询参数） | integer | 否 | 当前页码 | 1 |
| size（查询参数） | integer | 否 | 每页数量 | 10 |

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | 分页对象视图分类展示对象 | 否 | 数据 | - |
| &nbsp;&nbsp;current | integer | 否 | 当前页码 | 1 |
| &nbsp;&nbsp;size | integer | 否 | 每页数量 | 10 |
| &nbsp;&nbsp;totalPage | integer | 否 | 总页数 | - |
| &nbsp;&nbsp;total | integer | 否 | 总记录数 | - |
| &nbsp;&nbsp;hasPrevious | boolean | 否 | 是否有上一页 | - |
| &nbsp;&nbsp;hasNext | boolean | 否 | 是否有下一页 | - |
| &nbsp;&nbsp;records | array<分类展示对象> | 否 | 数据列表 | - |
| &nbsp;&nbsp;records[] | 分类展示对象 | 是 | - | - |
| &nbsp;&nbsp;&nbsp;&nbsp;id | integer | 否 | 分类id | - |
| &nbsp;&nbsp;&nbsp;&nbsp;name | string | 否 | 分类名称 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;slug | string | 否 | 分类别名 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;description | string | 否 | 分类描述 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;sortOrder | integer | 否 | 排序字段，约定越小等级越高 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "current": 1,
    "size": 10,
    "totalPage": 0,
    "total": 0,
    "hasPrevious": false,
    "hasNext": false,
    "records": [
      {
        "id": 0,
        "name": "string",
        "slug": "string",
        "description": "string",
        "sortOrder": 1
      }
    ]
  },
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 获取指定ID的分类

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>GET /api/category/{id}</strong></div>

- 暂无描述

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求参数

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| id（路径参数） | integer | 是 | 分类ID | - |

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | 分类展示对象 | 否 | 数据 | - |
| &nbsp;&nbsp;id | integer | 否 | 分类id | - |
| &nbsp;&nbsp;name | string | 否 | 分类名称 | - |
| &nbsp;&nbsp;slug | string | 否 | 分类别名 | - |
| &nbsp;&nbsp;description | string | 否 | 分类描述 | - |
| &nbsp;&nbsp;sortOrder | integer | 否 | 排序字段，约定越小等级越高 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "id": 0,
    "name": "string",
    "slug": "string",
    "description": "string",
    "sortOrder": 1
  },
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 切换分类状态

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>PUT /api/category/{id}/status</strong></div>

- 只有管理员才能切换分类状态

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求参数

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| id（路径参数） | integer | 是 | 分类ID | - |

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | - | 否 | 数据 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": null,
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 删除分类

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>DELETE /api/category/{id}</strong></div>

- 只有管理员才能删除分类

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求参数

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| id（路径参数） | integer | 是 | 分类ID | - |

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | - | 否 | 数据 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": null,
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 添加分类

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>POST /api/category</strong></div>

- 只有管理员才能添加分类

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求体参数（application/json）

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| name | string | 否 | 分类名 | 生活趣事 |
| slug | string | 否 | 分类别名 | life |
| description | string | 否 | 描述 | 分享生活小事 |
| sortOrder | integer | 否 | 排序字段，数值越小优先级越高 | 1 |

###### JSON 示例

```json
{
  "name": "生活趣事",
  "slug": "life",
  "description": "分享生活小事",
  "sortOrder": 1
}
```

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | - | 否 | 数据 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": null,
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 修改分类

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>PUT /api/category/{id}</strong></div>

- 只有管理员才能修改分类

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求参数

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| id（路径参数） | integer | 是 | 分类ID | - |

##### 请求体参数（application/json）

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| name | string | 否 | 分类名 | 生活趣事 |
| slug | string | 否 | 分类别名 | life |
| description | string | 否 | 描述 | 分享生活小事 |
| sortOrder | integer | 否 | 排序字段，数值越小优先级越高 | 1 |

###### JSON 示例

```json
{
  "name": "生活趣事",
  "slug": "life",
  "description": "分享生活小事",
  "sortOrder": 1
}
```

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | - | 否 | 数据 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": null,
  "time": "2026-01-01T00:00:00Z"
}
```

### 评论接口

---

#### 发布评论

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>POST /api/comment</strong></div>

- 暂无描述

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求体参数（application/json）

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| articleId | integer | 是 | 文章ID(不管一二级评论都需要指定) | - |
| content | string | 是 | 评论内容 | - |
| parentId | integer | 否 | 父评论ID,如果是一级评论，则该字段为空或直接给0 | - |
| rootId | integer | 否 | 根评论ID,如果是一级评论，则该字段为空 | - |

###### JSON 示例

```json
{
  "articleId": 0,
  "content": "string",
  "parentId": 0,
  "rootId": 0
}
```

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | - | 否 | 数据 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": null,
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 分页获取评论列表(二级评论)

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>GET /api/comment/child</strong></div>

- 暂无描述

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求参数

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| id（查询参数） | integer | 是 | 如果是查询一级评论，就是文章id,否则是根评论id | - |
| current（查询参数） | integer | 否 | 当前页码 | 1 |
| size（查询参数） | integer | 否 | 每页数量 | 10 |

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | 分页对象视图评论展示对象 | 否 | 数据 | - |
| &nbsp;&nbsp;current | integer | 否 | 当前页码 | 1 |
| &nbsp;&nbsp;size | integer | 否 | 每页数量 | 10 |
| &nbsp;&nbsp;totalPage | integer | 否 | 总页数 | - |
| &nbsp;&nbsp;total | integer | 否 | 总记录数 | - |
| &nbsp;&nbsp;hasPrevious | boolean | 否 | 是否有上一页 | - |
| &nbsp;&nbsp;hasNext | boolean | 否 | 是否有下一页 | - |
| &nbsp;&nbsp;records | array<评论展示对象> | 否 | 数据列表 | - |
| &nbsp;&nbsp;records[] | 评论展示对象 | 是 | - | - |
| &nbsp;&nbsp;&nbsp;&nbsp;id | integer | 否 | 评论ID | - |
| &nbsp;&nbsp;&nbsp;&nbsp;content | string | 否 | 评论内容 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;likeCount | integer | 否 | 点赞数 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;childCount | integer | 否 | 子评论数 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;articleId | integer | 否 | 文章ID | - |
| &nbsp;&nbsp;&nbsp;&nbsp;parentId | integer | 否 | 父评论ID | - |
| &nbsp;&nbsp;&nbsp;&nbsp;ipAddress | string | 否 | 用户ip | - |
| &nbsp;&nbsp;&nbsp;&nbsp;createTime | string | 否 | 状态,0-审核中,1-发布 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;creator | 用户信息 | 否 | 发布者信息 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id | integer | 否 | 用户ID | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;username | string | 否 | 用户名 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nickname | string | 否 | 昵称 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;avatar | string | 否 | 头像URL | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;role | integer | 否 | 角色，0-管理员，1-普通用户 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;status | integer | 否 | 状态，0-禁用，1-启用 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lastLoginTime | string | 否 | 上次登录时间 | 2026-05-09 14:51:06 |
| &nbsp;&nbsp;&nbsp;&nbsp;level | integer | 否 | 评论层级,0-一级评论,1-二级评论 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "current": 1,
    "size": 10,
    "totalPage": 0,
    "total": 0,
    "hasPrevious": false,
    "hasNext": false,
    "records": [
      {
        "id": 0,
        "content": "string",
        "likeCount": 1,
        "childCount": 1,
        "articleId": 0,
        "parentId": 0,
        "ipAddress": "string",
        "createTime": "2026-01-01T00:00:00Z",
        "creator": {
          "id": 0,
          "username": "string",
          "nickname": "string",
          "avatar": "string",
          "role": 1,
          "status": 1,
          "lastLoginTime": "2026-05-09 14:51:06"
        },
        "level": 1
      }
    ]
  },
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 分页获取评论列表(一级评论)

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>GET /api/comment</strong></div>

- 暂无描述

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求参数

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| id（查询参数） | integer | 是 | 如果是查询一级评论，就是文章id,否则是根评论id | - |
| current（查询参数） | integer | 否 | 当前页码 | 1 |
| size（查询参数） | integer | 否 | 每页数量 | 10 |

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | 分页对象视图评论展示对象 | 否 | 数据 | - |
| &nbsp;&nbsp;current | integer | 否 | 当前页码 | 1 |
| &nbsp;&nbsp;size | integer | 否 | 每页数量 | 10 |
| &nbsp;&nbsp;totalPage | integer | 否 | 总页数 | - |
| &nbsp;&nbsp;total | integer | 否 | 总记录数 | - |
| &nbsp;&nbsp;hasPrevious | boolean | 否 | 是否有上一页 | - |
| &nbsp;&nbsp;hasNext | boolean | 否 | 是否有下一页 | - |
| &nbsp;&nbsp;records | array<评论展示对象> | 否 | 数据列表 | - |
| &nbsp;&nbsp;records[] | 评论展示对象 | 是 | - | - |
| &nbsp;&nbsp;&nbsp;&nbsp;id | integer | 否 | 评论ID | - |
| &nbsp;&nbsp;&nbsp;&nbsp;content | string | 否 | 评论内容 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;likeCount | integer | 否 | 点赞数 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;childCount | integer | 否 | 子评论数 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;articleId | integer | 否 | 文章ID | - |
| &nbsp;&nbsp;&nbsp;&nbsp;parentId | integer | 否 | 父评论ID | - |
| &nbsp;&nbsp;&nbsp;&nbsp;ipAddress | string | 否 | 用户ip | - |
| &nbsp;&nbsp;&nbsp;&nbsp;createTime | string | 否 | 状态,0-审核中,1-发布 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;creator | 用户信息 | 否 | 发布者信息 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id | integer | 否 | 用户ID | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;username | string | 否 | 用户名 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nickname | string | 否 | 昵称 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;avatar | string | 否 | 头像URL | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;role | integer | 否 | 角色，0-管理员，1-普通用户 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;status | integer | 否 | 状态，0-禁用，1-启用 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lastLoginTime | string | 否 | 上次登录时间 | 2026-05-09 14:51:06 |
| &nbsp;&nbsp;&nbsp;&nbsp;level | integer | 否 | 评论层级,0-一级评论,1-二级评论 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "current": 1,
    "size": 10,
    "totalPage": 0,
    "total": 0,
    "hasPrevious": false,
    "hasNext": false,
    "records": [
      {
        "id": 0,
        "content": "string",
        "likeCount": 1,
        "childCount": 1,
        "articleId": 0,
        "parentId": 0,
        "ipAddress": "string",
        "createTime": "2026-01-01T00:00:00Z",
        "creator": {
          "id": 0,
          "username": "string",
          "nickname": "string",
          "avatar": "string",
          "role": 1,
          "status": 1,
          "lastLoginTime": "2026-05-09 14:51:06"
        },
        "level": 1
      }
    ]
  },
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 删除评论

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>DELETE /api/comment/{id}</strong></div>

- 删除所评论及其子评论(如果有)

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求参数

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| id（路径参数） | integer | 是 | 评论ID | - |

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | - | 否 | 数据 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": null,
  "time": "2026-01-01T00:00:00Z"
}
```

### 认证接口

---

#### 登出接口

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>POST /auth/logout</strong></div>

- 登出接口
- 登出后会清除refresh_token以及服务端redis的信息（在http-only-cookie中）

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求参数

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| refresh_token（Cookie 参数） | string | 否 | - | - |

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | - | 否 | 数据 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": null,
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 刷新接口

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>POST /auth/refresh</strong></div>

- 使用刷新令牌获取新的token
- 刷新令牌在http-only-cookie中

##### 请求参数

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| refresh_token（Cookie 参数） | string | 否 | - | - |

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | 登录成功结果对象 | 否 | 数据 | - |
| &nbsp;&nbsp;accessToken | string | 否 | 访问令牌 | - |
| &nbsp;&nbsp;expiresIn | integer | 否 | 过期时间 | - |
| &nbsp;&nbsp;userInfo | 用户信息 | 否 | 用户信息 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;id | integer | 否 | 用户ID | - |
| &nbsp;&nbsp;&nbsp;&nbsp;username | string | 否 | 用户名 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;nickname | string | 否 | 昵称 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;avatar | string | 否 | 头像URL | - |
| &nbsp;&nbsp;&nbsp;&nbsp;role | integer | 否 | 角色，0-管理员，1-普通用户 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;status | integer | 否 | 状态，0-禁用，1-启用 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;lastLoginTime | string | 否 | 上次登录时间 | 2026-05-09 14:51:06 |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "accessToken": "string",
    "expiresIn": 0,
    "userInfo": {
      "id": 0,
      "username": "string",
      "nickname": "string",
      "avatar": "string",
      "role": 1,
      "status": 1,
      "lastLoginTime": "2026-05-09 14:51:06"
    }
  },
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 用户名密码登录

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>POST /auth/login/pwd</strong></div>

- 通过用户名和密码登录

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求体参数（application/json）

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| loginType | string | 否(建议不填) | 登录类型：pwd/sms/wechat | - |
| username | string | 是 | 用户名 | lilicould |
| password | string | 是 | 密码 | 123456 |

###### JSON 示例

```json
{
  "loginType": "string",
  "username": "lilicould",
  "password": 123456
}
```

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | 响应成功，登录成功与否看响应状态码 | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | 登录成功结果对象 | 否 | 数据 | - |
| &nbsp;&nbsp;accessToken | string | 否 | 访问令牌 | - |
| &nbsp;&nbsp;expiresIn | integer | 否 | 过期时间 | - |
| &nbsp;&nbsp;userInfo | 用户信息 | 否 | 用户信息 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;id | integer | 否 | 用户ID | - |
| &nbsp;&nbsp;&nbsp;&nbsp;username | string | 否 | 用户名 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;nickname | string | 否 | 昵称 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;avatar | string | 否 | 头像URL | - |
| &nbsp;&nbsp;&nbsp;&nbsp;role | integer | 否 | 角色，0-管理员，1-普通用户 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;status | integer | 否 | 状态，0-禁用，1-启用 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;lastLoginTime | string | 否 | 上次登录时间 | 2026-05-09 14:51:06 |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - 响应成功，登录成功与否看响应状态码）

```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "accessToken": "string",
    "expiresIn": 0,
    "userInfo": {
      "id": 0,
      "username": "string",
      "nickname": "string",
      "avatar": "string",
      "role": 1,
      "status": 1,
      "lastLoginTime": "2026-05-09 14:51:06"
    }
  },
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 邮箱登录

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>POST /auth/login/email</strong></div>

- 通过邮箱和验证码登录

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求体参数（application/json）

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| loginType | string | 否 | 登录类型：pwd/sms/wechat | - |
| email | string | 是 | 邮箱 | lilicould@qq.com |
| code | string | 是 | 验证码 | 655145 |

###### JSON 示例

```json
{
  "loginType": "string",
  "email": "lilicould@qq.com",
  "code": 655145
}
```

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | 登录成功结果对象 | 否 | 数据 | - |
| &nbsp;&nbsp;accessToken | string | 否 | 访问令牌 | - |
| &nbsp;&nbsp;expiresIn | integer | 否 | 过期时间 | - |
| &nbsp;&nbsp;userInfo | 用户信息 | 否 | 用户信息 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;id | integer | 否 | 用户ID | - |
| &nbsp;&nbsp;&nbsp;&nbsp;username | string | 否 | 用户名 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;nickname | string | 否 | 昵称 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;avatar | string | 否 | 头像URL | - |
| &nbsp;&nbsp;&nbsp;&nbsp;role | integer | 否 | 角色，0-管理员，1-普通用户 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;status | integer | 否 | 状态，0-禁用，1-启用 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;lastLoginTime | string | 否 | 上次登录时间 | 2026-05-09 14:51:06 |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "accessToken": "string",
    "expiresIn": 0,
    "userInfo": {
      "id": 0,
      "username": "string",
      "nickname": "string",
      "avatar": "string",
      "role": 1,
      "status": 1,
      "lastLoginTime": "2026-05-09 14:51:06"
    }
  },
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 注册接口

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>POST /auth/register</strong></div>

- 注册接口
- 需要管理员权限

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求体参数（application/json）

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| username | string | 是 | 用户名 | lilicould |
| password | string | 是 | 密码 | 123456 |
| confirmPassword | string | 是 | 确认密码 | 123456 |
| email | string | 是 | 邮箱 | lilicould@qq.com |
| nickname | string | 是 | 昵称 | 立里可 |

###### JSON 示例

```json
{
  "username": "lilicould",
  "password": 123456,
  "confirmPassword": 123456,
  "email": "lilicould@qq.com",
  "nickname": "立里可"
}
```

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | 响应成功，注册成功与否看响应状态码 | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | - | 否 | 数据 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - 响应成功，注册成功与否看响应状态码）

```json
{
  "code": 0,
  "msg": "成功",
  "data": null,
  "time": "2026-01-01T00:00:00Z"
}
```

### 文件接口

---

#### 上传文件

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>POST /file/upload</strong></div>

- 文件上传接口

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求参数

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| type（查询参数） | string | 否 | 上传类型,目前支持：cover,avatar,image,file四个值 | - |

##### 请求体参数（application/json）

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| file | string | 是 | - | - |

###### JSON 示例

```json
{
  "file": "<binary>"
}
```

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | 响应成功，登录成功与否看响应状态码 | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | - | 否 | 数据 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - 响应成功，登录成功与否看响应状态码）

```json
{
  "code": 0,
  "msg": "成功",
  "data": null,
  "time": "2026-01-01T00:00:00Z"
}
```

### 文章接口

---

#### 保存(写)文章

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>POST /api/article</strong></div>

- content的markdown内容上传后会自动转换为html内容

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求体参数（application/json）

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| title | string | 是 | 文章标题 | 关于AOP的使用 |
| slug | string | 是 | 文章别名(用于URL) | the-use-method-of-aop |
| summary | string | 是 | 文章摘要 | - |
| coverImage | string | 否 | 封面图片URL | - |
| status | integer | 是 | 文章状态，0-审核中，1-发布（实际仍会被系统置为审核中）,2-草稿 | - |
| content | string | 是 | markdown内容 | - |
| categoryId | integer | 是 | 分类ID | - |
| tags | array<integer> | 否 | 标签ID列表 | [1,2,3] |
| tags[] | integer | 是 | - | - |

###### JSON 示例

```json
{
  "title": "关于AOP的使用",
  "slug": "the-use-method-of-aop",
  "summary": "string",
  "coverImage": "string",
  "status": 1,
  "content": "string",
  "categoryId": 0,
  "tags": [
    1,
    2,
    3
  ]
}
```

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | - | 否 | 数据 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": null,
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 根据指定ID获取文章

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>GET /api/article/{id}</strong></div>

- 使用contentHtml渲染，content存的是markdown内容，只在更新文章时使用

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求参数

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| id（路径参数） | integer | 是 | 文章ID | - |

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | 文章详情对象 | 否 | 数据 | - |
| &nbsp;&nbsp;id | integer | 否 | 文章ID | - |
| &nbsp;&nbsp;title | string | 否 | 文章标题 | - |
| &nbsp;&nbsp;slug | string | 否 | 文章别名(用于URL) | - |
| &nbsp;&nbsp;summary | string | 否 | 文章摘要 | - |
| &nbsp;&nbsp;coverImage | string | 否 | 封面图片URL | - |
| &nbsp;&nbsp;content | string | 否 | markdown内容(不做展示，只是修改时候用到,展示请用contentHtml) | - |
| &nbsp;&nbsp;contentHtml | string | 否 | HTML内容 | - |
| &nbsp;&nbsp;viewCount | integer | 否 | 阅读数 | - |
| &nbsp;&nbsp;likeCount | integer | 否 | 点赞数 | - |
| &nbsp;&nbsp;commentCount | integer | 否 | 评论数 | - |
| &nbsp;&nbsp;category | 分类展示对象 | 否 | 分类 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;id | integer | 否 | 分类id | - |
| &nbsp;&nbsp;&nbsp;&nbsp;name | string | 否 | 分类名称 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;slug | string | 否 | 分类别名 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;description | string | 否 | 分类描述 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;sortOrder | integer | 否 | 排序字段，约定越小等级越高 | - |
| &nbsp;&nbsp;tags | array<标签信息> | 否 | 标签 | - |
| &nbsp;&nbsp;tags[] | 标签信息 | 是 | - | - |
| &nbsp;&nbsp;&nbsp;&nbsp;id | integer | 否 | 标签id | - |
| &nbsp;&nbsp;&nbsp;&nbsp;name | string | 否 | 标签名称 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;color | string | 否 | 标签颜色 | - |
| &nbsp;&nbsp;updateTime | string | 否 | 更新时间 | - |
| &nbsp;&nbsp;updater | 用户信息 | 否 | 更新人 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;id | integer | 否 | 用户ID | - |
| &nbsp;&nbsp;&nbsp;&nbsp;username | string | 否 | 用户名 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;nickname | string | 否 | 昵称 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;avatar | string | 否 | 头像URL | - |
| &nbsp;&nbsp;&nbsp;&nbsp;role | integer | 否 | 角色，0-管理员，1-普通用户 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;status | integer | 否 | 状态，0-禁用，1-启用 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;lastLoginTime | string | 否 | 上次登录时间 | 2026-05-09 14:51:06 |
| &nbsp;&nbsp;createTime | string | 否 | 创建时间 | - |
| &nbsp;&nbsp;creator | 用户信息 | 否 | 作者 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;id | integer | 否 | 用户ID | - |
| &nbsp;&nbsp;&nbsp;&nbsp;username | string | 否 | 用户名 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;nickname | string | 否 | 昵称 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;avatar | string | 否 | 头像URL | - |
| &nbsp;&nbsp;&nbsp;&nbsp;role | integer | 否 | 角色，0-管理员，1-普通用户 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;status | integer | 否 | 状态，0-禁用，1-启用 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;lastLoginTime | string | 否 | 上次登录时间 | 2026-05-09 14:51:06 |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "id": 0,
    "title": "string",
    "slug": "string",
    "summary": "string",
    "coverImage": "string",
    "content": "string",
    "contentHtml": "string",
    "viewCount": 1,
    "likeCount": 1,
    "commentCount": 1,
    "category": {
      "id": 0,
      "name": "string",
      "slug": "string",
      "description": "string",
      "sortOrder": 1
    },
    "tags": [
      {
        "id": 0,
        "name": "string",
        "color": "#666666"
      }
    ],
    "updateTime": "2026-01-01T00:00:00Z",
    "updater": {
      "id": 0,
      "username": "string",
      "nickname": "string",
      "avatar": "string",
      "role": 1,
      "status": 1,
      "lastLoginTime": "2026-05-09 14:51:06"
    },
    "createTime": "2026-01-01T00:00:00Z",
    "creator": {
      "id": 0,
      "username": "string",
      "nickname": "string",
      "avatar": "string",
      "role": 1,
      "status": 1,
      "lastLoginTime": "2026-05-09 14:51:06"
    }
  },
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 更新文章

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>PUT /api/article/{id}</strong></div>

- 暂无描述

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求参数

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| id（路径参数） | integer | 是 | 文章ID | - |

##### 请求体参数（application/json）

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| title | string | 否 | 文章标题 | 关于AOP的使用 |
| slug | string | 否 | 文章别名(用于URL) | the-use-method-of-aop |
| summary | string | 否 | 文章摘要 | - |
| coverImage | string | 否 | 封面图片URL | - |
| status | integer | 否 | 文章状态，0-审核中，1-发布（实际仍会被系统置为审核中）,2-草稿 | - |
| content | string | 否 | markdown内容 | - |
| categoryId | integer | 否 | 分类ID | - |
| tags | array<integer> | 否 | 标签ID列表 | [1,2,3] |
| tags[] | integer | 是 | - | - |

###### JSON 示例

```json
{
  "title": "关于AOP的使用",
  "slug": "the-use-method-of-aop",
  "summary": "string",
  "coverImage": "string",
  "status": 1,
  "content": "string",
  "categoryId": 0,
  "tags": [
    1,
    2,
    3
  ]
}
```

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | - | 否 | 数据 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": null,
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 获取文章列表

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>GET /api/article</strong></div>

- 暂无描述

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求参数

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| title（查询参数） | string | 否 | 文章标题 | - |
| createBy（查询参数） | integer | 否 | 文章作者ID | 1 |
| categoryId（查询参数） | integer | 否 | 文章分类ID | 1 |
| status（查询参数） | integer | 否 | 文章状态，0-审核中，1-发布，2-草稿 | - |
| startTime（查询参数） | string | 否 | 文章发布时间范围(开始) | 2026-05-09 14:51:06 |
| endTime（查询参数） | string | 否 | 文章发布时间范围(结束) | 2026-05-11 14:51:06 |
| current（查询参数） | integer | 否 | 当前页码 | 1 |
| size（查询参数） | integer | 否 | 每页数量 | 10 |

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | 分页对象视图文章列表对象 | 否 | 数据 | - |
| &nbsp;&nbsp;current | integer | 否 | 当前页码 | 1 |
| &nbsp;&nbsp;size | integer | 否 | 每页数量 | 10 |
| &nbsp;&nbsp;totalPage | integer | 否 | 总页数 | - |
| &nbsp;&nbsp;total | integer | 否 | 总记录数 | - |
| &nbsp;&nbsp;hasPrevious | boolean | 否 | 是否有上一页 | - |
| &nbsp;&nbsp;hasNext | boolean | 否 | 是否有下一页 | - |
| &nbsp;&nbsp;records | array<文章列表对象> | 否 | 数据列表 | - |
| &nbsp;&nbsp;records[] | 文章列表对象 | 是 | - | - |
| &nbsp;&nbsp;&nbsp;&nbsp;id | integer | 否 | 文章ID | - |
| &nbsp;&nbsp;&nbsp;&nbsp;title | string | 否 | 文章标题 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;slug | string | 否 | 文章别名(用于URL) | - |
| &nbsp;&nbsp;&nbsp;&nbsp;summary | string | 否 | 文章摘要 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;coverImage | string | 否 | 封面图片URL | - |
| &nbsp;&nbsp;&nbsp;&nbsp;viewCount | integer | 否 | 阅读数 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;likeCount | integer | 否 | 点赞数 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;commentCount | integer | 否 | 评论数 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;category | 分类展示对象 | 否 | 分类 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id | integer | 否 | 分类id | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name | string | 否 | 分类名称 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;slug | string | 否 | 分类别名 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;description | string | 否 | 分类描述 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;sortOrder | integer | 否 | 排序字段，约定越小等级越高 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;tags | array<标签信息> | 否 | 标签 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;tags[] | 标签信息 | 是 | - | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id | integer | 否 | 标签id | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;name | string | 否 | 标签名称 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;color | string | 否 | 标签颜色 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;updateTime | string | 否 | 更新时间 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;updater | 用户信息 | 否 | 更新人 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id | integer | 否 | 用户ID | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;username | string | 否 | 用户名 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nickname | string | 否 | 昵称 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;avatar | string | 否 | 头像URL | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;role | integer | 否 | 角色，0-管理员，1-普通用户 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;status | integer | 否 | 状态，0-禁用，1-启用 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lastLoginTime | string | 否 | 上次登录时间 | 2026-05-09 14:51:06 |
| &nbsp;&nbsp;&nbsp;&nbsp;createTime | string | 否 | 创建时间 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;creator | 用户信息 | 否 | 作者 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;id | integer | 否 | 用户ID | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;username | string | 否 | 用户名 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;nickname | string | 否 | 昵称 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;avatar | string | 否 | 头像URL | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;role | integer | 否 | 角色，0-管理员，1-普通用户 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;status | integer | 否 | 状态，0-禁用，1-启用 | - |
| &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;lastLoginTime | string | 否 | 上次登录时间 | 2026-05-09 14:51:06 |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "current": 1,
    "size": 10,
    "totalPage": 0,
    "total": 0,
    "hasPrevious": false,
    "hasNext": false,
    "records": [
      {
        "id": 0,
        "title": "string",
        "slug": "string",
        "summary": "string",
        "coverImage": "string",
        "viewCount": 1,
        "likeCount": 1,
        "commentCount": 1,
        "category": {
          "id": 0,
          "name": "string",
          "slug": "string",
          "description": "string",
          "sortOrder": 1
        },
        "tags": [
          {
            "id": 0,
            "name": "string",
            "color": "#666666"
          }
        ],
        "updateTime": "2026-01-01T00:00:00Z",
        "updater": {
          "id": 0,
          "username": "string",
          "nickname": "string",
          "avatar": "string",
          "role": 1,
          "status": 1,
          "lastLoginTime": "2026-05-09 14:51:06"
        },
        "createTime": "2026-01-01T00:00:00Z",
        "creator": {
          "id": 0,
          "username": "string",
          "nickname": "string",
          "avatar": "string",
          "role": 1,
          "status": 1,
          "lastLoginTime": "2026-05-09 14:51:06"
        }
      }
    ]
  },
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 删除文章

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>DELETE /api/article/{id}</strong></div>

- 暂无描述

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求参数

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| id（路径参数） | integer | 是 | 文章ID | - |

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | - | 否 | 数据 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": null,
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 是否点赞

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>GET /api/article/{id}/like</strong></div>

- 查询用户对该文章的点赞状态;如果点赞或取消点赞出现异常，也可调用此接口更新状态

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求参数

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| id（路径参数） | integer | 是 | 文章ID | - |

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | boolean | 否 | 数据 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": false,
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 文章点赞

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>PUT /api/article/{id}/like</strong></div>

- 需要登录

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求参数

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| id（路径参数） | integer | 是 | 文章ID | - |

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | - | 否 | 数据 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": null,
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 文章取消点赞

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>PUT /api/article/{id}/unlike</strong></div>

- 需要登录

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求参数

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| id（路径参数） | integer | 是 | 文章ID | - |

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | - | 否 | 数据 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": null,
  "time": "2026-01-01T00:00:00Z"
}
```

### 用户接口

---

#### 更新用户信息(/修改密码)

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>PUT /api/user</strong></div>

- 无需管理员权限，需要登录,若为修改密码，成功后前端自主调用登出接口，修改其他内容也要调用/api/user/me接口更新一下信息

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求体参数（application/json）

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| oldPassword | string | 是 | 旧密码 | 123456 |
| newPassword | string | 是 | 新密码 | 123456 |
| confirmPassword | string | 是 | 确认密码 | 123456 |
| nickname | string | 是 | 昵称 | 立里可 |
| avatar | string | 否 | 头像,前端处理先调用文件上传接口获得url后直接传入，而不是让用户填写url | - |

###### JSON 示例

```json
{
  "oldPassword": 123456,
  "newPassword": 123456,
  "confirmPassword": 123456,
  "nickname": "立里可",
  "avatar": "string"
}
```

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | - | 否 | 数据 | - |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": null,
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 获取当前用户信息

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>GET /api/user/me</strong></div>

- 无需管理员权限，需要登录

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | 用户信息 | 否 | 数据 | - |
| &nbsp;&nbsp;id | integer | 否 | 用户ID | - |
| &nbsp;&nbsp;username | string | 否 | 用户名 | - |
| &nbsp;&nbsp;nickname | string | 否 | 昵称 | - |
| &nbsp;&nbsp;avatar | string | 否 | 头像URL | - |
| &nbsp;&nbsp;role | integer | 否 | 角色，0-管理员，1-普通用户 | - |
| &nbsp;&nbsp;status | integer | 否 | 状态，0-禁用，1-启用 | - |
| &nbsp;&nbsp;lastLoginTime | string | 否 | 上次登录时间 | 2026-05-09 14:51:06 |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "id": 0,
    "username": "string",
    "nickname": "string",
    "avatar": "string",
    "role": 1,
    "status": 1,
    "lastLoginTime": "2026-05-09 14:51:06"
  },
  "time": "2026-01-01T00:00:00Z"
}
```

---

#### 获取用户信息

<div style="padding:10px 12px;border:1px solid #dcdfe6;border-left:4px solid #409eff;border-radius:6px;"><strong>GET /api/user/{id}</strong></div>

- 无需管理员权限，无需登录

##### 鉴权方式

| 方案 | 类型 | in | 参数名 | scheme | 描述 |
| --- | --- | --- | --- | --- | --- |
| Authorization | http | header | Authorization | Bearer | 使用 Bearer 认证方式，在请求头中携带Bearer ...token |

##### 请求参数

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| id（路径参数） | integer | 是 | 用户ID | - |

##### 响应参数

| 响应码 | 说明 | 类型 |
| :-- | :----- | :--------------- |
| 200 | OK | */* |

| 字段 | 类型 | 必填 | 说明 | 示例值 |
| --- | --- | --- | --- | --- |
| code | integer | 否 | 状态码，0表示成功 | 0 |
| msg | string | 否 | 响应信息/错误信息 | 成功 |
| data | 用户信息 | 否 | 数据 | - |
| &nbsp;&nbsp;id | integer | 否 | 用户ID | - |
| &nbsp;&nbsp;username | string | 否 | 用户名 | - |
| &nbsp;&nbsp;nickname | string | 否 | 昵称 | - |
| &nbsp;&nbsp;avatar | string | 否 | 头像URL | - |
| &nbsp;&nbsp;role | integer | 否 | 角色，0-管理员，1-普通用户 | - |
| &nbsp;&nbsp;status | integer | 否 | 状态，0-禁用，1-启用 | - |
| &nbsp;&nbsp;lastLoginTime | string | 否 | 上次登录时间 | 2026-05-09 14:51:06 |
| time | string | 否 | 响应时间 | - |

###### JSON 示例（200 - OK）

```json
{
  "code": 0,
  "msg": "成功",
  "data": {
    "id": 0,
    "username": "string",
    "nickname": "string",
    "avatar": "string",
    "role": 1,
    "status": 1,
    "lastLoginTime": "2026-05-09 14:51:06"
  },
  "time": "2026-01-01T00:00:00Z"
}
```

## OpenAPI Info

这是立里博客的后端接口文档，严格遵循 RESTful 规范设计。欢迎访问线上体验地址。

- OpenAPI: 3.1.0
- 版本: 2.0.1
- 联系人: 立里可
