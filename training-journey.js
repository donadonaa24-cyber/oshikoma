/* Five-turn goals are deterministic so reopening a screen cannot reroll them. */
const TrainingJourney = (() => {
  const routes = {
    power: { name: "ライバルへの挑戦", action: "power", stat: "atk", reward: 4, label: "攻撃", goal: 2 },
    bond: { name: "心を合わせる約束", action: "bond", stat: "def", reward: 4, label: "防御", goal: 2 },
    strategy: { name: "秘密の必勝作戦", action: "strategy", stat: "knowledge", reward: 5, label: "知識", goal: 2 },
  };
  const wishes = {
    ren: ["power", "一緒に練習して、頼れるところを見せたいわん！"],
    yui: ["date", "今日は寄り道したい気分にゃ。付き合ってくれる？"],
    mio: ["strategy", "うちの作戦、聞いてくれへん？ 面白いこと思いついたんよ。"],
    honoka: ["bond", "…怖くても前に出られるように、少し話を聞いてほしい…"],
    kaeru: ["strategy", "新発明の実験相手、きみに決定！ ノートを開いて！"],
    riko: ["date", "次のお出かけ、わたしと一緒がいいな。約束できる？"],
    ibuki: ["power", "次こそ昨日の自分を超える！ 一緒に特訓してくれ！"],
    non: ["bond", "きみとゆっくりお話したいなあ。急がなくていいからね。"],
    king: ["power", "余に遠慮は要らぬ。お前の本気の稽古を見せよ。"],
    shade2: ["strategy", "守る順序を決めておきたい。作戦会議に付き合えるか。"],
    shade1: ["date", "今日は私と出かけなさい。…誰でもいいわけじゃないのよ。"],
    shade3: ["strategy", "あなたの仮説を聞かせてください。私の結界と比較しましょう。"],
  };
  const thanks = {
    ren: "覚えててくれたんだ！ 次はぼくがきみを助けるわん！",
    yui: "ちゃんと来たんだ。…次も、気が向いたら付き合ってあげるにゃ。",
    mio: "これこれ、こういう時間が欲しかってん。次の盤面、楽しみやな！",
    honoka: "…忘れられてるかと思った。きみが一緒なら、もう一歩…いけそう。",
    kaeru: "実験成功！ …きみとだと、失敗まで面白くなるのはなぜだろう？",
    riko: "約束、守ってくれたね！ 今日のこと、ずっと覚えてるから。",
    ibuki: "よっしゃ！ きみが見ててくれると、もう一本いける！",
    non: "楽しかったねえ。帰ったら、今日のこと日記に書こうかなあ。",
    king: "よく来た。それでこそ、余が背を預けるに値する。",
    shade2: "約束を守る者は信用できる。次は私が応えよう。",
    shade1: "…ちゃんと覚えていたのね。今日は、それで許してあげる。",
    shade3: "有意義でした。…次もあなたと検証したい、と言っています。",
  };
  function ensure(run) {
    const start = Math.floor(run.turn / 5) * 5;
    if (!run.journey || typeof run.journey !== "object") run.journey = { wins: 0, history: [] };
    const journey = run.journey;
    if (!Array.isArray(journey.history)) journey.history = [];
    journey.wins = Number.isFinite(journey.wins) ? journey.wins : 0;
    if ((!journey.stage || journey.stage.end <= run.turn) && !run.completed) {
      const id = run.teamIds[Math.floor(start / 5) % run.teamIds.length];
      journey.stage = { start: run.turn, end: Math.min(start + 5, run.limit), route: "", count: 0, targets: [], wishId: id, wishDone: false, settled: false };
    }
    return journey;
  }
  function select(run, route) {
    const stage = ensure(run).stage;
    if (!routes[route] || !stage || stage.settled || run.completed || stage.start !== run.turn) return false;
    stage.route = route;
    return true;
  }
  function wish(stage) {
    return wishes[stage.wishId] || ["strategy", "次の勝負について、お前と作戦を練りたい。"];
  }
  function advance(run, action, targets, miniBonus) {
    const journey = run.journey;
    const stage = journey?.stage;
    if (!stage || stage.settled) return { rewards: [], messages: [] };
    const rewards = [];
    const messages = [];
    const route = routes[stage.route];
    if (route?.action === action) {
      stage.count += 1;
      stage.targets = [...new Set([...stage.targets, ...targets])];
      if (action === "power" && miniBonus >= 2) stage.excellent = true;
    }
    if (!stage.wishDone && action === wish(stage)[0] && targets.includes(stage.wishId)) {
      stage.wishDone = true;
      rewards.push({ id: stage.wishId, stat: "bond", amount: 4 }, { id: stage.wishId, stat: "maxHp", amount: 6 });
      messages.push(`${stage.wishId}: 約束達成！ 親密+4 / HP+6`);
      messages.push(`${stage.wishId}: 「${thanks[stage.wishId] || "約束を覚えていてくれたんだね。ありがとう。"}」`);
    }
    if (run.turn >= stage.end) {
      stage.settled = true;
      const success = Boolean(route && stage.count >= route.goal && stage.targets.length >= 2);
      if (success) {
        journey.wins += 1;
        const amount = route.reward + (stage.excellent ? 1 : 0);
        run.teamIds.forEach((id) => rewards.push({ id, stat: route.stat, amount }));
        messages.push(`第${Math.ceil(stage.end / 5)}幕「${route.name}」成功！ 全員の${route.label}+${amount}`);
        messages.push({ power: "最後の一本。競り合った二人が笑い、見守る仲間も立ち上がった。この手応えを、次のbattleへ。", bond: "発表会で言葉が詰まる。その続きを仲間が引き取った。何度も聞いた気持ちは、ちゃんと届いていた。", strategy: "盤上に並べた秘密の作戦がつながる。『ここで、こう！』全員の視線が同じ勝ち筋を追った。" }[stage.route]);
      } else {
        messages.push(`第${Math.ceil(stage.end / 5)}幕：今回は準備を重ねた。次の挑戦へ。`);
      }
      journey.history.push({ end: stage.end, route: stage.route, success, wishDone: stage.wishDone });
      if (run.completed) messages.push(`育成の足跡：挑戦${journey.wins}回成功、約束${journey.history.filter(item => item.wishDone).length}件達成。このチームで次の舞台へ。`);
    }
    return { rewards, messages };
  }
  return { routes, ensure, select, wish, advance };
})();
if (typeof module !== "undefined") module.exports = TrainingJourney;
