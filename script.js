/* ═══════════════════════════════════════════════════════
   Resume Builder Pro — script.js
   Features: bilingual, PDF export, typography sliders,
             paper sizes, page breaks, color themes,
             font upload, avatar management
════════════════════════════════════════════════════════ */

'use strict';

/* ── Bilingual Data ──────────────────────────────────── */
const LANG_DATA = {
  en: {
    langLabel: 'Chinese', layoutLabel: 'Portrait',
    headers: { skills: 'Skills', education: 'Education', info: 'Profile', summary: 'Summary', work: 'Work Experience', projects: 'Projects' },
    name: 'Alexandra Chen',
    title: 'Senior Product Designer · UX Strategist',
    contact: ['alex.chen@email.com', '+1 (415) 555-0192', 'linkedin.com/in/alexchen', 'San Francisco, CA'],
    summary: 'Product designer with 6+ years crafting human-centered digital experiences across fintech, health, and SaaS. I bridge strategy and execution — from discovery research through pixel-perfect delivery. Passionate about design systems, accessibility, and building products that genuinely improve people\'s lives.',
    skills: [['UI/UX Design', 92], ['Figma & Sketch', 88], ['Prototyping', 85], ['User Research', 80], ['HTML / CSS', 75]],
    work: [
      {
        title: 'Lead Product Designer', date: '2022 – Present', org: 'Stripe · San Francisco, CA',
        bullets: ['Redesigned the merchant dashboard, reducing task completion time by 34% across 2M+ users.', 'Built and maintained a cross-platform design system (120+ components) adopted by 8 product teams.', 'Led a 0→1 feature launch for revenue analytics, driving a 22% uplift in Pro plan conversions.']
      },
      {
        title: 'Senior UX Designer', date: '2019 – 2022', org: 'Airbnb · San Francisco, CA',
        bullets: ['Owned end-to-end design for the Host onboarding flow, improving activation rate by 18%.', 'Conducted 40+ user interviews and synthesized insights that shaped Q3 roadmap priorities.']
      }
    ],
    projects: [
      { title: 'HealthPath — Patient Journey App', date: '2023', desc: 'End-to-end design for a care navigation app serving 50K+ patients. Reduced appointment no-shows by 28% through smart reminders and a simplified scheduling flow. Won the HIMSS Innovation Award 2023.' }
    ],
    edu: [{ title: 'B.F.A. Interaction Design', org: 'California College of the Arts', date: '2014 – 2018' }],
    info: [['Birthday', 'Nov 12, 1996'], ['Nationality', 'American'], ['Languages', 'EN · ZH']],
    addWork: '+ Add Experience', addProject: '+ Add Project', addSkill: '+ Add Skill', addEdu: '+ Add Education', addInfo: '+ Add Info',
    download: 'Download PDF',
  },
  zh: {
    langLabel: 'English', layoutLabel: '横版',
    headers: { skills: '专业技能', education: '教育背景', info: '基本信息', summary: '个人简介', work: '工作经历', projects: '项目经历' },
    name: '陈 晓 琳',
    title: '高级产品设计师 · 用户体验策略师',
    contact: ['xiaolin.chen@example.com', '+86 138 2108 8000', 'linkedin.com/in/chenxl', '上海市徐汇区'],
    summary: '拥有 6 年以上人机交互设计经验，深耕金融科技、医疗健康与 SaaS 领域。擅长从用户研究到像素级交付的全流程把控，主导过多个亿级用户产品的设计体系建设，曾获红点设计奖、UXPA 中国年度最佳设计师荣誉。',
    skills: [['UI/UX 设计', 92], ['Figma / Sketch', 88], ['交互原型', 85], ['用户研究', 80], ['HTML / CSS', 75]],
    work: [
      {
        title: '高级产品设计师', date: '2022 – 至今', org: '蚂蚁集团 · 上海',
        bullets: ['主导商家后台全面改版，核心任务完成效率提升 34%，覆盖 2000 万+用户。', '从零构建跨平台设计系统，沉淀 120+ 组件，被 8 个业务线采用。', '主导收益分析模块从 0 到 1 落地，助推 Pro 套餐转化率提升 22%。']
      },
      {
        title: 'UX 设计师', date: '2019 – 2022', org: '字节跳动 · 北京',
        bullets: ['负责创作者入驻流程端到端设计，激活率提升 18%。', '开展 40+ 轮用户访谈，产出洞察报告直接影响 Q3 产品路线图。']
      }
    ],
    projects: [
      { title: '慧医路 — 患者就诊引导 App', date: '2023', desc: '面向 5 万+患者的就医导航应用全链路设计，通过智能提醒与预约流程简化，将爽约率降低 28%，荣获 2023 年中国优秀医疗信息化创新奖。' }
    ],
    edu: [{ title: '交互设计 学士', org: '同济大学 设计创意学院', date: '2014 – 2018' }],
    info: [['出生年月', '1996.11'], ['籍贯', '上海'], ['语言能力', '中文 · 英文 CET-6']],
    addWork: '+ 添加工作经历', addProject: '+ 添加项目', addSkill: '+ 添加技能', addEdu: '+ 添加教育', addInfo: '+ 添加信息',
    download: '下载 PDF',
  }
};

