// ═══════════════════════════════════════
// GOKKO Ad Pricing Simulator — Shared Logic
// ═══════════════════════════════════════
(function (window) {
'use strict';

// ── PLAN DATA — 4 plans × 5 coefficient categories ──
const PLANS = [
  // ── PLAN 0: ライトプラン（フック重視）──
  {
    name: 'ライトプラン',
    nameEn: 'LIGHT',
    period: [
      { label: '1ヶ月', coeff: 0.8, desc: 'お試し配信' },
      { label: '3ヶ月', coeff: 1.0, desc: '短期集中キャンペーン' },
      { label: '6ヶ月', coeff: 1.3, desc: '標準的な広告契約' },
      { label: '1年',   coeff: 2.0, desc: '年間継続展開' },
      { label: '2年',   coeff: 3.0, desc: '長期ブランド戦略' },
      { label: '無期限', coeff: 4.0, desc: '恒久的な利用権' },
    ],
    competition: [
      { label: '競合なし',     coeff: 1.0, desc: '基本料金（ドラマと同条件）' },
      { label: '商品競合のみ', coeff: 1.3, desc: '同一商品カテゴリを排除' },
      { label: '業界競合',     coeff: 1.6, desc: '同一業界全体を排除' },
      { label: '全競合排除',   coeff: 2.0, desc: 'すべての競合を排除' },
    ],
    industry: [
      { label: '一般消費財',           coeff: 1.0, desc: '標準的な広告予算規模' },
      { label: '食品・飲料',           coeff: 1.1, desc: '頻繁な広告展開が想定' },
      { label: '化粧品・美容',         coeff: 1.3, desc: 'イメージ重視で高額予算' },
      { label: '金融・保険',           coeff: 1.6, desc: '規制業界で慎重な選定が必要' },
      { label: '医療・薬品',           coeff: 1.8, desc: '最高レベルの信頼性が要求' },
      { label: 'アルコール・ギャンブル', coeff: 2.0, desc: '特殊な規制対象業界' },
    ],
    media: [
      { label: 'TikTok（基本）',       coeff: 1.0,  desc: '基本配信面', base: true },
      { label: 'Instagram',           coeff: 0.15, desc: 'TikTokに加算' },
      { label: 'YouTube（Short含む）', coeff: 0.2,  desc: 'TikTokに加算' },
      { label: 'X（旧Twitter）',       coeff: 0.1,  desc: 'TikTokに加算' },
      { label: 'LINE VOOM',           coeff: 0.1,  desc: 'TikTokに加算' },
      { label: 'バナー（静止画）',     coeff: 0.05, desc: 'TikTokに加算' },
      { label: 'Web広告（HP埋込等）',  coeff: 0.25, desc: 'TikTokに加算' },
      { label: 'テレビCM',            coeff: 0.4,  desc: 'TikTokに加算' },
    ],
    mediaCap: 1.8,
  },
  // ── PLAN 1: ベーシックプラン（実稼働費回収）──
  {
    name: 'ベーシックプラン',
    nameEn: 'BASIC',
    period: [
      { label: '1ヶ月', coeff: 1.0, desc: 'お試し配信' },
      { label: '3ヶ月', coeff: 1.2, desc: '短期集中キャンペーン' },
      { label: '6ヶ月', coeff: 1.6, desc: '標準的な広告契約' },
      { label: '1年',   coeff: 2.4, desc: '年間継続展開' },
      { label: '2年',   coeff: 3.6, desc: '長期ブランド戦略' },
      { label: '無期限', coeff: 4.8, desc: '恒久的な利用権' },
    ],
    competition: [
      { label: '競合なし',     coeff: 1.0, desc: '基本料金（ドラマと同条件）' },
      { label: '商品競合のみ', coeff: 1.5, desc: '同一商品カテゴリを排除' },
      { label: '業界競合',     coeff: 2.0, desc: '同一業界全体を排除' },
      { label: '全競合排除',   coeff: 2.4, desc: 'すべての競合を排除' },
    ],
    industry: [
      { label: '一般消費財',           coeff: 1.0,  desc: '標準的な広告予算規模' },
      { label: '食品・飲料',           coeff: 1.15, desc: '頻繁な広告展開が想定' },
      { label: '化粧品・美容',         coeff: 1.4,  desc: 'イメージ重視で高額予算' },
      { label: '金融・保険',           coeff: 1.7,  desc: '規制業界で慎重な選定が必要' },
      { label: '医療・薬品',           coeff: 1.9,  desc: '最高レベルの信頼性が要求' },
      { label: 'アルコール・ギャンブル', coeff: 2.1,  desc: '特殊な規制対象業界' },
    ],
    media: [
      { label: 'TikTok（基本）',       coeff: 1.0,  desc: '基本配信面', base: true },
      { label: 'Instagram',           coeff: 0.17, desc: 'TikTokに加算' },
      { label: 'YouTube（Short含む）', coeff: 0.22, desc: 'TikTokに加算' },
      { label: 'X（旧Twitter）',       coeff: 0.12, desc: 'TikTokに加算' },
      { label: 'LINE VOOM',           coeff: 0.12, desc: 'TikTokに加算' },
      { label: 'バナー（静止画）',     coeff: 0.06, desc: 'TikTokに加算' },
      { label: 'Web広告（HP埋込等）',  coeff: 0.27, desc: 'TikTokに加算' },
      { label: 'テレビCM',            coeff: 0.44, desc: 'TikTokに加算' },
    ],
    mediaCap: 1.9,
  },
  // ── PLAN 2: スタンダードプラン（バランス）──
  {
    name: 'スタンダードプラン',
    nameEn: 'STANDARD',
    period: [
      { label: '1ヶ月', coeff: 1.2, desc: 'お試し配信' },
      { label: '3ヶ月', coeff: 1.5, desc: '短期集中キャンペーン' },
      { label: '6ヶ月', coeff: 2.0, desc: '標準的な広告契約' },
      { label: '1年',   coeff: 3.0, desc: '年間継続展開' },
      { label: '2年',   coeff: 4.5, desc: '長期ブランド戦略' },
      { label: '無期限', coeff: 6.0, desc: '恒久的な利用権' },
    ],
    competition: [
      { label: '競合なし',     coeff: 1.0, desc: '基本料金（ドラマと同条件）' },
      { label: '商品競合のみ', coeff: 1.5, desc: '同一商品カテゴリを排除' },
      { label: '業界競合',     coeff: 2.0, desc: '同一業界全体を排除' },
      { label: '全競合排除',   coeff: 2.5, desc: 'すべての競合を排除' },
    ],
    industry: [
      { label: '一般消費財',           coeff: 1.0, desc: '標準的な広告予算規模' },
      { label: '食品・飲料',           coeff: 1.2, desc: '頻繁な広告展開が想定' },
      { label: '化粧品・美容',         coeff: 1.5, desc: 'イメージ重視で高額予算' },
      { label: '金融・保険',           coeff: 1.8, desc: '規制業界で慎重な選定が必要' },
      { label: '医療・薬品',           coeff: 2.0, desc: '最高レベルの信頼性が要求' },
      { label: 'アルコール・ギャンブル', coeff: 2.2, desc: '特殊な規制対象業界' },
    ],
    media: [
      { label: 'TikTok（基本）',       coeff: 1.0,  desc: '基本配信面', base: true },
      { label: 'Instagram',           coeff: 0.18, desc: 'TikTokに加算' },
      { label: 'YouTube（Short含む）', coeff: 0.25, desc: 'TikTokに加算' },
      { label: 'X（旧Twitter）',       coeff: 0.15, desc: 'TikTokに加算' },
      { label: 'LINE VOOM',           coeff: 0.15, desc: 'TikTokに加算' },
      { label: 'バナー（静止画）',     coeff: 0.07, desc: 'TikTokに加算' },
      { label: 'Web広告（HP埋込等）',  coeff: 0.3,  desc: 'TikTokに加算' },
      { label: 'テレビCM',            coeff: 0.45, desc: 'TikTokに加算' },
    ],
    mediaCap: 2.0,
  },
  // ── PLAN 3: プレミアムプラン（アップセル）──
  {
    name: 'プレミアムプラン',
    nameEn: 'PREMIUM',
    period: [
      { label: '1ヶ月', coeff: 1.5, desc: 'お試し配信' },
      { label: '3ヶ月', coeff: 1.8, desc: '短期集中キャンペーン' },
      { label: '6ヶ月', coeff: 2.4, desc: '標準的な広告契約' },
      { label: '1年',   coeff: 3.6, desc: '年間継続展開' },
      { label: '2年',   coeff: 5.4, desc: '長期ブランド戦略' },
      { label: '無期限', coeff: 7.2, desc: '恒久的な利用権' },
    ],
    competition: [
      { label: '競合なし',     coeff: 1.0, desc: '基本料金（ドラマと同条件）' },
      { label: '商品競合のみ', coeff: 2.0, desc: '同一商品カテゴリを排除' },
      { label: '業界競合',     coeff: 2.5, desc: '同一業界全体を排除' },
      { label: '全競合排除',   coeff: 3.0, desc: 'すべての競合を排除' },
    ],
    industry: [
      { label: '一般消費財',           coeff: 1.0, desc: '標準的な広告予算規模' },
      { label: '食品・飲料',           coeff: 1.3, desc: '頻繁な広告展開が想定' },
      { label: '化粧品・美容',         coeff: 1.6, desc: 'イメージ重視で高額予算' },
      { label: '金融・保険',           coeff: 2.0, desc: '規制業界で慎重な選定が必要' },
      { label: '医療・薬品',           coeff: 2.5, desc: '最高レベルの信頼性が要求' },
      { label: 'アルコール・ギャンブル', coeff: 3.0, desc: '特殊な規制対象業界' },
    ],
    media: [
      { label: 'TikTok（基本）',       coeff: 1.0, desc: '基本配信面', base: true },
      { label: 'Instagram',           coeff: 0.3, desc: 'TikTokに加算' },
      { label: 'YouTube（Short含む）', coeff: 0.4, desc: 'TikTokに加算' },
      { label: 'X（旧Twitter）',       coeff: 0.2, desc: 'TikTokに加算' },
      { label: 'LINE VOOM',           coeff: 0.2, desc: 'TikTokに加算' },
      { label: 'バナー（静止画）',     coeff: 0.1, desc: 'TikTokに加算' },
      { label: 'Web広告（HP埋込等）',  coeff: 0.5, desc: 'TikTokに加算' },
      { label: 'テレビCM',            coeff: 0.6, desc: 'TikTokに加算' },
    ],
    mediaCap: 3.0,
  },
];

// GOKKO Margin is shared across all plans (3 tiers)
const MARGIN = [
  { label: 'ライト',      coeff: 1.0, desc: 'マージンなし' },
  { label: 'スタンダード', coeff: 1.2, desc: '標準マージン' },
  { label: 'フル',        coeff: 1.5, desc: 'フルサポート込み' },
];

// Talent rank is shared across all plans
const RANK = [
  { label: '新人A',  coeff: 0.8,  desc: 'GOKKO専属新人' },
  { label: '新人B',  coeff: 1.0,  desc: '一般新人キャスト' },
  { label: '準中堅', coeff: 1.8,  desc: '実績ある若手' },
  { label: '中堅A',  coeff: 2.5,  desc: '中堅タレント' },
  { label: '中堅B',  coeff: 3.5,  desc: '人気中堅タレント' },
  { label: '準有名', coeff: 5.0,  desc: '知名度上昇中' },
  { label: '有名A',  coeff: 8.0,  desc: '有名タレント' },
  { label: '有名S',  coeff: 12.0, desc: 'トップクラス' },
];

// ═══════════════════════════════════════
// STATE
// ═══════════════════════════════════════
let currentPlan = 2; // default: スタンダード
const state = { period: 0, competition: 0, industry: 0, media: [0], rank: 0, margin: 0 };
let simulatorInitialized = false;
const REQUIRED_SIMULATOR_IDS = ['baseFee', 'coeffGrid', 'resultPlanBadge', 'resultBreakdown', 'resultValue', 'resultLiveRegion'];

// ═══════════════════════════════════════
// YEAR SYNC
// ═══════════════════════════════════════
function syncCurrentYear() {
  const y = String(new Date().getFullYear());
  document.querySelectorAll('.copyright-year').forEach(el => { el.textContent = y; });
  document.querySelectorAll('.menu-year').forEach(el => { el.textContent = y; });
}

function hasRequiredSimulatorMarkup() {
  return REQUIRED_SIMULATOR_IDS.every(id => document.getElementById(id));
}

function resetSelections() {
  state.period = 0;
  state.competition = 0;
  state.industry = 0;
  state.media = [0];
  state.rank = 0;
  state.margin = 0;
}

// ═══════════════════════════════════════
// PLAN SELECTOR
// ═══════════════════════════════════════
function selectPlan(btn) {
  currentPlan = parseInt(btn.dataset.plan, 10);
  document.querySelectorAll('.plan-btn').forEach(b => {
    b.classList.remove('active');
    b.setAttribute('aria-checked', 'false');
    b.setAttribute('tabindex', '-1');
  });
  btn.classList.add('active');
  btn.setAttribute('aria-checked', 'true');
  btn.setAttribute('tabindex', '0');
  btn.focus();
  resetSelections();
  renderCards();
  calculate();
}

// ═══════════════════════════════════════
// RENDER
// ═══════════════════════════════════════
function getCoeffCategories() {
  const plan = PLANS[currentPlan];
  return [
    { id: 'period',      num: '01', name: '使用期間',      type: 'radio',    options: plan.period },
    { id: 'competition', num: '02', name: '競合排除',      type: 'radio',    options: plan.competition },
    { id: 'industry',    num: '03', name: '業界',          type: 'radio',    options: plan.industry },
    { id: 'media',       num: '04', name: 'メディア展開',  type: 'checkbox', options: plan.media, cap: plan.mediaCap },
    { id: 'rank',        num: '05', name: '出演者ランク',  type: 'radio',    options: RANK },
    { id: 'margin',      num: '06', name: 'GOKKOマージン', type: 'radio',    options: MARGIN },
  ];
}

function renderCards() {
  const grid = document.getElementById('coeffGrid');
  if (!grid) return;
  grid.innerHTML = '';
  const cats = getCoeffCategories();

  cats.forEach(cat => {
    const card = document.createElement('div');
    card.className = 'coeff-card';
    const isCheck = cat.type === 'checkbox';

    let html = '';
    cat.options.forEach((opt, i) => {
      const sel = isCheck ? state[cat.id].includes(i) : state[cat.id] === i;
      const cls = `${isCheck ? 'media-option' : 'coeff-option'}${sel ? ' selected' : ''}`;
      const cv = isCheck && !opt.base ? `+${opt.coeff}` : `\u00d7${opt.coeff}`;
      const role = isCheck ? 'checkbox' : 'radio';
      const ariaChecked = sel ? 'true' : 'false';
      const ariaDisabled = opt.base ? 'true' : 'false';
      const tabIndex = opt.base ? '-1' : '0';
      html += `<div class="${cls}" data-cat="${cat.id}" data-idx="${i}" ${opt.base ? 'data-base="true"' : ''} role="${role}" aria-checked="${ariaChecked}" aria-disabled="${ariaDisabled}" tabindex="${tabIndex}">
        <div class="opt-left"><div class="opt-label">${opt.label}</div><div class="opt-desc">${opt.desc}</div></div>
        <div class="opt-coeff">${cv}</div></div>`;
    });

    const capNote = cat.cap ? `<div class="media-note">\u203b \u52a0\u7b97\u5408\u8a08\u306e\u4e0a\u9650\uff08Cap\uff09: \u00d7${cat.cap}</div>` : '';
    const groupRole = isCheck ? 'group' : 'radiogroup';

    card.innerHTML = `<div class="coeff-header">
      <div class="coeff-number">${cat.num}</div><div class="coeff-name">${cat.name}</div>
    </div><div class="${isCheck ? 'media-options' : 'coeff-options'}" role="${groupRole}" aria-label="${cat.name}">${html}</div>${capNote}`;

    grid.appendChild(card);
  });

  grid.querySelectorAll('.coeff-option, .media-option').forEach(el => {
    el.addEventListener('click', handleClick);
    el.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handleClick(e);
      }
    });
  });
}

