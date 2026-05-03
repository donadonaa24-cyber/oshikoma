# 推し駒battle

将棋を土台にした完全オリジナルの「将棋風シミュレーションRPG」プロトタイプです。

## 現在入っている土台

- 6×6盤面のターン制バトル
- トップ画面とルール確認画面
- 推し駒紹介画面
- ゲームスタート後のモード選択
- localStorageに保存される推し駒育成データ
- 恋愛ADV風の推し駒育成パート
- 頭をなでる/ほっぺを触る/手を握る「推し駒と戯れる」パート
- 育てた推し駒から最大4体を選ぶチーム編成
- HP制のダメージ戦闘
- 味方の初期親密度0、Lv1 HPは40〜70でランダム
- 育成でHP上限999まで成長
- 王撃破と拠点制圧の勝利条件
- 味方4体、敵4体の初期ユニット
- 駒ごとの移動タイプ、攻撃範囲、スキル名
- 親密度、感情、関係分岐による性能変化
- 画面下固定の恋愛ADV風会話パート
- キャラ別30件、合計120件の会話レパートリー
- 会話選択肢によるランダムな親密度/HP/能力変化
- 嫉妬ゲージと、嫉妬上昇による弱体化/呆れ退却
- かまってマーク、感情マーク、会話ごとのレベルアップ
- おなかゲージと、空腹時のごはんイベント
- 会話から派生するじゃんけん/あっち向いてほい/10秒回避ミニゲーム
- 親密度上昇で増える建築P
- ショップで買う壁材
- 壁材を使ったHP1の壁と、壁材数ぶん耐久値が増える建物
- 近くの味方同士の遊び/喧嘩イベント
- 近くの味方同士の会話と、険悪時の味方攻撃
- HPが減った敵幹部との交渉、一時加入または離脱
- 数秒ずつ見える敵行動テンポと攻撃モーション
- 盤面を動かさない固定UIと、駒の横に出る行動選択ウィンドウ
- 右上付近にランダム配置されるCPU初期位置
- 特定ペアの合体技
- 合体技の発動条件表示
- 会話イベントの章立て
- 成り/クラスチェンジ
- 戦闘後の成長画面
- 勝敗によるストーリー分岐
- ステージエディタ
- 簡易敵AI
- デスクトップ/スマホ対応UI
- 生成画像による初期4キャラの立ち絵

## 初期キャラクター画像

- `assets/characters/ren-dog-rook.png`: 飛 / 犬の男の子コスプレ
- `assets/characters/yui-cat-bishop.png`: 角 / 猫の女の子コスプレ
- `assets/characters/mio-bird-silver.png`: 銀 / 鳥の女の子コスプレ
- `assets/characters/honoka-insect-pawn.png`: 歩 / 虫の男の子コスプレ
- `assets/characters/kaeru-frog-knight.png`: 桂 / 蛙の女の子コスプレ
- `assets/characters/riko-rabbit-knight.png`: 桂 / 兎の女の子コスプレ
- `assets/characters/ibuki-boar-lance.png`: 香 / 猪の男の子コスプレ
- `assets/characters/non-sheep-pawn.png`: 歩 / 羊の男の子コスプレ
- `assets/characters/enemy-king-lion.png`: CPU王 / ライオンの男性
- `assets/characters/enemy-silver-wolf.png`: CPU銀 / 狼の男性
- `assets/characters/enemy-jealous-leopard.png`: CPU嫉 / 豹の女性
- `assets/characters/enemy-bishop-deer.png`: CPU角 / 鹿イメージの女の子

## 起動方法

`index.html` をブラウザで開くと遊べます。

## 次に足すと強いもの

- 会話章ごとの専用背景
- クラスチェンジ後の専用立ち絵差分
- ステージエディタの保存/読み込み
