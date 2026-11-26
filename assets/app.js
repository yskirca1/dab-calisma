// Ortak: menü, içindekiler, KaTeX, kod renklendirme, quiz motoru, canvas yardımcıları
const PAGES = [
  ["index.html", "Ana sayfa"],
  ["1-overview.html", "1 · Genel Bakış"],
  ["2-linear-regression.html", "2 · Lineer Regresyon"],
  ["3-naive-bayes-knn.html", "3 · Naive Bayes & KNN"],
  ["4-logistic-regression.html", "4 · Lojistik Regresyon"],
  ["cheatsheet.html", "⚡ Özet Kağıdı"],
];

(function nav() {
  const here = location.pathname.split("/").pop() || "index.html";
  const h = document.createElement("header");
  h.className = "top";
  h.innerHTML = `<div class="in"><a class="brand" href="index.html">📊 DAB Çalışma</a><nav>${PAGES.map(
    ([u, t]) => `<a href="${u}" class="${u === here || (here === "" && u === "index.html") ? "on" : ""}">${t}</a>`
  ).join("")}</nav></div>`;
  document.body.prepend(h);
  const f = document.createElement("footer");
  f.innerHTML = "İTÜ · Data Analytics for Business (Dr. M. Y. Ulukuş) ders slaytlarından hazırlanmış öğrenci çalışma notudur.";
  document.body.append(f);
})();

