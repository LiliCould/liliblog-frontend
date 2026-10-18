# LiliBlog Nuxt 上线手册（当前服务器实测版）

> 目标服务器：`lilicould.cn`
> 本次只做了只读检查，没有执行任何部署、重启或配置修改。
> 所有 `sudo`、systemd、1Panel 操作都需要你在服务器上执行。

## 0. 已确认的服务器事实

| 项 | 现状 |
|---|---|
| 系统 | Debian 13 (trixie) |
| 用户 | `lilicould`，在 `sudo` 组 |
| OpenResty | 1Panel Docker 容器，镜像 `1panel/openresty:1.27.1.2-5-1-focal`，**network=host** |
| OpenResty 配置 | `/opt/1panel/www/conf.d/lilicould.conf`（容器内 `/usr/local/openresty/nginx/conf/conf.d/`） |
| 站点静态目录 | `/www/sites/lilicould/index`（旧前端 `dist`，保留回滚） |
| 后端 | Spring Boot `liliblog.service`，监听 `127.0.0.1:8080`，Jar 在 `/opt/liliblog` |
| Node | **未安装**；apt 候选 Node 20.19.2、npm 9.2.0 |
| 内存 | 1.6GB + 2GB swap；Java 进程 RSS 约 770MB，偏紧 |
| 端口 | 3000 空闲；80/443/8080/8888 已占用 |
| systemd | 257；已有 `liliblog.service`（后端），**新前端服务必须另起名** |

因为 OpenResty 容器是 `network=host`，Nuxt 绑定 `127.0.0.1:3000` 后，
容器可以直接访问，不需要 `host.docker.internal` 或 Docker 网桥 IP。

## 1. 安装 Node（仅一次）

> 注意：Debian 13 apt 的 Node 20.19.2 **不够**。Nitro 运行时的
> `undici` 要求 Node >=22.19，`whatwg-url` 等要求 Node >=22.14。
> 服务器已安装 Node 24.22.0 到 `/opt/node24`，不要再用 apt 的 Node 20。

```bash
curl -fsSL https://nodejs.org/dist/v24.22.0/node-v24.22.0-linux-x64.tar.xz -o /tmp/node24.tar.xz
sudo mkdir -p /opt/node24
sudo tar -xJf /tmp/node24.tar.xz -C /opt/node24 --strip-components=1
/opt/node24/bin/node -v    # 预期 v24.22.0
rm -f /tmp/node24.tar.xz
```

systemd 的 `ExecStart` 已改为：

```text
/opt/node24/bin/node .output/server/index.mjs
```

Yarn 4 **不能**用 `npm install -g yarn@4.18.0` 安装：
npm 上的 `yarn` 包只有 1.x，Yarn 4 的包名是 `@yarnpkg/cli-dist`。

如果需要在服务器上构建：

```bash
sudo npm install -g @yarnpkg/cli-dist@4.18.0
yarn -v    # 预期 4.18.0
```

或者使用 corepack：

```bash
sudo npm install -g corepack@0.36.0
sudo corepack enable
corepack prepare yarn@4.18.0 --activate
yarn -v
```

**如果采用“本地构建 + 上传 `.output`”的方式，服务器上只需要 Node，
不需要安装 Yarn/npm 构建依赖。**

当前服务器使用 `/opt/node24/bin/node`；如果换机器，按实际路径修改
`deploy/liliblog-web.service` 的 `ExecStart` 和 `PATH`。

## 2. 构建与上传

**建议本地/CI 构建**，服务器内存偏紧，不建议在服务器上跑完整 `nuxt build`。

本地：

```bash
yarn install --immutable
yarn build
```

服务器准备目录：

```bash
sudo install -d -o lilicould -g lilicould /opt/liliblog-web
```

本地上传：

```bash
rsync -avz --delete .output/ lilicould@lilicould.cn:/opt/liliblog-web/.output/
```

如果必须在服务器构建，至少确认 swap 可用，并在低峰期执行。

### 2.1 Windows 构建产物的符号链接问题

在 Windows 上执行 `nuxt build` 后，`.output/server/node_modules` 里的包是
**绝对路径符号链接**，例如：

```text
vue -> /e/workspace/.../.output/server/node_modules/.nitro/vue@3.5.44
```

直接上传到 Linux 后链接失效，启动会报：

```text
Cannot find package 'vue' imported from /opt/liliblog-web/.output/server/index.mjs
```

三种处理方式，任选一种：

1. **在 Linux/WSL/Docker 中构建**（最干净）
2. **上传后安装运行依赖**（推荐，当前服务器适用）：
   ```bash
   cd /opt/liliblog-web
   rm -rf .output/server/node_modules
   cp .output/server/package.json package.json
   npm install --omit=dev --no-audit --no-fund
   sudo chown -R lilicould:lilicould /opt/liliblog-web
   sudo systemctl restart liliblog-web
   ```
   这样依赖会装到 `/opt/liliblog-web/node_modules`，Node 从
   `.output/server/index.mjs` 向上查找可以正常解析。
3. 上传一个在 Linux 上构建好的 `.output`（包含可用的 node_modules）

## 3. systemd（前端服务）

```bash
sudo cp deploy/liliblog-web.service /etc/systemd/system/liliblog-web.service
sudo systemctl daemon-reload
sudo systemctl enable --now liliblog-web
sudo systemctl status liliblog-web
sudo journalctl -u liliblog-web -f
```

验证：

```bash
curl -I http://127.0.0.1:3000/
```

注意：

- 不要覆盖/重启 `liliblog.service`，那是 Java 后端。
- 服务已设置 `HOST=127.0.0.1`、`PORT=3000`、`NODE_OPTIONS=--max-old-space-size=384`。
- 服务端请求后端走 `NUXT_API_BASE=http://127.0.0.1:8080`，避免绕公网。

