const STORAGE_KEY = "orange-legislative-tracker-v2";
const ADMIN_PASSWORD = "win07050";
const ADMIN_SESSION_KEY = "orange-legislative-tracker-admin-unlocked";

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0,
});

const fallbackState = {
  councilMembers: [
    "Mayor",
    "Mayor Pro Tem",
    "Council Member 1",
    "Council Member 2",
    "Council Member 3",
  ],
  items: [
    {
      id: crypto.randomUUID(),
      title: "Sample public works contract",
      type: "contract",
      dateIntroduced: "2026-05-01",
      meetingDate: "2026-05-14",
      status: "passed",
      amount: 125000,
      amountType: "expense",
      resolutionNumber: "RESO-2026-01",
      ordinanceNumber: "",
      contractName: "Street repair services",
      budgetCategory: "Public Works",
      discussion:
        "Staff presented scope, procurement basis, and expected service timeline.",
      publicComments:
        "Residents asked for clearer street selection criteria and project completion notices.",
      votes: {
        Mayor: "yes",
        "Mayor Pro Tem": "yes",
        "Council Member 1": "yes",
        "Council Member 2": "no",
        "Council Member 3": "yes",
      },
      sourceDoc: "Sample agenda",
      rawText: "",
      updatedAt: new Date().toISOString(),
    },
  ],
  budgetLines: [
    {
      id: crypto.randomUUID(),
      fiscalYear: "2026",
      department: "Public Works",
      category: "Public Works",
      approvedBudget: 1200000,
    },
  ],
};

const defaultState = window.ORANGE_TRACKER_SEED || fallbackState;
const budgetDashboardData = window.ORANGE_BUDGET_DASHBOARD_DATA || null;
const councilProfiles = {
  "Adrienne K. Wooten": {
    role: "Council President",
    email: "awooten@orangenj.gov",
    phone: "973-518-3360",
    termExpires: "June 30, 2028",
    photoUrl: "assets/council/adrienne-wooten.jpeg",
  },
  "Tency A. Eason": {
    role: "Council Vice President, North Ward Councilmember",
    email: "teason@orangenj.gov",
    phone: "(973) 651-7439",
    termExpires: "June 30, 2026",
    photoUrl: "assets/council/tency-eason.jpeg",
  },
  "Kerry J. Coley": {
    role: "East Ward Councilmember",
    email: "KColey@orangenj.gov",
    phone: "(973) 317-4039",
    termExpires: "June 30, 2026",
    photoUrl: "assets/council/kerry-coley.jpeg",
  },
  "Quantavia L. Hilbert": {
    role: "West Ward Councilmember",
    email: "qhilbert@orangenj.gov",
    phone: "(201) 341-2870",
    termExpires: "June 30, 2026",
    photoUrl: "assets/council/quantavia-hilbert.jpeg",
  },
  "Weldon M. Montague, III": {
    role: "Councilmember-At-Large",
    email: "wmontague@orangenj.gov",
    phone: "(862) 233-5701",
    termExpires: "June 30, 2028",
    photoUrl: "assets/council/weldon-montague.jpeg",
  },
  "Clifford R. Ross": {
    role: "Councilmember-At-Large",
    email: "wmontague@orangenj.gov",
    phone: "(862) 233-5612",
    termExpires: "June 30, 2028",
    photoUrl: "assets/council/clifford-ross.jpeg",
  },
  "Jamie B. Summers-Johnson": {
    role: "South Ward Councilmember",
    email: "jsummers@orangenj.gov",
    phone: "(862) 272-1155",
    termExpires: "June 30, 2026",
    photoUrl: "assets/council/jamie-summers-johnson.jpeg",
  },
};

let state = loadState();
let pendingReview = [];
let selectedPublicMember = "";
let focusedItemId = "";

const els = {
  tabs: document.querySelectorAll(".tab"),
  panels: document.querySelectorAll(".panel"),
  meetingDateFilter: document.querySelector("#meetingDateFilter"),
  fiscalYearFilter: document.querySelector("#fiscalYearFilter"),
  statusFilter: document.querySelector("#statusFilter"),
  typeFilter: document.querySelector("#typeFilter"),
  itemSearch: document.querySelector("#itemSearch"),
  kpiGrid: document.querySelector("#kpiGrid"),
  dashboardLegislationTable: document.querySelector("#dashboardLegislationTable"),
  voteMatrix: document.querySelector("#voteMatrix"),
  spendingGauge: document.querySelector("#spendingGauge"),
  deptDonuts: document.querySelector("#deptDonuts"),
  trendChart: document.querySelector("#trendChart"),
  wordCloud: document.querySelector("#wordCloud"),
  publicEngagement: document.querySelector("#publicEngagement"),
  dataUpdatedLabel: document.querySelector("#dataUpdatedLabel"),
  statusBars: document.querySelector("#statusBars"),
  actionCountLabel: document.querySelector("#actionCountLabel"),
  budgetHealthLabel: document.querySelector("#budgetHealthLabel"),
  budgetMeterFill: document.querySelector("#budgetMeterFill"),
  budgetSummary: document.querySelector("#budgetSummary"),
  recentActions: document.querySelector("#recentActions"),
  agendaPdfInput: document.querySelector("#agendaPdfInput"),
  agendaMeetingDate: document.querySelector("#agendaMeetingDate"),
  parseAgendaBtn: document.querySelector("#parseAgendaBtn"),
  minutesPdfInput: document.querySelector("#minutesPdfInput"),
  minutesMeetingDate: document.querySelector("#minutesMeetingDate"),
  parseMinutesBtn: document.querySelector("#parseMinutesBtn"),
  extractionStatus: document.querySelector("#extractionStatus"),
  extractionReview: document.querySelector("#extractionReview"),
  reviewItemTemplate: document.querySelector("#reviewItemTemplate"),
  itemsTable: document.querySelector("#itemsTable"),
  itemDialog: document.querySelector("#itemDialog"),
  itemForm: document.querySelector("#itemForm"),
  itemDialogTitle: document.querySelector("#itemDialogTitle"),
  editingItemId: document.querySelector("#editingItemId"),
  itemTitle: document.querySelector("#itemTitle"),
  itemType: document.querySelector("#itemType"),
  dateIntroduced: document.querySelector("#dateIntroduced"),
  meetingDate: document.querySelector("#meetingDate"),
  itemStatus: document.querySelector("#itemStatus"),
  amount: document.querySelector("#amount"),
  amountType: document.querySelector("#amountType"),
  resolutionNumber: document.querySelector("#resolutionNumber"),
  ordinanceNumber: document.querySelector("#ordinanceNumber"),
  contractName: document.querySelector("#contractName"),
  budgetCategory: document.querySelector("#budgetCategory"),
  budgetCategoryOptions: document.querySelector("#budgetCategoryOptions"),
  discussion: document.querySelector("#discussion"),
  publicComments: document.querySelector("#publicComments"),
  voteEditor: document.querySelector("#voteEditor"),
  saveItemBtn: document.querySelector("#saveItemBtn"),
  deleteItemBtn: document.querySelector("#deleteItemBtn"),
  addItemBtn: document.querySelector("#addItemBtn"),
  budgetSourceSummary: document.querySelector("#budgetSourceSummary"),
  budgetTable: document.querySelector("#budgetTable"),
  spendingBreakdown: document.querySelector("#spendingBreakdown"),
  memberToggle: document.querySelector("#memberToggle"),
  memberProfile: document.querySelector("#memberProfile"),
  addCouncilMemberBtn: document.querySelector("#addCouncilMemberBtn"),
  councilList: document.querySelector("#councilList"),
  exportJsonBtn: document.querySelector("#exportJsonBtn"),
  importJsonInput: document.querySelector("#importJsonInput"),
  printPublicViewBtn: document.querySelector("#printPublicViewBtn"),
  adminGate: document.querySelector("#adminGate"),
  adminContent: document.querySelector("#adminContent"),
  adminPassword: document.querySelector("#adminPassword"),
  unlockAdminBtn: document.querySelector("#unlockAdminBtn"),
  lockAdminBtn: document.querySelector("#lockAdminBtn"),
  adminPasswordError: document.querySelector("#adminPasswordError"),
};

bindEvents();
render();
applyInitialFocusFromQuery();

function bindEvents() {
  els.tabs.forEach((tab) => {
    tab.addEventListener("click", () => showTab(tab.dataset.tab));
  });
  document.querySelectorAll("[data-tab-link]").forEach((button) => {
    button.addEventListener("click", () => showTab(button.dataset.tabLink));
  });

  [
    els.fiscalYearFilter,
    els.meetingDateFilter,
    els.statusFilter,
    els.typeFilter,
    els.itemSearch,
  ].forEach((el) => el.addEventListener("input", render));

  els.parseAgendaBtn.addEventListener("click", parseAgendaUpload);
  els.parseMinutesBtn.addEventListener("click", parseMinutesUpload);
  els.addItemBtn?.addEventListener("click", () => openItemDialog());
  els.saveItemBtn.addEventListener("click", saveItemFromDialog);
  els.deleteItemBtn.addEventListener("click", deleteCurrentItem);
  els.addCouncilMemberBtn.addEventListener("click", addCouncilMember);
  els.exportJsonBtn.addEventListener("click", exportJson);
  els.importJsonInput.addEventListener("change", importJson);
  els.printPublicViewBtn.addEventListener("click", () => window.print());
  els.unlockAdminBtn.addEventListener("click", unlockAdmin);
  els.lockAdminBtn.addEventListener("click", lockAdmin);
  els.adminPassword.addEventListener("keydown", (event) => {
    if (event.key === "Enter") unlockAdmin();
  });
}

function loadState() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) return structuredClone(defaultState);
    const saved = JSON.parse(stored);
    const base = structuredClone(defaultState);
    return {
      ...base,
      ...saved,
      councilMembers: saved.councilMembers?.length ? saved.councilMembers : base.councilMembers,
      items: mergeById(base.items, saved.items || []),
      budgetLines: mergeById(base.budgetLines, filterSavedBudgetLines(saved.budgetLines || [])),
    };
  } catch {
    return structuredClone(defaultState);
  }
}

