const DATA_URL = 'data/terms.json';
let terms = [];
let englishContent = {};
let selectedCategory = '全部';
const $ = (selector, root = document) => root.querySelector(selector);
const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));
const hrefFor = name => `detail.html?term=${encodeURIComponent(name)}`;

const copy = {
  zh: {
    home: '首页', glossary: '术语库', eyebrow: 'AI KNOWLEDGE, WITHOUT THE NOISE', heroTitle: '找到需要的 AI 概念，<br>马上知道怎么用。', heroLead: '像搜索提示词一样搜索术语。先用人话看懂，再决定要不要深入。', searchPlaceholder: '搜索术语，例如 Token、RAG、Agent', searchHint: '即时搜索', popular: '热门：', browseByTopic: '按主题浏览', featuredTitle: '从高频概念开始', featuredLead: '这些是日常使用 AI 时最值得先弄明白的词。', viewAll: '浏览全部术语', workflowEyebrow: 'USE AI WELL', workflowTitle: '把 AI 当成有能力、但需要交代清楚的同事。', workflowLead: '每次提问都尽量明确目标、背景和结果形式；每次重要输出都保留自己的判断。', learnPrompt: '学习如何写提示词', learnRag: '理解资料检索 RAG', footer: '为真实工作而写的 AI 概念笔记', glossaryEyebrow: 'THE KNOWLEDGE LIBRARY', glossaryTitle: '术语库', glossaryLead: '点击一张卡片，用最少的时间理解一个概念。', listPlaceholder: '搜索术语名称、英文或一句话介绍', all: '全部', favorites: '收藏', result: '个结果', terms: '个术语', empty: '没有找到匹配词条，换个关键词或分类试试。', back: '返回术语库', simple: '一句人话', deep: '再多懂一点', daily: '在日常中怎么用', quick: '可以直接这样问 AI', quickIntro: '复制这句，再把方括号中的内容换成你的实际任务。', copy: '复制', copied: '已复制', code: '代码示例', showCode: '展开代码示例', resources: '继续探索', paper: '阅读论文 / 官方资料', github: '查看 GitHub 项目', related: '下一步可以看', prev: '上一条', next: '下一条', diagram: '示意图：点击放大查看', themeTitle: '切换护眼夜间模式', language: '切换至 English'
  },
  en: {
    home: 'Home', glossary: 'Glossary', eyebrow: 'AI KNOWLEDGE, WITHOUT THE NOISE', heroTitle: 'Find an AI concept.<br>Know how to use it.', heroLead: 'Search this glossary as easily as a prompt. Understand the plain-language version first, then go deeper only when you need to.', searchPlaceholder: 'Search Token, RAG, Agent...', searchHint: 'Live search', popular: 'Popular:', browseByTopic: 'BROWSE BY TOPIC', featuredTitle: 'Start with the essentials', featuredLead: 'The ideas that make everyday AI work easier to understand.', viewAll: 'Browse all terms', workflowEyebrow: 'USE AI WELL', workflowTitle: 'Treat AI like a capable colleague that needs a clear brief.', workflowLead: 'State the goal, context, and desired result. Keep your own judgment for important work.', learnPrompt: 'Learn prompt writing', learnRag: 'Understand RAG', footer: 'Practical notes for using AI in real work', glossaryEyebrow: 'THE KNOWLEDGE LIBRARY', glossaryTitle: 'Glossary', glossaryLead: 'Open a card and understand one idea in minutes.', listPlaceholder: 'Search a term, English name, or short description', all: 'All', favorites: 'Favorites', result: 'results', terms: 'terms', empty: 'No matching term. Try another keyword or category.', back: 'Back to glossary', simple: 'In plain language', deep: 'A little deeper', daily: 'Use it in daily work', quick: 'Try asking AI this', quickIntro: 'Copy this prompt, then replace the text in brackets with your own task.', copy: 'Copy', copied: 'Copied', code: 'Code example', showCode: 'Show code example', resources: 'Keep exploring', paper: 'Paper / official reference', github: 'Open GitHub project', related: 'Read next', prev: 'Previous', next: 'Next', diagram: 'Diagram: click to enlarge', themeTitle: 'Switch eye-care night mode', language: 'Switch to Chinese'
  }
};
const categoryNames = {
  '基础概念': { zh: '基础概念', en: 'Fundamentals' }, '提示词工程': { zh: '提示词工程', en: 'Prompting' }, '模型架构': { zh: '模型架构', en: 'Model Architecture' }, '智能体Agent': { zh: '智能体 Agent', en: 'AI Agents' }, 'AI开发工具': { zh: 'AI开发工具', en: 'Developer Tools' }, '应用实践': { zh: '应用实践', en: 'Practical Use' }
};
function lang() { return document.documentElement.dataset.lang || 'zh'; }
function text(key) { return copy[lang()][key] || key; }
function category(term) { return categoryNames[term.category]?.[lang()] || term.category; }
function titleFor(term) { return lang() === 'en' ? term.english : term.name; }
function secondaryTitle(term) { return lang() === 'en' ? term.name : term.english; }
function field(term, key) { return lang() === 'en' ? englishContent[term.name]?.[key] || term[key] : term[key]; }
function makePrompt(term) { return lang() === 'en' ? `Explain ${term.english} for a beginner. My situation is [describe your task]. Give me one practical example and one thing I should double-check.` : `请用外行能听懂的话解释「${term.name}」。我的场景是：[描述你的任务]。请给一个实际用法，并提醒我一个需要自己核对的地方。`; }
function savedTerms() { return new Set(JSON.parse(localStorage.getItem('field-notes-favorites') || '[]')); }
function isSaved(name) { return savedTerms().has(name); }
function toggleSaved(name) { const saved = savedTerms(); saved.has(name) ? saved.delete(name) : saved.add(name); localStorage.setItem('field-notes-favorites', JSON.stringify([...saved])); }

