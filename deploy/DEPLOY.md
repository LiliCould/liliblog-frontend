# LiliBlog Nuxt 上线手册

> 本文档中的安装、systemd 重启、Nginx reload 都需要在服务器上执行。
> 本地只能生成代码和配置，不能代替服务器操作。

## 1. 服务器前置条件

- Node.js 20 LTS 或 22 LTS；确认路径：`which node`（示例 `/usr/bin/node`）
- Yarn 4：`corepack enable`
- Nginx
- systemd
- 一个运行应用的系统用户，示例 `www-data`
- 应用目录示例：`/var/www/liliblog`

## 2. 构建

在服务器或 CI 中执行：

```bash
cd /var/www/liliblog
corepack enable
yarn install --immutable
yarn build
```

产物：

- `.output/server/index.mjs`
- `.output/public/_nuxt/*`
- `public/vditor` 会在 `prebuild` 阶段自动复制到 `.output/public/vditor`

如果构建在本地完成，把 `.output` 同步到服务器应用目录。

## 3. systemd

```bash
sudo cp deploy/liliblog.service /etc/systemd/system/liliblog.service
# 按实际路径修改 User/WorkingDirectory/ExecStart
sudo systemctl daemon-reload
sudo systemctl enable --now liliblog
sudo systemctl status liliblog
sudo journalctl -u liliblog -f
```

验证 Node 进程：

```bash
curl -I http://127.0.0.1:3000/
```

## 4. Nginx / 1Panel OpenResty

### 4.1 宿主机安装的 OpenResty/Nginx

```bash
sudo cp deploy/nginx-liliblog.conf /etc/nginx/conf.d/liliblog.conf
# 替换证书路径、应用目录、端口
sudo nginx -t
sudo systemctl reload nginx
```

### 4.2 1Panel 里的 OpenResty

先确认 OpenResty 是宿主机服务还是 1Panel 的 Docker 应用：

```bash
docker ps --format '{{.Names}} {{.Image}}' | grep -i openresty
# 有输出：Docker 应用
systemctl status openresty 2>/dev/null | head
# 有输出：宿主机服务
```

- **宿主机 OpenResty**：upstream 用 `127.0.0.1:3000`，可直接使用
  `deploy/nginx-liliblog.conf`。
- **1Panel Docker OpenResty**：容器里的 `127.0.0.1` 不是宿主机，
  upstream 必须改为 `host.docker.internal:3000` 或 Docker 网桥 IP
  （常见 `172.17.0.1`）。使用 `deploy/openresty-1panel-site.conf`。
- 1Panel 的站点 SSL、证书、HTTP/2 由面板管理，不要把整段
  `server {}` 覆盖进去；只把 `location` 合并到「网站 -> 网站 -> 配置文件」。
- 修改后优先用 1Panel 面板的「重启/重载」按钮，或重启对应 OpenResty 应用；
  不要假设存在 `systemctl reload nginx`。
- 1Panel 防火墙/安全组只放行 80/443；3000 只绑定 `127.0.0.1`，
  不要对外开放。

如果 Nginx 已经直接代理 `/api`、`/auth`、`/file`，保留配置中的三段；
如果希望全部交给 Nuxt 处理，删除这三段即可，`server/middleware/api-proxy.ts` 会转发。

## 5. 上线前验证

```bash
curl -I https://lilicould.cn/
curl -I https://lilicould.cn/article/CO
curl -I https://lilicould.cn/admin
curl -s https://lilicould.cn/sitemap.xml | head
curl -s https://lilicould.cn/robots.txt
curl -I https://lilicould.cn/index.html
```

预期：

- 首页/文章页 200，SSR HTML 包含正文
- `/admin` 响应头包含 `X-Robots-Tag: noindex, nofollow`
- `sitemap.xml` 只包含公开文章、分类、标签、作者
- `robots.txt` 禁止后台、登录、写作、搜索
- `/index.html` 301 到 `/`

## 6. 回滚

上线前保留：

- 旧的静态 `dist/` 目录
- 旧 Nginx 配置备份

回滚时：

```bash
sudo systemctl stop liliblog
sudo cp /etc/nginx/conf.d/liliblog.conf.bak /etc/nginx/conf.d/liliblog.conf
sudo nginx -t && sudo systemctl reload nginx
# 把 Nginx root 指回旧 dist
```

## 7. 常用环境变量

```bash
NODE_ENV=production
PORT=3000
NUXT_API_BASE=https://api.lilicould.cn
NUXT_PUBLIC_SITE_URL=https://lilicould.cn
```

不要把登录 token、数据库密码等写入仓库。
