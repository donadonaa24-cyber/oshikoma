const { chromium } = require('C:/Users/donad/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright');
const { pathToFileURL } = require('node:url');
const assert = require('node:assert/strict');
(async () => {
  const browser = await chromium.launch({ executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe', headless: true });
  try {
    for (const [width, height] of [[1280, 720], [1920, 1080], [390, 844]]) {
      const page = await browser.newPage({ viewport: { width, height } });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(pathToFileURL(`${__dirname}/game.html`).href);
      await page.evaluate(() => {
        showTraining();
        state.trainingSetupIds = ['ren', 'yui', 'mio', 'honoka'];
        confirmTrainingSetup();
      });
      await page.locator('[data-open-training-actions]').click();
      await page.locator('[data-journey-route="power"]').click();
      const bounds = await page.locator('.training-action-modal button').evaluateAll(buttons => buttons.map(button => {
        const r = button.getBoundingClientRect();
        const clip = button.closest('.training-modal-card').getBoundingClientRect();
        return { text: button.textContent.trim(), fits: r.top >= clip.top && r.bottom <= clip.bottom + 1 && r.left >= clip.left && r.right <= clip.right + 1 };
      }));
      await page.screenshot({ path: `${__dirname}/verification-journey-${width}.png` });
      assert.ok(bounds.every(button => button.fits), JSON.stringify({ width, bounds }));
      const report = await page.evaluate(() => {
        const run = ensureTrainingRun();
        const choice = trainingActions.find(action => action.id === 'power').choices[0];
        applyTrainingChoiceToTeam(choice, 'power', ['ren', 'yui'], 3);
        applyTrainingChoiceToTeam(choice, 'power', ['ren', 'mio'], 0);
        for (let i = 0; i < 3; i++) applyTrainingChoiceToTeam(trainingActions.find(action => action.id === 'rest').choices[0], 'rest', run.teamIds);
        const loaded = normalizeTrainingRunForResume(serializeTrainingRun(run));
        const saved = saveTeamPresetFromRun(run, '検証用チーム');
        if (!saved.ok) throw new Error(saved.message);
        state.battleTeamPreset = saved.preset;
        const battleUnit = makeBattlePlayerUnit(getBaseUnit('ren'), 0);
        if (battleUnit.atk !== run.members.ren.atk) throw new Error('育成の攻撃力が出撃に反映されていない');
        state.trainingEvent = null;
        state.trainingResultModalOpen = true;
        renderTraining();
        return { wins: loaded.journey.wins, highlights: run.lastResult.highlights, atk: run.members.ren.atk, battleAtk: battleUnit.atk, bodyFits: document.documentElement.scrollHeight <= innerHeight };
      });
      assert.equal(report.wins, 1);
      assert.ok(report.highlights.some(line => line.includes('成功')));
      assert.equal(errors.length, 0, errors.join('\n'));
      const resultButton = await page.locator('.training-result-modal [data-training-result-ok]').boundingBox();
      assert.ok(resultButton && resultButton.y + resultButton.height <= height);
      await page.screenshot({ path: `${__dirname}/verification-journey-result-${width}.png` });
      console.log(JSON.stringify({ width, height, report, errors }));
      await page.close();
    }
  } finally { await browser.close(); }
})().catch(error => { console.error(error); process.exitCode = 1; });
