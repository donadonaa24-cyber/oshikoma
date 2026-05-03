const BOARD_SIZE = 6;
const PLAYER_BASE = { row: 5, col: 0 };
const ENEMY_BASE = { row: 0, col: 5 };
const OSHIGOMA_SAVE_KEY = "oshigomaBattle.savedRoster.v1";
const BASE_TRAIN_TURNS = 20;
const MAX_TRAIN_TURNS = 35;
const MAX_BATTLE_TEAM = 4;
const MAX_PRESETS_PER_UNIT = 5;
const MAX_TEAM_PRESETS = 20;
const STARTING_CARE_POINTS = 0;
const ENEMY_UNLOCK_THRESHOLDS = [4, 5, 6, 7];
const defaultBattleTeamIds = ["honoka", "mio", "ren", "yui"];
const playerFormation = [
  { row: 5, col: 0 },
  { row: 5, col: 1 },
  { row: 4, col: 0 },
  { row: 4, col: 1 },
];

const moodEffects = {
  "ごきげん": { atk: 0, def: 0, move: 1, note: "移動+1" },
  "怒り": { atk: 3, def: -2, move: 0, note: "攻撃+3 防御-2" },
  "落ち込み": { atk: -2, def: 0, move: -1, note: "攻撃-2 移動-1" },
  "恋愛中": { atk: 2, def: 1, move: 0, note: "攻撃+2 防御+1" },
  "気まずい": { atk: -1, def: -1, move: 0, note: "連携不可" },
  "集中": { atk: 1, def: 1, move: 0, note: "攻防+1" },
  "嫉妬": { atk: 1, def: -1, move: 0, note: "攻撃+1 防御-1" },
  "呆れ": { atk: -99, def: -99, move: -99, note: "勝手に退却" },
};

const trainingTargetRules = {
  bond: { min: 1, max: 1, label: "1人" },
  power: { min: 1, max: 2, label: "1〜2人" },
  date: { min: 2, max: 4, label: "2〜4人" },
  strategy: { min: 1, max: 4, label: "1〜4人" },
  rest: { min: 4, max: 4, label: "全員", all: true },
};

const playerLevelUnlocks = [
  { level: 1, label: "20ターン育成" },
  { level: 5, label: "25ターン育成 / 黒獅子王育成" },
  { level: 8, label: "銀狼シオン育成" },
  { level: 10, label: "30ターン育成" },
  { level: 12, label: "鹿角ノア育成" },
  { level: 15, label: "豹妬レイラ育成" },
  { level: 20, label: "35ターン育成" },
];

const enemyLevelUnlocks = {
  king: 5,
  shade2: 8,
  shade3: 12,
  shade1: 15,
};

const trainingTypeLabels = ["猛攻型", "守護型", "策士型", "絆型", "激情型", "安定型"];

const personalSkillDefinitions = {
  ren: {
    name: "まっすぐな突撃",
    role: "strike",
    base: "近い敵へ突撃ダメージ。育成タイプで追撃や再移動が変化。",
  },
  yui: {
    name: "きまぐれ斜線",
    role: "pierce",
    base: "斜め射程の敵を削り、気分が良いと味方も少し守る。",
  },
  mio: {
    name: "風読みカバー",
    role: "guard",
    base: "傷ついた味方を守り、防御を上げる。",
  },
  honoka: {
    name: "小さな勇気の応援",
    role: "support",
    base: "全員を少し回復し、親密な味方ほど効果が伸びる。",
  },
  kaeru: {
    name: "けろっと奇策",
    role: "trick",
    base: "敵を惑わせ、知識が高いほど追加効果が出る。",
  },
  riko: {
    name: "ぴょんと主役ムーブ",
    role: "support",
    base: "自分と近い味方を回復し、機嫌を上向かせる。",
  },
  ibuki: {
    name: "一直線ヒートドライブ",
    role: "strike",
    base: "直線火力で近い敵を押し込む。",
  },
  non: {
    name: "ふわふわ守り布団",
    role: "guard",
    base: "味方の防御とHPを安定させる。",
  },
  king: {
    name: "王の支配命令",
    role: "strike",
    base: "高火力だが親密度が低いと不安定。",
  },
  shade2: {
    name: "銀狼の護衛線",
    role: "guard",
    base: "防御と護衛に特化し、絆型で大きく伸びる。",
  },
  shade1: {
    name: "豹妬オーバードライブ",
    role: "strike",
    base: "嫉妬が高いほど火力が上がるが、扱いを誤ると危険。",
  },
  shade3: {
    name: "鹿角の冷たい定理",
    role: "trick",
    base: "知識で敵を妨害し、策士型で追加行動を狙える。",
  },
};

const playerProfiles = {
  ren: {
    animal: "犬",
    personality: "純粋無垢",
    ending: "わん",
    talkStyle: "まっすぐで疑うことを知らない。褒めると伸びやすい。",
    catLike: false,
  },
  yui: {
    animal: "猫",
    personality: "気分屋",
    ending: "にゃ",
    talkStyle: "甘えたりそっぽを向いたり忙しい。固執しても伸びが読めない。",
    catLike: true,
  },
  mio: {
    animal: "鳥",
    personality: "自由",
    ending: "",
    talkStyle: "関西弁で軽く飛び回る。自由にさせると機嫌が良い。",
    catLike: false,
  },
  honoka: {
    animal: "虫",
    personality: "気弱なビビり",
    ending: "",
    talkStyle: "声が小さく、言葉に「…」が多い。安心させると粘り強い。",
    catLike: false,
  },
  kaeru: {
    animal: "蛙",
    personality: "変人",
    ending: "けろ",
    talkStyle: "発想が斜め上。変な提案ほど楽しそうに跳ねる。",
    catLike: false,
  },
  riko: {
    animal: "兎",
    personality: "可愛い全振り",
    ending: "ぴょん",
    talkStyle: "甘え上手で褒められると伸びる。雑にされるとしょんぼりする。",
    catLike: false,
  },
  ibuki: {
    animal: "猪",
    personality: "情熱一直線",
    ending: "",
    talkStyle: "熱血で前向き。まっすぐ任せると攻撃が伸びる。",
    catLike: false,
  },
  non: {
    animal: "羊",
    personality: "のんびり",
    ending: "",
    talkStyle: "ゆっくり話す。急かさず見守ると防御とHPが伸びる。",
    catLike: false,
  },
  king: {
    animal: "ライオン",
    personality: "邪悪な王様",
    ending: "",
    talkStyle: "威圧的だが、正面から認められると少しだけ揺らぐ。",
    catLike: false,
  },
  shade2: {
    animal: "狼",
    personality: "沈黙の護衛",
    ending: "",
    talkStyle: "言葉は少ない。筋の通った作戦と静かな時間を好む。",
    catLike: false,
  },
  shade1: {
    animal: "豹",
    personality: "嫉妬深い策士",
    ending: "",
    talkStyle: "褒められたい気持ちを隠す。比較されると一気に荒れる。",
    catLike: false,
  },
  shade3: {
    animal: "鹿",
    personality: "冷たい魔導士",
    ending: "",
    talkStyle: "知識と礼儀を重んじる。勢いだけの相手は苦手。",
    catLike: false,
  },
};

const relationshipSettings = {
  ren: {
    stance: "結衣とは犬猫ライバル。言い合うほど気になっている。",
    likes: ["honoka", "mio"],
    dislikes: ["yui"],
    rival: "yui",
  },
  yui: {
    stance: "蓮とは犬猫ライバル。かまわれると逃げるが、無視されると機嫌を崩す。",
    likes: ["riko"],
    dislikes: ["ren"],
    rival: "ren",
  },
  mio: {
    stance: "蛙瑠の変な実験が少し苦手。歩太のことは放っておけない。",
    likes: ["honoka", "ren"],
    dislikes: ["kaeru"],
    rival: "",
  },
  honoka: {
    stance: "強い相手は怖いけれど、美桜と乃音の落ち着きには安心している。",
    likes: ["mio", "non"],
    dislikes: ["ibuki"],
    rival: "",
  },
  kaeru: {
    stance: "美桜の自由さが読めなくて少し苦手。莉胡とは跳ね方研究仲間。",
    likes: ["riko"],
    dislikes: ["mio"],
    rival: "",
  },
  riko: {
    stance: "かわいいもの仲間には甘い。伊吹の勢いにはたまに押される。",
    likes: ["yui", "kaeru"],
    dislikes: ["ibuki"],
    rival: "",
  },
  ibuki: {
    stance: "蓮とは直線勝負で燃える。乃音ののんびりさには待ちきれない。",
    likes: ["ren"],
    dislikes: ["non"],
    rival: "",
  },
  non: {
    stance: "歩太とはゆっくり話せる。伊吹の熱さは少しだけまぶしい。",
    likes: ["honoka"],
    dislikes: ["ibuki"],
    rival: "",
  },
  king: {
    stance: "黒金会の王。伊吹の正面突破だけは少し認めているが、蓮の純粋さは眩しすぎる。",
    likes: ["ibuki", "shade2"],
    dislikes: ["ren"],
    rival: "ren",
  },
  shade2: {
    stance: "銀狼の護衛。黒獅子王には忠義がある。美桜の自由さとは相性が悪い。",
    likes: ["king", "shade3"],
    dislikes: ["mio"],
    rival: "",
  },
  shade1: {
    stance: "豹妬の幹部。莉胡のかわいさに対抗心を燃やし、構われないとすぐ棘が出る。",
    likes: ["king"],
    dislikes: ["riko", "yui"],
    rival: "riko",
  },
  shade3: {
    stance: "鹿角の魔導士。知識を尊び、蛙瑠の奇行を研究対象として警戒している。",
    likes: ["shade2"],
    dislikes: ["kaeru", "ibuki"],
    rival: "kaeru",
  },
};

const growthAffinities = {
  ren: { bond: 2, power: 2, date: 1, strategy: -1, rest: 0, favorite: "褒められること", weak: "難しい理屈" },
  yui: { bond: 1, power: 0, date: 2, strategy: 1, rest: 1, favorite: "気分を尊重されること", weak: "しつこい構い方" },
  mio: { bond: 1, power: 1, date: 1, strategy: 2, rest: 0, favorite: "自由に任されること", weak: "縛られる作戦" },
  honoka: { bond: 2, power: -1, date: 1, strategy: 1, rest: 2, favorite: "安心できる説明", weak: "急な実戦" },
  kaeru: { bond: 0, power: 2, date: 1, strategy: 2, rest: -1, favorite: "変な発想", weak: "普通すぎる予定" },
  riko: { bond: 2, power: 1, date: 2, strategy: 0, rest: 0, favorite: "かわいい小物", weak: "雑な扱い" },
  ibuki: { bond: 0, power: 3, date: 1, strategy: -1, rest: -1, favorite: "任せる一言", weak: "長い座学" },
  non: { bond: 1, power: -1, date: 2, strategy: 1, rest: 3, favorite: "待ってもらうこと", weak: "急かされること" },
  king: { bond: -1, power: 3, date: 0, strategy: 2, rest: -1, favorite: "正面からの挑戦", weak: "甘い同情" },
  shade2: { bond: 0, power: 2, date: -1, strategy: 2, rest: 1, favorite: "静かな鍛錬", weak: "軽すぎる雑談" },
  shade1: { bond: 2, power: 1, date: 1, strategy: 1, rest: -1, favorite: "自分だけを見てもらうこと", weak: "比較されること" },
  shade3: { bond: 0, power: -1, date: 0, strategy: 3, rest: 1, favorite: "知的な対話", weak: "勢いだけの練習" },
};

const talkSeeds = {
  ren: [
    "好きな食べ物？ 甘いパンならずっとしっぽ振れる気がする",
    "今日の盤面、ぼくが一直線に走ったら褒めてくれる",
    "購買の前でいい匂いがして、作戦を忘れそうになった",
    "敵が怖くても、きみが呼んだらちゃんと戻ってくる",
    "放課後の廊下で、足音だけで君だって分かった",
    "犬のフード、似合ってるって言われるとすぐ信じちゃう",
    "戦う前に手を合わせたら、なんか強くなれる気がする",
    "きみの声が聞こえると、遠くのマスまで走れそう",
    "一緒に買い物に行くなら、荷物持ちなら任せて",
    "おやつを選ぶの、ぼくには難しすぎる。全部おいしそう",
    "敵の王が怖いけど、きみの前ではかっこつけたい",
    "ぼくばっかり話してたら、みんな寂しくならないかな",
    "今日は勝ったら、頭を撫でてほしいかもしれない",
    "君が笑うと、胸の奥がぽかぽかして攻撃が軽くなる",
    "買い物帰りの袋、半分持つ。半分以上でもいい",
    "夜の校舎って怖いけど、二人なら冒険っぽい",
    "好きなものを覚えてくれてると、すごく嬉しい",
    "ぼくの弱いところも、ちゃんと見ていてくれる",
    "大事な一手の前に、名前を呼んでくれるだけでいい",
    "おやつを渡されたら、たぶん一生忘れない",
    "君の作戦が無茶でも、信じたい気持ちは本物",
    "他の子と話してるのを見ると、少しだけ耳が下がる",
    "ぼく、強くなったら君を守れるかな",
    "今日の帰り道、少しだけ遠回りしたい",
    "王を倒したら、一番最初に君のところへ戻る",
    "君の隣で戦うのが、いちばん落ち着く",
    "もし怖くなっても、逃げないでいられる理由がある",
    "君が選んだおやつなら、苦手でも食べてみる",
    "一人だけ特別って言われたら、どうしたらいいか分からない",
    "勝ちたい理由が、だんだん君になってきた",
  ],
  yui: [
    "好きな食べ物？ その日の気分で変わるから当ててみて",
    "斜めのマスって、まっすぐより自由でかわいいと思わない",
    "今日は構われたい気分かもしれないし、違うかもしれない",
    "猫のフード、かわいいって言うならもっとちゃんと言って",
    "購買に行くなら甘いもの。いや、しょっぱいものでもいい",
    "作戦は聞くけど、気分が乗ったらもっとすごいことする",
    "敵より眠気のほうが強い日もある",
    "君が呼ぶ声、ちょっとだけ好きかもしれない",
    "おやつを選ぶセンスで、今日の評価が決まる",
    "斜めから見た君、意外と悪くない",
    "あんまり構いすぎると逃げるけど、構わないと怒る",
    "猫って難しい？ それを楽しめる人がいい",
    "買い物なら新作スイーツを見に行くべき",
    "君が他の子を褒めたの、別に気にしてないけど",
    "今日は少しだけ素直でもいいかもしれない",
    "魔法の練習より、君の反応を見るほうが面白い",
    "おやつ、半分こなら許してあげる",
    "強くなるかどうかは気分。でも君次第かも",
    "君といると退屈しない。そこは評価してる",
    "斜めの道を一緒に歩くなら、迷子も悪くない",
    "嫉妬なんてしてない。ほんとにしてない",
    "君が困ってる顔、少しだけ助けたくなる",
    "撫でるなら今。三秒後は知らない",
    "特別扱いされるのは嫌いじゃない。たぶん",
    "勝った後のご褒美、先に予約していい",
    "君の選択肢、今日は試してあげる",
    "他の子と仲良くしてもいいけど、報告はいらない",
    "強くなりたい理由？ それ聞くのはまだ早い",
    "おやつより欲しいものがあるって言ったらどうする",
    "君の隣、気分がいい時だけなら座ってあげる",
  ],
  mio: [
    "好きな食べ物？ たこ焼きやな。熱いのをはふはふするんがええ",
    "盤面は窮屈やけど、空を見てたら道は見えるで",
    "今日は守りたい気分や。けど縛られるんは嫌やで",
    "鳥の衣装、羽ばたきやすくて気に入ってんねん",
    "購買行くなら、うちは新作より定番派やな",
    "あんたが悩んでる時、横から茶々入れたるわ",
    "作戦は固めすぎたらあかん。風向き見るんや",
    "敵が来ても、うちが間に入ったる",
    "おやつ買うなら、みんなで分けられるやつがええ",
    "自由に動かせてくれたら、意外と守りも硬いで",
    "あんた、うちばっか頼ると他の子がすねるで",
    "勝負の前に深呼吸や。焦ったら羽も絡まる",
    "買い物ついでに、ちょっと寄り道してもええやろ",
    "うちは褒められるより、信じて任されるほうが嬉しい",
    "空から見たら、盤面の悩みなんて小さいもんや",
    "あんたの無茶、嫌いやないけど止める時は止めるで",
    "おやつの袋、開ける音だけで元気出るわ",
    "うちの自由を分かってくれるなら、近くにおってもええ",
    "敵の空気が重い時ほど、軽口が効くんや",
    "ほんまに困ったら呼び。ちゃんと飛んでくる",
    "誰か一人だけ見てると、盤面が狭くなるで",
    "守るって、閉じ込めることやないと思うねん",
    "あんたと組むと、ちょっと風が読みやすい",
    "勝ったら屋上で風浴びよか",
    "うちは自由やけど、帰る場所は欲しいんや",
    "おやつ選び、センス見せてもらおか",
    "特別扱いは苦手やけど、雑にされるんも嫌や",
    "あんたの一手、今日は信じたる",
    "うちが飛ぶ時、ちゃんと見ててな",
    "いつか盤面の外まで、一緒に行けたらええな",
  ],
  honoka: [
    "好きな食べ物は…小さいクッキーです…大きいと緊張します…",
    "ぼく…前に出るのは怖いけど…呼ばれたら行きます…",
    "虫の羽…きれいって言われると…少しだけ安心します…",
    "購買の列が長いと…後ろに並ぶだけで勇気がいります…",
    "敵の目が合うと…足が止まりそうになります…",
    "でも…君が見てるなら…もう一歩だけ…",
    "おやつは…割れにくいものが好きです…落とすので…",
    "作戦を説明されると…少しだけ怖くなくなります…",
    "手を振って応援するのは…得意かもしれません…",
    "買い物に行くなら…人が少ない時間がいいです…",
    "ぼくばっかり話して…迷惑じゃないですか…",
    "褒められると…逃げたくなるけど…嬉しいです…",
    "小さな虫でも…役に立てることありますか…",
    "君が近くにいると…心臓が忙しいです…",
    "おやつを選ぶなら…半分こできるものがいいです…",
    "怖い時…名前を呼んでくれると戻れます…",
    "敵が強そうで…でも逃げたらもっと怖いです…",
    "君の後ろなら…少しだけ前を見られます…",
    "買い物袋…軽い方なら持てます…たぶん…",
    "ぼくのこと…ちゃんと覚えてくれてるんですね…",
    "他の子が強くなるのは嬉しいけど…少しだけ寂しいです…",
    "嫉妬って…怖い言葉ですね…ぼくもなるんでしょうか…",
    "もし退却しそうになったら…止めてくれますか…",
    "君がくれたおやつ…お守りにしてもいいですか…",
    "今日は…怖いより、嬉しいの方が少し大きいです…",
    "小さい勇気を集めたら…大きな一手になりますか…",
    "君に頼られると…震えるけど…逃げたくないです…",
    "勝った後…静かな場所で少し話したいです…",
    "ぼくが強くなったら…最初に君へ報告します…",
    "一緒なら…盤面の端っこも少し明るいです…",
  ],
  kaeru: [
    "今日の練習、まっすぐ行くより一回横に跳ねた方が面白いと思う",
    "蛙のフード、目が二つ多いから盤面が四倍見える気がする",
    "君が普通の作戦を出すなら、私は変な作戦で返す",
    "雨の日の購買って、妙に名案が浮かぶんだよね",
    "変って言われると安心する。退屈じゃないってことでしょ",
    "桂馬みたいに跳ねた先で、君が笑ってたら成功",
    "今日の私は多分強い。理由は聞かないで、今作ったから",
    "おやつより謎の粉を混ぜたい。大丈夫、たぶん食べ物",
    "君が止めてくれるから、私は安心して変なことができる",
    "次の一手、盤面じゃなくて天井から考えてみよう",
  ],
  riko: [
    "今日のリボン、かわいいって言ってくれるまで動かないかも",
    "桂馬の跳ね方って、ぴょんって感じで私にぴったりだよね",
    "甘いものを食べたら、もう少しだけ強くなれる気がする",
    "君に見てもらえる練習なら、失敗してもかわいく着地する",
    "ほめられると耳まで熱くなるけど、もっと聞きたい",
    "可愛いだけじゃ勝てないから、可愛いまま勝つ練習をする",
    "今日の私は構ってもらえると伸びる日だと思う",
    "手をつないだら、跳ねるタイミングを合わせやすいかも",
    "君が選んだ髪飾りなら、勝負の日につけていく",
    "次の一手、かわいくて強い方を選ぼう",
  ],
  ibuki: [
    "考える前に走りたい。でも君が作戦って言うなら一回だけ聞く",
    "香車みたいに一直線。それが俺の一番熱いところだ",
    "猪のフード、被るだけで胸の火が強くなる気がする",
    "負けても前を向く。前しか見えないとも言う",
    "君が背中を押してくれたら、壁ごと突っ切れる",
    "休憩？ それも次に走るための助走だな",
    "褒められるより、任せるって言われる方が燃える",
    "今日の練習は直線勝負。曲がるのは帰り道だけだ",
    "熱くなりすぎたら止めてくれ。止まれるかは別だけど",
    "君の一声で、もう一段ギアが上がる",
  ],
  non: [
    "今日はゆっくりでいいですか。急ぐと雲を数えそこねるので",
    "羊のフードはあったかくて、少し眠くなります",
    "一歩ずつなら、ぼくもちゃんと前に進めます",
    "強くなるって、焦らないことも入りますか",
    "君が待ってくれると、息がしやすくなります",
    "お昼寝の後なら、防御のことを考えられそうです",
    "手を握ると、迷子にならない感じがします",
    "今日は勝つより、ちゃんと帰ってくる練習をしたいです",
    "のんびりしてても、大事な時は起きています",
    "君の声は、目覚ましよりやさしいです",
  ],
  king: [
    "私を育てるなど、面白い冗談だ。だが王は強者の手も利用する",
    "蓮のまっすぐな目は苦手だ。眩しすぎて支配しづらい",
    "伊吹の突進だけは評価している。雑だが、王城の門を揺らす熱がある",
    "腹が減った王に命令するな。玉座でも倒れそうになる",
    "作戦ノートを見せろ。敗北を認める気はないが、敗因は知りたい",
    "忠義とは甘えではない。銀狼はそれを分かっている",
    "お前が私を恐れず話すなら、少しだけ聞いてやる",
    "勝利の形を選べ。王撃破か制圧か、その思想を聞きたい",
    "褒めるなら曖昧にするな。王に半端な言葉は要らない",
    "この黒金の印は呪いではない。私が私である証だ",
  ],
  shade2: [
    "命令は短くていい。長い言葉ほど刃が鈍る",
    "黒獅子王は危ういが、守る理由はある",
    "美桜の風は読みにくい。自由すぎる味方は護衛しづらい",
    "静かな訓練なら付き合う。騒がしい場所は苦手だ",
    "空腹で剣は振れない。そこだけは認める",
    "作戦の筋が通っていれば、敵だった過去は横に置く",
    "狼の衣装は威嚇ではない。近づくなという礼儀だ",
    "無駄口は嫌いだが、必要な確認なら聞く",
    "鹿角ノアの知識は信用できる。感情は別だ",
    "守る対象を選べ。選ばない護衛は、誰も守れない",
  ],
  shade1: [
    "私を後回しにした理由、ちゃんと説明できる？",
    "莉胡のかわいさばかり見てると、盤面ごと荒らしたくなる",
    "嫉妬は弱さじゃない。火力に変えれば武器になる",
    "豹の足は速いの。だから逃げる言い訳も捕まえる",
    "おなかが減ると、優しい言葉まで薄く聞こえる",
    "作戦？ いいよ。ただし私が一番目立つ形でね",
    "猫の結衣とは似てない。気まぐれと執着は別物よ",
    "褒めるなら他の子と比べないで。私だけを見て",
    "黒金の印は気に入ってる。誰にも薄めさせない",
    "仲間になる気はないけど、育てられるのは嫌いじゃない",
  ],
  shade3: [
    "蛙瑠の発想は不規則すぎる。研究対象としては興味深いけれど",
    "知識のない勇気は、ただの騒音です",
    "鹿角は飾りではありません。結界の焦点です",
    "空腹時に思考を求めないでください。式が崩れます",
    "作戦ノートを開きなさい。感情より先に構造を見ます",
    "銀狼シオンは静かで助かります。伊吹の熱は紙を焦がすので苦手",
    "敵だったからこそ、あなたの育て方を観察できます",
    "褒め言葉より、正確な評価をください",
    "鹿の耳は聞こえています。小声の甘やかしも記録済みです",
    "私を育てるなら、知識力を軽視しないことです",
  ],
};

const talkChoiceSets = {
  early: [
    { id: "gentle", label: "やさしく聞く", intent: "care", bond: [4, 9], hp: [0, 3], mood: "ごきげん", path: "信頼" },
    { id: "joke", label: "軽く冗談で返す", intent: "play", bond: [1, 8], hp: [0, 1], mood: "ごきげん", path: "混沌" },
    { id: "plan", label: "作戦に戻す", intent: "train", bond: [2, 6], hp: [0, 0], mood: "集中", path: "策士" },
  ],
  mid: [
    { id: "snack", label: "おやつを買う", intent: "snack", bond: [6, 12], hp: [4, 10], mood: "ごきげん", path: "信頼" },
    { id: "gift", label: "似合う物を選ぶ", intent: "gift", bond: [5, 14], hp: [1, 5], mood: "恋愛中", path: "恋愛" },
    { id: "free", label: "自由に選ばせる", intent: "free", bond: [3, 10], hp: [0, 4], mood: "集中", path: "策士" },
  ],
  high: [
    { id: "promise", label: "次も隣にいると約束する", intent: "promise", bond: [8, 16], hp: [3, 8], mood: "恋愛中", path: "恋愛" },
    { id: "focus", label: "君だけを頼る", intent: "focus", bond: [10, 20], hp: [0, 6], mood: "恋愛中", path: "恋愛" },
    { id: "team", label: "みんなで勝とうと言う", intent: "team", bond: [5, 12], hp: [2, 7], mood: "集中", path: "信頼" },
  ],
};

const talkLibrary = Object.fromEntries(
  Object.entries(talkSeeds).map(([unitId, lines]) => [
    unitId,
    lines.map((line, index) => ({
      id: `${unitId}-${index + 1}`,
      tier: index < 10 ? "early" : index < 20 ? "mid" : "high",
      line,
      choices: talkChoiceSets[index < 10 ? "early" : index < 20 ? "mid" : "high"],
    })),
  ]),
);

const deepTalkLines = {
  default: {
    early: [
      "まだ少し遠慮があるけど、今日のことをちゃんと言葉にしようとしている。",
      "勝つ話になると目が少しだけ真剣になる。褒め方を間違えなければ届きそうだ。",
      "他の子の名前を出すと一瞬だけ黙る。チームの中での自分の場所を探している。",
      "何気ない質問にも、答える前にこちらの顔色を見ている。",
    ],
    mid: [
      "前に話したことを覚えていたらしく、こちらの一言を待つ時間が少し長くなった。",
      "強くなりたい理由が、ただ勝ちたいだけではないことを小さく打ち明ける。",
      "チームの話をすると、嬉しさと不安が半分ずつ混ざった顔になる。",
      "今日は冗談だけで流さず、踏み込んだ言葉も受け止めてくれそうだ。",
    ],
    high: [
      "誰にも聞かれたくない声で、勝った後に一番先に見てほしいと言った。",
      "盤面の話をしていたはずなのに、いつの間にか隣にいる理由の話になっている。",
      "弱いところを見せるのは悔しい。でも君になら少しだけ預けてもいい、という目をしている。",
      "次の一手より先に、これからも自分を選ぶのかを確かめようとしている。",
    ],
  },
  ren: {
    early: [
      "蓮は勢いよく話し始めたあと、ちゃんと聞けているか不安そうに尻尾のない背中を揺らした。",
      "『ぼく、がんばるのは得意。でも、何を見てほしいのかはまだ下手かも』とまっすぐ言う。",
      "褒められる準備をしていた顔が、心配された瞬間だけ少し真面目になる。",
      "チームの話になると、結衣の名前を出しかけて飲み込んだ。",
    ],
    mid: [
      "蓮は『勝ったら一番に報告したい』と言ってから、恥ずかしそうに目を逸らした。",
      "前に褒めた一手を覚えていて、今日もそれを見てほしかったらしい。",
      "『ぼくだけ見てって言ったら困る？ でも、ちょっと言ってみたい』と笑う。",
      "勢いだけでは守れないものがあると、蓮なりに気づき始めている。",
    ],
    high: [
      "蓮は声を落として『君が見てると、強くなる理由がひとつ増える』と言った。",
      "『負けても戻ってくるから、その時も名前を呼んで』と真剣に頼んでくる。",
      "勝ち筋より先に、君の隣へ帰る道を考えている。",
      "蓮は照れを隠せず、それでも最後まで目を逸らさなかった。",
    ],
  },
  yui: {
    early: [
      "結衣はそっぽを向きながら、返事だけは妙に早い。聞いてほしい気持ちは隠せていない。",
      "『別に、構ってほしいとかじゃないし』と言いながら、こちらの反応を待っている。",
      "甘い言葉には警戒するけど、雑に扱われるともっと不機嫌になる。",
      "話題を変えるふりをして、本当は今日の自分の動きを見ていたか確認している。",
    ],
    mid: [
      "結衣は『前に言ったこと、覚えてたんだ』と小さく言って、すぐ別の方を向いた。",
      "チームの中で自分が必要かどうかを、冗談に包んで聞いてくる。",
      "『君が困るなら助けるけど、助けてほしいってちゃんと言って』と距離を詰める。",
      "斜めの道筋みたいに、素直じゃないけど確かに近づいている。",
    ],
    high: [
      "結衣は『他の子の前では言わないけど、今日は隣にいてもいい』と小さく言った。",
      "からかう余裕が消えて、君に選ばれる理由を本気で欲しがっている。",
      "『勝ったら褒めて。負けたら、まあ……慰めてもいい』と耳まで赤くする。",
      "気まぐれの奥にある寂しさを、今日は隠し切れていない。",
    ],
  },
  mio: {
    early: [
      "美桜は軽口で場をほどきながら、こちらが本気で聞くかどうかを見ている。",
      "『自由に動くのは好き。でも、置いていかれるのは少し違うかな』と笑ってみせる。",
    ],
    mid: [
      "美桜は勝ち筋の話をしながら、歩太が怖がらず前に出られる形を自然に探している。",
      "冗談の温度が少し下がり、今日は自分の弱さも笑わずに話してくれそうだ。",
    ],
    high: [
      "『私が自由でいられるのは、戻る場所を君が作ってくれるからかも』と静かに言う。",
      "美桜はいつもの余裕をしまって、次に勝った時いちばん近くで見ていてほしいと頼んだ。",
    ],
  },
  honoka: {
    early: [
      "歩太は言葉を選ぶたびに少し固まる。それでも逃げずに、今日できたことを話そうとしている。",
      "『怖いけど、見ていてくれるなら一歩だけなら出られるかも』と小さく言う。",
    ],
    mid: [
      "歩太は失敗した場面を先に謝りかけてから、ちゃんと悔しかったと打ち明ける。",
      "美桜に引っ張られるだけでなく、自分が誰かを支える形を考え始めている。",
    ],
    high: [
      "『守られるだけじゃなくて、君が危ない時に前へ出たい』と震えながらも言い切った。",
      "歩太は声を落として、勝ったら少しだけ胸を張って隣に立ちたいと話した。",
    ],
  },
  kaeru: {
    early: [
      "蛙瑠は話題を三つ飛ばしてから、ようやく今日聞いてほしかったことに戻ってくる。",
      "『普通に褒められると困るんだよね。変なところを褒めて』と楽しそうに言う。",
    ],
    mid: [
      "蛙瑠は失敗を実験結果みたいに並べるが、莉胡に笑われた時だけ少し気にしている。",
      "作戦ノートの端に描いた謎の図は、チームの誰かを助けるための近道らしい。",
    ],
    high: [
      "『君なら変なままの私を盤面に置いてくれるでしょ』と、めずらしく確かめるように聞く。",
      "蛙瑠はふざけた口調を残したまま、それでも最後の一手は君に見ていてほしいと言った。",
    ],
  },
  riko: {
    early: [
      "莉胡は褒めてほしい顔を隠さない。でも、かわいいだけで終わるのは少し不満そうだ。",
      "『今日の私、ちゃんと見てた？ かわいいところ以外も』とリボンを直しながら聞く。",
    ],
    mid: [
      "莉胡は自分が目立つ作戦を提案しつつ、チームのみんなが笑える終わり方も気にしている。",
      "『かわいいって武器でしょ？ でも君には、それだけじゃないって言ってほしい』と少し真面目になる。",
    ],
    high: [
      "莉胡は小さな声で、勝った後に一番かわいいと言われるより、一番頼れたと言われたいと打ち明けた。",
      "『私が決めるところ、君が信じてくれたら本当に決められる気がする』とまっすぐ見上げる。",
    ],
  },
  ibuki: {
    early: [
      "伊吹は座って話すだけでも足が前に出そうになる。言葉より先に熱がこぼれている。",
      "『考えるのは苦手だ。でも君が言うなら、走る前に一回だけ聞く』と腕を組む。",
    ],
    mid: [
      "伊吹は真正面から勝てなかった悔しさを隠さず、次は誰のために走るかを考えている。",
      "乃音のゆっくりした言葉を思い出して、勢いだけでは届かない場面を認め始めた。",
    ],
    high: [
      "『俺が突っ込む時、君が止めないなら、それは勝てるってことだろ』と信頼を預けてくる。",
      "伊吹は照れ隠しに大声を出したあと、勝った瞬間だけは君の方を見たいと付け足した。",
    ],
  },
  non: {
    early: [
      "乃音はゆっくり瞬きをして、急がなくていい話題から少しずつ心を開いていく。",
      "『今日は、ちゃんと起きてるよ。君が聞いてくれるなら』と眠そうに笑う。",
    ],
    mid: [
      "乃音は伊吹の勢いを眩しがりながら、自分の遅さにも役目があるのか考えている。",
      "黙っている時間が気まずさではなく、安心して隣にいられる時間に変わってきた。",
    ],
    high: [
      "『急がなくても、君が待ってくれるなら最後まで行ける』と乃音は静かに言った。",
      "乃音は眠たげな声のまま、勝った後に少しだけ肩を貸してほしいと頼んでくる。",
    ],
  },
  king: {
    early: [
      "黒獅子王は褒め言葉を受け取らず、まず君が従うに値する相手かを測っている。",
      "『王に媚びるな。だが、見ていたなら評価を言え』と低く命じる。",
    ],
    mid: [
      "黒獅子王は命令ではなく相談を求められたことに、わずかに不意を突かれた顔をする。",
      "強さだけではチームが動かないことを認めたくないまま、敗因だけは正確に口にした。",
    ],
    high: [
      "『お前の采配なら、一度だけ背を預けてやる』と黒獅子王は視線を逸らさずに言った。",
      "支配ではなく信頼で勝つ形を、黒獅子王はまだ名付けられずにいる。",
    ],
  },
  shade2: {
    early: [
      "銀狼シオンは短く返事をして、沈黙の長さでこちらとの距離を測っている。",
      "『命令なら従う。会話なら、少し時間がいる』と静かに告げる。",
    ],
    mid: [
      "シオンは守れなかった場面を淡々と振り返るが、声の底に悔しさが残っている。",
      "余計な言葉を省いた作戦ほど、彼女の頷きは少しだけ深くなる。",
    ],
    high: [
      "『背中は任せて。……それ以上の言葉は、まだ慣れない』とシオンは目を伏せた。",
      "シオンは勝利より先に、君が無事に戻る道筋を確認している。",
    ],
  },
  shade1: {
    early: [
      "豹妬レイラは最初に自分を見たかどうかを、言葉にしないまま責める目をしている。",
      "『放っておくなら勝手に目立つけど？ それでも見るのは私でしょ』と笑う。",
    ],
    mid: [
      "レイラは嫉妬を隠さない。その熱が、盤面では鋭い突破力になると知っている。",
      "他の子の名前を出すと棘が出るが、作戦として扱われると少しだけ落ち着く。",
    ],
    high: [
      "『妬いてる私ごと使いこなして。壊れる前に、ちゃんと名前を呼んで』と迫る。",
      "レイラは危うい笑みの奥で、選ばれたい気持ちを武器に変えようとしている。",
    ],
  },
  shade3: {
    early: [
      "鹿角ノアは言葉の順番を直しながらも、君が何を知りたいのかには興味を示している。",
      "『感情論は非効率です。ただし、観察対象としては無視できません』とノートを開く。",
    ],
    mid: [
      "ノアは勝ち筋を説明する声だけ少し柔らかい。理解されることには弱いらしい。",
      "冷たく見える沈黙の中で、チームを守るための妨害手順を何度も組み直している。",
    ],
    high: [
      "『あなたが信じるなら、私の計算外も試す価値があります』とノアは静かに言った。",
      "ノアは感情を式にできないまま、それでも君と勝つ未来を消さずに残している。",
    ],
  },
};

const trainingActions = [
  {
    id: "bond",
    label: "トーク",
    note: "気持ちを聞いて防御を伸ばす",
    line: "放課後、二人きりで今日のことを振り返る。",
    choices: [
      { label: "今日の気持ちをゆっくり聞く", bond: [4, 9], hp: [0, 3], atk: [0, 1], def: [2, 4], knowledge: [0, 1], exp: [0, 0], mood: "ごきげん", path: "信頼", intent: "care" },
      { label: "相手との関係を正直に聞く", bond: [3, 8], hp: [0, 2], atk: [0, 0], def: [2, 5], knowledge: [1, 2], exp: [0, 0], mood: "集中", path: "策士", intent: "team" },
      { label: "少しだけ特別扱いして励ます", bond: [6, 12], hp: [0, 2], atk: [0, 1], def: [1, 3], knowledge: [0, 1], exp: [0, 0], mood: "恋愛中", path: "恋愛", intent: "focus" },
    ],
  },
  {
    id: "power",
    label: "実戦トレーニング",
    note: "ミニゲームで攻撃と防御が伸びる",
    line: "盤上練習で、得意な一手を体に覚えさせる。",
    choices: [
      { label: "合図反応で踏み込む", mini: "reaction", bond: [1, 5], hp: [0, 3], atk: [2, 4], def: [1, 3], knowledge: [0, 1], exp: [0, 0], mood: "集中", path: "混沌", intent: "train" },
      { label: "ブロック崩しで守りを割る", mini: "breakout", bond: [2, 6], hp: [0, 4], atk: [1, 3], def: [2, 5], knowledge: [0, 1], exp: [0, 0], mood: "集中", path: "信頼", intent: "train" },
      { label: "スネークで軌道を読む", mini: "snake", bond: [-1, 4], hp: [-2, 3], atk: [3, 6], def: [0, 2], knowledge: [0, 1], exp: [0, 0], mood: "怒り", path: "混沌", intent: "train" },
    ],
  },
  {
    id: "date",
    label: "おでかけイベント",
    note: "HPが大きく伸びる",
    line: "練習を切り上げて、少しだけ寄り道する。",
    choices: [
      { label: "好きそうなおやつを選ぶ", bond: [4, 10], hp: [8, 18], atk: [0, 1], def: [0, 1], knowledge: [0, 1], exp: [0, 0], mood: "ごきげん", path: "恋愛", intent: "snack" },
      { label: "新しい小物を見に行く", bond: [3, 9], hp: [5, 12], atk: [0, 1], def: [1, 2], knowledge: [0, 1], exp: [0, 0], mood: "恋愛中", path: "信頼", intent: "gift" },
      { label: "人の少ない場所で休む", bond: [3, 8], hp: [10, 22], atk: [0, 0], def: [1, 3], knowledge: [0, 1], exp: [0, 0], mood: "ごきげん", path: "信頼", intent: "care" },
    ],
  },
  {
    id: "strategy",
    label: "作戦ノート",
    note: "知識力を伸ばしてスキル回数を増やす",
    line: "ノートを広げて、次のbattleの勝ち筋を書く。",
    choices: [
      { label: "勝ち筋を一緒に考える", bond: [2, 6], hp: [0, 2], atk: [0, 1], def: [1, 3], move: [0, 0], knowledge: [4, 8], exp: [0, 0], mood: "集中", path: "策士", intent: "plan" },
      { label: "相性のいい仲間を探す", bond: [3, 7], hp: [0, 2], atk: [0, 1], def: [1, 2], knowledge: [3, 7], exp: [0, 0], mood: "ごきげん", path: "信頼", intent: "team" },
      { label: "大胆な奇策を試す", bond: [0, 6], hp: [-1, 2], atk: [1, 3], def: [0, 1], move: [0, 1], knowledge: [5, 10], exp: [0, 0], mood: "ごきげん", path: "混沌", intent: "plan" },
    ],
  },
  {
    id: "rest",
    label: "休む",
    note: "おなかと気分を回復する",
    line: "今日は無理をせず、明日のために休ませる。",
    choices: [
      { label: "静かに見守る", bond: [1, 4], hp: [8, 18], atk: [0, 0], def: [0, 1], knowledge: [0, 1], exp: [0, 0], mood: "ごきげん", path: "信頼", intent: "care" },
      { label: "軽く雑談してから休ませる", bond: [2, 6], hp: [6, 14], atk: [0, 1], def: [0, 1], knowledge: [0, 1], exp: [0, 0], mood: "ごきげん", path: "恋愛", intent: "care" },
      { label: "次の目標だけ決めて寝かせる", bond: [1, 5], hp: [5, 12], atk: [0, 1], def: [0, 1], knowledge: [1, 2], exp: [0, 0], mood: "集中", path: "策士", intent: "plan" },
    ],
  },
];

const careActions = {
  head: {
    label: "頭をなでる",
    cost: 2,
    good: "頭をなでると、少しだけ表情がゆるんだ。",
    bad: "急に頭を触られて、少し警戒された。",
    bond: [2, 6],
    hp: [1, 6],
    stat: "def",
  },
  cheek: {
    label: "ほっぺを触る",
    cost: 3,
    good: "ほっぺに触れると、照れながらも距離が近づいた。",
    bad: "ほっぺはまだ早かったらしい。空気がちょっと固まった。",
    bond: [3, 8],
    hp: [0, 3],
    stat: "atk",
  },
  hand: {
    label: "手を握る",
    cost: 4,
    good: "手を握ると、次の一手を任せてくれそうな熱が灯った。",
    bad: "手を握るには、もう少し信頼が必要みたいだ。",
    bond: [4, 10],
    hp: [0, 5],
    stat: "move",
  },
};

const trainingMiniTargets = [
  { id: "up", label: "上", key: "W" },
  { id: "left", label: "左", key: "A" },
  { id: "down", label: "下", key: "S" },
  { id: "right", label: "右", key: "D" },
];

const comboDefinitions = [
  {
    users: ["ren", "yui"],
    name: "飛角ロマン砲",
    damage: 15,
    range: 3,
    partnerLabel: { ren: "結衣", yui: "蓮" },
  },
  {
    users: ["honoka", "mio"],
    name: "応援ガード突撃",
    damage: 12,
    range: 2,
    partnerLabel: { honoka: "美桜", mio: "歩太" },
  },
  {
    users: ["kaeru", "riko"],
    name: "ぴょんけろ二段跳び",
    damage: 14,
    range: 3,
    partnerLabel: { kaeru: "莉胡", riko: "蛙瑠" },
  },
  {
    users: ["ibuki", "non"],
    name: "一直線ひつじ雲",
    damage: 13,
    range: 3,
    partnerLabel: { ibuki: "乃音", non: "伊吹" },
  },
];

const structureTypes = {
  wall: { label: "壁", short: "壁", materialCost: 1, maxHp: 1, def: 0, owner: "player" },
  building: { label: "建物", short: "建", materialCost: 3, maxHp: 3, def: 0, owner: "player" },
};

const initialStructures = [];

const shopItems = {
  wallMaterial: { label: "壁材", cost: 1 },
  dogRibbon: { label: "犬用リボン", cost: 3, note: "蓮の親密度成長アップ" },
  catToy: { label: "猫じゃらし", cost: 3, note: "結衣の気分回復" },
  fluffyBlanket: { label: "ふわふわ毛布", cost: 3, note: "乃音の休む効果アップ" },
  carrotCharm: { label: "にんじんチャーム", cost: 3, note: "莉胡のごきげん率アップ" },
  strategyMemo: { label: "作戦メモ", cost: 2, note: "知識成長アップ" },
  lunchBox: { label: "お弁当", cost: 2, note: "おなか回復" },
};

const foodOptions = [
  { id: "meat", label: "肉まん", hunger: 38, hp: 18, likes: { ren: 10, yui: -3, mio: 5, honoka: 2, kaeru: 1, riko: 2, ibuki: 13, non: 4 } },
  { id: "fish", label: "焼き魚", hunger: 34, hp: 14, likes: { ren: 1, yui: 12, mio: 4, honoka: -2, kaeru: 7, riko: 0, ibuki: 3, non: 2 } },
  { id: "takoyaki", label: "たこ焼き", hunger: 32, hp: 13, likes: { ren: 4, yui: 1, mio: 12, honoka: 3, kaeru: 4, riko: 3, ibuki: 7, non: 5 } },
  { id: "cookie", label: "小さなクッキー", hunger: 28, hp: 10, likes: { ren: 5, yui: 6, mio: 0, honoka: 12, kaeru: 2, riko: 13, ibuki: 1, non: 10 } },
];

const foodHints = {
  ren: "蓮は湯気の出ているものを見ると、しっぽが見えないのに揺れている気がする。",
  yui: "結衣は魚の話題だけ少し反応が早い。気分屋だけど、そこは分かりやすい。",
  mio: "美桜は屋台の匂いに弱い。特にソースの香りには目が泳ぐ。",
  honoka: "歩太は大きい食べ物より、割れる小さなおやつの方が安心するらしい。",
  kaeru: "蛙瑠は変な組み合わせに目がない。でも魚の匂いには少し真面目になる。",
  riko: "莉胡は甘いものと小さくて可愛いものに弱い。選び方が雑だとすぐ顔に出る。",
  ibuki: "伊吹は湯気と肉の匂いで分かりやすく燃える。一直線に食べる。",
  non: "乃音は小さなお菓子とあたたかいものが好き。急かされない食事が一番らしい。",
};

const classChangeOptions = {
  ren: [
    { id: "storm", label: "迅雷将", className: "迅雷将・真", atk: 4, def: 0, move: 1, moveType: "rook", skill: "一直線ハートブレイク" },
    { id: "guard", label: "忠犬隊長", className: "忠犬隊長", atk: 2, def: 3, move: 0, moveType: "guard", skill: "まもるわん宣言" },
  ],
  yui: [
    { id: "mage", label: "気分屋魔導士", className: "気分屋魔導士", atk: 4, def: 1, move: 0, moveType: "bishop", skill: "気まぐれ星読み" },
    { id: "barrier", label: "猫結界師", className: "猫結界師", atk: 1, def: 4, move: 1, moveType: "bishop", skill: "寝返りバリア" },
  ],
  mio: [
    { id: "knight", label: "風切り騎士", className: "風切り騎士", atk: 3, def: 3, move: 1, moveType: "guard", skill: "風向き読んだる" },
    { id: "free", label: "自由翼将", className: "自由翼将", atk: 2, def: 1, move: 2, moveType: "rook", skill: "屋上から一直線" },
  ],
  honoka: [
    { id: "support", label: "虫笛応援兵", className: "虫笛応援兵", atk: 1, def: 3, move: 1, moveType: "support", skill: "ふるえ声エール" },
    { id: "brave", label: "小さな勇者", className: "小さな勇者", atk: 3, def: 2, move: 0, moveType: "guard", skill: "半歩だけ前へ" },
  ],
  kaeru: [
    { id: "odd", label: "奇跳研究者", className: "奇跳研究者", atk: 3, def: 1, move: 1, moveType: "knight", skill: "けろけろ二段跳び" },
    { id: "chaos", label: "変則桂姫", className: "変則桂姫", atk: 4, def: 0, move: 0, moveType: "knight", skill: "斜め上すぎる一手" },
  ],
  riko: [
    { id: "cute", label: "跳兎アイドル", className: "跳兎アイドル", atk: 2, def: 2, move: 1, moveType: "knight", skill: "かわいい二段跳び" },
    { id: "sweet", label: "甘兎騎士", className: "甘兎騎士", atk: 1, def: 4, move: 0, moveType: "knight", skill: "ぴょん守り" },
  ],
  ibuki: [
    { id: "flare", label: "炎香突撃兵", className: "炎香突撃兵", atk: 5, def: 0, move: 1, moveType: "lance", skill: "一直線ヒート" },
    { id: "captain", label: "猪突隊長", className: "猪突隊長", atk: 3, def: 2, move: 0, moveType: "lance", skill: "止まらない号令" },
  ],
  non: [
    { id: "cloud", label: "羊雲守り", className: "羊雲守り", atk: 1, def: 4, move: 0, moveType: "pawn", skill: "ふわふわ防壁" },
    { id: "nap", label: "昼寝応援兵", className: "昼寝応援兵", atk: 2, def: 2, move: 1, moveType: "support", skill: "のんびり回復" },
  ],
};

const storyChapters = [
  { minBond: 0, title: "第1章 放課後の盤上" },
  { minBond: 25, title: "第2章 好きなものの話" },
  { minBond: 55, title: "第3章 隣に立つ理由" },
  { minBond: 80, title: "最終章 推し駒覚醒前夜" },
];

const initialUnits = [
  {
    id: "honoka",
    team: "player",
    name: "歩太",
    piece: "歩",
    className: "応援兵",
    hp: 22,
    maxHp: 22,
    atk: 5,
    def: 2,
    move: 2,
    range: 1,
    mood: "ごきげん",
    bond: 46,
    path: "信頼",
    row: 5,
    col: 0,
    skill: "応援シャワー",
    moveType: "support",
    color: "#127c7c",
    art: "assets/characters/honoka-insect-pawn.png",
    quote: "勝ったら購買のプリン、半分こね。",
  },
  {
    id: "mio",
    team: "player",
    name: "美桜",
    piece: "銀",
    className: "護衛騎士",
    hp: 30,
    maxHp: 30,
    atk: 7,
    def: 4,
    move: 2,
    range: 1,
    mood: "集中",
    bond: 38,
    path: "策士",
    row: 5,
    col: 1,
    skill: "かばう宣言",
    moveType: "guard",
    color: "#348557",
    art: "assets/characters/mio-bird-silver.png",
    quote: "命令は聞く。でも無茶は却下。",
  },
  {
    id: "ren",
    team: "player",
    name: "蓮",
    piece: "飛",
    className: "迅雷将",
    hp: 24,
    maxHp: 24,
    atk: 8,
    def: 2,
    move: 3,
    range: 2,
    mood: "怒り",
    bond: 34,
    path: "混沌",
    row: 4,
    col: 0,
    skill: "直線番長",
    moveType: "rook",
    color: "#d94f45",
    art: "assets/characters/ren-dog-rook.png",
    quote: "盤面？ だいたい気合いで曲がる。",
  },
  {
    id: "yui",
    team: "player",
    name: "結衣",
    piece: "角",
    className: "結界師",
    hp: 21,
    maxHp: 21,
    atk: 7,
    def: 3,
    move: 2,
    range: 2,
    mood: "落ち込み",
    bond: 41,
    path: "信頼",
    row: 4,
    col: 1,
    skill: "斜めバリア",
    moveType: "bishop",
    color: "#7251a3",
    art: "assets/characters/yui-cat-bishop.png",
    quote: "斜めからなら、ちょっと強いです。",
  },
  {
    id: "kaeru",
    team: "player",
    name: "蛙瑠",
    piece: "桂",
    className: "変跳師",
    hp: 54,
    maxHp: 54,
    atk: 7,
    def: 2,
    move: 2,
    range: 1,
    mood: "ごきげん",
    bond: 0,
    path: "混沌",
    row: 5,
    col: 2,
    skill: "けろジャンプ",
    moveType: "knight",
    color: "#1f8f75",
    art: "assets/characters/kaeru-frog-knight.png",
    quote: "変な手ほど、私の足場になる。",
  },
  {
    id: "riko",
    team: "player",
    name: "莉胡",
    piece: "桂",
    className: "跳兎",
    hp: 52,
    maxHp: 52,
    atk: 6,
    def: 3,
    move: 2,
    range: 1,
    mood: "ごきげん",
    bond: 0,
    path: "恋愛",
    row: 5,
    col: 3,
    skill: "ぴょんステップ",
    moveType: "knight",
    color: "#df76a8",
    art: "assets/characters/riko-rabbit-knight.png",
    quote: "かわいいまま、ちゃんと勝つよ。",
  },
  {
    id: "ibuki",
    team: "player",
    name: "伊吹",
    piece: "香",
    className: "猪突香",
    hp: 62,
    maxHp: 62,
    atk: 9,
    def: 1,
    move: 3,
    range: 2,
    mood: "怒り",
    bond: 0,
    path: "混沌",
    row: 4,
    col: 2,
    skill: "一直線ヒート",
    moveType: "lance",
    color: "#c35a32",
    art: "assets/characters/ibuki-boar-lance.png",
    quote: "前なら任せろ。熱だけは負けない。",
  },
  {
    id: "non",
    team: "player",
    name: "乃音",
    piece: "歩",
    className: "羊雲歩",
    hp: 60,
    maxHp: 60,
    atk: 5,
    def: 5,
    move: 1,
    range: 1,
    mood: "集中",
    bond: 0,
    path: "信頼",
    row: 4,
    col: 3,
    skill: "ふわふわ前進",
    moveType: "pawn",
    color: "#7da8b7",
    art: "assets/characters/non-sheep-pawn.png",
    quote: "一歩ずつなら、遠くまで行けます。",
  },
  {
    id: "king",
    team: "enemy",
    name: "黒獅子王",
    piece: "王",
    className: "悪獅子総帥",
    hp: 34,
    maxHp: 34,
    atk: 8,
    def: 4,
    move: 1,
    range: 1,
    mood: "集中",
    bond: 0,
    path: "支配",
    row: 0,
    col: 4,
    skill: "校則ビーム",
    moveType: "king",
    color: "#20242a",
    art: "assets/characters/enemy-king-lion.png",
    quote: "額の黒金マークが、悪の組織の証。",
  },
  {
    id: "shade1",
    team: "enemy",
    name: "豹妬レイラ",
    piece: "嫉",
    className: "嫉豹アサシン",
    hp: 18,
    maxHp: 18,
    atk: 6,
    def: 2,
    move: 2,
    range: 1,
    mood: "怒り",
    bond: 0,
    path: "妨害",
    row: 2,
    col: 4,
    skill: "空気悪くする",
    moveType: "support",
    color: "#9a3e38",
    art: "assets/characters/enemy-jealous-leopard.png",
    quote: "その嫉妬、戦闘力に換算済み。",
  },
  {
    id: "shade2",
    team: "enemy",
    name: "銀狼シオン",
    piece: "銀",
    className: "銀狼ガード",
    hp: 22,
    maxHp: 22,
    atk: 6,
    def: 3,
    move: 2,
    range: 1,
    mood: "気まずい",
    bond: 0,
    path: "妨害",
    row: 1,
    col: 3,
    skill: "沈黙の圧",
    moveType: "guard",
    color: "#6f5f55",
    art: "assets/characters/enemy-silver-wolf.png",
    quote: "静かな遠吠えで盤面を冷やす。",
  },
  {
    id: "shade3",
    team: "enemy",
    name: "鹿角ノア",
    piece: "角",
    className: "鹿角魔導士",
    hp: 17,
    maxHp: 17,
    atk: 7,
    def: 1,
    move: 2,
    range: 2,
    mood: "集中",
    bond: 0,
    path: "妨害",
    row: 3,
    col: 3,
    skill: "宿題追加",
    moveType: "bishop",
    color: "#8b4f88",
    art: "assets/characters/enemy-bishop-deer.png",
    quote: "森の呪角で斜線を閉じる。",
  },
];

const state = {
  turn: 1,
  phase: "player",
  units: [],
  structures: [],
  buildPoints: 4,
  wallMaterials: 0,
  nextStructureId: 1,
  activePanel: "detail",
  selectedId: null,
  mode: "inspect",
  legalMoves: [],
  legalTargets: [],
  legalCombos: [],
  legalBuilds: [],
  buildDraft: null,
  actionMenuHidden: false,
  editorOpen: false,
  editorTool: "enemy",
  comboUsed: false,
  currentTalk: null,
  lastTalkResult: null,
  miniGame: null,
  animation: null,
  activeTrainingId: "ren",
  trainingTeamIds: [...defaultBattleTeamIds],
  trainingSetupOpen: false,
  trainingSetupIds: [...defaultBattleTeamIds],
  trainingPresetOverlayOpen: false,
  trainingTargetIds: ["ren"],
  trainingEvent: null,
  trainingRun: null,
  trainingMiniGame: null,
  trainingOverlayMode: "",
  trainingActionModalOpen: false,
  trainingResultModalOpen: false,
  trainingSetupScrollTop: 0,
  activeCareId: "ren",
  careMessage: "",
  battleTeamIds: [...defaultBattleTeamIds],
  battleTeamPresetId: "",
  battleTeamPreset: null,
  teamDraft: [...defaultBattleTeamIds],
  teamPresetDraft: {},
  battlePresetIds: {},
  storyChapter: 1,
  storyRoute: "common",
  postBattleRewards: [],
  battleActivityLog: [],
  battleTitles: [],
  battleStats: {},
  playerExpReward: "",
  result: null,
  log: [],
};

let miniGameTimer = null;
let trainingMiniRaf = null;
let trainingMiniInterval = null;
const trainingMiniKeys = new Set();

const boardEl = document.querySelector("#board");
const boardActionMenuEl = document.querySelector("#boardActionMenu");
const stageEditorPanelEl = document.querySelector("#stageEditorPanel");
const rosterEl = document.querySelector("#roster");
const unitDetailEl = document.querySelector("#unitDetail");
const actionBarEl = document.querySelector("#actionBar");
const talkBoxEl = document.querySelector("#talkBox");
const battleLogEl = document.querySelector("#battleLog");
const turnLabelEl = document.querySelector("#turnLabel");
const phaseLabelEl = document.querySelector("#phaseLabel");
const aliveCountEl = document.querySelector("#aliveCount");
const actionHintEl = document.querySelector("#actionHint");
const resultLabelEl = document.querySelector("#resultLabel");
const buildPointsLabelEl = document.querySelector("#buildPointsLabel");
const resultModalEl = document.querySelector("#resultModal");
const resultTitleEl = document.querySelector("#resultTitle");
const resultTextEl = document.querySelector("#resultText");
const titleScreenEl = document.querySelector("#titleScreen");
const introScreenEl = document.querySelector("#introScreen");
const modeScreenEl = document.querySelector("#modeScreen");
const teamScreenEl = document.querySelector("#teamScreen");
const trainingScreenEl = document.querySelector("#trainingScreen");
const careScreenEl = document.querySelector("#careScreen");
const rulesScreenEl = document.querySelector("#rulesScreen");
const gameScreenEl = document.querySelector("#gameScreen");
const introGridEl = document.querySelector("#introGrid");
const modeRosterSummaryEl = document.querySelector("#modeRosterSummary");
const teamGridEl = document.querySelector("#teamGrid");
const startBattleBtnEl = document.querySelector("#startBattleBtn");
const trainingSetupEl = document.querySelector("#trainingSetup");
const trainingPresetOverlayEl = document.querySelector("#trainingPresetOverlay");
const trainRosterEl = document.querySelector("#trainRoster");
const trainingGraphEl = document.querySelector("#trainingGraph");
const trainingRelationsEl = document.querySelector("#trainingRelations");
const trainingArtEl = document.querySelector("#trainingArt");
const trainingStageTeamEl = document.querySelector("#trainingStageTeam");
const trainingChapterEl = document.querySelector("#trainingChapter");
const trainingStatusEl = document.querySelector("#trainingStatus");
const trainingSpeakerEl = document.querySelector("#trainingSpeaker");
const trainingLineEl = document.querySelector("#trainingLine");
const trainingResultEl = document.querySelector("#trainingResult");
const trainingChoicesEl = document.querySelector("#trainingChoices");
const trainingStatsEl = document.querySelector("#trainingStats");
const trainingLogPanelEl = document.querySelector("#trainingLogPanel");
const trainingProfileEl = document.querySelector("#trainingProfile");
const careRosterEl = document.querySelector("#careRoster");
const careArtEl = document.querySelector("#careArt");
const careTitleEl = document.querySelector("#careTitle");
const careReactionEl = document.querySelector("#careReaction");
const careResultEl = document.querySelector("#careResult");
const careStatsEl = document.querySelector("#careStats");

document.querySelector("#startGameBtn").addEventListener("click", showModeMenu);
document.querySelector("#showRulesBtn").addEventListener("click", showRules);
document.querySelector("#showIntroBtn").addEventListener("click", showIntro);
document.querySelector("#introBackTitleBtn").addEventListener("click", showTitle);
document.querySelector("#closeRulesBtn").addEventListener("click", showTitle);
document.querySelector("#rulesStartBtn").addEventListener("click", showModeMenu);
document.querySelector("#openTrainingBtn").addEventListener("click", showTraining);
document.querySelector("#openBattleBtn").addEventListener("click", showTeamSelect);
document.querySelector("#openCareBtn").addEventListener("click", showCare);
document.querySelector("#modeBackTitleBtn").addEventListener("click", showTitle);
document.querySelector("#teamBackModeBtn").addEventListener("click", showModeMenu);
document.querySelector("#trainingBackModeBtn").addEventListener("click", requestLeaveTraining);
document.querySelector("#careBackModeBtn").addEventListener("click", showModeMenu);
startBattleBtnEl.addEventListener("click", startBattleFromTeam);
document.querySelector("#backTitleBtn").addEventListener("click", showTitle);
document.querySelector("#endTurnBtn").addEventListener("click", endPlayerTurn);
document.querySelector("#restartBtn").addEventListener("click", resetGame);
document.querySelector("#stageEditorBtn").addEventListener("click", toggleStageEditor);
document.addEventListener("keydown", handleTrainingMiniKeydown);
document.addEventListener("keyup", handleTrainingMiniKeyup);
window.addEventListener("beforeunload", handleBeforeUnload);
window.addEventListener("popstate", handleWindowBackAttempt);
if (window.history?.replaceState) {
  window.history.replaceState({ oshigoma: "active" }, "", window.location.href);
  window.history.pushState({ oshigoma: "guard" }, "", window.location.href);
}

function startGame() {
  hidePrimaryScreens();
  gameScreenEl.hidden = false;
  resetGame();
}

function showRules() {
  hidePrimaryScreens();
  rulesScreenEl.hidden = false;
}

function showTitle() {
  hidePrimaryScreens();
  titleScreenEl.hidden = false;
}

function showIntro() {
  hidePrimaryScreens();
  introScreenEl.hidden = false;
  renderIntro();
}

function showModeMenu() {
  hidePrimaryScreens();
  modeScreenEl.hidden = false;
  renderModeSummary();
}

function showTeamSelect() {
  hidePrimaryScreens();
  state.teamDraft = [...(state.battleTeamIds.length ? state.battleTeamIds : defaultBattleTeamIds)];
  const roster = loadSavedRoster();
  state.battleTeamPresetId = state.battleTeamPresetId || getActiveTeamPresetId(roster);
  state.teamPresetDraft = Object.fromEntries(
    playerBaseUnits().map((unit) => [unit.id, state.battlePresetIds[unit.id] || getActivePresetId(unit.id, roster)]),
  );
  teamScreenEl.hidden = false;
  renderTeamSelect();
}

function showTraining() {
  hidePrimaryScreens();
  trainingScreenEl.hidden = false;
  if (window.history?.pushState) window.history.pushState({ oshigoma: "training" }, "", window.location.href);
  state.trainingEvent = null;
  state.trainingOverlayMode = "";
  state.trainingPresetOverlayOpen = false;
  state.trainingActionModalOpen = false;
  state.trainingResultModalOpen = false;
  if (!state.trainingRun?.confirmed) {
    state.trainingSetupOpen = true;
    state.trainingSetupIds = normalizedTrainingTeamIds(state.activeTrainingId);
  }
  renderTraining();
}

function showCare() {
  hidePrimaryScreens();
  careScreenEl.hidden = false;
  if (!playerBaseUnits().some((unit) => unit.id === state.activeCareId)) state.activeCareId = playerBaseUnits()[0].id;
  renderCare();
}

function handleBeforeUnload(event) {
  if (!hasActiveTrainingInProgress()) return;
  autoSaveTrainingRun(state.trainingRun);
  event.preventDefault();
  event.returnValue = "育成中です。途中データは保存されていますが、この画面を離れますか？";
}

function handleWindowBackAttempt() {
  if (trainingScreenEl.hidden || !hasActiveTrainingInProgress()) {
    return;
  }
  if (window.history?.pushState) window.history.pushState({ oshigoma: "guard" }, "", window.location.href);
  autoSaveTrainingRun(state.trainingRun);
  state.trainingOverlayMode = "backConfirm";
  state.trainingPresetOverlayOpen = false;
  state.trainingActionModalOpen = false;
  state.trainingResultModalOpen = false;
  renderTraining();
}

function requestLeaveTraining() {
  if (!hasActiveTrainingInProgress()) {
    showModeMenu();
    return;
  }
  autoSaveTrainingRun(state.trainingRun);
  state.trainingOverlayMode = "backConfirm";
  state.trainingPresetOverlayOpen = false;
  state.trainingActionModalOpen = false;
  state.trainingResultModalOpen = false;
  renderTraining();
}

function hasActiveTrainingInProgress(run = state.trainingRun) {
  return Boolean(run?.confirmed && !run.completed && (run.turn ?? 0) >= 0 && run.teamIds?.length === MAX_BATTLE_TEAM);
}

function hidePrimaryScreens() {
  clearMiniGameTimer();
  clearTrainingMiniLoop();
  titleScreenEl.hidden = true;
  introScreenEl.hidden = true;
  modeScreenEl.hidden = true;
  teamScreenEl.hidden = true;
  trainingScreenEl.hidden = true;
  careScreenEl.hidden = true;
  rulesScreenEl.hidden = true;
  gameScreenEl.hidden = true;
  resultModalEl.hidden = true;
}

function startBattleFromTeam() {
  const roster = loadSavedRoster();
  const selectedTeamPreset = getTeamPresetList(roster).find((preset) => preset.id === state.battleTeamPresetId);
  if (selectedTeamPreset) {
    state.battleTeamPreset = selectedTeamPreset;
    state.battleTeamPresetId = selectedTeamPreset.id;
    state.battleTeamIds = selectedTeamPreset.members.map((member) => member.id).slice(0, MAX_BATTLE_TEAM);
    roster.activeTeamPreset = selectedTeamPreset.id;
    saveSavedRoster(roster);
  } else {
    if (!state.teamDraft.length) return;
    state.battleTeamPreset = null;
    state.battleTeamPresetId = "";
    state.battleTeamIds = [...state.teamDraft.slice(0, MAX_BATTLE_TEAM)];
    state.battlePresetIds = Object.fromEntries(state.battleTeamIds.map((id) => [id, state.teamPresetDraft[id] || ""]));
  }
  startGame();
}

function playerBaseUnits() {
  return initialUnits.filter((unit) => unit.team === "player");
}

function enemyBaseUnits() {
  return initialUnits.filter((unit) => unit.team === "enemy");
}

function trainableBaseUnits() {
  return [...playerBaseUnits(), ...enemyBaseUnits()];
}

function getBaseUnit(id) {
  return trainableBaseUnits().find((unit) => unit.id === id);
}

function loadSavedRoster() {
  try {
    const parsed = JSON.parse(window.localStorage.getItem(OSHIGOMA_SAVE_KEY) || "{}");
    return normalizeSavedRoster(parsed);
  } catch {
    return normalizeSavedRoster({});
  }
}

function saveSavedRoster(roster) {
  const normalized = normalizeSavedRoster(roster);
  window.localStorage.setItem(OSHIGOMA_SAVE_KEY, JSON.stringify(normalized));
  return normalized;
}

function autoSaveTrainingRun(run = state.trainingRun) {
  if (!run?.confirmed || !run.teamIds?.length) return;
  const roster = loadSavedRoster();
  roster._meta.currentTrainingRun = serializeTrainingRun(run);
  saveSavedRoster(roster);
}

function clearAutoSavedTrainingRun() {
  const roster = loadSavedRoster();
  if (!roster._meta.currentTrainingRun) return;
  delete roster._meta.currentTrainingRun;
  saveSavedRoster(roster);
}

function getAutoSavedTrainingRun(roster = loadSavedRoster()) {
  return normalizeTrainingRunForResume(roster._meta?.currentTrainingRun);
}

function serializeTrainingRun(run) {
  const teamIds = (run.teamIds ?? []).filter((id) => getBaseUnit(id)).slice(0, MAX_BATTLE_TEAM);
  return {
    id: String(run.id || makeTeamPresetId()),
    startedAt: numberOr(run.startedAt, Date.now()),
    confirmed: true,
    teamIds,
    focusId: teamIds.includes(run.focusId) ? run.focusId : teamIds[0],
    targetIds: (run.targetIds ?? []).filter((id) => teamIds.includes(id)),
    members: Object.fromEntries(teamIds.map((id) => [id, sanitizeProgress(id, run.members?.[id] ?? {})])),
    relations: run.relations && typeof run.relations === "object" && !Array.isArray(run.relations) ? { ...run.relations } : {},
    memoryLog: Array.isArray(run.memoryLog) ? run.memoryLog.map((item) => String(item).slice(0, 140)).slice(-40) : [],
    turn: clamp(Math.round(numberOr(run.turn, 0)), 0, MAX_TRAIN_TURNS),
    limit: clamp(Math.round(numberOr(run.limit, trainingTurnLimitForLevel())), BASE_TRAIN_TURNS, MAX_TRAIN_TURNS),
    completed: Boolean(run.completed),
    completionRewarded: Boolean(run.completionRewarded),
    saved: Boolean(run.saved),
    lastResult: run.lastResult ?? null,
  };
}

function normalizeTrainingRunForResume(raw) {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const teamIds = Array.isArray(raw.teamIds) ? raw.teamIds.filter((id) => getBaseUnit(id)).slice(0, MAX_BATTLE_TEAM) : [];
  if (teamIds.length !== MAX_BATTLE_TEAM) return null;
  const members = Object.fromEntries(teamIds.map((id) => [id, sanitizeProgress(id, raw.members?.[id] ?? {})]));
  const focusId = teamIds.includes(raw.focusId) ? raw.focusId : teamIds[0];
  return {
    id: String(raw.id || makeTeamPresetId()),
    startedAt: numberOr(raw.startedAt, Date.now()),
    confirmed: true,
    teamIds,
    focusId,
    targetIds: Array.isArray(raw.targetIds) ? raw.targetIds.filter((id) => teamIds.includes(id)) : [focusId],
    members,
    relations: raw.relations && typeof raw.relations === "object" && !Array.isArray(raw.relations) ? { ...raw.relations } : {},
    memoryLog: Array.isArray(raw.memoryLog) ? raw.memoryLog.map((item) => String(item).slice(0, 140)).slice(-40) : ["オート保存から育成を再開した。"],
    turn: clamp(Math.round(numberOr(raw.turn, 0)), 0, MAX_TRAIN_TURNS),
    limit: clamp(Math.round(numberOr(raw.limit, trainingTurnLimitForLevel())), BASE_TRAIN_TURNS, MAX_TRAIN_TURNS),
    completed: Boolean(raw.completed),
    completionRewarded: Boolean(raw.completionRewarded),
    saved: Boolean(raw.saved),
    lastResult: raw.lastResult ?? null,
    progress: members[focusId],
  };
}

function resumeAutoSavedTrainingRun() {
  const saved = getAutoSavedTrainingRun();
  if (!saved) return;
  state.trainingRun = saved;
  state.trainingTeamIds = [...saved.teamIds];
  state.activeTrainingId = saved.focusId;
  state.trainingTargetIds = [...(saved.targetIds?.length ? saved.targetIds : [saved.focusId])];
  state.trainingSetupOpen = false;
  state.trainingSetupIds = [...saved.teamIds];
  state.trainingEvent = null;
  state.trainingMiniGame = null;
  state.trainingOverlayMode = "";
  state.trainingPresetOverlayOpen = false;
  state.trainingActionModalOpen = false;
  state.trainingResultModalOpen = false;
  renderTraining();
}

function baseProgress(unit) {
  return {
    id: unit.id,
    level: 1,
    exp: 0,
    maxHp: Math.max(unit.maxHp, 52),
    atk: unit.atk,
    def: unit.def,
    move: unit.move,
    knowledge: 0,
    bond: 0,
    jealousy: 0,
    hunger: 80,
    mood: unit.mood,
    path: unit.path,
    trainingTurns: 0,
    careCount: 0,
    completed: false,
    trainingType: "未判定",
    title: "未完の一手",
    relations: {},
    memoryLog: [],
    lastMessage: "まだ育成は始まったばかり。",
  };
}

function normalizeSavedRoster(raw) {
  const roster = raw && typeof raw === "object" && !Array.isArray(raw) ? { ...raw } : {};
  const meta = roster._meta && typeof roster._meta === "object" && !Array.isArray(roster._meta) ? { ...roster._meta } : {};
  const carePoints = numberOr(meta.carePoints, STARTING_CARE_POINTS);
  const playerExp = clamp(Math.round(numberOr(meta.playerExp, 0)), 0, 999999);
  roster._meta = {
    ...meta,
    carePoints: clamp(Math.round(carePoints), 0, 99999),
    playerExp,
    playerLevel: playerLevelFromExp(playerExp),
    inventory: normalizeInventory(meta.inventory),
  };
  roster.presets = roster.presets && typeof roster.presets === "object" && !Array.isArray(roster.presets) ? { ...roster.presets } : {};
  roster.activePreset = roster.activePreset && typeof roster.activePreset === "object" && !Array.isArray(roster.activePreset) ? { ...roster.activePreset } : {};
  roster.teamPresets = Array.isArray(roster.teamPresets) ? roster.teamPresets : [];
  roster.activeTeamPreset = String(roster.activeTeamPreset || "");

  for (const unit of trainableBaseUnits()) {
    const legacy = isProgressLike(roster[unit.id]) ? roster[unit.id] : null;
    delete roster[unit.id];

    const rawList = Array.isArray(roster.presets[unit.id]) ? roster.presets[unit.id] : [];
    const migratedList =
      rawList.length || !legacy
        ? rawList
        : [
            {
              id: `legacy-${unit.id}`,
              name: "引き継ぎ",
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
              progress: legacy,
            },
          ];

    roster.presets[unit.id] = migratedList.slice(0, MAX_PRESETS_PER_UNIT).map((preset, index) => normalizePreset(unit.id, preset, index));
    const activeId = String(roster.activePreset[unit.id] || "");
    if (!roster.presets[unit.id].some((preset) => preset.id === activeId)) {
      roster.activePreset[unit.id] = roster.presets[unit.id][0]?.id || "";
    }
  }

  roster.teamPresets = roster.teamPresets
    .map((preset, index) => normalizeTeamPreset(preset, index))
    .filter(Boolean)
    .slice(0, MAX_TEAM_PRESETS);
  if (!roster.teamPresets.some((preset) => preset.id === roster.activeTeamPreset)) {
    roster.activeTeamPreset = roster.teamPresets[0]?.id || "";
  }

  return roster;
}

function normalizePreset(unitId, preset, index = 0) {
  const now = new Date().toISOString();
  const source = preset && typeof preset === "object" ? preset : {};
  const progress = source.progress && typeof source.progress === "object" ? source.progress : source;
  return {
    id: String(source.id || `preset-${unitId}-${index + 1}`),
    name: String(source.name || `育成データ${index + 1}`).slice(0, 24),
    createdAt: source.createdAt || now,
    updatedAt: source.updatedAt || now,
    progress: sanitizeProgress(unitId, progress),
  };
}

function normalizeTeamPreset(preset, index = 0) {
  const now = new Date().toISOString();
  const source = preset && typeof preset === "object" && !Array.isArray(preset) ? preset : null;
  if (!source) return null;
  const rawMembers = Array.isArray(source.members) ? source.members : [];
  const members = rawMembers
    .map((member) => {
      const id = String(member?.id || member?.progress?.id || "");
      const unit = getBaseUnit(id);
      if (!unit) return null;
      const progress = sanitizeProgress(id, member.progress ?? member);
      const typed = finalizeProgressIdentity(progress);
      return {
        id,
        name: unit.name,
        progress: typed,
        trainingType: typed.trainingType,
        title: typed.title,
        relation: member.relation || typed.relations || {},
      };
    })
    .filter(Boolean)
    .slice(0, MAX_BATTLE_TEAM);
  if (members.length !== MAX_BATTLE_TEAM) return null;
  const memoryLog = Array.isArray(source.memoryLog) ? source.memoryLog.map((item) => String(item).slice(0, 140)).slice(-40) : [];
  const battleLog = Array.isArray(source.battleLog) ? source.battleLog.map((item) => String(item).slice(0, 140)).slice(-40) : [];
  return {
    id: String(source.id || `team-${index + 1}`),
    name: String(source.name || `チーム${index + 1}`).trim().slice(0, 28) || `チーム${index + 1}`,
    createdAt: source.createdAt || now,
    updatedAt: source.updatedAt || now,
    turns: clamp(Math.round(numberOr(source.turns, BASE_TRAIN_TURNS)), 0, MAX_TRAIN_TURNS),
    teamType: String(source.teamType || determineTeamType(members.map((member) => member.progress))).slice(0, 24),
    title: String(source.title || determineTeamTitle(members.map((member) => member.progress))).slice(0, 28),
    members,
    relations: source.relations && typeof source.relations === "object" && !Array.isArray(source.relations) ? { ...source.relations } : {},
    memoryLog,
    battleLog,
  };
}

function normalizeInventory(raw) {
  const source = raw && typeof raw === "object" && !Array.isArray(raw) ? raw : {};
  return Object.fromEntries(Object.entries(source).map(([key, value]) => [key, clamp(Math.round(numberOr(value, 0)), 0, 99)]));
}

function latestTeamMemberProgress(unitId, roster = loadSavedRoster()) {
  const list = Array.isArray(roster.teamPresets) ? roster.teamPresets : [];
  const latest = [...list].reverse().find((preset) => preset.members?.some((member) => member.id === unitId));
  return latest?.members?.find((member) => member.id === unitId)?.progress ?? null;
}

function sanitizeProgress(id, progress = {}) {
  const unit = getBaseUnit(id);
  if (!unit) return null;
  const base = baseProgress(unit);
  const merged = { ...base, ...(progress || {}), id };
  const trainingTurns = clamp(Math.round(numberOr(merged.trainingTurns, 0)), 0, MAX_TRAIN_TURNS);
  const level = clamp(Math.round(numberOr(merged.level, Math.max(1, trainingTurns || 1))), 1, 99);
  const safeMemory = Array.isArray(merged.memoryLog) ? merged.memoryLog.map((item) => String(item).slice(0, 120)).slice(-24) : [];
  const safeRelations =
    merged.relations && typeof merged.relations === "object" && !Array.isArray(merged.relations) ? { ...merged.relations } : {};
  return {
    ...merged,
    id,
    level,
    exp: clamp(Math.round(numberOr(merged.exp, 0)), 0, 99),
    maxHp: clamp(Math.round(numberOr(merged.maxHp, base.maxHp)), 1, 999),
    atk: clamp(Math.round(numberOr(merged.atk, base.atk)), 1, 999),
    def: clamp(Math.round(numberOr(merged.def, base.def)), 0, 999),
    move: clamp(Math.round(numberOr(merged.move, base.move)), 1, 9),
    knowledge: clamp(Math.round(numberOr(merged.knowledge, 0)), 0, 999),
    bond: clamp(Math.round(numberOr(merged.bond, 0)), 0, 100),
    jealousy: clamp(Math.round(numberOr(merged.jealousy, 0)), 0, 100),
    hunger: clamp(Math.round(numberOr(merged.hunger, 80)), 0, 100),
    trainingTurns,
    careCount: clamp(Math.round(numberOr(merged.careCount, 0)), 0, 9999),
    completed: Boolean(merged.completed || trainingTurns >= MAX_TRAIN_TURNS),
    trainingType: trainingTypeLabels.includes(merged.trainingType) ? merged.trainingType : "未判定",
    title: String(merged.title || base.title).slice(0, 24),
    relations: safeRelations,
    memoryLog: safeMemory,
    lastMessage: merged.lastMessage || base.lastMessage,
  };
}

function getProgress(id, presetId = "") {
  const unit = getBaseUnit(id);
  if (!unit) return null;
  const roster = loadSavedRoster();
  const list = getPresetList(id, roster);
  const activeId = presetId || roster.activePreset[id] || list[0]?.id || "";
  const preset = list.find((candidate) => candidate.id === activeId) || list[0];
  const teamFallback = !preset ? latestTeamMemberProgress(id, roster) : null;
  return sanitizeProgress(id, preset?.progress ?? teamFallback ?? {});
}

function setProgress(progress, presetId = "") {
  if (!progress?.id) return null;
  const roster = loadSavedRoster();
  const list = getPresetList(progress.id, roster);
  let targetId = presetId || roster.activePreset[progress.id] || list[0]?.id || "";
  if (!targetId) {
    targetId = makePresetId(progress.id);
    list.push({
      id: targetId,
      name: "ふだんの推し駒",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      progress: sanitizeProgress(progress.id, progress),
    });
  }
  const index = Math.max(0, list.findIndex((preset) => preset.id === targetId));
  const previous = list[index] ?? list[0];
  list[index] = {
    ...previous,
    id: targetId,
    name: previous?.name || "ふだんの推し駒",
    updatedAt: new Date().toISOString(),
    progress: sanitizeProgress(progress.id, progress),
  };
  roster.presets[progress.id] = list.slice(0, MAX_PRESETS_PER_UNIT);
  roster.activePreset[progress.id] = targetId;
  saveSavedRoster(roster);
  return list[index].progress;
}

function getPresetList(unitId, roster = loadSavedRoster()) {
  return Array.isArray(roster.presets?.[unitId]) ? roster.presets[unitId] : [];
}

function getTeamPresetList(roster = loadSavedRoster()) {
  return Array.isArray(roster.teamPresets) ? roster.teamPresets : [];
}

function getActiveTeamPresetId(roster = loadSavedRoster()) {
  return roster.activeTeamPreset || getTeamPresetList(roster)[0]?.id || "";
}

function setActiveTeamPreset(presetId) {
  const roster = loadSavedRoster();
  if (!getTeamPresetList(roster).some((preset) => preset.id === presetId)) return;
  roster.activeTeamPreset = presetId;
  saveSavedRoster(roster);
}

function getActivePresetId(unitId, roster = loadSavedRoster()) {
  return roster.activePreset?.[unitId] || getPresetList(unitId, roster)[0]?.id || "";
}

function setActivePreset(unitId, presetId) {
  const roster = loadSavedRoster();
  if (!getPresetList(unitId, roster).some((preset) => preset.id === presetId)) return;
  roster.activePreset[unitId] = presetId;
  saveSavedRoster(roster);
}

function savePresetProgress(unitId, progress, name) {
  const roster = loadSavedRoster();
  const list = getPresetList(unitId, roster);
  if (list.length >= MAX_PRESETS_PER_UNIT) return { ok: false, message: "プリセットは5個まで。不要なデータを削除してね。" };
  const now = new Date().toISOString();
  const typedProgress = finalizeProgressIdentity(sanitizeProgress(unitId, progress));
  const preset = {
    id: makePresetId(unitId),
    name: String(name || `育成${list.length + 1}`).trim().slice(0, 24) || `育成${list.length + 1}`,
    createdAt: now,
    updatedAt: now,
    progress: typedProgress,
  };
  roster.presets[unitId] = [...list, preset];
  roster.activePreset[unitId] = preset.id;
  saveSavedRoster(roster);
  return { ok: true, preset };
}

function saveTeamPresetFromRun(run, name) {
  if (!run?.teamIds?.length) return { ok: false, message: "保存できるチーム育成データがない。" };
  const roster = loadSavedRoster();
  const list = getTeamPresetList(roster);
  if (list.length >= MAX_TEAM_PRESETS) return { ok: false, message: "チームプリセットは20個まで。不要なデータを削除してね。" };
  const now = new Date().toISOString();
  const members = run.teamIds
    .map((id) => {
      const unit = getBaseUnit(id);
      const progress = finalizeProgressIdentity(sanitizeProgress(id, run.members?.[id] ?? {}));
      return unit
        ? {
            id,
            name: unit.name,
            progress,
            trainingType: progress.trainingType,
            title: progress.title,
            relation: progress.relations ?? {},
          }
        : null;
    })
    .filter(Boolean);
  if (members.length !== MAX_BATTLE_TEAM) return { ok: false, message: "4人チームが揃っていない。" };
  const preset = normalizeTeamPreset(
    {
      id: makeTeamPresetId(),
      name: String(name || `チーム育成${list.length + 1}`).trim().slice(0, 28) || `チーム育成${list.length + 1}`,
      createdAt: now,
      updatedAt: now,
      turns: run.turn,
      members,
      relations: run.relations ?? {},
      memoryLog: run.memoryLog ?? [],
      battleLog: [],
      teamType: determineTeamType(members.map((member) => member.progress)),
      title: determineTeamTitle(members.map((member) => member.progress)),
    },
    list.length,
  );
  roster.teamPresets = [...list, preset].slice(0, MAX_TEAM_PRESETS);
  roster.activeTeamPreset = preset.id;
  saveSavedRoster(roster);
  return { ok: true, preset };
}

function renameTeamPreset(presetId, name) {
  const roster = loadSavedRoster();
  const preset = getTeamPresetList(roster).find((candidate) => candidate.id === presetId);
  if (!preset) return;
  preset.name = String(name || preset.name).trim().slice(0, 28) || preset.name;
  preset.updatedAt = new Date().toISOString();
  saveSavedRoster(roster);
}

function deleteTeamPreset(presetId) {
  const roster = loadSavedRoster();
  roster.teamPresets = getTeamPresetList(roster).filter((preset) => preset.id !== presetId);
  if (roster.activeTeamPreset === presetId) roster.activeTeamPreset = roster.teamPresets[0]?.id || "";
  saveSavedRoster(roster);
}

function renamePreset(unitId, presetId, name) {
  const roster = loadSavedRoster();
  const list = getPresetList(unitId, roster);
  const preset = list.find((candidate) => candidate.id === presetId);
  if (!preset) return;
  preset.name = String(name || preset.name).trim().slice(0, 24) || preset.name;
  preset.updatedAt = new Date().toISOString();
  saveSavedRoster(roster);
}

function deletePreset(unitId, presetId) {
  const roster = loadSavedRoster();
  const next = getPresetList(unitId, roster).filter((preset) => preset.id !== presetId);
  roster.presets[unitId] = next;
  if (roster.activePreset[unitId] === presetId) roster.activePreset[unitId] = next[0]?.id || "";
  saveSavedRoster(roster);
}

function getCarePoints() {
  return loadSavedRoster()._meta.carePoints;
}

function addCarePoints(amount) {
  const roster = loadSavedRoster();
  roster._meta.carePoints = clamp((roster._meta.carePoints ?? 0) + amount, 0, 99999);
  saveSavedRoster(roster);
  return roster._meta.carePoints;
}

function spendCarePoints(amount) {
  const roster = loadSavedRoster();
  if ((roster._meta.carePoints ?? 0) < amount) return false;
  roster._meta.carePoints -= amount;
  saveSavedRoster(roster);
  return true;
}

function addInventoryItem(itemId, amount = 1) {
  const roster = loadSavedRoster();
  roster._meta.inventory = normalizeInventory(roster._meta.inventory);
  roster._meta.inventory[itemId] = clamp((roster._meta.inventory[itemId] ?? 0) + amount, 0, 99);
  saveSavedRoster(roster);
  return roster._meta.inventory[itemId];
}

function getInventory(roster = loadSavedRoster()) {
  return normalizeInventory(roster._meta?.inventory);
}

function makePresetId(unitId) {
  return `preset-${unitId}-${Date.now().toString(36)}-${randomInt(100, 999)}`;
}

function makeTeamPresetId() {
  return `team-${Date.now().toString(36)}-${randomInt(100, 999)}`;
}

function isProgressLike(value) {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  return ["maxHp", "atk", "def", "bond", "level", "trainingTurns"].some((key) => key in value);
}

function numberOr(value, fallback) {
  const number = Number(value);
  return Number.isFinite(number) ? number : fallback;
}

function playerLevelFromExp(exp) {
  const total = Math.max(0, Math.floor(numberOr(exp, 0)));
  let level = 1;
  while (level < 99 && total >= playerExpForLevel(level + 1)) level += 1;
  return level;
}

function playerExpForLevel(level) {
  const safeLevel = Math.max(1, Math.floor(numberOr(level, 1)));
  if (safeLevel <= 1) return 0;
  const n = safeLevel - 1;
  return Math.floor(40 * n + 10 * n * (n - 1));
}

function playerLevelInfo(roster = loadSavedRoster()) {
  const exp = clamp(Math.round(numberOr(roster._meta?.playerExp, 0)), 0, 999999);
  const level = playerLevelFromExp(exp);
  const current = playerExpForLevel(level);
  const next = playerExpForLevel(level + 1);
  return { level, exp, current, next, progress: next > current ? exp - current : 0, need: Math.max(1, next - current) };
}

function addPlayerExp(amount, reason = "") {
  if (!amount) return "";
  const roster = loadSavedRoster();
  const before = playerLevelInfo(roster).level;
  roster._meta.playerExp = clamp(Math.round(numberOr(roster._meta.playerExp, 0) + amount), 0, 999999);
  roster._meta.playerLevel = playerLevelFromExp(roster._meta.playerExp);
  saveSavedRoster(roster);
  const after = roster._meta.playerLevel;
  return `プレイヤーEXP+${amount}${reason ? `（${reason}）` : ""}${after > before ? ` / Lv${after}に上がった！` : ""}`;
}

function trainingTurnLimitForLevel(level = playerLevelInfo().level) {
  if (level >= 20) return 35;
  if (level >= 10) return 30;
  if (level >= 5) return 25;
  return BASE_TRAIN_TURNS;
}

function currentTrainingTurnLimit() {
  return state.trainingRun?.limit ?? trainingTurnLimitForLevel();
}

function nextUnlockText(level = playerLevelInfo().level) {
  const next = playerLevelUnlocks.find((unlock) => unlock.level > level);
  return next ? `次の解放: Lv${next.level} ${next.label}` : "全解放済み";
}

function playerLevelSummaryText() {
  const info = playerLevelInfo();
  return `PLv${info.level} EXP ${info.progress}/${info.need} / ${nextUnlockText(info.level)}`;
}

function finalizeProgressIdentity(progress) {
  if (!progress?.id) return progress;
  const typed = { ...progress };
  typed.trainingType = determineTrainingType(typed);
  typed.title = determineTrainingTitle(typed);
  return typed;
}

function determineTrainingType(progress) {
  if ((progress.jealousy ?? 0) >= 70) return "激情型";
  if ((progress.bond ?? 0) >= 76) return "絆型";
  if ((progress.hunger ?? 80) >= 70 && (progress.mood === "ごきげん" || progress.mood === "集中")) return "安定型";
  const scores = [
    ["猛攻型", progress.atk ?? 0],
    ["守護型", progress.def ?? 0],
    ["策士型", progress.knowledge ?? 0],
  ].sort((a, b) => b[1] - a[1]);
  return scores[0]?.[0] ?? "猛攻型";
}

function determineTrainingTitle(progress) {
  const unit = getBaseUnit(progress.id);
  if ((progress.jealousy ?? 0) >= 88) return "暴走寸前の切り札";
  if ((progress.bond ?? 0) >= 86) return "心を預けた相棒";
  if ((progress.hunger ?? 80) >= 80 && progress.completed) return "安定の完走者";
  const type = determineTrainingType(progress);
  const table = {
    猛攻型: "突破者",
    守護型: "守り手",
    策士型: "盤面の読み手",
    絆型: "絆の中心",
    激情型: "危険な勝利者",
    安定型: "落ち着いた実力者",
  };
  return unit?.id === "yui" && type === "猛攻型" ? "気まぐれな勝利者" : table[type] ?? "育成完走者";
}

function determineTeamType(progressList) {
  const counts = progressList.reduce((acc, progress) => {
    const type = determineTrainingType(progress);
    acc[type] = (acc[type] ?? 0) + 1;
    return acc;
  }, {});
  const top = Object.entries(counts).sort((a, b) => b[1] - a[1])[0]?.[0] ?? "バランス型";
  if ((counts["絆型"] ?? 0) >= 2) return "絆連携チーム";
  if ((counts["激情型"] ?? 0) >= 2) return "激情爆発チーム";
  if ((counts["策士型"] ?? 0) >= 2) return "作戦ノートチーム";
  return `${top.replace("型", "")}チーム`;
}

function determineTeamTitle(progressList) {
  const avgBond = progressList.reduce((sum, progress) => sum + (progress.bond ?? 0), 0) / Math.max(1, progressList.length);
  const maxJealousy = Math.max(...progressList.map((progress) => progress.jealousy ?? 0));
  if (maxJealousy >= 85) return "火花を抱えた四人";
  if (avgBond >= 70) return "勝ち筋を信じ合う四人";
  return "放課後の出撃チーム";
}

function pushProgressMemory(progress, message) {
  if (!progress) return;
  progress.memoryLog = Array.isArray(progress.memoryLog) ? progress.memoryLog : [];
  progress.memoryLog.push(String(message).slice(0, 120));
  progress.memoryLog = progress.memoryLog.slice(-24);
}

function emotionGroup(mood) {
  if (["ごきげん", "集中", "恋愛中"].includes(mood)) return "好調系";
  if (["怒り", "嫉妬"].includes(mood)) return "不安定系";
  if (["落ち込み", "気まずい"].includes(mood)) return "不調系";
  if (mood === "呆れ") return "危険系";
  return "通常";
}

function moodTooltip(mood) {
  const effect = moodEffects[mood] ?? { note: "変化なし" };
  const guide = {
    "ごきげん": "行動が安定し、会話や育成で失敗しにくい。battleでは移動が伸びる。",
    "集中": "実戦・作戦で伸びやすい。battleでは攻撃と防御が少し上がる。",
    "恋愛中": "親密行動の伸びが大きい。battleでは攻撃と防御が上がる。",
    "怒り": "火力は上がるが守りが崩れやすい。",
    "嫉妬": "対抗心で攻撃が伸びるが、防御が下がる。",
    "落ち込み": "行動の伸びが鈍くなり、移動も下がる。",
    "気まずい": "連携が悪くなり、攻防が下がる。",
    "呆れ": "危険状態。放置すると退却や育成失敗に近づく。",
  }[mood] ?? "現在の気分。効果は状況によって変わる。";
  return `${mood}（${emotionGroup(mood)}）: ${effect.note}。${guide}`;
}

function renderModeSummary() {
  const roster = loadSavedRoster();
  const teamPresets = getTeamPresetList(roster);
  const playerPanel = `
    <button class="summary-card player-level-card" type="button" data-summary-team-presets>
      <span>プレイヤー</span>
      <strong>Lv${roster._meta.playerLevel}</strong>
      <small>EXP ${playerLevelInfo(roster).progress}/${playerLevelInfo(roster).need} / 育成上限${trainingTurnLimitForLevel(roster._meta.playerLevel)}T / チーム${teamPresets.length}/${MAX_TEAM_PRESETS}</small>
    </button>
  `;
  const teamPanel = teamPresets.slice(0, 3)
    .map((preset) => `
      <button class="summary-card" type="button" data-summary-team-preset="${preset.id}">
        <span>${escapeHtml(preset.name)}</span>
        <strong>${escapeHtml(preset.teamType)}</strong>
        <small>${preset.members.map((member) => `${member.name}:${member.trainingType}`).join(" / ")}</small>
      </button>
    `)
    .join("");
  const unitPanel = playerBaseUnits()
    .map((unit) => {
      const presets = getPresetList(unit.id);
      const progress = getProgress(unit.id);
      return `
        <button class="summary-card" type="button" data-summary-id="${unit.id}">
          <img src="${unit.art}" alt="${unit.name}">
          <span>${unit.name}</span>
          <strong>${presets.length}/${MAX_PRESETS_PER_UNIT}</strong>
          <small>育成T${progress.trainingTurns} / HP${progress.maxHp} / 知${progress.knowledge}</small>
        </button>
      `;
    })
    .join("");
  modeRosterSummaryEl.innerHTML = playerPanel + teamPanel + unitPanel;
  modeRosterSummaryEl.querySelectorAll("[data-summary-id]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTrainingId = button.dataset.summaryId;
      showTraining();
    });
  });
  modeRosterSummaryEl.querySelectorAll("[data-summary-team-preset], [data-summary-team-presets]").forEach((button) => {
    button.addEventListener("click", showTeamSelect);
  });
}

function renderIntro() {
  introGridEl.innerHTML = playerBaseUnits()
    .map((unit) => {
      const profile = playerProfiles[unit.id];
      const presets = getPresetList(unit.id);
      const progress = getProgress(unit.id);
      return `
        <article class="intro-card">
          <img src="${unit.art}" alt="${unit.name}">
          <div>
            <span class="tag">${unit.piece} / ${profile.animal}</span>
            <h3>${unit.name}</h3>
            <strong>${unit.className} / ${profile.personality}</strong>
            <p>${profile.talkStyle}</p>
            <small>プリセット${presets.length}/${MAX_PRESETS_PER_UNIT} / 親密度${progress.bond} / 知識${progress.knowledge} / ${unit.skill}</small>
          </div>
        </article>
      `;
    })
    .join("");
}

function renderTeamSelect() {
  const teamPresets = getTeamPresetList();
  const presetCards = teamPresets.length
    ? teamPresets
        .map((preset) => {
          const selected = state.battleTeamPresetId === preset.id;
          const mainStats = preset.members
            .map((member) => `${member.name} ${member.trainingType}「${member.title}」 HP${member.progress.maxHp} 攻${member.progress.atk} 防${member.progress.def} 知${member.progress.knowledge}`)
            .join(" / ");
          return `
            <article class="team-card team-preset-card ${selected ? "selected" : ""}" data-team-preset-id="${preset.id}" role="button" tabindex="0">
              <span class="team-state">${selected ? "出撃チーム" : "保存チーム"}</span>
              <h3>${escapeHtml(preset.name)}</h3>
              <p>${escapeHtml(preset.teamType)} / ${escapeHtml(preset.title)}</p>
              <small>${mainStats}</small>
            </article>
          `;
        })
        .join("")
    : `<article class="team-card team-preset-card"><h3>チームプリセットなし</h3><p>育成完了後に4人チームとして保存すると、ここから出撃できる。</p></article>`;
  const manualCards = playerBaseUnits()
    .map((unit) => {
      const presets = getPresetList(unit.id);
      const selectedPresetId = state.teamPresetDraft[unit.id] || getActivePresetId(unit.id);
      const progress = getProgress(unit.id, selectedPresetId);
      const selected = state.teamDraft.includes(unit.id);
      const options = presets.length
        ? presets
            .map((preset) => `<option value="${escapeHtml(preset.id)}" ${preset.id === selectedPresetId ? "selected" : ""}>${escapeHtml(preset.name)}</option>`)
            .join("")
        : `<option value="">基礎ステータス</option>`;
      return `
        <article class="team-card ${selected ? "selected" : ""}" data-team-id="${unit.id}" role="button" tabindex="0">
          <img src="${unit.art}" alt="${unit.name}">
          <span class="team-state">${selected ? "出撃" : "待機"}</span>
          <h3>${unit.name}</h3>
          <p>${unit.piece} / ${unit.className}</p>
          <label class="preset-picker">
            <small>プリセット</small>
            <select data-preset-unit="${unit.id}">${options}</select>
          </label>
          <small>${progress.trainingType}「${progress.title}」 / 育成T${progress.trainingTurns} HP${progress.maxHp} 攻${progress.atk} 防${progress.def} 知${progress.knowledge} 移${progress.move}</small>
        </article>
      `;
    })
    .join("");
  teamGridEl.innerHTML = `
    <div class="team-preset-section">
      <div class="section-title"><span>保存済みチームプリセット</span><small>${teamPresets.length}/${MAX_TEAM_PRESETS}</small></div>
      <div class="team-grid compact-team-grid">${presetCards}</div>
    </div>
    <div class="team-preset-section">
      <div class="section-title"><span>個別プリセットから手動編成</span><small>互換用</small></div>
      <div class="team-grid compact-team-grid">${manualCards}</div>
    </div>
  `;
  const selectedTeamPreset = teamPresets.find((preset) => preset.id === state.battleTeamPresetId);
  startBattleBtnEl.textContent = selectedTeamPreset ? `${selectedTeamPreset.name}でbattle` : `このチームでbattle (${state.teamDraft.length}/${MAX_BATTLE_TEAM})`;
  startBattleBtnEl.disabled = selectedTeamPreset ? false : state.teamDraft.length === 0;
  teamGridEl.querySelectorAll("[data-team-preset-id]").forEach((card) => {
    card.addEventListener("click", () => {
      state.battleTeamPresetId = card.dataset.teamPresetId;
      setActiveTeamPreset(state.battleTeamPresetId);
      renderTeamSelect();
    });
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        state.battleTeamPresetId = card.dataset.teamPresetId;
        setActiveTeamPreset(state.battleTeamPresetId);
        renderTeamSelect();
      }
    });
  });
  teamGridEl.querySelectorAll("[data-team-id]").forEach((card) => {
    card.addEventListener("click", () => toggleTeamDraft(card.dataset.teamId));
    card.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        toggleTeamDraft(card.dataset.teamId);
      }
    });
  });
  teamGridEl.querySelectorAll("[data-preset-unit]").forEach((select) => {
    select.addEventListener("click", (event) => event.stopPropagation());
    select.addEventListener("keydown", (event) => event.stopPropagation());
    select.addEventListener("change", (event) => {
      event.stopPropagation();
      const unitId = select.dataset.presetUnit;
      state.battleTeamPresetId = "";
      state.teamPresetDraft[unitId] = select.value;
      if (select.value) setActivePreset(unitId, select.value);
      renderTeamSelect();
    });
  });
}

function toggleTeamDraft(id) {
  state.battleTeamPresetId = "";
  if (state.teamDraft.includes(id)) {
    state.teamDraft = state.teamDraft.filter((candidate) => candidate !== id);
  } else if (state.teamDraft.length < MAX_BATTLE_TEAM) {
    state.teamDraft.push(id);
    state.teamPresetDraft[id] = state.teamPresetDraft[id] || getActivePresetId(id);
  }
  renderTeamSelect();
}

function renderTraining() {
  if (state.trainingSetupOpen) {
    renderTrainingSetup();
    return;
  }
  trainingSetupEl.hidden = true;
  trainingScreenEl.classList.remove("setup-open");
  if (!getBaseUnit(state.activeTrainingId) || !canTrainUnit(state.activeTrainingId)) {
    state.activeTrainingId = firstTrainableUnitId();
  }
  const run = ensureTrainingRun(state.activeTrainingId);
  if (run.confirmed) autoSaveTrainingRun(run);
  renderTrainingTeamRoster(run);
  renderTrainingGraph(run);
  renderTrainingRelations(run);
  const unit = getBaseUnit(state.activeTrainingId);
  const progress = getTrainingMemberProgress(unit.id);
  const turnLimit = run.limit ?? currentTrainingTurnLimit();
  trainingArtEl.src = unit.art;
  trainingArtEl.alt = unit.name;
  renderTrainingStage(run);
  trainingChapterEl.textContent = run.completed ? "チーム育成完了" : `チーム育成 ${run.turn}/${turnLimit}ターン`;
  trainingStatusEl.textContent = `4人チーム育成 / チーム保存 ${getTeamPresetList().length}/${MAX_TEAM_PRESETS} / ${playerLevelSummaryText()}`;
  const askingAction = !state.trainingMiniGame && !state.trainingEvent && !run.completed;
  trainingSpeakerEl.textContent = trainingSpeakerLabel(unit, run, askingAction);
  trainingLineEl.textContent = trainingSystemLine(unit, progress, run);
  trainingResultEl.innerHTML = "";
  trainingStatsEl.innerHTML = trainingProfilePanelHtml(unit, progress);
  trainingLogPanelEl.innerHTML = trainingLogPanelHtml(run);
  renderTrainingPresetOverlay(run);
  trainingChoicesEl.innerHTML = trainingFooterButtonsHtml(run);
  attachTrainingChoiceHandlers(trainingChoicesEl);
  attachTrainingChoiceHandlers(trainingPresetOverlayEl);
  attachTrainingMiniControls();
  attachTrainingPresetHandlers(unit, progress, run);
  renderTrainingProfile(unit, progress, run);
}

function renderTrainingSetup() {
  trainingScreenEl.classList.add("setup-open");
  trainingSetupEl.hidden = false;
  const selected = state.trainingSetupIds.slice(0, MAX_BATTLE_TEAM);
  const selectedNames = selected.map((id) => getBaseUnit(id)?.name).filter(Boolean).join("、") || "未選択";
  const turnLimit = trainingTurnLimitForLevel();
  const autoSaved = getAutoSavedTrainingRun();
  trainingSetupEl.innerHTML = `
    <div class="menu-head">
      <div>
        <p class="eyebrow">Team Training</p>
        <h2>育成する4キャラを選ぶ</h2>
        <p>選んだ4人だけで${turnLimit}ターン育成を始める。あとからこのチームをプリセット保存できる。</p>
      </div>
      <span class="setup-count">${selected.length}/4</span>
    </div>
    <div class="setup-team-grid" data-setup-grid>
      ${trainableBaseUnits()
        .map((unit) => {
          const unlocked = canTrainUnit(unit.id);
          const active = selected.includes(unit.id);
          const disabled = !unlocked || (!active && selected.length >= MAX_BATTLE_TEAM);
          const progress = getProgress(unit.id);
          return `
            <button class="setup-character-card ${active ? "selected" : ""}" type="button" data-setup-id="${unit.id}" ${disabled ? "disabled" : ""}>
              <img src="${unit.art}" alt="${unit.name}">
              <strong>${unit.name} ${active ? "✓" : ""}</strong>
              <small>${unlocked ? `${unit.piece} / ${playerProfiles[unit.id].personality} / 親密${progress.bond}` : enemyUnlockText(unit.id)}</small>
            </button>
          `;
        })
        .join("")}
    </div>
    <div class="setup-actions">
      <strong>このキャラたちでチームを組みますか？ ${escapeHtml(selectedNames)}</strong>
      ${autoSaved ? `<button class="plain-btn" type="button" data-setup-resume>続きから育てる ${autoSaved.turn}/${autoSaved.limit}</button>` : ""}
      <button class="plain-btn" type="button" data-setup-cancel>モード選択へ</button>
      <button class="primary-btn big-btn" type="button" data-setup-confirm ${selected.length === MAX_BATTLE_TEAM ? "" : "disabled"}>この4人で育成開始</button>
    </div>
  `;
  const grid = trainingSetupEl.querySelector("[data-setup-grid]");
  if (grid) grid.scrollTop = state.trainingSetupScrollTop || 0;
  trainingSetupEl.querySelectorAll("[data-setup-id]").forEach((button) => {
    button.addEventListener("click", () => toggleTrainingSetupMember(button.dataset.setupId));
  });
  trainingSetupEl.querySelector("[data-setup-confirm]")?.addEventListener("click", confirmTrainingSetup);
  trainingSetupEl.querySelector("[data-setup-cancel]")?.addEventListener("click", showModeMenu);
  trainingSetupEl.querySelector("[data-setup-resume]")?.addEventListener("click", resumeAutoSavedTrainingRun);
}

function toggleTrainingSetupMember(unitId) {
  if (!canTrainUnit(unitId)) return;
  state.trainingSetupScrollTop = trainingSetupEl.querySelector("[data-setup-grid]")?.scrollTop ?? state.trainingSetupScrollTop;
  const selected = new Set(state.trainingSetupIds);
  if (selected.has(unitId)) {
    selected.delete(unitId);
  } else if (selected.size < MAX_BATTLE_TEAM) {
    selected.add(unitId);
  }
  state.trainingSetupIds = [...selected].slice(0, MAX_BATTLE_TEAM);
  renderTrainingSetup();
}

function confirmTrainingSetup() {
  const teamIds = state.trainingSetupIds.filter((id) => canTrainUnit(id)).slice(0, MAX_BATTLE_TEAM);
  if (teamIds.length !== MAX_BATTLE_TEAM) return;
  state.trainingRun = createTrainingRun(teamIds);
  state.trainingRun.confirmed = true;
  state.trainingTeamIds = [...teamIds];
  state.activeTrainingId = teamIds[0];
  state.trainingTargetIds = [teamIds[0]];
  state.trainingSetupOpen = false;
  state.trainingEvent = null;
  state.trainingMiniGame = null;
  state.trainingActionModalOpen = false;
  state.trainingResultModalOpen = false;
  renderTraining();
}

function trainingSpeakerLabel(unit, run, askingAction) {
  if (askingAction) return "SYSTEM";
  if (state.trainingMiniGame) return "実戦トレーニング";
  if (state.trainingEvent?.speaker) return state.trainingEvent.speaker;
  if (state.trainingEvent?.freeEvent && state.trainingEvent.actorIds?.length) {
    return state.trainingEvent.actorIds.map((id) => getBaseUnit(id)?.name).filter(Boolean).join(" × ");
  }
  return `${unit.name} / ${playerProfiles[unit.id].personality}`;
}

function trainingSystemLine(unit, progress, run = ensureTrainingRun()) {
  if (state.trainingMiniGame) return state.trainingMiniGame.line;
  const event = state.trainingEvent;
  if (!event) return trainingOpeningLine(unit, progress, run);
  if (event.targetPicker) return event.line;
  if (event.freeEvent) return "キャラ同士の会話が動き出した。どう関わるか選ぼう。行動ターンは消費しない。";
  if (event.postTalk) return "返事を受け止めたあとの表情を見て、次の行動へ進もう。";
  if (event.conversation) return "会話中。相手の言葉にどう返すかで、気持ちの深さが変わる。";
  return `${event.label ?? "育成"}を進める。選んだ子の成長と、選ばれなかった子の気持ちが動く。`;
}

function trainingRosterWhisperLine(run, unitId, target) {
  const unit = getBaseUnit(unitId);
  const progress = getTrainingMemberProgress(unitId);
  if (state.trainingEvent?.actorIds?.includes(unitId)) return "いま会話中。返事を待っている。";
  if (state.activeTrainingId === unitId) return `${unit.name}「今日はどうする？」`;
  if (target) return `${unit.name}「呼ばれた。ちゃんと見てて」`;
  if ((progress.jealousy ?? 0) >= 70) return `${unit.name}「あの子ばっかり……」`;
  if (progress.mood === "落ち込み") return `${unit.name}「今日は私じゃないんだ」`;
  if (characterNeedsApproach(unitId) && (progress.bond ?? 0) < 35) return `${unit.name}は目だけ合わせて黙っている。`;
  const partnerId = bestRosterChatPartner(run, unitId);
  const partner = getBaseUnit(partnerId);
  if (partner) return rosterPairLine(unit, partner);
  return `${unit.name}は周りの会話を聞いている。`;
}

function bestRosterChatPartner(run, unitId) {
  return run.teamIds
    .filter((id) => id !== unitId)
    .map((id) => {
      const relation = run.relations?.[relationKey(unitId, id)] ?? inferredRelation(unitId, id);
      const score = (relation.score ?? 0) + (relationshipSettings[unitId]?.likes?.includes(id) ? 4 : 0) - (relationshipSettings[unitId]?.dislikes?.includes(id) ? 4 : 0);
      return { id, score };
    })
    .sort((a, b) => b.score - a.score)[0]?.id;
}

function rosterPairLine(unit, partner) {
  const relation = inferredRelation(unit.id, partner.id);
  if (relation.score < 0) return `${unit.name}「${partner.name}とは少し距離ほしい」`;
  if (relationshipSettings[unit.id]?.rival === partner.id || relationshipSettings[partner.id]?.rival === unit.id) {
    return `${unit.name}「${partner.name}には負けたくない」`;
  }
  if (relation.score > 0) return `${unit.name}「${partner.name}となら動ける」`;
  return `${unit.name}「${partner.name}、次どうする？」`;
}

function renderTrainingTeamRoster(run) {
  trainRosterEl.innerHTML = run.teamIds
    .map((unitId) => {
      const unit = getBaseUnit(unitId);
      const progress = getTrainingMemberProgress(unit.id);
      const target = (state.trainingEvent?.targetIds ?? run.targetIds ?? []).includes(unit.id);
      const whisper = trainingRosterWhisperLine(run, unit.id, target);
      return `
        <button class="growth-unit ${state.activeTrainingId === unit.id ? "selected" : ""} team-member" type="button" data-training-roster-id="${unit.id}">
          <img src="${unit.art}" alt="${unit.name}">
          <span>${unit.name}</span>
          <small>${escapeHtml(whisper)}</small>
        </button>
      `;
    })
    .join("");
  trainRosterEl.querySelectorAll("[data-training-roster-id]").forEach((button) => {
    button.addEventListener("click", () => {
      const id = button.dataset.trainingRosterId;
      if (!run.teamIds.includes(id)) return;
      state.activeTrainingId = id;
      state.trainingEvent = null;
      state.trainingMiniGame = null;
      state.trainingActionModalOpen = false;
      state.trainingResultModalOpen = false;
      clearTrainingMiniLoop();
      renderTraining();
    });
  });
}

function renderTrainingGraph(run) {
  const rows = run.teamIds
    .map((id) => {
      const unit = getBaseUnit(id);
      const progress = getTrainingMemberProgress(id);
      return `
        <div class="graph-row">
          <strong>${unit.name}</strong>
          <div class="graph-bars">
            ${graphBarHtml("攻", progress.atk, 40, graphDeltaFor(run, id, "atk"))}
            ${graphBarHtml("防", progress.def, 30, graphDeltaFor(run, id, "def"))}
            ${graphBarHtml("親", progress.bond, 100, graphDeltaFor(run, id, "bond"))}
            ${graphBarHtml("嫉", progress.jealousy ?? 0, 100, graphDeltaFor(run, id, "jealousy"))}
          </div>
        </div>
      `;
    })
    .join("");
  trainingGraphEl.innerHTML = `<h3>キャラグラフ</h3>${rows}`;
}

function graphDeltaFor(run, unitId, key) {
  return run?.lastResult?.rows?.find((row) => row.id === unitId)?.deltas?.find((delta) => delta.key === key)?.value ?? 0;
}

function graphBarHtml(label, value, maxValue, delta = 0) {
  const current = percent(value, maxValue);
  const previous = percent(value - delta, maxValue);
  const baseWidth = delta > 0 ? previous : current;
  const deltaLeft = delta > 0 ? previous : current;
  const deltaWidth = Math.max(0, Math.min(100 - deltaLeft, Math.round((Math.abs(delta) / maxValue) * 100)));
  const deltaText = delta ? `<small class="${delta > 0 ? "up" : "down"}">${delta > 0 ? "+" : ""}${delta}</small>` : "";
  const deltaBar = delta ? `<i class="${delta > 0 ? "up" : "down"}" style="left:${deltaLeft}%;width:${deltaWidth}%"></i>` : "";
  return `
    <span class="graph-bar ${delta > 0 ? "delta-up" : delta < 0 ? "delta-down" : ""}">
      <span class="graph-meter">
        <b style="width:${baseWidth}%"></b>
        ${deltaBar}
      </span>
      <em>${label}${value}${deltaText}</em>
    </span>
  `;
}

function trainingResultHtml(run, progress) {
  const result = run?.lastResult;
  if (!result?.rows?.length) return escapeHtml(progress.lastMessage ?? "会話と行動で成長が変わる。");
  const rows = result.rows
    .map((row) => {
      const deltas = row.deltas
        .filter((delta) => delta.value !== 0)
        .map(
          (delta) =>
            `<span class="result-delta ${delta.value > 0 ? "up" : "down"}">${delta.label} ${delta.value > 0 ? "+" : ""}${delta.value}</span>`,
        )
        .join("");
      return deltas ? `<span class="result-row"><b>${escapeHtml(row.name)}</b>${deltas}</span>` : "";
    })
    .filter(Boolean)
    .join("");
  return rows ? `<span class="result-summary">${escapeHtml(result.label)}</span>${rows}` : escapeHtml(result.message ?? progress.lastMessage ?? "");
}

function renderTrainingRelations(run) {
  const slots = ["top", "right", "bottom", "left"];
  const nodes = run.teamIds
    .map((id, index) => {
      const unit = getBaseUnit(id);
      const progress = getTrainingMemberProgress(id);
      return `
        <button class="relation-node ${slots[index]} ${state.activeTrainingId === id ? "active" : ""}" type="button" data-relation-focus="${id}">
          <img src="${unit.art}" alt="${unit.name}">
          <span>${unit.name}</span>
          <small>${moodIcon(progress.mood)} 親${progress.bond}</small>
        </button>
      `;
    })
    .join("");
  const arrows = run.teamIds
    .map((id, index) => {
      const rel = playerRelationLabel(run, id);
      return `<span class="relation-arrow ${slots[index]}">${relationArrowLabel(slots[index], rel)}</span>`;
    })
    .join("");
  const pairArrows = relationPairArrowsHtml(run, slots);
  trainingRelationsEl.innerHTML = `
    <h3>相関図</h3>
    <div class="relation-map">
      <div class="relation-player">あなた</div>
      ${nodes}
      ${arrows}
    </div>
    ${pairArrows}
  `;
  trainingRelationsEl.querySelectorAll("[data-relation-focus]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activeTrainingId = button.dataset.relationFocus;
      state.trainingEvent = null;
      state.trainingMiniGame = null;
      state.trainingActionModalOpen = false;
      state.trainingResultModalOpen = false;
      renderTraining();
    });
  });
}

function inferredRelation(aId, bId) {
  const a = relationshipSettings[aId] ?? {};
  const b = relationshipSettings[bId] ?? {};
  if (a.rival === bId || b.rival === aId) return { score: 0, label: "ライバル候補" };
  if (a.likes?.includes(bId) || b.likes?.includes(aId)) return { score: 1, label: "相性良好" };
  if (a.dislikes?.includes(bId) || b.dislikes?.includes(aId)) return { score: -1, label: "苦手" };
  return { score: 0, label: "未形成" };
}

function playerRelationLabel(run, unitId) {
  const progress = getTrainingMemberProgress(unitId);
  if ((progress.jealousy ?? 0) >= 70) return "嫉妬";
  if ((progress.bond ?? 0) >= 70) return "大好き";
  if ((progress.bond ?? 0) >= 35) return "信頼";
  return "様子見";
}

function relationArrowLabel(slot, rel) {
  const arrow = { top: "↑", right: "→", bottom: "↓", left: "←" }[slot] ?? "→";
  return `<b>${arrow}</b><em>${rel}</em>`;
}

function relationPairArrowsHtml(run, slots) {
  const pairs = [
    [0, 1, "↔"],
    [1, 2, "↔"],
    [2, 3, "↔"],
    [3, 0, "↔"],
    [0, 2, "↕"],
    [1, 3, "↔"],
  ];
  const chips = pairs
    .map(([aIndex, bIndex, arrow]) => {
      const aId = run.teamIds[aIndex];
      const bId = run.teamIds[bIndex];
      if (!aId || !bId) return "";
      const key = relationKey(aId, bId);
      const relation = run.relations?.[key] ?? inferredRelation(aId, bId);
      const tone = (relation.score ?? 0) < 0 ? "bad" : (relation.score ?? 0) > 0 ? "good" : "neutral";
      const a = getBaseUnit(aId);
      const b = getBaseUnit(bId);
      return `<span class="relation-pair-chip ${tone}" title="${escapeHtml(relation.label ?? "未形成")}"><b>${a?.name ?? ""}${arrow}${b?.name ?? ""}</b><em>${escapeHtml(relation.label ?? "未形成")}</em></span>`;
    })
    .join("");
  return `<div class="relation-pair-list">${chips}</div>`;
}

function renderTrainingStage(run) {
  const targets = state.trainingEvent?.targetIds ?? run.targetIds ?? [];
  trainingStageTeamEl.innerHTML = run.teamIds
    .map((id) => {
      const unit = getBaseUnit(id);
      const progress = getTrainingMemberProgress(id);
      const speech = state.activeTrainingId === id ? trainingStageSpeechLine(unit, progress, run) : "";
      return `
        <div class="stage-character ${state.activeTrainingId === id ? "focus" : ""} ${targets.includes(id) ? "target" : ""}">
          <img src="${unit.art}" alt="${unit.name}">
          <span class="stage-mood" title="${escapeHtml(moodTooltip(progress.mood))}"><b>${moodIcon(progress.mood)}</b><em>${progress.mood}</em></span>
          ${speech ? `<div class="stage-speech">${escapeHtml(speech)}</div>` : ""}
          ${speech ? "" : `<span class="stage-name">${unit.name}</span>`}
        </div>
      `;
    })
    .join("");
}

function trainingStageSpeechLine(unit, progress, run = ensureTrainingRun()) {
  if (state.trainingMiniGame) return "";
  const event = state.trainingEvent;
  if (event?.conversation || event?.postTalk) return event.line ?? "";
  if (event?.freeEvent) return event.line ?? "";
  if (event && !event.targetPicker) return event.line ?? "";
  if (run.completed) return `${unit.name}は完走したチームを少し誇らしそうに見ている。`;
  if (event?.targetPicker && event.targetIds?.includes(unit.id)) return `${unit.name}「呼ばれた。今日は私を見てて」`;
  if (event?.targetPicker) return `${unit.name}は横目でこちらの選択を待っている。`;
  if ((progress.jealousy ?? 0) >= 70) return `${unit.name}「……今日は、私の番じゃないの？」`;
  if (progress.mood === "ごきげん") return `${unit.name}「今日はいい感じ。もう少しだけ頑張れる」`;
  if (progress.mood === "落ち込み") return `${unit.name}「大丈夫。少し見ててくれたら戻れるから」`;
  return `${unit.name}「今日はどうする？」`;
}

function trainingLogPanelHtml(run) {
  const presets = getTeamPresetList();
  return `
    <h3>記録メニュー</h3>
    <div class="training-log-actions">
      <button class="plain-btn wide-btn" type="button" data-training-log-open>育成ログを開く</button>
      <button class="plain-btn wide-btn" type="button" data-team-presets-open>プリセット保存 / 一覧</button>
    </div>
    <small>ログ${run.memoryLog?.length ?? 0}件 / チームプリセット ${presets.length}/${MAX_TEAM_PRESETS}</small>
  `;
}

function renderTrainingPresetOverlay(run) {
  if (!trainingPresetOverlayEl) return;
  if (state.trainingMiniGame) {
    trainingPresetOverlayEl.hidden = false;
    trainingPresetOverlayEl.innerHTML = `
      <div class="training-modal-card training-mini-modal">
        <div class="menu-head">
          <div>
            <p class="eyebrow">Mini Game</p>
            <h2>実戦トレーニング</h2>
          </div>
          <button class="plain-btn" type="button" data-training-mini-finish>結果を確定</button>
        </div>
        ${trainingMiniGameHtml(state.trainingMiniGame)}
      </div>
    `;
    return;
  }
  if (state.trainingResultModalOpen && run.lastResult) {
    trainingPresetOverlayEl.hidden = false;
    trainingPresetOverlayEl.innerHTML = `
      <div class="training-modal-card training-result-modal">
        <div class="menu-head">
          <div>
            <p class="eyebrow">Turn Result</p>
            <h2>${escapeHtml(run.lastResult.label ?? "行動結果")}</h2>
            <p>増えたところ、下がったところを確認してから次のターンへ進む。</p>
          </div>
        </div>
        ${trainingResultModalHtml(run)}
        <button class="primary-btn big-btn" type="button" data-training-result-ok>OK / 理解した</button>
      </div>
    `;
    return;
  }
  if (state.trainingActionModalOpen || state.trainingEvent) {
    trainingPresetOverlayEl.hidden = false;
    trainingPresetOverlayEl.innerHTML = `
      <div class="training-modal-card training-action-modal">
        <div class="menu-head">
          <div>
            <p class="eyebrow">Training Command</p>
            <h2>${state.trainingEvent ? trainingModalTitle(state.trainingEvent) : "今日はなにをする？"}</h2>
            <p>${state.trainingEvent ? escapeHtml(state.trainingEvent.line ?? "選択肢を選ぶ。") : "行動を選んでから、誰とするかを決める。"}</p>
          </div>
          <button class="plain-btn" type="button" data-training-back>閉じる</button>
        </div>
        <div class="training-modal-choice-area">
          ${state.trainingEvent ? trainingEventChoicesHtml(state.trainingEvent) : trainingActionButtonsHtml(run)}
        </div>
      </div>
    `;
    return;
  }
  if (state.trainingOverlayMode === "backConfirm") {
    autoSaveTrainingRun(run);
    trainingPresetOverlayEl.hidden = false;
    trainingPresetOverlayEl.innerHTML = `
      <div class="training-modal-card training-back-modal">
        <div class="menu-head">
          <div>
            <p class="eyebrow">Auto Save</p>
            <h2>育成を途中で離れますか？</h2>
            <p>現在の${run.turn}/${run.limit}ターン目までオート保存済み。戻っても、育成画面から続きに戻れる。</p>
          </div>
        </div>
        <div class="training-back-actions">
          <button class="primary-btn big-btn" type="button" data-training-continue>育成を続ける</button>
          <button class="plain-btn big-btn" type="button" data-training-leave-saved>保存してモード選択へ</button>
          <button class="plain-btn big-btn danger-btn" type="button" data-training-abandon>放棄してモード選択へ</button>
        </div>
      </div>
    `;
    trainingPresetOverlayEl.querySelector("[data-training-continue]")?.addEventListener("click", () => {
      state.trainingOverlayMode = "";
      renderTraining();
    });
    trainingPresetOverlayEl.querySelector("[data-training-leave-saved]")?.addEventListener("click", () => {
      autoSaveTrainingRun(run);
      state.trainingOverlayMode = "";
      showModeMenu();
    });
    trainingPresetOverlayEl.querySelector("[data-training-abandon]")?.addEventListener("click", () => {
      clearAutoSavedTrainingRun();
      state.trainingRun = null;
      state.trainingOverlayMode = "";
      showModeMenu();
    });
    return;
  }
  if (state.trainingOverlayMode === "logs") {
    const logs = (run.memoryLog ?? []).slice(-40).reverse();
    trainingPresetOverlayEl.hidden = false;
    trainingPresetOverlayEl.innerHTML = `
      <div class="training-modal-card training-log-modal">
        <div class="menu-head">
          <div>
            <p class="eyebrow">Training Log</p>
            <h2>育成ログ</h2>
            <p>ターンごとの反応、キャラ同士の会話、割り込みイベントをまとめて見る。</p>
          </div>
          <button class="plain-btn" type="button" data-close-training-overlay>閉じる</button>
        </div>
        <div class="training-log-modal-list">
          ${
            logs.length
              ? logs.map((line) => `<div class="log-row">${escapeHtml(line)}</div>`).join("")
              : `<p class="preset-empty">まだログなし。</p>`
          }
        </div>
      </div>
    `;
    attachTrainingOverlayClose();
    return;
  }
  if (!state.trainingPresetOverlayOpen && state.trainingOverlayMode !== "presets") {
    trainingPresetOverlayEl.hidden = true;
    trainingPresetOverlayEl.innerHTML = "";
    return;
  }
  const presets = getTeamPresetList();
  trainingPresetOverlayEl.hidden = false;
  trainingPresetOverlayEl.innerHTML = `
    <div class="training-modal-card">
      <div class="menu-head">
        <div>
          <p class="eyebrow">Team Presets</p>
          <h2>チームプリセット保存 / 一覧</h2>
          <p>途中保存、本登録、最大${MAX_TEAM_PRESETS}件の整理をここで行う。</p>
        </div>
        <button class="plain-btn" type="button" data-close-training-overlay>閉じる</button>
      </div>
      <div class="preset-save preset-save-modal">
        <input id="trainingPresetName" type="text" maxlength="28" value="${escapeHtml(`${run.completed ? "完走" : "途中"}チーム${presets.length + 1}`)}" aria-label="チームプリセット名">
        <button class="primary-btn" type="button" data-save-training>${run.completed ? "チームプリセット保存" : "途中保存"}</button>
        <button type="button" data-new-training>新しく育成開始</button>
      </div>
      <div class="team-preset-modal-grid">
        ${
          presets.length
            ? presets
                .map(
                  (preset) => `
                    <article class="preset-modal-card ${preset.id === getActiveTeamPresetId() ? "active" : ""}">
                      <strong>${escapeHtml(preset.name)}</strong>
                      <small>${escapeHtml(preset.teamType)} / ${preset.members.map((member) => `${member.name}:${member.trainingType}`).join(" ")}</small>
                      <div>
                        <button type="button" data-team-preset-activate="${preset.id}">使う</button>
                        <button type="button" data-team-preset-rename="${preset.id}">名</button>
                        <button type="button" data-team-preset-delete="${preset.id}">削除</button>
                      </div>
                    </article>
                  `,
                )
                .join("")
            : `<p class="preset-empty">まだ保存なし。右下の途中保存か完走保存で追加できる。</p>`
        }
      </div>
    </div>
  `;
  attachTrainingOverlayClose();
  attachTrainingPresetOverlayHandlers();
}

function trainingModalTitle(event) {
  if (event.targetPicker) return `${event.label}の対象を選ぶ`;
  if (event.conversation) return `${event.speaker ?? "トーク"} / 会話`;
  if (event.freeEvent) return event.speaker ?? "割り込みイベント";
  if (event.postTalk) return event.speaker ?? "反応";
  return event.label ?? "育成";
}

function trainingResultModalHtml(run) {
  const rows = run.lastResult?.rows ?? [];
  const visibleRows = rows
    .map((row) => {
      const deltas = row.deltas
        .filter((delta) => delta.value !== 0)
        .map(
          (delta) =>
            `<span class="result-delta ${delta.value > 0 ? "up" : "down"}">${delta.label} ${delta.value > 0 ? "+" : ""}${delta.value}</span>`,
        )
        .join("");
      return deltas
        ? `<article class="training-result-card"><strong>${escapeHtml(row.name)}</strong><div>${deltas}</div></article>`
        : "";
    })
    .filter(Boolean)
    .join("");
  return `
    <div class="training-result-body">
      <strong>${escapeHtml(run.lastResult?.message ?? "行動結果")}</strong>
      <div class="training-result-grid">${visibleRows || `<p class="preset-empty">能力変化なし。</p>`}</div>
    </div>
  `;
}

function attachTrainingOverlayClose() {
  trainingPresetOverlayEl.querySelectorAll("[data-close-training-overlay]").forEach((button) => {
    button.addEventListener("click", () => {
      state.trainingPresetOverlayOpen = false;
      state.trainingOverlayMode = "";
      renderTraining();
    });
  });
}

function renderGrowthRoster(target, activeId, onSelect, options = {}) {
  const units = options.includeEnemies ? trainableBaseUnits() : playerBaseUnits();
  target.innerHTML = units
    .map((unit) => {
      const unlocked = unit.team !== "enemy" || isEnemyTrainingUnlocked(unit.id);
      const progress = getProgress(unit.id);
      const presets = getPresetList(unit.id);
      const lockText = unit.team === "enemy" && !unlocked ? enemyUnlockText(unit.id) : `T${progress.trainingTurns} 親密${progress.bond} 保存${presets.length}`;
      return `
        <button class="growth-unit ${activeId === unit.id ? "selected" : ""} ${!unlocked ? "locked" : ""}" type="button" data-growth-id="${unit.id}" ${!unlocked ? "disabled" : ""}>
          <img src="${unit.art}" alt="${unit.name}">
          <span>${unit.name}</span>
          <small>${lockText}</small>
        </button>
      `;
    })
    .join("");
  target.querySelectorAll("[data-growth-id]").forEach((button) => {
    button.addEventListener("click", () => onSelect(button.dataset.growthId));
  });
}

function firstTrainableUnitId() {
  return trainableBaseUnits().find((unit) => canTrainUnit(unit.id))?.id || playerBaseUnits()[0].id;
}

function canTrainUnit(unitId) {
  const unit = getBaseUnit(unitId);
  return Boolean(unit && (unit.team !== "enemy" || isEnemyTrainingUnlocked(unitId)));
}

function isEnemyTrainingUnlocked(unitId) {
  if (!enemyBaseUnits().some((unit) => unit.id === unitId)) return true;
  return playerLevelInfo().level >= (enemyLevelUnlocks[unitId] ?? 1);
}

function completedPlayerCharacterCount() {
  return playerBaseUnits().filter((unit) => getPresetList(unit.id).some((preset) => preset.progress?.completed)).length;
}

function enemyUnlockText(unitId) {
  const level = enemyLevelUnlocks[unitId] ?? 1;
  return `解放条件: プレイヤーLv${playerLevelInfo().level}/${level}`;
}

function trainingFooterButtonsHtml(run) {
  if (state.trainingMiniGame) return `<button class="primary-btn wide-btn" type="button" data-training-mini-focus>実戦トレーニング中</button>`;
  if (state.trainingResultModalOpen) return `<button class="primary-btn wide-btn" type="button" data-training-result-ok>結果を確認する</button>`;
  if (state.trainingEvent) return `<button class="primary-btn wide-btn" type="button" data-training-event-open>会話 / 選択を開く</button>`;
  if (run.completed) return `<button class="primary-btn wide-btn" type="button" data-team-presets-open>チームプリセット保存へ</button>`;
  return `<button class="primary-btn wide-btn training-open-action-btn" type="button" data-open-training-actions>今日はなにをする？</button>`;
}

function trainingActionButtonsHtml(run) {
  if (run.completed) {
    return `
      <div class="training-complete-note">
        <strong>${run.limit}ターン完走</strong>
        <span>右の保存欄でチームプリセットとして保存できる。</span>
      </div>
    `;
  }
  return trainingActions
    .map((action) => `
      <button class="choice-btn training-action" type="button" data-training-action="${action.id}">
        <strong>${action.label}</strong>
        <span>${action.note} / 対象 ${trainingTargetRules[action.id]?.label ?? "1人"}</span>
      </button>
    `)
    .join("");
}

function trainingEventChoicesHtml(event) {
  if (event.targetPicker) {
    const rule = trainingTargetRules[event.id] ?? trainingTargetRules.bond;
    const selected = event.targetIds ?? [];
    const valid = selected.length >= rule.min && selected.length <= rule.max;
    const targetButtons = event.teamIds
      .map((id) => {
        const unit = getBaseUnit(id);
        const active = selected.includes(id);
        return `
          <button class="choice-btn target-choice ${active ? "selected" : ""}" type="button" data-training-target-pick="${id}">
            <strong>${unit.name}</strong>
            <span>${active ? "重点対象" : "今回は見守り"} / ${getTrainingMemberProgress(id).mood}</span>
          </button>
        `;
      })
      .join("");
    return `
      <div class="training-target-panel">
        <strong>${event.label}の対象を選ぶ</strong>
        <small>必要人数: ${rule.label} / 現在 ${selected.length}人</small>
        <div class="training-target-grid">${targetButtons}</div>
        <div class="training-modal-actions">
          <button class="plain-btn wide-btn" type="button" data-training-back>戻る</button>
          <button class="primary-btn wide-btn" type="button" data-training-target-confirm ${valid ? "" : "disabled"}>この対象で進める</button>
        </div>
      </div>
    `;
  }
  const choices = event.choices
    .map((choice, index) => `<button class="choice-btn" type="button" data-training-choice="${index}">${choice.label}</button>`)
    .join("");
  if (event.postTalk || event.freeEvent) return choices;
  return `${choices}<button class="choice-btn back-choice" type="button" data-training-back>戻る</button>`;
}

function attachTrainingChoiceHandlers(root) {
  if (!root) return;
  root.querySelectorAll("[data-open-training-actions]").forEach((button) => {
    button.addEventListener("click", () => {
      state.trainingActionModalOpen = true;
      renderTraining();
    });
  });
  root.querySelectorAll("[data-training-event-open]").forEach((button) => {
    button.addEventListener("click", renderTraining);
  });
  root.querySelectorAll("[data-training-result-ok]").forEach((button) => {
    button.addEventListener("click", acknowledgeTrainingResult);
  });
  root.querySelectorAll("[data-training-action]").forEach((button) => {
    button.addEventListener("click", () => openTrainingEvent(button.dataset.trainingAction));
  });
  root.querySelectorAll("[data-training-target-pick]").forEach((button) => {
    button.addEventListener("click", () => toggleTrainingTarget(button.dataset.trainingTargetPick));
  });
  root.querySelectorAll("[data-training-target-confirm]").forEach((button) => {
    button.addEventListener("click", confirmTrainingTargets);
  });
  root.querySelectorAll("[data-training-choice]").forEach((button) => {
    button.addEventListener("click", () => resolveTrainingChoice(Number(button.dataset.trainingChoice)));
  });
  root.querySelectorAll("[data-training-mini]").forEach((button) => {
    button.addEventListener("click", () => playTrainingMiniGame(button.dataset.trainingMini));
  });
  root.querySelectorAll("[data-training-back]").forEach((button) => {
    button.addEventListener("click", backFromTrainingEvent);
  });
  root.querySelectorAll("[data-training-mini-focus]").forEach((button) => {
    button.addEventListener("click", renderTraining);
  });
  root.querySelectorAll("[data-team-presets-open]").forEach((button) => {
    button.addEventListener("click", () => {
      state.trainingOverlayMode = "presets";
      state.trainingPresetOverlayOpen = true;
      renderTraining();
    });
  });
}

function backFromTrainingEvent() {
  if (state.trainingEvent) {
    state.trainingEvent = null;
    state.trainingActionModalOpen = true;
  } else {
    state.trainingActionModalOpen = false;
  }
  renderTraining();
}

function acknowledgeTrainingResult() {
  state.trainingResultModalOpen = false;
  renderTraining();
}

function openTrainingEvent(actionId) {
  const action = trainingActions.find((candidate) => candidate.id === actionId) ?? trainingActions[0];
  const run = ensureTrainingRun();
  if (run.completed) return;
  state.trainingActionModalOpen = false;
  if (action.id === "rest") {
    const result = applyTrainingChoiceToTeam(action.choices[0], "rest", [...run.teamIds]);
    trainingResultEl.textContent = result;
    state.trainingEvent = buildSpontaneousTrainingEvent(run, "rest", [...run.teamIds]);
    state.trainingResultModalOpen = true;
    renderTraining();
    return;
  }
  const rule = trainingTargetRules[action.id] ?? trainingTargetRules.bond;
  const targetIds = defaultTrainingTargetIds(run, action.id);
  if (!rule.all) {
    state.trainingEvent = {
      ...action,
      targetPicker: true,
      teamIds: [...run.teamIds],
      targetIds,
      line: `${action.label}は対象${rule.label}。誰を重点的に育てるか選ぼう。選ばれない子にも感情の揺れが残る。`,
    };
    renderTraining();
    return;
  }
  openTrainingActionEvent(action, [...run.teamIds]);
}

function openTrainingActionEvent(action, targetIds) {
  const unit = getBaseUnit(targetIds[0] || state.activeTrainingId);
  const progress = getTrainingMemberProgress(unit.id);
  if (action.id === "bond") {
    const maxRounds = talkRoundCount(progress);
    state.trainingEvent = {
      ...action,
      conversation: true,
      dialogueRound: 0,
      dialogueMax: maxRounds,
      choices: talkRoundChoices(unit, progress, 0),
      targetIds,
      accumulatedChoice: emptyTalkChoice(),
      line: characterLine(unit, talkRoundLine(unit, progress, 0)),
    };
    renderTraining();
    return;
  }
  state.trainingEvent = {
    ...action,
    targetIds,
    line: `${action.line} ${trainingFlavor(unit, action.id)}`,
  };
  renderTraining();
}

function resolveTrainingChoice(index) {
  const event = state.trainingEvent;
  if (!event || event.targetPicker) return;
  const choice = event.choices[index];
  if (event.postTalk) {
    if (event.showResultAfter) {
      state.trainingResultModalOpen = true;
    }
    state.trainingEvent = event.nextEvent ?? null;
    renderTraining();
    return;
  }
  if (event.freeEvent) {
    resolveTrainingFreeEvent(event, choice);
    return;
  }
  const targetIds = event.targetIds?.length ? event.targetIds : [state.activeTrainingId];
  const unit = getBaseUnit(targetIds[0]);
  if (event.id === "bond" && event.conversation) {
    resolveTrainingTalkRound(unit, choice);
    return;
  }
  if (event.id === "power") {
    startTrainingMiniGame(unit, { ...event, targetIds }, choice);
    return;
  }
  const result = applyTrainingChoiceToTeam(choice, event.id, targetIds);
  const run = ensureTrainingRun();
  state.trainingEvent = buildSpontaneousTrainingEvent(run, event.id, targetIds);
  state.trainingResultModalOpen = true;
  trainingResultEl.textContent = result;
  renderTraining();
}

function resolveTrainingTalkRound(unit, choice) {
  const event = state.trainingEvent;
  if (!event?.conversation) return;
  const progress = getTrainingMemberProgress(unit.id);
  event.accumulatedChoice = mergeTalkChoice(event.accumulatedChoice, choice);
  event.dialogueRound += 1;
  if (event.dialogueRound < event.dialogueMax) {
    event.line = characterLine(unit, talkRoundLine(unit, progress, event.dialogueRound, choice.intent));
    event.choices = talkRoundChoices(unit, progress, event.dialogueRound);
    renderTraining();
    return;
  }
  const finalChoice = finalizeTalkChoice(event.accumulatedChoice, progress);
  const result = applyTrainingChoiceToTeam(finalChoice, "bond", event.targetIds ?? [unit.id]);
  const updated = getTrainingMemberProgress(unit.id);
  const run = ensureTrainingRun();
  const nextEvent = buildSpontaneousTrainingEvent(run, "bond", event.targetIds ?? [unit.id]);
  state.trainingEvent = {
    id: "post-talk",
    postTalk: true,
    targetIds: event.targetIds ?? [unit.id],
    line: characterLine(unit, talkClosingLine(unit, updated, finalChoice)),
    choices: [{ label: "結果を見る" }],
    nextEvent,
    showResultAfter: true,
  };
  trainingResultEl.textContent = result;
  renderTraining();
}

function talkRoundCount(progress) {
  if ((progress.bond ?? 0) >= 75) return 4;
  if ((progress.bond ?? 0) >= 40) return 3;
  return 2;
}

function emptyTalkChoice() {
  return {
    label: "話を聞いた",
    bond: [0, 0],
    hp: [0, 0],
    atk: [0, 0],
    def: [0, 0],
    knowledge: [0, 0],
    exp: [0, 0],
    mood: "ごきげん",
    path: "信頼",
    intent: "care",
  };
}

function mergeTalkChoice(base, choice) {
  const next = { ...emptyTalkChoice(), ...(base ?? {}) };
  for (const key of ["bond", "hp", "atk", "def", "knowledge", "exp"]) {
    const a = next[key] ?? [0, 0];
    const b = choice[key] ?? [0, 0];
    next[key] = [a[0] + b[0], a[1] + b[1]];
  }
  next.mood = choice.mood ?? next.mood;
  next.path = choice.path ?? next.path;
  next.intent = choice.intent ?? next.intent;
  next.label = choice.label ?? next.label;
  return next;
}

function finalizeTalkChoice(choice, progress) {
  const rounds = talkRoundCount(progress);
  return {
    ...choice,
    bond: [Math.max(2, choice.bond[0]), Math.max(4 + rounds, choice.bond[1])],
    def: [choice.def[0], choice.def[1] + Math.max(1, rounds - 1)],
    knowledge: [choice.knowledge[0], choice.knowledge[1] + (rounds >= 3 ? 2 : 0)],
  };
}

function talkRoundChoices(unit, progress, round) {
  const high = (progress.bond ?? 0) >= 70;
  const mid = (progress.bond ?? 0) >= 40;
  const sets = [
    [
      { label: "まず今日の表情を聞く", bond: [2, 5], hp: [0, 1], def: [1, 2], knowledge: [0, 1], mood: "ごきげん", path: "信頼", intent: "care" },
      { label: "勝つための悩みを聞く", bond: [1, 4], hp: [0, 0], def: [0, 1], knowledge: [1, 3], mood: "集中", path: "策士", intent: "plan" },
      { label: "少し踏み込んで本音を聞く", bond: [3, 6], hp: [0, 1], atk: [0, 1], def: [0, 1], knowledge: [0, 1], mood: mid ? "恋愛中" : "ごきげん", path: "恋愛", intent: "focus" },
    ],
    [
      { label: "前回の言葉を覚えていると伝える", bond: [3, 7], hp: [0, 2], def: [1, 3], knowledge: [0, 1], mood: "ごきげん", path: "信頼", intent: "care" },
      { label: "チームでの居場所を一緒に考える", bond: [2, 6], hp: [0, 1], def: [1, 2], knowledge: [2, 4], mood: "集中", path: "策士", intent: "team" },
      { label: "君をちゃんと見ていると言う", bond: [4, 8], hp: [0, 2], atk: [0, 1], def: [0, 1], knowledge: [0, 1], mood: high ? "恋愛中" : "ごきげん", path: "恋愛", intent: "focus" },
    ],
    [
      { label: "弱いところも任せてほしいと言う", bond: [4, 9], hp: [1, 3], def: [2, 4], knowledge: [0, 1], mood: "恋愛中", path: "信頼", intent: "promise" },
      { label: "次の勝ち筋を二人で決める", bond: [3, 7], hp: [0, 1], atk: [0, 1], def: [1, 3], knowledge: [3, 5], mood: "集中", path: "策士", intent: "plan" },
      { label: "他の子には言わない約束をする", bond: [5, 10], hp: [0, 2], atk: [1, 2], def: [0, 1], knowledge: [0, 1], mood: "恋愛中", path: "恋愛", intent: "promise" },
    ],
    [
      { label: "これからも隣で見ていると伝える", bond: [6, 12], hp: [2, 5], def: [2, 5], knowledge: [1, 2], mood: "恋愛中", path: "信頼", intent: "promise" },
      { label: "この子だけの勝ち方を一緒に名付ける", bond: [5, 10], hp: [0, 2], atk: [1, 3], def: [1, 3], knowledge: [4, 7], mood: "集中", path: "策士", intent: "plan" },
      { label: "今日は一番頼りにしていると言う", bond: [7, 14], hp: [0, 3], atk: [1, 3], def: [1, 2], knowledge: [0, 2], mood: "恋愛中", path: "恋愛", intent: "focus" },
    ],
  ];
  return sets[Math.min(round, sets.length - 1)].map((choice) => ({ ...choice, label: `${choice.label}` }));
}

function talkRoundLine(unit, progress, round, previousIntent = "") {
  const tier = (progress.bond ?? 0) >= 70 ? "high" : (progress.bond ?? 0) >= 40 ? "mid" : "early";
  const lines = deepTalkLines[unit.id]?.[tier] ?? deepTalkLines.default[tier];
  const index = (round + stableIndex(unit.id, lines.length) + (previousIntent === "focus" ? 1 : 0)) % lines.length;
  return lines[index];
}

function talkClosingLine(unit, progress, choice) {
  const mood = progress.mood ?? "ごきげん";
  if ((progress.bond ?? 0) >= 75) {
    return `${unit.name}は少し息を吐いて、今日の言葉がちゃんと残ったみたいにこちらを見た。今は「${mood}」で、次の一手を君に見ていてほしいと思っている。`;
  }
  if ((progress.bond ?? 0) >= 40) {
    return `${unit.name}は最後に小さくうなずいた。まだ全部は言わないけれど、選ばれたことは嬉しかったみたいだ。今の気分は「${mood}」。`;
  }
  if (choice?.intent === "focus") {
    return `${unit.name}は少し照れて、すぐに視線をそらした。でも、特別に見られたことだけは悪くなさそうだ。`;
  }
  return `${unit.name}は話し終えると、少しだけ表情をゆるめた。距離はまだあるけれど、今日の会話はちゃんと届いたみたいだ。`;
}

function buildSpontaneousTrainingEvent(run, actionId, targetIds = []) {
  if (!run || run.completed) return null;
  const ignored = run.teamIds.filter((id) => !targetIds.includes(id));
  const jealous = ignored
    .map((id) => ({ id, progress: getTrainingMemberProgress(id) }))
    .filter(({ progress }) => (progress.jealousy ?? 0) >= 35 || ["落ち込み", "嫉妬", "気まずい"].includes(progress.mood))
    .sort((a, b) => (b.progress.jealousy ?? 0) - (a.progress.jealousy ?? 0));
  if (actionId === "bond" && jealous[0]) return makeIgnoredTrainingEvent(run, jealous[0].id, targetIds[0]);
  if (jealous[0] && randomChance(0.45)) return makeIgnoredTrainingEvent(run, jealous[0].id, targetIds[0]);
  const conflict = pickConflictTrainingPair(run);
  if (conflict && randomChance(actionId === "power" ? 0.45 : 0.32)) return makeConflictTrainingEvent(run, conflict[0], conflict[1]);
  if (randomChance(0.24)) {
    const pair = pickSpontaneousChatPair(run);
    if (pair) return makeSpontaneousChatEvent(run, pair[0], pair[1]);
  }
  return null;
}

function makeIgnoredTrainingEvent(run, ignoredId, focusedId) {
  const ignored = getBaseUnit(ignoredId);
  const focused = getBaseUnit(focusedId) ?? getBaseUnit(run.teamIds.find((id) => id !== ignoredId));
  const progress = getTrainingMemberProgress(ignoredId);
  const line =
    progress.mood === "落ち込み"
      ? `${ignored.name}が少し離れた場所でうつむいている。「……今日は、私じゃないんだね」`
      : `${ignored.name}が${focused?.name ?? "他の子"}の方を見て、言葉を飲み込んだ。「あの子ばっかり……」`;
  return {
    id: "free-ignored",
    freeEvent: true,
    speaker: `${ignored.name} / 割り込み`,
    actorIds: [ignoredId, focusedId].filter(Boolean),
    line,
    choices: [
      {
        label: `${ignored.name}に声をかける`,
        response: `${ignored.name}は少しだけ顔を上げた。「……見てたなら、いい」`,
        effects: [{ id: ignoredId, bond: 4, jealousy: -8, mood: "ごきげん" }],
      },
      {
        label: "今日選んだ理由を正直に話す",
        response: `${ignored.name}は納得しきれない顔だけど、理由は聞いてくれた。`,
        effects: [{ id: ignoredId, bond: 2, jealousy: -4, mood: "集中" }],
      },
      {
        label: "今はそっとしておく",
        response: `${ignored.name}は何も言わなかった。けれど、その沈黙は少し重く残った。`,
        effects: [{ id: ignoredId, bond: -1, jealousy: 5, mood: "落ち込み" }],
      },
    ],
  };
}

function makeConflictTrainingEvent(run, aId, bId) {
  const a = getBaseUnit(aId);
  const b = getBaseUnit(bId);
  return {
    id: "free-conflict",
    freeEvent: true,
    speaker: `${a.name} × ${b.name}`,
    actorIds: [aId, bId],
    line: `${a.name}と${b.name}が言い合いを始めた。\n${a.name}「今のはそっちが強引だった」\n${b.name}「そっちこそ、こっちを見てなかったでしょ」`,
    choices: [
      {
        label: "止める",
        response: "二人はまだ不満そうだけど、君が間に入ったことで空気は少し落ち着いた。",
        effects: [
          { id: aId, bond: 1, jealousy: -3, mood: "集中", relation: { otherId: bId, delta: 1, label: "仲直り" } },
          { id: bId, bond: 1, jealousy: -3, mood: "集中", relation: { otherId: aId, delta: 1, label: "仲直り" } },
        ],
      },
      {
        label: `${a.name}をかばう`,
        response: `${a.name}は強気に笑った。${b.name}は少しだけ距離を取った。`,
        effects: [
          { id: aId, bond: 4, jealousy: -2, mood: "ごきげん", relation: { otherId: bId, delta: -1, label: "火花" } },
          { id: bId, bond: -2, jealousy: 8, mood: "嫉妬", relation: { otherId: aId, delta: -2, label: "火花" } },
        ],
      },
      {
        label: `${b.name}をかばう`,
        response: `${b.name}は少し誇らしげに息を吐いた。${a.name}は納得していない。`,
        effects: [
          { id: bId, bond: 4, jealousy: -2, mood: "ごきげん", relation: { otherId: aId, delta: -1, label: "火花" } },
          { id: aId, bond: -2, jealousy: 8, mood: "嫉妬", relation: { otherId: bId, delta: -2, label: "火花" } },
        ],
      },
      {
        label: "2人に勝負させる",
        response: `${a.name}と${b.name}は正面からぶつかった。勝ち負けより、互いを意識する熱が強く残った。`,
        effects: [
          { id: aId, atk: 2, jealousy: 3, mood: randomChance(0.35) ? "気まずい" : "集中", relation: { otherId: bId, delta: 5, label: "ライバル" } },
          { id: bId, atk: 2, jealousy: 3, mood: randomChance(0.35) ? "気まずい" : "集中", relation: { otherId: aId, delta: 5, label: "ライバル" } },
        ],
      },
      {
        label: "放っておく",
        response: "二人の言い合いは自然に止まった。でも、火種はまだ残っている。",
        effects: [
          { id: aId, jealousy: 4, mood: "気まずい", relation: { otherId: bId, delta: -1, label: "気まずい" } },
          { id: bId, jealousy: 4, mood: "気まずい", relation: { otherId: aId, delta: -1, label: "気まずい" } },
        ],
      },
    ],
  };
}

function makeSpontaneousChatEvent(run, aId, bId) {
  const a = getBaseUnit(aId);
  const b = getBaseUnit(bId);
  const quiet = [aId, bId].some((id) => characterNeedsApproach(id) && (getTrainingMemberProgress(id).bond ?? 0) < 35);
  const line = quiet
    ? `${a.name}と${b.name}が小さく何かを話しかけて、こちらに気づくと黙った。話しかければ、続きが聞けそうだ。`
    : `${a.name}と${b.name}が勝手に盤面の話を始めた。\n${a.name}「さっきの動き、少し気になった」\n${b.name}「じゃあ次は一緒に試してみる？」`;
  return {
    id: "free-chat",
    freeEvent: true,
    speaker: `${a.name} × ${b.name}`,
    actorIds: [aId, bId],
    line,
    choices: [
      {
        label: quiet ? "こちらから話しかける" : "会話に入る",
        response: `${a.name}と${b.name}は少し驚いたあと、君も含めて次の動きを相談した。`,
        effects: [
          { id: aId, bond: 2, mood: "集中", relation: { otherId: bId, delta: 2, label: "相談" } },
          { id: bId, bond: 2, mood: "集中", relation: { otherId: aId, delta: 2, label: "相談" } },
        ],
      },
      {
        label: "見守る",
        response: "二人は自分たちなりに会話を終えた。君が口を挟まなかったことで、関係が少し自然に動いた。",
        effects: [
          { id: aId, relation: { otherId: bId, delta: 1, label: "自然体" } },
          { id: bId, relation: { otherId: aId, delta: 1, label: "自然体" } },
        ],
      },
    ],
  };
}

function resolveTrainingFreeEvent(event, choice) {
  const run = ensureTrainingRun();
  if (!event?.freeEvent || !choice) return;
  const before = snapshotTrainingTeam(run);
  const relationApplied = new Set();
  for (const effect of choice.effects ?? []) applyFreeTrainingEffect(run, effect, relationApplied);
  const line = `${choice.response}（行動ターン消費なし）`;
  run.lastResult = buildTrainingResultSnapshot(run, before, "割り込みイベント結果", line);
  run.memoryLog.push(line);
  run.memoryLog = run.memoryLog.slice(-40);
  for (const id of event.actorIds ?? []) {
    if (run.teamIds.includes(id)) getTrainingMemberProgress(id).lastMessage = line;
  }
  state.trainingEvent = {
    id: "free-result",
    postTalk: true,
    speaker: event.speaker,
    actorIds: event.actorIds ?? [],
    line,
    choices: [{ label: "次へ" }],
    nextEvent: null,
  };
  renderTraining();
}

function applyFreeTrainingEffect(run, effect, relationApplied = new Set()) {
  const progress = getTrainingMemberProgress(effect.id);
  if (!progress) return;
  if (effect.bond) progress.bond = clamp((progress.bond ?? 0) + effect.bond, 0, 100);
  if (effect.jealousy) progress.jealousy = clamp((progress.jealousy ?? 0) + effect.jealousy, 0, 100);
  if (effect.atk) progress.atk = clamp((progress.atk ?? 0) + effect.atk, 1, 999);
  if (effect.def) progress.def = clamp((progress.def ?? 0) + effect.def, 0, 999);
  if (effect.knowledge) progress.knowledge = clamp((progress.knowledge ?? 0) + effect.knowledge, 0, 999);
  if (effect.mood) progress.mood = effect.mood;
  if (effect.relation?.otherId) {
    const key = relationKey(effect.id, effect.relation.otherId);
    if (!relationApplied.has(key)) {
      relationApplied.add(key);
      adjustTrainingRelation(run, effect.id, effect.relation.otherId, effect.relation.delta ?? 0, effect.relation.label ?? "関係変化");
    }
  }
}

function adjustTrainingRelation(run, aId, bId, delta, label) {
  const key = relationKey(aId, bId);
  const next = clamp((run.relations[key]?.score ?? 0) + delta, -10, 20);
  run.relations[key] = { score: next, label };
  const a = getTrainingMemberProgress(aId);
  const b = getTrainingMemberProgress(bId);
  a.relations = { ...(a.relations ?? {}), [bId]: { score: next, label } };
  b.relations = { ...(b.relations ?? {}), [aId]: { score: next, label } };
}

function pickConflictTrainingPair(run) {
  const pairs = [];
  for (let i = 0; i < run.teamIds.length; i += 1) {
    for (let j = i + 1; j < run.teamIds.length; j += 1) {
      const aId = run.teamIds[i];
      const bId = run.teamIds[j];
      const relation = run.relations?.[relationKey(aId, bId)] ?? inferredRelation(aId, bId);
      const a = relationshipSettings[aId] ?? {};
      const b = relationshipSettings[bId] ?? {};
      const jealousy = Math.max(getTrainingMemberProgress(aId).jealousy ?? 0, getTrainingMemberProgress(bId).jealousy ?? 0);
      const conflict = relation.score < 0 || a.rival === bId || b.rival === aId || a.dislikes?.includes(bId) || b.dislikes?.includes(aId) || jealousy >= 55;
      if (conflict) pairs.push([aId, bId, jealousy - (relation.score ?? 0) * 4]);
    }
  }
  return pairs.sort((a, b) => b[2] - a[2])[0]?.slice(0, 2) ?? null;
}

function pickSpontaneousChatPair(run) {
  const pairs = [];
  for (let i = 0; i < run.teamIds.length; i += 1) {
    for (let j = i + 1; j < run.teamIds.length; j += 1) {
      const aId = run.teamIds[i];
      const bId = run.teamIds[j];
      const relation = run.relations?.[relationKey(aId, bId)] ?? inferredRelation(aId, bId);
      const aBond = getTrainingMemberProgress(aId).bond ?? 0;
      const bBond = getTrainingMemberProgress(bId).bond ?? 0;
      pairs.push([aId, bId, (relation.score ?? 0) + Math.floor((aBond + bBond) / 40)]);
    }
  }
  return pairs.sort((a, b) => b[2] - a[2])[0]?.slice(0, 2) ?? null;
}

function characterNeedsApproach(unitId) {
  return ["yui", "honoka", "non", "shade2", "shade3"].includes(unitId);
}

function defaultTrainingTargetIds(run, actionId) {
  const rule = trainingTargetRules[actionId] ?? trainingTargetRules.bond;
  if (rule.all) return [...run.teamIds];
  const focus = run.teamIds.includes(state.activeTrainingId) ? state.activeTrainingId : run.teamIds[0];
  const rest = (run.targetIds ?? []).filter((id) => id !== focus && run.teamIds.includes(id));
  return [focus, ...rest].slice(0, rule.max);
}

function toggleTrainingTarget(unitId) {
  const event = state.trainingEvent;
  if (!event?.targetPicker) return;
  const rule = trainingTargetRules[event.id] ?? trainingTargetRules.bond;
  const selected = new Set(event.targetIds ?? []);
  if (selected.has(unitId)) {
    if (selected.size > rule.min) selected.delete(unitId);
  } else {
    if (selected.size >= rule.max) {
      const first = selected.values().next().value;
      selected.delete(first);
    }
    selected.add(unitId);
  }
  event.targetIds = [...selected];
  state.activeTrainingId = event.targetIds[0] ?? state.activeTrainingId;
  renderTraining();
}

function confirmTrainingTargets() {
  const event = state.trainingEvent;
  if (!event?.targetPicker) return;
  const rule = trainingTargetRules[event.id] ?? trainingTargetRules.bond;
  const targetIds = (event.targetIds ?? []).filter((id) => event.teamIds.includes(id));
  if (targetIds.length < rule.min || targetIds.length > rule.max) return;
  const action = trainingActions.find((candidate) => candidate.id === event.id) ?? trainingActions[0];
  const run = ensureTrainingRun();
  run.targetIds = targetIds;
  state.activeTrainingId = targetIds[0] ?? state.activeTrainingId;
  openTrainingActionEvent(action, targetIds);
}

function applyTrainingChoiceToTeam(choice, actionId, targetIds, miniBonus = 0, miniDetail = "") {
  const run = ensureTrainingRun();
  if (run.completed) return "育成は完了している。保存して次のチームへ進もう。";
  const safeTargets = targetIds.filter((id) => run.teamIds.includes(id));
  run.targetIds = [...safeTargets];
  const messages = [];
  const before = snapshotTrainingTeam(run);
  const nextTurn = clamp(run.turn + 1, 0, run.limit);
  for (const id of safeTargets) {
    const unit = getBaseUnit(id);
    const progress = getTrainingMemberProgress(id);
    const message = applyTrainingChoice(unit, progress, { ...choice }, actionId, miniBonus, miniDetail, { countTurn: false, turn: nextTurn, limit: run.limit });
    messages.push(message);
  }
  const ignoredMessages = applyTeamNonTargetEffects(run, actionId, safeTargets, nextTurn);
  const relationMessages = applyTeamRelationshipEffects(run, actionId, safeTargets);
  run.turn = nextTurn;
  run.completed = run.turn >= run.limit;
  for (const id of run.teamIds) {
    const progress = getTrainingMemberProgress(id);
    progress.trainingTurns = run.turn;
    progress.level = Math.max(1, run.turn);
    progress.completed = run.completed;
    if (run.completed) finalizeProgressIdentity(progress);
  }
  if (run.completed && !run.completionRewarded) {
    run.completionRewarded = true;
    const expText = addPlayerExp(35 + Math.floor(run.limit / 2), "チーム育成完了");
    if (expText) run.memoryLog.push(expText);
  }
  const summary = [...messages.slice(0, 2), ...ignoredMessages.slice(0, 2), ...relationMessages.slice(0, 1)].join(" / ");
  const finalMessage = `${trainingActionLabel(actionId)} T${run.turn}/${run.limit}: ${summary}${run.completed ? " / チーム育成完了" : ""}`;
  for (const id of run.teamIds) {
    getTrainingMemberProgress(id).lastMessage = finalMessage;
  }
  run.lastResult = buildTrainingResultSnapshot(run, before, `${trainingActionLabel(actionId)} 結果`, finalMessage);
  run.memoryLog.push(finalMessage);
  run.memoryLog = run.memoryLog.slice(-40);
  return finalMessage;
}

function snapshotTrainingTeam(run) {
  const keys = ["maxHp", "atk", "def", "knowledge", "bond", "jealousy", "hunger"];
  return Object.fromEntries(
    run.teamIds.map((id) => {
      const progress = getTrainingMemberProgress(id);
      return [id, Object.fromEntries(keys.map((key) => [key, progress[key] ?? 0]))];
    }),
  );
}

function buildTrainingResultSnapshot(run, before, label, message) {
  const labels = { maxHp: "HP", atk: "攻", def: "防", knowledge: "知", bond: "親", jealousy: "嫉", hunger: "腹" };
  const rows = run.teamIds.map((id) => {
    const progress = getTrainingMemberProgress(id);
    const unit = getBaseUnit(id);
    return {
      id,
      name: unit?.name ?? id,
      deltas: Object.keys(labels).map((key) => ({ key, label: labels[key], value: (progress[key] ?? 0) - (before[id]?.[key] ?? 0) })),
    };
  });
  return { label, message, rows };
}

function applyTrainingChoice(unit, progress, choice, actionId, miniBonus = 0, miniDetail = "", options = {}) {
  const deltas = rollChoiceDeltas(choice);
  const affinityNote = applyTrainingAffinity(unit, actionId, deltas, choice);
  const accessoryNote = applyAccessoryTrainingBonus(unit, actionId, deltas, choice, progress);
  const commanderNote = applyCommanderTrainingQuirk(unit, actionId, deltas, choice, progress);
  const hungerPenalty = actionId === "rest" ? null : applyPreActionHungerPenalty(progress);
  const moodBonus = progress.mood === "ごきげん" ? 2 : progress.mood === "落ち込み" ? -2 : 0;
  const bondDelta = deltas.bond + moodBonus;
  const bonus = Math.max(0, miniBonus);
  if (bonus > 0) {
    deltas.atk += bonus;
    deltas.def += Math.max(1, Math.floor(bonus / 2));
  }
  const randomGrowth = rollTrainingRandomGrowth(actionId);
  progress.maxHp = clamp(progress.maxHp + deltas.hp, 1, 999);
  progress.atk = clamp(progress.atk + deltas.atk, 1, 999);
  progress.def = clamp(progress.def + deltas.def, 0, 999);
  progress.move = clamp(progress.move + deltas.move, 1, 9);
  progress.knowledge = clamp(progress.knowledge + deltas.knowledge, 0, 999);
  progress.bond = clamp(progress.bond + bondDelta, 0, 100);
  progress.jealousy = clamp((progress.jealousy ?? 0) + (bondDelta < 0 ? 4 : 0), 0, 100);
  applyTrainingRandomGrowth(progress, randomGrowth);
  if (actionId === "rest") {
    progress.hunger = clamp((progress.hunger ?? 80) + randomInt(18, 34), 0, 100);
    progress.jealousy = clamp((progress.jealousy ?? 0) - randomInt(1, 3), 0, 100);
  } else {
    progress.hunger = clamp((progress.hunger ?? 80) - randomInt(7, 14), 0, 100);
  }
  progress.mood = choice.mood;
  if (progress.hunger <= 18 && actionId !== "rest") progress.mood = "落ち込み";
  progress.path = choice.path;
  const turnLimit = options.limit ?? currentTrainingTurnLimit();
  const shouldCountTurn = options.countTurn !== false;
  progress.trainingTurns = shouldCountTurn ? clamp((progress.trainingTurns ?? 0) + 1, 0, turnLimit) : clamp(options.turn ?? progress.trainingTurns ?? 0, 0, turnLimit);
  progress.level = Math.max(1, progress.trainingTurns);
  progress.completed = progress.trainingTurns >= turnLimit;
  if (progress.completed) finalizeProgressIdentity(progress);
  const hungerText = hungerPenalty ? ` / 空腹ペナ: ${hungerPenalty}` : "";
  progress.lastMessage = `${unit.name}: T${progress.trainingTurns}/${turnLimit} / 親密${formatDelta(bondDelta)} / HP${formatDelta(deltas.hp)} / 攻${formatDelta(deltas.atk)} / 防${formatDelta(deltas.def)} / 知${formatDelta(deltas.knowledge)} / ${randomGrowth.label}${formatDelta(randomGrowth.amount)}${affinityNote ? ` / ${affinityNote}` : ""}${accessoryNote ? ` / ${accessoryNote}` : ""}${commanderNote ? ` / ${commanderNote}` : ""}${hungerText}${miniDetail ? ` / ${miniDetail}` : ""}${progress.completed ? ` / ${progress.trainingType}:${progress.title}` : ""}`;
  pushProgressMemory(progress, progress.lastMessage);
  return progress.lastMessage;
}

function trainingActionLabel(actionId) {
  return trainingActions.find((action) => action.id === actionId)?.label ?? "育成";
}

function applyTeamNonTargetEffects(run, actionId, targetIds, turn) {
  const messages = [];
  if (actionId === "rest") {
    for (const id of run.teamIds) {
      const progress = getTrainingMemberProgress(id);
      progress.jealousy = clamp((progress.jealousy ?? 0) - randomInt(4, 9), 0, 100);
      progress.hunger = clamp((progress.hunger ?? 80) + randomInt(10, 22), 0, 100);
      progress.mood = progress.jealousy >= 70 ? "嫉妬" : "ごきげん";
      progress.trainingTurns = turn;
      pushProgressMemory(progress, "全員で休み、空気が少し落ち着いた。");
    }
    return ["全員の嫉妬とおなかが回復"];
  }

  for (const id of run.teamIds.filter((candidate) => !targetIds.includes(candidate))) {
    const unit = getBaseUnit(id);
    const progress = getTrainingMemberProgress(id);
    const jealousyGain = actionId === "bond" ? randomInt(5, 10) : actionId === "date" ? randomInt(3, 8) : randomInt(2, 5);
    progress.jealousy = clamp((progress.jealousy ?? 0) + jealousyGain, 0, 100);
    progress.bond = clamp((progress.bond ?? 0) - (progress.jealousy >= 80 ? 2 : 0), 0, 100);
    progress.hunger = clamp((progress.hunger ?? 80) - randomInt(3, 8), 0, 100);
    progress.trainingTurns = turn;
    if (progress.jealousy >= 92) progress.mood = "呆れ";
    else if (progress.jealousy >= 65) progress.mood = "嫉妬";
    else if (randomChance(0.25)) progress.mood = "落ち込み";
    const message = `${unit.name}「あの子ばっかり……」嫉妬+${jealousyGain}`;
    progress.lastMessage = message;
    pushProgressMemory(progress, message);
    messages.push(message);
  }
  return messages;
}

function applyTeamRelationshipEffects(run, actionId, targetIds) {
  const messages = [];
  for (let i = 0; i < targetIds.length; i += 1) {
    for (let j = i + 1; j < targetIds.length; j += 1) {
      const a = getBaseUnit(targetIds[i]);
      const b = getBaseUnit(targetIds[j]);
      if (!a || !b) continue;
      const key = relationKey(a.id, b.id);
      const settingA = relationshipSettings[a.id] ?? {};
      const settingB = relationshipSettings[b.id] ?? {};
      let delta = actionId === "date" ? 2 : 1;
      let label = "仲間";
      if (settingA.rival === b.id || settingB.rival === a.id) {
        delta = actionId === "power" ? 3 : -1;
        label = actionId === "power" ? "ライバル" : "火花";
      } else if (settingA.likes?.includes(b.id) || settingB.likes?.includes(a.id)) {
        delta += 2;
        label = "相性良好";
      } else if (settingA.dislikes?.includes(b.id) || settingB.dislikes?.includes(a.id)) {
        delta -= 2;
        label = "苦手";
      }
      const next = clamp((run.relations[key]?.score ?? 0) + delta, -10, 20);
      run.relations[key] = { score: next, label };
      const progressA = getTrainingMemberProgress(a.id);
      const progressB = getTrainingMemberProgress(b.id);
      progressA.relations = { ...(progressA.relations ?? {}), [b.id]: { score: next, label } };
      progressB.relations = { ...(progressB.relations ?? {}), [a.id]: { score: next, label } };
      if (label === "ライバル") {
        progressA.atk = clamp(progressA.atk + 1, 1, 999);
        progressB.atk = clamp(progressB.atk + 1, 1, 999);
        progressA.jealousy = clamp((progressA.jealousy ?? 0) + 1, 0, 100);
        progressB.jealousy = clamp((progressB.jealousy ?? 0) + 1, 0, 100);
      }
      if (Math.abs(delta) >= 2 || randomChance(0.25)) {
        const message = relationshipTrainingLine(a, b, label, delta);
        messages.push(message);
        pushProgressMemory(progressA, message);
        pushProgressMemory(progressB, message);
      }
    }
  }
  return messages;
}

function relationshipTrainingLine(a, b, label, delta) {
  if ((a.id === "ren" && b.id === "yui") || (a.id === "yui" && b.id === "ren")) {
    return delta > 0 ? "蓮と結衣が勝負で火花を散らし、犬猫ライバルとして噛み合った。" : "蓮と結衣が言い争い、少し気まずい空気になった。";
  }
  if ((a.id === "mio" && b.id === "kaeru") || (a.id === "kaeru" && b.id === "mio")) {
    return delta > 0 ? "美桜が蛙瑠の変な案を一度だけ採用し、妙な連携が生まれた。" : "美桜が蛙瑠の実験から距離を取り、苦手意識が少し出た。";
  }
  if ((a.id === "kaeru" && b.id === "riko") || (a.id === "riko" && b.id === "kaeru")) {
    return "蛙瑠と莉胡がぴょんけろの呼吸を合わせ、相性が上がった。";
  }
  if ((a.id === "ibuki" && b.id === "non") || (a.id === "non" && b.id === "ibuki")) {
    return "伊吹の熱と乃音のゆっくりさがぶつかり、真逆コンビの形が見えた。";
  }
  if ((a.id === "honoka" && b.id === "mio") || (a.id === "mio" && b.id === "honoka")) {
    return "歩太が美桜に支えられ、前へ出る勇気を少し掴んだ。";
  }
  return `${a.name}と${b.name}の関係が「${label}」に動いた。`;
}

function relationKey(a, b) {
  return [a, b].sort().join(":");
}

function rollChoiceDeltas(choice) {
  return {
    bond: randomInt(...(choice.bond ?? [0, 0])),
    hp: randomInt(...(choice.hp ?? [0, 0])),
    atk: randomInt(...(choice.atk ?? [0, 0])),
    def: randomInt(...(choice.def ?? [0, 0])),
    move: randomInt(...(choice.move ?? [0, 0])),
    knowledge: randomInt(...(choice.knowledge ?? [0, 0])),
    exp: randomInt(...(choice.exp ?? [10, 18])),
  };
}

function ensureTrainingRun(focusId = state.activeTrainingId) {
  const fallbackTeam = normalizedTrainingTeamIds(focusId);
  const needsNew =
    !state.trainingRun ||
    !Array.isArray(state.trainingRun.teamIds) ||
    state.trainingRun.teamIds.length !== MAX_BATTLE_TEAM;
  if (needsNew) {
    state.trainingRun = createTrainingRun(fallbackTeam);
  }
  if (focusId && state.trainingRun.teamIds.includes(focusId)) {
    state.trainingRun.focusId = focusId;
    state.activeTrainingId = focusId;
  } else if (!state.trainingRun.teamIds.includes(state.activeTrainingId)) {
    state.activeTrainingId = state.trainingRun.teamIds[0];
    state.trainingRun.focusId = state.activeTrainingId;
  }
  state.trainingRun.progress = state.trainingRun.members[state.activeTrainingId];
  state.trainingTeamIds = [...state.trainingRun.teamIds];
  return state.trainingRun;
}

function normalizedTrainingTeamIds(focusId = "") {
  const candidates = [
    ...(Array.isArray(state.trainingTeamIds) ? state.trainingTeamIds : []),
    focusId,
    ...defaultBattleTeamIds,
    ...playerBaseUnits().map((unit) => unit.id),
  ];
  const ids = [];
  for (const id of candidates) {
    if (!id || ids.includes(id) || !canTrainUnit(id)) continue;
    ids.push(id);
    if (ids.length >= MAX_BATTLE_TEAM) break;
  }
  return ids.length === MAX_BATTLE_TEAM ? ids : defaultBattleTeamIds.filter((id) => canTrainUnit(id)).slice(0, MAX_BATTLE_TEAM);
}

function createTrainingRun(teamIds) {
  const safeTeamIds = teamIds.slice(0, MAX_BATTLE_TEAM);
  const members = Object.fromEntries(
    safeTeamIds.map((id) => {
      const unit = getBaseUnit(id);
      return [
        id,
        {
          ...baseProgress(unit),
          lastMessage: "4人チームの育成開始。行動ごとに重点対象を選べる。",
        },
      ];
    }),
  );
  return {
    id: makeTeamPresetId(),
    startedAt: Date.now(),
    teamIds: safeTeamIds,
    focusId: safeTeamIds[0],
    targetIds: [safeTeamIds[0]],
    members,
    relations: {},
    memoryLog: ["4人チーム育成を開始した。"],
    turn: 0,
    limit: trainingTurnLimitForLevel(),
    completed: false,
    completionRewarded: false,
    saved: false,
    progress: members[safeTeamIds[0]],
  };
}

function getTrainingMemberProgress(unitId) {
  const run = ensureTrainingRun();
  return run.members[unitId] ?? getProgress(unitId);
}

function replaceTrainingTeamMember(oldId, newId) {
  const run = ensureTrainingRun();
  if (run.turn > 0 || run.teamIds.includes(newId)) return;
  const index = Math.max(0, run.teamIds.indexOf(oldId));
  const removed = run.teamIds[index];
  run.teamIds[index] = newId;
  delete run.members[removed];
  const unit = getBaseUnit(newId);
  run.members[newId] = {
    ...baseProgress(unit),
    lastMessage: `${unit.name}がチーム育成に参加した。`,
  };
  run.targetIds = [newId];
  run.focusId = newId;
  run.memoryLog.push(`${getBaseUnit(removed)?.name ?? "メンバー"}と交代して${unit.name}が加入。`);
}

function pickTrainingTalkScene(unit, progress) {
  const library = talkLibrary[unit.id] ?? [];
  const tier = progress.bond >= 70 ? "high" : progress.bond >= 40 ? "mid" : "early";
  const pool = library.filter((scene) => scene.tier === tier);
  return pick(pool.length ? pool : library);
}

function rollTrainingRandomGrowth(actionId) {
  const table = actionId === "rest" ? ["maxHp", "def", "knowledge"] : ["maxHp", "atk", "def", "knowledge", "knowledge"];
  const stat = pick(table);
  const amount = stat === "maxHp" ? randomInt(1, 4) : randomInt(1, 2);
  return { stat, amount, label: { maxHp: "最大HP", atk: "攻撃", def: "防御", knowledge: "知識" }[stat] };
}

function applyTrainingRandomGrowth(progress, growth) {
  if (growth.stat === "maxHp") {
    progress.maxHp = clamp(progress.maxHp + growth.amount, 1, 999);
    return;
  }
  progress[growth.stat] = clamp((progress[growth.stat] ?? 0) + growth.amount, growth.stat === "def" ? 0 : 1, 999);
}

function applyTrainingAffinity(unit, actionId, deltas, choice) {
  const affinity = growthAffinities[unit.id]?.[actionId] ?? 0;
  if (!affinity) return "";
  if (affinity > 0) {
    if (actionId === "bond") deltas.def += affinity;
    if (actionId === "power") {
      deltas.atk += affinity;
      deltas.def += Math.max(1, Math.floor(affinity / 2));
    }
    if (actionId === "date") deltas.hp += affinity * 3;
    if (actionId === "strategy") deltas.knowledge += affinity * 2;
    if (actionId === "rest") deltas.hp += affinity * 2;
    deltas.bond += Math.max(1, Math.floor(affinity / 2));
    return `${growthAffinities[unit.id].favorite}で伸びやすい`;
  }

  const penalty = Math.abs(affinity);
  if (actionId === "power") deltas.hp -= penalty * 2;
  if (actionId === "strategy") deltas.atk -= penalty;
  if (actionId === "rest") deltas.bond -= penalty;
  if (actionId === "bond") deltas.def -= penalty;
  choice.mood = choice.mood === "恋愛中" ? "ごきげん" : "落ち込み";
  return `${growthAffinities[unit.id].weak}で伸びにくい`;
}

function applyAccessoryTrainingBonus(unit, actionId, deltas, choice, progress) {
  const inventory = getInventory();
  const notes = [];
  if (unit.id === "ren" && (inventory.dogRibbon ?? 0) > 0) {
    deltas.bond += 1;
    notes.push("犬用リボン");
  }
  if (unit.id === "yui" && (inventory.catToy ?? 0) > 0 && randomChance(0.45)) {
    choice.mood = "ごきげん";
    progress.jealousy = clamp((progress.jealousy ?? 0) - 2, 0, 100);
    notes.push("猫じゃらし");
  }
  if (unit.id === "non" && actionId === "rest" && (inventory.fluffyBlanket ?? 0) > 0) {
    deltas.hp += 4;
    notes.push("ふわふわ毛布");
  }
  if (unit.id === "riko" && (inventory.carrotCharm ?? 0) > 0 && randomChance(0.45)) {
    choice.mood = "ごきげん";
    deltas.bond += 1;
    notes.push("にんじんチャーム");
  }
  if (actionId === "strategy" && (inventory.strategyMemo ?? 0) > 0) {
    deltas.knowledge += 2;
    notes.push("作戦メモ");
  }
  if ((progress.hunger ?? 80) <= 28 && (inventory.lunchBox ?? 0) > 0) {
    progress.hunger = clamp((progress.hunger ?? 80) + 8, 0, 100);
    notes.push("お弁当");
  }
  return notes.join("効果/");
}

function applyCommanderTrainingQuirk(unit, actionId, deltas, choice, progress) {
  if (unit.team !== "enemy") return "";
  if (unit.id === "king") {
    deltas.atk += 2;
    deltas.bond -= 1;
    if ((progress.bond ?? 0) < 25 && randomChance(0.18)) choice.mood = "怒り";
    return "支配欲: 攻撃は伸びるが親密度は上がりにくい";
  }
  if (unit.id === "shade2") {
    deltas.def += 2;
    if ((progress.bond ?? 0) >= 55) deltas.bond += 2;
    return "銀狼護衛: 防御特化";
  }
  if (unit.id === "shade1") {
    deltas.atk += Math.floor((progress.jealousy ?? 0) / 25);
    progress.jealousy = clamp((progress.jealousy ?? 0) + (actionId === "bond" ? 1 : 4), 0, 100);
    return "豹妬: 嫉妬が火力へ変換";
  }
  if (unit.id === "shade3") {
    deltas.knowledge += 3;
    if (actionId === "rest") deltas.hp -= 2;
    return "鹿角集中: 知識特化";
  }
  return "";
}

function hungerWarningText(progress) {
  const hunger = progress?.hunger ?? 80;
  if (hunger <= 0) return "限界空腹。大きく崩れるが、低確率で覚醒する。";
  if (hunger <= 18) return "限界に近い空腹。失敗リスク大、成功すれば伸びも大きい。";
  if (hunger <= 32) return "空腹。安定しないが、追い込み成功で成長が跳ねる。";
  return "";
}

function applyPreActionHungerPenalty(progress) {
  const hunger = progress.hunger ?? 80;
  if (hunger > 32) return null;
  const severe = hunger <= 18;
  const awakening = severe && randomChance(hunger <= 6 ? 0.18 : 0.1);
  const overdrive = !awakening && randomChance(severe ? 0.32 : 0.45);
  if (awakening || overdrive) {
    const stat = pick(["atk", "def", "knowledge"]);
    const gain = awakening ? randomInt(4, 8) : randomInt(2, 4);
    progress[stat] = clamp((progress[stat] ?? 0) + gain, stat === "def" || stat === "knowledge" ? 0 : 1, 999);
    progress.hunger = clamp(hunger - (awakening ? 12 : 6), 0, 100);
    progress.mood = awakening ? "集中" : progress.mood;
    return `${awakening ? "限界空腹の覚醒" : "空腹追い込み成功"} / ${trainingStatName(stat)}+${gain}`;
  }
  const hpLoss = severe ? randomInt(4, 10) : randomInt(1, 4);
  const stat = pick(["atk", "def", "knowledge"]);
  const loss = severe ? randomInt(1, 3) : 1;
  progress.maxHp = clamp(progress.maxHp - hpLoss, 1, 999);
  progress[stat] = clamp((progress[stat] ?? 0) - loss, stat === "def" || stat === "knowledge" ? 0 : 1, 999);
  progress.hunger = clamp(hunger - (severe ? 8 : 4), 0, 100);
  progress.mood = severe ? "落ち込み" : progress.mood;
  return `空腹失敗 HP-${hpLoss} / ${trainingStatName(stat)}-${loss}`;
}

function trainingStatName(stat) {
  return { maxHp: "最大HP", atk: "攻撃", def: "防御", knowledge: "知識", move: "移動" }[stat] ?? stat;
}

function trainingMiniGameHtml(game) {
  if (game.type === "breakout") {
    return `
      <div class="training-minigame canvas-mini">
        <strong>実戦ミニゲーム: ブロック崩し</strong>
        <span>A/Dキー、マウス、タッチでバーを動かす。崩したブロック数で攻防ボーナスと終了後の会話が変わる。</span>
        <b>${game.status} / 破壊 ${game.broken ?? 0}/${game.bricks?.length ?? 0} / LIFE ${game.lives}</b>
        <canvas id="trainingMiniCanvas" width="420" height="240" aria-label="ブロック崩し"></canvas>
        <div class="mini-command-grid">
          <button class="choice-btn" type="button" data-training-mini-start>スタート</button>
          <button class="choice-btn" type="button" data-training-mini-finish>結果を確定</button>
        </div>
      </div>
    `;
  }

  if (game.type === "snake") {
    return `
      <div class="training-minigame canvas-mini">
        <strong>実戦ミニゲーム: スネーク</strong>
        <span>W/A/S/Dキーで進む。${Math.round((game.survivalMs ?? 12000) / 1000)}秒生き延びると成功。おやつは少しだけ加点。</span>
        <b>${game.status} / 生存 ${formatSnakeSurvival(game)} / SCORE ${game.score}</b>
        <canvas id="trainingMiniCanvas" width="360" height="240" aria-label="スネーク"></canvas>
        <div class="snake-pad">
          <button type="button" data-training-mini-dir="up">W 上</button>
          <button type="button" data-training-mini-dir="left">A 左</button>
          <button type="button" data-training-mini-start>開始</button>
          <button type="button" data-training-mini-dir="right">D 右</button>
          <button type="button" data-training-mini-dir="down">S 下</button>
          <button type="button" data-training-mini-finish>結果</button>
        </div>
      </div>
    `;
  }

  const remaining = game.maxRounds - game.round;
  return `
    <div class="training-minigame">
      <strong>実戦ミニゲーム: 合図反応</strong>
      <span>あにあにの反射ゲーム風。${game.target.label}を選ぶと成功。</span>
      <b>残り${remaining}回 / 成功${game.score} / 失敗${game.miss}</b>
      <div class="mini-command">${game.target.label}</div>
      <div class="mini-command-grid">
        ${trainingMiniTargets
          .map((target) => `<button class="choice-btn" type="button" data-training-mini="${target.id}">${target.key} ${target.label}</button>`)
          .join("")}
      </div>
    </div>
  `;
}

function startTrainingMiniGame(unit, event, choice) {
  clearTrainingMiniLoop();
  const type = choice.mini || "reaction";
  state.trainingOverlayMode = "";
  state.trainingPresetOverlayOpen = false;
  state.trainingMiniGame = {
    type,
    unitId: unit.id,
    targetIds: event.targetIds ?? [unit.id],
    event,
    choice,
    line: `${unit.name}: ${characterLine(unit, type === "breakout" ? "守りを割る練習、いくよ" : type === "snake" ? "軌道を読んで、ぶつからないように進もう" : "合図を見て、正しい動きを選んで")}`,
    round: 0,
    maxRounds: 5,
    score: 0,
    miss: 0,
    target: pick(trainingMiniTargets),
    status: "準備中",
  };
  if (type === "breakout") setupTrainingBreakout(state.trainingMiniGame);
  if (type === "snake") setupTrainingSnake(state.trainingMiniGame);
  renderTraining();
}

function playTrainingMiniGame(commandId) {
  const game = state.trainingMiniGame;
  if (!game || game.type !== "reaction") return;
  if (commandId === game.target.id) {
    game.score += 1;
  } else {
    game.miss += 1;
  }
  game.round += 1;
  if (game.round >= game.maxRounds) {
    finishTrainingMiniGame();
    return;
  }
  game.target = pick(trainingMiniTargets);
  renderTraining();
}

function miniGameScore(game) {
  if (!game) return 0;
  if (game.type === "reaction") return clamp(game.score * 20, 0, 100);
  if (game.type === "breakout") return clamp(Math.round(((game.broken ?? 0) / Math.max(1, game.bricks?.length ?? 1)) * 100), 0, 100);
  return clamp(game.score ?? 0, 0, 100);
}

function formatSnakeSurvival(game) {
  const elapsed = game.startedAt ? Date.now() - game.startedAt : 0;
  return `${Math.min(Math.ceil(elapsed / 1000), Math.round((game.survivalMs ?? 12000) / 1000))}秒/${Math.round((game.survivalMs ?? 12000) / 1000)}秒`;
}

function attachTrainingMiniControls() {
  const game = state.trainingMiniGame;
  if (!game) return;
  const root = trainingPresetOverlayEl && !trainingPresetOverlayEl.hidden ? trainingPresetOverlayEl : trainingChoicesEl;
  const canvas = document.querySelector("#trainingMiniCanvas");
  if (canvas && game.type === "breakout") {
    canvas.addEventListener("mousemove", (event) => setTrainingBreakoutPaddle(event.clientX));
    canvas.addEventListener(
      "touchmove",
      (event) => {
        if (event.touches[0]) setTrainingBreakoutPaddle(event.touches[0].clientX);
        event.preventDefault();
      },
      { passive: false },
    );
    drawTrainingBreakout();
  }
  if (canvas && game.type === "snake") {
    drawTrainingSnake();
  }
  root.querySelectorAll("[data-training-mini]").forEach((button) => {
    button.addEventListener("click", () => playTrainingMiniGame(button.dataset.trainingMini));
  });
  root.querySelectorAll("[data-training-mini-start]").forEach((button) => {
    button.addEventListener("click", () => startCanvasTrainingMini());
  });
  root.querySelectorAll("[data-training-mini-finish]").forEach((button) => {
    button.addEventListener("click", finishTrainingMiniGame);
  });
  root.querySelectorAll("[data-training-mini-dir]").forEach((button) => {
    button.addEventListener("click", () => setTrainingSnakeDirection(button.dataset.trainingMiniDir));
  });
}

function startCanvasTrainingMini() {
  const game = state.trainingMiniGame;
  if (!game || game.running) return;
  game.running = true;
  game.status = "プレイ中";
  game.startedAt = Date.now();
  if (game.type === "breakout") {
    trainingMiniRaf = window.requestAnimationFrame(trainingBreakoutFrame);
  }
  if (game.type === "snake") {
    clearTrainingMiniLoop();
    game.running = true;
    trainingMiniInterval = window.setInterval(trainingSnakeTick, 260);
    drawTrainingSnake();
  }
  renderTraining();
}

function setupTrainingBreakout(game) {
  game.status = "準備中";
  game.score = 0;
  game.broken = 0;
  game.lives = 5;
  game.ball = { x: 210, y: 198, vx: 1.35, vy: -1.75, r: 8 };
  game.paddle = { x: 145, y: 220, w: 130, h: 12 };
  game.bricks = Array.from({ length: 12 }, (_, index) => ({
    x: 34 + (index % 6) * 58,
    y: 28 + Math.floor(index / 6) * 34,
    w: 48,
    h: 24,
    alive: true,
  }));
}

function setTrainingBreakoutPaddle(clientX) {
  const game = state.trainingMiniGame;
  const canvas = document.querySelector("#trainingMiniCanvas");
  if (!game || game.type !== "breakout" || !canvas) return;
  const rect = canvas.getBoundingClientRect();
  const localX = (clientX - rect.left) * (canvas.width / rect.width);
  game.paddle.x = clamp(localX - game.paddle.w / 2, 0, canvas.width - game.paddle.w);
  if (!game.running) drawTrainingBreakout();
}

function nudgeTrainingBreakoutPaddle(direction) {
  const game = state.trainingMiniGame;
  const canvas = document.querySelector("#trainingMiniCanvas");
  if (!game || game.type !== "breakout" || !canvas) return;
  game.paddle.x = clamp(game.paddle.x + direction * 28, 0, canvas.width - game.paddle.w);
  if (!game.running) drawTrainingBreakout();
}

function drawTrainingBreakout() {
  const game = state.trainingMiniGame;
  const canvas = document.querySelector("#trainingMiniCanvas");
  const ctx = canvas?.getContext("2d");
  if (!game || game.type !== "breakout" || !ctx) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#edf7f4";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const unit = getBaseUnit(game.unitId);
  const image = getCachedImage(unit?.art);
  for (const brick of game.bricks) {
    if (!brick.alive) continue;
    ctx.save();
    ctx.beginPath();
    ctx.roundRect(brick.x, brick.y, brick.w, brick.h, 6);
    ctx.clip();
    if (image?.complete) ctx.drawImage(image, brick.x, brick.y - 14, brick.w, brick.h + 28);
    else {
      ctx.fillStyle = "#d9f0ed";
      ctx.fillRect(brick.x, brick.y, brick.w, brick.h);
    }
    ctx.restore();
    ctx.strokeStyle = "#127c7c";
    ctx.strokeRect(brick.x, brick.y, brick.w, brick.h);
  }
  ctx.fillStyle = "#20242a";
  ctx.fillRect(game.paddle.x, game.paddle.y, game.paddle.w, game.paddle.h);
  ctx.beginPath();
  ctx.arc(game.ball.x, game.ball.y, game.ball.r, 0, Math.PI * 2);
  ctx.fillStyle = "#d94f45";
  ctx.fill();
}

function trainingBreakoutFrame() {
  const game = state.trainingMiniGame;
  const canvas = document.querySelector("#trainingMiniCanvas");
  if (!game || game.type !== "breakout" || !game.running || !canvas) return;
  const ball = game.ball;
  if (trainingMiniKeys.has("a")) nudgeTrainingBreakoutPaddle(-1);
  if (trainingMiniKeys.has("d")) nudgeTrainingBreakoutPaddle(1);
  ball.x += ball.vx;
  ball.y += ball.vy;
  if (ball.x - ball.r <= 0 || ball.x + ball.r >= canvas.width) ball.vx *= -1;
  if (ball.y - ball.r <= 0) ball.vy = Math.abs(ball.vy);
  if (
    ball.vy > 0 &&
    ball.y + ball.r >= game.paddle.y &&
    ball.y - ball.r <= game.paddle.y + game.paddle.h &&
    ball.x >= game.paddle.x &&
    ball.x <= game.paddle.x + game.paddle.w
  ) {
    ball.y = game.paddle.y - ball.r;
    ball.vy = -Math.abs(ball.vy);
    ball.vx = ((ball.x - (game.paddle.x + game.paddle.w / 2)) / (game.paddle.w / 2)) * 4;
  }
  for (const brick of game.bricks) {
    if (!brick.alive) continue;
    const hitX = ball.x + ball.r >= brick.x && ball.x - ball.r <= brick.x + brick.w;
    const hitY = ball.y + ball.r >= brick.y && ball.y - ball.r <= brick.y + brick.h;
    if (hitX && hitY) {
      brick.alive = false;
      ball.vy *= -1;
      game.broken = (game.broken ?? 0) + 1;
      game.score = game.broken;
      break;
    }
  }
  if (!game.bricks.some((brick) => brick.alive)) {
    game.status = "クリア";
    finishTrainingMiniGame();
    return;
  }
  if (ball.y - ball.r > canvas.height) {
    game.lives -= 1;
    if (game.lives <= 0) {
      game.status = "終了";
      finishTrainingMiniGame();
      return;
    }
    ball.x = canvas.width / 2;
    ball.y = 200;
    ball.vx = randomChance(0.5) ? 1.35 : -1.35;
    ball.vy = -1.75;
  }
  drawTrainingBreakout();
  trainingMiniRaf = window.requestAnimationFrame(trainingBreakoutFrame);
}

function setupTrainingSnake(game) {
  game.status = "準備中";
  game.score = 0;
  game.foodBonus = 0;
  game.survivalMs = 12000;
  game.cols = 10;
  game.rows = 8;
  game.snake = [
    { x: 4, y: 4 },
    { x: 3, y: 4 },
  ];
  game.dir = { x: 1, y: 0 };
  game.nextDir = { x: 1, y: 0 };
  game.food = { x: 7, y: 4 };
}

function setTrainingSnakeDirection(dir) {
  const game = state.trainingMiniGame;
  if (!game || game.type !== "snake") return;
  const map = { up: { x: 0, y: -1 }, down: { x: 0, y: 1 }, left: { x: -1, y: 0 }, right: { x: 1, y: 0 } };
  const next = map[dir];
  if (!next) return;
  if (next.x === -game.dir.x && next.y === -game.dir.y) return;
  game.nextDir = next;
}

function handleTrainingMiniKeydown(event) {
  const game = state.trainingMiniGame;
  if (!game || trainingScreenEl.hidden) return;
  const key = event.key.toLowerCase();
  if (!["w", "a", "s", "d", "arrowup", "arrowdown", "arrowleft", "arrowright"].includes(key)) return;
  if (game.type === "reaction" && event.repeat) {
    event.preventDefault();
    return;
  }
  if ((game.type === "snake" || game.type === "breakout") && !game.running) startCanvasTrainingMini();
  trainingMiniKeys.add(key);
  const directionMap = {
    w: "up",
    a: "left",
    s: "down",
    d: "right",
    arrowup: "up",
    arrowleft: "left",
    arrowdown: "down",
    arrowright: "right",
  };
  const dir = directionMap[key];
  if (game.type === "snake") setTrainingSnakeDirection(dir);
  if (game.type === "breakout" && key === "a") nudgeTrainingBreakoutPaddle(-1);
  if (game.type === "breakout" && key === "d") nudgeTrainingBreakoutPaddle(1);
  if (game.type === "reaction") {
    const target = { w: "up", a: "left", s: "down", d: "right", arrowup: "up", arrowleft: "left", arrowdown: "down", arrowright: "right" }[key];
    if (target) playTrainingMiniGame(target);
  }
  event.preventDefault();
}

function handleTrainingMiniKeyup(event) {
  trainingMiniKeys.delete(event.key.toLowerCase());
}

function trainingSnakeTick() {
  const game = state.trainingMiniGame;
  if (!game || game.type !== "snake" || !game.running) return;
  const elapsed = Date.now() - (game.startedAt ?? Date.now());
  game.score = clamp(Math.floor((elapsed / (game.survivalMs ?? 12000)) * 85) + (game.foodBonus ?? 0), 0, 100);
  if (elapsed >= (game.survivalMs ?? 12000)) {
    game.status = "成功";
    game.score = Math.max(80, game.score);
    finishTrainingMiniGame();
    return;
  }
  game.dir = { ...game.nextDir };
  const head = game.snake[0];
  const next = { x: head.x + game.dir.x, y: head.y + game.dir.y };
  const hitWall = next.x < 0 || next.y < 0 || next.x >= game.cols || next.y >= game.rows;
  const hitSelf = game.snake.some((part) => part.x === next.x && part.y === next.y);
  if (hitWall || hitSelf) {
    game.status = `ぶつかった ${formatSnakeSurvival(game)}`;
    finishTrainingMiniGame();
    return;
  }
  game.snake.unshift(next);
  if (next.x === game.food.x && next.y === game.food.y) {
    game.foodBonus = clamp((game.foodBonus ?? 0) + 8, 0, 24);
    spawnTrainingSnakeFood(game);
  } else {
    game.snake.pop();
  }
  drawTrainingSnake();
}

function spawnTrainingSnakeFood(game) {
  let next = { x: 0, y: 0 };
  let guard = 0;
  do {
    next = { x: randomInt(0, game.cols - 1), y: randomInt(0, game.rows - 1) };
    guard += 1;
  } while (guard < 80 && game.snake.some((part) => part.x === next.x && part.y === next.y));
  game.food = next;
}

function drawTrainingSnake() {
  const game = state.trainingMiniGame;
  const canvas = document.querySelector("#trainingMiniCanvas");
  const ctx = canvas?.getContext("2d");
  if (!game || game.type !== "snake" || !ctx) return;
  const cellW = canvas.width / game.cols;
  const cellH = canvas.height / game.rows;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.fillStyle = "#f7f4ec";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  ctx.strokeStyle = "rgba(32,36,42,0.12)";
  for (let x = 1; x < game.cols; x += 1) {
    ctx.beginPath();
    ctx.moveTo(x * cellW, 0);
    ctx.lineTo(x * cellW, canvas.height);
    ctx.stroke();
  }
  for (let y = 1; y < game.rows; y += 1) {
    ctx.beginPath();
    ctx.moveTo(0, y * cellH);
    ctx.lineTo(canvas.width, y * cellH);
    ctx.stroke();
  }
  ctx.fillStyle = "#d49b28";
  ctx.fillRect(game.food.x * cellW + 4, game.food.y * cellH + 4, cellW - 8, cellH - 8);
  const unit = getBaseUnit(game.unitId);
  const image = getCachedImage(unit?.art);
  game.snake.forEach((part, index) => {
    const x = part.x * cellW + 3;
    const y = part.y * cellH + 3;
    if (index === 0 && image?.complete) {
      ctx.drawImage(image, x, y, cellW - 6, cellH - 6);
    } else {
      ctx.fillStyle = index === 0 ? "#127c7c" : "#6fb7a9";
      ctx.fillRect(x, y, cellW - 6, cellH - 6);
    }
  });
}

function clearTrainingMiniLoop() {
  trainingMiniKeys.clear();
  if (trainingMiniRaf) {
    window.cancelAnimationFrame(trainingMiniRaf);
    trainingMiniRaf = null;
  }
  if (trainingMiniInterval) {
    window.clearInterval(trainingMiniInterval);
    trainingMiniInterval = null;
  }
}

const imageCache = new Map();

function getCachedImage(src) {
  if (!src) return null;
  if (!imageCache.has(src)) {
    const image = new Image();
    image.src = src;
    imageCache.set(src, image);
  }
  return imageCache.get(src);
}

function finishTrainingMiniGame() {
  const game = state.trainingMiniGame;
  if (!game) return;
  clearTrainingMiniLoop();
  const score = miniGameScore(game);
  const bonus = score >= 70 ? 5 : score >= 45 ? 3 : score >= 20 ? 1 : 0;
  const label = game.type === "breakout" ? "ブロック崩し" : game.type === "snake" ? "スネーク" : "合図反応";
  const detail =
    game.type === "breakout"
      ? `${label} ${game.broken ?? 0}/${game.bricks?.length ?? 0}個破壊 スコア${score}${bonus ? ` ボーナス+${bonus}` : ""}`
      : game.type === "snake"
        ? `${label} ${formatSnakeSurvival(game)} スコア${score}${bonus ? ` ボーナス+${bonus}` : ""}`
        : `${label}スコア${score}${bonus ? ` ボーナス+${bonus}` : ""}`;
  applyTrainingChoiceToTeam(game.choice, "power", game.targetIds ?? [game.unitId], bonus, detail);
  const run = ensureTrainingRun();
  const nextEvent = buildSpontaneousTrainingEvent(run, "power", game.targetIds ?? [game.unitId]);
  const unit = getBaseUnit(game.unitId);
  const afterLine = trainingMiniAfterLine(unit, game, score, bonus);
  state.trainingMiniGame = null;
  state.trainingEvent = {
    id: "post-mini",
    postTalk: true,
    targetIds: game.targetIds ?? [game.unitId],
    line: characterLine(unit, afterLine),
    choices: [{ label: "結果を見る" }],
    nextEvent,
    showResultAfter: true,
  };
  state.trainingOverlayMode = "";
  renderTraining();
}

function trainingMiniAfterLine(unit, game, score, bonus) {
  if (game.type === "breakout") {
    const broken = game.broken ?? 0;
    if (broken >= 10) return `${unit.name}は壊したブロックを数えて、少し得意げに笑った。かなり手応えがあったみたいだ。攻防の伸びも大きい。`;
    if (broken >= 5) return `${unit.name}は息を整えて、次はもっと崩せると頷いた。練習の成果はちゃんと出ている。`;
    return `${unit.name}は悔しそうに画面を見た。でも、どこで崩れたかは覚えたみたいだ。次はもう少し伸びそう。`;
  }
  if (game.type === "snake") {
    if (score >= 70) return `${unit.name}は最後まで軌道を見失わなかった。生き延びた自信が、そのまま次の読み筋につながっている。`;
    if (score >= 35) return `${unit.name}は途中で少し焦ったけれど、粘れたことを嬉しそうにしている。`;
    return `${unit.name}はぶつかった瞬間に肩を落とした。でも、次は焦らず進めばいいと分かったみたいだ。`;
  }
  if (score >= 70) return `${unit.name}は合図に素早く反応できて、かなりごきげんだ。体が先に動く感覚を掴んだみたい。`;
  return `${unit.name}は少し悔しそうだけど、合図を見る場所は分かってきたみたいだ。`;
}

function trainingOpeningLine(unit, progress, run = ensureTrainingRun()) {
  if (run.completed) return `${run.limit}ターンのチーム育成は完了。名前を付けてチームプリセット保存しよう。`;
  return `今日はなにをする？ 行動を選んだあと、誰とするかを決めよう。現在の注目は${unit.name}。`;
}

function trainingFlavor(unit, actionId) {
  const flavor = {
    ren: { bond: "蓮はすぐ隣に座って、目をきらきらさせている。", power: "走る準備だけは完璧だ。", date: "購買の方をちらちら見ている。", strategy: "難しい顔でノートを覗き込む。", rest: "褒められる準備をして待っている。" },
    yui: { bond: "結衣は聞いてほしそうな顔をして、聞かれたら逃げそうでもある。", power: "やる気は気分次第。でも今日は少し乗っている。", date: "新作スイーツの気配に耳が動いた。", strategy: "斜めの線だけ妙に真剣に見ている。", rest: "休むなら構いすぎない距離がよさそう。" },
    mio: { bond: "美桜は軽口を叩きながらも、こちらをよく見ている。", power: "自由に動ける練習なら乗り気だ。", date: "寄り道の風向きを読んでいる。", strategy: "作戦を固めすぎないよう釘を刺してくる。", rest: "屋上で風を浴びる案を出してきた。" },
    honoka: { bond: "歩太は少し緊張しているが、逃げずに待っている。", power: "怖がりながらも一歩前に出た。", date: "人の少ない場所なら安心できそう。", strategy: "説明を聞くと目の揺れが少し落ち着く。", rest: "静かな時間にほっとしている。" },
    kaeru: { bond: "蛙瑠は最初から話題を三段飛ばししてくる。", power: "跳ねる練習なのに、着地点を見ていない。", date: "寄り道先で謎の実験を始めそうだ。", strategy: "普通の作戦を横から裏返している。", rest: "休むと言いながら変な図を描いている。" },
    riko: { bond: "莉胡は褒め待ちの顔で、こちらをじっと見ている。", power: "かわいい着地まで含めて練習したいらしい。", date: "おやつと小物の棚を交互に見ている。", strategy: "かわいく勝つ作戦にこだわっている。", rest: "休憩中もリボンの角度を気にしている。" },
    ibuki: { bond: "伊吹は話しながらも今すぐ走り出しそうだ。", power: "直線練習なら目が燃えている。", date: "寄り道も全力で歩く気らしい。", strategy: "作戦ノートの端に炎を描いている。", rest: "休むことすら助走だと思っている。" },
    non: { bond: "乃音はゆっくり座って、こちらの言葉を待っている。", power: "一歩進んで、ちゃんと息を整えている。", date: "人の少ないベンチを探している。", strategy: "ゆっくりなら最後まで聞けそうだ。", rest: "すでに半分眠そうだけど、安心している。" },
    king: { bond: "黒獅子王は腕を組み、こちらを試すように見下ろしている。", power: "王の一撃を見せる気で構えている。", date: "校舎の影を王城の回廊みたいに歩いている。", strategy: "敗因分析だけは真面目に聞くつもりらしい。", rest: "休むことを敗北と呼ぶか迷っている。" },
    shade2: { bond: "銀狼シオンは短い返事だけで距離を測っている。", power: "静かな足運びで刃筋を確認している。", date: "人の少ない裏庭なら付き合う気配がある。", strategy: "余計な装飾のない作戦にだけ頷く。", rest: "壁際で静かに息を整えている。" },
    shade1: { bond: "豹妬レイラは、最初に自分を見たかどうかを気にしている。", power: "目立てる練習なら機嫌が少し上向く。", date: "鏡のある店先で足を止めている。", strategy: "自分が主役になる盤面図を求めてくる。", rest: "休むと言いながら視線だけは外さない。" },
    shade3: { bond: "鹿角ノアは言葉の正確さを採点している。", power: "勢いだけの練習には眉をひそめている。", date: "静かな書店なら同行してもよさそうだ。", strategy: "作戦ノートを開いた瞬間だけ、少し表情が和らぐ。", rest: "休息も計画の一部として記録している。" },
  };
  return flavor[unit.id]?.[actionId] ?? "その子らしい間合いで、今日の成長が始まる。";
}

function trainingTeamPresetPanelHtml(run) {
  const presets = getTeamPresetList();
  const activeId = getActiveTeamPresetId();
  const activePreset = presets.find((preset) => preset.id === activeId) ?? presets[presets.length - 1];
  const rows = activePreset
    ? `
      <div class="preset-row active compact-preset-row">
        <div>
          <strong>${escapeHtml(activePreset.name)}</strong>
          <small>${activePreset.teamType} / ${activePreset.members.map((member) => `${member.name}:${member.trainingType}`).join(" ")}</small>
        </div>
      </div>
    `
    : `<p class="preset-empty">まだチームプリセットなし。チーム育成を完走すると保存できる。</p>`;
  const savePanel = `
      <div class="preset-save">
        <input id="trainingPresetName" type="text" maxlength="28" value="${escapeHtml(`${run.completed ? "完走" : "途中"}チーム${presets.length + 1}`)}" aria-label="チームプリセット名">
        <button class="primary-btn" type="button" data-save-training>${run.completed ? "チームプリセット保存" : "途中保存"}</button>
        <button type="button" data-new-training>新しく育成開始</button>
      </div>
      <p class="preset-empty">${run.limit}ターン完走で本登録。途中保存もこの時点の4人、相関、ログを残せる。</p>
    `;
  return `
    <div class="preset-panel">
      <strong>チームプリセット ${presets.length}/${MAX_TEAM_PRESETS}</strong>
      ${savePanel}
      <button class="plain-btn wide-btn" type="button" data-team-presets-open>一覧を開く</button>
      <div class="preset-list">${rows}</div>
    </div>
  `;
}

function renderTrainingProfile(unit, progress, run = ensureTrainingRun()) {
  if (!trainingProfileEl) return;
  trainingProfileEl.innerHTML = progressStatsHtml(unit, progress, run);
}

function trainingProfilePanelHtml(unit, progress) {
  const profile = playerProfiles[unit.id];
  const affinity = growthAffinities[unit.id] ?? {};
  const hungry = hungerWarningText(progress);
  return `
    <strong>${unit.name} / ${profile.personality}</strong>
    <span>${profile.animal}コスプレ / ${unit.piece} / ${unit.className}</span>
    <p>${profile.talkStyle}</p>
    <small>好き: ${affinity.favorite ?? "まだ不明"} / 苦手: ${affinity.weak ?? "まだ不明"}</small>
    ${hungry ? `<b class="hunger-alert">${hungry}</b>` : ""}
  `;
}

function attachTrainingPresetHandlers(unit, progress, run = ensureTrainingRun()) {
  const presetRoot = trainingLogPanelEl ?? trainingStatsEl;
  attachTrainingSaveControls(presetRoot, progress, run);
  presetRoot.querySelector("[data-training-log-open]")?.addEventListener("click", () => {
    state.trainingOverlayMode = "logs";
    state.trainingPresetOverlayOpen = false;
    renderTraining();
  });
  presetRoot.querySelector("[data-team-presets-open]")?.addEventListener("click", () => {
    state.trainingOverlayMode = "presets";
    state.trainingPresetOverlayOpen = true;
    renderTraining();
  });
}

function attachTrainingSaveControls(root, progress, run = ensureTrainingRun()) {
  const saveButton = root.querySelector("[data-save-training]");
  if (saveButton) {
    saveButton.addEventListener("click", () => {
      const input = root.querySelector("#trainingPresetName");
      const result = saveTeamPresetFromRun(run, input?.value || "チーム育成");
      progress.lastMessage = result.ok ? `${result.preset.name}として保存した。battle編成でチーム出撃できる。` : result.message;
      if (result.ok) {
        run.saved = true;
        if (run.completed) clearAutoSavedTrainingRun();
        else autoSaveTrainingRun(run);
      }
      renderTraining();
    });
  }
  root.querySelectorAll("[data-team-preset-activate]").forEach((button) => {
    button.addEventListener("click", () => {
      setActiveTeamPreset(button.dataset.teamPresetActivate);
      if (root === trainingPresetOverlayEl) {
        state.trainingPresetOverlayOpen = false;
        state.trainingOverlayMode = "";
      }
      renderTraining();
    });
  });
  root.querySelectorAll("[data-team-preset-rename]").forEach((button) => {
    button.addEventListener("click", () => {
      const preset = getTeamPresetList().find((candidate) => candidate.id === button.dataset.teamPresetRename);
      const name = window.prompt("新しいチーム名", preset?.name || "");
      if (name !== null) {
        renameTeamPreset(button.dataset.teamPresetRename, name);
        renderTraining();
      }
    });
  });
  root.querySelectorAll("[data-team-preset-delete]").forEach((button) => {
    button.addEventListener("click", () => {
      const ok = window.confirm("このチームプリセットを削除しますか？");
      if (!ok) return;
      deleteTeamPreset(button.dataset.teamPresetDelete);
      renderTraining();
    });
  });
  root.querySelectorAll("[data-new-training]").forEach((button) => {
    button.addEventListener("click", () => {
      state.trainingRun = null;
      state.trainingEvent = null;
      state.trainingMiniGame = null;
      state.trainingOverlayMode = "";
      state.trainingPresetOverlayOpen = false;
      state.trainingTargetIds = [state.activeTrainingId];
      state.trainingSetupOpen = true;
      state.trainingSetupIds = normalizedTrainingTeamIds(state.activeTrainingId);
      renderTraining();
    });
  });
}

function attachTrainingPresetOverlayHandlers() {
  attachTrainingSaveControls(trainingPresetOverlayEl, getTrainingMemberProgress(state.activeTrainingId), ensureTrainingRun());
}

function renderCare() {
  renderGrowthRoster(careRosterEl, state.activeCareId, (id) => {
    state.activeCareId = id;
    state.careMessage = "";
    renderCare();
  });
  const unit = getBaseUnit(state.activeCareId);
  const progress = getProgress(unit.id);
  careArtEl.src = unit.art;
  careArtEl.alt = unit.name;
  careTitleEl.textContent = `${unit.name}と戯れる`;
  careReactionEl.textContent = state.careMessage || careOpeningLine(unit, progress);
  careResultEl.textContent = `戯れP ${getCarePoints()}。親密度${progress.bond}。高いほど触れ合いで能力が伸びやすい。`;
  careStatsEl.innerHTML = progressStatsHtml(unit, progress);
  document.querySelectorAll("[data-care-action]").forEach((button) => {
    const action = careActions[button.dataset.careAction];
    button.textContent = `${action.label} ${action.cost}P`;
    button.disabled = getCarePoints() < action.cost;
    button.onclick = () => applyCareAction(button.dataset.careAction);
  });
}

function applyCareAction(actionId) {
  const action = careActions[actionId];
  const unit = getBaseUnit(state.activeCareId);
  const progress = getProgress(unit.id);
  if (!spendCarePoints(action.cost)) {
    state.careMessage = `戯れPが足りない。推し駒battleで敵駒を倒すと手に入る。`;
    renderCare();
    return;
  }
  const preference = carePreference(unit.id, actionId);
  const successRate = clamp(0.28 + progress.bond / 150 + preference, 0.12, 0.92);
  const success = randomChance(successRate);
  if (success) {
    const bond = randomInt(...action.bond);
    const hp = randomInt(...action.hp);
    const statGain = action.stat === "move" ? (randomChance(0.22) ? 1 : 0) : randomInt(0, 2);
    progress.bond = clamp(progress.bond + bond, 0, 100);
    progress.maxHp = clamp(progress.maxHp + hp, 1, 999);
    progress[action.stat] = clamp(progress[action.stat] + statGain, action.stat === "def" ? 0 : 1, action.stat === "move" ? 9 : 999);
    progress.jealousy = clamp((progress.jealousy ?? 0) - 1, 0, 100);
    progress.mood = progress.bond >= 65 ? "恋愛中" : "ごきげん";
    progress.careCount += 1;
    progress.lastMessage = `${action.label}: 親密+${bond} / HP+${hp} / ${careStatLabel(action.stat)}+${statGain}`;
    state.careMessage = `${action.good} ${characterLine(unit, careReactionLine(unit, true))}`;
  } else {
    const bondLoss = randomInt(1, progress.bond < 25 ? 5 : 2);
    progress.bond = clamp(progress.bond - bondLoss, 0, 100);
    progress.jealousy = clamp((progress.jealousy ?? 0) + randomInt(2, 7), 0, 100);
    progress.mood = progress.bond < 20 ? "気まずい" : "落ち込み";
    const statLoss = progress.bond < 25 && randomChance(0.4) ? 1 : 0;
    if (statLoss) progress[action.stat] = clamp(progress[action.stat] - statLoss, action.stat === "def" ? 0 : 1, action.stat === "move" ? 9 : 999);
    progress.lastMessage = `${action.label}: 親密-${bondLoss} / 嫉妬上昇${statLoss ? ` / ${careStatLabel(action.stat)}-${statLoss}` : ""}`;
    state.careMessage = `${action.bad} ${characterLine(unit, careReactionLine(unit, false))}`;
  }
  setProgress(progress);
  renderCare();
}

function careOpeningLine(unit, progress) {
  if (progress.bond >= 70) return `${unit.name}はかなり近い距離で待っている。触れ合いも受け入れてくれそう。`;
  if (progress.bond >= 35) return `${unit.name}は様子を見ながらも、少し期待している。`;
  return `${unit.name}はまだ緊張している。いきなり距離を詰めすぎない方がよさそう。`;
}

function careReactionLine(unit, good) {
  const lines = {
    ren: good ? "えへへ、もう一回してほしいわん" : "びっくりしたけど、嫌いになったわけじゃないわん",
    yui: good ? "今のはまあ、悪くなかったにゃ" : "急に触るのは反則にゃ",
    mio: good ? "そういう距離感、たまにはええやん" : "ちょい待ち、今のは急やで",
    honoka: good ? "あの…少し安心しました…" : "ご、ごめんなさい…心の準備が…",
    kaeru: good ? "今の刺激で変な作戦を思いついたけろ" : "それは実験失敗けろ",
    riko: good ? "えへへ、ちゃんとかわいく扱ってねぴょん" : "雑なのはかわいくないぴょん",
    ibuki: good ? "よし、燃えてきた。次は一直線だ" : "うお、急に来ると熱が散るだろ",
    non: good ? "あったかくて、少し眠くなりました" : "びっくりしました…ゆっくりがいいです",
  };
  return lines[unit.id] ?? (good ? "嬉しい。" : "少し驚いた。");
}

function carePreference(id, actionId) {
  const preferences = {
    ren: { head: 0.18, cheek: -0.05, hand: 0.1 },
    yui: { head: -0.02, cheek: 0.05, hand: 0.08 },
    mio: { head: 0.03, cheek: -0.08, hand: 0.12 },
    honoka: { head: 0.1, cheek: -0.12, hand: 0.06 },
    kaeru: { head: 0.04, cheek: 0.06, hand: 0.14 },
    riko: { head: 0.12, cheek: 0.1, hand: 0.08 },
    ibuki: { head: 0.05, cheek: -0.06, hand: 0.16 },
    non: { head: 0.14, cheek: -0.08, hand: 0.08 },
  };
  return preferences[id]?.[actionId] ?? 0;
}

function careStatLabel(stat) {
  return { atk: "攻撃", def: "防御", move: "移動" }[stat] ?? stat;
}

function progressStatsHtml(unit, progress, run = null) {
  const turnLimit = run?.limit ?? Math.max(BASE_TRAIN_TURNS, progress.trainingTurns ?? 0);
  const shownTurn = run?.turn ?? progress.trainingTurns ?? 0;
  const typed = progress.completed ? finalizeProgressIdentity(progress) : progress;
  return `
    <img src="${unit.art}" alt="${unit.name}">
    <h3>${unit.name}</h3>
    <p>${unit.piece} / ${unit.className} / ${playerProfiles[unit.id].personality}</p>
    <div class="stat-grid growth-stat-grid">
      <div class="stat"><span>育成T</span><strong>${shownTurn}/${turnLimit}</strong></div>
      <div class="stat"><span>知識</span><strong>${progress.knowledge}</strong></div>
      <div class="stat"><span>HP</span><strong>${progress.maxHp}</strong></div>
      <div class="stat"><span>攻撃</span><strong>${progress.atk}</strong></div>
      <div class="stat"><span>防御</span><strong>${progress.def}</strong></div>
      <div class="stat"><span>移動</span><strong>${progress.move}</strong></div>
      <div class="stat"><span>親密</span><strong>${progress.bond}</strong></div>
      <div class="stat"><span>嫉妬</span><strong>${progress.jealousy ?? 0}</strong></div>
      <div class="stat"><span>タイプ</span><strong>${typed.trainingType}</strong></div>
      <div class="stat"><span>称号</span><strong>${typed.title}</strong></div>
    </div>
    <div class="detail-gauges">
      ${gaugeHtml("育成ターン", percent(shownTurn, turnLimit), "bond", `${shownTurn}/${turnLimit}`)}
      ${gaugeHtml("親密度", progress.bond, "bond")}
      ${gaugeHtml("嫉妬", progress.jealousy ?? 0, "jealousy")}
      ${gaugeHtml("おなか", progress.hunger ?? 80, "hunger")}
    </div>
    <small class="mood-help" title="${escapeHtml(moodTooltip(progress.mood))}">感情: ${progress.mood}（${emotionGroup(progress.mood)}）${run?.completed ? " / チーム育成済み" : ""}</small>
  `;
}

function makeBattlePlayerUnit(unit, index) {
  if (!unit) return null;
  const presetId = state.battlePresetIds[unit.id] || getActivePresetId(unit.id);
  const teamMember = state.battleTeamPreset?.members?.find((member) => member.id === unit.id);
  const progress = teamMember ? sanitizeProgress(unit.id, teamMember.progress) : getProgress(unit.id, presetId);
  const preset = getPresetList(unit.id).find((candidate) => candidate.id === presetId);
  const trainingType = progress.trainingType === "未判定" ? determineTrainingType(progress) : progress.trainingType;
  const personalSkill = personalSkillFor(unit.id, trainingType);
  const formation = playerFormation[index] ?? playerFormation[playerFormation.length - 1];
  return {
    ...unit,
    row: formation.row,
    col: formation.col,
    hp: progress.maxHp,
    maxHp: progress.maxHp,
    atk: progress.atk,
    def: progress.def,
    move: progress.move,
    knowledge: progress.knowledge ?? 0,
    skillUses: skillUsesFromKnowledge(progress.knowledge ?? 0),
    level: progress.level,
    bond: progress.bond,
    jealousy: progress.jealousy ?? 0,
    hunger: progress.hunger ?? randomInt(58, 82),
    mood: progress.mood ?? unit.mood,
    path: progress.path ?? unit.path,
    trainingType,
    title: progress.title === "未完の一手" ? determineTrainingTitle(progress) : progress.title,
    personalSkill,
    acted: false,
    moved: false,
    talked: false,
    focus: Math.floor((progress.bond ?? 0) / 20),
    needsAttention: false,
    temporaryAllyTurns: 0,
    promoted: false,
    promotionId: null,
    talkCursor: progress.trainingTurns ?? 0,
    presetId,
    teamPresetId: state.battleTeamPreset?.id || "",
    presetName: state.battleTeamPreset?.name || preset?.name || "基礎ステータス",
  };
}

function makeBattleEnemyUnit(unit) {
  return {
    ...unit,
    hp: unit.maxHp,
    acted: false,
    moved: false,
    talked: false,
    level: 1,
    knowledge: 0,
    skillUses: 0,
    jealousy: 0,
    hunger: 100,
    focus: 0,
    needsAttention: false,
    temporaryAllyTurns: 0,
    promoted: false,
    promotionId: null,
    talkCursor: 0,
  };
}

function resetGame() {
  clearMiniGameTimer();
  state.turn = 1;
  state.phase = "player";
  const teamIds = (state.battleTeamIds.length ? state.battleTeamIds : defaultBattleTeamIds).slice(0, MAX_BATTLE_TEAM);
  const battlePlayers = teamIds
    .map((id, index) => makeBattlePlayerUnit(getBaseUnit(id), index))
    .filter(Boolean);
  const battleEnemies = enemyBaseUnits().map((unit) => makeBattleEnemyUnit(unit));
  state.units = [...battlePlayers, ...battleEnemies];
  randomizeEnemyPositions(state.units);
  state.structures = initialStructures.map((structure) => {
    const spec = structureTypes[structure.type];
    return {
      ...structure,
      owner: spec.owner,
      hp: spec.maxHp,
      maxHp: spec.maxHp,
      def: spec.def,
    };
  });
  state.buildPoints = 4;
  state.wallMaterials = 0;
  state.nextStructureId = 1;
  state.activePanel = "detail";
  state.selectedId = null;
  state.mode = "inspect";
  state.legalMoves = [];
  state.legalTargets = [];
  state.legalCombos = [];
  state.legalBuilds = [];
  state.buildDraft = null;
  state.actionMenuHidden = false;
  state.editorOpen = false;
  state.editorTool = "enemy";
  state.comboUsed = false;
  state.currentTalk = null;
  state.lastTalkResult = null;
  state.miniGame = null;
  state.animation = null;
  state.storyChapter = 1;
  state.storyRoute = "common";
  state.postBattleRewards = [];
  state.battleActivityLog = [];
  state.battleTitles = [];
  state.battleStats = Object.fromEntries(battlePlayers.map((unit) => [unit.id, { kills: 0, captured: 0, protected: 0, combo: 0, comboFinisher: 0, damage: 0 }]));
  state.playerExpReward = "";
  state.result = null;
  state.log = [
    "放課後の盤上、開幕。王撃破か拠点制圧で勝利。",
    "育成パートで保存した推し駒が出撃中。会話とミニゲームでも少し伸びる。",
    "ショップで壁材を買うと、盤上に壁や建物を作れる。",
  ];
  rollAttentionNeeds(true);
  resultModalEl.hidden = true;
  render();
}

function render() {
  renderTop();
  renderRoster();
  renderBoard();
  renderDetail();
  renderActionMenu();
  renderStageEditor();
  renderTalk();
  renderLog();
}

function renderTop() {
  turnLabelEl.textContent = `Turn ${state.turn}`;
  phaseLabelEl.textContent = state.phase === "player" ? "味方フェイズ" : "敵フェイズ";
  const alive = playerUnits().filter((unit) => unit.hp > 0).length;
  aliveCountEl.textContent = `${alive}/${playerUnits().length}`;
  resultLabelEl.textContent = state.result ? state.result.title : "進行中";
  if (buildPointsLabelEl) {
    buildPointsLabelEl.textContent = `PLv${playerLevelInfo().level} / 建築P ${state.buildPoints} / 壁材 ${state.wallMaterials} / 戯れP ${getCarePoints()}`;
  }
}

function renderRoster() {
  rosterEl.innerHTML = "";
  for (const unit of playerUnits()) {
    const card = document.createElement("button");
    card.type = "button";
    card.className = [
      "unit-card",
      state.selectedId === unit.id ? "selected" : "",
      unit.hp <= 0 ? "down" : "",
    ]
      .filter(Boolean)
      .join(" ");
    card.innerHTML = `
      <div class="portrait">${portraitHtml(unit)}</div>
      <div>
        <div class="unit-card-head">
          <h3>${unit.name}</h3>
          <span class="mood-mark" title="${unit.mood}">${moodIcon(unit.mood)}</span>
          ${unit.needsAttention ? `<span class="attention-mark" title="かまってほしい">♥</span>` : ""}
        </div>
        <p>Lv${unit.level ?? 1} ${unit.className} / ${unit.mood}</p>
        <div class="mini-bars">
          ${gaugeHtml("HP", percent(unit.hp, unit.maxHp), "hp", unit.hp)}
          ${gaugeHtml("親密", unit.bond, "bond")}
          ${gaugeHtml("嫉妬", unit.jealousy, "jealousy")}
          ${gaugeHtml("おなか", unit.hunger ?? 100, "hunger")}
        </div>
      </div>
    `;
    card.addEventListener("click", () => selectUnit(unit.id));
    rosterEl.appendChild(card);
  }
}

function renderBoard() {
  boardEl.innerHTML = "";
  for (let row = 0; row < BOARD_SIZE; row += 1) {
    for (let col = 0; col < BOARD_SIZE; col += 1) {
      const cell = document.createElement("button");
      cell.type = "button";
      cell.className = getCellClasses(row, col).join(" ");
      cell.dataset.row = row;
      cell.dataset.col = col;
      cell.setAttribute("aria-label", `${row + 1}行 ${col + 1}列`);
      cell.addEventListener("click", () => handleCellClick(row, col));

      if (samePos({ row, col }, PLAYER_BASE)) {
        cell.insertAdjacentHTML("beforeend", `<span class="base-flag">自陣</span>`);
      }
      if (samePos({ row, col }, ENEMY_BASE)) {
        cell.insertAdjacentHTML("beforeend", `<span class="base-flag">制圧</span>`);
      }

      const structure = structureAt(row, col);
      if (structure) {
        const spec = structureTypes[structure.type];
        const block = document.createElement("div");
        block.className = [
          "structure",
          structure.type,
          structure.owner,
          state.animation?.targetStructureId === structure.id ? "hit" : "",
        ]
          .filter(Boolean)
          .join(" ");
        block.innerHTML = `
          <span>${spec.short}</span>
          <b>${structure.hp}/${structure.maxHp}</b>
          <em style="width:${percent(structure.hp, structure.maxHp)}%"></em>
        `;
        block.title = `${spec.label} HP ${structure.hp}/${structure.maxHp}`;
        cell.appendChild(block);
      }

      const unit = unitAt(row, col);
      if (unit) {
        const piece = document.createElement("div");
        piece.className = [
          "piece",
          unit.team,
          state.selectedId === unit.id ? "selected" : "",
          unit.acted ? "acted" : "",
          state.animation?.attackerId === unit.id ? "attacking" : "",
          state.animation?.targetId === unit.id ? "hit" : "",
        ]
          .filter(Boolean)
          .join(" ");
        piece.style.background = unit.team === "player" ? unit.color : "";
        piece.innerHTML = `
          ${unit.art ? `<img src="${unit.art}" alt="">` : ""}
          <span class="piece-text">${unit.piece}</span>
          <span class="piece-mood" title="${unit.mood}">${moodIcon(unit.mood)}</span>
          ${unit.team === "player" && unit.needsAttention ? `<span class="piece-attention" title="かまってほしい">♥</span>` : ""}
        `;
        piece.title = `${unit.name} HP ${unit.hp}/${unit.maxHp}`;
        cell.appendChild(piece);
      }

      boardEl.appendChild(cell);
    }
  }
}

function getCellClasses(row, col) {
  const classes = ["cell"];
  if (samePos({ row, col }, PLAYER_BASE)) classes.push("player-base");
  if (samePos({ row, col }, ENEMY_BASE)) classes.push("enemy-base");
  if (state.legalMoves.some((pos) => samePos(pos, { row, col }))) classes.push("move-option");
  if (state.legalTargets.some((pos) => samePos(pos, { row, col }))) classes.push("attack-option");
  if (state.legalCombos.some((pos) => samePos(pos, { row, col }))) classes.push("combo-option");
  if (state.legalBuilds.some((pos) => samePos(pos, { row, col }))) classes.push("build-option");
  if (state.editorOpen) classes.push("editor-option");
  return classes;
}

function renderDetail() {
  const unit = selectedUnit();
  actionBarEl.innerHTML = "";

  if (state.activePanel === "shop") {
    renderShopPanel(unit);
    return;
  }

  if (!unit) {
    unitDetailEl.className = "unit-detail";
    unitDetailEl.innerHTML = `${panelTabsHtml()}<div class="empty-state inner-empty">盤上の味方を選択</div>`;
    actionHintEl.textContent = "待機中";
    attachPanelTabs();
    return;
  }

  const stats = effectiveStats(unit);
  actionHintEl.textContent = unit.team === "enemy" ? "CPU駒" : unit.acted ? "行動済み" : "行動可能";
  unitDetailEl.className = "unit-detail";
  unitDetailEl.innerHTML = `
    ${panelTabsHtml()}
    ${unit.art ? `<img class="detail-art" src="${unit.art}" alt="${unit.name}">` : ""}
    <div class="detail-head">
      <div class="portrait">${portraitHtml(unit)}</div>
      <div>
        <h2>${unit.name}</h2>
        <p>${unit.className} / ${unit.personalSkill?.name ?? unit.skill}${unit.presetName ? ` / ${unit.presetName}` : ""}</p>
      </div>
    </div>
    <div class="stat-grid">
      <div class="stat"><span>Lv</span><strong>${unit.level ?? 1}</strong></div>
      <div class="stat"><span>HP</span><strong>${unit.hp}/${unit.maxHp}</strong></div>
      <div class="stat"><span>攻撃</span><strong>${stats.atk}</strong></div>
      <div class="stat"><span>防御</span><strong>${stats.def}</strong></div>
      <div class="stat"><span>移動</span><strong>${stats.move}</strong></div>
      <div class="stat"><span>知識</span><strong>${unit.knowledge ?? 0}</strong></div>
      <div class="stat"><span>スキル</span><strong>${unit.skillUses ?? 0}</strong></div>
      <div class="stat"><span>親密度</span><strong>${unit.bond}</strong></div>
      <div class="stat"><span>嫉妬</span><strong>${unit.jealousy ?? 0}</strong></div>
      <div class="stat"><span>おなか</span><strong>${unit.hunger ?? 100}</strong></div>
      <div class="stat"><span>分岐</span><strong>${unit.path}</strong></div>
      <div class="stat"><span>育成型</span><strong>${unit.trainingType ?? "-"}</strong></div>
      <div class="stat"><span>称号</span><strong>${unit.title ?? "-"}</strong></div>
    </div>
    <div class="detail-gauges">
      ${gaugeHtml("HP", percent(unit.hp, unit.maxHp), "hp", `${unit.hp}/${unit.maxHp}`)}
      ${gaugeHtml("親密度", unit.bond, "bond")}
      ${gaugeHtml("嫉妬", unit.jealousy ?? 0, "jealousy")}
      ${gaugeHtml("おなか", unit.hunger ?? 100, "hunger")}
    </div>
    <div class="trait-list">
      ${unit.team === "player" && unit.needsAttention ? `<span class="tag pink">♥ かまってほしい</span>` : ""}
      <span class="tag gold">${chapterForUnit(unit).title}</span>
      <span class="tag">${moodIcon(unit.mood)} ${unit.mood}: ${moodEffects[unit.mood]?.note ?? "変化なし"}</span>
      <span class="tag">${emotionGroup(unit.mood)}</span>
      <span class="tag coral">専用: ${unit.personalSkill?.effect ?? "未設定"}</span>
      <span class="tag coral">${bondLabel(unit)}</span>
      <span class="tag gold">${unit.quote ?? "盤上で様子を見ている。"}</span>
    </div>
    ${unit.team === "player" ? promotionBoxHtml(unit) : ""}
    ${unit.team === "player" ? comboConditionHtml(unit) : ""}
  `;
  attachPanelTabs();
  attachPromotionButtons(unit);

  if (state.phase !== "player" || unit.team !== "player" || unit.hp <= 0 || state.result) {
    return;
  }
}

function renderActionMenu() {
  const unit = selectedUnit();
  boardActionMenuEl.innerHTML = "";

  if (!unit || unit.team !== "player" || unit.hp <= 0 || state.phase !== "player" || state.result || state.actionMenuHidden) {
    boardActionMenuEl.hidden = true;
    boardActionMenuEl.removeAttribute("style");
    return;
  }

  boardActionMenuEl.hidden = false;
  const label = document.createElement("span");
  label.className = "action-menu-label";
  label.textContent = `${unit.name}の行動`;
  boardActionMenuEl.appendChild(label);
  addBoardActionButton(unit.moved ? "◇ 移動済み" : "◇ 移動", () => setMode("move"), unit.moved || unit.acted);
  addBoardActionButton(unit.acted ? "⚔ 攻撃済み" : "⚔ 攻撃", () => setMode("attack"), unit.acted);
  addBoardActionButton(`◆ 専用${unit.skillUses ?? 0}`, () => useKnowledgeSkill(unit), unit.acted || (unit.skillUses ?? 0) <= 0);
  addBoardActionButton("✦ 合体技", () => setMode("combo"), unit.acted || state.comboUsed || comboTargets(unit).length === 0);
  addBoardActionButton(unit.acted ? "◆ 行動済み" : "◆ 待機", () => waitUnit(unit), unit.acted);
  positionActionMenu(unit);
}

function addBoardActionButton(label, onClick, disabled = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "plain-btn board-action-btn";
  button.textContent = label;
  button.disabled = disabled;
  button.addEventListener("click", onClick);
  boardActionMenuEl.appendChild(button);
}

function positionActionMenu(unit) {
  window.requestAnimationFrame(() => {
    const cell = boardEl.querySelector(`[data-row="${unit.row}"][data-col="${unit.col}"]`);
    if (!cell || boardActionMenuEl.hidden) return;
    const stage = boardEl.closest(".battle-stage").getBoundingClientRect();
    const cellRect = cell.getBoundingClientRect();
    const menuWidth = Math.min(224, stage.width - 16);
    const menuHeight = boardActionMenuEl.offsetHeight || 140;
    const preferRight = unit.col < BOARD_SIZE / 2;
    let left = preferRight ? cellRect.right - stage.left + 8 : cellRect.left - stage.left - menuWidth - 8;
    let top = cellRect.top - stage.top;
    if (unit.row >= BOARD_SIZE - 2) top = cellRect.top - stage.top - menuHeight + cellRect.height;
    left = clamp(left, 8, stage.width - menuWidth - 8);
    top = clamp(top, 64, stage.height - menuHeight - 8);
    boardActionMenuEl.style.left = `${left}px`;
    boardActionMenuEl.style.top = `${top}px`;
    boardActionMenuEl.style.width = `${menuWidth}px`;
  });
}

function panelTabsHtml() {
  return `
    <div class="panel-tabs">
      <button class="${state.activePanel === "detail" ? "active" : ""}" type="button" data-panel="detail">詳細</button>
      <button class="${state.activePanel === "shop" ? "active" : ""}" type="button" data-panel="shop">ショップ</button>
    </div>
  `;
}

function promotionBoxHtml(unit) {
  const options = classChangeOptions[unit.id] ?? [];
  if (!options.length || unit.promoted) {
    return unit.promoted
      ? `<div class="promotion-box done"><strong>成り済み</strong><p>${unit.className}として成長中。</p></div>`
      : "";
  }
  const canPromote = canClassChange(unit);
  if (!canPromote) {
    return `
      <div class="promotion-box compact">
        <strong>成り/クラスチェンジ</strong>
        <p>条件: Lv3以上 または 親密度30以上。</p>
      </div>
    `;
  }
  const buttons = options
    .map((option) => `<button class="plain-btn" type="button" data-promotion="${option.id}">${option.label}</button>`)
    .join("");
  return `
    <div class="promotion-box">
      <strong>成り/クラスチェンジ</strong>
      <p>条件達成。方向性を選べる。</p>
      <div>${buttons}</div>
    </div>
  `;
}

function attachPromotionButtons(unit) {
  unitDetailEl.querySelectorAll("[data-promotion]").forEach((button) => {
    button.addEventListener("click", () => classChange(unit.id, button.dataset.promotion));
  });
}

function canClassChange(unit) {
  return unit.team === "player" && !unit.promoted && ((unit.level ?? 1) >= 3 || (unit.bond ?? 0) >= 30);
}

function classChange(id, promotionId) {
  const unit = state.units.find((candidate) => candidate.id === id);
  const option = classChangeOptions[id]?.find((candidate) => candidate.id === promotionId);
  if (!unit || !option || !canClassChange(unit)) return;
  unit.promoted = true;
  unit.promotionId = option.id;
  unit.className = option.className;
  unit.skill = option.skill;
  unit.moveType = option.moveType;
  unit.atk = clamp(unit.atk + option.atk, 1, 999);
  unit.def = clamp(unit.def + option.def, 0, 999);
  unit.move = clamp(unit.move + option.move, 1, 9);
  unit.maxHp = clamp(unit.maxHp + 12, 1, 999);
  unit.hp = clamp(unit.hp + 12, 1, unit.maxHp);
  addLog(`${unit.name}が${option.className}へクラスチェンジ。${option.skill}を覚えた。`);
  render();
}

function attachPanelTabs() {
  unitDetailEl.querySelectorAll("[data-panel]").forEach((button) => {
    button.addEventListener("click", () => {
      state.activePanel = button.dataset.panel;
      state.mode = "inspect";
      state.legalMoves = [];
      state.legalTargets = [];
      state.legalCombos = [];
      state.legalBuilds = [];
      state.buildDraft = null;
      state.actionMenuHidden = false;
      render();
    });
  });
}

function renderShopPanel(unit) {
  actionHintEl.textContent = "ショップ";
  unitDetailEl.className = "unit-detail shop-panel";
  const canBuild =
    unit?.team === "player" && unit.hp > 0 && state.phase === "player" && !unit.acted && !state.result;
  const wallDisabled = !canBuild || state.wallMaterials < 1;
  const building3Disabled = !canBuild || state.wallMaterials < 3;
  const building5Disabled = !canBuild || state.wallMaterials < 5;
  const inventory = getInventory();
  const carePoints = getCarePoints();
  const accessoryButtons = Object.entries(shopItems)
    .filter(([id]) => id !== "wallMaterial")
    .map(
      ([id, item]) => `
        <button class="plain-btn" type="button" data-buy-accessory="${id}" ${carePoints < item.cost ? "disabled" : ""}>
          ${item.label} / ${item.cost}P <small>所持${inventory[id] ?? 0} ${item.note}</small>
        </button>
      `,
    )
    .join("");
  unitDetailEl.innerHTML = `
    ${panelTabsHtml()}
    <div class="shop-box">
      <div class="shop-stock">
        <span>建築P</span><strong>${state.buildPoints}</strong>
        <span>壁材</span><strong>${state.wallMaterials}</strong>
        <span>戯れP</span><strong>${carePoints}</strong>
      </div>
      <p>建築Pで壁材を買い、選択中の味方の隣マスに設置する。壁はHP1、建物は使った壁材の数がそのまま耐久値になる。</p>
      <div class="shop-actions">
        <button class="plain-btn" type="button" data-buy-material="1" ${state.buildPoints < shopItems.wallMaterial.cost ? "disabled" : ""}>壁材+1 / 1P</button>
        <button class="plain-btn" type="button" data-buy-material="5" ${state.buildPoints < 5 ? "disabled" : ""}>壁材+5 / 5P</button>
        <button class="plain-btn" type="button" data-build-type="wall" data-materials="1" ${wallDisabled ? "disabled" : ""}>壁を作る / 1材</button>
        <button class="plain-btn" type="button" data-build-type="building" data-materials="3" ${building3Disabled ? "disabled" : ""}>建物HP3 / 3材</button>
        <button class="plain-btn" type="button" data-build-type="building" data-materials="5" ${building5Disabled ? "disabled" : ""}>建物HP5 / 5材</button>
      </div>
      <small>${canBuild ? `${unit.name}の隣に建築できる。` : "味方を選び、行動前なら建築できる。"}</small>
    </div>
    <div class="shop-box">
      <div class="section-title"><span>小物</span><small>育成とbattleをつなぐ報酬</small></div>
      <p>battleで得た戯れPで購入。所持数に応じてチーム育成中の成長に小さな補正が入る。</p>
      <div class="shop-actions accessory-actions">${accessoryButtons}</div>
    </div>
  `;
  attachPanelTabs();
  unitDetailEl.querySelectorAll("[data-buy-material]").forEach((button) => {
    button.addEventListener("click", () => buyWallMaterial(Number(button.dataset.buyMaterial)));
  });
  unitDetailEl.querySelectorAll("[data-build-type]").forEach((button) => {
    button.addEventListener("click", () => startBuildFromShop(button.dataset.buildType, Number(button.dataset.materials)));
  });
  unitDetailEl.querySelectorAll("[data-buy-accessory]").forEach((button) => {
    button.addEventListener("click", () => buyAccessory(button.dataset.buyAccessory));
  });
}

function renderStageEditor() {
  stageEditorPanelEl.hidden = !state.editorOpen;
  if (!state.editorOpen) {
    stageEditorPanelEl.innerHTML = "";
    return;
  }
  const tools = [
    { id: "enemy", label: "敵配置" },
    { id: "wall", label: "壁" },
    { id: "building", label: "建物" },
    { id: "delete", label: "削除" },
  ];
  stageEditorPanelEl.innerHTML = `
    <strong>ステージ編集</strong>
    <div class="editor-tools">
      ${tools.map((tool) => `<button class="${state.editorTool === tool.id ? "active" : ""}" type="button" data-editor-tool="${tool.id}">${tool.label}</button>`).join("")}
    </div>
    <small>盤面マスを押すと反映。完了で通常操作に戻る。</small>
    <button class="plain-btn editor-close" type="button" data-editor-close>完了</button>
  `;
  stageEditorPanelEl.querySelectorAll("[data-editor-tool]").forEach((button) => {
    button.addEventListener("click", () => {
      state.editorTool = button.dataset.editorTool;
      render();
    });
  });
  stageEditorPanelEl.querySelector("[data-editor-close]").addEventListener("click", toggleStageEditor);
}

function toggleStageEditor() {
  if (state.result) return;
  state.editorOpen = !state.editorOpen;
  state.mode = "inspect";
  state.legalMoves = [];
  state.legalTargets = [];
  state.legalCombos = [];
  state.legalBuilds = [];
  state.buildDraft = null;
  addLog(state.editorOpen ? "ステージエディタを開いた。" : "ステージエディタを閉じた。");
  render();
}

function editStageCell(row, col) {
  if (samePos({ row, col }, PLAYER_BASE) || samePos({ row, col }, ENEMY_BASE)) {
    addLog("拠点マスは編集できない。");
    render();
    return;
  }
  const unit = unitAt(row, col);
  const structure = structureAt(row, col);
  if (state.editorTool === "delete") {
    if (unit?.team === "enemy") {
      unit.hp = 0;
      addLog(`${unit.name}をステージから削除。`);
    } else if (structure) {
      state.structures = state.structures.filter((candidate) => candidate.id !== structure.id);
      addLog("構造物を削除。");
    }
    render();
    return;
  }
  if (unit || structure) {
    addLog("そのマスにはすでに駒か構造物がある。");
    render();
    return;
  }
  if (state.editorTool === "enemy") {
    const id = `editor-enemy-${Date.now()}`;
    state.units.push({
      id,
      team: "enemy",
      name: "編集影兵",
      piece: "影",
      className: "編集敵",
      hp: 20,
      maxHp: 20,
      atk: 5,
      def: 1,
      move: 1,
      range: 1,
      mood: "集中",
      bond: 0,
      path: "妨害",
      row,
      col,
      skill: "編集スラッシュ",
      moveType: "guard",
      color: "#6f5f55",
      art: "assets/characters/enemy-silver-wolf.png",
      quote: "エディタから呼ばれた即席幹部。",
      acted: false,
      moved: false,
      talked: false,
      level: 1,
    });
    addLog(`${coord(row, col)}に編集影兵を配置。`);
  } else {
    const materials = state.editorTool === "building" ? 4 : 1;
    const type = state.editorTool;
    state.structures.push({
      id: `editor-structure-${state.nextStructureId}`,
      type,
      owner: "player",
      row,
      col,
      hp: materials,
      maxHp: materials,
      def: 0,
    });
    state.nextStructureId += 1;
    addLog(`${coord(row, col)}に${structureTypes[type].label}を配置。`);
  }
  render();
}

function buyWallMaterial(amount) {
  const cost = amount * shopItems.wallMaterial.cost;
  if (state.buildPoints < cost) return;
  state.buildPoints -= cost;
  state.wallMaterials += amount;
  addLog(`ショップで壁材を${amount}個購入。建築P-${cost}。`);
  render();
}

function buyAccessory(itemId) {
  const item = shopItems[itemId];
  if (!item || itemId === "wallMaterial") return;
  if (!spendCarePoints(item.cost)) return;
  const count = addInventoryItem(itemId, 1);
  addLog(`ショップで${item.label}を購入。所持${count}個。${item.note}`);
  render();
}

function startBuildFromShop(type, materials) {
  const unit = selectedUnit();
  if (!unit || unit.team !== "player" || unit.acted || state.phase !== "player" || state.wallMaterials < materials) return;
  state.mode = `build-${type}`;
  state.buildDraft = { type, materials };
  state.actionMenuHidden = true;
  state.legalMoves = [];
  state.legalTargets = [];
  state.legalCombos = [];
  state.legalBuilds = legalBuildCells(unit);
  if (state.legalBuilds.length === 0) {
    state.mode = "inspect";
    state.buildDraft = null;
    state.actionMenuHidden = false;
    addLog(`${unit.name}の隣に空きマスがない。建築には空きマスが必要。`);
    render();
    return;
  }
  addLog(`${unit.name}が${structureTypes[type].label}の建築位置を選んでいる。`);
  render();
}

function renderTalk() {
  const unit = selectedUnit();
  if (!unit || unit.hp <= 0) {
    talkBoxEl.innerHTML = `
      <div class="adv-dialogue adv-empty">
        <div class="adv-message">
          <span class="adv-speaker">SYSTEM</span>
          <p>盤上の推し駒を選ぶと、ここに会話パートが出る。</p>
        </div>
      </div>
    `;
    return;
  }

  if (unit.team === "enemy") {
    if (canNegotiateEnemy(unit)) {
      renderEnemyNegotiation(unit);
      return;
    }
    talkBoxEl.innerHTML = `
      <div class="adv-dialogue">
        <img class="adv-art" src="${unit.art}" alt="${unit.name}">
        <div class="adv-message">
          <span class="adv-speaker">${unit.name}</span>
          <p>「${unit.name}とは会話不可。額の黒金マークが、いかにも面倒な敵幹部。」</p>
        </div>
        <div class="adv-choices">
          <button class="choice-btn" type="button" disabled>敵幹部とは交渉できない</button>
        </div>
      </div>
    `;
    return;
  }

  if (state.miniGame?.unitId === unit.id) {
    renderMiniGame(unit);
    return;
  }

  if (unit.temporaryAllyTurns > 0) {
    talkBoxEl.innerHTML = `
      <div class="adv-dialogue">
        <img class="adv-art" src="${unit.art}" alt="${unit.name}">
        <div class="adv-message">
          <span class="adv-speaker">${unit.name}</span>
          <p>「一時的に手を貸しているだけだ。${unit.temporaryAllyTurns}ターン後には去る。」</p>
          <small>敵幹部の一時加入中。会話イベントはほとんど発生しない。</small>
        </div>
        <div class="adv-choices">
          <button class="choice-btn" type="button" disabled>一時共闘中</button>
        </div>
      </div>
    `;
    return;
  }

  if (unit.talked) {
    const result = state.lastTalkResult?.unitId === unit.id ? state.lastTalkResult : null;
    talkBoxEl.innerHTML = `
      <div class="adv-dialogue">
        <img class="adv-art" src="${unit.art}" alt="${unit.name}">
        <div class="adv-message">
          <span class="adv-speaker">${unit.name}</span>
          ${result?.playerLine ? `<span class="player-line">あなた「${result.playerLine}」</span>` : ""}
          <p>${result ? result.reply : characterLine(unit, "このターンはもう少し落ち着いてから話したい")}</p>
          <small>${result ? result.summary : `今の関係は「${unit.path}」、感情は「${unit.mood}」。`}</small>
        </div>
        <div class="adv-choices">
          <button class="choice-btn" type="button" disabled>次のターンにまた話す</button>
        </div>
      </div>
    `;
    return;
  }

  if (needsMeal(unit)) {
    renderMealEvent(unit);
    return;
  }

  const talk = state.currentTalk?.unitId === unit.id ? state.currentTalk.scene : prepareTalk(unit);
  const choices = talk.choices
    .map((choice) => `<button class="choice-btn" type="button" data-choice="${choice.id}">「${playerChoiceLabel(unit, talk, choice)}」</button>`)
    .join("");

  talkBoxEl.innerHTML = `
    <div class="adv-dialogue">
      <img class="adv-art" src="${unit.art}" alt="${unit.name}">
      <div class="adv-message">
        <span class="adv-speaker">${chapterForUnit(unit).title} / ${unit.name} / ${playerProfiles[unit.id].personality}</span>
        <p>${characterLine(unit, talk.line)}</p>
        <small>${talkHintText(unit, talk)}</small>
      </div>
      <div class="adv-choices">${choices}</div>
    </div>
  `;

  talkBoxEl.querySelectorAll("[data-choice]").forEach((button) => {
    button.addEventListener("click", () => applyTalkChoice(unit.id, button.dataset.choice));
  });
}

function renderMealEvent(unit) {
  const choices = foodOptions
    .map((food) => `<button class="choice-btn" type="button" data-food="${food.id}">${food.label}をあげる</button>`)
    .join("");
  talkBoxEl.innerHTML = `
    <div class="adv-dialogue">
      <img class="adv-art" src="${unit.art}" alt="${unit.name}">
      <div class="adv-message">
        <span class="adv-speaker">${unit.name} / ごはんイベント</span>
        <p>${characterLine(unit, `おなかがすいて、少し力が出ない`)}</p>
        <small>${foodHints[unit.id] ?? "普段の会話に好物のヒントが混ざる。"}</small>
      </div>
      <div class="adv-choices">${choices}</div>
    </div>
  `;
  talkBoxEl.querySelectorAll("[data-food]").forEach((button) => {
    button.addEventListener("click", () => applyMealChoice(unit.id, button.dataset.food));
  });
}

function renderMiniGame(unit) {
  const game = state.miniGame;
  if (!game) return;
  const gameChoices =
    game.type === "janken"
      ? ["グー", "チョキ", "パー"].map((label) => `<button class="choice-btn" type="button" data-mini-choice="${label}">${label}</button>`).join("")
      : game.type === "acchi"
        ? ["上", "下", "左", "右"].map((label) => `<button class="choice-btn" type="button" data-mini-choice="${label}">${label}を向かせる</button>`).join("")
        : ["上", "下", "左", "右"].map((label) => `<button class="choice-btn" type="button" data-mini-choice="${label}">${label}へ避ける</button>`).join("");
  const remaining = game.type === "dodge" ? Math.max(0, Math.ceil((game.expiresAt - Date.now()) / 1000)) : null;
  const message =
    game.type === "janken"
      ? "じゃんけん勝負。勝てば能力ボーナス。"
      : game.type === "acchi"
        ? "あっち向いてほい。読み勝てばボーナス。"
        : `10秒間、敵の攻撃方向から逃げる。危険方向: ${game.danger} / 残り${remaining}秒`;
  talkBoxEl.innerHTML = `
    <div class="adv-dialogue">
      <img class="adv-art" src="${unit.art}" alt="${unit.name}">
      <div class="adv-message">
        <span class="adv-speaker">${unit.name} / ミニゲーム</span>
        <p>${message}</p>
        <small>${game.type === "dodge" ? `回避${game.dodges} / 被弾${game.hits}` : "戦績に応じてHP・攻撃・防御などが伸びる。"}</small>
      </div>
      <div class="adv-choices">${gameChoices}</div>
    </div>
  `;
  talkBoxEl.querySelectorAll("[data-mini-choice]").forEach((button) => {
    button.addEventListener("click", () => playMiniGameChoice(button.dataset.miniChoice));
  });
}

function renderEnemyNegotiation(unit) {
  talkBoxEl.innerHTML = `
    <div class="adv-dialogue">
      <img class="adv-art" src="${unit.art}" alt="${unit.name}">
      <div class="adv-message">
        <span class="adv-speaker">${unit.name} / 交渉可能</span>
        <p>「傷が深いな。ここで退くか、一時的にこちらへ付くか選べるかもしれない。」</p>
        <small>HPが減った敵幹部は、交渉でランダムに離脱または2ターンだけ仲間になる。</small>
      </div>
      <div class="adv-choices">
        <button class="choice-btn" type="button" data-negotiate="leave">ここで退いてください</button>
        <button class="choice-btn" type="button" data-negotiate="join">一時的に力を貸してください</button>
      </div>
    </div>
  `;
  talkBoxEl.querySelectorAll("[data-negotiate]").forEach((button) => {
    button.addEventListener("click", () => negotiateEnemy(unit.id, button.dataset.negotiate));
  });
}

function renderLog() {
  battleLogEl.innerHTML = "";
  for (const entry of state.log.slice(-16).reverse()) {
    const item = document.createElement("li");
    item.textContent = entry;
    battleLogEl.appendChild(item);
  }
}

function addActionButton(label, onClick, disabled = false) {
  const button = document.createElement("button");
  button.type = "button";
  button.className = "plain-btn";
  button.textContent = label;
  button.disabled = disabled;
  button.addEventListener("click", onClick);
  actionBarEl.appendChild(button);
}

function selectUnit(id) {
  const unit = state.units.find((candidate) => candidate.id === id);
  if (!unit || unit.hp <= 0 || state.result) return;
  state.selectedId = id;
  state.mode = "inspect";
  state.legalMoves = [];
  state.legalTargets = [];
  state.legalCombos = [];
  state.legalBuilds = [];
  state.currentTalk = null;
  state.actionMenuHidden = false;
  if (unit.team === "player" && state.phase === "player" && !unit.talked) {
    prepareTalk(unit);
  }
  if (unit.team === "player" && state.phase === "player" && !unit.acted) {
    state.legalTargets = [];
  }
  render();
}

function setMode(mode) {
  const unit = selectedUnit();
  if (!unit || unit.acted || state.phase !== "player") return;
  state.mode = mode;
  state.actionMenuHidden = true;
  if (!mode.startsWith("build-")) state.buildDraft = null;
  state.legalMoves = mode === "move" && !unit.moved ? legalMoves(unit) : [];
  state.legalTargets = mode === "attack" ? attackTargets(unit) : [];
  state.legalCombos = mode === "combo" ? comboTargets(unit) : [];
  state.legalBuilds = mode.startsWith("build-") ? legalBuildCells(unit) : [];
  const noBoardOptions =
    (mode === "move" && state.legalMoves.length === 0) ||
    (mode === "attack" && state.legalTargets.length === 0) ||
    (mode === "combo" && state.legalCombos.length === 0) ||
    (mode.startsWith("build-") && state.legalBuilds.length === 0);
  if (noBoardOptions) {
    const labels = { move: "移動できるマス", attack: "攻撃できる対象", combo: "合体技の対象" };
    addLog(`${unit.name}には${labels[mode] ?? "選べるマス"}がない。`);
    state.mode = "inspect";
    state.actionMenuHidden = false;
  }
  render();
}

function handleCellClick(row, col) {
  if (state.result) return;
  if (state.editorOpen) {
    editStageCell(row, col);
    return;
  }
  const clickedUnit = unitAt(row, col);
  const clickedStructure = structureAt(row, col);

  if (clickedUnit && clickedUnit.team === "player") {
    selectUnit(clickedUnit.id);
    return;
  }

  const unit = selectedUnit();
  if (
    unit?.team === "player" &&
    state.phase === "player" &&
    !unit.acted &&
    state.mode.startsWith("build-") &&
    state.legalBuilds.some((pos) => samePos(pos, { row, col }))
  ) {
    buildStructure(unit, state.mode.replace("build-", ""), row, col);
    return;
  }

  if (clickedStructure) {
    if (
      unit?.team === "player" &&
      state.phase === "player" &&
      !unit.acted &&
      state.mode === "attack" &&
      state.legalTargets.some((pos) => samePos(pos, { row, col }))
    ) {
      attackStructure(unit, clickedStructure);
      return;
    }
    const spec = structureTypes[clickedStructure.type];
    addLog(`${spec.label}はHP${clickedStructure.hp}/${clickedStructure.maxHp}。壊すと進路が開く。`);
    render();
    return;
  }

  if (clickedUnit?.team === "enemy") {
    if (
      unit?.team === "player" &&
      state.phase === "player" &&
      !unit.acted &&
      state.mode === "attack" &&
      state.legalTargets.some((pos) => samePos(pos, { row, col }))
    ) {
      attackUnit(unit, clickedUnit);
      return;
    }

    if (
      unit?.team === "player" &&
      state.phase === "player" &&
      !unit.acted &&
      state.mode === "combo" &&
      state.legalCombos.some((pos) => samePos(pos, { row, col }))
    ) {
      comboAttack(unit, clickedUnit);
      return;
    }

    selectUnit(clickedUnit.id);
    return;
  }

  if (!unit || unit.team !== "player" || state.phase !== "player" || unit.acted) return;

  if (state.mode === "move" && state.legalMoves.some((pos) => samePos(pos, { row, col }))) {
    moveUnit(unit, row, col);
    return;
  }
}

function moveUnit(unit, row, col) {
  unit.row = row;
  unit.col = col;
  unit.moved = true;
  addLog(`${unit.name}が${coord(row, col)}へ移動。`);
  for (const note of triggerAdjacentAllyConversation(unit, "move")) addLog(note);
  state.mode = "attack";
  state.actionMenuHidden = false;
  state.legalMoves = [];
  state.legalTargets = attackTargets(unit);
  state.legalCombos = [];
  state.legalBuilds = [];
  checkVictory();
  render();
}

function attackUnit(attacker, defender) {
  const damage = calculateDamage(attacker, defender);
  defender.hp = Math.max(0, defender.hp - damage);
  attacker.acted = true;
  attacker.moved = true;
  triggerAttackAnimation(attacker, { unit: defender });
  addLog(`${attacker.name}の攻撃。${defender.name}に${damage}ダメージ。`);
  recordBattleStat(attacker, "damage", damage);
  if (defender.hp === 0) {
    addLog(`${defender.name}が盤上から離脱。`);
    nudgeBond(attacker, 4);
    recordBattleStat(attacker, "kills", 1);
    awardDefeatPoints(attacker, defender);
  }
  afterAction(attacker);
}

function attackStructure(attacker, structure) {
  const spec = structureTypes[structure.type];
  const damage = calculateStructureDamage(attacker, structure);
  structure.hp = Math.max(0, structure.hp - damage);
  attacker.acted = true;
  attacker.moved = true;
  triggerAttackAnimation(attacker, { structure });
  addLog(`${attacker.name}が${spec.label}を攻撃。耐久値に${damage}ダメージ。`);
  recordBattleStat(attacker, "damage", damage);
  if (structure.hp === 0) {
    state.structures = state.structures.filter((candidate) => candidate.id !== structure.id);
    addLog(`${spec.label}が壊れた。進路が開いた。`);
    nudgeBond(attacker, 2);
  }
  afterAction(attacker);
}

function buildStructure(builder, type, row, col) {
  const spec = structureTypes[type];
  const draft = state.buildDraft?.type === type ? state.buildDraft : { type, materials: spec?.materialCost ?? 1 };
  if (!spec || state.wallMaterials < draft.materials) return;
  if (!legalBuildCells(builder).some((pos) => samePos(pos, { row, col }))) return;
  const hp = type === "wall" ? 1 : draft.materials;

  const structure = {
    id: `build-${state.nextStructureId}`,
    type,
    owner: "player",
    row,
    col,
    hp,
    maxHp: hp,
    def: spec.def,
  };
  state.nextStructureId += 1;
  state.wallMaterials = Math.max(0, state.wallMaterials - draft.materials);
  state.structures.push(structure);
  state.buildDraft = null;
  builder.acted = true;
  builder.moved = true;
  addLog(`${builder.name}が${coord(row, col)}に${spec.label}を建築。壁材-${draft.materials} / 耐久${hp}。`);
  afterAction(builder);
}

function comboAttack(attacker, defender) {
  const combo = getAvailableCombo(attacker);
  if (!combo) return;
  const partner = state.units.find((unit) => unit.id === combo.partnerId);
  const damage = combo.damage + Math.floor((attacker.bond + partner.bond) / 25);
  defender.hp = Math.max(0, defender.hp - damage);
  attacker.acted = true;
  attacker.moved = true;
  partner.acted = true;
  triggerAttackAnimation(attacker, { unit: defender });
  state.comboUsed = true;
  nudgeBond(attacker, 8);
  nudgeBond(partner, 8);
  addLog(`${attacker.name}と${partner.name}の合体技「${combo.name}」。${defender.name}に${damage}ダメージ。`);
  recordBattleStat(attacker, "damage", damage);
  recordBattleStat(partner, "combo", 1);
  if (defender.hp === 0) {
    addLog(`${defender.name}は関係性の圧で離脱。`);
    recordBattleStat(attacker, "kills", 1);
    recordBattleStat(attacker, "comboFinisher", 1);
    awardDefeatPoints(attacker, defender);
  }
  afterAction(attacker);
}

function awardDefeatPoints(attacker, defender) {
  if (!attacker || !defender || attacker.team !== "player" || defender.team !== "enemy" || defender.pointAwarded) return;
  defender.pointAwarded = true;
  const gain = defender.id === "king" ? 12 : clamp(3 + Math.floor((defender.maxHp ?? 20) / 12), 3, 8);
  const total = addCarePoints(gain);
  addLog(`${defender.name}撃破で戯れP+${gain}。現在${total}P。`);
}

function useKnowledgeSkill(unit) {
  if (!unit || unit.acted || (unit.skillUses ?? 0) <= 0) return;
  const knowledge = unit.knowledge ?? 0;
  const skill = unit.personalSkill ?? personalSkillFor(unit.id, unit.trainingType);
  const typePower = unit.trainingType === "猛攻型" ? 4 : unit.trainingType === "激情型" ? Math.floor((unit.maxHp - unit.hp) / 8) : 0;
  const supportBonus = unit.trainingType === "絆型" && nearbyAllyCount(unit) > 0 ? 4 : 0;
  const stableBonus = unit.trainingType === "安定型" ? 3 : 0;
  let summary = "";
  if (skill.role === "strike" || skill.role === "pierce") {
    const target = enemyUnits()
      .filter((enemy) => enemy.hp > 0)
      .map((enemy) => ({ enemy, score: distance(unit, enemy) }))
      .sort((a, b) => a.score - b.score)[0]?.enemy;
    if (target) {
      const damage = clamp(7 + Math.floor(knowledge / 5) + typePower + supportBonus, 7, 80);
      target.hp = Math.max(0, target.hp - damage);
      triggerAttackAnimation(unit, { unit: target });
      summary = `${target.name}に${damage}ダメージ`;
      recordBattleStat(unit, "damage", damage);
      if (target.hp === 0) {
        awardDefeatPoints(unit, target);
        recordBattleStat(unit, "kills", 1);
        summary += "、撃破";
      }
    } else {
      unit.atk = clamp(unit.atk + 2 + stableBonus, 1, 999);
      summary = `攻撃+${2 + stableBonus}`;
    }
  } else if (skill.role === "guard") {
    const allies = playerUnits().filter((candidate) => candidate.hp > 0);
    const target = allies.sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0] || unit;
    const heal = clamp(8 + Math.floor(knowledge / 4) + stableBonus + supportBonus, 8, 80);
    const defBoost = unit.trainingType === "守護型" ? 3 : 2;
    target.hp = clamp(target.hp + heal, 1, target.maxHp);
    target.def = clamp(target.def + defBoost, 0, 999);
    recordBattleStat(unit, "protected", 1);
    summary = `${target.name}がHP${heal}回復、防御+${defBoost}`;
  } else if (skill.role === "trick") {
    const target = enemyUnits().filter((enemy) => enemy.hp > 0).sort((a, b) => distance(unit, a) - distance(unit, b))[0];
    if (target) {
      const damage = clamp(4 + Math.floor(knowledge / 6) + typePower, 4, 50);
      target.hp = Math.max(0, target.hp - damage);
      target.def = clamp(target.def - 1, 0, 999);
      target.mood = "気まずい";
      summary = `${target.name}に${damage}ダメージ、防御-1`;
      recordBattleStat(unit, "damage", damage);
      if (target.hp === 0) {
        awardDefeatPoints(unit, target);
        recordBattleStat(unit, "kills", 1);
      }
    } else {
      unit.knowledge = clamp(unit.knowledge + 2, 0, 999);
      summary = "知識+2";
    }
  } else {
    const allies = playerUnits().filter((candidate) => candidate.hp > 0);
    const heal = clamp(5 + Math.floor(knowledge / 8) + stableBonus + supportBonus, 5, 40);
    for (const ally of allies) ally.hp = clamp(ally.hp + heal, 1, ally.maxHp);
    recordBattleStat(unit, "protected", 1);
    summary = `味方全員HP${heal}回復`;
  }
  if (unit.trainingType === "守護型") unit.def = clamp(unit.def + 1, 0, 999);
  if (unit.trainingType === "策士型" && randomChance(0.55)) {
    unit.acted = false;
    unit.moved = false;
  } else {
    unit.acted = true;
    unit.moved = true;
  }
  if (unit.trainingType === "激情型") unit.jealousy = clamp((unit.jealousy ?? 0) + 5, 0, 100);
  unit.skillUses = Math.max(0, (unit.skillUses ?? 0) - 1);
  addLog(`${unit.name}の専用スキル「${skill.name}」。${summary}。残り${unit.skillUses}回。`);
  afterAction(unit);
}

function useKnowledgeSkillLegacy(unit) {
  if (!unit || unit.acted || (unit.skillUses ?? 0) <= 0) return;
  const knowledge = unit.knowledge ?? 0;
  const allies = playerUnits().filter((candidate) => candidate.hp > 0);
  const target = allies.sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0] || unit;
  const heal = clamp(8 + Math.floor(knowledge / 4), 8, 80);
  const defBoost = knowledge >= 35 ? 2 : 1;
  target.hp = clamp(target.hp + heal, 1, target.maxHp);
  target.def = clamp(target.def + defBoost, 0, 999);
  unit.skillUses = Math.max(0, (unit.skillUses ?? 0) - 1);
  unit.acted = true;
  unit.moved = true;
  addLog(`${unit.name}の知識スキル「読み筋リカバー」。${target.name}がHP${heal}回復、防御+${defBoost}。残り${unit.skillUses}回。`);
  afterAction(unit);
}

function waitUnit(unit) {
  unit.acted = true;
  unit.moved = true;
  if (unit.id === "honoka") {
    const ally = adjacentAllies(unit).sort((a, b) => a.hp / a.maxHp - b.hp / b.maxHp)[0];
    if (ally && ally.hp < ally.maxHp) {
      ally.hp = Math.min(ally.maxHp, ally.hp + 5);
      recordBattleStat(unit, "protected", 1);
      addLog(`${unit.name}の応援で${ally.name}が5回復。`);
    } else {
      addLog(`${unit.name}は全力で手を振った。特に意味はある。`);
    }
  } else if (unit.id === "mio") {
    unit.def += 1;
    recordBattleStat(unit, "protected", 1);
    addLog(`${unit.name}が守りを固めた。基礎防御+1。`);
  } else {
    addLog(`${unit.name}は様子を見た。`);
  }
  afterAction(unit);
}

function afterAction(unit) {
  state.mode = "inspect";
  state.legalMoves = [];
  state.legalTargets = [];
  state.legalCombos = [];
  state.legalBuilds = [];
  state.buildDraft = null;
  state.actionMenuHidden = false;
  applyJealousyAfterAction(unit);
  checkVictory();
  if (!state.result && playerUnits().filter((candidate) => candidate.hp > 0).every((candidate) => candidate.acted)) {
    endPlayerTurn();
    return;
  }
  selectUnit(unit.id);
  render();
}

function applyJealousyAfterAction(unit) {
  if (!unit || unit.team !== "player" || unit.hp <= 0) return;
  if ((unit.jealousy ?? 0) >= 92 && randomChance(0.08)) {
    unit.hp = 0;
    unit.mood = "呆れ";
    addLog(`${unit.name}は嫉妬の暴走スキルを出し切り、反動で退却した。`);
    return;
  }
  if ((unit.jealousy ?? 0) >= 70 && randomChance(0.22)) {
    unit.atk = clamp(unit.atk + 1, 1, 999);
    unit.def = clamp(unit.def - 1, 0, 999);
    addLog(`${unit.name}の「あの子ばっかり……」が火力に変わった。攻撃+1、防御-1。`);
  }
}

function endPlayerTurn() {
  if (state.phase !== "player" || state.result) return;
  state.phase = "enemy";
  state.selectedId = null;
  state.mode = "inspect";
  state.actionMenuHidden = false;
  state.legalMoves = [];
  state.legalTargets = [];
  state.legalCombos = [];
  state.legalBuilds = [];
  for (const note of applyIgnoredAttention()) addLog(note);
  for (const note of applyHungerDecay()) addLog(note);
  addLog("敵フェイズ。空気がちょっと悪い。");
  render();
  window.setTimeout(runEnemyTurn, 500);
}

async function runEnemyTurn() {
  for (const enemy of enemyUnits().filter((unit) => unit.hp > 0)) {
    if (state.result) break;
    const target = nearestPlayer(enemy);
    if (!target) break;
    const structureTarget = nearestAttackableStructure(enemy);
    await delay(800);
    if (isInAttackRange(enemy, target)) {
      attackFromEnemy(enemy, target);
    } else if (structureTarget) {
      attackStructureFromEnemy(enemy, structureTarget);
    } else {
      enemyStep(enemy, target);
      render();
      await delay(650);
      const nextTarget = nearestPlayer(enemy);
      if (nextTarget && isInAttackRange(enemy, nextTarget)) {
        attackFromEnemy(enemy, nextTarget);
      } else {
        const nextStructureTarget = nearestAttackableStructure(enemy);
        if (nextStructureTarget) attackStructureFromEnemy(enemy, nextStructureTarget);
      }
    }
    checkDefeat();
    render();
  }

  if (!state.result) {
    state.phase = "player";
    state.turn += 1;
    for (const unit of state.units) {
      unit.acted = false;
      unit.moved = false;
      unit.talked = false;
    }
    state.currentTalk = null;
    tickTemporaryAllies();
    rollAttentionNeeds();
    addLog(`Turn ${state.turn}。味方フェイズ。`);
  }
  render();
}

function attackFromEnemy(attacker, defender) {
  const damage = calculateDamage(attacker, defender);
  defender.hp = Math.max(0, defender.hp - damage);
  triggerAttackAnimation(attacker, { unit: defender });
  addLog(`${attacker.name}の${attacker.skill}。${defender.name}に${damage}ダメージ。`);
  if (defender.hp === 0) {
    defender.mood = "落ち込み";
    addLog(`${defender.name}が撤退。保健室で反省会。`);
  } else if (attacker.id === "shade1") {
    defender.mood = "気まずい";
    addLog(`${defender.name}の感情が気まずいに変化。`);
  }
}

function canNegotiateEnemy(unit) {
  return unit.team === "enemy" && unit.hp > 0 && unit.hp <= Math.ceil(unit.maxHp * 0.5);
}

function negotiateEnemy(id, approach) {
  const unit = state.units.find((candidate) => candidate.id === id);
  if (!unit || !canNegotiateEnemy(unit)) return;
  const joinChance = approach === "join" ? 0.48 : 0.24;
  if (randomChance(joinChance)) {
    unit.team = "player";
    unit.temporaryAllyTurns = 2;
    unit.acted = false;
    unit.moved = false;
    unit.talked = true;
    unit.bond = 0;
    unit.jealousy = 0;
    unit.hunger = 100;
    unit.needsAttention = false;
    unit.color = "#6f5f55";
    addLog(`${unit.name}が一時的に仲間になった。2ターン後に離脱する。`);
  } else if (randomChance(approach === "leave" ? 0.72 : 0.35)) {
    unit.hp = 0;
    addLog(`${unit.name}は交渉に応じて盤面から離脱した。`);
  } else {
    unit.mood = "怒り";
    addLog(`${unit.name}は交渉を拒否。怒りで攻撃が荒くなる。`);
  }
  state.currentTalk = null;
  render();
}

function tickTemporaryAllies() {
  for (const unit of state.units) {
    if (unit.team !== "player" || !unit.temporaryAllyTurns) continue;
    unit.temporaryAllyTurns -= 1;
    if (unit.temporaryAllyTurns <= 0) {
      unit.hp = 0;
      unit.acted = true;
      addLog(`${unit.name}は約束の2ターンを終え、静かに離脱した。`);
    }
  }
}

function attackStructureFromEnemy(attacker, structure) {
  const spec = structureTypes[structure.type];
  const damage = calculateStructureDamage(attacker, structure);
  structure.hp = Math.max(0, structure.hp - damage);
  triggerAttackAnimation(attacker, { structure });
  addLog(`${attacker.name}が${spec.label}を破壊しようとして${damage}ダメージ。`);
  if (structure.hp === 0) {
    state.structures = state.structures.filter((candidate) => candidate.id !== structure.id);
    addLog(`${spec.label}が砕けた。敵の進路も開いてしまった。`);
  }
}

function enemyStep(enemy, target) {
  const moves = legalMoves(enemy);
  if (moves.length === 0) return;
  const best = moves
    .map((pos) => ({ ...pos, score: distance(pos, target) }))
    .sort((a, b) => a.score - b.score)[0];
  enemy.row = best.row;
  enemy.col = best.col;
  addLog(`${enemy.name}が${coord(best.row, best.col)}へにじり寄る。`);
}

function applyTalkChoice(id, choiceId) {
  const unit = state.units.find((candidate) => candidate.id === id);
  const talk = state.currentTalk?.unitId === id ? state.currentTalk.scene : null;
  const choice = talk?.choices.find((candidate) => candidate.id === choiceId);
  if (!unit || !talk || !choice || unit.talked || state.result || state.phase !== "player") return;

  const result = resolveTalkChoice(unit, talk, choice);
  unit.talked = true;
  unit.talkCursor = (unit.talkCursor ?? 0) + 1;
  state.lastTalkResult = { unitId: unit.id, ...result };
  state.currentTalk = null;
  addLog(`${unit.name}との会話: Lv${unit.level} / 親密度${formatDelta(result.bondDelta)} / 嫉妬${formatDelta(result.jealousyDelta)} / HP${formatDelta(result.hpDelta)} / 建築P${formatDelta(result.buildGain)}`);
  for (const note of result.extraNotes) addLog(note);
  checkDefeat();
  render();
}

function applyMealChoice(id, foodId) {
  const unit = state.units.find((candidate) => candidate.id === id);
  const food = foodOptions.find((candidate) => candidate.id === foodId);
  if (!unit || !food || unit.talked || state.result || state.phase !== "player") return;

  const like = food.likes[unit.id] ?? 0;
  const bondDelta = like >= 8 ? randomInt(5, 10) : like < 0 ? randomInt(-5, -1) : randomInt(1, 4);
  const hpDelta = Math.max(1, food.hp + like);
  unit.hunger = clamp((unit.hunger ?? 0) + food.hunger + Math.max(0, like), 0, 100);
  unit.hp = clamp(unit.hp + hpDelta, 1, unit.maxHp);
  unit.bond = clamp(unit.bond + bondDelta, 0, 100);
  unit.talked = true;
  unit.talkCursor = (unit.talkCursor ?? 0) + 1;
  const notes = levelUpFromTalk(unit);
  if (like >= 8) unit.mood = "ごきげん";
  if (like < 0) unit.mood = "気まずい";
  state.lastTalkResult = {
    unitId: unit.id,
    playerLine: `${food.label}を食べる？`,
    reply: buildMealReply(unit, food, like),
    summary: `Lv${unit.level} / おなか${unit.hunger} / HP+${hpDelta} / 親密度${formatDelta(bondDelta)} / 感情: ${unit.mood}`,
  };
  addLog(`${unit.name}に${food.label}。おなか${unit.hunger} / HP+${hpDelta} / 親密度${formatDelta(bondDelta)}。`);
  for (const note of notes) addLog(note);
  render();
}

function buildMealReply(unit, food, like) {
  if (like >= 8) return characterLine(unit, `${food.label}、すごく好きかもしれない`);
  if (like < 0) return characterLine(unit, `${food.label}は少し苦手かもしれない`);
  return characterLine(unit, `${food.label}、ありがたく食べる`);
}

function prepareTalk(unit) {
  const library = talkLibrary[unit.id] ?? [];
  const tier = bondTier(unit);
  const eligible = library.filter((scene) => scene.tier === tier);
  const pool = eligible.length ? eligible : library;
  const index = (unit.talkCursor + randomInt(0, Math.max(0, pool.length - 1))) % pool.length;
  const scene = pool[index];
  state.currentTalk = { unitId: unit.id, scene };
  return scene;
}

function bondTier(unit) {
  if (unit.bond >= 70) return "high";
  if (unit.bond >= 45) return "mid";
  return "early";
}

function chapterForUnit(unit) {
  const bond = unit?.bond ?? 0;
  return [...storyChapters].reverse().find((chapter) => bond >= chapter.minBond) ?? storyChapters[0];
}

function needsMeal(unit) {
  return (unit.hunger ?? 100) <= 30;
}

function talkHintText(unit, talk) {
  const base = playerProfiles[unit.id].talkStyle;
  if (stableIndex(`${unit.id}-${talk.id}-food`, 4) === 0) {
    return `${base} ヒント: ${foodHints[unit.id]}`;
  }
  return base;
}

function resolveTalkChoice(unit, talk, choice) {
  const profile = playerProfiles[unit.id];
  const moodBonus = { "ごきげん": 2, "集中": 1, "恋愛中": 3, "落ち込み": 2, "怒り": -1, "気まずい": -3, "嫉妬": -4 }[unit.mood] ?? 0;
  const catSwing = profile.catLike ? randomInt(-5, 6) : 0;
  const bondBase = randomInt(choice.bond[0], choice.bond[1]);
  const focusBonus = choice.intent === "focus" ? randomInt(3, 8) : 0;
  const bondDelta = clamp(bondBase + moodBonus + catSwing + focusBonus, -8, 24);
  const hpDelta = randomInt(choice.hp[0], choice.hp[1]) + (choice.intent === "snack" ? randomInt(1, 5) : 0);
  let jealousyDrop = choice.intent === "team" ? randomInt(1, 3) : randomInt(0, 2);
  const extraNotes = [];
  const playerLine = playerChoiceLabel(unit, talk, choice);

  if (unit.needsAttention) {
    jealousyDrop += randomInt(1, 3);
    unit.needsAttention = false;
    extraNotes.push(`${unit.name}のかまってマークが消えた。ちゃんと見てもらえて少し落ち着いた。`);
  }

  unit.bond = clamp(unit.bond + bondDelta, 0, 100);
  unit.jealousy = clamp((unit.jealousy ?? 0) - jealousyDrop, 0, 100);
  unit.hp = clamp(unit.hp + hpDelta, 1, unit.maxHp);
  unit.focus = (unit.focus ?? 0) + 1;
  unit.path = choice.path;
  unit.mood = chooseMoodAfterTalk(unit, choice, bondDelta);

  const buildGain = awardBuildPointsFromBond(bondDelta);
  if (buildGain > 0) extraNotes.push(`親密度の上昇で建築Pが${buildGain}増えた。`);
  extraNotes.push(...levelUpFromTalk(unit));
  const statNotes = applyRandomGrowth(unit, choice);
  extraNotes.push(...statNotes);
  extraNotes.push(...applyAttentionJealousy(unit, choice));
  extraNotes.push(...triggerAdjacentAllyConversation(unit, "talk"));
  const miniGame = maybeCreateMiniGame(unit, choice);
  if (miniGame) {
    state.miniGame = miniGame;
    extraNotes.push(`${unit.name}との会話からミニゲームに派生した。`);
    if (miniGame.type === "dodge") startMiniGameClock();
  }

  if (profile.catLike && randomChance(0.3)) {
    unit.mood = randomChance(0.5) ? "気まずい" : "ごきげん";
    extraNotes.push(`${unit.name}は気分屋なので、強化の伸びが少し読みにくい。`);
  }

  const reply = buildReply(unit, choice, bondDelta, hpDelta);
  const summary = `Lv${unit.level} / 親密度${formatDelta(bondDelta)} / HP${formatDelta(hpDelta)} / 嫉妬${formatDelta(-jealousyDrop)} / 建築P${formatDelta(buildGain)} / 感情: ${unit.mood}`;
  return { bondDelta, hpDelta, jealousyDelta: -jealousyDrop, buildGain, playerLine, reply, summary, extraNotes };
}

function chooseMoodAfterTalk(unit, choice, bondDelta) {
  if (unit.jealousy >= 70) return "嫉妬";
  if (choice.intent === "plan" || choice.intent === "train" || choice.intent === "free") return "集中";
  if (choice.intent === "joke" && bondDelta < 3) return "怒り";
  if (choice.intent === "promise" || choice.intent === "gift" || choice.intent === "focus") return unit.bond >= 55 ? "恋愛中" : "ごきげん";
  if (bondDelta < 0) return "気まずい";
  return choice.mood;
}

function applyRandomGrowth(unit, choice) {
  const notes = [];
  const focusScale = choice.intent === "focus" ? 1 : 0;
  const catPenalty = playerProfiles[unit.id].catLike && randomChance(0.35) ? -1 : 0;
  const hpMaxDelta = randomChance(0.24) ? randomInt(0, 2) : 0;
  const atkDelta = randomChance(0.34 + focusScale * 0.12) ? randomInt(0, 1 + focusScale) + catPenalty : 0;
  const defDelta = randomChance(0.3) ? randomInt(0, 1) : 0;
  const knowledgeDelta = randomChance(0.34) ? randomInt(0, 2) : 0;
  const moveDelta = randomChance(0.12 + focusScale * 0.04) ? 1 : 0;

  if (hpMaxDelta > 0) {
    unit.maxHp = clamp(unit.maxHp + hpMaxDelta, 1, 999);
    unit.hp = clamp(unit.hp + hpMaxDelta, 1, unit.maxHp);
    notes.push(`${unit.name}の最大HPが${hpMaxDelta}上がった。`);
  }
  if (atkDelta !== 0) {
    unit.atk = clamp(unit.atk + atkDelta, 1, 999);
    notes.push(`${unit.name}の攻撃が${formatDelta(atkDelta)}。`);
  }
  if (defDelta > 0) {
    unit.def = clamp(unit.def + defDelta, 0, 999);
    notes.push(`${unit.name}の防御が+${defDelta}。`);
  }
  if (knowledgeDelta > 0) {
    unit.knowledge = clamp((unit.knowledge ?? 0) + knowledgeDelta, 0, 999);
    unit.skillUses = Math.max(unit.skillUses ?? 0, skillUsesFromKnowledge(unit.knowledge));
    notes.push(`${unit.name}の知識が+${knowledgeDelta}。`);
  }
  if (moveDelta > 0) {
    unit.move = clamp(unit.move + moveDelta, 1, 9);
    notes.push(`${unit.name}の移動が+${moveDelta}。`);
  }
  return notes;
}

function applyAttentionJealousy(focusedUnit, choice) {
  const notes = [];
  for (const ally of playerUnits()) {
    if (ally.id === focusedUnit.id || ally.hp <= 0) continue;
    if (!ally.needsAttention) continue;
    const rise =
      choice.intent === "team"
        ? randomInt(1, 4)
        : choice.intent === "focus"
          ? randomInt(8, 15)
          : randomInt(4, 9);
    ally.jealousy = clamp((ally.jealousy ?? 0) + rise, 0, 100);
    notes.push(`${ally.name}はかまってほしかったので、後回しにされて嫉妬が${rise}増えた。`);
    if (choice.intent === "team" && randomChance(0.45)) {
      ally.needsAttention = false;
      notes.push(`${ally.name}も「みんなで勝とう」に少し納得した。`);
    }
    applyJealousyState(ally, notes);
  }
  return notes;
}

function applyIgnoredAttention() {
  const notes = [];
  for (const unit of playerUnits()) {
    if (unit.hp <= 0 || unit.talked || unit.temporaryAllyTurns > 0) continue;
    const rise = unit.needsAttention ? randomInt(7, 14) : randomInt(2, 5);
    unit.jealousy = clamp((unit.jealousy ?? 0) + rise, 0, 100);
    unit.mood = unit.jealousy >= 70 ? "嫉妬" : "気まずい";
    notes.push(unit.needsAttention ? `${unit.name}はかまってマークを見逃され、嫉妬が${rise}増えた。` : `${unit.name}は会話なしでターンが終わり、嫉妬が${rise}増えた。`);
    if (randomChance(0.55)) unit.needsAttention = false;
    applyJealousyState(unit, notes);
  }
  return notes;
}

function applyHungerDecay() {
  const notes = [];
  for (const unit of playerUnits()) {
    if (unit.hp <= 0 || unit.temporaryAllyTurns > 0) continue;
    const drop = randomInt(8, 15);
    unit.hunger = clamp((unit.hunger ?? 100) - drop, 0, 100);
    if (unit.hunger <= 25) {
      unit.mood = unit.mood === "嫉妬" ? "嫉妬" : "落ち込み";
      notes.push(`${unit.name}のおなかが減っている。次の会話はごはんイベントになりやすい。`);
    }
  }
  return notes;
}

function applyJealousyState(unit, notes) {
  if (unit.jealousy >= 100) {
    unit.mood = "呆れ";
    unit.hp = 0;
    unit.acted = true;
    unit.needsAttention = false;
    notes.push(`${unit.name}は呆れて勝手に退却した。`);
    return;
  }
  if (unit.jealousy >= 75) {
    unit.mood = "嫉妬";
    if (randomChance(0.5)) unit.atk = clamp(unit.atk + 1, 1, 999);
    if (randomChance(0.55)) unit.def = clamp(unit.def - 1, 0, 999);
    notes.push(`${unit.name}の嫉妬が高まり、性能が不安定になった。`);
  } else if (unit.jealousy >= 55 && randomChance(0.45)) {
    unit.mood = "気まずい";
    unit.atk = clamp(unit.atk - 1, 1, 999);
    notes.push(`${unit.name}が少し気まずくなり、攻撃が下がった。`);
  }
}

function rollAttentionNeeds(initial = false) {
  const newlyNeedy = [];
  for (const unit of playerUnits()) {
    if (unit.hp <= 0 || unit.needsAttention) continue;
    const chance = initial ? 0.35 : 0.24 + Math.min(0.18, (unit.jealousy ?? 0) / 400);
    if (randomChance(chance)) {
      unit.needsAttention = true;
      newlyNeedy.push(unit.name);
    }
  }
  if (!initial && newlyNeedy.length === 0 && randomChance(0.45)) {
    const candidates = playerUnits().filter((unit) => unit.hp > 0 && !unit.needsAttention);
    if (candidates.length) {
      const unit = pick(candidates);
      unit.needsAttention = true;
      newlyNeedy.push(unit.name);
    }
  }
  if (!initial && newlyNeedy.length) {
    addLog(`${newlyNeedy.join("、")}にかまってマークが出た。`);
  }
}

function levelUpFromTalk(unit) {
  const notes = [];
  unit.level = (unit.level ?? 1) + 1;
  const hpMaxDelta = randomInt(1, 2);
  const atkDelta = randomChance(0.62) ? 1 : 0;
  const defDelta = randomChance(0.58) ? 1 : 0;
  const moveDelta = unit.level % 6 === 0 && randomChance(0.65) ? 1 : 0;

  unit.maxHp = clamp(unit.maxHp + hpMaxDelta, 1, 999);
  unit.hp = clamp(unit.hp + hpMaxDelta, 1, unit.maxHp);
  if (atkDelta > 0) unit.atk = clamp(unit.atk + atkDelta, 1, 999);
  if (defDelta > 0) unit.def = clamp(unit.def + defDelta, 0, 999);
  if (moveDelta > 0) unit.move = clamp(unit.move + moveDelta, 1, 9);

  notes.push(`${unit.name}がLv${unit.level}に上がった。最大HP+${hpMaxDelta}${atkDelta ? " / 攻撃+1" : ""}${defDelta ? " / 防御+1" : ""}${moveDelta ? " / 移動+1" : ""}。`);
  return notes;
}

function awardBuildPointsFromBond(bondDelta) {
  if (bondDelta <= 0) return 0;
  const gain = Math.max(1, Math.floor((bondDelta + randomInt(0, 3)) / 5));
  state.buildPoints = clamp(state.buildPoints + gain, 0, 99);
  return gain;
}

function maybeCreateMiniGame(unit, choice) {
  if (unit.temporaryAllyTurns > 0 || !randomChance(0.42)) return null;
  const type = pick(["janken", "acchi", "dodge"]);
  if (type === "dodge") {
    return {
      type,
      unitId: unit.id,
      expiresAt: Date.now() + 10000,
      danger: pick(["上", "下", "左", "右"]),
      dodges: 0,
      hits: 0,
    };
  }
  return { type, unitId: unit.id, choiceIntent: choice.intent };
}

function playMiniGameChoice(choice) {
  const game = state.miniGame;
  const unit = game ? state.units.find((candidate) => candidate.id === game.unitId) : null;
  if (!game || !unit) return;

  if (game.type === "janken") {
    const enemy = pick(["グー", "チョキ", "パー"]);
    const result = jankenResult(choice, enemy);
    finishMiniGame(unit, result, `あなたは${choice}、${unit.name}の相手は${enemy}。`);
    return;
  }

  if (game.type === "acchi") {
    const direction = pick(["上", "下", "左", "右"]);
    const result = choice === direction ? "win" : randomChance(0.25) ? "draw" : "lose";
    finishMiniGame(unit, result, `あなたは${choice}を読んだ。相手は${direction}を向いた。`);
    return;
  }

  if (game.type === "dodge") {
    if (Date.now() >= game.expiresAt) {
      finishDodgeMiniGame(unit);
      return;
    }
    if (choice === game.danger) {
      game.hits += 1;
      addLog(`${unit.name}が${choice}へ避けて被弾。`);
    } else {
      game.dodges += 1;
      addLog(`${unit.name}が${choice}へ避けて成功。`);
    }
    game.danger = pick(["上", "下", "左", "右"]);
    if (game.dodges + game.hits >= 6) {
      finishDodgeMiniGame(unit);
      return;
    }
    render();
  }
}

function jankenResult(player, enemy) {
  if (player === enemy) return "draw";
  if (
    (player === "グー" && enemy === "チョキ") ||
    (player === "チョキ" && enemy === "パー") ||
    (player === "パー" && enemy === "グー")
  ) {
    return "win";
  }
  return "lose";
}

function finishDodgeMiniGame(unit) {
  const game = state.miniGame;
  if (!game) return;
  const score = game.dodges - game.hits;
  const result = score >= 4 ? "win" : score >= 1 ? "draw" : "lose";
  finishMiniGame(unit, result, `10秒回避: 回避${game.dodges} / 被弾${game.hits}。`);
}

function finishMiniGame(unit, result, detail) {
  clearMiniGameTimer();
  const bonus = result === "win" ? 3 : result === "draw" ? 1 : 0;
  const hpBonus = result === "lose" ? 0 : randomInt(3, 8) + bonus;
  const notes = [];
  if (hpBonus > 0) {
    unit.maxHp = clamp(unit.maxHp + hpBonus, 1, 999);
    unit.hp = clamp(unit.hp + hpBonus, 1, unit.maxHp);
    notes.push(`最大HP+${hpBonus}`);
  }
  if (result === "win") {
    if (randomChance(0.6)) {
      unit.atk = clamp(unit.atk + 1, 1, 999);
      notes.push("攻撃+1");
    } else {
      unit.def = clamp(unit.def + 1, 0, 999);
      notes.push("防御+1");
    }
    unit.bond = clamp(unit.bond + randomInt(2, 5), 0, 100);
  } else if (result === "lose") {
    unit.hp = Math.max(1, unit.hp - randomInt(2, 7));
    unit.mood = "落ち込み";
    notes.push("少し落ち込み");
  }
  addLog(`${unit.name}のミニゲーム結果: ${result === "win" ? "勝ち" : result === "draw" ? "引き分け" : "負け"}。${detail} ${notes.join(" / ") || "ボーナスなし"}。`);
  state.lastTalkResult = {
    unitId: unit.id,
    playerLine: "よし、もう一回息を合わせよう。",
    reply: characterLine(unit, result === "win" ? "今のすごく楽しかった" : result === "draw" ? "次はもっといけそう" : "むずかしかったけど、まだやれる"),
    summary: `ミニゲーム: ${result} / ${notes.join(" / ") || "変化なし"}`,
  };
  state.miniGame = null;
  render();
}

function startMiniGameClock() {
  clearMiniGameTimer();
  miniGameTimer = window.setInterval(() => {
    if (!state.miniGame || state.miniGame.type !== "dodge") {
      clearMiniGameTimer();
      return;
    }
    const unit = state.units.find((candidate) => candidate.id === state.miniGame.unitId);
    if (!unit || Date.now() >= state.miniGame.expiresAt) {
      if (unit) finishDodgeMiniGame(unit);
      clearMiniGameTimer();
      return;
    }
    render();
  }, 1000);
}

function clearMiniGameTimer() {
  if (miniGameTimer) {
    window.clearInterval(miniGameTimer);
    miniGameTimer = null;
  }
}

function triggerAdjacentAllyConversation(unit, reason) {
  if (unit.team !== "player" || unit.hp <= 0) return [];
  const allies = adjacentAllies(unit);
  if (!allies.length) return [];
  if (reason === "move" && !randomChance(0.55)) return [];

  const ally = pick(allies);
  const notes = [allyBanterLine(unit, ally)];
  if (ally.needsAttention && randomChance(0.6)) {
    const rise = randomInt(3, 8);
    ally.jealousy = clamp((ally.jealousy ?? 0) + rise, 0, 100);
    notes.push(`${ally.name}は近くで別の会話を見て、嫉妬が${rise}増えた。`);
    applyJealousyState(ally, notes);
  }

  const tension = relationshipTension(unit, ally);
  if (tension <= 18 && randomChance(0.5)) {
    notes.push(allyPlayBonus(unit, ally));
  } else if (tension >= 78 && randomChance(0.45)) {
    notes.push(friendlyFire(unit, ally));
  }
  return notes;
}

function allyBanterLine(a, b) {
  const lines = {
    ren: {
      yui: "蓮「結衣、いっしょに突破するわん」 結衣「気分が乗ったらね、にゃ」",
      mio: "蓮「美桜の横だと安心するわん」 美桜「ええから前見とき。守ったるわ」",
      honoka: "蓮「歩太、こわかったら後ろにいていいわん」 歩太「あ…ありがとう…ございます…」",
    },
    yui: {
      ren: "結衣「蓮、まっすぐすぎて見てて飽きないにゃ」 蓮「ほめられた気がするわん」",
      mio: "結衣「美桜、その位置ちょっとずるいにゃ」 美桜「勝てる位置なら正義やろ」",
      honoka: "結衣「歩太、隠れるの上手いにゃ」 歩太「ほ…ほめ言葉ですか…？」",
    },
    mio: {
      ren: "美桜「蓮、飛ばしすぎたら拾いに行かへんで」 蓮「でも走りたいわん」",
      yui: "美桜「結衣、今日は機嫌ええ方？」 結衣「聞き方しだいにゃ」",
      honoka: "美桜「歩太、震えてても一手は指せるで」 歩太「は…はい…一手だけなら…」",
    },
    honoka: {
      ren: "歩太「蓮くん…前に出るの怖くないんですか…」 蓮「みんながいるから平気だわん」",
      yui: "歩太「結衣さん…自由でうらやましいです…」 結衣「自由は気分でできてるにゃ」",
      mio: "歩太「美桜さん…守り方を教えてください…」 美桜「まず深呼吸や。そこからやな」",
    },
  };
  return lines[a.id]?.[b.id] ?? `${a.name}と${b.name}が小声で盤面を確認した。`;
}

function relationshipTension(a, b) {
  const moodPressure = [a, b].filter((unit) => ["嫉妬", "怒り", "気まずい"].includes(unit.mood)).length * 15;
  const jealousy = ((a.jealousy ?? 0) + (b.jealousy ?? 0)) / 2;
  const trustBuffer = ((a.bond ?? 0) + (b.bond ?? 0)) / 6;
  return jealousy + moodPressure - trustBuffer;
}

function friendlyFire(a, b) {
  const attacker = (a.jealousy ?? 0) >= (b.jealousy ?? 0) ? a : b;
  const defender = attacker.id === a.id ? b : a;
  const damage = randomInt(2, 6);
  defender.hp = Math.max(0, defender.hp - damage);
  attacker.mood = "怒り";
  if (defender.hp === 0) {
    defender.mood = "落ち込み";
    return `${attacker.name}が険悪さに耐えきれず${defender.name}へ小突く。${damage}ダメージで撤退寸前の空気。`;
  }
  return `${attacker.name}が険悪さに耐えきれず${defender.name}へ小突く。味方同士なのに${damage}ダメージ。`;
}

function allyPlayBonus(a, b) {
  const hpGain = randomInt(2, 6);
  a.hp = clamp(a.hp + hpGain, 1, a.maxHp);
  b.hp = clamp(b.hp + hpGain, 1, b.maxHp);
  if (randomChance(0.45)) a.atk = clamp(a.atk + 1, 1, 999);
  if (randomChance(0.45)) b.def = clamp(b.def + 1, 0, 999);
  a.bond = clamp((a.bond ?? 0) + 1, 0, 100);
  b.bond = clamp((b.bond ?? 0) + 1, 0, 100);
  return `${a.name}と${b.name}が近くで少し遊んだ。HP+${hpGain}、関係も少しだけ前進。`;
}

function buildReply(unit, choice, bondDelta, hpDelta) {
  const good = bondDelta >= 8;
  const healed = hpDelta > 3;
  const replies = {
    ren: good
      ? [`すごい、ぼく今ならどこまでも走れる気がするわん`, `えへへ、君に選ばれると胸がぽかぽかするわん`]
      : [`うん、がんばってみるわん`, `ちょっと迷ったけど、君を信じるわん`],
    yui: good
      ? [`ふーん、なかなか分かってるにゃ`, `今日は特別に機嫌よくしてあげるにゃ`]
      : [`気分次第だけど、まあ聞いてあげるにゃ`, `その選び方、嫌いではないにゃ`],
    mio: good
      ? [`ええやん。そういうの、うちは嫌いやないで`, `ほな任せとき。風向き変えたるわ`]
      : [`まあまあやな。次はもっと気楽にいこか`, `焦らんでええ。まだ盤面は動くで`],
    honoka: good
      ? [`あの…嬉しいです…少しだけ怖くなくなりました…`, `ぼくでも…役に立てる気がします…`]
      : [`えっと…がんばります…たぶん…`, `少しびっくりしました…でも嫌じゃないです…`],
    kaeru: good
      ? [`その返し、変で最高けろ`, `今の会話で跳ねる角度が決まったけろ`]
      : [`うん、普通すぎて逆に新しいけろ`, `実験は続行けろ`],
    riko: good
      ? [`えへへ、ちゃんと見てくれてるぴょん`, `今の言い方、かわいくて好きぴょん`]
      : [`むう、次はもっと可愛く言ってほしいぴょん`, `まだ採点中だぴょん`],
    ibuki: good
      ? [`燃えてきた。今なら一直線に行ける`, `任されたなら突っ切るだけだ`]
      : [`分かった。考えるより先に動きそうだけどな`, `まだ火は消えてないぞ`],
    non: good
      ? [`ゆっくりだけど、ちゃんと嬉しいです`, `少しだけ足取りが軽くなりました`]
      : [`びっくりしたけど、大丈夫です`, `焦らず行きますね`],
  }[unit.id] ?? [`分かった。`];
  const reply = pick(replies);
  return healed ? `${reply} HPも少し戻りました。` : reply;
}

function playerChoiceLabel(unit, talk, choice) {
  const lines = {
    care: [
      "それ、もう少し聞かせて。",
      "無理に笑わなくていいよ。今の気持ちを教えて。",
      "今日は君の話をちゃんと聞きたい。",
    ],
    play: [
      "少しだけふざけて、肩の力を抜こう。",
      "その話、意外と面白いね。もう一回聞かせて。",
      "今なら笑いながら突破できそうだね。",
    ],
    train: [
      "次の一手を一緒に確認しよう。",
      "焦らずに、動き方を合わせよう。",
      "君の得意な形で攻めよう。",
    ],
    snack: [
      "帰りにおやつを買っていこう。",
      "今は少し休もう。甘いものでもどうかな。",
      "好きなおやつを選んでいいよ。",
    ],
    gift: [
      "君に似合うものを選ばせて。",
      "今日はお礼をしたい。受け取ってくれる？",
      "これ、君が持っていたら心強いと思う。",
    ],
    free: [
      "今日は君のやり方に任せるよ。",
      "自由に動いていい。ちゃんと見ているから。",
      "型にはめない方が君らしいね。",
    ],
    promise: [
      "次も隣にいる。約束する。",
      "勝っても負けても、君のことは置いていかない。",
      "この盤面が終わっても、また話そう。",
    ],
    focus: [
      "今は君を一番頼りにしている。",
      "この一手は君に任せたい。",
      "君だけにしかできない動きがある。",
    ],
    team: [
      "みんなで勝とう。君の力も必要だ。",
      "一人だけじゃなく、全員で前に進もう。",
      "君も、みんなも、大事にしたい。",
    ],
  };
  const pool = lines[choice.intent] ?? [choice.label];
  const key = `${unit.id}-${talk.id}-${choice.id}`;
  const index = stableIndex(key, pool.length);
  return pool[index];
}

function characterLine(unit, line) {
  return `「${line}」`;
}

function legalMoves(unit) {
  const stats = effectiveStats(unit);
  const candidates = movementVectors(unit).flatMap((direction) => {
    const results = [];
    for (let step = 1; step <= direction.max; step += 1) {
      const row = unit.row + direction.dr * step;
      const col = unit.col + direction.dc * step;
      if (!inside(row, col)) break;
      const occupant = unitAt(row, col);
      const structure = structureAt(row, col);
      if (occupant) {
        if (occupant.team !== unit.team) break;
        break;
      }
      if (structure) break;
      if (step <= stats.move) results.push({ row, col });
    }
    return results;
  });

  return uniquePositions(candidates);
}

function movementVectors(unit) {
  const maxLine = unit.moveType === "rook" || unit.moveType === "bishop" || unit.moveType === "lance" ? 3 : 1;
  const forward = unit.team === "player" ? -1 : 1;
  const patterns = {
    pawn: [
      { dr: forward, dc: 0, max: 1 },
    ],
    lance: [
      { dr: forward, dc: 0, max: maxLine },
    ],
    knight: [
      { dr: forward * 2, dc: -1, max: 1 },
      { dr: forward * 2, dc: 1, max: 1 },
    ],
    support: [
      { dr: forward, dc: 0, max: 2 },
      { dr: 0, dc: -1, max: 1 },
      { dr: 0, dc: 1, max: 1 },
      { dr: -forward, dc: 0, max: 1 },
    ],
    guard: [
      { dr: -1, dc: -1, max: 1 },
      { dr: -1, dc: 0, max: 1 },
      { dr: -1, dc: 1, max: 1 },
      { dr: 0, dc: -1, max: 1 },
      { dr: 0, dc: 1, max: 1 },
      { dr: 1, dc: -1, max: 1 },
      { dr: 1, dc: 0, max: 1 },
      { dr: 1, dc: 1, max: 1 },
    ],
    rook: [
      { dr: -1, dc: 0, max: maxLine },
      { dr: 1, dc: 0, max: maxLine },
      { dr: 0, dc: -1, max: maxLine },
      { dr: 0, dc: 1, max: maxLine },
    ],
    bishop: [
      { dr: -1, dc: -1, max: maxLine },
      { dr: -1, dc: 1, max: maxLine },
      { dr: 1, dc: -1, max: maxLine },
      { dr: 1, dc: 1, max: maxLine },
    ],
    king: [
      { dr: -1, dc: -1, max: 1 },
      { dr: -1, dc: 0, max: 1 },
      { dr: -1, dc: 1, max: 1 },
      { dr: 0, dc: -1, max: 1 },
      { dr: 0, dc: 1, max: 1 },
      { dr: 1, dc: -1, max: 1 },
      { dr: 1, dc: 0, max: 1 },
      { dr: 1, dc: 1, max: 1 },
    ],
  };
  return patterns[unit.moveType] ?? patterns.guard;
}

function attackTargets(unit) {
  const unitTargets = state.units
    .filter((target) => target.team !== unit.team && target.hp > 0 && isInAttackRange(unit, target))
    .map((target) => ({ row: target.row, col: target.col }));
  const structureTargets = state.structures
    .filter((target) => target.hp > 0 && target.owner !== unit.team && isInAttackRange(unit, target))
    .map((target) => ({ row: target.row, col: target.col }));
  return uniquePositions([...unitTargets, ...structureTargets]);
}

function legalBuildCells(unit) {
  const directions = [
    { dr: -1, dc: 0 },
    { dr: 1, dc: 0 },
    { dr: 0, dc: -1 },
    { dr: 0, dc: 1 },
  ];
  return directions
    .map(({ dr, dc }) => ({ row: unit.row + dr, col: unit.col + dc }))
    .filter(
      (pos) =>
        inside(pos.row, pos.col) &&
        !unitAt(pos.row, pos.col) &&
        !structureAt(pos.row, pos.col) &&
        !samePos(pos, PLAYER_BASE) &&
        !samePos(pos, ENEMY_BASE),
    );
}

function isInAttackRange(attacker, target) {
  const range = attacker.range + (attacker.bond >= 80 && attacker.team === "player" ? 1 : 0);
  const straight = attacker.row === target.row || attacker.col === target.col;
  const diagonal = Math.abs(attacker.row - target.row) === Math.abs(attacker.col - target.col);
  const dist = distance(attacker, target);
  if (attacker.moveType === "bishop") return diagonal && dist <= range;
  if (attacker.moveType === "rook") return straight && dist <= range;
  if (attacker.moveType === "lance") return straight && dist <= range;
  if (attacker.moveType === "knight") {
    const dr = Math.abs(attacker.row - target.row);
    const dc = Math.abs(attacker.col - target.col);
    return (dr === 2 && dc === 1) || dist <= range;
  }
  return dist <= range;
}

function comboTargets(unit) {
  const combo = getAvailableCombo(unit);
  if (!combo) return [];
  return enemyUnits()
    .filter((target) => target.hp > 0 && distance(unit, target) <= combo.range)
    .map((target) => ({ row: target.row, col: target.col }));
}

function getAvailableCombo(unit) {
  if (!unit || unit.team !== "player" || unit.mood === "気まずい") return null;
  const combo = getComboDefinition(unit);
  if (!combo) return null;
  const partner = state.units.find((candidate) => candidate.id === combo.partnerId);
  if (!partner || partner.hp <= 0 || partner.acted || partner.mood === "気まずい") return null;
  if (unit.bond < 40 || partner.bond < 40) return null;
  if (distance(unit, partner) > 2) return null;
  return combo;
}

function skillUsesFromKnowledge(knowledge) {
  return clamp(1 + Math.floor((knowledge ?? 0) / 25), 1, 6);
}

function personalSkillFor(unitId, trainingType = "猛攻型") {
  const base = personalSkillDefinitions[unitId] ?? { name: "読み筋リカバー", role: "support", base: "HPと防御を立て直す。" };
  const typeEffects = {
    猛攻型: "威力アップ",
    守護型: "使用後に防御アップ",
    策士型: "使用後に再移動しやすい",
    絆型: "隣接味方がいると追加効果",
    激情型: "HPが低いほど効果アップ",
    安定型: "失敗せず回復量が安定",
  };
  return {
    ...base,
    trainingType,
    effect: `${base.base} / ${trainingType}: ${typeEffects[trainingType] ?? "標準効果"}`,
  };
}

function effectiveStats(unit) {
  if (unit.mood === "呆れ" || unit.hp <= 0) return { atk: 0, def: 0, move: 0 };
  const mood = moodEffects[unit.mood] ?? { atk: 0, def: 0, move: 0 };
  const bondAtk = unit.team === "player" && unit.bond >= 60 ? 1 : 0;
  const bondMove = unit.team === "player" && unit.bond >= 70 ? 1 : 0;
  const lowTrust = unit.team === "player" && unit.bond <= 20 ? -1 : 0;
  const devotion = unit.team === "player" && unit.bond >= 65 ? Math.min(3, Math.floor((unit.focus ?? 0) / 3)) : 0;
  const jealousy = unit.team === "player" ? jealousyBattleBonus(unit) : { atk: 0, def: 0, move: 0 };
  const path = pathBonus(unit);
  return {
    atk: Math.max(1, unit.atk + mood.atk + bondAtk + devotion + lowTrust + path.atk + jealousy.atk),
    def: Math.max(0, unit.def + mood.def + path.def + jealousy.def),
    move: Math.max(1, unit.move + mood.move + bondMove + path.move + jealousy.move),
  };
}

function jealousyBattleBonus(unit) {
  const value = unit.jealousy ?? 0;
  if (value >= 92) return { atk: 5, def: -4, move: 1 };
  if (value >= 70) return { atk: 3, def: -2, move: 0 };
  if (value >= 35) return { atk: 1, def: -1, move: 0 };
  return { atk: 0, def: 0, move: 0 };
}

function pathBonus(unit) {
  if (unit.path === "信頼") return { atk: 0, def: 1, move: 0 };
  if (unit.path === "混沌") return { atk: 2, def: -1, move: 0 };
  if (unit.path === "恋愛") return { atk: 1, def: 0, move: 1 };
  if (unit.path === "策士") return { atk: 0, def: 1, move: 0 };
  return { atk: 0, def: 0, move: 0 };
}

function calculateDamage(attacker, defender) {
  const atk = effectiveStats(attacker).atk;
  const def = effectiveStats(defender).def;
  const relation = attacker.team === "player" && nearbyAllyCount(attacker) > 0 ? 1 : 0;
  return Math.max(1, atk + relation - def);
}

function calculateStructureDamage(attacker, structure) {
  const atk = effectiveStats(attacker).atk;
  const relation = attacker.team === "player" && nearbyAllyCount(attacker) > 0 ? 1 : 0;
  return Math.max(1, atk + relation - (structure.def ?? 0));
}

function triggerAttackAnimation(attacker, target) {
  state.animation = {
    attackerId: attacker.id,
    targetId: target.unit?.id ?? null,
    targetStructureId: target.structure?.id ?? null,
  };
  window.setTimeout(() => {
    if (state.animation?.attackerId === attacker.id) {
      state.animation = null;
      render();
    }
  }, 420);
}

function nearbyAllyCount(unit) {
  return state.units.filter(
    (ally) => ally.team === unit.team && ally.id !== unit.id && ally.hp > 0 && distance(ally, unit) <= 1,
  ).length;
}

function adjacentAllies(unit) {
  return state.units.filter(
    (ally) => ally.team === unit.team && ally.id !== unit.id && ally.hp > 0 && distance(ally, unit) <= 1,
  );
}

function nearestPlayer(enemy) {
  return playerUnits()
    .filter((unit) => unit.hp > 0)
    .map((unit) => ({ unit, score: distance(enemy, unit) }))
    .sort((a, b) => a.score - b.score)[0]?.unit;
}

function nearestAttackableStructure(unit) {
  return state.structures
    .filter((structure) => structure.hp > 0 && structure.owner !== unit.team && isInAttackRange(unit, structure))
    .map((structure) => ({ structure, score: distance(unit, structure) }))
    .sort((a, b) => a.score - b.score)[0]?.structure;
}

function checkVictory() {
  const king = state.units.find((unit) => unit.id === "king");
  const capturer = playerUnits().find((unit) => unit.hp > 0 && samePos(unit, ENEMY_BASE));
  const baseCaptured = Boolean(capturer);
  if (king && king.hp <= 0) {
    finishGame("勝利", "黒金会長を撃破。盤上部の空気が一気にゆるんだ。");
  } else if (baseCaptured) {
    recordBattleStat(capturer, "captured", 1);
    finishGame("制圧勝利", "敵拠点を制圧。王を倒さずに勝つ、かなりずる賢い勝ち方。");
  }
}

function checkDefeat() {
  if (playerUnits().every((unit) => unit.hp <= 0)) {
    finishGame("敗北", "推し駒たちは撤退。今日は会話パートからやり直し。");
  }
}

function finishGame(title, text) {
  if (state.result) return;
  state.storyRoute = title.includes("勝利") ? (title.includes("制圧") ? "clever" : "heroic") : "retry";
  state.postBattleRewards = applyPostBattleGrowth(title);
  state.battleActivityLog = buildBattleActivityLog(title);
  state.battleTitles = buildBattleTitles(title);
  state.playerExpReward = title.includes("勝利") ? addPlayerExp(45 + playerUnits().filter((unit) => unit.hp > 0).length * 5, "battle勝利") : "";
  updateActiveTeamPresetAfterBattle(title);
  state.result = { title, text };
  resultTitleEl.textContent = title;
  resultTextEl.innerHTML = resultHtml(text, title);
  resultModalEl.hidden = false;
  addLog(`${title}: ${text}`);
}

function applyPostBattleGrowth(title) {
  if (!title.includes("勝利")) return [];
  return playerUnits()
    .filter((unit) => unit.hp > 0)
    .map((unit) => {
      const hp = randomInt(4, 10);
      const bond = randomInt(3, 8);
      const levelUp = randomChance(0.4);
      const knowledge = randomChance(0.55) ? randomInt(1, 3) : 0;
      unit.maxHp = clamp(unit.maxHp + hp, 1, 999);
      unit.hp = clamp(unit.hp + hp, 1, unit.maxHp);
      unit.bond = clamp(unit.bond + bond, 0, 100);
      unit.knowledge = clamp((unit.knowledge ?? 0) + knowledge, 0, 999);
      if (levelUp) unit.level += 1;
      syncBattleUnitToProgress(unit, { hp, bond, levelUp });
      return `${unit.name}: 最大HP+${hp} / 親密度+${bond}${knowledge ? ` / 知識+${knowledge}` : ""}${levelUp ? ` / 仕上がり+1` : ""}`;
    });
}

function syncBattleUnitToProgress(unit) {
  if (unit.team !== "player" || !getBaseUnit(unit.id)) return;
  if (state.battleTeamPreset?.id) return;
  const progress = getProgress(unit.id);
  progress.level = clamp(Math.max(progress.level, unit.level ?? 1), 1, 99);
  progress.maxHp = clamp(Math.max(progress.maxHp, unit.maxHp), 1, 999);
  progress.atk = clamp(Math.max(progress.atk, unit.atk), 1, 999);
  progress.def = clamp(Math.max(progress.def, unit.def), 0, 999);
  progress.move = clamp(Math.max(progress.move, unit.move), 1, 9);
  progress.knowledge = clamp(Math.max(progress.knowledge ?? 0, unit.knowledge ?? 0), 0, 999);
  progress.bond = clamp(Math.max(progress.bond, unit.bond ?? 0), 0, 100);
  progress.jealousy = clamp(unit.jealousy ?? progress.jealousy ?? 0, 0, 100);
  progress.hunger = clamp(unit.hunger ?? progress.hunger ?? 80, 0, 100);
  progress.mood = unit.mood ?? progress.mood;
  progress.path = unit.path ?? progress.path;
  progress.lastMessage = `battle後に保存: T${progress.trainingTurns} / 親密${progress.bond} / HP${progress.maxHp} / 知識${progress.knowledge}`;
  setProgress(progress, unit.presetId);
}

function buildBattleActivityLog(title) {
  return playerUnits().map((unit) => {
    const stats = state.battleStats?.[unit.id] ?? {};
    if (stats.comboFinisher) return `${unit.name}: 合体技で決定打`;
    if (stats.kills) return `${unit.name}: 敵を${stats.kills}体撃破`;
    if (stats.captured) return `${unit.name}: 拠点制圧に成功`;
    if (stats.protected) return `${unit.name}: 味方を${stats.protected}回守った`;
    if ((stats.damage ?? 0) >= 20) return `${unit.name}: 総ダメージ${stats.damage}で押し切った`;
    if (title.includes("勝利") && unit.hp > 0) return `${unit.name}: 最後まで盤上に残った`;
    return `${unit.name}: 次の出番に向けて立て直し`;
  });
}

function buildBattleTitles(title) {
  if (!title.includes("勝利")) return [];
  return playerUnits().map((unit) => {
    const stats = state.battleStats?.[unit.id] ?? {};
    const earned =
      stats.comboFinisher ? "決定打の星" :
      stats.kills >= 2 ? "突破者" :
      stats.captured ? "制圧者" :
      stats.protected >= 2 ? "守護者" :
      unit.jealousy >= 70 ? "危険な勝利者" :
      unit.id === "yui" ? "気まぐれな勝利者" :
      "勝利の立会人";
    return `${unit.name}は「${earned}」の称号を得た！`;
  });
}

function updateActiveTeamPresetAfterBattle(title) {
  if (!state.battleTeamPreset?.id) return;
  const roster = loadSavedRoster();
  const list = getTeamPresetList(roster);
  const preset = list.find((candidate) => candidate.id === state.battleTeamPreset.id);
  if (!preset) return;
  for (const unit of playerUnits()) {
    const member = preset.members.find((candidate) => candidate.id === unit.id);
    if (!member) continue;
    const progress = sanitizeProgress(unit.id, member.progress);
    progress.level = clamp(Math.max(progress.level, unit.level ?? 1), 1, 99);
    progress.maxHp = clamp(Math.max(progress.maxHp, unit.maxHp), 1, 999);
    progress.atk = clamp(Math.max(progress.atk, unit.atk), 1, 999);
    progress.def = clamp(Math.max(progress.def, unit.def), 0, 999);
    progress.move = clamp(Math.max(progress.move, unit.move), 1, 9);
    progress.knowledge = clamp(Math.max(progress.knowledge ?? 0, unit.knowledge ?? 0), 0, 999);
    progress.bond = clamp(Math.max(progress.bond, unit.bond ?? 0), 0, 100);
    progress.jealousy = clamp(unit.jealousy ?? progress.jealousy ?? 0, 0, 100);
    progress.hunger = clamp(unit.hunger ?? progress.hunger ?? 80, 0, 100);
    progress.mood = unit.mood ?? progress.mood;
    progress.path = unit.path ?? progress.path;
    progress.lastMessage = title.includes("勝利") ? "battle勝利後にチームプリセットへ記録。" : "battle後にチームプリセットへ記録。";
    const titled = finalizeProgressIdentity(progress);
    member.progress = titled;
    member.trainingType = titled.trainingType;
    member.title = titled.title;
  }
  preset.teamType = determineTeamType(preset.members.map((member) => member.progress));
  preset.title = determineTeamTitle(preset.members.map((member) => member.progress));
  preset.battleLog = [...(preset.battleLog ?? []), ...state.battleActivityLog, ...state.battleTitles].slice(-40);
  preset.updatedAt = new Date().toISOString();
  roster.teamPresets = list;
  roster.activeTeamPreset = preset.id;
  saveSavedRoster(roster);
}

function resultHtml(text, title) {
  const routeText =
    state.storyRoute === "heroic"
      ? "分岐: 王撃破ルート。黒金会の中心に踏み込む章へ。"
      : state.storyRoute === "clever"
        ? "分岐: 拠点制圧ルート。王を倒さず盤面を支配する策士章へ。"
        : "分岐: 敗北ルート。放課後の会話から立て直す章へ。";
  const rewards = state.postBattleRewards.length
    ? `<ul>${state.postBattleRewards.map((reward) => `<li>${reward}</li>`).join("")}</ul>`
    : `<p>戦闘後成長なし。次の盤面で巻き返そう。</p>`;
  const activity = state.battleActivityLog.length
    ? `<div class="result-growth"><b>今回の活躍</b><ul>${state.battleActivityLog.map((line) => `<li>${line}</li>`).join("")}</ul></div>`
    : "";
  const titles = state.battleTitles.length
    ? `<div class="result-growth"><b>獲得称号</b><ul>${state.battleTitles.map((line) => `<li>${line}</li>`).join("")}</ul></div>`
    : "";
  const playerExp = state.playerExpReward ? `<div class="result-growth"><b>プレイヤー経験値</b><p>${state.playerExpReward}</p></div>` : "";
  return `
    <span>${text}</span>
    <strong>${routeText}</strong>
    ${activity}
    ${titles}
    <div class="result-growth"><b>戦闘後成長</b>${rewards}</div>
    ${playerExp}
  `;
}

function playerUnits() {
  return state.units.filter((unit) => unit.team === "player");
}

function recordBattleStat(unit, key, amount = 1) {
  if (!unit || unit.team !== "player") return;
  state.battleStats = state.battleStats || {};
  state.battleStats[unit.id] = state.battleStats[unit.id] || { kills: 0, captured: 0, protected: 0, combo: 0, comboFinisher: 0, damage: 0 };
  state.battleStats[unit.id][key] = (state.battleStats[unit.id][key] ?? 0) + amount;
}

function enemyUnits() {
  return state.units.filter((unit) => unit.team === "enemy");
}

function randomizeEnemyPositions(units) {
  const pool = [
    { row: 0, col: 3 },
    { row: 0, col: 4 },
    { row: 0, col: 5 },
    { row: 1, col: 3 },
    { row: 1, col: 4 },
    { row: 1, col: 5 },
    { row: 2, col: 3 },
    { row: 2, col: 4 },
    { row: 2, col: 5 },
    { row: 3, col: 4 },
    { row: 3, col: 5 },
  ].filter((pos) => !samePos(pos, ENEMY_BASE));
  const shuffled = shuffle(pool);
  const enemies = units.filter((unit) => unit.team === "enemy");
  const king = enemies.find((unit) => unit.id === "king");
  if (king) {
    const kingSpot = pick([
      { row: 0, col: 4 },
      { row: 1, col: 4 },
      { row: 1, col: 5 },
    ]);
    king.row = kingSpot.row;
    king.col = kingSpot.col;
  }
  const used = new Set(king ? [`${king.row}:${king.col}`] : []);
  for (const enemy of enemies.filter((unit) => unit.id !== "king")) {
    const spot = shuffled.find((pos) => !used.has(`${pos.row}:${pos.col}`));
    if (!spot) continue;
    enemy.row = spot.row;
    enemy.col = spot.col;
    used.add(`${spot.row}:${spot.col}`);
  }
}

function selectedUnit() {
  return state.units.find((unit) => unit.id === state.selectedId);
}

function unitAt(row, col) {
  return state.units.find((unit) => unit.hp > 0 && unit.row === row && unit.col === col);
}

function structureAt(row, col) {
  return state.structures.find((structure) => structure.hp > 0 && structure.row === row && structure.col === col);
}

function inside(row, col) {
  return row >= 0 && row < BOARD_SIZE && col >= 0 && col < BOARD_SIZE;
}

function samePos(a, b) {
  return a.row === b.row && a.col === b.col;
}

function distance(a, b) {
  return Math.abs(a.row - b.row) + Math.abs(a.col - b.col);
}

function uniquePositions(positions) {
  const seen = new Set();
  return positions.filter((pos) => {
    const key = `${pos.row}:${pos.col}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

function gaugeHtml(label, value, type, displayValue = null) {
  const danger = type === "jealousy" && value >= 75 ? " high" : "";
  return `
    <div class="bar ${type}${danger}">
      <span style="width:${clamp(value, 0, 100)}%"></span>
      <b>${label}</b>
      <em>${displayValue ?? clamp(Math.round(value), 0, 100)}</em>
    </div>
  `;
}

function comboConditionHtml(unit) {
  const combo = getComboDefinition(unit);
  if (!combo) {
    return `<div class="combo-help"><strong>合体技条件</strong><p>この駒はまだ合体技ペアがいない。</p></div>`;
  }
  const partner = state.units.find((candidate) => candidate.id === combo.partnerId);
  const partnerName = partner?.name ?? combo.partnerLabel[unit.id];
  const checks = [
    { label: `${unit.name}親密40`, ok: unit.bond >= 40 },
    { label: `${partnerName}親密40`, ok: partner?.bond >= 40 },
    { label: "距離2以内", ok: partner ? distance(unit, partner) <= 2 : false },
    { label: "気まずさなし", ok: partner ? !["気まずい", "呆れ"].includes(unit.mood) && !["気まずい", "呆れ"].includes(partner.mood) : false },
    { label: "相方未行動", ok: partner ? !partner.acted : false },
    { label: "未使用", ok: !state.comboUsed },
  ];
  const items = checks
    .map((check) => `<li class="${check.ok ? "ok" : "ng"}">${check.ok ? "OK" : "NG"} ${check.label}</li>`)
    .join("");
  return `<div class="combo-help"><strong>合体技: ${combo.name}</strong><ul>${items}</ul></div>`;
}

function getComboDefinition(unit) {
  const combo = comboDefinitions.find((candidate) => candidate.users.includes(unit.id));
  if (!combo) return null;
  const partnerId = combo.users.find((id) => id !== unit.id);
  return { ...combo, partnerId };
}

function escapeHtml(value) {
  return String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomChance(rate) {
  return Math.random() < rate;
}

function delay(ms) {
  return new Promise((resolve) => window.setTimeout(resolve, ms));
}

function pick(items) {
  return items[randomInt(0, items.length - 1)];
}

function shuffle(items) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const swap = randomInt(0, index);
    [result[index], result[swap]] = [result[swap], result[index]];
  }
  return result;
}

function stableIndex(text, length) {
  let hash = 0;
  for (let index = 0; index < text.length; index += 1) {
    hash = (hash * 31 + text.charCodeAt(index)) >>> 0;
  }
  return length === 0 ? 0 : hash % length;
}

function formatDelta(value) {
  return value > 0 ? `+${value}` : `${value}`;
}

function percent(value, max) {
  return clamp(Math.round((Math.max(0, value) / max) * 100), 0, 100);
}

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

function coord(row, col) {
  return `${row + 1}-${col + 1}`;
}

function nudgeBond(unit, amount) {
  if (unit.team !== "player") return;
  unit.bond = clamp(unit.bond + amount, 0, 100);
}

function bondLabel(unit) {
  if (unit.team === "enemy") return "悪印: 黒金シジル";
  if (unit.bond >= 80) return "親密: 覚醒寸前";
  if (unit.bond >= 60) return "親密: 連携良好";
  if (unit.bond >= 40) return "親密: 信頼中";
  if (unit.bond >= 20) return "親密: ぎこちない";
  return "親密: 命令不信";
}

function moodIcon(mood) {
  return (
    {
      "ごきげん": "♪",
      "怒り": "!",
      "落ち込み": "↓",
      "恋愛中": "♥",
      "気まずい": "…",
      "集中": "◆",
      "嫉妬": "嫉",
      "呆れ": "×",
    }[mood] ?? "◆"
  );
}

function addLog(message) {
  state.log.push(message);
}

function portraitHtml(unit) {
  if (unit.art) {
    return `<img src="${unit.art}" alt="${unit.name}">`;
  }
  return portraitSvg(unit);
}

function portraitSvg(unit) {
  const moodColor = {
    "ごきげん": "#f2c14e",
    "怒り": "#d94f45",
    "落ち込み": "#7291a3",
    "恋愛中": "#d95d89",
    "気まずい": "#8d8177",
    "集中": "#127c7c",
  }[unit.mood] ?? "#127c7c";

  return `
    <svg viewBox="0 0 64 64" aria-hidden="true">
      <rect width="64" height="64" fill="${unit.color}" />
      <circle cx="47" cy="16" r="12" fill="${moodColor}" opacity="0.92" />
      <path d="M16 52c2-13 10-20 20-20s18 7 20 20" fill="#fff4d6" />
      <circle cx="36" cy="26" r="13" fill="#ffe1bd" />
      <path d="M21 25c3-13 22-18 30-4-8-1-13-4-19-8-2 6-6 9-11 12Z" fill="#242830" />
      <circle cx="31" cy="27" r="2" fill="#242830" />
      <circle cx="42" cy="27" r="2" fill="#242830" />
      <path d="M32 35c4 3 8 3 11 0" stroke="#b45145" stroke-width="2" fill="none" stroke-linecap="round" />
      <text x="8" y="17" fill="#fff" font-size="13" font-weight="900">${unit.piece}</text>
    </svg>
  `;
}

resetGame();