function filterSavedBudgetLines(lines) {
  if (!budgetDashboardData) return lines;
  const legacyPlaceholderIds = new Set([
    "budget-governance",
    "budget-legal",
    "budget-public-works",
    "budget-water",
    "budget-fire",
    "budget-bill-list",
  ]);
  return lines.filter((line) => !(legacyPlaceholderIds.has(line.id) && numeric(line.approvedBudget) === 0));
}

function mergeById(baseItems, savedItems) {
  const merged = new Map(baseItems.map((entry) => [entry.id, entry]));
  savedItems.forEach((entry) => merged.set(entry.id, entry));
  return [...merged.values()];
}

function persist() {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function showTab(id) {
  els.tabs.forEach((tab) => tab.classList.toggle("active", tab.dataset.tab === id));
  els.panels.forEach((panel) => panel.classList.toggle("active", panel.id === id));
}

function applyInitialFocusFromQuery() {
  const itemId = new URLSearchParams(window.location.search).get("focusItem");
  if (!itemId || !state.items.some((item) => item.id === itemId)) return;
  focusedItemId = itemId;
  els.itemSearch.value = "";
  els.statusFilter.value = "all";
  els.typeFilter.value = "all";
  els.fiscalYearFilter.value = "all";
  syncMeetingDates();
  els.meetingDateFilter.value = "all";
  showTab("items");
  renderItemsTable();
  requestAnimationFrame(() => {
    const row = document.querySelector(`[data-item-row="${CSS.escape(itemId)}"]`);
    row?.scrollIntoView({ block: "center", behavior: "smooth" });
  });
}

function render() {
  renderDataUpdatedLabel();
  syncFiscalYears();
  syncMeetingDates();
  syncBudgetCategories();
  renderDashboard();
  renderItemsTable();
  renderBudget();
  renderMemberScorecards();
  renderCouncilMembers();
  renderAdminGate();
}

function renderDataUpdatedLabel() {
  const generatedAt = window.ORANGE_TRACKER_SEED?.siteUpdateSummary?.generatedAt;
  if (!generatedAt) {
    els.dataUpdatedLabel.textContent = "Data updated: unavailable";
    return;
  }

  const generatedDate = new Date(generatedAt);
  if (Number.isNaN(generatedDate.getTime())) {
    els.dataUpdatedLabel.textContent = `Data updated: ${generatedAt}`;
    return;
  }

  const formatted = generatedDate.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZoneName: "short",
  });
  els.dataUpdatedLabel.textContent = `Data updated: ${formatted}`;
}

function renderAdminGate() {
  const unlocked = sessionStorage.getItem(ADMIN_SESSION_KEY) === "true";
  els.adminGate.hidden = unlocked;
  els.adminContent.hidden = !unlocked;
  if (unlocked) els.adminPasswordError.textContent = "";
}

function unlockAdmin() {
  if (els.adminPassword.value === ADMIN_PASSWORD) {
    sessionStorage.setItem(ADMIN_SESSION_KEY, "true");
    els.adminPassword.value = "";
    renderAdminGate();
    return;
  }
  els.adminPasswordError.textContent = "Incorrect password.";
}

function lockAdmin() {
  sessionStorage.removeItem(ADMIN_SESSION_KEY);
  els.adminPassword.value = "";
  renderAdminGate();
}

function syncFiscalYears() {
  const selected = els.fiscalYearFilter.value;
  const years = new Set(["all"]);
  state.items.forEach((item) => years.add(fiscalYearForDate(item.meetingDate)));
  archiveMeetings().forEach((meeting) => years.add(fiscalYearForDate(meeting.meetingDate)));
  state.budgetLines.forEach((line) => years.add(line.fiscalYear));
  const options = [...years].filter(Boolean).sort((a, b) => b.localeCompare(a));
  els.fiscalYearFilter.innerHTML = options
    .map((year) => `<option value="${escapeHtml(year)}">${year === "all" ? "All years" : escapeHtml(year)}</option>`)
    .join("");
  els.fiscalYearFilter.value = options.includes(selected) ? selected : options[0] || "all";
}

function syncMeetingDates() {
  const selected = els.meetingDateFilter.value;
  const fiscalYear = els.fiscalYearFilter.value;
  const dates = new Set(["all"]);
  state.items.forEach((item) => {
    if (!item.meetingDate) return;
    if (fiscalYear === "all" || fiscalYearForDate(item.meetingDate) === fiscalYear) dates.add(item.meetingDate);
  });
  archiveMeetings().forEach((meeting) => {
    if (!meeting.meetingDate) return;
    if (fiscalYear === "all" || fiscalYearForDate(meeting.meetingDate) === fiscalYear) dates.add(meeting.meetingDate);
  });
  const options = [...dates].sort((a, b) => (a === "all" ? -1 : b === "all" ? 1 : b.localeCompare(a)));
  els.meetingDateFilter.innerHTML = options
    .map((date) => `<option value="${escapeHtml(date)}">${date === "all" ? "All meetings" : escapeHtml(formatDate(date))}</option>`)
    .join("");
  els.meetingDateFilter.value = options.includes(selected) ? selected : "all";
}

function syncBudgetCategories() {
  const categories = new Set(state.budgetLines.map((line) => line.category).filter(Boolean));
  state.items.map((item) => item.budgetCategory).filter(Boolean).forEach((value) => categories.add(value));
  els.budgetCategoryOptions.innerHTML = [...categories]
    .sort()
    .map((category) => `<option value="${escapeHtml(category)}"></option>`)
    .join("");
}

function filteredItems() {
  const fiscalYear = els.fiscalYearFilter.value;
  const meetingDate = els.meetingDateFilter.value;
  const status = els.statusFilter.value;
  const type = els.typeFilter.value;
  const query = els.itemSearch.value.trim().toLowerCase();

  const matchesFilters = (item) => {
    const searchable = [
      item.title,
      item.type,
      item.status,
      item.resolutionNumber,
      item.ordinanceNumber,
      item.contractName,
      item.budgetCategory,
      item.discussion,
      item.publicComments,
      item.sourceDoc,
    ]
      .join(" ")
      .toLowerCase();

    return (
      (fiscalYear === "all" || fiscalYearForDate(item.meetingDate) === fiscalYear) &&
      (meetingDate === "all" || item.meetingDate === meetingDate) &&
      (status === "all" || item.status === status) &&
      (type === "all" || item.type === type) &&
      (!query || searchable.includes(query))
    );
  };

  const parsedItems = state.items.filter(matchesFilters);
  if (fiscalYear === "all" && meetingDate === "all") return parsedItems;

  const parsedDates = new Set(state.items.map((item) => item.meetingDate).filter(Boolean));
  const archiveItems = archiveMeetings()
    .filter((meeting) => meeting.meetingDate && !parsedDates.has(meeting.meetingDate))
    .map(archiveMeetingToItem)
    .filter(matchesFilters);

  return [...parsedItems, ...archiveItems];
}

function archiveMeetings() {
  return Array.isArray(state.archiveMeetings) ? state.archiveMeetings : [];
}

function archiveMeetingToItem(meeting) {
  const documentList = meeting.documentTypes?.length ? meeting.documentTypes.join(" and ") : "agenda/minutes";
  const fileList = meeting.files?.length ? meeting.files.join("; ") : "PDF link pending or unavailable";
  const stats = meeting.archiveStats || {};
  const spending = numeric(stats.spendingTotal);
  return {
    id: `archive-item-${meeting.id}`,
    title: `${meeting.title} archive documents`,
    type: "other",
    dateIntroduced: meeting.meetingDate,
    meetingDate: meeting.meetingDate,
    status: "archived",
    amount: spending,
    amountType: spending ? "expense" : "no-cost",
    resolutionNumber: "",
    ordinanceNumber: "",
    contractName: "",
    budgetCategory: "Meeting Archive",
    discussion: `${documentList} indexed from the local council meeting archive. ${meeting.downloadedCount} of ${meeting.documentCount} document records are downloaded. Archive extraction found ${numeric(stats.resolutionCount)} resolution reference${numeric(stats.resolutionCount) === 1 ? "" : "s"}, ${numeric(stats.ordinanceCount)} ordinance reference${numeric(stats.ordinanceCount) === 1 ? "" : "s"}, ${numeric(stats.contractCount)} contract/agreement reference${numeric(stats.contractCount) === 1 ? "" : "s"}, and ${currency.format(spending)} in agenda dollar mentions.`,
    publicComments: "",
    votes: {},
    sourceDoc: fileList,
    rawText: meeting.sourcePageUrl || "",
    updatedAt: window.ORANGE_TRACKER_SEED?.archiveSummary?.generatedAt || "",
    isArchiveRecord: true,
    archiveStats: stats,
  };
}

function filteredArchiveMeetings() {
  const fiscalYear = els.fiscalYearFilter.value;
  const meetingDate = els.meetingDateFilter.value;
  return archiveMeetings().filter(
    (meeting) =>
      meeting.meetingDate &&
      (fiscalYear === "all" || fiscalYearForDate(meeting.meetingDate) === fiscalYear) &&
      (meetingDate === "all" || meeting.meetingDate === meetingDate)
  );
}

function trackedMeetingDates(items) {
  const dates = new Set(items.map((item) => item.meetingDate).filter(Boolean));
  filteredArchiveMeetings().forEach((meeting) => dates.add(meeting.meetingDate));
  return dates;
}

