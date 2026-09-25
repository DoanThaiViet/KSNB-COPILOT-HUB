/* =========================================================================
   THÀNH PHẦN GIAO DIỆN DÙNG CHUNG
   Định dạng số/ngày, nhãn, tooltip, modal, drawer, toast, form sinh từ
   schema, biểu đồ HTML/SVG nhẹ (không phụ thuộc thư viện ngoài).
   ========================================================================= */
AIM.ui = (function () {
  const C = AIM.config;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

  const nf = (v, d = 0) => (+v || 0).toLocaleString('vi-VN', { minimumFractionDigits: d, maximumFractionDigits: d });
  const hrs = v => nf(v, v < 10 && v % 1 ? 1 : 0);
  const pct = v => nf(v, 0) + '%';
  const date = s => { if (!s) return '–'; const [y, m, d] = s.split('-'); return `${d}/${m}/${y}`; };
  const shortDate = s => { if (!s) return '–'; const [, m, d] = s.split('-'); return `${d}/${m}`; };

  const person = id => AIM.store.get('people', id);
  const pname = id => (person(id) || {}).name || '–';
  const group = id => AIM.store.get('groups', id) || { name: '–', short: '–', color: '#94a3b8' };
  const initials = n => (n || '?').split(' ').filter(Boolean).slice(-2).map(w => w[0]).join('').toUpperCase();

  /* ---------- Nhãn ---------- */
  const stLabel = s => (C.statuses[s] || {}).label || s;
  const statusOpts = list => list.map(s => [s, stLabel(s)]);
  const status = s => { const c = C.statuses[s] || C.statuses.Draft; return `<span class="st" style="color:${c.color};background:${c.bg}"><i style="background:${c.color}"></i>${esc(c.label)}</span>`; };
  const prio = p => { const c = C.priorities[p] || { color: '#94a3b8' }; return `<span class="prio" style="--c:${c.color}">${esc(p || '–')}</span>`; };
  const grp = id => { const g = group(id); return `<span class="grp" style="--c:${g.color}" data-tip="${esc(g.name)}">${esc(g.short)}</span>`; };
  const type = t => { const c = C.types[t] || {}; return `<span class="typ" style="--c:${c.color}">${esc(c.label || t)}</span>`; };
  const tool = k => { const t = C.tools[k]; return t ? `<span class="tool" data-tip="${esc(t.note || '')}">${esc(t.label)}</span>` : '<span class="faint">–</span>'; };
  const aud = k => { const a = C.audiences[k] || C.audiences.both; return `<span class="aud" style="--c:${a.color}" data-tip="Đối tượng dùng">${esc(a.label)}</span>`; };
  const domain = id => AIM.config.domains.find(d => d.id === id) || { name: '–', short: '–' };
  const dom = id => { const d = domain(id); return `<span class="dom" data-tip="Lĩnh vực: ${esc(d.name)}">${esc(d.short)}</span>`; };
  const level = lv => { const m = C.maturity.find(x => x.key === lv) || {}; return `<span class="lvl" style="--c:${m.color}">${esc(m.label || lv)}</span>`; };
  const avatar = (id, size = 28) => { const p = person(id); return `<span class="av" style="width:${size}px;height:${size}px;font-size:${Math.round(size * .38)}px" data-tip="${esc(p ? p.name + ' · ' + p.title : '')}">${esc(initials(p && p.name))}</span>`; };
  const avatars = (ids, size = 24) => {
    const list = (ids || []).filter(Boolean);
    const show = list.slice(0, 3);
    return `<span class="avs">${show.map(id => avatar(id, size)).join('')}${list.length > show.length
      ? `<span class="avmore" data-tip="${esc(list.slice(3).map(pname).join('<br>'))}">+${list.length - show.length}</span>` : ''}</span>`;
  };
  const dots = (n, max = 5) => `<span class="dots" data-tip="${esc(C.quality[n] || '')}">${Array.from({ length: max }, (_, i) => `<i class="${i < n ? 'on' : ''}"></i>`).join('')}</span>`;
  const bar = (v, color = 'var(--green)', planned) => `<span class="mbar">${planned != null ? `<b style="width:${Math.min(100, planned)}%"></b>` : ''}<i style="width:${Math.min(100, Math.max(0, v))}%;background:${color}"></i></span>`;
  const due = (d, finished) => { const s = AIM.logic.dueState(d, finished); return `<span class="due${s ? ' ' + s.key : ''}" ${s ? `data-tip="${esc(s.label)}"` : ''}>${date(d)}</span>`; };

  /* ---------- Tooltip ---------- */
  function initTip() {
    const tip = $('#tip');
    document.addEventListener('mouseover', e => {
      const t = e.target.closest('[data-tip]');
      if (!t || !t.dataset.tip) { tip.style.opacity = 0; return; }
      tip.innerHTML = t.dataset.tip; tip.style.opacity = 1;
    });
    document.addEventListener('mousemove', e => {
      if (tip.style.opacity !== '1') return;
      const w = tip.offsetWidth, h = tip.offsetHeight;
      let x = e.clientX + 14, y = e.clientY + 16;
      if (x + w > innerWidth - 8) x = e.clientX - w - 14;
      if (y + h > innerHeight - 8) y = e.clientY - h - 12;
      tip.style.left = x + 'px'; tip.style.top = y + 'px';
    });
    document.addEventListener('scroll', () => { tip.style.opacity = 0; }, true);
  }

  /* ---------- Modal / drawer ---------- */
  let returnFocus = null;
  function overlay(kind, { title, sub, body, foot, wide, onMount }) {
    close();
    returnFocus = document.activeElement;
    const el = document.createElement('div');
    el.className = 'ovl ' + kind;
    el.innerHTML = `<div class="panel${wide ? ' wide' : ''}" role="dialog" aria-modal="true" aria-labelledby="dialogTitle" tabindex="-1">
      <div class="phead"><div><h3 id="dialogTitle">${title}</h3>${sub ? `<div class="psub">${sub}</div>` : ''}</div><button class="x" data-close aria-label="Đóng">×</button></div>
      <div class="pbody">${body}</div>${foot ? `<div class="pfoot">${foot}</div>` : ''}</div>`;
    el.addEventListener('mousedown', e => { if (e.target === el) close(); });
    el.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
    document.body.appendChild(el);
    document.body.style.overflow = 'hidden';
    document.querySelectorAll('header.top,.shell,.cp-fab,.cp-panel').forEach(n => n.inert = true);
    el.addEventListener('keydown', e => {
      if (e.key !== 'Tab') return;
      const focusable = [...el.querySelectorAll('button,a[href],input,select,textarea,summary,[tabindex="0"]')].filter(n => !n.disabled && n.offsetParent !== null);
      const first = focusable[0], last = focusable[focusable.length - 1];
      if (!first) { e.preventDefault(); return; }
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
      if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
    });
    requestAnimationFrame(() => el.classList.add('in'));
    onMount && onMount(el.querySelector('.panel'));
    (el.querySelector('input:not([type="hidden"]),select,textarea') || el.querySelector('[data-close]') || el.querySelector('.panel')).focus();
    return el.querySelector('.panel');
  }
  const modal = o => overlay('modal', o);
  const drawer = o => overlay('drawer', o);
  function close() { $$('.ovl').forEach(o => o.remove()); document.body.style.overflow = ''; document.querySelectorAll('header.top,.shell,.cp-fab,.cp-panel').forEach(n => n.inert = false); if (returnFocus?.isConnected) returnFocus.focus(); returnFocus = null; }
  document.addEventListener('keydown', e => { if (e.key === 'Escape') close(); });

  function toast(msg) {
    const t = document.createElement('div');
    t.className = 'toast'; t.textContent = msg;
    document.body.appendChild(t);
    requestAnimationFrame(() => t.classList.add('in'));
    setTimeout(() => { t.classList.remove('in'); setTimeout(() => t.remove(), 300); }, 2200);
  }
  async function copy(text) {
    try { await navigator.clipboard.writeText(text); }
    catch (e) { const ta = document.createElement('textarea'); ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand('copy'); ta.remove(); }
    toast('Đã sao chép');
  }
  function download(name, text, mime = 'application/json') {
    const a = document.createElement('a');
    a.href = URL.createObjectURL(new Blob([text], { type: mime + ';charset=utf-8' }));
    a.download = name; a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 500);
  }

  /* ---------- Form sinh từ schema ----------
     field: { k, label, type: text|textarea|number|date|select|check, options:[[v,label]], span:2, step, req } */
  const opt = (v, l, cur) => `<option value="${esc(v)}"${String(cur) === String(v) ? ' selected' : ''}>${esc(l)}</option>`;
  function field(f, val) {
    const id = 'f_' + f.k.replace(/\./g, '_');
    let ctl;
    switch (f.type) {
      case 'textarea': ctl = `<textarea id="${id}" name="${f.k}" rows="${f.rows || 3}"${f.mono ? ' class="mono"' : ''}>${esc(val)}</textarea>`; break;
      case 'select': ctl = `<select id="${id}" name="${f.k}">${f.options.map(([v, l]) => opt(v, l, val)).join('')}</select>`; break;
      case 'people': {
        const cur = new Set(val || []);
        return `<div class="fld s2"><label>${esc(f.label)}</label><div class="pcheck">${AIM.store.all('people')
          .map(p => `<label><input type="checkbox" data-own="${p.id}"${cur.has(p.id) ? ' checked' : ''}> ${esc(p.name)}<i>${esc(p.unit || '')}</i></label>`).join('')}</div></div>`;
      }
      case 'check': return `<label class="fchk${f.span === 2 ? ' s2' : ''}"><input type="checkbox" name="${f.k}"${val ? ' checked' : ''}> ${esc(f.label)}</label>`;
      default: ctl = `<input id="${id}" name="${f.k}" type="${f.type || 'text'}" value="${esc(val)}"${f.step ? ` step="${f.step}"` : ''}${f.min != null ? ` min="${f.min}"` : ''}${f.req ? ' required' : ''}>`;
    }
    return `<div class="fld${f.span === 2 ? ' s2' : ''}"><label for="${id}">${esc(f.label)}${f.req ? ' <em>*</em>' : ''}</label>${ctl}</div>`;
  }
  const getPath = (o, k) => k.split('.').reduce((a, p) => (a == null ? a : a[p]), o);
  const setPath = (o, k, v) => { const ps = k.split('.'); let a = o; ps.slice(0, -1).forEach(p => { a[p] = a[p] || {}; a = a[p]; }); a[ps[ps.length - 1]] = v; };
  const form = (fields, obj) => `<form class="frm">${fields.map(f => f.section ? `<div class="fsec s2">${esc(f.section)}</div>`
    : field(f, f.type === 'people' ? (obj.ownerIds || []) : (getPath(obj, f.k) ?? ''))).join('')}</form>`;
  function readForm(root, fields, base) {
    const out = JSON.parse(JSON.stringify(base || {}));
    fields.filter(f => f.k && f.type !== 'people').forEach(f => {
      const el = root.querySelector(`[name="${f.k}"]`); if (!el) return;
      let v = f.type === 'check' ? el.checked : el.value;
      if (f.type === 'number') v = v === '' ? 0 : +v;
      setPath(out, f.k, v);
    });
    return out;
  }
  const peopleOpts = (filter) => AIM.store.all('people').filter(filter || (() => true)).map(p => [p.id, p.name]);
  const groupOpts = () => AIM.store.all('groups').map(g => [g.id, g.name]);
  const domainOpts = () => AIM.config.domains.map(d => [d.id, d.name]);

  /* ---------- Biểu đồ ---------- */
  /* Thanh xếp chồng ngang. rows: [{label, sub, parts:[{v,color,name}], total?, attrs?}] */
  function stackBars(rows, o = {}) {
    const max = o.max || Math.max(1, ...rows.map(r => r.parts.reduce((a, p) => a + p.v, 0)));
    const fmt = o.fmt || (v => nf(v));
    return `<div class="sbars${o.compact ? ' compact' : ''}" style="--lw:${o.labelWidth || 170}px">${rows.map(r => {
      const tot = r.total != null ? r.total : r.parts.reduce((a, p) => a + p.v, 0);
      return `<div class="sbr${r.attrs ? ' go' : ''}" ${r.attrs || ''}>
        <div class="sbl" title="${esc(r.label)}">${esc(r.label)}${r.sub ? `<small>${esc(r.sub)}</small>` : ''}</div>
        <div class="sbt">${r.parts.filter(p => p.v > 0).map(p => `<i style="width:${p.v / max * 100}%;background:${p.color}" data-tip="<b>${esc(r.label)}</b><br>${esc(p.name)}: ${fmt(p.v)}${o.unit ? ' ' + o.unit : ''}"></i>`).join('')}</div>
        <div class="sbv">${r.valueLabel != null ? r.valueLabel : fmt(tot)}</div></div>`;
    }).join('')}</div>`;
  }
  /* Donut SVG. parts: [{v,color,name}] */
  function donut(parts, o = {}) {
    const size = o.size || 150, r = size / 2 - 12, c = 2 * Math.PI * r, tot = parts.reduce((a, p) => a + p.v, 0) || 1;
    let off = 0;
    const segs = parts.map(p => {
      const len = p.v / tot * c;
      const s = `<circle r="${r}" cx="${size / 2}" cy="${size / 2}" fill="none" stroke="${p.color}" stroke-width="${o.stroke || 18}"
        stroke-dasharray="${Math.max(0, len - 2)} ${c}" stroke-dashoffset="${-off}" transform="rotate(-90 ${size / 2} ${size / 2})"
        data-tip="<b>${esc(p.name)}</b>: ${nf(p.v)} (${pct(p.v / tot * 100)})"${p.attrs ? ' ' + p.attrs : ''} class="${p.attrs ? 'go' : ''}"></circle>`;
      off += len; return s;
    }).join('');
    return `<svg class="donut" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}">
      <circle r="${r}" cx="${size / 2}" cy="${size / 2}" fill="none" stroke="#eef2f7" stroke-width="${o.stroke || 18}"></circle>${segs}
      <text x="50%" y="48%" text-anchor="middle" class="dn-v">${esc(o.center ?? nf(tot))}</text>
      <text x="50%" y="62%" text-anchor="middle" class="dn-l">${esc(o.label || '')}</text></svg>`;
  }
  const legend = items => `<div class="legend">${items.map(i => `<span><i style="background:${i.color}"></i>${esc(i.name)}</span>`).join('')}</div>`;

  /* Bảng có sắp xếp: cols [{k,label,sort:(row)=>val,render:(row)=>html,cls,w}] */
  function sortRows(rows, cols, sortKey, dir) {
    const col = cols.find(c => c.k === sortKey);
    if (!col) return rows;
    const val = col.sort || (r => r[col.k]);
    return [...rows].sort((a, b) => {
      const x = val(a), y = val(b);
      const r = typeof x === 'number' && typeof y === 'number' ? x - y : String(x ?? '').localeCompare(String(y ?? ''), 'vi', { numeric: true });
      return dir === 'desc' ? -r : r;
    });
  }

  return {
    $, $$, esc, nf, hrs, pct, date, shortDate, person, pname, group, initials,
    status, stLabel, statusOpts, prio, grp, type, level, tool, domain, dom, aud, avatar, avatars, dots, bar, due,
    initTip, modal, drawer, close, toast, copy, download,
    form, readForm, peopleOpts, groupOpts, domainOpts, opt,
    stackBars, donut, legend, sortRows
  };
})();