document.addEventListener("DOMContentLoaded", () => {
  // içindekiler
  const toc = document.querySelector("aside.toc");
  if (toc) {
    toc.innerHTML = "<b>Bu sayfada</b>";
    document.querySelectorAll("main h2").forEach((h, i) => {
      if (!h.id) h.id = "s" + i;
      const a = document.createElement("a");
      a.href = "#" + h.id;
      a.textContent = h.textContent;
      toc.append(a);
    });
  }
  // KaTeX
  if (window.renderMathInElement) {
    renderMathInElement(document.body, {
      delimiters: [
        { left: "$$", right: "$$", display: true },
        { left: "\\(", right: "\\)", display: false },
      ],
      throwOnError: false,
    });
  }
  // kod: basit python renklendirme + kopyala
  document.querySelectorAll("pre code").forEach((c) => {
    const raw = c.textContent;
    let s = raw.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    const tokens = [];
    const keep = (cls) => (m) => { tokens.push(`<span class="${cls}">${m}</span>`); return "\uE000" + String.fromCharCode(0xE100 + tokens.length - 1) + "\uE001"; };
    s = s.replace(/#[^\n]*/g, keep("cm"));
    s = s.replace(/("[^"\n]*"|'[^'\n]*')/g, keep("st"));
    s = s.replace(/\b(import|from|as|def|return|for|in|if|else|elif|print|True|False|None|lambda|with|class|and|or|not)\b/g, keep("kw"));
    s = s.replace(/\b(\d+\.?\d*)\b/g, keep("nu"));
    s = s.replace(/\b([a-zA-Z_]\w*)(?=\()/g, keep("fn"));
    s = s.replace(/\uE000([\s\S])\uE001/g, (_, ch) => tokens[ch.charCodeAt(0) - 0xE100]);
    c.innerHTML = s;
    const b = document.createElement("button");
    b.className = "copy"; b.textContent = "Kopyala";
    b.onclick = () => { navigator.clipboard.writeText(raw); b.textContent = "Kopyalandı ✓"; setTimeout(() => (b.textContent = "Kopyala"), 1400); };
    c.parentElement.append(b);
  });
  // quiz
  document.querySelectorAll(".quiz").forEach((qz) => {
    const data = JSON.parse(qz.querySelector("script").textContent);
    let score = 0, answered = 0;
    const sc = document.createElement("div");
    sc.className = "tag";
    data.forEach((q) => {
      const d = document.createElement("div");
      d.className = "q";
      d.innerHTML = `<p>${q.q}</p>`;
      q.o.forEach((o, i) => {
        const b = document.createElement("button");
        b.className = "opt"; b.innerHTML = o;
        b.onclick = () => {
          if (d.classList.contains("done")) return;
          d.classList.add("done"); answered++;
          if (i === q.a) score++; else b.classList.add("no");
          d.querySelectorAll(".opt")[q.a].classList.add("ok");
          sc.textContent = `Skor: ${score} / ${answered}  (toplam ${data.length})`;
        };
        d.append(b);
      });
      const ex = document.createElement("div");
      ex.className = "ex"; ex.innerHTML = "💡 " + q.e;
      d.append(ex);
      qz.append(d);
    });
    sc.textContent = `${data.length} soru — cevapla, açıklamayı gör`;
    qz.prepend(sc);
    if (window.renderMathInElement) renderMathInElement(qz, { delimiters: [{ left: "\\(", right: "\\)", display: false }], throwOnError: false });
  });
});

// ---------- canvas yardımcıları ----------
function css(v) { return getComputedStyle(document.documentElement).getPropertyValue(v).trim(); }
function setupCanvas(cv, w, h) {
  const dpr = window.devicePixelRatio || 1;
  cv.width = w * dpr; cv.height = h * dpr;
  cv.style.aspectRatio = `${w}/${h}`;
  const ctx = cv.getContext("2d");
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  return ctx;
}
// Veri koordinatı <-> piksel
function Plot(cv, w, h, xr, yr, pad = 34) {
  const ctx = setupCanvas(cv, w, h);
  const P = {
    ctx, w, h, xr, yr, pad,
    X: (x) => pad + ((x - xr[0]) / (xr[1] - xr[0])) * (w - pad - 12),
    Y: (y) => h - pad + -((y - yr[0]) / (yr[1] - yr[0])) * (h - pad - 12),
    ix: (px) => xr[0] + ((px - pad) / (w - pad - 12)) * (xr[1] - xr[0]),
    iy: (py) => yr[0] + ((h - pad - py) / (h - pad - 12)) * (yr[1] - yr[0]),
    clear() {
      ctx.clearRect(0, 0, w, h);
      ctx.strokeStyle = css("--line"); ctx.lineWidth = 1;
      ctx.fillStyle = css("--muted"); ctx.font = "11px system-ui";
      for (let i = 0; i <= 5; i++) {
        const x = xr[0] + (i / 5) * (xr[1] - xr[0]), y = yr[0] + (i / 5) * (yr[1] - yr[0]);
        ctx.beginPath(); ctx.moveTo(P.X(x), P.Y(yr[0])); ctx.lineTo(P.X(x), P.Y(yr[1])); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(P.X(xr[0]), P.Y(y)); ctx.lineTo(P.X(xr[1]), P.Y(y)); ctx.stroke();
        ctx.fillText(+x.toFixed(2), P.X(x) - 8, h - pad + 15);
        ctx.fillText(+y.toFixed(2), 2, P.Y(y) + 4);
      }
    },
    dot(x, y, c, r = 5, stroke) {
      ctx.beginPath(); ctx.arc(P.X(x), P.Y(y), r, 0, 7); ctx.fillStyle = c; ctx.fill();
      if (stroke) { ctx.strokeStyle = stroke; ctx.lineWidth = 2; ctx.stroke(); }
    },
    fn(f, c, lw = 2.5, dash) {
      ctx.beginPath(); ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.setLineDash(dash || []);
      for (let i = 0; i <= 300; i++) {
        const x = xr[0] + (i / 300) * (xr[1] - xr[0]);
        const y = Math.max(yr[0] - 10 * (yr[1] - yr[0]), Math.min(yr[1] + 10 * (yr[1] - yr[0]), f(x)));
        i ? ctx.lineTo(P.X(x), P.Y(y)) : ctx.moveTo(P.X(x), P.Y(y));
      }
      ctx.stroke(); ctx.setLineDash([]);
    },
    line(x1, y1, x2, y2, c, lw = 1.5, dash) {
      ctx.beginPath(); ctx.strokeStyle = c; ctx.lineWidth = lw; ctx.setLineDash(dash || []);
      ctx.moveTo(P.X(x1), P.Y(y1)); ctx.lineTo(P.X(x2), P.Y(y2)); ctx.stroke(); ctx.setLineDash([]);
    },
    text(t, x, y, c, f = "12px system-ui") { ctx.fillStyle = c || css("--ink"); ctx.font = f; ctx.fillText(t, P.X(x), P.Y(y)); },
    evt(e) {
      const r = cv.getBoundingClientRect();
      const px = ((e.clientX - r.left) / r.width) * w, py = ((e.clientY - r.top) / r.height) * h;
      return [P.ix(px), P.iy(py)];
    },
    clip() { ctx.save(); ctx.beginPath(); ctx.rect(pad, 0, w - pad, h - pad); ctx.clip(); },
    unclip() { ctx.restore(); },
  };
  return P;
}
// tohumlu rastgele + normal
function rng(seed = 7) { return () => ((seed = (seed * 16807) % 2147483647) / 2147483647); }
function randn(r) { let u = 0, v = 0; while (!u) u = r(); v = r(); return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v); }
// en küçük kareler: polinom (normal denklemler, Gauss eleme)
function polyfit(xs, ys, deg) {
  const n = deg + 1, A = Array.from({ length: n }, () => Array(n + 1).fill(0));
  xs.forEach((x, k) => {
    const p = []; for (let i = 0; i < n; i++) p.push(Math.pow(x, i));
    for (let i = 0; i < n; i++) { for (let j = 0; j < n; j++) A[i][j] += p[i] * p[j]; A[i][n] += p[i] * ys[k]; }
  });
  for (let i = 0; i < n; i++) A[i][i] += 1e-9;
  for (let i = 0; i < n; i++) {
    let m = i; for (let r = i + 1; r < n; r++) if (Math.abs(A[r][i]) > Math.abs(A[m][i])) m = r;
    [A[i], A[m]] = [A[m], A[i]];
    for (let r = 0; r < n; r++) if (r !== i) { const f = A[r][i] / A[i][i]; for (let c = i; c <= n; c++) A[r][c] -= f * A[i][c]; }
  }
  const b = A.map((row, i) => row[n] / row[i]);
  const f = (x) => b.reduce((s, bi, i) => s + bi * Math.pow(x, i), 0);
  f.coef = b; return f;
}
const sigmoid = (z) => 1 / (1 + Math.exp(-z));
