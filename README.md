# AI Field Notes · AI 术语知识库

> 一个面向真实工作场景的双语 AI 概念知识库网站，用最少的时间理解一个 AI 概念，马上知道怎么用。

![HTML](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=flat-square&logo=tailwind-css&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![i18n](https://img.shields.io/badge/i18n-中文%2FEnglish-blueviolet?style=flat-square)

## 📖 项目简介

**AI Field Notes** 是一个实用型的 AI 术语知识库网站，致力于让用户「像搜索提示词一样搜索术语」。每个术语都包含一句人话解释、深入解读、日常应用场景、可直接复制的 AI 提问模板，以及相关资源链接。

网站采用纯前端实现，数据以 JSON 格式本地存储，无需后端服务，可直接部署到任意静态托管平台。支持中英文双语切换、护眼夜间模式、术语收藏、即时搜索等功能。

## ✨ 功能亮点

- **即时搜索** — 首页与术语库页均支持实时搜索，匹配术语名称、英文名与简介
- **分类浏览** — 六大分类：基础概念、提示词工程、模型架构、智能体 Agent、AI 开发工具、应用实践
- **术语详情页** — 每个术语包含：
  - 一句人话解释（先看懂）
  - 再多懂一点（深入解读）
  - 在日常中怎么用（实际场景）
  - 可以直接这样问 AI（可复制的提问模板）
  - 代码示例（可选，可展开）
  - 继续探索（论文 / GitHub 资源链接）
  - 下一步可以看（相关术语推荐）
- **中英文双语** — 一键切换界面语言与术语内容
- **护眼夜间模式** — 切换深色主题，保护视力
- **收藏功能** — 收藏感兴趣的术语，数据存储在 localStorage
- **热门术语** — 首页展示 Prompt、LLM、RAG、Agent 等高频概念
- **精选术语** — 首页推荐最值得先了解的核心概念
- **上一条/下一条** — 详情页支持快速切换相邻术语
- **示意图放大** — 术语配图支持点击放大查看
- **一键复制** — 提问模板与代码示例支持一键复制到剪贴板
- **响应式设计** — 适配桌面端、平板与手机

## 🛠 技术栈

| 类别 | 技术 |
|------|------|
| 标记语言 | HTML5（语义化结构） |
| 样式 | Tailwind CSS（自定义构建版，内联在 css/tailwind.css） |
| 交互 | 原生 JavaScript（ES6+，无框架依赖） |
| 图标 | Lucide Icons（CDN 加载） |
| 数据存储 | JSON 本地文件（data/terms.json） |
| 本地存储 | localStorage（收藏、主题、语言偏好） |
| 部署 | 任意静态托管平台 |

## 📁 项目结构

```
YGknowledgeBase/
├── index.html              # 首页（搜索、热门、分类、精选）
├── list.html               # 术语库列表页（搜索、筛选、收藏）
├── detail.html             # 术语详情页（动态渲染术语内容）
├── css/
│   └── tailwind.css        # Tailwind CSS 样式文件（含自定义样式）
├── js/
│   └── main.js             # 核心逻辑（数据加载、渲染、搜索、交互）
├── data/
│   └── terms.json          # 术语数据（中文术语 + 英文翻译内容）
├── .github/                # GitHub 配置
└── README.md               # 项目说明文档
```

## 🚀 快速开始

### 本地预览

```bash
# 克隆仓库
git clone https://github.com/YGtemple/YGknowledgeBase.git
cd YGknowledgeBase

# 启动本地服务器（必须通过 HTTP 访问，因为使用了 fetch 加载 JSON）
python3 -m http.server 8080

# 访问 http://localhost:8080
```

> ⚠️ 注意：由于项目使用 `fetch()` 加载本地 JSON 数据，不能直接用 `file://` 协议打开 `index.html`，必须通过 HTTP 服务器访问。

### 部署上线

本项目为纯静态网站，可部署到任意静态托管平台：

**GitHub Pages：**
```bash
git add .
git commit -m "feat: AI 术语知识库"
git push
# Settings → Pages → Source: main branch
```

**Netlify / Vercel / Cloudflare Pages：** 关联仓库或拖拽文件夹即可自动部署。

## 📊 数据格式

术语数据存储在 `data/terms.json` 中，结构如下：

```json
{
  "terms": [
    {
      "name": "提示词",
      "english": "Prompt",
      "category": "提示词工程",
      "simple_desc": "你给 AI 的指令，决定了它会输出什么。",
      "deep_desc": "提示词是用户与大语言模型交互的输入文本……",
      "daily_case": "写邮件时，告诉 AI 收件人身份、邮件目的和语气……",
      "code_example": "// 可选，代码示例",
      "image_url": "示意图 URL（可选）",
      "paper_url": "论文链接（可选）",
      "github_url": "GitHub 项目链接（可选）",
      "related_terms": ["大语言模型", "智能体 Agent"]
    }
  ],
  "content_en": {
    "提示词": {
      "simple_desc": "The instruction you give to AI...",
      "deep_desc": "A prompt is the input text...",
      "daily_case": "When writing an email..."
    }
  }
}
```

### 字段说明

| 字段 | 类型 | 必填 | 说明 |
|------|------|------|------|
| `name` | string | ✅ | 术语中文名 |
| `english` | string | ✅ | 术语英文名 |
| `category` | string | ✅ | 分类（基础概念/提示词工程/模型架构/智能体Agent/AI开发工具/应用实践） |
| `simple_desc` | string | ✅ | 一句人话解释 |
| `deep_desc` | string | ✅ | 深入解读 |
| `daily_case` | string | ✅ | 日常应用场景 |
| `code_example` | string | ❌ | 代码示例 |
| `image_url` | string | ❌ | 示意图 URL |
| `paper_url` | string | ❌ | 论文/官方资料链接 |
| `github_url` | string | ❌ | GitHub 项目链接 |
| `related_terms` | array | ✅ | 相关术语名称列表 |

## 🎨 设计理念

- **先用人话看懂，再决定要不要深入** — 每个术语先给一句最直白的解释
- **为真实工作而写** — 不堆砌学术定义，聚焦实际使用场景
- **像搜索提示词一样搜索术语** — 搜索体验简单直接
- **把 AI 当成有能力、但需要交代清楚的同事** — 引导用户正确使用 AI

## 🌐 功能模块详解

### 首页 (index.html)
- Hero 区域：标题 + 副标题 + 全局搜索框
- 热门术语快捷入口：Prompt / LLM / RAG / Agent
- 分类导航：六大分类一键跳转
- 精选术语：6 个高频概念卡片展示
- AI 使用理念：引导用户正确使用 AI

### 术语库 (list.html)
- 搜索框：支持术语名、英文名、简介搜索
- 分类筛选：全部 / 收藏 / 各分类
- 术语卡片网格：分类标签 + 术语名 + 简介 + 英文名
- 收藏按钮：每个卡片可收藏/取消收藏
- 结果计数：实时显示搜索结果数量

### 详情页 (detail.html)
- 返回按钮 + 分类标签 + 术语名 + 英文名
- 一句人话解释（高亮展示）
- 再多懂一点（深入解读）
- 示意图（可点击放大）
- 在日常中怎么用
- 可以直接这样问 AI（可复制提问模板）
- 代码示例（可展开/折叠，可复制）
- 继续探索（论文 / GitHub 资源）
- 上一条 / 下一条导航
- 侧边栏：相关术语推荐

## 🔧 本地存储

网站使用 localStorage 保存用户偏好：

| Key | 说明 | 默认值 |
|-----|------|--------|
| `field-notes-favorites` | 收藏的术语列表 | `[]` |
| `field-notes-theme` | 主题（light / night） | `light` |
| `field-notes-language` | 语言（zh / en） | `zh` |

## 📝 添加新术语

1. 打开 `data/terms.json`
2. 在 `terms` 数组中添加新术语对象
3. 如需英文内容，在 `content_en` 中添加对应翻译
4. 确保 `related_terms` 中的术语名称已存在
5. 保存后刷新页面即可

## 🎯 术语分类

| 分类 | 说明 |
|------|------|
| **基础概念** | AI 领域最基础的核心概念 |
| **提示词工程** | Prompt 设计与优化相关技术 |
| **模型架构** | 大模型底层架构与技术原理 |
| **智能体 Agent** | AI Agent 相关概念与框架 |
| **AI开发工具** | AI 开发常用工具与平台 |
| **应用实践** | AI 在实际场景中的应用方法 |

## 📄 许可证

本项目采用 MIT 许可证开源。

## 📮 联系方式

- GitHub：[@YGtemple](https://github.com/YGtemple)
- 项目地址：[github.com/YGtemple/YGknowledgeBase](https://github.com/YGtemple/YGknowledgeBase)