## 4. 1Panel OpenResty 站点配置

当前站点配置：`/opt/1panel/www/conf.d/lilicould.conf`

1. 先备份：
   在 1Panel「网站 -> 网站 -> lilicould -> 配置文件」复制一份内容，
   或执行：
   ```bash
   sudo cp /opt/1panel/www/conf.d/lilicould.conf /root/lilicould.conf.bak
   ```
2. 用 `deploy/1panel-lilicould-site.conf` 的内容替换站点配置。
3. 保存后，使用 1Panel 的「重载/重启」按钮重载 OpenResty。

关键修改：

- 删除 `location / { try_files $uri $uri/ /index.html; }`
- 删除 `error_page 404 = @redirect_to_index` 和 `location @redirect_to_index`
- 删除 `location ~* \.(jpg|jpeg|png|gif|ico|css|js)$`
  （否则会拦截 `/_nuxt/*.js`、`/_nuxt/*.css`）
- `/_nuxt/`、`/vditor/`、`/` 代理到 `127.0.0.1:3000`
- `/api/`、`/auth/`、`/file/` 代理到 `127.0.0.1:8080`
- 保留 1Panel 管理的证书路径、`http2 on`、ACME 路径

如果不方便整段替换，只把 `deploy/1panel-lilicould-site.conf` 中的
`location` 段合并到现有 server 中，并删除上面三个冲突段。

## 5. 上线前验证

```bash
curl -I http://127.0.0.1:3000/
curl -I https://lilicould.cn/
curl -I https://lilicould.cn/article/CO
curl -I https://lilicould.cn/admin
curl -s https://lilicould.cn/sitemap.xml | head
curl -s https://lilicould.cn/robots.txt
curl -I https://lilicould.cn/index.html
curl -s 'https://lilicould.cn/api/article?status=1&current=1&size=1' | head -c 200
```

预期：

- 首页/文章页 200，SSR HTML 包含正文
- `/admin` 响应头包含 `X-Robots-Tag: noindex, nofollow`
- `sitemap.xml` 只包含公开文章、分类、标签、作者
- `robots.txt` 禁止后台、登录、写作、搜索
- `/index.html` 301 到 `/`
- `/api/article` 返回后端 JSON

## 6. 回滚

保留：

- 旧静态站 `/www/sites/lilicould/index`
- 旧站点配置 `/root/lilicould.conf.bak` 或 1Panel 里的配置副本

回滚：

```bash
sudo systemctl stop liliblog-web
sudo cp /root/lilicould.conf.bak /opt/1panel/www/conf.d/lilicould.conf
# 在 1Panel 里重载 OpenResty
```

旧静态站仍在原目录，恢复旧配置后即可继续提供服务。

## 6.1 后端 Java 内存调优（避免全局 OOM）

当前服务器只有 1.6GB 内存，Java 峰值 RSS 约 770–811MB。建议把后端
`liliblog.service` 调整为以下参数，并给 cgroup 设置硬上限。

先备份：

```bash
sudo cp /etc/systemd/system/liliblog.service /root/liliblog.service.bak
```

建议的 `[Unit]` / `[Service]`：

```ini
[Unit]
Description=Liliblog Spring Boot Application
After=network.target
StartLimitIntervalSec=300
StartLimitBurst=3

[Service]
User=lilicould
Group=lilicould
WorkingDirectory=/opt/liliblog
ExecStart=/usr/bin/java \
  -Xms192m -Xmx320m -Xss512k \
  -XX:+UseG1GC -XX:MaxGCPauseMillis=200 \
  -XX:MetaspaceSize=96m -XX:MaxMetaspaceSize=128m \
  -XX:ReservedCodeCacheSize=96m -XX:MaxDirectMemorySize=128m \
  -XX:+UseContainerSupport -XX:ActiveProcessorCount=2 \
  -XX:+ExitOnOutOfMemoryError \
  -Dfile.encoding=UTF-8 \
  -jar /opt/liliblog/liliblog.jar \
  --spring.profiles.active=prod \
  --server.tomcat.threads.max=50 \
  --server.tomcat.threads.min-spare=5 \
  --server.tomcat.accept-count=100
Restart=on-failure
RestartSec=10
MemoryAccounting=true
MemoryHigh=600M
MemoryMax=720M
MemorySwapMax=256M
TasksMax=256
LimitNOFILE=65535

[Install]
WantedBy=multi-user.target
```

应用：

```bash
sudo systemctl daemon-reload
sudo systemctl start liliblog
sudo systemctl status liliblog --no-pager
free -m
```

观察：

```bash
journalctl -u liliblog -f
systemctl status liliblog --no-pager
```

- `MemoryHigh=600M`：超过后内核会节流 Java，而不是直接杀进程
- `MemoryMax=720M`：硬上限，防止 Java 把整机内存吃光
- 如果启动时就因上限失败，先把 `MemoryMax` 调到 800M 再试
- 如果仍然 OOM，检查 `journalctl -k | grep -i oom`，并考虑给 MySQL 容器也加内存限制

## 7. 环境变量

```bash
NODE_ENV=production
HOST=127.0.0.1
PORT=3000
NUXT_API_BASE=http://127.0.0.1:8080
NUXT_PUBLIC_SITE_URL=https://lilicould.cn
NODE_OPTIONS=--max-old-space-size=384
```

不要把登录 token、数据库密码等写入仓库。

## 8. 安全提醒

- 本次只读检查使用的服务器密码已在聊天中出现，**建议立即修改服务器密码**，
  并改用 SSH 密钥登录。
- 3000 只绑定 `127.0.0.1`，1Panel 防火墙/云安全组不要放行 3000。
- 后端 8080 也不应直接对公网开放，应由 OpenResty 代理。
