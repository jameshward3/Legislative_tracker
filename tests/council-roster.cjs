const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');

const root = path.resolve(__dirname, '..');
const sourceOverride = process.argv[2];
for (const appPath of sourceOverride ? [sourceOverride] : ['app.js', 'docs/app.js']) {
  const originalSource = fs.readFileSync(path.resolve(root, appPath), 'utf8');
  // Exercise production data loading and scorecard HTML, excluding unrelated startup UI.
  const source = originalSource.replace(/\nbindEvents\(\);\nrender\(\);\n(?:applyInitialFocusFromQuery\(\);\n)?/, '\n');
  for (const scenario of ['fresh', 'saved-old', 'invalid-json', 'storage-blocked', 'legacy-import']) {
    const elements = new Map();
    const ctx = vm.createContext({
      window: {}, structuredClone, Intl, Date,
      crypto: { randomUUID: () => 'fixture' },
      localStorage: { getItem() {
        if (scenario === 'storage-blocked') throw new Error('Storage access denied');
        if (scenario === 'invalid-json') return '{invalid';
        if (scenario === 'saved-old') return JSON.stringify({councilMembers: ['Hon. Tency A. Eason', 'Hon. Jamie B. Summers-Johnson'], items: []});
        return null;
      } },
      document: {
        querySelectorAll: () => [],
        querySelector(selector) {
          if (!elements.has(selector)) elements.set(selector, {innerHTML: '', querySelectorAll: () => []});
          return elements.get(selector);
        },
      },
    });
    for (const dataPath of ['docs/seed-data.js', 'docs/imported-history-data.js']) {
      vm.runInContext(fs.readFileSync(path.join(root, dataPath), 'utf8'), ctx);
    }
    const historyBefore = vm.runInContext('JSON.stringify(window.ORANGE_TRACKER_SEED.items)', ctx);
    vm.runInContext(source, ctx);
    if (scenario !== 'legacy-import') {
      assert.equal(vm.runInContext('state.councilMembers.length', ctx), 7);
      assert.equal(vm.runInContext('state.councilMembers.some(n => /Eason|Summers-Johnson/.test(n))', ctx), false, `${appPath}: ${scenario} loaded former members`);
    } else {
      vm.runInContext('state.councilMembers = ["Hon. Tency A. Eason", "Hon. Jamie B. Summers-Johnson"]; selectedPublicMember = state.councilMembers[0];', ctx);
    }
    vm.runInContext('renderMemberScorecards()', ctx);
    const toggle = elements.get('#memberToggle').innerHTML;
    assert.equal((toggle.match(/data-public-member-index=/g) || []).length, 7);
    assert.match(toggle, /Lynn A\. Ogbourne/);
    assert.match(toggle, /James H\. Ward,? III/);
    assert.doesNotMatch(toggle + elements.get('#memberProfile').innerHTML, /Eason|Summers-Johnson/);
    for (const member of ['Hon. Lynn A. Ogbourne', 'Hon. James H. Ward III']) {
      vm.runInContext(`selectedPublicMember = ${JSON.stringify(member)}; renderMemberScorecards();`, ctx);
      assert.match(elements.get('#memberProfile').innerHTML, /assets\/council\/(lynn-ogbourne|james-ward)\.jpeg/);
      assert.equal(vm.runInContext('memberScorecard(selectedPublicMember).votedItems.length', ctx), 0);
    }
    assert.equal(vm.runInContext('JSON.stringify(state.items)', ctx), historyBefore, 'Historical records changed');
    console.log(`PASS ${appPath}: ${scenario} — seven current cards; historical records preserved`);
  }
}
