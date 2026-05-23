global.window = {};
require("../seed-data.js");

const state = global.window.ORANGE_TRACKER_SEED;
const requiredMembers = state.councilMembers.length;
const errors = [];

if (!state.items.length) errors.push("No items found.");

for (const item of state.items) {
  if (!item.id) errors.push(`Missing id: ${item.title}`);
  if (!item.title) errors.push(`Missing title: ${item.id}`);
  if (!item.meetingDate) errors.push(`Missing meeting date: ${item.id}`);
  if (!item.status) errors.push(`Missing status: ${item.id}`);
  if (!item.amountType) errors.push(`Missing amount type: ${item.id}`);
  if (Object.keys(item.votes || {}).length && Object.keys(item.votes).length !== requiredMembers) {
    errors.push(`Vote count mismatch: ${item.id}`);
  }
}

const spending = state.items
  .filter((item) => item.status === "passed" && ["expense", "refund", "unknown", ""].includes(item.amountType || "unknown"))
  .reduce((sum, item) => sum + Number(item.amount || 0), 0);

const revenue = state.items
  .filter((item) => item.status === "passed" && item.amountType === "revenue")
  .reduce((sum, item) => sum + Number(item.amount || 0), 0);

const result = {
  councilMembers: state.councilMembers.length,
  items: state.items.length,
  passed: state.items.filter((item) => item.status === "passed").length,
  postponed: state.items.filter((item) => item.status === "postponed").length,
  pending: state.items.filter((item) => item.status === "pending").length,
  spending,
  revenue,
};

console.log(JSON.stringify(result, null, 2));

if (errors.length) {
  console.error(errors.join("\n"));
  process.exit(1);
}