function renderDashboard() {
  const items = filteredItems();
  const passed = items.filter((item) => item.status === "passed");
  const pending = items.filter((item) => item.status === "pending");
  const postponed = items.filter((item) => item.status === "postponed" || item.status === "withdrawn");
  const totalSpending = items.reduce((sum, item) => sum + approvedSpendingAmount(item), 0);
  const moneyItems = items.filter((item) => approvedSpendingAmount(item) > 0).length;
  const revenue = passed.reduce((sum, item) => sum + revenueAmount(item), 0);
  const resolutions = items.reduce((sum, item) => sum + resolutionCountForItem(item), 0);
  const ordinances = items.reduce((sum, item) => sum + ordinanceCountForItem(item), 0);
  const contracts = items.reduce((sum, item) => sum + contractCountForItem(item), 0);
  const meetingCount = trackedMeetingDates(items).size;

  els.kpiGrid.innerHTML = [
    kpiMarkup("Total Legislative Items", items.length, archiveItemCount(items) ? `${archiveItemCount(items)} archive document record${archiveItemCount(items) === 1 ? "" : "s"} shown` : "Agenda and minutes records", "IT"),
    kpiMarkup("Resolutions", resolutions, archiveItemCount(items) ? "Archive-derived references" : "Parsed identifiers", "RS"),
    kpiMarkup("Ordinances", ordinances, archiveItemCount(items) ? "Archive-derived references" : "Introduced or postponed", "OR"),
    kpiMarkup("Contracts", contracts, archiveItemCount(items) ? "Archive contract/agreement references" : "Vendors, grants, agreements", "CT"),
    kpiMarkup(dollarsKpiLabel(), currency.format(totalSpending), `${moneyItems} spending-class item${moneyItems === 1 ? "" : "s"}`, "$"),
    kpiMarkup("Meetings Tracked", meetingCount, "Parsed actions plus archive dates", "MT"),
    kpiMarkup("Postponed / Withdrawn", postponed.length, `${pending.length} pending record${pending.length === 1 ? "" : "s"}`, "PW"),
  ].join("");

  const statusCounts = ["pending", "passed", "failed", "postponed", "withdrawn", "archived"].map((status) => ({
    status,
    count: items.filter((item) => item.status === status).length,
  }));

  renderBudgetHealth(items);
  renderDashboardLegislationTable(items);
  renderVoteMatrix(items);
  renderFlowBoard(items, statusCounts);
  renderWordCloud(items);
  renderPublicEngagement(items);
  renderRecentActions(items);
}

function dollarsKpiLabel() {
  const fiscalYear = els.fiscalYearFilter.value;
  return fiscalYear !== "all" && fiscalYear !== String(new Date().getFullYear()) ? "Dollars Approved EOY" : "Dollars Approved YTD";
}

function archiveItemCount(items) {
  return items.filter((item) => item.isArchiveRecord).length;
}

function resolutionCountForItem(item) {
  if (item.isArchiveRecord) return numeric(item.archiveStats?.resolutionCount);
  return item.resolutionNumber ? 1 : 0;
}

function ordinanceCountForItem(item) {
  if (item.isArchiveRecord) return numeric(item.archiveStats?.ordinanceCount);
  return item.ordinanceNumber ? 1 : 0;
}

function contractCountForItem(item) {
  if (item.isArchiveRecord) return numeric(item.archiveStats?.contractCount);
  return isContractLike(item) ? 1 : 0;
}

function approvedSpendingAmount(item) {
  if (item.isArchiveRecord) {
    const fiscalYear = els.fiscalYearFilter?.value || "all";
    if (fiscalYear === "all" || fiscalYear === budgetDashboardData?.fiscalYear) return 0;
    return numeric(item.archiveStats?.spendingTotal || item.amount);
  }
  return item.status === "passed" ? spendingAmount(item) : 0;
}

function displaySpendingAmount(item) {
  if (item.isArchiveRecord) return numeric(item.archiveStats?.spendingTotal || item.amount);
  return spendingAmount(item);
}

function fiscalYearForActiveView() {
  return els.fiscalYearFilter.value;
}

function renderBudgetHealth(items) {
  const fiscalYear = els.fiscalYearFilter.value;
  const budgetLines =
    fiscalYear === "all"
      ? []
      : state.budgetLines.filter((line) => line.fiscalYear === fiscalYear);
  const spending = items
    .reduce((sum, item) => sum + approvedSpendingAmount(item), 0);
  const approvedBudget = budgetReferenceTotal(fiscalYear, budgetLines);
  const hasBudgetReference = approvedBudget > 0;
  const budgetBase = hasBudgetReference ? approvedBudget : 0;
  const percent = hasBudgetReference ? Math.round((spending / approvedBudget) * 100) : 0;
  const meterPercent = Math.min(100, percent);
  const variance = approvedBudget - spending;
  const noBudgetMessage =
    fiscalYear === "all"
      ? "Select a fiscal year for budget pace"
      : `No ${escapeHtml(fiscalYear)} budget reference loaded`;

  if (els.budgetMeterFill) {
    els.budgetMeterFill.style.width = `${meterPercent}%`;
    els.budgetMeterFill.style.background = percent > 100 ? "var(--red)" : percent > 85 ? "var(--amber)" : "var(--green)";
  }
  if (els.budgetHealthLabel) els.budgetHealthLabel.textContent = hasBudgetReference ? `${percent}% budget pace` : noBudgetMessage;
  if (els.budgetSummary) {
    els.budgetSummary.innerHTML = [
      summaryLine("Approved budget", hasBudgetReference ? currency.format(approvedBudget) : noBudgetMessage),
      summaryLine("Authorized spending", currency.format(spending)),
      summaryLine("Remaining budget", hasBudgetReference ? currency.format(variance) : "Not calculated across fiscal years"),
    ].join("");
  }
  if (els.spendingGauge) {
    els.spendingGauge.innerHTML = `
      <div class="gauge" style="--pct:${meterPercent}">
        <div class="gauge-inner">
          <div>
            <strong>${hasBudgetReference ? `${percent}%` : "N/A"}</strong>
            <span>${currency.format(spending)}<br />${hasBudgetReference ? `of ${currency.format(approvedBudget)}` : "budget not loaded"}</span>
          </div>
        </div>
      </div>
    `;
  }
  renderDeptDonuts(items, budgetBase);
  renderTrendChart(spending, budgetBase, hasBudgetReference);
}

function budgetReferenceTotal(fiscalYear, budgetLines) {
  if (budgetDashboardData?.budgetSummary?.totalAppropriations && fiscalYear === budgetDashboardData.fiscalYear) {
    return numeric(budgetDashboardData.budgetSummary.totalAppropriations);
  }
  const totalLine = budgetLines.find((line) => /total appropriations/i.test(line.category || ""));
  if (totalLine) return numeric(totalLine.approvedBudget);
  return budgetLines.reduce((sum, line) => sum + numeric(line.approvedBudget), 0);
}

function renderRecentActions(items) {
  const recent = [...items]
    .sort((a, b) => String(b.meetingDate).localeCompare(String(a.meetingDate)))
    .slice(0, 8);

  if (!recent.length) {
    els.recentActions.innerHTML = `<div class="empty">No actions match these filters.</div>`;
    return;
  }

  els.recentActions.innerHTML = recent
    .map((item) => `
      <article class="timeline-item">
        <span class="timeline-dot">${item.status === "archived" ? "A" : item.status === "postponed" ? "-" : item.status === "passed" ? "Y" : "?"}</span>
        <div>
          <h4>${escapeHtml(item.title)}</h4>
          <p>
            ${escapeHtml(formatDate(item.meetingDate))} · ${titleCase(item.type)} · ${titleCase(item.status)}
            ${item.resolutionNumber ? ` · ${escapeHtml(item.resolutionNumber)}` : ""}
            ${item.ordinanceNumber ? ` · ${escapeHtml(item.ordinanceNumber)}` : ""}
            ${displaySpendingAmount(item) ? ` · ${currency.format(displaySpendingAmount(item))}` : ""}
          </p>
        </div>
      </article>
    `)
    .join("");
}

function renderDashboardLegislationTable(items) {
  if (!els.dashboardLegislationTable) return;
  const rows = [...items]
    .sort((a, b) => Math.abs(approvedSpendingAmount(b)) - Math.abs(approvedSpendingAmount(a)) || String(b.meetingDate).localeCompare(String(a.meetingDate)))
    .slice(0, 10);
  els.dashboardLegislationTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Item No.</th>
          <th>Title</th>
          <th>Type</th>
          <th>Date Introduced</th>
          <th>Status</th>
          <th>Vote Result</th>
          <th class="money">Dollar Amount</th>
        </tr>
      </thead>
      <tbody>
        ${rows
          .map((item) => `
            <tr>
              <td class="item-link">${escapeHtml(item.resolutionNumber || item.ordinanceNumber || "-")}</td>
              <td>${escapeHtml(truncate(item.title, 78))}</td>
              <td>${titleCase(item.type)}</td>
              <td>${escapeHtml(formatDate(item.dateIntroduced || item.meetingDate))}</td>
              <td><span class="status-pill status-${item.status}">${escapeHtml(item.status)}</span></td>
              <td>${escapeHtml(voteResult(item))}</td>
              <td class="money">${displaySpendingAmount(item) ? currency.format(displaySpendingAmount(item)) : "-"}</td>
            </tr>
          `)
          .join("")}
      </tbody>
    </table>
  `;
}

function renderVoteMatrix(items) {
  if (!els.voteMatrix) return;
  const voteItems = items
    .filter((item) => Object.keys(item.votes || {}).length)
    .sort((a, b) => Math.abs(spendingAmount(b)) - Math.abs(spendingAmount(a)))
    .slice(0, 6);

  els.voteMatrix.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Council Member</th>
          ${voteItems.map((item) => `<th>${escapeHtml(item.resolutionNumber || item.ordinanceNumber || "Item")}</th>`).join("")}
        </tr>
      </thead>
      <tbody>
        ${state.councilMembers
          .map((member) => `
            <tr>
              <td><strong>${escapeHtml(shortCouncilName(member))}</strong></td>
              ${voteItems.map((item) => `<td>${voteToken(item.votes?.[member])}</td>`).join("")}
            </tr>
          `)
          .join("")}
      </tbody>
    </table>
  `;
}

