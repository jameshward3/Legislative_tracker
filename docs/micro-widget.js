const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const state = window.ORANGE_TRACKER_SEED || { items: [] };
const budgetData = window.ORANGE_BUDGET_DASHBOARD_DATA || {};
const year = new URLSearchParams(window.location.search).get("year") || "2026";
const items = state.items.filter((item) => fiscalYearForDate(item.meetingDate) === year);
const passed = items.filter((item) => item.status === "passed");
const spending = passed.reduce((sum, item) => sum + spendingAmount(item), 0);
const budget = numeric(budgetData.budgetSummary?.totalAppropriations) || Math.max(60000000, spending * 1.2);
const percent = Math.min(100, Math.round((spending / Math.max(1, budget)) * 100));
const activityItems = [...items]
  .sort((a, b) => String(b.meetingDate).localeCompare(String(a.meetingDate)) || Math.abs(spendingAmount(b)) - Math.abs(spendingAmount(a)))
  .slice(0, 24);

const els = {
  totalItems: document.querySelector("#totalItems"),
  meetingCount: document.querySelector("#meetingCount"),
  spentYtd: document.querySelector("#spentYtd"),
  budgetPace: document.querySelector("#budgetPace"),
  spendingGauge: document.querySelector("#spendingGauge"),
  activityCount: document.querySelector("#activityCount"),
  activityFeed: document.querySelector("#activityFeed"),
  selectedItem: document.querySelector("#selectedItem"),
  openFullTracker: document.querySelector("#openFullTracker"),
};

render();

function render() {
  const meetingDates = new Set(items.map((item) => item.meetingDate).filter(Boolean));
  (state.archiveMeetings || [])
    .filter((meeting) => fiscalYearForDate(meeting.meetingDate) === year)
    .forEach((meeting) => meetingDates.add(meeting.meetingDate));
  const meetingCount = meetingDates.size;
  els.totalItems.textContent = items.length;
  els.meetingCount.textContent = `${meetingCount} meeting${meetingCount === 1 ? "" : "s"} tracked`;
  els.spentYtd.textContent = currency.format(spending);
  els.budgetPace.textContent = `${percent}% of ${currency.format(budget)} budget`;
  els.spendingGauge.style.setProperty("--pct", `${percent}%`);
  els.spendingGauge.dataset.label = `${percent}%`;
  els.activityCount.textContent = `${activityItems.length} recent`;
  els.openFullTracker.href = fullTrackerUrl();

  els.activityFeed.innerHTML = activityItems
    .map((item, index) => `
      <button class="activity-item${index === 0 ? " active" : ""}" type="button" data-item-id="${escapeHtml(item.id)}" role="option" aria-selected="${index === 0 ? "true" : "false"}">
        <span class="activity-date">${escapeHtml(formatDate(item.meetingDate))}</span>
        <span class="activity-title">${escapeHtml(item.title)}</span>
        <span class="activity-amount">${spendingAmount(item) ? currency.format(spendingAmount(item)) : titleCase(item.status)}</span>
      </button>
    `)
    .join("");

  els.activityFeed.querySelectorAll("[data-item-id]").forEach((button) => {
    button.addEventListener("click", () => selectItem(button.dataset.itemId));
  });

  if (activityItems.length) selectItem(activityItems[0].id);
  else els.selectedItem.innerHTML = `<p>No activity found for ${escapeHtml(year)}.</p>`;
}

function selectItem(id) {
  const item = activityItems.find((entry) => entry.id === id);
  if (!item) return;
  els.activityFeed.querySelectorAll(".activity-item").forEach((button) => {
    const active = button.dataset.itemId === id;
    button.classList.toggle("active", active);
    button.setAttribute("aria-selected", String(active));
  });
  els.selectedItem.innerHTML = `
    <h3>${escapeHtml(item.title)}</h3>
    <div class="selected-meta">
      <span>${escapeHtml(formatDate(item.meetingDate))}</span>
      <span>${escapeHtml(titleCase(item.type))}</span>
      <span>${escapeHtml(titleCase(item.status))}</span>
      ${spendingAmount(item) ? `<span>${currency.format(spendingAmount(item))}</span>` : ""}
    </div>
    <p>${escapeHtml(truncate(item.discussion || item.publicComments || item.budgetCategory || "No additional summary is recorded for this item.", 180))}</p>
    <a href="${fullTrackerUrl(id)}" target="_blank" rel="noopener">Open selected item in tracker</a>
  `;
}

function fullTrackerUrl(itemId = "") {
  const base = new URL("index.html", window.location.href);
  if (itemId) base.searchParams.set("focusItem", itemId);
  return base.toString();
}

function spendingAmount(item) {
  const amount = numeric(item.amount);
  return item.amountType === "expense" || item.amountType === "refund" ? amount : 0;
}

function fiscalYearForDate(dateString) {
  return String(dateString || "").slice(0, 4) || year;
}

function formatDate(dateString) {
  if (!dateString) return "No date";
  const date = new Date(`${dateString}T12:00:00`);
  return new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric", year: "numeric" }).format(date);
}

function titleCase(value) {
  return String(value || "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function truncate(value, maxLength) {
  const text = String(value || "");
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}...` : text;
}

function numeric(value) {
  return Number.parseFloat(value) || 0;
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