/* ── State ───────────────────────────────────────────── */
let currentLang = 'zh';
let currentLayout = 'portrait';
let currentPaper = 'A4';
let showBreaks = true;
let accentColor = '#5A8BA8';

/* ── Helpers ─────────────────────────────────────────── */
const $ = id => document.getElementById(id);
const el = (tag, cls, text) => {
  const e = document.createElement(tag);
  if (cls) e.className = cls;
  if (text !== undefined) e.textContent = text;
  return e;
};

function toast(msg, dur = 2400) {
  let t = $('toast');
  if (!t) { t = el('div'); t.id = 'toast'; document.body.appendChild(t); }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), dur);
}

function setAccent(hex) {
  accentColor = hex;
  document.documentElement.style.setProperty('--accent', hex);
  // derive light variant
  document.documentElement.style.setProperty('--accent-light', hex + 'CC');
  document.documentElement.style.setProperty('--accent-dim', hex + '20');
}

/* ── Paper dimensions (mm → px at 96dpi) ────────────── */
const PAPER = {
  A3: { w: 297, h: 420 },
  A4: { w: 210, h: 297 },
  A5: { w: 148, h: 210 },
  B4: { w: 250, h: 353 },
  B5: { w: 176, h: 250 },
  Letter: { w: 215.9, h: 279.4 },
  Legal: { w: 215.9, h: 355.6 },
  Tabloid: { w: 279.4, h: 431.8 },
  Executive: { w: 184.2, h: 266.7 },
};
function mmToPx(mm) { return mm * 3.7795275591; }

function applyPaper(wMm, hMm) {
  const paper = $('resume-paper');
  paper.style.setProperty('--paper-w', wMm + 'mm');
  paper.style.setProperty('--paper-h', hMm + 'mm');
  if (showBreaks) renderBreaks(wMm, hMm);
}

/* ── Page Break Lines ────────────────────────────────── */
function renderBreaks(wMm, hMm) {
  clearBreaks();
  if (!showBreaks) return;
  const pageH = mmToPx(hMm);
  if (pageH <= 0) return;
  const paper = $('resume-paper');
  const paperPxH = paper.offsetHeight;
  let y = pageH;
  while (y < paperPxH) {
    const line = el('div', 'page-break-line no-export');
    line.style.top = y + 'px';
    paper.appendChild(line);
    y += pageH;
  }
}
function clearBreaks() {
  document.querySelectorAll('.page-break-line').forEach(l => l.remove());
}

/* ── Section headers translation ────────────────────── */
function applyHeaders(lang) {
  const d = LANG_DATA[lang].headers;
  document.querySelectorAll('.sec-header[data-key]').forEach(h => {
    const k = h.dataset.key;
    if (d[k]) h.textContent = d[k];
  });
}

