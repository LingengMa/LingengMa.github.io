# 技术架构文档

## 1. 技术选型

| 组件 | 选择 | 理由 |
|------|------|------|
| 静态站点生成器 | Hugo v0.158.0+ | 构建速度快，Markdown 原生支持，社区活跃 |
| 主题 | rqdmap/inkwell | 与目标风格一致，内置搜索/KaTeX/热力图等功能 |
| 部署平台 | GitHub Pages | 免费，与 Git 工作流深度集成 |
| CI/CD | GitHub Actions | 自动化构建与发布，无需本地手动 build |
| 内容格式 | Markdown + YAML front matter | 通用标准，工具支持广泛 |

---

## 2. 目录结构

```
blog/                          # 仓库根目录
├── .github/
│   ├── copilot-instructions.md  # Copilot 工作说明
│   └── workflows/
│       └── deploy.yml           # GitHub Actions 构建部署工作流
├── archetypes/
│   └── default.md               # 新文章的默认 front matter 模板
├── content/                     # 所有内容（Markdown）
│   ├── posts/                   # 博客文章
│   │   └── _index.md
│   ├── about/                   # 关于页
│   │   └── index.md
│   └── changelog/               # 日志
│       └── _index.md
├── static/                      # 静态资源（图片、favicon 等）
│   └── me.png                   # 首页头像
├── themes/
│   └── inkwell/                 # inkwell 主题（git submodule）
├── docs/                        # 项目文档（非 Hugo 输出）
│   ├── requirements.md          # 需求分析文档
│   └── architecture.md          # 技术架构文档（本文件）
├── .gitmodules                  # submodule 配置
└── hugo.toml                    # Hugo 主配置文件
```

> **注意**：Hugo 的构建产物（`publishDir`）默认输出到 `public/`，由 GitHub Actions 发布，`public/` 不提交到仓库。`docs/` 目录专用于存放项目文档。

---

## 3. Hugo 配置要点（hugo.toml）

```toml
baseURL = "https://LingengMa.github.io/"
languageCode = "zh-cn"
title = "LingengMa's blog"
theme = "inkwell"

[menu]
  [[menu.main]]
    name = "首页"
    url = "/"
    weight = 1
  [[menu.main]]
    name = "博客"
    url = "/posts/"
    weight = 2
  [[menu.main]]
    name = "关于"
    url = "/about/"
    weight = 3
  [[menu.main]]
    name = "日志"
    url = "/changelog/"
    weight = 4
```

---

## 4. 构建与部署流程

```
作者本地                        GitHub                        GitHub Pages
─────────────────────────────────────────────────────────────────────────
写 Markdown 文章
  └─ git push ──────────────► 触发 GitHub Actions workflow
                                  └─ checkout (含 submodules)
                                  └─ setup Hugo
                                  └─ hugo build → public/
                                  └─ actions/deploy-pages ──► https://LingengMa.github.io/
```

### 本地预览

```sh
# 启动开发服务器（含草稿）
hugo server -D

# 仅构建，不启动服务器
hugo
```

### GitHub Actions 工作流

文件路径：`.github/workflows/deploy.yml`

关键步骤：
1. `actions/checkout@v4`（`submodules: recursive`）
2. `peaceiris/actions-hugo@v3`（指定 Hugo extended 版本）
3. `hugo --minify`
4. `actions/upload-pages-artifact@v3`（上传 `public/`）
5. `actions/deploy-pages@v4`（发布到 GitHub Pages）

---

## 5. 内容管理流程

### 新增博客文章

```sh
hugo new posts/my-post.md
# 编辑 content/posts/my-post.md
# 将 draft: true 改为 false（或删除该行）后提交
```

### Front matter 规范

```yaml
---
title: "文章标题"
date: 2024-01-01T00:00:00+08:00
lastmod: 2024-01-01T00:00:00+08:00
draft: false
tags: ["标签1", "标签2"]
categories: ["分类"]
---
```

---

## 6. 主题依赖说明

inkwell 主题内置以下功能（无需额外配置依赖）：

| 功能 | 实现方式 |
|------|---------|
| KaTeX 数学公式 | 主题内置 JS/CSS |
| 代码块高亮 | Hugo 内置 Chroma |
| 客户端搜索 | 主题内置 search.js |
| 文章排序 | 主题内置 sort.js |
| 目录 TOC | 主题内置 toc-inspect.js |
| 首页热力图 | 主题内置（读取 gitinfo 数据） |
| 瀑布流图片 | masonry shortcode |
| 侧注 | sidenote shortcode |

---

## 7. 注意事项

- inkwell 为 git submodule，克隆仓库后需执行 `git submodule update --init --recursive`
- GitHub Actions workflow 中需在仓库 Settings → Pages 设置 Source 为 **GitHub Actions**（而非 branch）
- `public/` 目录已加入 `.gitignore`，不提交到仓库
