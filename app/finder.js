// Deal Finder — renders the deal grid, filters, sorting and the detail view.
// All rendering is plain DOM built from deals.js; no network calls.

import { deals, CATEGORIES, STORES, CHECKED } from "./deals.js";

export const VERDICT_LABEL = {
  "new-low": "New low",
  strong: "Strong price",
  routine: "Routine sale",
};

export function money(n) {
  return "$" + n.toFixed(2).replace(/\.00$/, "");
}

export function savedAmount(d) {
  return +(d.was - d.price).toFixed(2);
}

export function checkedLabel(d) {
  const t = new Date(d.checked);
  return "Checked " + t.toUTCString().slice(0, 22) + " UTC";
}

export function applyFilters(list, state) {
  const q = state.q.trim().toLowerCase();
  let out = list.filter((d) => {
    if (state.category !== "All" && d.category !== state.category) return false;
    if (state.store !== "All" && d.store !== state.store) return false;
    if (d.pct < state.minPct) return false;
    if (state.onlyNewLow && d.verdict !== "new-low") return false;
    if (q) {
      const hay = (d.title + " " + d.store + " " + d.category).toLowerCase();
      if (!hay.includes(q)) return false;
    }
    return true;
  });
  const by = {
    best: (a, b) => score(b) - score(a),
    discount: (a, b) => b.pct - a.pct || b.was - a.was,
    saving: (a, b) => savedAmount(b) - savedAmount(a),
    "price-low": (a, b) => a.price - b.price,
    "price-high": (a, b) => b.price - a.price,
  }[state.sort] || ((a, b) => score(b) - score(a));
  return [...out].sort(by);
}

// Best-deal score: big percentage cuts and big dollar savings both count,
// and a verified new low gets a bonus so true bargains float to the top.
export function score(d) {
  return d.pct * 2 + Math.min(savedAmount(d), 400) / 10 + (d.verdict === "new-low" ? 25 : 0);
}

export function cardHtml(d) {
  return (
    '<article class="card">' +
    '<div class="meta"><span>' + d.store + '</span><span>' + d.category + '</span></div>' +
    '<h2><a href="#/deal/' + d.id + '">' + escapeHtml(d.title) + '</a></h2>' +
    '<div class="prices"><span class="price-now">' + money(d.price) + '</span>' +
    '<span class="price-was">' + money(d.was) + '</span>' +
    '<span class="off">' + d.pct + '% off</span></div>' +
    '<p class="save">You save ' + money(savedAmount(d)) + '</p>' +
    '<span class="verdict ' + d.verdict + '">' + VERDICT_LABEL[d.verdict] + '</span>' +
    '<p class="evidence">' + escapeHtml(d.evidence) + '</p>' +
    '<p class="checked">' + checkedLabel(d) + ' &middot; Source: ' + escapeHtml(d.source) + '</p>' +
    '<a class="shop" href="' + d.url + '" target="_blank" rel="noopener">See it at ' + d.store + ' &rarr;</a>' +
    '</article>'
  );
}

export function detailHtml(d) {
  const same = deals.filter((x) => x.title === d.title && x.id !== d.id);
  const compare = same.length
    ? '<p><strong>Same product elsewhere:</strong> ' + same.map((x) => x.store + ' ' + money(x.price) + ' (' + x.pct + '% off)').join(', ') + '. The cheaper one is listed first in the grid when you sort by price.</p>'
    : '';
  return (
    '<p class="back"><a href="#/">&larr; Back to all deals</a></p>' +
    '<h2>' + escapeHtml(d.title) + '</h2>' +
    '<p><strong>' + d.store + '</strong> &middot; ' + d.category + '</p>' +
    '<div class="prices"><span class="price-now">' + money(d.price) + '</span>' +
    '<span class="price-was">' + money(d.was) + '</span>' +
    '<span class="off">' + d.pct + '% off</span></div>' +
    '<p class="save">You save ' + money(savedAmount(d)) + ' (' + d.pct + '% off the usual price of ' + money(d.was) + ').</p>' +
    '<p><span class="verdict ' + d.verdict + '">' + VERDICT_LABEL[d.verdict] + '</span></p>' +
    '<p class="evidence">' + escapeHtml(d.evidence) + '</p>' +
    compare +
    '<p class="checked">' + checkedLabel(d) + '.<br>Price read from: ' + escapeHtml(d.source) + '.</p>' +
    '<p><a class="shop" href="' + d.url + '" target="_blank" rel="noopener">See it at ' + d.store + ' &rarr;</a></p>'
  );
}

export function escapeHtml(s) {
  return String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
}

export function fillOptions(select, values, allLabel) {
  select.innerHTML = '<option value="All">' + allLabel + '</option>' +
    values.map((v) => '<option value="' + escapeHtml(v) + '">' + escapeHtml(v) + '</option>').join("");
}

export { CATEGORIES, STORES, CHECKED };