/* ── Populate resume from data object ───────────────── */
function populateResume(lang) {
  const d = LANG_DATA[lang];

  // basic header
  $('res-name').textContent = d.name;
  $('res-title').textContent = d.title;
  const spans = $('res-contact').querySelectorAll('span');
  d.contact.forEach((c, i) => { if (spans[i]) spans[i].textContent = c; });
  $('res-summary').textContent = d.summary;

  // skills
  const sl = $('skills-list');
  sl.querySelectorAll('.skill-item').forEach(s => s.remove());
  d.skills.forEach(([name, pct]) => sl.appendChild(makeSkillItem(name, pct)));

  // work
  const wl = $('work-list');
  wl.querySelectorAll('.work-item').forEach(w => w.remove());
  d.work.forEach(w => wl.appendChild(makeWorkItem(w)));

  // projects
  const pl = $('project-list');
  pl.querySelectorAll('.project-item').forEach(p => p.remove());
  d.projects.forEach(p => pl.appendChild(makeProjectItem(p)));

  // education
  const el2 = $('edu-list');
  el2.querySelectorAll('.edu-item').forEach(e => e.remove());
  d.edu.forEach(e => el2.appendChild(makeEduItem(e)));

  // info
  const il = $('info-list');
  il.querySelectorAll('.info-item').forEach(i => i.remove());
  d.info.forEach(([label, val]) => il.appendChild(makeInfoItem(label, val)));

  // add-button labels
  document.querySelector('[data-target="work-list"]').textContent = d.addWork;
  document.querySelector('[data-target="project-list"]').textContent = d.addProject;
  document.querySelector('[data-target="skills-list"]').textContent = d.addSkill;
  document.querySelector('[data-target="edu-list"]').textContent = d.addEdu;
  document.querySelector('[data-target="info-list"]').textContent = d.addInfo;
  $('btn-export-label').textContent = ' ' + d.download;

  applyHeaders(lang);
}

/* ── Item factory functions ──────────────────────────── */
function makeSkillItem(name, pct) {
  const wrap = el('div', 'skill-item');
  const meta = el('div', 'skill-meta');
  const nm = el('span', 'skill-name', name);
  nm.contentEditable = 'true'; nm.spellcheck = false;
  const pc = el('span', 'skill-pct', pct + '%');
  pc.contentEditable = 'true'; pc.spellcheck = false;
  meta.append(nm, pc);
  const track = el('div', 'skill-bar-track');
  const fill = el('div', 'skill-bar-fill');
  fill.style.width = pct + '%';
  track.appendChild(fill);
  const del = makeDelBtn();
  wrap.append(meta, track, del);

  // Commit pct edit on blur or Enter
  const commitPct = () => {
    const raw = parseInt(pc.textContent, 10);
    const n = isNaN(raw) ? pct : Math.min(100, Math.max(0, raw));
    fill.style.width = n + '%';
    pc.textContent = n + '%';
  };
  pc.addEventListener('blur', commitPct);
  pc.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') { e.preventDefault(); pc.blur(); }
  });

  // Click bar to set level by position
  track.addEventListener('click', (e) => {
    const rect = track.getBoundingClientRect();
    const n = Math.min(100, Math.max(0, Math.round((e.clientX - rect.left) / rect.width * 100)));
    fill.style.width = n + '%';
    pc.textContent = n + '%';
  });
  return wrap;
}

function makeWorkItem({ title, date, org, bullets }) {
  const wrap = el('div', 'work-item entry-item');
  const row = el('div', 'entry-header-row');
  const t = el('span', 'entry-title', title); t.contentEditable = 'true'; t.spellcheck = false;
  const dt = el('span', 'entry-date', date); dt.contentEditable = 'true'; dt.spellcheck = false;
  row.append(t, dt);
  const o = el('p', 'entry-org', org); o.contentEditable = 'true'; o.spellcheck = false;
  const ul = el('ul', 'entry-bullets');
  bullets.forEach(b => {
    const li = el('li', null, b); li.contentEditable = 'true'; li.spellcheck = false;
    ul.appendChild(li);
  });
  // Add-bullet button
  const addBullet = el('button', 'add-bullet-btn no-export', '+');
  addBullet.title = '添加要点';
  addBullet.addEventListener('click', () => {
    const li = el('li', null, '新要点');
    li.contentEditable = 'true'; li.spellcheck = false;
    ul.appendChild(li);
    li.focus();
  });
  wrap.append(row, o, ul, addBullet, makeDelBtn());
  return wrap;
}

function makeProjectItem({ title, date, desc }) {
  const wrap = el('div', 'project-item entry-item');
  const row = el('div', 'entry-header-row');
  const t = el('span', 'entry-title', title); t.contentEditable = 'true'; t.spellcheck = false;
  const dt = el('span', 'entry-date', date); dt.contentEditable = 'true'; dt.spellcheck = false;
  row.append(t, dt);
  const d = el('p', 'entry-desc', desc); d.contentEditable = 'true'; d.spellcheck = false;
  wrap.append(row, d, makeDelBtn());
  return wrap;
}