function handleClick(e) {
  const el = e.currentTarget;
  const catId = el.dataset.cat;
  const idx = parseInt(el.dataset.idx, 10);
  const cats = getCoeffCategories();
  const cat = cats.find(c => c.id === catId);
  if (!cat) return;

  if (cat.type === 'checkbox') {
    if (el.dataset.base) return;
    const a = state[catId];
    const p = a.indexOf(idx);
    p > -1 ? a.splice(p, 1) : a.push(idx);
  } else {
    state[catId] = idx;
  }
  renderCards();
  calculate();
}

// ═══════════════════════════════════════
// CALCULATE
// ═══════════════════════════════════════
function calculate() {
  const baseFeeInput = document.getElementById('baseFee');
  const resultPlanBadge = document.getElementById('resultPlanBadge');
  const resultBreakdown = document.getElementById('resultBreakdown');
  const resultValue = document.getElementById('resultValue');
  const resultLiveRegion = document.getElementById('resultLiveRegion');
  if (!baseFeeInput || !resultPlanBadge || !resultBreakdown || !resultValue || !resultLiveRegion) return;

  const plan = PLANS[currentPlan];
  const baseFee = parseInt(baseFeeInput.value.replace(/[^0-9]/g, ''), 10) || 0;

  const pCoeff = (plan.period[state.period] || plan.period[0]).coeff;
  const cCoeff = (plan.competition[state.competition] || plan.competition[0]).coeff;
  const iCoeff = (plan.industry[state.industry] || plan.industry[0]).coeff;

  let mSum = 0;
  state.media.forEach(i => { if (plan.media[i]) mSum += plan.media[i].coeff; });
  const mCoeff = Math.min(mSum, plan.mediaCap);

  const rCoeff = (RANK[state.rank] || RANK[0]).coeff;
  const marginCoeff = (MARGIN[state.margin] || MARGIN[0]).coeff;

  const total = baseFee * pCoeff * cCoeff * iCoeff * mCoeff * rCoeff * marginCoeff;

  resultPlanBadge.textContent = plan.nameEn;

  const chips = [
    { l: '期間', v: pCoeff }, { l: '競合', v: cCoeff }, { l: '業界', v: iCoeff },
    { l: 'メディア', v: mCoeff }, { l: 'ランク', v: rCoeff }, { l: 'マージン', v: marginCoeff },
  ];
  resultBreakdown.innerHTML = chips.map((c, i) =>
    `<span class="result-chip">${c.l} <span>\u00d7${c.v}</span></span>${i < chips.length - 1 ? '<span class="result-multiply">\u00d7</span>' : ''}`
  ).join('');

  const formattedTotal = '\u00a5' + Math.round(total).toLocaleString('ja-JP');
  resultValue.textContent = formattedTotal;
  resultLiveRegion.textContent =
    `${plan.name}\u3001\u898b\u7a4d\u7dcf\u984d ${formattedTotal}\u3002\u671f\u9593 ${pCoeff}\u3001\u7af6\u5408 ${cCoeff}\u3001\u696d\u754c ${iCoeff}\u3001\u30e1\u30c7\u30a3\u30a2 ${mCoeff}\u3001\u30e9\u30f3\u30af ${rCoeff}\u3001\u30de\u30fc\u30b8\u30f3 ${marginCoeff}\u3002`;
}