function renderFlowBoard(items, statusCounts) {
  if (!els.statusBars) return;
  els.actionCountLabel.textContent = `${items.length} tracked records`;
  if (!items.length) {
    els.statusBars.innerHTML = `<div class="empty">No flow data matches these filters.</div>`;
    return;
  }

  const noSponsorLabel = "No sponsor listed";
  const otherSponsorLabel = "Other sponsors";
  const sponsorCounts = countBy(items, (item) => inferSponsor(item));
  const namedSponsors = [...sponsorCounts.entries()]
    .filter(([label]) => label !== noSponsorLabel)
    .sort((a, b) => b[1] - a[1]);
  const topSponsorLabels = namedSponsors.slice(0, 5).map(([label]) => label);
  const otherSponsorCount = namedSponsors.slice(5).reduce((sum, [, count]) => sum + count, 0);
  const sponsorEntries = [
    ...topSponsorLabels.map((label) => ({ key: label, label, count: sponsorCounts.get(label) || 0 })),
    ...(otherSponsorCount ? [{ key: otherSponsorLabel, label: otherSponsorLabel, count: otherSponsorCount }] : []),
    ...(sponsorCounts.get(noSponsorLabel) ? [{ key: noSponsorLabel, label: noSponsorLabel, count: sponsorCounts.get(noSponsorLabel) }] : []),
  ].filter((entry) => entry.count > 0);

  const typeOrder = ["resolution", "ordinance", "contract", "spending", "discussion", "other"];
  const typeCounts = countBy(items, (item) => item.type || "other");
  const typeEntries = orderedCountEntries(typeCounts, typeOrder, titleCase);
  const statusOrder = ["pending", "passed", "failed", "postponed", "withdrawn", "archived"];
  const outcomeEntries = statusOrder
    .map((status) => ({ key: status, label: titleCase(status), count: statusCounts.find((entry) => entry.status === status)?.count || 0 }))
    .filter((entry) => entry.count > 0);

  const sponsorKeyForItem = (item) => {
    const sponsor = inferSponsor(item);
    if (topSponsorLabels.includes(sponsor) || sponsor === noSponsorLabel) return sponsor;
    return otherSponsorLabel;
  };
  const sponsorTypeLinks = groupedLinks(items, sponsorKeyForItem, (item) => item.type || "other");
  const typeOutcomeLinks = groupedLinks(items, (item) => item.type || "other", (item) => item.status || "pending");
  const width = 780;
  const height = Math.max(260, Math.max(sponsorEntries.length, typeEntries.length, outcomeEntries.length) * 48 + 32);
  const columns = {
    sponsors: sankeyLayout(sponsorEntries, 24, 138, height),
    types: sankeyLayout(typeEntries, 316, 138, height),
    outcomes: sankeyLayout(outcomeEntries, 608, 138, height),
  };
  const colorByType = {
    resolution: "#1d67c7",
    ordinance: "#ef7d00",
    contract: "#5f35bd",
    spending: "#35a746",
    discussion: "#009b8f",
    other: "#64748b",
  };
  const colorByStatus = {
    pending: "#1d67c7",
    passed: "#35a746",
    failed: "#ef4444",
    postponed: "#d58a18",
    withdrawn: "#ef4444",
  };

  const links = [
    ...sponsorTypeLinks.map((link) => sankeyPath(link, columns.sponsors, columns.types, colorByType[link.to] || "#1d67c7", items.length)),
    ...typeOutcomeLinks.map((link) => sankeyPath(link, columns.types, columns.outcomes, colorByStatus[link.to] || "#64748b", items.length)),
  ].join("");
  const nodes = [
    ...sankeyNodes(columns.sponsors, "Sponsor / source", "#eef5ff"),
    ...sankeyNodes(columns.types, "Item type", "#f5f8fc"),
    ...sankeyNodes(columns.outcomes, "Outcome", "#f7fbf6"),
  ].join("");

  els.statusBars.innerHTML = `
    <svg class="sankey-svg" viewBox="0 0 ${width} ${height}" role="img" aria-label="Legislation flow from sponsor source to item type to outcome">
      <g class="sankey-links">${links}</g>
      <g class="sankey-nodes">${nodes}</g>
    </svg>
  `;
}

function sankeyLayout(entries, x, nodeWidth, height) {
  const gap = 10;
  const total = entries.reduce((sum, entry) => sum + entry.count, 0) || 1;
  const minHeight = 28;
  const available = height - 38 - gap * Math.max(0, entries.length - 1);
  let rawHeights = entries.map((entry) => Math.max(minHeight, Math.round((entry.count / total) * available)));
  const rawTotal = rawHeights.reduce((sum, value) => sum + value, 0);
  if (rawTotal > available) {
    const scale = available / rawTotal;
    rawHeights = rawHeights.map((value) => Math.max(22, Math.floor(value * scale)));
  }
  const used = rawHeights.reduce((sum, value) => sum + value, 0) + gap * Math.max(0, entries.length - 1);
  let y = 26 + Math.max(0, Math.floor((height - used - 30) / 2));
  return new Map(
    entries.map((entry, index) => {
      const node = { ...entry, x, y, width: nodeWidth, height: rawHeights[index] };
      y += rawHeights[index] + gap;
      return [entry.key, node];
    })
  );
}

function sankeyPath(link, fromLayout, toLayout, color, total) {
  const from = fromLayout.get(link.from);
  const to = toLayout.get(link.to);
  if (!from || !to) return "";
  const x1 = from.x + from.width;
  const x2 = to.x;
  const y1 = from.y + from.height / 2;
  const y2 = to.y + to.height / 2;
  const curve = Math.max(70, (x2 - x1) * 0.45);
  const strokeWidth = Math.max(3, Math.min(34, Math.round((link.count / Math.max(1, total)) * 92)));
  return `
    <path class="sankey-link" d="M ${x1} ${y1} C ${x1 + curve} ${y1}, ${x2 - curve} ${y2}, ${x2} ${y2}"
      stroke="${color}" stroke-width="${strokeWidth}" vector-effect="non-scaling-stroke">
      <title>${escapeHtml(`${link.from} to ${link.to}: ${link.count}`)}</title>
    </path>
  `;
}

function sankeyNodes(layout, axisLabel, fill) {
  const nodes = [...layout.values()];
  if (!nodes.length) return [];
  const labelX = nodes[0].x;
  return [
    `<text class="sankey-axis-label" x="${labelX}" y="14">${escapeHtml(axisLabel)}</text>`,
    ...nodes.map((node) => `
      <g class="sankey-node">
        <rect x="${node.x}" y="${node.y}" width="${node.width}" height="${node.height}" rx="8" fill="${fill}"></rect>
        <text class="sankey-node-label" x="${node.x + 10}" y="${node.y + node.height / 2 + 4}">${escapeHtml(truncate(node.label, 17))}</text>
        <text class="sankey-node-count" x="${node.x + node.width - 10}" y="${node.y + node.height / 2 + 4}">${node.count}</text>
      </g>
    `),
  ];
}

function countBy(items, keyFn) {
  const counts = new Map();
  items.forEach((item) => {
    const key = keyFn(item);
    counts.set(key, (counts.get(key) || 0) + 1);
  });
  return counts;
}

function orderedCountEntries(counts, order, labelFn = (value) => value) {
  const ordered = order
    .filter((key) => counts.has(key))
    .map((key) => ({ key, label: labelFn(key), count: counts.get(key) }));
  const seen = new Set(order);
  const remaining = [...counts.entries()]
    .filter(([key]) => !seen.has(key))
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => ({ key, label: labelFn(key), count }));
  return [...ordered, ...remaining].filter((entry) => entry.count > 0);
}

function groupedLinks(items, fromFn, toFn) {
  const links = new Map();
  items.forEach((item) => {
    const from = fromFn(item);
    const to = toFn(item);
    const key = `${from}::${to}`;
    const current = links.get(key) || { from, to, count: 0 };
    current.count += 1;
    links.set(key, current);
  });
  return [...links.values()].filter((link) => link.count > 0);
}

function inferSponsor(item) {
  const text = `${item.title || ""} ${item.discussion || ""} ${item.publicComments || ""}`;
  const member = state.councilMembers.find((name) => {
    const lastName = shortCouncilName(name).split(/\s+/).at(-1);
    return lastName && new RegExp(`\\b${escapeRegExp(lastName)}\\b`, "i").test(text);
  });
  return member ? shortCouncilName(member) : "No sponsor listed";
}

function renderDeptDonuts(items, budgetBase) {
  if (!els.deptDonuts) return;
  const categories = categoryTotals(items).slice(0, 4);
  if (!categories.length) {
    els.deptDonuts.innerHTML = `<div class="empty">No spending categories are recorded for this fiscal year.</div>`;
    return;
  }
  const max = Math.max(1, ...categories.map((entry) => entry.amount));
  els.deptDonuts.innerHTML = categories
    .map((entry) => {
      const denominator = budgetBase ? Math.min(max * 1.35, budgetBase) : max;
      const pct = Math.max(8, Math.min(100, Math.round((entry.amount / denominator) * 100)));
      return `
        <div class="mini-donut">
          <div class="donut" style="--pct:${pct}%">${pct}%</div>
          <div class="donut-label">
            <strong>${escapeHtml(truncate(entry.category, 18))}</strong>
            <span>${currency.format(entry.amount)}</span>
          </div>
        </div>
      `;
    })
    .join("");
}

function renderTrendChart(spending, budgetBase, hasBudgetReference) {
  if (!els.trendChart) return;
  els.trendChart.innerHTML = `
    <div class="trend-line target"></div>
    <div class="trend-line actual"></div>
    <span class="trend-label target">${hasBudgetReference ? `Budget ${currency.format(budgetBase)}` : "Budget not loaded"}</span>
    <span class="trend-label actual">Actual ${currency.format(spending)}</span>
  `;
}

function renderWordCloud(items) {
  if (!els.wordCloud) return;
  const text = items.map((item) => `${item.title} ${item.discussion} ${item.publicComments} ${item.budgetCategory}`).join(" ");
  const ignore = new Set("the and for with city orange township resolution ordinance authorize authorizing amount adopted council member april 2026 jersey new".split(" "));
  const counts = {};
  text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, " ")
    .split(/\s+/)
    .filter((word) => word.length > 4 && !ignore.has(word))
    .forEach((word) => {
      counts[word] = (counts[word] || 0) + 1;
    });
  const colors = ["#0a65b7", "#009b8f", "#5f35bd", "#35a746", "#ef7d00"];
  const entries = Object.entries(counts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 32);
  const uniqueCounts = [...new Set(entries.map(([, count]) => count))].sort((a, b) => b - a);
  const minCount = entries.at(-1)?.[1] || 1;
  const maxCount = entries[0]?.[1] || 1;
  els.wordCloud.innerHTML = entries
    .map(([word, count], index) => {
      const rawScale = maxCount === minCount ? 1 : (count - minCount) / (maxCount - minCount);
      const rankScale = uniqueCounts.length <= 1 ? 1 : 1 - uniqueCounts.indexOf(count) / (uniqueCounts.length - 1);
      const exaggeratedScale = Math.max(Math.pow(rawScale, 0.46), rankScale * 0.92);
      const fontSize = 0.66 + exaggeratedScale * 2.45;
      const weight = Math.round(700 + exaggeratedScale * 250);
      return `<span title="${escapeHtml(`${word}: ${count}`)}" style="--word-size:${fontSize.toFixed(2)}rem;--word-weight:${weight};--word-color:${colors[index % colors.length]}">${escapeHtml(word)}</span>`;
    })
    .join("");
}