function makeEduItem({ title, org, date }) {
  const wrap = el('div', 'edu-item entry-item');
  const t = el('p', 'entry-title', title); t.contentEditable = 'true'; t.spellcheck = false;
  const o = el('p', 'entry-org', org); o.contentEditable = 'true'; o.spellcheck = false;
  const dt = el('p', 'entry-date', date); dt.contentEditable = 'true'; dt.spellcheck = false;
  wrap.append(t, o, dt, makeDelBtn());
  return wrap;
}

function makeInfoItem(label, val) {
  const wrap = el('div', 'info-item entry-item');
  const lb = el('span', 'info-label', label); lb.contentEditable = 'true'; lb.spellcheck = false;
  const vl = el('span', 'info-val', val); vl.contentEditable = 'true'; vl.spellcheck = false;
  wrap.append(lb, vl, makeDelBtn());
  return wrap;
}

function makeDelBtn() {
  const b = el('button', 'del-btn no-export', '×');
  b.title = 'Delete';
  b.addEventListener('click', () => b.closest('[class*="-item"]').remove());
  return b;
}

/* ── Paste plain-text only ──────────────────────────── */
$('resume-paper').addEventListener('paste', e => {
  if (e.target.isContentEditable) {
    e.preventDefault();
    const text = (e.clipboardData || window.clipboardData).getData('text/plain');
    document.execCommand('insertText', false, text);
  }
});

/* ── Add buttons ─────────────────────────────────────── */
document.querySelectorAll('.add-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    const target = btn.dataset.target;
    const type = btn.dataset.type;
    const list = $(target);
    if (!list) return;
    let item;
    if (type === 'skill') item = makeSkillItem('New Skill', 70);
    if (type === 'work') item = makeWorkItem({ title: 'Position', date: '2024', org: 'Company', bullets: ['Describe your achievement here.'] });
    if (type === 'project') item = makeProjectItem({ title: 'Project Name', date: '2024', desc: 'Describe your project.' });
    if (type === 'edu') item = makeEduItem({ title: 'Degree', org: 'Institution', date: '20XX – 20XX' });
    if (type === 'info') item = makeInfoItem('Label', 'Value');
    if (item) list.appendChild(item);
  });
});

/* ── Language toggle ─────────────────────────────────── */
$('btn-lang').addEventListener('click', () => {
  currentLang = currentLang === 'en' ? 'zh' : 'en';
  const d = LANG_DATA[currentLang];
  $('lang-label').textContent = d.langLabel;
  applyHeaders(currentLang);
  // Update add-button labels & export text only — don't touch user's items
  document.querySelector('[data-target="work-list"]').textContent = d.addWork;
  document.querySelector('[data-target="project-list"]').textContent = d.addProject;
  document.querySelector('[data-target="skills-list"]').textContent = d.addSkill;
  document.querySelector('[data-target="edu-list"]').textContent = d.addEdu;
  document.querySelector('[data-target="info-list"]').textContent = d.addInfo;
  $('btn-export-label').textContent = ' ' + d.download;
  toast(currentLang === 'zh' ? '已切换为中文模板' : 'Switched to English template');
});

/* ── Layout toggle ───────────────────────────────────── */
$('btn-layout').addEventListener('click', () => {
  currentLayout = currentLayout === 'portrait' ? 'landscape' : 'portrait';
  document.body.classList.toggle('layout-landscape', currentLayout === 'landscape');
  $('layout-label').textContent = currentLayout === 'portrait'
    ? LANG_DATA[currentLang].layoutLabel || 'Portrait'
    : (currentLang === 'zh' ? '竖版' : 'Landscape');
  const cw = $('custom-w'), ch = $('custom-h');
  const p = currentPaper === 'custom'
    ? { w: parseFloat((cw && cw.value) || 210), h: parseFloat((ch && ch.value) || 297) }
    : (PAPER[currentPaper] || PAPER['A4']);
  if (currentLayout === 'landscape') applyPaper(p.h, p.w);
  else applyPaper(p.w, p.h);
  toast('版式已切换');
});

/* ── Typography sliders ──────────────────────────────── */
[
  ['sl-lh', v => { document.documentElement.style.setProperty('--lh', v); $('sl-lh-val').textContent = v; }],
  ['sl-ls', v => { document.documentElement.style.setProperty('--ls', v + 'px'); $('sl-ls-val').textContent = v + 'px'; }],
  ['sl-pad', v => { document.documentElement.style.setProperty('--pad-scale', v); $('sl-pad-val').textContent = v + '×'; }],
].forEach(([id, fn]) => {
  const sl = $(id);
  sl.addEventListener('input', () => fn(sl.value));
});

