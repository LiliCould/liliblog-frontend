# LiliBlog Nuxt 部署手册

本手册适用于把本项目部署到一台 Linux 服务器，使用 systemd 运行 Nuxt SSR，
再用 Nginx 或 OpenResty 反向代理。示例中的域名、路径、用户请按实际情况替换。

## 1. 部署架构

```text
浏览器
  │
  ▼
Nginx / OpenResty :80/:443
  ├── /_nuxt/、/vditor/、/  ──► Nuxt SSR 127.0.0.1:3000
  └── /api/、/auth/、/file/ ──► 后端 API 127.0.0.1:8080
```

- 浏览器始终请求同源 `/api`、`/auth`、`/file`，避免跨域和 Cookie 问题。
- Nuxt 绑定 `127.0.0.1`，不要直接暴露到公网。
- 前端与后端可以部署在同一台机器，也可以分开部署，只需修改代理地址。

## 2. 前置要求

| 项 | 要求 |
|---|---|
| 系统 | 常见 Linux 发行版 |
| Node.js | >= 22.19，推荐 24 LTS |
| 包管理器 | Yarn 4（项目锁定 `yarn@4.18.0`） |
| 反向代理 | Nginx 或 OpenResty |
| 后端 | 已部署并可访问的 LiliBlog 后端 API |

> Nitro 运行时的 `undici` 要求 Node >= 22.19，不要使用过旧的系统 Node。

## 3. 安装 Node.js

推荐使用 Node 官方二进制包：

```bash
curl -fsSL https://nodejs.org/dist/v24.22.0/node-v24.22.0-linux-x64.tar.xz -o /tmp/node24.tar.xz
sudo mkdir -p /opt/node24
sudo tar -xJf /tmp/node24.tar.xz -C /opt/node24 --strip-components=1
/opt/node24/bin/node -v
rm -f /tmp/node24.tar.xz
```

如果使用 systemd 并采用 `/opt/node24`，请同步修改
`deploy/liliblog-web.service` 中的 `ExecStart` 和 `PATH`。

启用 Yarn 4：

```bash
sudo npm install -g corepack@0.36.0
sudo corepack enable
corepack prepare yarn@4.18.0 --activate
yarn -v
```

## 4. 构建

建议在本机或 CI 中构建，服务器只运行构建产物。

```bash
yarn install --immutable
yarn build
```

构建完成后，产物位于 `.output/`。

### Windows 构建注意事项

Windows 上构建出的 `.output/server/node_modules` 可能包含绝对路径符号链接，
上传到 Linux 后会失效，启动时报：

```text
Cannot find package 'vue' imported from .../.output/server/index.mjs
```

推荐在 Linux、WSL 或 Docker 中构建。也可以在服务器上删除符号链接后重新安装
运行依赖：

```bash
cd /var/www/liliblog-web
rm -rf .output/server/node_modules
cp .output/server/package.json package.json
npm install --omit=dev --no-audit --no-fund
```

## 5. 上传与目录准备

在服务器创建应用目录和运行用户（示例使用 `www-data`，也可使用专用用户）：

```bash
sudo mkdir -p /var/www/liliblog-web
sudo chown -R www-data:www-data /var/www/liliblog-web
```

在本机上传：

```bash
rsync -avz --delete .output/ user@example.com:/var/www/liliblog-web/.output/
```

上传用户需要对该目录有写权限；也可以上传后统一修正属主：

```bash
sudo chown -R www-data:www-data /var/www/liliblog-web
```

升级前建议保留上一版产物，便于回滚：

```bash
sudo rm -rf /var/www/liliblog-web/.output.previous
sudo cp -a /var/www/liliblog-web/.output /var/www/liliblog-web/.output.previous
```

如果采用第 4 节的“上传后安装运行依赖”方式，请在上传完成后执行依赖安装。

## 6. systemd

复制服务文件并按实际环境修改 `User`、`Group`、`WorkingDirectory`、`ExecStart`：

```bash
sudo cp deploy/liliblog-web.service /etc/systemd/system/liliblog-web.service
sudo systemctl daemon-reload
sudo systemctl enable --now liliblog-web
sudo systemctl status liliblog-web
sudo journalctl -u liliblog-web -f
```

验证服务是否启动：

```bash
curl -I http://127.0.0.1:3000/
```

## 7. Nginx / OpenResty

仓库提供通用配置：`deploy/nginx-liliblog.conf`。

