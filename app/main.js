// Entry point: wires the search box, filters and sort controls to the grid,
// and the hash routes #/ (list) and #/deal/<id> (one deal in full).
// window.__shotReady flips true once a view is painted, for screenshots.

import { deals, CHECKED } from "./deals.js";
import {
  applyFilters, cardHtml, detailHtml, fillOptions, savedAmount, money,
} from "./finder.js";

const grid = document.getElementById("grid");
const count = document.getElementById("count");
const detail = document.getElementById("detail");
const search = document.getElementById("search");
const categorySel = document.getElementById("category");
const storeSel = document.getElementById("store");
const discountSel = document.getElementById("discount");
const sortSel = document.getElementById("sort");
const onlyNewLow = document.getElementById("only-verified");
const stats = document.getElementById("stats");

fillOptions(categorySel, [...new Set(deals.map((d) => d.category))], "All categories");
fillOptions(storeSel, [...new Set(deals.map((d) => d.store))], "All stores");

// Shareable filtered links: ?q=airpods&cat=Audio&store=Amazon&min=40&sort=discount&lows=1
const params = new URLSearchParams(location.search);
if (params.get("q")) search.value = params.get("q");
if (params.get("cat")) categorySel.value = params.get("cat");
if (params.get("store")) storeSel.value = params.get("store");
if (params.get("min")) discountSel.value = params.get("min");
if (params.get("sort")) sortSel.value = params.get("sort");
if (params.get("lows") === "1") onlyNewLow.checked = true;

function renderStats() {
  const best = [...deals].sort((a, b) => b.pct - a.pct)[0];
  const avg = Math.round(deals.reduce((s, d) => s + d.pct, 0) / deals.length);
  const total = deals.reduce((s, d) => s + savedAmount(d), 0);
  const lows = deals.filter((d) => d.verdict === "new-low").length;
  stats.innerHTML =
    "<span class='stat'><b>" + deals.length + "</b>deals checked</span>" +
    "<span class='stat'><b>" + avg + "%</b>average discount</span>" +
    "<span class='stat'><b>" + best.pct + "%</b>biggest cut</span>" +
    "<span class='stat'><b>" + lows + "</b>new lows</span>" +
    "<span class='stat'><b>" + money(total) + "</b>total savings</span>";
}

function currentState() {
  return {
    q: search.value,
    category: categorySel.value,
    store: storeSel.value,
    minPct: parseInt(discountSel.value, 10) || 0,
    sort: sortSel.value,
    onlyNewLow: onlyNewLow.checked,
  };
}

function renderList() {
  const shown = applyFilters(deals, currentState());
  count.textContent = shown.length === deals.length
    ? "Showing all " + deals.length + " deals, best first"
    : "Showing " + shown.length + " of " + deals.length + " deals";
  grid.innerHTML = shown.length
    ? shown.map(cardHtml).join("")
    : '<p class="empty">No deals match those filters. Try clearing the search or lowering the discount.</p>';
  detail.hidden = true;
  detail.innerHTML = "";
  grid.hidden = false;
  document.title = "Black Friday Deal Radar — " + deals.length + " checked deals, Nov 27 2026";
}

function renderDetail(id) {
  const d = deals.find((x) => x.id === id);
  if (!d) {
    detail.innerHTML = "<p class='back'><a href='#/'>&larr; Back to all deals</a></p><p>That deal is not on the board.</p>";
  } else {
    detail.innerHTML = detailHtml(d);
    document.title = d.title + " — " + money(d.price) + " at " + d.store + " | Black Friday Deal Radar";
  }
  detail.hidden = false;
  grid.hidden = true;
  count.textContent = "";
}

function render() {
  window.__shotReady = false;
  const match = location.hash.match(/^#\/deal\/([^/?]+)/);
  if (match) renderDetail(decodeURIComponent(match[1]));
  else renderList();
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

for (const el of [search, categorySel, storeSel, discountSel, sortSel, onlyNewLow]) {
  el.addEventListener("input", renderList);
}
window.addEventListener("hashchange", render);
renderStats();
render();