function renderPublicEngagement(items) {
  if (!els.publicEngagement) return;
  const topics = [
    ["Redevelopment / Housing", "development|housing|affordable|hospital"],
    ["Public Safety / Policing", "police|safety|e-bike|enforcement|critical"],
    ["Infrastructure / Streets", "street|paving|road|water|tennis|park"],
    ["Transparency / Governance", "council|responsibility|advisory|trust|community"],
    ["Taxes / Affordability", "tax|budget|fees|refund|benefits"],
  ].map(([label, pattern]) => ({
    label,
    count: items.filter((item) => new RegExp(pattern, "i").test(`${item.title} ${item.discussion} ${item.publicComments} ${item.budgetCategory}`)).length,
  }));
  const max = Math.max(1, ...topics.map((topic) => topic.count));
  els.publicEngagement.innerHTML = topics
    .map((topic) => `
      <div class="engagement-row">
        <span>${escapeHtml(topic.label)}</span>
        <div class="bar-track"><div class="bar-fill" style="width:${Math.round((topic.count / max) * 100)}%"></div></div>
      </div>
    `)
    .join("");
}

function renderItemsTable() {
  const items = filteredItems();
  if (!items.length) {
    els.itemsTable.innerHTML = `<div class="empty">No legislative items yet. Upload an agenda PDF or add one manually.</div>`;
    return;
  }

  els.itemsTable.innerHTML = `
    <table>
      <thead>
        <tr>
          <th>Item</th>
          <th>Identifiers</th>
          <th>Status</th>
          <th>Meeting</th>
          <th class="money">Amount</th>
          <th>Budget</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${items
          .map((item) => `
            <tr data-item-row="${escapeHtml(item.id)}" class="${item.id === focusedItemId ? "focused-item-row" : ""}">
              <td>
                <strong>${escapeHtml(item.title)}</strong><br />
                <span class="action-meta">${titleCase(item.type)}</span>
              </td>
              <td>
                ${escapeHtml([item.resolutionNumber, item.ordinanceNumber, item.contractName].filter(Boolean).join(" · ") || "None")}
              </td>
              <td><span class="status-pill status-${item.status}">${escapeHtml(item.status)}</span></td>
              <td>${escapeHtml(formatDate(item.meetingDate))}</td>
              <td class="money">${displaySpendingAmount(item) ? `${currency.format(displaySpendingAmount(item))}<br /><span class="action-meta">${escapeHtml(item.isArchiveRecord ? "Archive estimate" : amountTypeLabel(item.amountType))}</span>` : "-"}</td>
              <td>${escapeHtml(item.budgetCategory || "-")}</td>
              <td>
                ${
                  item.isArchiveRecord
                    ? `<span class="archive-label">Archive</span>`
                    : `<button class="button secondary compact" type="button" data-edit-item="${item.id}">Edit</button>`
                }
              </td>
            </tr>
          `)
          .join("")}
      </tbody>
    </table>
  `;

  els.itemsTable.querySelectorAll("[data-edit-item]").forEach((button) => {
    button.addEventListener("click", () => openItemDialog(state.items.find((item) => item.id === button.dataset.editItem)));
  });
}

function renderBudget() {
  if (els.budgetSourceSummary) {
    els.budgetSourceSummary.innerHTML = budgetDashboardData
      ? [
          budgetSourceMetric("2026 total appropriations", currency.format(numeric(budgetDashboardData.budgetSummary?.totalAppropriations))),
          budgetSourceMetric("Tax levy", currency.format(numeric(budgetDashboardData.budgetSummary?.taxesToRaise))),
          budgetSourceMetric("Surplus anticipated", currency.format(numeric(budgetDashboardData.budgetSummary?.surplusAnticipated))),
          budgetSourceMetric("Debt service", currency.format(numeric(budgetDashboardData.budgetSummary?.debtService))),
        ].join("")
      : `<div class="empty">Budget dashboard data is not loaded.</div>`;
  }

  if (!state.budgetLines.length) {
    els.budgetTable.innerHTML = `<div class="empty">No budget lines imported yet.</div>`;
  } else {
    els.budgetTable.innerHTML = `
      <table>
        <thead>
          <tr>
            <th>Fiscal year</th>
            <th>Department</th>
            <th>Category</th>
            <th class="money">Approved</th>
          </tr>
        </thead>
        <tbody>
          ${state.budgetLines
            .map((line) => `
              <tr>
                <td>${escapeHtml(line.fiscalYear)}</td>
                <td>${escapeHtml(line.department)}</td>
                <td>${escapeHtml(line.category)}</td>
                <td class="money">${currency.format(numeric(line.approvedBudget))}</td>
              </tr>
            `)
            .join("")}
        </tbody>
      </table>
    `;
  }

  const byCategory = new Map();
  state.items
    .filter((item) => item.status === "passed" && numeric(item.amount) > 0)
    .forEach((item) => {
      const amount = spendingAmount(item);
      if (!amount) return;
      const key = item.budgetCategory || "Unassigned";
      byCategory.set(key, (byCategory.get(key) || 0) + amount);
    });
  const max = Math.max(1, ...byCategory.values());

  els.spendingBreakdown.innerHTML = byCategory.size
    ? [...byCategory.entries()]
        .sort((a, b) => b[1] - a[1])
        .map(([category, amount]) => `
          <div class="breakdown-row">
            <header><span>${escapeHtml(category)}</span><span>${currency.format(amount)}</span></header>
            <div class="bar-track"><div class="bar-fill" style="width: ${Math.round((amount / max) * 100)}%"></div></div>
          </div>
        `)
        .join("")
    : `<div class="empty">Approved spending will appear here after items are passed.</div>`;
}

function budgetSourceMetric(label, value) {
  return `
    <div>
      <span>${escapeHtml(label)}</span>
      <strong>${escapeHtml(value)}</strong>
    </div>
  `;
}

function renderMemberScorecards() {
  if (!els.memberToggle || !els.memberProfile) return;
  if (!state.councilMembers.length) {
    els.memberToggle.innerHTML = "";
    els.memberProfile.innerHTML = `<div class="empty">No council members are configured yet.</div>`;
    return;
  }

  if (!state.councilMembers.includes(selectedPublicMember)) selectedPublicMember = state.councilMembers[0];
  els.memberToggle.innerHTML = state.councilMembers
    .map((member, index) => {
      const profile = councilProfileFor(member);
      return `
      <button class="member-toggle-button${member === selectedPublicMember ? " active" : ""}" type="button" data-public-member-index="${index}">
        <img src="${escapeHtml(profile.photoUrl || memberPortraitDataUri(member, index))}" alt="${escapeHtml(shortCouncilName(member))} headshot" />
        <span>
          <strong>${escapeHtml(shortCouncilName(member))}</strong>
          <small>${escapeHtml(profile.role || "Councilmember")}</small>
        </span>
      </button>
    `;
    })
    .join("");

  els.memberToggle.querySelectorAll("[data-public-member-index]").forEach((button) => {
    button.addEventListener("click", () => {
      selectedPublicMember = state.councilMembers[Number(button.dataset.publicMemberIndex)];
      renderMemberScorecards();
    });
  });

  const memberIndex = state.councilMembers.indexOf(selectedPublicMember);
  const profile = councilProfileFor(selectedPublicMember);
  const summary = memberScorecard(selectedPublicMember);
  const typeEntries = ["resolution", "ordinance", "contract", "spending", "discussion", "other"].map((type) => ({
    label: titleCase(type),
    count: summary.sponsoredItems.filter((item) => item.type === type).length,
  }));
  const decisionEntries = [
    ["Yes", summary.voteCounts.yes || 0, "yes"],
    ["No", summary.voteCounts.no || 0, "no"],
    ["Abstain", summary.voteCounts.abstain || 0, "abstain"],
    ["Absent", summary.voteCounts.absent || 0, "absent"],
    ["Recused", summary.voteCounts.recused || 0, "recused"],
  ].filter(([, count]) => count > 0);
  const budgetCategories = [...summary.supportedByCategory.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);
  const highImpactVotes = summary.votedItems
    .filter((item) => spendingAmount(item) || revenueAmount(item))
    .sort((a, b) => Math.abs(spendingAmount(b) || revenueAmount(b)) - Math.abs(spendingAmount(a) || revenueAmount(a)))
    .slice(0, 8);

  els.memberProfile.innerHTML = `
    <section class="member-hero surface">
      <img class="member-portrait" src="${escapeHtml(profile.photoUrl || memberPortraitDataUri(selectedPublicMember, memberIndex))}" alt="${escapeHtml(shortCouncilName(selectedPublicMember))} headshot" />
      <div>
        <p class="eyebrow">Public scorecard</p>
        <h3>${escapeHtml(shortCouncilName(selectedPublicMember))}</h3>
        <p class="member-role">${escapeHtml(profile.role || "Councilmember")}</p>
        <p>Tracks introduced legislation, vote behavior, participation, and budget impact from the currently loaded agenda and minutes history.</p>
        <div class="member-contact-grid">
          ${profile.email ? `<a href="mailto:${escapeHtml(profile.email)}">${escapeHtml(profile.email)}</a>` : ""}
          ${profile.phone ? `<a href="tel:${escapeHtml(profile.phone.replace(/[^0-9+]/g, ""))}">${escapeHtml(profile.phone)}</a>` : ""}
          ${profile.termExpires ? `<span>Term expires ${escapeHtml(profile.termExpires)}</span>` : ""}
        </div>
      </div>
      <div class="member-kpi-stack">
        ${scoreMetric("Introduced / sponsored", summary.sponsoredItems.length)}
        ${scoreMetric("Vote participation", `${summary.participationRate}%`)}
        ${scoreMetric("Meeting attendance", `${summary.attendance.rate}%`)}
        ${scoreMetric("Meetings attended", `${summary.attendance.present} of ${summary.attendance.total}`)}
        ${scoreMetric("Budget supported", currency.format(summary.supportedSpending))}
        ${scoreMetric("Revenue / grants supported", currency.format(summary.supportedRevenue))}
      </div>
    </section>

    <div class="member-score-grid">
      <section class="surface">
        <h3>Introduced Legislation by Type</h3>
        ${barList(typeEntries, summary.sponsoredItems.length, "No introduced legislation was detected for this member.")}
      </section>
      <section class="surface">
        <h3>Decision Mix</h3>
        ${barList(decisionEntries.map(([label, count, key]) => ({ label, count, key })), summary.votedItems.length, "No recorded votes were detected for this member.")}
      </section>
      <section class="surface member-attendance-card">
        <h3>Attendance Tracker</h3>
        <div class="attendance-summary">
          ${scoreMetric("Attendance rate", `${summary.attendance.rate}%`)}
          ${scoreMetric("Absent meetings", summary.attendance.absent)}
        </div>
        ${attendanceTimeline(summary.attendance.meetings)}
      </section>
      <section class="surface member-budget-impact-card">
        <h3>Budget Impact of Decisions</h3>
        <div class="budget-impact-grid">
          ${scoreMetric("Supported expenses", currency.format(summary.supportedSpending))}
          ${scoreMetric("Opposed expenses", currency.format(summary.opposedSpending))}
          ${scoreMetric("Abstained / absent expense exposure", currency.format(summary.notVotingSpending))}
          ${scoreMetric("Avg. supported per meeting", currency.format(summary.averageSupportedPerMeeting))}
        </div>
      </section>
      <section class="surface member-budget-categories-card">
        <h3>Budget Categories Supported</h3>
        ${
          budgetCategories.length
            ? budgetCategories.map(([category, amount]) => `
                <div class="breakdown-row">
                  <header><span>${escapeHtml(category)}</span><span>${currency.format(amount)}</span></header>
                  <div class="bar-track"><div class="bar-fill" style="width:${Math.max(6, Math.round((amount / budgetCategories[0][1]) * 100))}%"></div></div>
                </div>
              `).join("")
            : `<div class="empty">No supported spending categories are recorded.</div>`
        }
      </section>
      <section class="surface member-wide-card">
        <h3>High-Impact Vote Breakdown</h3>
        ${memberVoteTable(highImpactVotes, selectedPublicMember)}
      </section>
      <section class="surface member-wide-card">
        <h3>Introduced / Sponsored Items</h3>
        ${memberSponsoredTable(summary.sponsoredItems)}
      </section>
    </div>
  `;
}