/* ── Font size (editable number) ──────────────────────── */
const DEFAULT_FONT_SIZE = 11;
const fontSizeVal = $('font-size-val');

function applyFontSize(px) {
  document.documentElement.style.setProperty('--font-scale', px / DEFAULT_FONT_SIZE);
  fontSizeVal.textContent = px;
}

fontSizeVal.addEventListener('blur', () => {
  const raw = parseInt(fontSizeVal.textContent, 10);
  const px = isNaN(raw) ? DEFAULT_FONT_SIZE : Math.min(24, Math.max(6, raw));
  applyFontSize(px);
});

fontSizeVal.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') { e.preventDefault(); fontSizeVal.blur(); }
});

/* ── Paper select dropdown ───────────────────────────── */
$('paper-select').addEventListener('change', () => {
  currentPaper = $('paper-select').value;
  const p = PAPER[currentPaper];
  applyPaper(
    currentLayout === 'landscape' ? p.h : p.w,
    currentLayout === 'landscape' ? p.w : p.h
  );
});

/* Custom paper */
$('btn-apply-paper').addEventListener('click', () => {
  const cw = $('custom-w'), ch = $('custom-h');
  const w = parseFloat((cw && cw.value) || '');
  const h = parseFloat((ch && ch.value) || '');
  if (!w || !h) { toast('请输入有效尺寸'); return; }
  currentPaper = 'custom';
  $('paper-select').value = ''; // deselect preset
  applyPaper(
    currentLayout === 'landscape' ? h : w,
    currentLayout === 'landscape' ? w : h
  );
  toast(`自定义纸张 ${w}×${h} mm`);
});

/* ── Page break toggle ───────────────────────────────── */
$('toggle-breaks').addEventListener('change', e => {
  showBreaks = e.target.checked;
  if (!showBreaks) { clearBreaks(); return; }
  const cw = $('custom-w'), ch = $('custom-h');
  const p = currentPaper === 'custom'
    ? { w: parseFloat((cw && cw.value) || 210), h: parseFloat((ch && ch.value) || 297) }
    : (PAPER[currentPaper] || PAPER['A4']);
  renderBreaks(
    currentLayout === 'landscape' ? p.h : p.w,
    currentLayout === 'landscape' ? p.w : p.h
  );
});

/* ── Color swatches ──────────────────────────────────── */
document.querySelectorAll('.swatch[data-color]').forEach(sw => {
  sw.addEventListener('click', () => {
    document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
    sw.classList.add('active');
    setAccent(sw.dataset.color);
    $('color-picker').value = sw.dataset.color;
  });
});
$('color-picker').addEventListener('input', e => {
  document.querySelectorAll('.swatch').forEach(s => s.classList.remove('active'));
  setAccent(e.target.value);
});

/* ── Font switcher ───────────────────────────────────── */
document.querySelectorAll('.font-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    document.documentElement.style.setProperty('--font-resume', btn.dataset.font);
  });
});

/* ── Font upload ─────────────────────────────────────── */
$('font-file-input').addEventListener('change', async e => {
  const file = e.target.files[0];
  if (!file) return;
  const url = URL.createObjectURL(file);
  const name = file.name.replace(/\.[^.]+$/, '').replace(/[^a-zA-Z0-9_-]/g, '_');
  const face = new FontFace(name, `url(${url})`);
  try {
    await face.load();
    document.fonts.add(face);
    document.documentElement.style.setProperty('--font-resume', `'${name}', serif`);
    $('uploaded-font-name').textContent = '✓ ' + file.name;
    document.querySelectorAll('.font-btn').forEach(b => b.classList.remove('active'));
    toast(`字体"${file.name}"已应用`);
  } catch { toast('字体加载失败'); }
  URL.revokeObjectURL(url);
});

/* ── Avatar ──────────────────────────────────────────── */
let avatarDataUrl = null;       // original image as data URL
let avatarImgEl = null;        // the loaded Image object (for natural dimensions)
let avatarZoom = 1;            // user zoom multiplier (1 = cover-fit)
let avatarPan = { x: 0, y: 0 }; // pan offset in px
let avatarDragging = false;
let avatarDragStart = { x: 0, y: 0 };
let avatarPanStart = { x: 0, y: 0 };

