# 配置说明文档

本文档说明博客的所有可配置项，帮助你快速完成个人信息填写、图片替换、导航调整等操作。

---

## 目录

1. [基础信息](#1-基础信息)
2. [个人信息与联系方式](#2-个人信息与联系方式)
3. [首页社交图标](#3-首页社交图标)
4. [导航栏分区](#4-导航栏分区)
5. [图片配置](#5-图片配置)
6. [Favicon 配置](#6-favicon-配置)
7. [字体配置](#7-字体配置)
8. [新增文章](#8-新增文章)

---

## 1. 基础信息

**文件**：`hugo.toml`

```toml
baseURL = 'https://LingengMa.github.io/'   # 你的 GitHub Pages 地址，末尾保留斜杠
languageCode = 'zh-cn'                      # 网站语言
title = "LingengMa's blog"                 # 浏览器标签页标题 & 站点全局标题
```

| 字段 | 说明 |
|------|------|
| `baseURL` | 必须与 GitHub Pages 实际地址一致，否则 CSS/JS 资源路径会出错 |
| `title` | 显示在浏览器标签页和 RSS 订阅名称中 |

---

## 2. 个人信息与联系方式

**文件**：`hugo.toml` → `[params]` 与 `[params.author]`

```toml
[params]
  sitename    = "LingengMa's blog"     # 导航栏左侧显示的站点名
  description = "..."                  # 网页 <meta> 描述，影响搜索引擎摘要
  contact     = "<p>你好，...</p>"     # 关于页和文章底部的个人介绍（支持 HTML）

  [params.author]
    name  = "LingengMa"               # 版权信息中的姓名 & RSS 作者字段
    email = "LingengMa@qq.com"        # RSS managingEditor 字段
```

> **`contact` 字段**：在关于页（`/about/`）和每篇文章底部都会显示这段 HTML，可以放自我介绍、联系方式等内容。支持换行、超链接等标准 HTML 标签。

---

## 3. 首页社交图标

**文件**：`hugo.toml` → `[[params.socials]]`，**图标文件**：`static/svg/`

```toml
[[params.socials]]
  svg   = "/svg/email.svg"          # 图标路径（相对于 static/ 目录）
  label = "Email"                   # alt 文字，屏幕阅读器使用
  link  = "mailto:LingengMa@qq.com" # 点击跳转地址
```

### 图标文件说明

图标统一存放在 `static/svg/` 目录，已内置三个：

| 文件 | 图标 |
|------|------|
| `static/svg/email.svg` | 邮件信封 |
| `static/svg/github.svg` | GitHub 图标 |
| `static/svg/rss.svg` | RSS 订阅图标 |

### 添加新的社交图标

1. 将你的 SVG 文件放到 `static/svg/` 目录，例如 `twitter.svg`
2. SVG 文件要求：使用 `currentColor` 作为填色/描边颜色，这样图标会自动继承文字颜色
3. 在 `hugo.toml` 中追加一条：
   ```toml
   [[params.socials]]
     svg   = "/svg/twitter.svg"
     label = "Twitter"
     link  = "https://twitter.com/yourname"
   ```

### 链接格式

| 链接类型 | 格式示例 |
|----------|---------|
| 邮件 | `mailto:you@example.com` |
| 外部网站 | `https://github.com/yourname` |
| 站内页面 | `/about/` 或 `/index.xml` |

---

## 4. 导航栏分区

**文件**：`hugo.toml` → `[[params.sections]]`

```toml
[[params.sections]]
  zh_name = "博客"      # 导航栏显示的文字
  link    = "/posts/"   # 点击跳转的路径
  # external = true     # 取消注释则在新标签页打开（适合外部链接）
```

> **注意**：`link` 对应的是 `content/` 目录下的分区名称。例如 `link = "/posts/"` 对应 `content/posts/` 目录。

---

## 5. 图片配置

### 5.1 首页头像（`me.png`）

**路径**：`static/me.png`

- 格式：PNG（也可以是 JPG，但需同时修改模板中的引用）
- 建议尺寸：200×200 px 或更高，正方形
- **替换方法**：直接覆盖 `static/me.png` 文件即可，无需修改任何代码

头像会显示在两处：
1. 首页中央
2. 关于页和文章底部的 contact 区域

### 5.2 文章内图片

将图片放到 `static/` 目录（或其子目录），在文章中用标准 Markdown 引用：

```markdown
![图片描述](/images/my-photo.jpg)
```

也可以使用主题提供的带说明文字的短代码：

```
{{< img-with-caption src="/images/my-photo.jpg" caption="图片说明文字" >}}
```

---

## 6. Favicon 配置

**目录**：`static/favicon_io/`

目前使用的是占位图（纯色方块），建议替换为真实 favicon。

### 推荐生成方式

1. 准备一张 512×512 的 PNG 图片（可以是你的头像或 logo）
2. 前往 [favicon.io](https://favicon.io/favicon-converter/) 上传并生成
3. 下载压缩包，将其中所有文件解压到 `static/favicon_io/` 目录（覆盖现有文件）

需要的文件列表：

```
static/favicon_io/
  favicon.ico
  favicon-16x16.png
  favicon-32x32.png
  apple-touch-icon.png
  android-chrome-192x192.png
  android-chrome-512x512.png
```

同时确保 `static/site.webmanifest` 中的 `name` 与你的站点名一致：

```json
{
  "name": "LingengMa's blog",
  "short_name": "LingengMa",
  ...
}
```

---

## 7. 字体配置

博客使用 **Sarasa Fixed Slab SC**（更纱等宽黑体固定板SC）作为全站字体，与参考站点 rqdmap.top 保持一致。字体通过 woff2 格式在 `static/fonts/` 目录提供。

### 字体文件

```
static/fonts/
  SarasaFixedSlabSCNerdFont-Regular.woff2   # 正文字重（约 45KB）
  SarasaFixedSlabSCNerdFont-Bold.woff2      # 粗体字重（约 45KB）
```

这两个文件是从系统字体中按站点内容**子集化**（subsetting）后生成的，只包含实际用到的字符，因此体积很小。

### 更新字体（新增大量中文内容后）

每当博客内容大量增加时，新出现的汉字可能不在当前字体子集中，导致浏览器回退到系统字体显示。运行以下命令重新生成：

```sh
python3 scripts/gen_fonts.py
```

**前提**：
- 系统已安装 Sarasa Gothic 字体包（Arch Linux：`sudo pacman -S ttf-sarasa-gothic`）
- Python 依赖：`pip install fonttools brotli`

脚本会自动扫描 `content/` 下所有 Markdown 文件，合并所需字符后重新裁剪字体。

### 字体渲染范围

脚本除站点实际字符外，还固定包含以下 Unicode 范围（确保代码、数字、英文等始终可用）：

| Unicode 范围 | 内容 |
|-------------|------|
| U+0020–U+00FF | 基础拉丁 + Latin-1 |
| U+2000–U+206F | 通用标点 |
| U+3000–U+303F | CJK 标点符号 |
| U+FF00–U+FFEF | 全角字符 |

---

## 8. 新增文章

```sh
# 新建一篇博客文章
hugo new posts/my-post-title.md
```

生成的文件位于 `content/posts/my-post-title.md`，初始内容：

```toml
+++
title = 'My Post Title'
date = '2026-03-25T00:00:00+08:00'
lastmod = '2026-03-25T00:00:00+08:00'
draft = true
tags = []
categories = []
+++
```

- 写完后将 `draft = true` 改为 `draft = false`，提交后 CI 会自动构建发布
- `lastmod` 字段控制"修改时间"排序，每次修改文章时手动更新

### 常用写作功能

**数学公式**（KaTeX）：
```
行内公式：$E = mc^2$
块级公式：$$\int_0^\infty f(x) dx$$
```

**代码块**（支持语法高亮）：
```
​```python
def hello():
    print("Hello!")
​```
```

**瀑布流图片**：
```
{{< masonry >}}
{{< masonry-item src="/images/a.jpg" caption="说明" >}}
{{< masonry-item src="/images/b.jpg" caption="说明" >}}
{{< /masonry >}}
```

**侧注**：
```
{{< sidenote >}}这是一条侧注内容。{{< /sidenote >}}
```
