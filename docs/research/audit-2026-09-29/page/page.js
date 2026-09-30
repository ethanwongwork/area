(function () {
  var KEY = "area-audit-decisions-v1";
  var state = {};
  try { state = JSON.parse(localStorage.getItem(KEY) || "{}") || {}; } catch (e) { state = {}; }
  function save() { try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) {} }
  function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }

  // Family decisions → cards
  var smallRoot = document.getElementById("small");
  var groups = [];
  SMALL.forEach(function (d) { if (groups.indexOf(d.group) < 0) groups.push(d.group); });
  groups.forEach(function (g) {
    var h = document.createElement("h3"); h.textContent = g; h.style.margin = "28px 0 4px"; smallRoot.appendChild(h);
    SMALL.filter(function (d) { return d.group === g; }).forEach(function (d) {
      var a = document.createElement("article"); a.className = "dec"; a.id = d.id;
      a.innerHTML = '<header><span class="id">' + esc(d.id) + '</span><h3>' + esc(d.title) + '</h3><span class="sev ' + d.sev + '">' + d.sev[0].toUpperCase() + d.sev.slice(1) + '</span></header>' +
        '<p class="what">' + esc(d.what) + '</p><div class="choose" data-dec="' + esc(d.id) + '" data-title="' + esc(d.title) + '" data-rec="' + esc(d.rec) + '"></div>';
      a.querySelector(".choose").dataset.opts = JSON.stringify(d.opts);
      if (d.pick) { a.querySelector(".choose").dataset.pick = d.pick; a.classList.add("is-done"); }
      smallRoot.appendChild(a);
    });
  });

  // Choice groups
  var chooses = Array.prototype.slice.call(document.querySelectorAll(".choose"));
  chooses.forEach(function (box) {
    var id = box.dataset.dec, rec = box.dataset.rec, opts = JSON.parse(box.dataset.opts || "[]");
    var html = "";
    opts.forEach(function (o) {
      var rid = "c-" + id + "-" + o[0].replace(/[^A-Za-z0-9]/g, "");
      html += '<label for="' + rid + '"><input type="radio" id="' + rid + '" name="dec-' + esc(id) + '" value="' + esc(o[0]) + '"><b>' + esc(o[0]) + '</b><span>' + esc(o[1]) + (o[0] === rec ? ' <span class="tag-rec rec">Recommended</span>' : "") + '</span></label>';
    });
    html += '<textarea class="note" id="n-' + esc(id) + '" rows="1" placeholder="Note (optional)" aria-label="Note for ' + esc(id) + '"></textarea>';
    box.innerHTML = html;
    var s = state[id];
    if (box.dataset.pick) {
      s = state[id] = { v: box.dataset.pick, n: (s && s.n) || "" };
      Array.prototype.forEach.call(box.querySelectorAll("input"), function (r) { r.disabled = true; });
      box.insertAdjacentHTML("afterbegin", '<p class="section-note" style="margin:0 0 6px"><span class="tag-done">Owner pick · ' + esc(box.dataset.pick) + '</span></p>');
    }
    if (s && s.v) { var r = box.querySelector('input[value="' + CSS.escape(s.v) + '"]'); if (r) r.checked = true; }
    if (s && s.n) box.querySelector("textarea").value = s.n;
    box.addEventListener("change", function (e) {
      if (e.target.type === "radio") { state[id] = state[id] || {}; state[id].v = e.target.value; save(); count(); }
    });
    box.querySelector("textarea").addEventListener("input", function (e) { state[id] = state[id] || {}; state[id].n = e.target.value; save(); });
  });
  function count() {
    var n = chooses.filter(function (b) { return state[b.dataset.dec] && state[b.dataset.dec].v; }).length;
    document.getElementById("dock-count").textContent = n + " of " + chooses.length + " decided";
  }
  count();

  document.getElementById("btn-rec").addEventListener("click", function () {
    chooses.forEach(function (b) {
      var id = b.dataset.dec;
      if (state[id] && state[id].v) return;
      var r = b.querySelector('input[value="' + CSS.escape(b.dataset.rec) + '"]');
      if (r) { r.checked = true; state[id] = state[id] || {}; state[id].v = b.dataset.rec; }
    });
    save(); count();
  });

  var out = document.getElementById("copyout"), outText = document.getElementById("copyout-text");
  function build() {
    var lines = ["Area audit decisions (" + new Date().toISOString().slice(0, 10) + ")", ""];
    chooses.forEach(function (b) {
      var id = b.dataset.dec, s = state[id] || {};
      var pick = s.v ? s.v + (s.v === b.dataset.rec ? " (recommended)" : "") : "undecided";
      lines.push(id + " " + b.dataset.title + ": " + pick + (s.n ? " | note: " + s.n.replace(/\s+/g, " ") : ""));
    });
    return lines.join("\n");
  }
  function copy(text) {
    var msg = document.getElementById("copyout-msg");
    try {
      navigator.clipboard.writeText(text).then(function () { msg.textContent = "Copied. Paste it into the Claude session."; },
        function () { msg.textContent = "Select the text and copy it."; outText.select(); });
    } catch (e) { msg.textContent = "Select the text and copy it."; outText.select(); }
  }
  document.getElementById("btn-copy").addEventListener("click", function () { var t = build(); outText.value = t; out.hidden = false; copy(t); });
  document.getElementById("copyout-copy").addEventListener("click", function () { copy(outText.value); });
  document.getElementById("copyout-close").addEventListener("click", function () { out.hidden = true; });
  out.addEventListener("click", function (e) { if (e.target === out) out.hidden = true; });
  document.addEventListener("keydown", function (e) { if (e.key === "Escape") out.hidden = true; });

  // Fix table with filters
  var sevRank = { high: 0, medium: 1, low: 2 };
  var fixes = FIXES.slice().sort(function (a, b) { return sevRank[a[2]] - sevRank[b[2]]; });
  var tbody = document.querySelector("#fix-table tbody");
  tbody.innerHTML = fixes.map(function (f) {
    var st = f[5], partly = st === "partly" ? f[7] : "";
    var tag = st === "done" ? '<span class="tag-done">Done · ' + esc(f[6]) + '</span>' : partly ? '<span class="tag-now" title="' + esc(partly) + '">Partly · ' + esc(f[6]) + '</span>' : '<span class="tag-now">Open</span>';
    return '<tr data-sev="' + f[2] + '" data-cat="' + esc(f[3]) + '" data-status="' + (st === "done" ? "done" : "open") + '"><td class="id">' + esc(f[0]) + '</td><td class="fam">' + esc(f[1]) + '</td><td><span class="sev ' + f[2] + '">' + f[2] + '</span></td><td class="fam">' + esc(f[3]) + '</td><td>' + tag + '</td><td>' + esc(f[4]) + (partly ? '<br><span class="fam">' + esc(partly) + '</span>' : '') + '</td></tr>';
  }).join("");
  var filt = document.getElementById("fix-filters");
  var cats = ["all", "open", "done", "high", "medium", "low"];
  var extra = []; fixes.forEach(function (f) { if (extra.indexOf(f[3]) < 0) extra.push(f[3]); });
  cats.concat(extra.sort()).forEach(function (c, i) {
    var b = document.createElement("button"); b.type = "button"; b.textContent = c === "all" ? "All " + fixes.length : c;
    b.setAttribute("aria-pressed", i === 0 ? "true" : "false");
    b.addEventListener("click", function () {
      Array.prototype.forEach.call(filt.children, function (x) { x.setAttribute("aria-pressed", "false"); });
      b.setAttribute("aria-pressed", "true");
      Array.prototype.forEach.call(tbody.rows, function (r) {
        r.hidden = !(c === "all" || r.dataset.sev === c || r.dataset.cat === c || r.dataset.status === c);
      });
    });
    filt.appendChild(b);
  });

  document.querySelector("#drift-table tbody").innerHTML = DRIFT.map(function (d) {
    return "<tr><td class=\"fam mono\" style=\"font-size:12px\">" + esc(d[0]) + "</td><td>" + esc(d[1]) + "</td><td>" + esc(d[2]) + "</td></tr>";
  }).join("");
  document.querySelector("#check-table tbody").innerHTML = CHECKS.map(function (c) {
    var cls = /fail/.test(c[1]) ? (c[1].indexOf("pass") > 0 ? "nr" : "fail") : /not run/.test(c[1]) ? "nr" : "pass";
    return "<tr><td class=\"mono\" style=\"font-size:12.5px\">" + esc(c[0]) + "</td><td class=\"" + cls + "\">" + esc(c[1]) + "</td><td>" + esc(c[2]) + "</td></tr>";
  }).join("");

  // Live probes: computed values read from the rendered specimens.
  function stageOf(p) { var fig = p.closest("figure"); return fig ? fig.querySelector(".stage") : null; }
  function probe() {
    Array.prototype.forEach.call(document.querySelectorAll(".probe[data-q]"), function (p) {
      var st = stageOf(p); if (!st) return;
      var props = (p.dataset.p || "").split(",");
      p.innerHTML = p.dataset.q.split(";").map(function (pair) {
        var bits = pair.split("|"), el = st.querySelector(bits[0]);
        if (!el) return "";
        var cs = getComputedStyle(el);
        return "<span>" + esc(bits[1] || bits[0]) + ": " + props.map(function (k) { return esc(cs[k]); }).join(" / ") + "</span>";
      }).join("");
    });
    Array.prototype.forEach.call(document.querySelectorAll(".probe[data-offset]"), function (p) {
      var st = stageOf(p); if (!st) return;
      var bits = p.dataset.offset.split("|");
      var labels = Array.prototype.slice.call(st.querySelectorAll(bits[0])).slice(0, 2);
      p.innerHTML = labels.map(function (l) {
        var row = l.closest(bits[1]); if (!row) return "";
        var z = parseFloat(getComputedStyle(st.firstElementChild).zoom) || 1;
        var dx = (l.getBoundingClientRect().left - row.getBoundingClientRect().left) / z;
        return "<span>" + esc(l.textContent.trim().slice(0, 14)) + ": " + bits[2] + " " + Math.round(dx * 10) / 10 + "px</span>";
      }).join("");
    });
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(probe); else probe();
  window.addEventListener("load", probe);

  // Specimens are pictures, not controls: keep them out of the tab order.
  Array.prototype.forEach.call(document.querySelectorAll(".stage"), function (s) { s.setAttribute("inert", ""); });
})();