const AVATAR_PREVIEW_SIZE = 220; // preview circle px
const AVATAR_RENDER_SIZE = 352;  // canvas output px (4x of 88px display)

function avatarCoverScale(imgW, imgH) {
  return Math.max(AVATAR_PREVIEW_SIZE / imgW, AVATAR_PREVIEW_SIZE / imgH);
}

function avatarImageDisplaySize() {
  if (!avatarImgEl) return { w: 0, h: 0 };
  const s = avatarCoverScale(avatarImgEl.naturalWidth, avatarImgEl.naturalHeight) * avatarZoom;
  return { w: avatarImgEl.naturalWidth * s, h: avatarImgEl.naturalHeight * s };
}

function updateAvatarPreview() {
  const img = $('avatar-modal-img');
  const sz = avatarImageDisplaySize();
  img.style.width = sz.w + 'px';
  img.style.height = sz.h + 'px';
  img.style.left = ((AVATAR_PREVIEW_SIZE - sz.w) / 2 + avatarPan.x) + 'px';
  img.style.top = ((AVATAR_PREVIEW_SIZE - sz.h) / 2 + avatarPan.y) + 'px';
  $('avatar-zoom').value = avatarZoom;
  $('avatar-zoom-val').textContent = Math.round(avatarZoom * 100) / 100 + '×';
}

function resetAvatarPreview() {
  if (!avatarImgEl) return;
  avatarZoom = 1;
  avatarPan = { x: 0, y: 0 };
  updateAvatarPreview();
}

function clampPan() {
  const sz = avatarImageDisplaySize();
  const maxX = Math.max(0, (sz.w - AVATAR_PREVIEW_SIZE) / 2);
  const maxY = Math.max(0, (sz.h - AVATAR_PREVIEW_SIZE) / 2);
  avatarPan.x = Math.min(maxX, Math.max(-maxX, avatarPan.x));
  avatarPan.y = Math.min(maxY, Math.max(-maxY, avatarPan.y));
}

function showAvatarModal(dataUrl) {
  avatarDataUrl = dataUrl;
  // Match preview shape to current avatar shape selection
  const shape = getAvatarShape();
  const preview = $('avatar-preview-area');
  preview.classList.remove('shape-rounded', 'shape-square');
  if (shape !== 'circle') preview.classList.add('shape-' + shape);
  // Set preview img src immediately so user sees the image
  $('avatar-modal-img').src = dataUrl;
  avatarImgEl = new Image();
  avatarImgEl.onload = () => {
    resetAvatarPreview();
    $('avatar-modal').style.display = 'flex';
  };
  avatarImgEl.src = dataUrl;
}

function getAvatarShape() {
  const active = document.querySelector('.shape-btn.active');
  return active ? active.dataset.shape : 'circle';
}

function applyClipPath(ctx, shape) {
  const R = AVATAR_RENDER_SIZE;
  ctx.beginPath();
  if (shape === 'circle') {
    ctx.arc(R / 2, R / 2, R / 2, 0, Math.PI * 2);
  } else if (shape === 'rounded') {
    const rr = R * 0.136;
    roundRectPath(ctx, 0, 0, R, R, rr);
  } else {
    const rr = R * 0.045;
    roundRectPath(ctx, 0, 0, R, R, rr);
  }
  ctx.clip();
}

// Cross-browser rounded rect (avoids ctx.roundRect compatibility issues)
function roundRectPath(ctx, x, y, w, h, r) {
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.arcTo(x + w, y, x + w, y + r, r);
  ctx.arcTo(x + w, y + h, x + w - r, y + h, r);
  ctx.arcTo(x, y + h, x, y + h - r, r);
  ctx.arcTo(x, y, x + r, y, r);
  ctx.closePath();
}