function memberScorecard(member) {
  const sponsoredItems = state.items.filter((item) => inferSponsor(item) === shortCouncilName(member));
  const votedItems = state.items.filter((item) => hasVoteValue(item.votes?.[member]));
  const voteCounts = votedItems.reduce((counts, item) => {
    const vote = normalizeVoteValue(item.votes?.[member]);
    counts[vote] = (counts[vote] || 0) + 1;
    return counts;
  }, {});
  const supportedSpending = votedItems
    .filter((item) => normalizeVoteValue(item.votes?.[member]) === "yes")
    .reduce((sum, item) => sum + spendingAmount(item), 0);
  const opposedSpending = votedItems
    .filter((item) => normalizeVoteValue(item.votes?.[member]) === "no")
    .reduce((sum, item) => sum + spendingAmount(item), 0);
  const notVotingSpending = votedItems
    .filter((item) => ["abstain", "absent", "recused"].includes(normalizeVoteValue(item.votes?.[member])))
    .reduce((sum, item) => sum + spendingAmount(item), 0);
  const supportedRevenue = votedItems
    .filter((item) => normalizeVoteValue(item.votes?.[member]) === "yes")
    .reduce((sum, item) => sum + revenueAmount(item), 0);
  const supportedByCategory = new Map();
  votedItems
    .filter((item) => normalizeVoteValue(item.votes?.[member]) === "yes" && spendingAmount(item) > 0)
    .forEach((item) => {
      const category = item.budgetCategory || "Unassigned";
      supportedByCategory.set(category, (supportedByCategory.get(category) || 0) + spendingAmount(item));
    });
  const votableItems = state.items.filter((item) => Object.keys(item.votes || {}).length);
  const meetings = new Set(votedItems.map((item) => item.meetingDate).filter(Boolean)).size || 1;
  const attendance = memberAttendance(member);
  return {
    sponsoredItems,
    votedItems,
    voteCounts,
    participationRate: Math.round((votedItems.length / Math.max(1, votableItems.length)) * 100),
    attendance,
    supportedSpending,
    opposedSpending,
    notVotingSpending,
    supportedRevenue,
    supportedByCategory,
    averageSupportedPerMeeting: supportedSpending / meetings,
  };
}

function memberAttendance(member) {
  const meetingMap = new Map();
  state.items
    .filter((item) => item.meetingDate && Object.keys(item.votes || {}).length)
    .forEach((item) => {
      if (!meetingMap.has(item.meetingDate)) meetingMap.set(item.meetingDate, []);
      meetingMap.get(item.meetingDate).push(item);
    });
  const meetings = [...meetingMap.entries()]
    .sort((a, b) => b[0].localeCompare(a[0]))
    .map(([date, items]) => {
      const votes = items.map((item) => normalizeVoteValue(item.votes?.[member]));
      const recorded = votes.filter((vote) => vote !== "unknown");
      const presentVotes = recorded.filter((vote) => !["absent", "recused"].includes(vote));
      const absentVotes = recorded.filter((vote) => vote === "absent");
      const status = presentVotes.length ? "present" : absentVotes.length ? "absent" : "no record";
      return {
        date,
        status,
        presentVotes: presentVotes.length,
        absentVotes: absentVotes.length,
        recordedVotes: recorded.length,
        agendaItems: items.length,
      };
    });
  const tracked = meetings.filter((meeting) => meeting.status !== "no record");
  const present = tracked.filter((meeting) => meeting.status === "present").length;
  const absent = tracked.filter((meeting) => meeting.status === "absent").length;
  return {
    total: tracked.length,
    present,
    absent,
    noRecord: meetings.length - tracked.length,
    rate: Math.round((present / Math.max(1, tracked.length)) * 100),
    meetings,
  };
}

function councilProfileFor(member) {
  return councilProfiles[shortCouncilName(member)] || {};
}

function scoreMetric(label, value) {
  return `<div class="score-metric"><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></div>`;
}

function barList(entries, total, emptyText) {
  const visible = entries.filter((entry) => entry.count > 0);
  if (!visible.length) return `<div class="empty">${escapeHtml(emptyText)}</div>`;
  const max = Math.max(1, ...visible.map((entry) => entry.count));
  return visible
    .map((entry) => `
      <div class="breakdown-row">
        <header><span>${escapeHtml(entry.label)}</span><span>${entry.count}${total ? ` of ${total}` : ""}</span></header>
        <div class="bar-track"><div class="bar-fill ${entry.key ? `vote-bar-${escapeHtml(entry.key)}` : ""}" style="width:${Math.max(6, Math.round((entry.count / max) * 100))}%"></div></div>
      </div>
    `)
    .join("");
}

function attendanceTimeline(meetings) {
  if (!meetings.length) return `<div class="empty">No meeting-level attendance records are available.</div>`;
  return `
    <div class="attendance-list">
      ${meetings.map((meeting) => `
        <div class="attendance-row attendance-${meeting.status.replace(/\s+/g, "-")}">
          <span>${escapeHtml(formatDate(meeting.date))}</span>
          <strong>${escapeHtml(titleCase(meeting.status))}</strong>
          <small>${meeting.recordedVotes ? `${meeting.recordedVotes} recorded vote${meeting.recordedVotes === 1 ? "" : "s"}` : `${meeting.agendaItems} item${meeting.agendaItems === 1 ? "" : "s"} without member vote data`}</small>
        </div>
      `).join("")}
    </div>
  `;
}