function setTheme(theme) { document.documentElement.dataset.theme = theme; localStorage.setItem('field-notes-theme', theme); }
function setLanguage(value) { document.documentElement.dataset.lang = value; document.documentElement.lang = value === 'en' ? 'en' : 'zh-CN'; localStorage.setItem('field-notes-language', value); }
function setupPreferences() {
  setTheme(localStorage.getItem('field-notes-theme') || 'light');
  setLanguage(localStorage.getItem('field-notes-language') || 'zh');
  $('#theme-toggle')?.addEventListener('click', () => { setTheme(document.documentElement.dataset.theme === 'night' ? 'light' : 'night'); refreshPage(); });
  $('#language-toggle')?.addEventListener('click', () => { setLanguage(lang() === 'zh' ? 'en' : 'zh'); refreshPage(); });
}
function updateStaticText() {
  document.querySelectorAll('[data-i18n]').forEach(node => node.innerHTML = text(node.dataset.i18n));
  document.querySelectorAll('[data-i18n-placeholder]').forEach(node => node.placeholder = text(node.dataset.i18nPlaceholder));
  const languageToggle = $('#language-toggle');
  if (languageToggle) { languageToggle.setAttribute('aria-label', text('language')); $('span', languageToggle).textContent = lang() === 'zh' ? 'EN' : '中文'; }
  const themeToggle = $('#theme-toggle');
  if (themeToggle) { themeToggle.title = text('themeTitle'); themeToggle.setAttribute('aria-label', text('themeTitle')); }
}
function termCard(term) { const saved = isSaved(term.name); return `<article class="card term-card knowledge-card"><button class="favorite-toggle ${saved ? 'saved' : ''}" data-favorite="${escapeHtml(term.name)}" aria-label="${text('favorites')}" aria-pressed="${saved}"><i data-lucide="bookmark" width="16"></i></button><a class="term-card-link" href="${hrefFor(term.name)}"><span class="tag">${escapeHtml(category(term))}</span><h3>${escapeHtml(titleFor(term))}</h3><p>${escapeHtml(field(term, 'simple_desc'))}</p><div class="card-foot"><span class="english">${escapeHtml(secondaryTitle(term))}</span><span class="card-arrow">↗</span></div></a></article>`; }
function bindFavoriteButtons(root = document) { root.querySelectorAll('[data-favorite]').forEach(button => { button.onclick = () => { toggleSaved(button.dataset.favorite); button.classList.toggle('saved', isSaved(button.dataset.favorite)); button.setAttribute('aria-pressed', String(isSaved(button.dataset.favorite))); if (selectedCategory === '__favorites__' && document.body.dataset.page === 'list') renderList($('#global-search').value); }; }); }
function matches(term, query) { const q = query.trim().toLowerCase(); return !q || `${term.name} ${term.english} ${term.simple_desc} ${field(term, 'simple_desc')}`.toLowerCase().includes(q); }
function renderCategoryNav() {
  const target = $('#category-nav'); if (!target) return;
  const categories = [...new Set(terms.map(term => term.category))];
  target.innerHTML = categories.map(name => `<a href="list.html?category=${encodeURIComponent(name)}"><span>${escapeHtml(category({ category: name }))}</span><i data-lucide="arrow-up-right" width="15"></i></a>`).join('');
}
function initHome() {
  renderCategoryNav();
  const featuredNames = ['人工智能', '大语言模型', '提示词', 'RAG', '智能体 Agent', '多模态'];
  $('#featured-terms').innerHTML = featuredNames.map(name => terms.find(term => term.name === name)).filter(Boolean).map(termCard).join('');
  bindFavoriteButtons($('#featured-terms'));
  const input = $('#global-search'); const results = $('#search-results');
  if (input) input.oninput = () => { const found = terms.filter(term => matches(term, input.value)).slice(0, 6); results.innerHTML = input.value.trim() ? (found.length ? found.map(term => `<a href="${hrefFor(term.name)}"><span>${escapeHtml(titleFor(term))}</span><small>${escapeHtml(field(term, 'simple_desc'))}</small><b>↗</b></a>`).join('') : `<div class="empty compact-empty">${text('empty')}</div>`) : ''; };
}
function initList() {
  const params = new URLSearchParams(location.search); selectedCategory = params.get('category') || '全部';
  const input = $('#global-search'); input.value = params.get('q') || '';
  const filterArea = $('#filters'); const categories = ['全部', '__favorites__', ...new Set(terms.map(term => term.category))];
  filterArea.innerHTML = categories.map(name => `<button class="filter ${name === selectedCategory ? 'active' : ''}" data-category="${escapeHtml(name)}">${name === '全部' ? text('all') : name === '__favorites__' ? text('favorites') : escapeHtml(category({ category: name }))}</button>`).join('');
  filterArea.onclick = event => { const button = event.target.closest('[data-category]'); if (!button) return; selectedCategory = button.dataset.category; document.querySelectorAll('.filter').forEach(item => item.classList.toggle('active', item === button)); renderList(input.value); };
  input.oninput = () => renderList(input.value); renderList(input.value);
}
function renderList(query) {
  const found = terms.filter(term => (selectedCategory === '全部' || (selectedCategory === '__favorites__' ? isSaved(term.name) : term.category === selectedCategory)) && matches(term, query));
  $('#term-grid').innerHTML = found.length ? found.map(termCard).join('') : `<div class="empty">${text('empty')}</div>`;
  bindFavoriteButtons($('#term-grid'));
  $('#search-count').textContent = query.trim() ? `${found.length} ${text('result')}` : `${found.length} ${text('terms')}`;
}
function articleBlock(title, content, extra = '') { return `<section class="article-section ${extra}"><h2><span class="section-bar"></span>${title}</h2>${content}</section>`; }
function initDetail() {
  const requested = new URLSearchParams(location.search).get('term'); const index = Math.max(0, terms.findIndex(term => term.name === requested)); const term = terms[index] || terms[0];
  if (!term) return;
  document.title = `${titleFor(term)} · AI Field Notes`;
  const image = term.image_url ? `<div class="visual"><img src="${escapeHtml(term.image_url)}" alt="${escapeHtml(titleFor(term))} diagram" data-zoom><p class="caption">${text('diagram')}</p></div>` : '';
  const resourceLinks = term.paper_url || term.github_url ? `<div class="resources">${term.paper_url ? `<a class="resource" href="${escapeHtml(term.paper_url)}" target="_blank" rel="noopener"><i data-lucide="file-text" width="16"></i>${text('paper')}</a>` : ''}${term.github_url ? `<a class="resource" href="${escapeHtml(term.github_url)}" target="_blank" rel="noopener"><i data-lucide="github" width="16"></i>${text('github')}</a>` : ''}</div>` : '';
  const related = term.related_terms.map(name => terms.find(item => item.name === name)).filter(Boolean).map(item => `<a href="${hrefFor(item.name)}"><span>${escapeHtml(titleFor(item))}</span><span>→</span></a>`).join('');
  const code = term.code_example ? `<details class="code-details"><summary>${text('showCode')}</summary><div class="code-box"><button data-copy-code>${text('copy')}</button><pre><code>${escapeHtml(term.code_example)}</code></pre></div></details>` : '';
  const previous = terms[(index - 1 + terms.length) % terms.length]; const next = terms[(index + 1) % terms.length]; const prompt = makePrompt(term);
  $('#detail-root').innerHTML = `<a class="back-link" href="list.html">← ${text('back')}</a><div class="detail-head"><span class="tag">${escapeHtml(category(term))}</span><h1>${escapeHtml(titleFor(term))}</h1><div class="english">${escapeHtml(secondaryTitle(term))}</div></div><div class="detail-layout"><article>${articleBlock(text('simple'), `<div class="highlight">${escapeHtml(field(term, 'simple_desc'))}</div>`)}${articleBlock(text('deep'), `<p>${escapeHtml(field(term, 'deep_desc'))}</p>`)}${image}${articleBlock(text('daily'), `<p>${escapeHtml(field(term, 'daily_case'))}</p>`)}${articleBlock(text('quick'), `<div class="quick-prompt"><p>${text('quickIntro')}</p><div><code>${escapeHtml(prompt)}</code><button class="copy-prompt" data-copy-prompt title="${text('copy')}" aria-label="${text('copy')}"><i data-lucide="copy" width="17"></i></button></div></div>`)}${code ? articleBlock(text('code'), code) : ''}${resourceLinks ? articleBlock(text('resources'), resourceLinks) : ''}<nav class="pager"><a href="${hrefFor(previous.name)}"><small>← ${text('prev')}</small><strong>${escapeHtml(titleFor(previous))}</strong></a><a href="${hrefFor(next.name)}"><small>${text('next')} →</small><strong>${escapeHtml(titleFor(next))}</strong></a></nav></article><aside class="card side-panel"><p class="eyebrow">${text('related')}</p><div class="related-list">${related || `<span class="english">—</span>`}</div></aside></div>`;
  $('[data-copy-code]')?.addEventListener('click', event => copyText(term.code_example, event.currentTarget));
  $('[data-copy-prompt]')?.addEventListener('click', event => copyText(prompt, event.currentTarget));
  $('[data-zoom]')?.addEventListener('click', event => { $('#lightbox-image').src = event.currentTarget.src; $('#lightbox').classList.add('open'); });
  $('#lightbox-close')?.addEventListener('click', () => $('#lightbox').classList.remove('open')); $('#lightbox')?.addEventListener('click', event => { if (event.target.id === 'lightbox') event.currentTarget.classList.remove('open'); });
}
async function copyText(value, button) { try { await navigator.clipboard.writeText(value); showToast(text('copied')); if (button.tagName === 'BUTTON' && !button.querySelector('svg')) button.textContent = text('copied'); } catch { showToast(value); } }
function showToast(message) { const toast = $('#toast'); if (!toast) return; toast.textContent = message; toast.classList.add('show'); setTimeout(() => toast.classList.remove('show'), 1800); }
function refreshPage() { updateStaticText(); const page = document.body.dataset.page; if (page === 'home') initHome(); else if (page === 'list') initList(); else initDetail(); if (window.lucide) lucide.createIcons(); }
fetch(DATA_URL).then(response => response.json()).then(data => { terms = data.terms || data; englishContent = data.content_en || {}; setupPreferences(); refreshPage(); }).catch(() => { const root = $('#term-grid') || $('#detail-root') || $('#featured-terms'); if (root) root.innerHTML = '<div class="empty">Unable to load local glossary data.</div>'; });
