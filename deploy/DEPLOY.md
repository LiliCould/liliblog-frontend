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

## 4. Nginx

```bash
sudo cp deploy/nginx-liliblog.conf /etc/nginx/conf.d/liliblog.conf
# 替换证书路径、应用目录、端口
sudo nginx -t
sudo systemctl reload nginx
```

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