function memberVoteTable(items, member) {
  if (!items.length) return `<div class="empty">No high-impact budget votes are recorded.</div>`;
  return `
    <div class="table-wrap compact-table">
      <table>
        <thead><tr><th>Item</th><th>Vote</th><th>Budget category</th><th class="money">Impact</th></tr></thead>
        <tbody>
          ${items.map((item) => `
            <tr>
              <td><strong>${escapeHtml(truncate(item.title, 92))}</strong><br /><span class="action-meta">${escapeHtml(item.resolutionNumber || item.ordinanceNumber || formatDate(item.meetingDate))}</span></td>
              <td>${voteToken(item.votes?.[member])}</td>
              <td>${escapeHtml(item.budgetCategory || "-")}</td>
              <td class="money">${currency.format(spendingAmount(item) || revenueAmount(item))}<br /><span class="action-meta">${escapeHtml(amountTypeLabel(item.amountType))}</span></td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function memberSponsoredTable(items) {
  if (!items.length) return `<div class="empty">No sponsored or introduced items were detected in the loaded records.</div>`;
  return `
    <div class="table-wrap compact-table">
      <table>
        <thead><tr><th>Item</th><th>Type</th><th>Meeting</th><th>Budget</th></tr></thead>
        <tbody>
          ${items.slice(0, 10).map((item) => `
            <tr>
              <td><strong>${escapeHtml(truncate(item.title, 110))}</strong><br /><span class="action-meta">${escapeHtml(item.resolutionNumber || item.ordinanceNumber || "No identifier")}</span></td>
              <td>${escapeHtml(titleCase(item.type))}</td>
              <td>${escapeHtml(formatDate(item.meetingDate))}</td>
              <td>${escapeHtml(item.budgetCategory || "-")}</td>
            </tr>
          `).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function memberPortraitDataUri(member, index) {
  const initials = shortCouncilName(member)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
  const colors = [
    ["#1d67c7", "#d8ecff"],
    ["#009b8f", "#d8fff9"],
    ["#ef7d00", "#fff1d8"],
    ["#5f35bd", "#eee6ff"],
    ["#35a746", "#e2f8e8"],
    ["#0b4f87", "#dcecff"],
    ["#b84e1d", "#ffe6dc"],
  ];
  const [bg, halo] = colors[Math.max(0, index) % colors.length];
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 160">
      <rect width="160" height="160" rx="28" fill="${halo}"/>
      <circle cx="80" cy="68" r="34" fill="${bg}" opacity="0.96"/>
      <path d="M28 144c8-30 28-48 52-48s44 18 52 48" fill="${bg}" opacity="0.96"/>
      <text x="80" y="77" text-anchor="middle" font-family="Arial, sans-serif" font-size="28" font-weight="800" fill="white">${escapeHtml(initials || "CM")}</text>
    </svg>
  `;
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function normalizeVoteValue(value) {
  const normalized = String(value || "").toLowerCase();
  if (["yes", "no", "abstain", "absent", "recused"].includes(normalized)) return normalized;
  if (normalized === "aye") return "yes";
  if (normalized === "nay") return "no";
  return "unknown";
}

function hasVoteValue(value) {
  return normalizeVoteValue(value) !== "unknown";
}

function renderCouncilMembers() {
  els.councilList.innerHTML = state.councilMembers
    .map((member, index) => `
      <div class="member-row">
        <input value="${escapeHtml(member)}" data-member-index="${index}" aria-label="Council member name" />
        <button class="button danger compact" type="button" data-remove-member="${index}">Remove</button>
      </div>
    `)
    .join("");

  els.councilList.querySelectorAll("[data-member-index]").forEach((input) => {
    input.addEventListener("change", () => renameCouncilMember(Number(input.dataset.memberIndex), input.value.trim()));
  });
  els.councilList.querySelectorAll("[data-remove-member]").forEach((button) => {
    button.addEventListener("click", () => removeCouncilMember(Number(button.dataset.removeMember)));
  });
}

async function parseAgendaUpload() {
  const file = els.agendaPdfInput.files[0];
  if (!file) {
    setExtractionStatus("Choose an agenda PDF first.");
    return;
  }
  setExtractionStatus("Reading agenda PDF...");
  try {
    const text = await extractPdfText(file);
    pendingReview = parseAgendaItems(text, els.agendaMeetingDate.value, file.name);
    setExtractionStatus(`Found ${pendingReview.length} likely agenda item${pendingReview.length === 1 ? "" : "s"}. Review before adding.`);
    renderExtractionReview();
  } catch (error) {
    setExtractionStatus(error.message);
  }
}

async function parseMinutesUpload() {
  const file = els.minutesPdfInput.files[0];
  if (!file) {
    setExtractionStatus("Choose a minutes PDF first.");
    return;
  }
  setExtractionStatus("Reading minutes PDF...");
  try {
    const text = await extractPdfText(file);
    const updates = parseMinutesActions(text, els.minutesMeetingDate.value, file.name);
    pendingReview = updates;
    setExtractionStatus(`Found ${updates.length} likely minutes update${updates.length === 1 ? "" : "s"}. Review before applying.`);
    renderExtractionReview();
  } catch (error) {
    setExtractionStatus(error.message);
  }
}

async function extractPdfText(file) {
  const pdfjs = window["pdfjs-dist/build/pdf"];
  if (!pdfjs) {
    throw new Error("PDF parser is still loading. Wait a moment, then try again. Internet access is required for PDF.js in this prototype.");
  }

  pdfjs.GlobalWorkerOptions.workerSrc =
    "https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs";
  const buffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: buffer }).promise;
  const pages = [];
  for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber += 1) {
    const page = await pdf.getPage(pageNumber);
    const content = await page.getTextContent();
    const pageText = content.items.map((item) => item.str).join(" ");
    pages.push(pageText);
  }
  return pages.join("\n");
}

function parseAgendaItems(text, meetingDate, sourceDoc) {
  const normalized = normalizeText(text);
  const sections = normalized
    .split(/(?=(?:^|\s)(?:item\s+)?(?:[0-9]{1,3}[a-z]?\.|[0-9]{1,3}\)|[a-z]\.)\s+)/i)
    .map((section) => section.trim())
    .filter((section) => section.length > 40);

  const candidates = sections.length ? sections : normalized.split(/(?=resolution|ordinance|contract|agreement|public hearing)/i);

  return candidates
    .map((chunk) => buildItemFromAgendaChunk(chunk, meetingDate, sourceDoc))
    .filter(Boolean)
    .slice(0, 80);
}

function buildItemFromAgendaChunk(chunk, meetingDate, sourceDoc) {
  const amount = extractLargestAmount(chunk);
  const resolutionNumber = firstMatch(chunk, /\b(?:resolution|reso\.?)\s*(?:no\.?|number)?\s*([0-9a-z-]+)/i);
  const ordinanceNumber = firstMatch(chunk, /\b(?:ordinance|ord\.?)\s*(?:no\.?|number)?\s*([0-9a-z-]+)/i);
  const contractName = firstMatch(chunk, /\b(?:contract|agreement)\s+(?:with|for)?\s*([^.;]{8,90})/i);
  const title = cleanTitle(chunk);
  const type = inferItemType(chunk, amount, resolutionNumber, ordinanceNumber, contractName);

  if (!title) return null;
  return {
    id: crypto.randomUUID(),
    title,
    type,
    dateIntroduced: meetingDate || "",
    meetingDate: meetingDate || "",
    status: "pending",
    amount,
    resolutionNumber,
    ordinanceNumber,
    contractName,
    budgetCategory: inferBudgetCategory(chunk),
    discussion: extractSentence(chunk, /(staff report|discussion|recommendation|background)/i),
    publicComments: extractSentence(chunk, /(public comment|public hearing|speaker|resident)/i),
    votes: Object.fromEntries(state.councilMembers.map((member) => [member, ""])),
    sourceDoc,
    rawText: chunk,
    updatedAt: new Date().toISOString(),
    reviewKind: "agenda",
  };
}

function parseMinutesActions(text, meetingDate, sourceDoc) {
  const normalized = normalizeText(text);
  return state.items
    .map((item) => {
      const matcherParts = [item.resolutionNumber, item.ordinanceNumber, significantTitleWords(item.title)]
        .filter(Boolean)
        .map(escapeRegExp);
      if (!matcherParts.length) return null;
      const matcher = new RegExp(`(.{0,350}(?:${matcherParts.join("|")}).{0,700})`, "i");
      const match = normalized.match(matcher);
      if (!match) return null;

      const chunk = match[1];
      const status = inferStatus(chunk);
      const votes = inferVotes(chunk);
      return {
        ...item,
        id: item.id,
        status: status || item.status,
        votes: { ...item.votes, ...votes },
        meetingDate: item.meetingDate || meetingDate || "",
        sourceDoc,
        rawText: chunk,
        updatedAt: new Date().toISOString(),
        reviewKind: "minutes",
      };
    })
    .filter(Boolean);
}

function renderExtractionReview() {
  if (!pendingReview.length) {
    els.extractionReview.innerHTML = `<div class="empty">No likely items were found. Try a different PDF or add items manually.</div>`;
    return;
  }

  els.extractionReview.innerHTML = "";
  pendingReview.forEach((item) => {
    const clone = els.reviewItemTemplate.content.cloneNode(true);
    clone.querySelector(".review-type").textContent = item.reviewKind === "minutes" ? "Minutes update" : titleCase(item.type);
    clone.querySelector(".review-title").textContent = item.title;
    clone.querySelector(".review-meta").textContent = [
      item.meetingDate && formatDate(item.meetingDate),
      item.resolutionNumber,
      item.ordinanceNumber,
      numeric(item.amount) ? currency.format(numeric(item.amount)) : "",
      item.status,
    ]
      .filter(Boolean)
      .join(" · ");
    clone.querySelector(".review-text").textContent = item.rawText?.slice(0, 520) || "";
    const button = clone.querySelector(".review-add");
    button.textContent = item.reviewKind === "minutes" ? "Apply update" : "Add to tracker";
    button.addEventListener("click", () => acceptReviewItem(item.id));
    els.extractionReview.appendChild(clone);
  });
}

function acceptReviewItem(id) {
  const item = pendingReview.find((entry) => entry.id === id);
  if (!item) return;

  if (item.reviewKind === "minutes") {
    state.items = state.items.map((existing) =>
      existing.id === item.id ? stripReviewFields(item) : existing,
    );
  } else {
    state.items.push(stripReviewFields(item));
  }
  pendingReview = pendingReview.filter((entry) => entry.id !== id);
  persist();
  render();
  renderExtractionReview();
  setExtractionStatus(`${pendingReview.length} review item${pendingReview.length === 1 ? "" : "s"} remaining.`);
}

function openItemDialog(item = null) {
  const editing = Boolean(item);
  els.itemDialogTitle.textContent = editing ? "Edit legislative item" : "Add legislative item";
  els.editingItemId.value = item?.id || "";
  els.itemTitle.value = item?.title || "";
  els.itemType.value = item?.type || "other";
  els.dateIntroduced.value = item?.dateIntroduced || "";
  els.meetingDate.value = item?.meetingDate || "";
  els.itemStatus.value = item?.status || "pending";
  els.amount.value = item?.amount || "";
  els.amountType.value = item?.amountType || "expense";
  els.resolutionNumber.value = item?.resolutionNumber || "";
  els.ordinanceNumber.value = item?.ordinanceNumber || "";
  els.contractName.value = item?.contractName || "";
  els.budgetCategory.value = item?.budgetCategory || "";
  els.discussion.value = item?.discussion || "";
  els.publicComments.value = item?.publicComments || "";
  els.deleteItemBtn.style.display = editing ? "inline-flex" : "none";
  renderVoteEditor(item?.votes || {});
  els.itemDialog.showModal();
}