function renderAvatarToCanvas(imgEl, zoom, pan) {
  if (!imgEl) return null;
  const canvas = document.createElement('canvas');
  canvas.width = AVATAR_RENDER_SIZE;
  canvas.height = AVATAR_RENDER_SIZE;
  const ctx = canvas.getContext('2d');

  const shape = getAvatarShape();
  applyClipPath(ctx, shape);

  // Fill background
  ctx.fillStyle = '#252D40';
  ctx.fillRect(0, 0, AVATAR_RENDER_SIZE, AVATAR_RENDER_SIZE);

  // Calculate source rect from original image
  const coverScale = avatarCoverScale(imgEl.naturalWidth, imgEl.naturalHeight);
  const actualScale = coverScale * zoom;
  const displayW = imgEl.naturalWidth * actualScale;
  const displayH = imgEl.naturalHeight * actualScale;
  const offsetX = (AVATAR_PREVIEW_SIZE - displayW) / 2 + pan.x;
  const offsetY = (AVATAR_PREVIEW_SIZE - displayH) / 2 + pan.y;

  const sx = Math.max(0, -offsetX / actualScale);
  const sy = Math.max(0, -offsetY / actualScale);
  const sw = Math.min(imgEl.naturalWidth - sx, AVATAR_PREVIEW_SIZE / actualScale);
  const sh = Math.min(imgEl.naturalHeight - sy, AVATAR_PREVIEW_SIZE / actualScale);

  if (sw > 0 && sh > 0) {
    ctx.drawImage(imgEl, sx, sy, sw, sh, 0, 0, AVATAR_RENDER_SIZE, AVATAR_RENDER_SIZE);
  }

  return canvas.toDataURL('image/jpeg', 0.94);
}

// Persistent source for re-rendering on shape change
let avatarSourceImage = null;   // Image object kept alive
let avatarSourceZoom = 1;
let avatarSourcePan = { x: 0, y: 0 };

function applyAvatarResult(dataUrl) {
  const img = $('avatar-img');
  img.src = dataUrl;
  img.classList.add('loaded');
  $('avatar-placeholder').style.display = 'none';
  $('avatar-wrap').classList.remove('no-export');
  $('avatar-placeholder').classList.remove('no-export');
}

function rerenderAvatar() {
  if (!avatarSourceImage) return;
  const result = renderAvatarToCanvas(avatarSourceImage, avatarSourceZoom, avatarSourcePan);
  if (result) applyAvatarResult(result);
}

// ── Avatar input binding ──
function bindAvatarInput() {
  const input = $('avatar-input');
  if (!input) return;
  input.addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => showAvatarModal(ev.target.result);
    reader.readAsDataURL(file);
  });
}
bindAvatarInput();

// ── Modal drag handlers ──
$('avatar-preview-area').addEventListener('mousedown', e => {
  if (!avatarImgEl) return;
  avatarDragging = true;
  avatarDragStart = { x: e.clientX, y: e.clientY };
  avatarPanStart = { ...avatarPan };
  e.preventDefault();
});

document.addEventListener('mousemove', e => {
  if (!avatarDragging) return;
  avatarPan.x = avatarPanStart.x + (e.clientX - avatarDragStart.x);
  avatarPan.y = avatarPanStart.y + (e.clientY - avatarDragStart.y);
  clampPan();
  updateAvatarPreview();
});

document.addEventListener('mouseup', () => {
  avatarDragging = false;
});

// Touch support
$('avatar-preview-area').addEventListener('touchstart', e => {
  if (!avatarImgEl || e.touches.length !== 1) return;
  avatarDragging = true;
  avatarDragStart = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  avatarPanStart = { ...avatarPan };
  e.preventDefault();
}, { passive: false });

document.addEventListener('touchmove', e => {
  if (!avatarDragging || e.touches.length !== 1) return;
  avatarPan.x = avatarPanStart.x + (e.touches[0].clientX - avatarDragStart.x);
  avatarPan.y = avatarPanStart.y + (e.touches[0].clientY - avatarDragStart.y);
  clampPan();
  updateAvatarPreview();
}, { passive: false });

document.addEventListener('touchend', () => {
  avatarDragging = false;
});

// ── Modal wheel zoom ──
$('avatar-preview-area').addEventListener('wheel', e => {
  if (!avatarImgEl) return;
  e.preventDefault();
  const delta = e.deltaY > 0 ? -0.08 : 0.08;
  avatarZoom = Math.min(3, Math.max(0.5, avatarZoom + delta));
  clampPan();
  updateAvatarPreview();
}, { passive: false });

// ── Zoom slider ──
$('avatar-zoom').addEventListener('input', () => {
  if (!avatarImgEl) return;
  avatarZoom = parseFloat($('avatar-zoom').value);
  clampPan();
  updateAvatarPreview();
});