使用前替换：

- `example.com`：你的域名
- `/var/www/liliblog-web/.output/public`：静态资源目录
- SSL 证书路径
- `127.0.0.1:8080`：后端 API 地址

```bash
sudo cp deploy/nginx-liliblog.conf /etc/nginx/conf.d/liliblog.conf
sudo nginx -t
sudo systemctl reload nginx
```

如果使用 1Panel、宝塔等面板：

- 不要整文件覆盖面板生成的站点配置。
- 把 `deploy/nginx-liliblog.conf` 中的 `location` 段合并到现有 `server {}`。
- 删除旧的 SPA fallback（如 `try_files $uri $uri/ /index.html`）。
- 删除会拦截 `/_nuxt/*.js`、`/_nuxt/*.css` 的静态资源正则。
- 保留面板管理的证书、HTTP/2 和 ACME 配置。

## 8. 环境变量

生产环境至少设置：

```bash
NODE_ENV=production
HOST=127.0.0.1
PORT=3000
NUXT_API_BASE=http://127.0.0.1:8080
NUXT_PUBLIC_SITE_URL=https://example.com
# direct=浏览器直传对象存储；proxy=由后端中转上传
NUXT_PUBLIC_UPLOAD_MODE=direct
NODE_OPTIONS=--max-old-space-size=384
```

说明：

- `NUXT_API_BASE`：服务端 SSR 请求后端使用的地址，推荐走内网或本机。
- `NUXT_PUBLIC_SITE_URL`：用于 sitemap、canonical、Open Graph 等绝对地址。
- `NUXT_PUBLIC_API_BASE`：浏览器端 API 前缀，默认留空表示同源。
- `NUXT_PUBLIC_UPLOAD_MODE`：`direct` 为前端直传对象存储，`proxy` 为后端中转。

不要把登录 token、数据库密码等敏感信息写入仓库。

## 9. 上线验证

```bash
curl -I http://127.0.0.1:3000/
curl -I https://example.com/
curl -I https://example.com/admin
curl -s https://example.com/sitemap.xml | head
curl -s https://example.com/robots.txt
curl -I https://example.com/index.html
curl -s 'https://example.com/api/article?status=1&current=1&size=1' | head -c 200
```

预期：

- 首页、文章页返回 200，SSR HTML 中包含正文。
- `/admin` 等后台页面返回 `X-Robots-Tag: noindex, nofollow`。
- `sitemap.xml` 只包含公开文章、分类、标签和作者。
- `robots.txt` 禁止后台、登录、写作和搜索页面。
- `/index.html` 由服务端 301 到 `/`。
- `/api/article` 返回后端 JSON。

## 10. 回滚

保留上一版本的 `.output/` 和代理配置备份：

```bash
sudo systemctl stop liliblog-web
sudo mv /var/www/liliblog-web/.output /var/www/liliblog-web/.output.failed
sudo mv /var/www/liliblog-web/.output.previous /var/www/liliblog-web/.output
sudo systemctl start liliblog-web
```

如果本次同时修改了 Nginx 配置，恢复备份后重新加载：

```bash
sudo nginx -t
sudo systemctl reload nginx
```

## 11. 常见问题

### 页面 502

先确认 Nuxt 服务是否在监听：

```bash
sudo systemctl status liliblog-web
curl -I http://127.0.0.1:3000/
```

再检查 Nginx 的 `upstream` / `proxy_pass` 地址是否正确。

### 静态资源 404

确认 Nginx 的静态资源目录指向 `.output/public`，并且没有旧 SPA 配置拦截
`/_nuxt/`。

### 上传失败或 CORS 错误

使用前端直传时，需要在对象存储的跨域设置中允许站点域名，方法至少包含
`POST/GET/HEAD/OPTIONS`。也可以把 `NUXT_PUBLIC_UPLOAD_MODE` 改为 `proxy`
回退到后端中转上传。

### Node 版本过低

如果启动时报 `undici` 或 `whatwg-url` 相关错误，升级到 Node 24 并确认
systemd 的 `ExecStart` 使用的是新版本 Node。

## 12. 安全建议

- 只开放 80/443，Nuxt 的 3000 和后端 8080 只监听 `127.0.0.1`。
- 使用 SSH 密钥登录，关闭密码登录。
- 不要把 `.env`、私钥、数据库密码等敏感文件提交到仓库。
- 定期更新 Node、依赖和反向代理版本。