function renderVoteEditor(votes) {
  els.voteEditor.innerHTML = state.councilMembers
    .map((member) => `
      <div class="vote-row">
        <span>${escapeHtml(member)}</span>
        <select data-vote-member="${escapeHtml(member)}">
          ${["", "yes", "no", "abstain", "absent", "recused"]
            .map((vote) => `<option value="${vote}" ${votes[member] === vote ? "selected" : ""}>${vote ? titleCase(vote) : "Unknown"}</option>`)
            .join("")}
        </select>
      </div>
    `)
    .join("");
}

function saveItemFromDialog() {
  if (!els.itemForm.reportValidity()) return;
  const id = els.editingItemId.value || crypto.randomUUID();
  const votes = {};
  els.voteEditor.querySelectorAll("[data-vote-member]").forEach((select) => {
    votes[select.dataset.voteMember] = select.value;
  });

  const item = {
    id,
    title: els.itemTitle.value.trim(),
    type: els.itemType.value,
    dateIntroduced: els.dateIntroduced.value,
    meetingDate: els.meetingDate.value,
    status: els.itemStatus.value,
    amount: numeric(els.amount.value),
    amountType: els.amountType.value,
    resolutionNumber: els.resolutionNumber.value.trim(),
    ordinanceNumber: els.ordinanceNumber.value.trim(),
    contractName: els.contractName.value.trim(),
    budgetCategory: els.budgetCategory.value.trim(),
    discussion: els.discussion.value.trim(),
    publicComments: els.publicComments.value.trim(),
    votes,
    sourceDoc: "",
    rawText: "",
    updatedAt: new Date().toISOString(),
  };

  const existingIndex = state.items.findIndex((entry) => entry.id === id);
  if (existingIndex >= 0) state.items[existingIndex] = item;
  else state.items.push(item);
  persist();
  els.itemDialog.close();
  render();
}

function deleteCurrentItem() {
  const id = els.editingItemId.value;
  if (!id || !confirm("Delete this legislative item?")) return;
  state.items = state.items.filter((item) => item.id !== id);
  persist();
  els.itemDialog.close();
  render();
}

function addCouncilMember() {
  state.councilMembers.push(`Council Member ${state.councilMembers.length + 1}`);
  state.items.forEach((item) => {
    item.votes = { ...item.votes, [state.councilMembers.at(-1)]: "" };
  });
  persist();
  render();
}

function renameCouncilMember(index, name) {
  if (!name) return render();
  const oldName = state.councilMembers[index];
  state.councilMembers[index] = name;
  state.items.forEach((item) => {
    item.votes = item.votes || {};
    item.votes[name] = item.votes[oldName] || "";
    delete item.votes[oldName];
  });
  persist();
  render();
}

function removeCouncilMember(index) {
  const name = state.councilMembers[index];
  if (!confirm(`Remove ${name} from vote tracking?`)) return;
  state.councilMembers.splice(index, 1);
  state.items.forEach((item) => {
    delete item.votes?.[name];
  });
  persist();
  render();
}

function exportJson() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: "application/json" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "orange-legislative-tracker.json";
  link.click();
  URL.revokeObjectURL(link.href);
}

async function importJson() {
  const file = els.importJsonInput.files[0];
  if (!file) return;
  const imported = JSON.parse(await file.text());
  state = { ...structuredClone(defaultState), ...imported };
  persist();
  render();
}

function resetDemoData() {
  if (!confirm("Reset tracker data to the starter demo?")) return;
  state = structuredClone(defaultState);
  persist();
  render();
}

function kpiMarkup(label, value, detail, icon = "KP") {
  return `
    <article class="kpi">
      <div class="kpi-icon">${escapeHtml(icon)}</div>
      <div>
        <span>${escapeHtml(label)}</span>
        <strong>${escapeHtml(String(value))}</strong>
        <span>${escapeHtml(detail)}</span>
      </div>
    </article>
  `;
}

function summaryLine(label, value) {
  return `<div><span>${escapeHtml(label)}</span><strong>${escapeHtml(String(value))}</strong></div>`;
}

function setExtractionStatus(message) {
  els.extractionStatus.textContent = message;
}

function stripReviewFields(item) {
  const { reviewKind, ...clean } = item;
  return clean;
}

function normalizeText(text) {
  return text.replace(/\s+/g, " ").replace(/\s([.,;:])/g, "$1").trim();
}

function cleanTitle(chunk) {
  return chunk
    .replace(/^(?:item\s+)?(?:[0-9]{1,3}[a-z]?\.|[0-9]{1,3}\)|[a-z]\.)\s*/i, "")
    .split(/(?:recommendation|recommended action|staff report|background|fiscal impact|motion|vote)/i)[0]
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 160);
}

function inferItemType(chunk, amount, resolutionNumber, ordinanceNumber, contractName) {
  if (ordinanceNumber || /\bordinance\b/i.test(chunk)) return "ordinance";
  if (resolutionNumber || /\bresolution\b/i.test(chunk)) return "resolution";
  if (contractName || /\b(contract|agreement|vendor|bid|purchase order)\b/i.test(chunk)) return "contract";
  if (amount || /\b(appropriation|expenditure|budget|invoice|payment)\b/i.test(chunk)) return "spending";
  if (/\b(discussion|study session|receive and file|presentation)\b/i.test(chunk)) return "discussion";
  return "other";
}

function inferBudgetCategory(chunk) {
  const categories = state.budgetLines.map((line) => line.category).filter(Boolean);
  return categories.find((category) => chunk.toLowerCase().includes(category.toLowerCase())) || "";
}

function inferStatus(chunk) {
  if (/\b(withdrawn|pulled)\b/i.test(chunk)) return "withdrawn";
  if (/\b(postponed|continued|tabled|deferred)\b/i.test(chunk)) return "postponed";
  if (/\b(failed|not approved|motion did not carry)\b/i.test(chunk)) return "failed";
  if (/\b(approved|adopted|passed|carried|authorized)\b/i.test(chunk)) return "passed";
  return "";
}

function inferVotes(chunk) {
  const votes = {};
  state.councilMembers.forEach((member) => {
    const escaped = escapeRegExp(member);
    const voteMatch = chunk.match(new RegExp(`${escaped}.{0,40}\\b(yes|aye|no|nay|abstain|absent|recused)\\b`, "i"));
    if (voteMatch) {
      const value = voteMatch[1].toLowerCase();
      votes[member] = value === "aye" ? "yes" : value === "nay" ? "no" : value;
    }
  });
  return votes;
}

function firstMatch(text, regex) {
  const match = text.match(regex);
  return match ? match[1].trim().replace(/[),.;:]$/, "") : "";
}

function extractLargestAmount(text) {
  const matches = [...text.matchAll(/\$\s?([0-9][0-9,]*(?:\.[0-9]{2})?)/g)];
  if (!matches.length) return 0;
  return Math.max(...matches.map((match) => numeric(match[1])));
}

function extractSentence(text, marker) {
  const match = text.match(marker);
  if (!match) return "";
  const start = Math.max(0, match.index - 30);
  return text.slice(start, start + 220).trim();
}

function significantTitleWords(title) {
  return title
    .split(/\s+/)
    .filter((word) => word.length > 5)
    .slice(0, 5)
    .join(" ");
}

function fiscalYearForDate(dateString) {
  if (!dateString) return String(new Date().getFullYear());
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return String(new Date().getFullYear());
  return String(date.getFullYear());
}

function formatDate(dateString) {
  if (!dateString) return "No date";
  const date = new Date(`${dateString}T00:00:00`);
  if (Number.isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function numeric(value) {
  if (typeof value === "number") return Number.isFinite(value) ? value : 0;
  return Number(String(value || "").replace(/[$,]/g, "")) || 0;
}

function spendingAmount(item) {
  if (!["expense", "refund", "unknown", ""].includes(item.amountType || "unknown")) return 0;
  return numeric(item.amount);
}

function revenueAmount(item) {
  return item.amountType === "revenue" ? numeric(item.amount) : 0;
}

function amountTypeLabel(value) {
  const labels = {
    expense: "Expense",
    revenue: "Revenue / grant",
    refund: "Refund",
    "no-cost": "No cost",
    unknown: "Unknown",
  };
  return labels[value] || "Unknown";
}

function isContractLike(item) {
  return (
    item.type === "contract" ||
    item.contractName ||
    /\b(contract|agreement|vendor|services|payment|change order|software|hospital|ymca|engineering|apparatus|shauger|mott macdonald|remington|watermen|woodard|alpine|fairview)\b/i.test(
      `${item.title} ${item.discussion}`,
    )
  );
}

function voteResult(item) {
  const votes = Object.values(item.votes || {});
  if (!votes.length) return "-";
  const yes = votes.filter((vote) => vote === "yes").length;
  const no = votes.filter((vote) => vote === "no").length;
  const abstain = votes.filter((vote) => vote === "abstain").length;
  return abstain ? `${yes}-${no}-${abstain}` : `${yes}-${no}`;
}

function voteToken(vote = "") {
  const normalized = vote || "unknown";
  const label = {
    yes: "Y",
    no: "N",
    abstain: "A",
    absent: "-",
    recused: "R",
    unknown: "-",
  }[normalized] || "-";
  const className = normalized === "recused" ? "vote-abstain" : `vote-${normalized}`;
  return `<span class="vote-token ${className}">${label}</span>`;
}

function shortCouncilName(name) {
  return String(name)
    .replace(/^Hon\.\s*/i, "")
    .replace("Councilmember ", "")
    .replace("Council President ", "")
    .replace("Council Vice President ", "")
    .trim();
}

function truncate(value, maxLength) {
  const text = String(value || "");
  return text.length > maxLength ? `${text.slice(0, maxLength - 1)}...` : text;
}

function categoryTotals(items) {
  const totals = new Map();
  items
    .filter((item) => approvedSpendingAmount(item) > 0)
    .forEach((item) => {
      const category = item.budgetCategory || "Unassigned";
      const current = totals.get(category) || { category, amount: 0, count: 0 };
      current.amount += approvedSpendingAmount(item);
      current.count += 1;
      totals.set(category, current);
    });
  return [...totals.values()].sort((a, b) => b.amount - a.amount);
}

function titleCase(value) {
  return String(value || "")
    .replace(/[-_]/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function escapeHtml(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeRegExp(value) {
  return String(value).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