// ═══════════════════════════════════════
// INIT
// ═══════════════════════════════════════
function initSimulator() {
  if (simulatorInitialized) return true;
  if (!hasRequiredSimulatorMarkup()) {
    console.warn('Simulator markup is incomplete. Skipping initialization.');
    return false;
  }

  // Plan selector — roving tabindex + arrow key navigation (WAI-ARIA radiogroup)
  const planBtns = Array.from(document.querySelectorAll('.plan-btn'));
  planBtns.forEach((btn, idx) => {
    btn.setAttribute('tabindex', btn.classList.contains('active') ? '0' : '-1');
    btn.addEventListener('click', () => selectPlan(btn));
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        selectPlan(btn);
        return;
      }
      let target;
      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        target = planBtns[(idx + 1) % planBtns.length];
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        target = planBtns[(idx - 1 + planBtns.length) % planBtns.length];
      } else if (e.key === 'Home') {
        target = planBtns[0];
      } else if (e.key === 'End') {
        target = planBtns[planBtns.length - 1];
      }
      if (target) {
        e.preventDefault();
        selectPlan(target);
      }
    });
  });

  // Base fee input formatting
  document.getElementById('baseFee').addEventListener('input', function() {
    const raw = this.value.replace(/[^0-9]/g, '');
    this.value = raw ? parseInt(raw, 10).toLocaleString('ja-JP') : '';
    calculate();
  });

  // Dynamic year
  syncCurrentYear();

  // Initial render
  simulatorInitialized = true;
  renderCards();
  calculate();
  console.log('\u2705 \u521d\u671f\u5316\u5b8c\u4e86: \u30ab\u30fc\u30c9\u6570 =', document.querySelectorAll('.coeff-card').length);
  return true;
}

// Expose public API
window.initSimulator = initSimulator;

})(window);
