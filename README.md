# YGknowledgeBase ·「AI Field Notes」双语 AI 术语知识库网站

> 一句话简介：纯前端零后端的 AI 术语知识库——每个概念"一句人话解释+深入解读+日常用法+可复制提问模板"，中英双语、护眼夜间模式、即时搜索与收藏。

## 一、项目概述与定位

**AI Field Notes** 是一个实用型 AI 术语知识库网站，口号是"像搜索提示词一样搜索术语"，用最少时间理解一个 AI 概念并马上知道怎么用。它**纯前端实现、数据以 JSON 本地存储、无需后端**，可部署到任意静态托管平台。

每个术语的内容结构遵循"先看懂再深入"：①一句人话解释 → ②再多懂一点（深入解读）→ ③在日常中怎么用（实际场景）→ ④可以直接这样问 AI（可复制提问模板）→ ⑤代码示例（可选）→ ⑥继续探索（论文/GitHub 资源）→ ⑦相关术语推荐。

设计理念：先用人话看懂、为真实工作而写、搜索体验简单直接、"把 AI 当成有能力但需要交代清楚的同事"。

## 二、功能

- **即时搜索**：首页与术语库页实时匹配术语名、英文名、简介。
- **分类浏览**：六大分类——基础概念、提示词工程、模型架构、智能体 Agent、AI 开发工具、应用实践。
- **术语详情页**：一句人话解释（高亮）、深入解读、可放大示意图、日常用法、可复制提问模板、可展开代码示例、继续探索资源、上一条/下一条、相关术语侧边栏。
- **中英双语**：一键切换界面语言与术语内容（`content_en` 提供英文翻译）。
- **护眼夜间模式**、**收藏功能**（localStorage）、**热门术语快捷入口**（Prompt/LLM/RAG/Agent）、**精选术语推荐**、**一键复制**提问模板与代码。
- **响应式**：桌面/平板/手机自适应。

## 三、技术栈

| 类别 | 技术 |
|---|---|
| 结构 | HTML5 语义化 |
| 样式 | Tailwind CSS 自定义构建版（内联在 `css/tailwind.css`，16KB） |
| 交互 | 原生 JavaScript ES6+（`js/main.js`，16KB，无框架） |
| 图标 | Lucide Icons（CDN） |
| 数据 | 本地 `data/terms.json`（约 47.8KB） |
| 本地存储 | localStorage（收藏/主题/语言偏好） |
| CI | GitHub Actions（`.github/workflows/jekyll-docker.yml`） |

## 四、目录结构

```
YGknowledgeBase/
├── index.html              # 首页（Hero+全局搜索/热门术语/分类导航/精选卡片/AI使用理念）
├── list.html               # 术语库列表页（搜索+分类筛选+收藏+卡片网格）
├── detail.html             # 术语详情页（动态渲染单个术语）
├── css/tailwind.css        # Tailwind 自定义样式（16KB）
├── js/main.js              # 核心逻辑：fetch 加载数据/渲染/搜索/收藏/主题/双语切换（16KB）
├── data/terms.json         # 术语数据（中文术语数组 + content_en 英文翻译，约 47.8KB）
├── .github/workflows/jekyll-docker.yml  # 部署 CI（476B）
└── README.md               # 项目说明
```

## 五、关键内容解读

- **`data/terms.json`**：核心知识库。结构为 `{ "terms": [...], "content_en": {...} }`。每个术语对象字段：`name`（中文名）、`english`（英文名）、`category`、`simple_desc`（一句人话）、`deep_desc`（深入解读）、`daily_case`（日常场景）、可选 `code_example`/`image_url`/`paper_url`/`github_url`、`related_terms`（相关术语名数组）；`content_en` 按术语名提供英文 `simple_desc/deep_desc/daily_case`。
- **`js/main.js`**：用 `fetch()` 加载 JSON，负责首页/列表/详情三页渲染、实时搜索、分类筛选、收藏读写、深浅主题切换、中英切换、相邻术语导航、复制到剪贴板。
- **localStorage 三个 key**：`field-notes-favorites`（收藏列表）、`field-notes-theme`（light/night）、`field-notes-language`（zh/en）。
- **运行注意**：因用 `fetch` 加载本地 JSON，**不能用 `file://` 直接打开**，必须起 HTTP 服务（`python3 -m http.server 8080`）。

## 六、运行与使用

```bash
git clone … && cd YGknowledgeBase
python3 -m http.server 8080   # 访问 http://localhost:8080
```

新增术语：在 `data/terms.json` 的 `terms` 数组加对象、必要时在 `content_en` 加翻译、确保 `related_terms` 名称存在，刷新即可。

## 七、数据/资源构成

全部为**文本文件**（HTML/CSS/JS/JSON/YAML/Markdown），**无图片、音视频、字体、压缩包等二进制文件**；术语配图为可选的外链 `image_url`。术语数据约数十条（存于 terms.json）。

## 八、项目特点

1. **内容产品而非代码产品**：核心价值在 `terms.json` 的术语释义质量，技术实现极简（无框架、无后端）。
2. **双语 + 可扩展数据模型**：新增术语只改 JSON，前端自动渲染，便于持续扩充。
3. **实用导向**：每条术语都配"可直接复制的提问模板"和日常场景，降低从概念到上手的门槛。