// ── Modal buttons ──
$('btn-avatar-confirm').addEventListener('click', () => {
  if (!avatarImgEl) return;
  avatarSourceZoom = avatarZoom;
  avatarSourcePan = { ...avatarPan };
  avatarSourceImage = avatarImgEl; // keep alive for shape re-render
  const result = renderAvatarToCanvas(avatarImgEl, avatarZoom, avatarPan);
  if (!result) return;
  applyAvatarResult(result);
  // Cleanup modal
  $('avatar-modal').style.display = 'none';
  avatarDataUrl = null;
  avatarImgEl = null;
  $('avatar-modal-img').src = '';
  toast('头像已更新');
});

$('btn-avatar-cancel').addEventListener('click', cancelAvatarModal);

// Click modal image area to re-select
$('avatar-preview-area').addEventListener('dblclick', () => {
  $('avatar-input').click();
});

// Click mask to cancel
document.querySelector('.avatar-modal-mask').addEventListener('click', cancelAvatarModal);

// Escape key to close modal
document.addEventListener('keydown', e => {
  if (e.key === 'Escape' && $('avatar-modal').style.display === 'flex') {
    cancelAvatarModal();
  }
});

function cancelAvatarModal() {
  $('avatar-modal').style.display = 'none';
  avatarDataUrl = null;
  avatarImgEl = null;
  $('avatar-modal-img').src = '';
  $('avatar-input').value = '';
}

// ── Clear avatar via right-click (delegated on resume-paper) ──
$('resume-paper').addEventListener('contextmenu', e => {
  const wrap = e.target.closest('#avatar-wrap');
  if (!wrap) return;
  const img = $('avatar-img');
  if (!img.classList.contains('loaded')) return;
  e.preventDefault();
  img.src = '';
  img.classList.remove('loaded');
  $('avatar-placeholder').style.display = '';
  wrap.classList.add('no-export');
  $('avatar-placeholder').classList.add('no-export');
  $('avatar-input').value = '';
  avatarDataUrl = null;
  avatarImgEl = null;
  avatarSourceImage = null;
  toast('已清除照片');
});

document.querySelectorAll('.shape-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.shape-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const wrap = $('avatar-wrap');
    wrap.classList.remove('shape-circle', 'shape-rounded', 'shape-square');
    if (btn.dataset.shape !== 'circle') wrap.classList.add('shape-' + btn.dataset.shape);
    // Re-render avatar with new shape if one is loaded
    rerenderAvatar();
  });
});

/* ── PDF Export ──────────────────────────────────────── */
$('btn-export').addEventListener('click', async function exportHandler() {
  const btn = this;
  if (btn.disabled) return;
  btn.disabled = true;
  const paper = $('resume-paper');

  // Determine dimensions
  let wMm, hMm;
  if (currentPaper === 'custom') {
    const cw = $('custom-w'), ch = $('custom-h');
    wMm = parseFloat((cw && cw.value) || 210);
    hMm = parseFloat((ch && ch.value) || 297);
  } else {
    const p = PAPER[currentPaper] || PAPER['A4'];
    wMm = currentLayout === 'landscape' ? p.h : p.w;
    hMm = currentLayout === 'landscape' ? p.w : p.h;
  }

  // Hide non-export elements
  document.body.classList.add('exporting');

  // Temporarily remove transform scale for accurate capture
  const prevTransform = paper.style.transform;
  paper.style.transform = 'none';

  toast('正在生成 PDF…', 8000);

  try {
    const { jsPDF } = window.jspdf;
    const canvas = await html2canvas(paper, {
      scale: 4,
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#F9F8F5',
      width: paper.offsetWidth,
      height: paper.offsetHeight,
    });

    const pdf = new jsPDF({
      orientation: currentLayout === 'landscape' ? 'landscape' : 'portrait',
      unit: 'mm',
      format: [wMm, hMm],
    });
    const imgData = canvas.toDataURL('image/jpeg', 0.97);
    pdf.addImage(imgData, 'JPEG', 0, 0, wMm, hMm);
    pdf.save('resume.pdf');
    toast('PDF 已保存 ✓');
  } catch (e) {
    toast('导出失败，请查看控制台');
    console.error(e);
  } finally {
    document.body.classList.remove('exporting');
    paper.style.transform = prevTransform;
    btn.disabled = false;
  }
});

/* ── Boot ────────────────────────────────────────────── */
(function init() {
  populateResume('zh');
  $('lang-label').textContent = LANG_DATA.zh.langLabel;
  $('layout-label').textContent = LANG_DATA.zh.layoutLabel;
  renderBreaks(PAPER[currentPaper].w, PAPER[currentPaper].h);
})();
