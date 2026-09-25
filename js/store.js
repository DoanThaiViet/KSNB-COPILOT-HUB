/* =========================================================================
   TẦNG DỮ LIỆU (REPOSITORY)
   Giao diện chỉ gọi AIM.store.*; không đọc localStorage hay fetch trực tiếp.
   Hai adapter cùng hợp đồng:
     load()                 → { groups, people, useCases, library, backlog, milestones }
     upsert(coll, item)     → item đã lưu
     remove(coll, id)
     replaceAll(data)       (nhập JSON / khôi phục dữ liệu mẫu)
   Chuyển sang database: AIM.config.data.mode = 'rest', backend cung cấp
     GET    {baseUrl}/{coll}        danh sách
     PUT    {baseUrl}/{coll}/{id}   tạo/cập nhật
     DELETE {baseUrl}/{coll}/{id}
     PUT    {baseUrl}/_bulk         thay toàn bộ (tùy chọn)
   ========================================================================= */
AIM.COLLECTIONS = ['groups', 'people', 'useCases', 'library', 'milestones', 'tips'];

AIM.LocalAdapter = class {
  constructor(cfg) { this.key = cfg.storageKey; this.ver = cfg.schemaVersion; this.data = null; }
  _read() {
    try {
      const raw = localStorage.getItem(this.key);
      if (!raw) return null;
      const obj = JSON.parse(raw);
      return obj && obj.__v === this.ver ? obj : null;   // khác phiên bản schema → nạp lại dữ liệu mẫu
    } catch (e) { return null; }
  }
  _write() {
    try { localStorage.setItem(this.key, JSON.stringify({ ...this.data, __v: this.ver })); }
    catch (e) { console.warn('Không ghi được localStorage', e); }
  }
  async load() {
    this.data = this._read() || AIM.seed();
    this._write();
    return this.data;
  }
  async upsert(coll, item) {
    const arr = this.data[coll];
    const i = arr.findIndex(x => x.id === item.id);
    if (i >= 0) arr[i] = item; else arr.push(item);
    this._write();
    return item;
  }
  async remove(coll, id) {
    this.data[coll] = this.data[coll].filter(x => x.id !== id);
    this._write();
  }
  async replaceAll(data) { this.data = data; this._write(); return data; }
};

AIM.RestAdapter = class {
  constructor(cfg) { this.base = cfg.rest.baseUrl.replace(/\/$/, ''); this.headers = { 'Content-Type': 'application/json', ...cfg.rest.headers }; }
  async _req(method, path, body) {
    const r = await fetch(this.base + path, { method, headers: this.headers, body: body ? JSON.stringify(body) : undefined });
    if (!r.ok) throw new Error(method + ' ' + path + ' → ' + r.status);
    return r.status === 204 ? null : r.json();
  }
  async load() {
    const out = {};
    await Promise.all(AIM.COLLECTIONS.map(async c => { out[c] = await this._req('GET', '/' + c); }));
    return out;
  }
  upsert(coll, item) { return this._req('PUT', `/${coll}/${encodeURIComponent(item.id)}`, item); }
  remove(coll, id) { return this._req('DELETE', `/${coll}/${encodeURIComponent(id)}`); }
  replaceAll(data) { return this._req('PUT', '/_bulk', data); }
};

AIM.store = (function () {
  let adapter, state = {};
  const subs = new Set();
  const emit = (coll) => subs.forEach(fn => fn(coll));

  function makeAdapter() {
    const c = AIM.config.data;
    return c.mode === 'rest' ? new AIM.RestAdapter(c) : new AIM.LocalAdapter(c);
  }
  function nextId(coll, prefix) {
    const n = (state[coll] || []).reduce((m, x) => {
      const k = parseInt(String(x.id).replace(/\D/g, ''), 10);
      return isNaN(k) ? m : Math.max(m, k);
    }, 0) + 1;
    return prefix + String(n).padStart(2, '0');
  }

  return {
    async init() {
      adapter = makeAdapter();
      const data = await adapter.load();
      AIM.COLLECTIONS.forEach(c => { state[c] = data[c] || []; });
    },
    mode() { return AIM.config.data.mode; },
    all(coll) { return state[coll] || []; },
    get(coll, id) { return (state[coll] || []).find(x => x.id === id) || null; },
    nextId,
    async save(coll, item) {
      const saved = (await adapter.upsert(coll, item)) || item;
      const arr = state[coll] = [...state[coll]];
      const i = arr.findIndex(x => x.id === saved.id);
      if (i >= 0) arr[i] = saved; else arr.push(saved);
      emit(coll);
      return saved;
    },
    async remove(coll, id) {
      await adapter.remove(coll, id);
      state[coll] = state[coll].filter(x => x.id !== id);
      emit(coll);
    },
    async replaceAll(data) {
      await adapter.replaceAll(data);
      AIM.COLLECTIONS.forEach(c => { state[c] = data[c] || []; });
      emit('*');
    },
    async resetDemo() { await this.replaceAll(AIM.seed()); },
    exportJSON() {
      const out = { exportedAt: new Date().toISOString(), schemaVersion: AIM.config.data.schemaVersion };
      AIM.COLLECTIONS.forEach(c => { out[c] = state[c]; });
      return JSON.stringify(out, null, 2);
    },
    async importJSON(text) {
      const obj = JSON.parse(text);
      const miss = AIM.COLLECTIONS.filter(c => !Array.isArray(obj[c]));
      if (miss.length) throw new Error('Tệp thiếu dữ liệu: ' + miss.join(', '));
      const data = {}; AIM.COLLECTIONS.forEach(c => { data[c] = obj[c]; });
      await this.replaceAll(data);
    },
    subscribe(fn) { subs.add(fn); return () => subs.delete(fn); }
  };
})();
