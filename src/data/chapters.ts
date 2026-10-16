import type { Chapter, ChapterState, Language, Bilingual, BilingualList } from "../types.ts";

export function t(val: Bilingual | undefined, lang: Language = "zh"): string {
  if (!val) return "";
  if (typeof val === "string") return val;
  return val[lang] || val.zh || val.en || "";
}

export function tList(val: BilingualList | undefined, lang: Language = "zh"): string[] {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  return val[lang] || val.zh || val.en || [];
}

export function getBeatIndex(timeSec: number): number {
  const clamped = Math.max(0, Math.min(39.999, Number.isFinite(timeSec) ? timeSec : 0));
  if (clamped < 10) return 0;
  if (clamped < 20) return 1;
  if (clamped < 30) return 2;
  return 3;
}

export const CHAPTER_FIGURES: Record<string, (t: number, beat: number) => string> = {
  ch01: () => "watch",
  ch02: (_t, beat) => ["message-queue", "dns", "process-pump", "git-merge"][beat],
  ch03: (_t, beat) => ["computer", "binary-search", "b-tree", "computer"][beat],
  ch04: (_t, beat) => ["press-and-pull", "profile", "one-context", "press-and-pull"][beat],
  ch05: (_t, beat) => ["lru-cache", "rate-limiter", "afterburner", "seasons"][beat],
  ch06: (_t, beat) => ["one-stage", "fit", "separable-blur", "lens-bench"][beat],
  ch07: (t, beat) => {
    if (beat === 0) return t < 5.5 ? "hash-map" : "bloom-filter";
    if (beat === 1) return "mutex";
    if (beat === 2) return "tcp-handshake";
    return "sampling";
  },
  ch08: (_t, beat) => ["turbofan", "iframe:raptor-engine.html", "iframe:raptor-engine.html", "turbofan"][beat],
  ch09: (_t, beat) => ["lit-by-facing", "easing", "turbofan", "three-reads"][beat],
  ch10: (_t, beat) => ["mark-sweep", "four-frames", "turbofan", "frosted-copy"][beat],
  ch11: (_t, beat) => ["watch", "seasons", "iframe:raptor-engine.html", "turbofan"][beat],
  ch12: (_t, beat) => ["box-model", "spot-plate", "bevel-offset", "shared-canvas"][beat],
  ch13: (_t, beat) => ["debounce", "merge-sort", "gradient-descent", "flex-grow"][beat],
  ch14: (_t, beat) => ["foundry", "glass-furnace", "forge", "studio"][beat],
  ch15: (_t, beat) => ["public-key", "iframe:turning-dial.html", "plasma-cutter", "tokamak"][beat],
};

export function getActiveFigureKey(chapterId: string, tSec: number, beatIndex: number): string {
  const fn = CHAPTER_FIGURES[chapterId];
  return fn ? fn(tSec, beatIndex) : "watch";
}

export const CHAPTERS: Chapter[] = [
  {
    id: "ch01",
    index: 0,
    number: "01",
    title: { zh: "一行字造一台机器", en: "A Machine from a Single Prompt" },
    subtitle: { zh: "OFFICIAL FIGURE: WATCH MOVEMENT · ONE-LINE PROMPT", en: "Official Figure: Watch Movement · One-Line Prompt" },
    duration: 40,
    stageType: "official-pkg",
    machineKey: "watch",
    thesis: {
      zh: "“解释机械表怎么计时” —— 1小时54分钟，零人工绘图，一次成型。",
      en: "“Explain how a mechanical watch tells time” — 1h 54m, zero human drawing, generated in one shot."
    },
    takeaway: {
      zh: "一行字，一台机器 · 上线 6 天斩获 8,200+ GitHub Stars",
      en: "One prompt, one living machine · 8,200+ GitHub stars in 6 days"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [watch] · 4 Hz · 28,800 vph · CROWN WINDING";
        if (beat === 1) return "KEY [S] · 1/20x SLOW SPEED · 15-TOOTH ESCAPE WHEEL";
        if (beat === 2) return "KEY [E] · BRIDGES LIFTED APART · 60:1 GEAR TRAIN";
        return "BUILD 1h 54m · 0 HUMAN STROKES · ★ 8,203";
      }
      if (beat === 0) return "OFFICIAL [watch] · 4 Hz · 28,800 vph · CROWN WINDING";
      if (beat === 1) return "KEY [S] · 1/20× SLOW SPEED · 15-TOOTH ESCAPE WHEEL";
      if (beat === 2) return "KEY [E] · BRIDGES LIFTED APART · 60:1 GEAR TRAIN";
      return "BUILD 1h 54m · 0 人工绘图 · ★ 8,203";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 上链储能", en: "00s · Winding & Energy" },
        headline: { zh: "拖动表冠上发条，动力储存逐格攀升", en: "Drag the crown to wind the mainspring, watch power reserve build" },
        detail: { zh: "棘轮啮合旋转、棘爪止逆作响，发条盒游丝盘紧，动力储存实时涨向 38 小时。", en: "Ratchet teeth mesh with clicking pawls, barrel spring coils tight, power reserve climbs towards 38 hours." },
        metrics: { zh: ["官方 watch 原版机芯", "表冠拖拽上发条", "棘轮+棘爪止逆联动"], en: ["Official watch movement", "Crown drag winding", "Ratchet & click mechanism"] },
        stageCue: "WATCH_WIND",
        scriptText: {
          zh: "先看一个东西。这是一块机械表的机芯。你可以拖动表冠上发条，棘轮转，棘爪响，动力储存一格一格涨上去。",
          en: "Take a look at this. This is a mechanical watch movement. You can drag the crown to wind the mainspring: the ratchet turns, the click snaps, and the power reserve climbs notch by notch."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 慢镜擒纵", en: "10s · Slow-Mo Escapement" },
        headline: { zh: "按 S 键放慢至 1/20，看清半齿释放", en: "Press S to slow down to 1/20x and observe half-tooth escapement release" },
        detail: { zh: "时间流速降至二十分之一，双叉瓦擒纵叉精准卡入 15 齿擒纵轮，每次摆动恰好放行半个齿距。", en: "Time slows by 20x: ruby pallet jewels lock into the 15-tooth escape wheel, releasing half a tooth per swing." },
        metrics: { zh: ["KEY [S] · 1/20× 慢镜", "15 齿擒纵轮", "单次放行 0.5 齿"], en: ["Key [S] · 1/20x Slow-Mo", "15-tooth escape wheel", "0.5 tooth release per beat"] },
        stageCue: "WATCH_SLOW",
        scriptText: {
          zh: "按一下S键，时间放慢到二十分之一，你能看到擒纵叉把十五齿的擒纵轮，一次放过去半个齿。",
          en: "Press the S key, and time slows down to one-twentieth. You can watch the pallet fork let the fifteen-tooth escape wheel slip past half a tooth at a time."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 夹板拆解", en: "20s · Exploded Bridges" },
        headline: { zh: "按 E 键升起夹板，真实齿轮比全公开", en: "Press E to lift the bridges and expose authentic gear reduction ratios" },
        detail: { zh: "上夹板与摆轮夹板沿定位立柱平稳抬升，底层轮系一览无余：秒轮一分钟一圈，中心轮一小时一圈。", en: "Top plates and balance cock lift on guide pillars, exposing the gear train: fourth wheel 1 rpm, center wheel 1 rph." },
        metrics: { zh: ["KEY [E] · 夹板抬升", "秒轮 1 r/min", "中心轮 1 r/hour"], en: ["Key [E] · Exploded Bridges", "Fourth wheel 1 rpm", "Center wheel 1 rph"] },
        stageCue: "WATCH_APART",
        scriptText: {
          zh: "再按E键，夹板升起来，下面的轮系露出来，齿轮比例全是真的，秒轮一分钟一圈，中心轮一小时一圈。",
          en: "Press the E key, and the bridges lift apart to reveal the gear train underneath. Every gear ratio is authentic: the seconds wheel turns once a minute, the center wheel once an hour."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 一次成型", en: "30s · One-Shot Generation" },
        headline: { zh: "无人手绘：来自一行 Prompt 的工程奇迹", en: "Zero human drafting: An engineering marvel from a single prompt" },
        detail: { zh: "Prompt: “解释机械表怎么计时” —— Claude 独立运转 1 小时 54 分钟一次成型，Anatomy 开源 6 天突破 8,200 星。", en: "Prompt: 'Explain how a mechanical watch tells time' — Claude worked autonomously for 1h 54m in one shot. Anatomy hit 8,200+ stars in 6 days." },
        metrics: { zh: ["耗时 1h 54m 一次成型", "Claude Code 技能", "6 天 8,200+ Stars"], en: ["1h 54m one-shot build", "Claude Code skill", "8,200+ stars in 6 days"] },
        stageCue: "WATCH_FULL",
        scriptText: {
          zh: "这块表没有任何人画过。它来自一行字：解释机械表怎么计时。Claude自己干了一小时五十四分钟，一次成型。做出它的，是一个叫Anatomy的Claude Code技能。上线六天，GitHub八千多星。这期视频，从原理到实践，把它讲透。",
          en: "No human ever drew this watch. It came from a single line: explain how a mechanical watch tells time. Claude built it in 1 hour and 54 minutes in one shot, powered by a Claude Code skill called Anatomy — 8,200 stars in six days."
        }
      }
    ]
  },
  {
    id: "ch02",
    index: 1,
    number: "02",
    title: { zh: "方块和箭头的老问题", en: "The Old Problem with Boxes and Arrows" },
    subtitle: { zh: "OFFICIAL FIGURES: MESSAGE-QUEUE · DNS · PROCESS-PUMP · GIT-MERGE", en: "Official Figures: Message Queue · DNS · Process Pump · Git Merge" },
    duration: 40,
    stageType: "official-pkg",
    machineKey: "message-queue",
    thesis: {
      zh: "方块只告诉你部件存在，箭头把最关键的“怎么动”丢给读者脑补。",
      en: "Boxes only tell you parts exist; arrows leave the crucial question — how it moves — to the reader's imagination."
    },
    takeaway: {
      zh: "画出那个东西本身 —— 读者不用脑补，伸手玩一遍就懂了",
      en: "Draw the machine itself — no guessing needed, reach out and play with it once to understand"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [message-queue] · MARBLE RUN ESCAPEMENT";
        if (beat === 1) return "OFFICIAL [dns] · PNEUMATIC TUBE CARRIER ROUTING";
        if (beat === 2) return "OFFICIAL [process-pump] · REAL PISTON & VALVE ACTUATION";
        return "OFFICIAL [git-merge] · HANDS-ON MECHANISM";
      }
      if (beat === 0) return "OFFICIAL [message-queue] · 弹珠滑道擒纵队列";
      if (beat === 1) return "OFFICIAL [dns] · 气动管道胶囊寻址路由";
      if (beat === 2) return "OFFICIAL [process-pump] · 真实活塞与阀门驱动";
      return "OFFICIAL [git-merge] · 轨道合流拨叉分拣";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 流程图困局", en: "00s · The Diagram Trap" },
        headline: { zh: "讲消息队列或网络寻址，为什么以前总是方块加箭头？", en: "Why did we always explain queues or handshakes with boxes and arrows?" },
        detail: { zh: "方块只声明模块存在，单向箭头暗示某种联系，但真正的动态机制在静态框图里完全缺席。", en: "Boxes merely declare components exist and arrows hint at motion, leaving actual dynamics completely absent." },
        metrics: { zh: ["官方 message-queue 弹珠轨", "告别静态方块箭头", "真实重力滑道排队"], en: ["Official message-queue marble track", "Goodbye static boxes & arrows", "Real gravity chute queueing"] },
        stageCue: "MARBLE_QUEUE",
        scriptText: {
          zh: "你可能遇到过这种情况。想给别人讲清一个技术概念，哈希冲突也好，TCP握手也好，画出来的都是方块加箭头。方块告诉你部件存在，箭头代表某种运动，运动本身全靠读者脑补。",
          en: "You've probably faced this before. Whether explaining hash collisions or TCP handshakes, we draw boxes and arrows. Boxes say parts exist, arrows imply motion, and the reader has to imagine how it actually moves."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 脑补的歧义", en: "10s · Ambiguity of Guessing" },
        headline: { zh: "A 指向 B 的箭头：是推送、拉取还是轮询？", en: "An arrow from A to B: Is it push, pull, or polling?" },
        detail: { zh: "一千个读者脑补出一千种时序。换成官方 DNS 气动管道机，请求胶囊如何逐级寻址投递一目了然。", en: "Every reader imagines a different sequence. In the official DNS pneumatic tube machine, capsule routing is unmistakable." },
        metrics: { zh: ["官方 dns 气动管道机", "消除推/拉/轮询歧义", "物理管道因果闭环"], en: ["Official dns pneumatic tubes", "Eliminates push/pull/poll ambiguity", "Physical causal loop"] },
        stageCue: "DNS_TUBES",
        scriptText: {
          zh: "脑补这件事最麻烦的地方在于，每个人补出来的都不一样。一个箭头从A指向B，到底是推送、拉取还是轮询，图里根本没有答案。看完的人点点头，其实什么都没带走。",
          en: "The trouble with imagination is that everyone pictures something different. Does an arrow from A to B mean push, pull, or poll? The diagram never says. People nod along and walk away with nothing."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 造出实体机器", en: "20s · Build the Real Thing" },
        headline: { zh: "Ryan 的解法：直接让 AI 画出那个东西本身", en: "Ryan's solution: Have AI draw the working mechanism itself" },
        detail: { zh: "切入官方 process-pump 进程水泵机：一台真实的机器，阀门怎么开、活塞怎么动，概念就是什么样。", en: "Enter the official process-pump: a real machine where how valves open and pistons stroke is the concept itself." },
        metrics: { zh: ["官方 process-pump 水泵", "零件运动 = 概念本身", "实时物理状态读数"], en: ["Official process-pump rig", "Part motion = the concept", "Live physical readouts"] },
        stageCue: "PROCESS_PUMP",
        scriptText: {
          zh: "开发者Ryan对这件事忍了很久。他的想法很直接，让AI画出那个东西本身。一台真实的机器，零件怎么动，概念就是什么样。",
          en: "Developer Ryan was fed up with this. His idea was simple: make AI draw the thing itself. A real machine where the way the parts move is the concept."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 伸手即懂", en: "30s · Touch and Understand" },
        headline: { zh: "零件怎么动，概念就是什么样", en: "No imagination needed: Play with it once and it clicks" },
        detail: { zh: "切入官方 git-merge 轨道合流机：读者完全不用脑补，伸手拨动一次开关就彻底懂了。", en: "Switch to the official git-merge track junction: readers don't have to guess — flip the switch once and understand." },
        metrics: { zh: ["官方 git-merge 合流轨", "零脑补歧义", "伸手玩一遍即懂"], en: ["Official git-merge junction", "Zero mental guesswork", "Hands-on comprehension"] },
        stageCue: "GIT_MERGE",
        scriptText: {
          zh: "读者不用脑补，伸手玩一遍就懂了。",
          en: "Readers don't have to guess in their heads — they reach out, play with it once, and get it immediately."
        }
      }
    ]
  },
  {
    id: "ch03",
    index: 2,
    number: "03",
    title: { zh: "Anatomy 是什么", en: "What is Anatomy?" },
    subtitle: { zh: "OFFICIAL FIGURES: COMPUTER · BINARY-SEARCH · B-TREE", en: "Official Figures: Computer · Binary Search · B-Tree" },
    duration: 40,
    stageType: "official-pkg",
    machineKey: "computer",
    thesis: {
      zh: "一句话生成可交互等轴测机器插图，MIT 开源，全平台 Agent 通用。",
      en: "Turn a single sentence into an interactive isometric machine — MIT open-source across coding agents."
    },
    takeaway: {
      zh: "npx skills add wheresryan22/anatomy · 工程与艺术的交汇点",
      en: "npx skills add wheresryan22/anatomy · Where engineering meets art"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [computer] · 1984 DESK COMPUTER · MIT LICENSE";
        if (beat === 1) return "OFFICIAL [binary-search] · 33 MACHINES IN GALLERY";
        if (beat === 2) return "OFFICIAL [b-tree] · CLAUDE CODE / OPENCODE / CODEX";
        return "OFFICIAL [computer] · 85 SOLIDS · ENGINEERING OR ART?";
      }
      if (beat === 0) return "OFFICIAL [computer] · 1984 桌面电脑 · MIT 免费开源";
      if (beat === 1) return "OFFICIAL [binary-search] · 实验室天平 · 官网 33 台机器";
      if (beat === 2) return "OFFICIAL [b-tree] · 旋转卡片柜 · 跨平台一键安装";
      return "OFFICIAL [computer] · 85 个实体 · 工程还是艺术？";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 开源诞生", en: "00s · Open-Source Release" },
        headline: { zh: "10月8日开源的 Agent Skill，MIT 协议完全免费", en: "An Agent Skill open-sourced on Oct 8 under the free MIT License" },
        detail: { zh: "输入一句话，Anatomy 驱动大模型发明一台实体机器来解释概念，输出可拖拽、可按键的等轴测插图。", en: "Give it one sentence, and Anatomy guides Claude to invent a machine explaining it — draggable, pressable, and rotatable." },
        metrics: { zh: ["官方 computer 桌面电脑", "MIT License 免费开源", "拖 / 按 / 转全交互"], en: ["Official computer figure", "MIT License free & open", "Drag, press, and turn"] },
        stageCue: "CRT_INTRO",
        scriptText: {
          zh: "Anatomy是Ryan在10月8日开源的Agent Skill，MIT协议，免费。你给它一句话，它让Claude发明一台机器来解释这句话，产出一张能上手玩的等轴测插图。拖、按、转，都支持。",
          en: "Anatomy is an Agent Skill open-sourced by Ryan on October 8 under the MIT license, completely free. Give it a sentence, and Claude invents a hands-on isometric machine you can drag, press, and turn."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 33台机器图集", en: "10s · 33-Machine Gallery" },
        headline: { zh: "从二分查找天平到涡扇发动机，官网已收录 33 台机器", en: "33 machines in the official gallery, from binary search scales to turbofans" },
        detail: { zh: "舞台切入官方 binary-search（二分查找实验室天平）：砝码逐级折半称量，精准映射算法收敛过程。", en: "Stage switches to official binary-search: a precision lab balance halving weights step by step." },
        metrics: { zh: ["官方 binary-search 天平", "33 台官方展品", "算法 → 航空重工"], en: ["Official binary-search balance", "33 official gallery machines", "Algorithms to aerospace"] },
        stageCue: "BINARY_BALANCE",
        scriptText: {
          zh: "到现在，官网图集里躺着33台机器，从二分查找到涡轮风扇发动机都有。",
          en: "Right now, 33 machines sit in the official gallery — ranging from binary search all the way to a turbofan jet engine."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 跨端一键安装", en: "20s · One-Command Install" },
        headline: { zh: "通吃 Claude Code、OpenCode 与 Codex", en: "Runs in Claude Code, OpenCode, and Codex with a single command" },
        detail: { zh: "舞台切入官方 b-tree（B树旋转卡片柜）：一行命令 npx skills add wheresryan22/anatomy 即可全局加载。", en: "Stage switches to official b-tree rotary card index: install via npx skills add wheresryan22/anatomy." },
        metrics: { zh: ["官方 b-tree 旋转卡片柜", "Claude Code / OpenCode / Codex", "npx skills add 一键装"], en: ["Official b-tree rotary file", "Claude Code / OpenCode / Codex", "One-line npx skills add"] },
        stageCue: "BTREE_ROTARY",
        scriptText: {
          zh: "它不只跑在Claude Code里，OpenCode和Codex也能加载。安装一条命令，npx skills add wheresryan22/anatomy。",
          en: "It doesn't just run in Claude Code; OpenCode and Codex can load it too. Installation takes a single command: npx skills add wheresryan22 slash anatomy."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 工程还是艺术", en: "30s · Engineering or Art?" },
        headline: { zh: "有人说这是工程，有人说是艺术", en: "Some call it engineering; others call it art" },
        detail: { zh: "回到官方 1984 桌面电脑：连键盘敲击与 CRT 显像管关机坍缩成中心亮点的物理细节都严丝合缝。", en: "Back to the 1984 desk computer: even the keystrokes and CRT phosphor collapse on power-off are modeled to perfection." },
        metrics: { zh: ["官方 computer 实时渲染", "CRT 关机坍缩物理细节", "工程 × 艺术"], en: ["Official computer live render", "CRT phosphor power-off physics", "Engineering meets art"] },
        stageCue: "CRT_POWER",
        scriptText: {
          zh: "有人说这是工程，有人说是艺术，你怎么看，打在公屏上。",
          en: "Some call this engineering, others call it art. What do you think? Drop your thoughts in the comments."
        }
      }
    ]
  },
  {
    id: "ch04",
    index: 3,
    number: "04",
    title: { zh: "物体就是解释", en: "The Object is the Explanation" },
    subtitle: { zh: "OFFICIAL FIGURES: PRESS-AND-PULL · PROFILE · ONE-CONTEXT", en: "Official Figures: Press & Pull · Profile · One Context" },
    duration: 40,
    stageType: "official-pkg",
    machineKey: "press-and-pull",
    thesis: {
      zh: "SKILL.md 第一条铁律：不许画方块，不许画箭头，不许让标签飘在空中。",
      en: "The first law at the top of SKILL.md: No boxes, no arrows, and no labels floating in thin air."
    },
    takeaway: {
      zh: "造一台叫得出名字的机器，一堆小零件，每个零件都有活干",
      en: "Build a recognizable machine of many small parts where every single part has a job to do"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [press-and-pull] · THE OBJECT IS THE EXPLANATION";
        if (beat === 1) return "OFFICIAL [profile] · CONTOUR GAUGE PINS · NO FLAT SLABS";
        if (beat === 2) return "OFFICIAL [one-context] · 16-WELL GANTRY PLOTTER";
        return "OFFICIAL [press-and-pull] · 53 SOLIDS · 4x ZOOM QUALITY BAR";
      }
      if (beat === 0) return "OFFICIAL [press-and-pull] · 物体就是解释 · 弹簧按键测试台";
      if (beat === 1) return "OFFICIAL [profile] · 轮廓仿形探针尺 · 拒绝悬浮与薄板";
      if (beat === 2) return "OFFICIAL [one-context] · 16孔龙门绘图仪 · 零件各司其职";
      return "OFFICIAL [press-and-pull] · 53个实体 · 4倍放大依然耐看";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 灵魂铁律", en: "00s · The First Law" },
        headline: { zh: "SKILL.md 置顶准则：物体就是解释", en: "Pinned at the very top of SKILL.md: The object is the explanation" },
        detail: { zh: "舞台展示官方质量标杆 press-and-pull（弹簧按键测试台）：探针按压玻璃按键，千分表同步读出倾角。", en: "Stage runs official press-and-pull: a plunger presses a keycap while a dial indicator reads out tilt angle live." },
        metrics: { zh: ["官方 press-and-pull 标杆", "禁止方块箭头与悬空标签", "运动即概念定义"], en: ["Official press-and-pull benchmark", "No boxes, arrows, or floating tags", "Motion defines the concept"] },
        stageCue: "TEST_RIG_INTRO",
        scriptText: {
          zh: "这个技能的全部灵魂，写在SKILL.md的最顶上：物体就是解释。不许画方块，不许画箭头，不许让标签飘在空中。Claude必须发明一台真实的东西，它的运转方式等于概念本身，还要用一句话说清，什么在动，这个动代表什么。",
          en: "The entire soul of this skill sits at the very top of SKILL.md: the object is the explanation. No boxes, no arrows, no floating labels. Claude must invent a real device whose operation equals the concept, stating in one sentence what moves and what that motion means."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 两种典型失败", en: "10s · Two Classic Failures" },
        headline: { zh: "Ryan 总结的无数次失败，只有两种死法", en: "Across countless failed runs, Ryan found only two ways diagrams die" },
        detail: { zh: "太抽象（悬浮板块）或太平淡（薄板画线）。舞台切入官方 profile（轮廓仿形尺）：几十根精密探针紧密贴合。", en: "Too abstract (floating slabs) or too flat (a bare plate with lines). Contrast that with the official profile contour gauge." },
        metrics: { zh: ["官方 profile 轮廓仿形尺", "拒绝悬浮抽象板块", "拒绝无体积扁平薄板"], en: ["Official profile contour gauge", "Reject floating abstract slabs", "Reject flat featureless plates"] },
        stageCue: "PROFILE_GAUGE",
        scriptText: {
          zh: "Ryan说他看过无数次失败。失败只有两种。一种太抽象，一堆悬浮板块，看不出是个啥。一种太平，一块大板子画几条线，没体积没细节。",
          en: "Ryan says he watched countless failures, and they always fail in one of two ways: either too abstract — floating slabs that look like nothing — or too flat — a big board with a few lines and zero volume or detail."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 唯一药方", en: "20s · The Only Cure" },
        headline: { zh: "造一台叫得出名字的机器，每个小零件都有活干", en: "The cure: Build a named machine of small parts where each has a job" },
        detail: { zh: "舞台切入官方 one-context（16孔龙门绘图仪）：一个共享 GPU 上下文变成单个打印头巡回访问 16 个墨水池。", en: "Stage switches to official one-context: a shared WebGL context rendered as one gantry head visiting 16 ink wells." },
        metrics: { zh: ["官方 one-context 龙门绘图仪", "1 个打印头巡访 16 槽", "每个零件各司其职"], en: ["Official one-context gantry plotter", "1 printhead serving 16 wells", "Every part has a specific job"] },
        stageCue: "GANTRY_PLOTTER",
        scriptText: {
          zh: "药方也只有一个，造一台叫得出名字的机器，一堆小零件，每个零件都有活干。",
          en: "And there is only one cure: build a recognizable machine made of many small parts, where every single part has a job to do."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 四倍细节标准", en: "30s · 4x Zoom Standard" },
        headline: { zh: "1× 看清整机，4× 放大处处皆有真实机械结构", en: "Clear at 1x overview, mechanically rich at 4x close-up inspection" },
        detail: { zh: "回到 press-and-pull 放大视角：53 个实体、470 条路径，倒角、沉孔螺钉与弹簧在 4 倍镜下依然无懈可击。", en: "Zooming into press-and-pull: 53 solids and 470 paths — bevels, countersunk screws, and springs hold up under 4x magnification." },
        metrics: { zh: ["53 实体 / 470 路径", "0.4–1.6 精密倒角", "1× 清晰 / 4× 耐看"], en: ["53 solids / 470 paths", "0.4–1.6 precision bevels", "Clear at 1x / rich at 4x"] },
        stageCue: "TEST_RIG_ZOOM",
        scriptText: {
          zh: "从整体到四倍放大，每一个倒角、螺钉、刻度都经得起审视。",
          en: "From the full overview down to four-times zoom, every chamfer, screw head, and dial tick stands up to close inspection."
        }
      }
    ]
  },
  {
    id: "ch05",
    index: 4,
    number: "05",
    title: { zh: "提示词的三个关键词", en: "Three Keywords in the Prompt" },
    subtitle: { zh: "OFFICIAL FIGURES: LRU-CACHE · RATE-LIMITER · AFTERBURNER · SEASONS", en: "Official Figures: LRU Cache · Rate Limiter · Afterburner · Seasons" },
    duration: 40,
    stageType: "official-pkg",
    machineKey: "lru-cache",
    thesis: {
      zh: "提示词里只写想法，别写画什么；把发明机器的工作交给 Claude。",
      en: "State only the concept in your prompt, never what to draw — leave inventing the machine to Claude."
    },
    takeaway: {
      zh: "interactive（能拖能按） · WebGL（流体火焰着色器） · 3D（真纵深重投影）",
      en: "interactive (drag & press) · WebGL (shader plumes & fluids) · 3D (true depth re-projection)"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [lru-cache] · BOOKCASE EVICTION METAPHOR";
        if (beat === 1) return "KEYWORD [interactive] · OFFICIAL [rate-limiter]";
        if (beat === 2) return "KEYWORD [WebGL] · OFFICIAL [afterburner] SHADER PLUME";
        return "KEYWORD [3D] · OFFICIAL [seasons] 26 PARTS IN TRUE 3D";
      }
      if (beat === 0) return "OFFICIAL [lru-cache] · 自动退书架隐喻 · 只写想法不写画面";
      if (beat === 1) return "关键词 [interactive] · OFFICIAL [rate-limiter] 令牌桶限流";
      if (beat === 2) return "关键词 [WebGL] · OFFICIAL [afterburner] 着色器尾焰激波";
      return "关键词 [3D] · OFFICIAL [seasons] 26个三维零件每帧重投影";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 反直觉铁律", en: "00s · Counter-Intuitive Rule" },
        headline: { zh: "只写你要解释的想法：LRU 缓存自动变成书架", en: "Only write the idea: LRU cache eviction becomes a mechanical bookcase" },
        detail: { zh: "舞台直接运行官方 lru-cache（自动退书架）：你只写“解释LRU缓存怎么淘汰条目”，Claude 自己发明了这台书架机。", en: "Stage runs official lru-cache: prompt 'explain how an LRU cache evicts entries', and Claude invents this bookcase." },
        metrics: { zh: ["官方 lru-cache 书架机", "只给想法不写画面", "最久未用书籍自动滑落"], en: ["Official lru-cache bookcase", "Prompt the idea, not the object", "Least-used book drops down"] },
        stageCue: "LRU_BOOKCASE",
        scriptText: {
          zh: "用起来有个反直觉的地方。提示词里只写想法，别写画什么。你写解释LRU缓存怎么淘汰条目，就够了。决定把它画成书架这件事，是Claude的活。",
          en: "Using it is counter-intuitive: only write the idea in your prompt, never what to draw. Just write 'explain how an LRU cache evicts entries.' Deciding to turn it into a bookcase is Claude's job."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 关键词 1：interactive", en: "10s · Keyword 1: interactive" },
        headline: { zh: "写下 interactive，死图瞬间变成可把玩的仪器", en: "Add 'interactive' so the figure can be dragged and pressed" },
        detail: { zh: "舞台切入官方 rate-limiter（令牌桶限流器）：写上 interactive，即刻支持拖拽阀门、按键调速与实时流量读数。", en: "Stage switches to official rate-limiter: adding 'interactive' unlocks draggable valves, key controls, and live gauges." },
        metrics: { zh: ["官方 rate-limiter 令牌桶", "interactive 激活拖拽按键", "不写则是静态图"], en: ["Official rate-limiter bucket", "'interactive' enables drag & keys", "Static diagram if omitted"] },
        stageCue: "RATE_LIMITER",
        scriptText: {
          zh: "但这里有个很关键的地方，有三个词会改变结果，只有你写进去它才用。interactive，出来的图能拖能按，不写就是一张死图。",
          en: "However, three special keywords change the output, and Claude only uses them if you ask. First: interactive — the result can be dragged and pressed; leave it out and you get a static image."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 关键词 2：WebGL", en: "20s · Keyword 2: WebGL" },
        headline: { zh: "写下 WebGL，火焰、水流、等离子体嵌进同一个等轴相机", en: "Add 'WebGL' to hand fire, water, and plasma to shaders in the same camera" },
        detail: { zh: "舞台切入官方 afterburner（喷气加力燃烧室）：WebGL 着色器在前后两层 SVG 之间实时渲染激波钻戒与尾焰。", en: "Stage switches to official afterburner: a WebGL shader renders shock diamonds and exhaust plumes inside the isometric camera." },
        metrics: { zh: ["官方 afterburner 加力燃烧室", "WebGL 着色器内嵌等轴相机", "火焰激波零突兀过渡"], en: ["Official afterburner plume", "WebGL shader in isometric camera", "Seamless flame & shockwaves"] },
        stageCue: "AFTERBURNER_GL",
        scriptText: {
          zh: "WebGL，火焰、水流、等离子体交给着色器，嵌在同一个等轴相机里画。",
          en: "Second: WebGL — flames, water flow, and plasma are handed off to fragment shaders, rendered inside the exact same isometric camera."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 关键词 3：3D", en: "30s · Keyword 3: 3D" },
        headline: { zh: "写下 3D，零件真正在纵深里转，每帧重新投影排序", en: "Add '3D' so parts truly rotate in depth, re-projecting and sorting every frame" },
        detail: { zh: "舞台切入官方 seasons（四季 3D 地球仪）：26 个三维零件在纵深中真实公转自转，每帧重算四级明暗与太阳光照。", en: "Stage switches to official seasons: 26 parts revolve in true 3D depth, re-projecting and sorting every single frame." },
        metrics: { zh: ["官方 seasons 四季 3D 地球", "26 零件每帧真 3D 重投影", "耗时按小时计的重武器"], en: ["Official seasons 3D tellurion", "26 parts re-projected per frame", "Measured in hours, not minutes"] },
        stageCue: "SEASONS_3D",
        scriptText: {
          zh: "3D，零件真正在纵深里转，每帧重新投影排序。这个最贵，按小时算，分钟就别想了。",
          en: "Third: 3D — parts genuinely rotate in depth, re-projected and depth-sorted every frame. This one is the most expensive: count on hours, forget about minutes."
        }
      }
    ]
  },
  {
    id: "ch06",
    index: 5,
    number: "06",
    title: { zh: "十步流水线", en: "The Ten-Step Pipeline" },
    subtitle: { zh: "OFFICIAL FIGURES: ONE-STAGE · FIT · SEPARABLE-BLUR · LENS-BENCH", en: "Official Figures: One Stage · Fit · Separable Blur · Lens Bench" },
    duration: 40,
    stageType: "official-pkg",
    machineKey: "one-stage",
    thesis: {
      zh: "质量大头在前 4 步就定了 —— 那时候屏幕上连一个像素都还没有。",
      en: "Most of the quality is decided in the first four steps — before a single pixel is drawn on screen."
    },
    takeaway: {
      zh: "先想清楚造什么，再动手画：在任何 AI 工程协作里都成立",
      en: "Figure out what to build before drawing a pixel — a universal law for AI collaboration"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "STEPS 01-02 · OFFICIAL [one-stage] · TIER & BUDGET";
        if (beat === 1) return "STEPS 03-04 · OFFICIAL [fit] · ZERO-PIXEL PHASE DECIDES 80%";
        if (beat === 2) return "STEPS 05-09 · OFFICIAL [separable-blur] · GEOMETRY & PAINTER";
        return "STEP 10 · OFFICIAL [lens-bench] · CRITIC VERIFICATION";
      }
      if (beat === 0) return "步骤 01-02 · OFFICIAL [one-stage] · 定尺寸报预算 (Figure / Hero / Epic)";
      if (beat === 1) return "步骤 03-04 · OFFICIAL [fit] · 零像素阶段决定大头质量";
      if (beat === 2) return "步骤 05-09 · OFFICIAL [separable-blur] · 静态几何与画家算法上色";
      return "步骤 10 · OFFICIAL [lens-bench] · 像批评家一样光学验收";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 定级报预算", en: "00s · Size & Budget" },
        headline: { zh: "第 1 步先报零件规模与耗时，绝不擅自开工", en: "Step 1 quotes part count and time budget — never starts Epic unasked" },
        detail: { zh: "舞台运行官方 one-stage：Figure 40–80 零件（半小时+），Hero 80–150 零件（2–4小时），Epic 6小时起步必须先确认。", en: "Figure: 40–80 parts (~30m+), Hero: 80–150 parts (2–4h), Epic: 6h+ and never starts without asking you first." },
        metrics: { zh: ["官方 one-stage 舞台机构", "Figure / Hero / Epic 三档", "不问用户绝不擅自开 Epic"], en: ["Official one-stage rig", "Figure / Hero / Epic tiers", "Never starts Epic without asking"] },
        stageCue: "PIPELINE_1",
        scriptText: {
          zh: "从你敲回车到图做完，Claude走一条固定流水线，一共十步。定尺寸，先报预算，Figure四十到八十个零件，半小时出头，Hero八十到一百五十个零件，两到四小时，Epic六小时起步，而且不问你绝不擅自开工。",
          en: "From hitting Enter to a finished piece, Claude follows a fixed ten-step pipeline. Step one sets the scale and budget: Figure is 40 to 80 parts in half an hour, Hero is 80 to 150 parts in two to four hours, and Epic starts at six hours — never starting without asking."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 前四步定乾坤", en: "10s · First Four Steps" },
        headline: { zh: "收集真数字 → 发明机器 → 列零件清单（零像素阶段）", en: "Gather real numbers → Invent machine → List parts (Zero pixels on screen)" },
        detail: { zh: "舞台切入官方 fit（正交相机适配仪）：前四步屏幕上还没有一个像素，但数学模型与 40+ 零件清单已决定 80% 质量。", en: "Stage switches to official fit: quality is largely locked in during the first four steps before a single pixel exists." },
        metrics: { zh: ["官方 fit 相机适配仪", "前 4 步零像素定成败", "纯数学模型驱动"], en: ["Official fit camera rig", "First 4 steps decide quality", "Zero pixels on screen yet"] },
        stageCue: "PIPELINE_2",
        scriptText: {
          zh: "收集真实数字，写成一个小模型。发明机器。列零件清单。关键来了，质量大头在前四步就定了，那时候屏幕上一个像素都还没有。",
          en: "Collect real numbers into a small model. Invent the machine. List every part. Here is the key: most of the quality is decided in the first four steps, when not a single pixel is on screen yet."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 几何与画家上色", en: "20s · Geometry & Painter's Order" },
        headline: { zh: "规划相机 → 预计算静态几何 → 从后往前上色 → 装卡激活", en: "Plan camera → Compute static geometry → Paint back-to-front → Animate" },
        detail: { zh: "舞台切入官方 separable-blur（49×49 钉板与双轨精密梳）：一次性预计算全部静态几何，按画家算法从后往前绘制。", en: "Stage switches to official separable-blur: pre-calculate all static geometry at once, paint back-to-front, mount, and animate." },
        metrics: { zh: ["官方 separable-blur 精密梳", "静态几何一次性预计算", "画家算法深度排序"], en: ["Official separable-blur comb", "One-shot static geometry", "Painter's back-to-front order"] },
        stageCue: "PIPELINE_3",
        scriptText: {
          zh: "规划坐标系和相机。一次性算好全部静态几何。从后往前上色。装进卡片。让它动起来。",
          en: "Plan the coordinate system and camera. Compute all static geometry in one go. Shade from back to front. Mount it in a card, and bring it to life."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 批评家终检", en: "30s · Critic Inspection" },
        headline: { zh: "第 10 步：像最严苛的批评家一样光学放大验收", en: "Step 10: Inspect like a ruthless critic — think first, draw second" },
        detail: { zh: "舞台切入官方 lens-bench（光学透镜检验台）：先想清楚造什么，再动手画，最后用自动化检验收尾。", en: "Stage switches to official lens-bench: figure out what to build before drawing — a rule that holds across all AI collaboration." },
        metrics: { zh: ["官方 lens-bench 光学检验台", "几何审计 + 断线归零", "先想清楚，再动手画"], en: ["Official lens-bench optical rig", "Critic audit verification", "Think clearly before drawing"] },
        stageCue: "PIPELINE_4",
        scriptText: {
          zh: "第十步，像批评家一样验收。先想清楚造什么，再动手画。这个顺序放在任何AI协作里都成立。",
          en: "Step ten: inspect the work like a critic. Figure out what you are building first, then start drawing. That sequence holds true for any AI collaboration."
        }
      }
    ]
  },
  {
    id: "ch07",
    index: 6,
    number: "07",
    title: { zh: "机器隐喻大全", en: "The Encyclopedia of Machine Metaphors" },
    subtitle: { zh: "OFFICIAL FIGURES: HASH-MAP · BLOOM-FILTER · MUTEX · TCP-HANDSHAKE · SAMPLING", en: "Official Figures: Hash Map · Bloom Filter · Mutex · TCP Handshake · Sampling" },
    duration: 40,
    stageType: "official-pkg",
    machineKey: "hash-map",
    thesis: {
      zh: "把看不见的软件概念，翻译成官网图集里最惊艳的 5 台原版物理机器。",
      en: "Translating invisible software algorithms into the five most iconic physical machines in the gallery."
    },
    takeaway: {
      zh: "分拣台 · 老虎机 · 联锁水箱 · 索道邮车 · 轮盘赌 —— 哪个隐喻最妙？",
      en: "Sorting desk · Fruit machine · Interlock tank · Mail ropeway · Roulette wheel — which metaphor wins?"
    },
    readout: (t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) {
          return t < 5.5
            ? "OFFICIAL [hash-map] · POST-OFFICE SORTING DESK (MOD 8)"
            : "OFFICIAL [bloom-filter] · 3-REEL FRUIT MACHINE & 16 FLAGS";
        }
        if (beat === 1) return "OFFICIAL [mutex] · DUAL-PUMP WATER TANK & INTERLOCK KEY";
        if (beat === 2) return "OFFICIAL [tcp-handshake] · AERIAL MAIL ROPEWAY (SYN / ACK)";
        return "OFFICIAL [sampling] · 16-POCKET TEMPERATURE ROULETTE WHEEL";
      }
      if (beat === 0) {
        return t < 5.5
          ? "OFFICIAL [hash-map] · 邮局分拣台 (MOD 8 鸽子笼)"
          : "OFFICIAL [bloom-filter] · 三滚筒水果老虎机与标志旗";
      }
      if (beat === 1) return "OFFICIAL [mutex] · 双水泵储水箱与唯一联锁钥匙";
      if (beat === 2) return "OFFICIAL [tcp-handshake] · 两站架空索道邮车 (SYN / ACK)";
      return "OFFICIAL [sampling] · 16格扇区温度采样轮盘赌";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 哈希分拣台 & 布隆水果机", en: "00s · Sorting Desk & Fruit Machine" },
        headline: { zh: "哈希冲突变邮局分拣台，布隆过滤器变三滚筒水果老虎机", en: "Hash collisions become a sorting desk; Bloom filter becomes a fruit slot machine" },
        detail: { zh: "前半拍运行官方 hash-map（编码机打印 mod 8 投入鸽子笼）；后半拍自动切入官方 bloom-filter（三滚筒水果老虎机）。", en: "First half runs official hash-map (mod 8 pigeonholes); second half switches to official bloom-filter (3-reel fruit machine)." },
        metrics: { zh: ["官方 hash-map 邮局分拣台", "官方 bloom-filter 水果机", "三标志位全立才中奖"], en: ["Official hash-map sorting desk", "Official bloom-filter slot machine", "All 3 flags up to hit jackpot"] },
        stageCue: "META_HASH_BLOOM",
        scriptText: {
          zh: "来看几个我最喜欢的映射。哈希表冲突，变成邮局分拣台，编码机给每封信打印哈希值，名字对八取模，投进对应的鸽子笼。布隆过滤器，变成水果老虎机，三个滚筒就是三个哈希函数，一个字的三个标志位全立着才中奖。",
          en: "Here are a few of my favorite mappings. Hash map collisions become a post-office sorting desk: an encoder stamps each letter with a hash and drops it into one of eight modulo pigeonholes. A Bloom filter becomes a three-reel fruit machine: three reels act as three hash functions, and you only hit the jackpot when all three flags stand up."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 互斥锁联锁水箱", en: "10s · Mutex Interlock Tank" },
        headline: { zh: "互斥锁变成双水泵水箱与唯一一把物理联锁钥匙", en: "A mutex becomes a water tank with two pumps and a single interlock key" },
        detail: { zh: "切入官方 mutex（水箱与联锁钥匙）：两个控制器同时读水位必溢出，只有持有钥匙的一方能读表开机。", en: "Stage runs official mutex: if both pumps read the gauge at once it overflows; only the one holding the key can run." },
        metrics: { zh: ["官方 mutex 联锁水箱", "双泵并发读表 = 溢出", "唯一钥匙保障互斥访问"], en: ["Official mutex water tank", "Simultaneous read = overflow", "Single key enforces lock"] },
        stageCue: "META_MUTEX",
        scriptText: {
          zh: "互斥锁，变成一台水箱加一把联锁钥匙，两个水泵同时读水位就会溢出，只有拿着钥匙的那个能读表开机。",
          en: "A mutex becomes a water tank with a single interlock key: if both pumps read the water level at once it overflows, so only the pump holding the key can read the gauge and run."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · TCP 索道邮车", en: "20s · TCP Aerial Ropeway" },
        headline: { zh: "TCP 三次握手变成两站之间的往返架空索道邮车", en: "TCP three-way handshake becomes an aerial mail ropeway between two stations" },
        detail: { zh: "切入官方 tcp-handshake（索道邮车）：SYN、SYN+ACK、ACK 三个邮罐挂在钢索上来回飞渡并扳动信号旗。", en: "Stage runs official tcp-handshake: SYN, SYN+ACK, and ACK canisters shuttle back and forth along the cableway." },
        metrics: { zh: ["官方 tcp-handshake 索道邮车", "SYN / SYN+ACK / ACK 邮罐", "双站信号旗状态同步"], en: ["Official tcp-handshake ropeway", "SYN / SYN+ACK / ACK canisters", "Two-station lever sync"] },
        stageCue: "META_TCP",
        scriptText: {
          zh: "TCP三次握手，变成两站之间的索道邮车，SYN、SYN加ACK、ACK三个罐子来回飞。",
          en: "TCP's three-way handshake becomes an aerial mail ropeway between two stations, with SYN, SYN-ACK, and ACK canisters flying back and forth."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 温度采样轮盘赌", en: "30s · Temperature Roulette" },
        headline: { zh: "温度采样变成 16 格扇区宽度随概率变化的轮盘赌", en: "Temperature sampling becomes a 16-pocket roulette wheel with variable widths" },
        detail: { zh: "切入官方 sampling（温度采样轮盘赌）：16 个格子对应候选词，转动温控旋钮即可实时改变扇区宽度分布。", en: "Stage runs official sampling: 16 pockets represent candidate tokens, and pocket width directly reflects probability." },
        metrics: { zh: ["官方 sampling 温度轮盘赌", "16 格宽度 = Token 概率", "温控旋钮实时重塑分布"], en: ["Official sampling roulette wheel", "16 pocket widths = probabilities", "Temperature dial reshapes odds"] },
        stageCue: "META_ROULETTE",
        scriptText: {
          zh: "温度采样，变成轮盘赌，十六个格子是候选词，格子宽度就是概率。哪个映射最妙，公屏见。",
          en: "Temperature sampling becomes a roulette wheel: sixteen pockets for candidate words, where pocket width equals probability. Which mapping is cleverest? Tell me in the comments."
        }
      }
    ]
  },
  {
    id: "ch08",
    index: 7,
    number: "08",
    title: { zh: "两台大机器", en: "Two Heavyweight Machines" },
    subtitle: { zh: "OFFICIAL FIGURES: TRENT 970 TURBOFAN & SPACEX RAPTOR 2", en: "Official Figures: Rolls-Royce Trent 970 & SpaceX Raptor 2" },
    duration: 40,
    stageType: "official-pkg",
    machineKey: "turbofan",
    thesis: {
      zh: "小点子造小机器，大点子才见真功夫：官方遄达 970 与猛禽 2 号同台飙戏。",
      en: "Small ideas make small machines; big ideas show real mastery: Trent 970 and Raptor 2 take the stage."
    },
    takeaway: {
      zh: "能跑的第一版 38 分钟就出来了 —— 改到挑不出毛病，又花了 10 个小时",
      en: "The first working prototype took 38 minutes — polishing it to zero defects took another 10 hours"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [turbofan] · ROLLS-ROYCE TRENT 970 · 1.2 t/s AIR · 14 -> 334 kN";
        if (beat === 1) return "OFFICIAL [raptor-engine] · HOVER EXPLODED INTO 11 ASSEMBLIES";
        if (beat === 2) return "OFFICIAL [raptor-engine] · KEY [I] IGNITION · Pc 300 BAR · WEBGL PLUME";
        return "FIRST PROTOTYPE: 38 MIN · ZERO-DEFECT AUDIT: +10 HOURS";
      }
      if (beat === 0) return "OFFICIAL [turbofan] · A380 遄达970 · 1.2吨/秒吞气 · 14 → 334 kN";
      if (beat === 1) return "OFFICIAL [raptor-engine] · 猛禽2号 · 悬停拆解为 11 个组件";
      if (beat === 2) return "OFFICIAL [raptor-engine] · 按 I 键点火 · Pc 300 BAR 主燃烧室";
      return "首版成型: 38 分钟 · 挑不出毛病: +10 小时";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 遄达970涡扇真机", en: "00s · Trent 970 Turbofan" },
        headline: { zh: "A380 遄达 970 挂上试车台，四分之一剖开见真章", en: "A380's Trent 970 on the test stand, quarter-sectioned to expose three spools" },
        detail: { zh: "舞台直接运行官方 turbofan（遄达970）：风扇、中压、高压三个转子按各自速度旋转，吞气 1.2 吨/秒，推力从 14 爬升至 334 kN。", en: "Drag the throttle: fan, IP, and HP spools spin at distinct speeds, swallowing 1.2 tons of air/sec from 14 to 334 kN thrust." },
        metrics: { zh: ["官方 turbofan 遄达970", "三转子差速同轴旋转", "推力 14 kN → 334 kN"], en: ["Official Trent 970 turbofan", "3-spool differential speeds", "1.2 t/s air · 14 to 334 kN"] },
        stageCue: "TRENT_GROUND_RUN",
        scriptText: {
          zh: "小点子造小机器，大点子才见真功夫。遄达970，A380的发动机，挂在试车台上，四分之一剖开。拖油门杆，风扇、中压、高压三个转子按各自的速度转起来。每秒吞进去1.2吨空气，推力从14千牛爬到334千牛。",
          en: "Small ideas build small machines; big ideas show real mastery. The Trent 970, the A380's engine, hangs on a test stand sliced open by a quarter. Drag the throttle lever and the fan, intermediate, and high-pressure spools spin up at their own speeds, swallowing 1.2 tons of air per second as thrust climbs from 14 to 334 kilonewtons."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 猛禽11组件拆解", en: "10s · Raptor 2 Exploded View" },
        headline: { zh: "SpaceX 猛禽 2 号：悬停鼠标，整机分成 11 个组件散开", en: "SpaceX Raptor 2: Hover the mouse to split the engine into 11 assemblies" },
        detail: { zh: "舞台切入官方 raptor-engine：11 个总成沿弹簧导轨平滑解体展开，高密度管路经审计证明零穿插。", en: "Stage switches to official raptor-engine: 11 major subassemblies glide apart on spring physics, ready for inspection." },
        metrics: { zh: ["官方 raptor-engine 猛禽2", "悬停触发 11 组件拆解", "全流量分级燃烧管路"], en: ["Official SpaceX Raptor 2", "Hover splits 11 assemblies", "Press [I] to ignite"] },
        stageCue: "RAPTOR_EXPLODE",
        scriptText: {
          zh: "另一台更狠，SpaceX的猛禽2号，悬停鼠标，整机分成十一个组件散开，按I键点火。",
          en: "The next one is even wilder: SpaceX's Raptor 2. Hover your mouse and the entire engine separates into eleven assemblies; press the I key to ignite."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 300大气压点火", en: "20s · 300-Bar Ignition" },
        headline: { zh: "按 I 键点火：液氧与甲烷在 300 bar 主燃烧室碰头", en: "LOX and methane preburners meet inside the 300-bar main combustion chamber" },
        detail: { zh: "富氧与富燃两股热气在 300 bar 主燃烧室汇合，WebGL 着色器在等轴相机内实时喷涌马赫环尾焰与水冷蒸汽。", en: "Oxygen-rich and fuel-rich hot gases meet at 300 bar as the WebGL plume and Mach diamonds roar to life." },
        metrics: { zh: ["按 I 键触发实时点火", "主燃烧室 Pc = 300 bar", "WebGL 尾焰 + 马赫环"], en: ["Live Key [I] ignition", "Main chamber Pc = 300 bar", "Full-flow staged combustion"] },
        stageCue: "RAPTOR_IGNITE",
        scriptText: {
          zh: "每一滴液氧先过富氧预燃室，带动氧泵，每一滴甲烷走富燃预燃室，两股热气在300个大气压的主燃烧室碰头。",
          en: "Every drop of liquid oxygen passes through the oxygen-rich preburner to drive the LOX pump; every drop of methane runs through the fuel-rich preburner, and the two hot gas streams collide inside the 300-bar main chamber."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 38分钟与10小时", en: "30s · 38 Minutes vs 10 Hours" },
        headline: { zh: "第一版 38 分钟跑通，改到挑不出毛病又花了 10 小时", en: "The first working version took 38 minutes; making it flawless took 10 more hours" },
        detail: { zh: "切回官方 turbofan 全速试车：能跑的第一版只需 38 分钟，但做到零穿插、零断线花费了整整十小时。", en: "A runnable first draft came out in 38 minutes, followed by 10 hours of relentless geometric auditing and refinement." },
        metrics: { zh: ["首版成型：38 分钟", "深度打磨：+10 小时", "两台重工传奇同台"], en: ["First working draft: 38 min", "Zero-defect polish: +10 hrs", "Two aerospace icons"] },
        stageCue: "TRENT_TAKEOFF",
        scriptText: {
          zh: "能跑的第一版，38分钟就出来了。改到挑不出毛病，又花了十个小时。",
          en: "A working first version came out in just 38 minutes. Refining it until not a single flaw remained took another ten hours."
        }
      }
    ]
  },
  {
    id: "ch09",
    index: 8,
    number: "09",
    title: { zh: "相机与审计", en: "Camera & Geometric Audit" },
    subtitle: { zh: "OFFICIAL FIGURES: LIT-BY-FACING · EASING · TURBOFAN · THREE-READS", en: "Official Figures: Lit-By-Facing · Easing · Turbofan · Three Reads" },
    duration: 40,
    stageType: "official-pkg",
    machineKey: "lit-by-facing",
    thesis: {
      zh: "零件一多，人眼根本调不动前后顺序 —— 必须用几何射线审计脚本来证明。",
      en: "Once part counts climb, human eyes cannot sort depth order — automated ray-cast auditing takes over."
    },
    takeaway: {
      zh: "541 个实体 · 6,320 对重叠 · 62.4 秒射线验完零问题",
      en: "541 solids · 6,320 overlapping pairs · Verified in 62.4 seconds with zero errors"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [lit-by-facing] · AZIMUTH 45° · ELEVATION 30° · 4-TONE";
        if (beat === 1) return "OFFICIAL [easing] · SPLIT COIL PAINTER'S ORDER";
        if (beat === 2) return "OFFICIAL [turbofan] · 541 SOLIDS · 6,320 OVERLAPS · 62.4s · 0 ERRORS";
        return "OFFICIAL [three-reads] · RAPTOR V1 CAUGHT 54 INTERSECTIONS · 323 ORDER ERRORS";
      }
      if (beat === 0) return "OFFICIAL [lit-by-facing] · 方位角 45° · 俯角 30° · 四档明暗锁死相机";
      if (beat === 1) return "OFFICIAL [easing] · 画家算法 · 弹簧劈成前后两半夹住立柱";
      if (beat === 2) return "OFFICIAL [turbofan] · 541 实体 · 6,320 对重叠 · 62.4s 验完零问题";
      return "OFFICIAL [three-reads] · 猛禽首版抓出 54 处穿插 · 323 处顺序错误";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 正交相机与四档明暗", en: "00s · Orthographic Camera" },
        headline: { zh: "方位角 45°、俯角 30°，平行边永远平行，四档明暗锁死相机", en: "Azimuth 45°, elevation 30°: parallel edges stay parallel, 4 tones locked to camera" },
        detail: { zh: "舞台运行官方 lit-by-facing（双灯转台摄影棚）：直观演示每个侧面如何按法线朝向自动计算四级明暗。", en: "Stage runs official lit-by-facing: every face is shaded into 4 tones by its orientation relative to the camera-locked light." },
        metrics: { zh: ["官方 lit-by-facing 摄影台", "方位角 45° / 俯角 30°", "lo / mid / hi / lit 四档明暗"], en: ["Official lit-by-facing rig", "Azimuth 45° / Elevation 30°", "4-tone camera-locked shading"] },
        stageCue: "CAM_ORTHO",
        scriptText: {
          zh: "程序员朋友，这部分是给你的。所有图共用一个正交相机，方位角45度，俯角30度，平行边永远平行，零件摆在哪都不变形。每个侧面按朝向分四档明暗，光源锁死在相机上。",
          en: "Programmer friends, this part is for you. Every figure shares one orthographic camera — 45-degree azimuth, 30-degree elevation — so parallel edges stay parallel without distortion. Faces take four shading tones with the light locked to the camera."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 弹簧劈开画家算法", en: "10s · Split-Coil Painter's Order" },
        headline: { zh: "弹簧绕柱子怎么画？劈成前后两半，把柱子夹在中间", en: "How to draw a spring wrapping a post? Split the coil into back and front halves" },
        detail: { zh: "舞台切入官方 easing（阻尼弹簧台）：SVG 画家算法从后往前画，环绕柱子的弹簧必须切分为后半圈、立柱、前半圈。", en: "Stage switches to official easing: Painter's algorithm draws back-to-front, sandwiching the central post between split half-coils." },
        metrics: { zh: ["官方 easing 弹簧机构", "画家算法从后往前画", "后半簧 → 立柱 → 前半簧"], en: ["Official easing spring rig", "Back-to-front Painter's algorithm", "Back coil → Post → Front coil"] },
        stageCue: "COIL_SPLIT",
        scriptText: {
          zh: "深度排序用画家算法，从后往前画。弹簧绕着柱子这种前后穿插的，把弹簧劈成前后两半，柱子画在中间。",
          en: "Depth sorting uses the painter's algorithm, drawing from back to front. When a spring wraps around a post, you split the spring into back and front halves and draw the post right in the middle."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 射线重叠审计", en: "20s · Ray-Cast Audit Script" },
        headline: { zh: "给每对重叠零件发射线测深度：6,320 对重叠 62.4 秒验完", en: "Firing rays across every overlapping pair: 6,320 overlaps verified in 62.4s" },
        detail: { zh: "舞台切入官方 turbofan（遄达970）：541 个三维实体、6,320 对重叠，审计脚本发射采样射线在 62.4 秒内完成零错误证明。", en: "On Trent 970, the audit script tested 541 solids and 6,320 overlapping pairs in 62.4 seconds with zero errors." },
        metrics: { zh: ["遄达：541 个三维实体", "6,320 对屏幕重叠检测", "62.4 秒验证 · 0 错误"], en: ["Trent 970: 541 3D solids", "6,320 overlapping pairs tested", "62.4s verification · 0 errors"] },
        stageCue: "RAY_SCAN",
        scriptText: {
          zh: "零件一多，人眼调不动顺序，就交给审计脚本。它给每对重叠零件发射线，测出谁在前。遄达那一次，541个实体，6320对重叠，62.4秒验完，零问题。",
          en: "Once part counts grow, human eyes can't sort the order, so an audit script takes over. It fires rays through every overlapping pair to test which sits in front. On Trent, 541 solids and 6,320 overlaps verified in 62.4 seconds — zero issues."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 猛禽首版捉虫单", en: "30s · Raptor V1 Bug Catch" },
        headline: { zh: "猛禽第一版跑审计：当场抓出 54 处管路穿插、323 处顺序错误", en: "Raptor V1 audit caught 54 geometry intersections and 323 z-order errors" },
        detail: { zh: "舞台切入官方 three-reads：没有确定性几何审计，AI 生成的复杂管路必然穿插错乱。", en: "Stage switches to official three-reads: on the first version of Raptor, the audit script caught 54 intersections and 323 order errors." },
        metrics: { zh: ["官方 three-reads 采样仪", "猛禽V1 抓出 54 处穿插", "抓出 323 处遮挡顺序错误"], en: ["Official three-reads gauge", "Raptor V1: 54 intersections", "323 depth-order errors caught"] },
        stageCue: "AUDIT_DIFF",
        scriptText: {
          zh: "猛禽第一版，审计抓出54处穿插，323处顺序错误。",
          en: "On the first version of Raptor, the audit script caught 54 part intersections and 323 depth-ordering errors."
        }
      }
    ]
  },
  {
    id: "ch10",
    index: 9,
    number: "10",
    title: { zh: "一群 AI 互相挑错", en: "A Team of AIs Finding Faults" },
    subtitle: { zh: "OFFICIAL FIGURES: MARK-SWEEP · FOUR-FRAMES · TURBOFAN · FROSTED-COPY", en: "Official Figures: Mark & Sweep · Four Frames · Turbofan · Frosted Copy" },
    duration: 40,
    stageType: "official-pkg",
    machineKey: "mark-sweep",
    thesis: {
      zh: "评审 Agent 绝不听信建造者的报告，而是自己重建页面、重跑审计、自己截图。",
      en: "Reviewer agents never trust the builder's report — they rebuild the page, re-run the audit, and take their own screenshots."
    },
    takeaway: {
      zh: "三轮评审留下 309 张截图 · 50×45 像素放大到 800×720 抓出叶片折痕",
      en: "309 screenshots across 3 review rounds · 50×45px blown up to 800×720px to catch a folded blade"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [mark-sweep] · BUILDER + REVIEWERS + FIXER LOOP";
        if (beat === 1) return "OFFICIAL [four-frames] · 3 ROUNDS · 309 SCREENSHOTS";
        if (beat === 2) return "OFFICIAL [turbofan] · 16x ZOOM (50x45 -> 800x720 px) FAN BLADE";
        return "OFFICIAL [frosted-copy] · 0.6 PITCH SMOOTH FADE FIX";
      }
      if (beat === 0) return "OFFICIAL [mark-sweep] · 建造者 + 评审 + 修复工 · 进度文件持久化";
      if (beat === 1) return "OFFICIAL [four-frames] · 独立重建与截图 · 遄达三轮留下 309 张截图";
      if (beat === 2) return "OFFICIAL [turbofan] · 50×45 像素放大到 800×720 揪出叶片折薄";
      return "OFFICIAL [frosted-copy] · 完整绘制每片叶子 + 0.6 节距淡出修复";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 多Agent流水班组", en: "00s · Builder, Reviewers & Fixer" },
        headline: { zh: "1 个建造者 + 几个评审 + 1 个修复工，接力转到零瑕疵为止", en: "One builder, several reviewers, and one fixer looping until zero flaws remain" },
        detail: { zh: "舞台运行官方 mark-sweep（模块化合成器）：每个 Agent 维护独立进度文件，随时打断随时续接。", en: "Each agent maintains its own progress file on disk so work resumes cleanly even if interrupted mid-run." },
        metrics: { zh: ["官方 mark-sweep 合成器", "Builder + Reviewers + Fixer", "进度文件持久化防中断"], en: ["Official mark-sweep rig", "Builder + Reviewers + Fixer", "Persistent progress files"] },
        stageCue: "AGENT_LOOP",
        scriptText: {
          zh: "大一点的图，背后是一个小团队。一个建造者，几个评审，一个修复工，一轮一轮转，转到某一轮挑不出毛病为止。每个agent维护自己的进度文件，因为你随时会打断它，文件在，活就在。",
          en: "Behind every larger figure sits a small team: one builder, several reviewers, and a fixer, cycling round after round until no flaws remain. Each agent keeps its own progress file — if you interrupt it, the file stays and the work lives on."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 独立重建与截图", en: "10s · 309 Review Screenshots" },
        headline: { zh: "评审不看报告点头：自己重建页面、重跑审计、自己截图", en: "Reviewers never just nod at reports: they rebuild, re-audit, and screenshot" },
        detail: { zh: "舞台切入官方 four-frames（四帧审校台）：遄达 970 历经三轮独立评审，足足留下 309 张检验截图。", en: "Stage switches to official four-frames: three review rounds on Trent 970 left behind 309 verification screenshots." },
        metrics: { zh: ["官方 four-frames 四帧台", "独立重建 + 独立跑审计", "三轮留下 309 张截图"], en: ["Official four-frames bench", "Independent rebuild & audit", "309 screenshots in 3 rounds"] },
        stageCue: "REVIEW_309",
        scriptText: {
          zh: "评审不看建造者的报告点头，他们自己重建页面，重跑审计，自己截图。遄达三轮评审留下309张截图。",
          en: "Reviewers don't just nod at the builder's report. They rebuild the page themselves, re-run the audit, and capture their own screenshots. Three rounds on Trent left behind 309 screenshots."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 16倍微距抓虫", en: "20s · 50×45 Blown Up to 800×720" },
        headline: { zh: "把 50×45 像素放大到 800×720，揪出风扇叶片切口折成薄片", en: "Zooming a 50×45px patch to 800×720px caught fan blades folding at the cutaway" },
        detail: { zh: "舞台切入官方 turbofan 并自动推镜放大风扇剖切口：发现叶片在切口处被折成了纸片。", en: "Camera zooms into the turbofan cutaway: a reviewer blew up a 50×45px crop to 800×720px and found blades crimped flat." },
        metrics: { zh: ["官方 turbofan 微距推镜", "50×45 px 放大至 800×720", "揪出剖切处叶片折薄"], en: ["Official turbofan close-up", "50×45px zoomed to 800×720px", "Caught blade cutaway crimp"] },
        stageCue: "BLADE_ZOOM",
        scriptText: {
          zh: "有一轮，评审把风扇叶片一块50乘45像素的区域放大到800乘720，发现叶片在切口处折成了薄片。",
          en: "In one round, a reviewer blew up a 50-by-45-pixel patch of the fan blades to 800-by-720, discovering the blades were folding into flat ribbons at the cutaway."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 0.6节距优雅淡出", en: "30s · 0.6-Pitch Fade Fix" },
        headline: { zh: "修复方案：每片叶子画完整，再用 0.6 个节距平滑淡出", en: "The fix: draw every blade whole and fade it out smoothly over 0.6 pitch" },
        detail: { zh: "舞台切入官方 frosted-copy：完整绘制每片叶子再用 0.6 节距渐隐。这套多 Agent 验收流在任何 AI 项目都管用。", en: "Stage switches to official frosted-copy: draw each blade intact and fade over 0.6 pitch — a workflow ready for any AI codebase." },
        metrics: { zh: ["官方 frosted-copy 渐隐光学", "完整叶片 + 0.6 节距淡出", "通用 AI 工程质量护栏"], en: ["Official frosted-copy optics", "Full blade + 0.6 pitch fade", "Universal AI QA workflow"] },
        stageCue: "BLADE_FIXED",
        scriptText: {
          zh: "修复方案，每片叶子画完整，再用0.6个节距淡出。这套流程，拿去管你自己的AI编码项目，一样好使。",
          en: "The fix: draw every blade intact, then fade it out across 0.6 of a pitch. Take this exact workflow to manage your own AI coding projects and it works just as well."
        }
      }
    ]
  },
  {
    id: "ch11",
    index: 10,
    number: "11",
    title: { zh: "时间的真相", en: "The Truth About Build Time" },
    subtitle: { zh: "OFFICIAL FIGURES: WATCH (1h54m) · SEASONS (1h57m) · RAPTOR (10h33m) · TURBOFAN (14h)", en: "Official Figures: Watch (1h54m) · Seasons (1h57m) · Raptor (10h33m) · Turbofan (14h)" },
    duration: 40,
    stageType: "official-pkg",
    machineKey: "watch",
    thesis: {
      zh: "不管机器多大，第 1 个小时内一定有能跑的页面，剩下 90% 的时间全花在“第二眼”上。",
      en: "No matter the scale, a working page appears within the first hour — the remaining 90% goes to the second look."
    },
    takeaway: {
      zh: "生成只是起点，验收才是正文",
      en: "Generation is merely the starting line; verification is the real work"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [watch] · 1h 54m ACTIVE TIME · SINGLE PASS";
        if (beat === 1) return "OFFICIAL [seasons] · 1h 57m ACTIVE TIME · FIRST HOUR LAW";
        if (beat === 2) return "OFFICIAL [raptor-engine] · 10h 33m TOTAL · 4x ZOOM DEFECT HUNT";
        return "OFFICIAL [turbofan] · 14h 00m TOTAL (4h41m + 5 REVIEW ROUNDS)";
      }
      if (beat === 0) return "OFFICIAL [watch] · 有效工时 1h 54m 一次通过 · 猛禽 10h33m · 遄达 14h";
      if (beat === 1) return "OFFICIAL [seasons] · 首小时必出可跑页面 · 大头花在第二眼";
      if (beat === 2) return "OFFICIAL [raptor-engine] · 放大四倍抓虫: 电缆穿管 / 喷口阴影断层";
      return "OFFICIAL [turbofan] · 14h 五轮评审修复 · 生成只是起点，验收才是正文";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 真实有效工时", en: "00s · Active Compute Hours" },
        headline: { zh: "只算 Claude 有效工时：机械表 1h54m、四季 1h57m、猛禽 10h33m、遄达 14h", en: "Pure active Claude time: Watch 1h54m, Seasons 1h57m, Raptor 10h33m, Trent 14h" },
        detail: { zh: "舞台展示官方 watch（1h54m）：口径极度干净，评审轮次算在内，人类发呆等待一秒不算。", en: "Clean accounting: counts only active Claude work including review rounds, excluding idle waiting time." },
        metrics: { zh: ["官方 watch：1h 54m", "官方 seasons：1h 57m (3D)", "猛禽 10h33m / 遄达 14h"], en: ["Watch: 1h54m / Seasons: 1h57m", "Raptor: 10h33m active time", "Trent: 14h (4h41m + 5 rounds)"] },
        stageCue: "TIME_WATCH",
        scriptText: {
          zh: "成本方面，Ryan给的全是真数字，而且口径干净，只算Claude的有效工时，评审轮次算在内，发呆等待不算。机械表，一小时五十四分钟，一次通过。四季地球，一小时五十七分钟，还是3D的。猛禽发动机，十小时三十三分钟。遄达，十四小时，首版四小时四十一分，后面跟了五轮评审修复。",
          en: "On cost, Ryan shares real numbers with clean accounting: only Claude's active working time counts, review rounds included, idle waiting excluded. Watch: 1h 54m in one pass. 3D Seasons: 1h 57m. Raptor: 10h 33m. Trent: 14 hours total — 4h 41m for v1 plus five review rounds."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 首小时定律", en: "10s · The First-Hour Rule" },
        headline: { zh: "第一个小时内必出可运行页面，剩下的时间全花在加深它", en: "A runnable page always lands within hour one; the rest goes to deepening it" },
        detail: { zh: "舞台切入官方 seasons（四季 3D 地球）：能跑的第一版来得极快，大头时间全花在“第二眼”上。", en: "Stage switches to official seasons: a working v1 arrives fast, while the bulk of the hours goes into the second look." },
        metrics: { zh: ["官方 seasons 实时运转", "≤ 1 小时必出可跑页面", "大头时间全在“第二眼”"], en: ["Official seasons 3D tellurion", "Working page in ≤ 1 hour", "Bulk of time on the 2nd look"] },
        stageCue: "TIME_SEASONS",
        scriptText: {
          zh: "不管尺寸多大，第一个小时内，浏览器里一定有一张能跑的页面，剩下的时间全花在加深它。规律摆在这。能跑的第一版来得很快，大头时间全花在第二眼上。",
          en: "No matter how large the build, within the first hour you always have a working page in the browser; the rest of the time goes into deepening it. The pattern is clear: v1 comes fast, and the real time is spent on the second look."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 四倍放大镜下的魔鬼", en: "20s · Devils at 4x Zoom" },
        headline: { zh: "放大四倍看，毛病全藏在那：电缆穿管、阴影断层、叶片折薄", en: "Zoom in 4x and the bugs appear: cables piercing pipes, broken nozzle shadows" },
        detail: { zh: "舞台切入官方 raptor-engine（10h33m）：放大四倍看，电缆穿过管道、喷口阴影断层等隐患全靠十小时深挖修平。", en: "Stage switches to official raptor-engine: at 4x zoom, cables clipping through pipes and broken nozzle shadows are hunted down." },
        metrics: { zh: ["官方 raptor-engine 10h33m", "排查电缆穿管与阴影断层", "4× 放大镜逐个接头过筛"], en: ["Official Raptor 2 (10h 33m)", "Fixes cable-pipe clipping", "Fixes nozzle shadow breaks"] },
        stageCue: "RAPTOR_EXPLODE",
        scriptText: {
          zh: "放大四倍看，毛病全藏在那，电缆穿过管道，喷口阴影断层，叶片折成薄片。",
          en: "Zoom in four times and that's where all the flaws hide: cables clipping through pipes, broken shadows on the nozzle, fan blades folded into flat strips."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 验收才是正文", en: "30s · Verification is the Real Work" },
        headline: { zh: "用 AI 做过东西的人都懂：生成只是起点，验收才是正文", en: "Anyone who builds with AI knows: generation is just the start, verification is the real work" },
        detail: { zh: "舞台切入官方 turbofan（14h，5轮评审修复）：生成只是 10% 的起点，严苛的验收才是 90% 的正文。", en: "Stage switches to official turbofan (14h, 5 review rounds): generation is the 10% opening act; verification is the 90% main text." },
        metrics: { zh: ["官方 turbofan 14h 打磨", "生成 = 起点", "验收 = 正文"], en: ["Official Trent 970 (14h)", "Generation = Starting line", "Verification = Real work"] },
        stageCue: "TIME_TURBOFAN",
        scriptText: {
          zh: "用AI做过东西都懂，生成只是起点，验收才是正文。",
          en: "Anyone who has built real things with AI knows this: generation is just the starting line; verification is the main event."
        }
      }
    ]
  },
  {
    id: "ch12",
    index: 11,
    number: "12",
    title: { zh: "最大的误读", en: "The Biggest Misconception" },
    subtitle: { zh: "OFFICIAL FIGURES: BOX-MODEL · SPOT-PLATE · BEVEL-OFFSET · SHARED-CANVAS", en: "Official Figures: Box Model · Spot Plate · Bevel Offset · Shared Canvas" },
    duration: 40,
    stageType: "official-pkg",
    machineKey: "box-model",
    thesis: {
      zh: "“Claude 终于能生成图片了” —— 这类 90 万浏览的热帖，错在根上。",
      en: "“Claude can finally generate images!” — Viral posts with 900K+ views got it fundamentally wrong."
    },
    takeaway: {
      zh: "Claude 一个像素都没画：可编辑、可验证的代码，才能进生产环境",
      en: "Claude didn't paint a single pixel: only editable, verifiable code belongs in production"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "MYTH BUSTED · OFFICIAL [box-model] · NOT PIXEL DIFFUSION (900K+ VIEWS)";
        if (beat === 1) return "OFFICIAL [spot-plate] · PURE SVG + HTML + WEBGL CODE";
        if (beat === 2) return "OFFICIAL [bevel-offset] · 1 MODEL PARAM DRIVES PART + READOUT + ANIM";
        return "OFFICIAL [shared-canvas] · EDITABLE & AUDITABLE FOR PRODUCTION";
      }
      if (beat === 0) return "破除误读 · OFFICIAL [box-model] · 90万浏览热帖错在根上";
      if (beat === 1) return "OFFICIAL [spot-plate] · 0 像素画图 · 纯 SVG + HTML + WebGL 代码";
      if (beat === 2) return "OFFICIAL [bevel-offset] · 改一个数，零件、读数、动画一起变";
      return "OFFICIAL [shared-canvas] · 可编辑 + 可验证 = 进生产环境的门票";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 九十万浏览的误读", en: "00s · The 900K-View Myth" },
        headline: { zh: "疯传“Claude 终于能画图了”？这个说法错在根上", en: "Viral posts claiming 'Claude can finally generate images' missed the point" },
        detail: { zh: "舞台运行官方 box-model：90 万浏览的热帖把 Anatomy 当成了像素画图模型，彻底看反了技术本质。", en: "Stage runs official box-model: viral threads with 900K+ views mistook Anatomy for a pixel image generator." },
        metrics: { zh: ["官方 box-model 机械盒", "驳斥 90 万浏览误读帖", "绝非像素生成模型"], en: ["Official box-model caliper", "Debunks 900K+ view myth", "Not a pixel diffusion model"] },
        stageCue: "CODE_BOX_MODEL",
        scriptText: {
          zh: "项目火了以后，传播最广的说法是Claude终于能生成图片了，这类帖子九十万浏览起步。这个说法错在根上。",
          en: "After the project blew up, the most viral take — with over 900,000 views — claimed Claude could finally generate images. That claim is wrong at its root."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 一个像素都没画", en: "10s · Zero Pixels Painted" },
        headline: { zh: "Claude 一个像素都没画，它写的是 SVG、HTML 与 WebGL 代码", en: "Claude didn't draw a single pixel — it writes SVG, HTML, and WebGL code" },
        detail: { zh: "舞台切入官方 spot-plate（塞尺点滴板）：6 对玻璃水滴由距离场函数实时计算融合，100% 是结构化代码。", en: "Stage switches to official spot-plate: droplets merge via live mathematical distance fields — 100% code rendered by the browser." },
        metrics: { zh: ["官方 spot-plate 塞尺点滴板", "0 像素位图 · 纯矢量代码", "距离场数学实时融合"], en: ["Official spot-plate rig", "Zero raster pixels · Pure code", "SVG + HTML + WebGL"] },
        stageCue: "CODE_SPOT_PLATE",
        scriptText: {
          zh: "Claude一个像素都没画。它写的是代码，SVG、HTML、WebGL，浏览器把代码渲染成图。",
          en: "Claude didn't paint a single pixel. It writes code — SVG, HTML, and WebGL — and the browser renders that code into visuals."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 改一个数全局联动", en: "20s · Single Source of Truth" },
        headline: { zh: "改模型里的一个数，零件尺寸、仪表读数、动画一起跟着变", en: "Change one number in the model and parts, readouts, and animations update together" },
        detail: { zh: "舞台切入官方 bevel-offset（倒角偏移量规）：所有零件、读数与动画读取同一份底层数据模型，改一处全局联动。", en: "Stage switches to official bevel-offset: every part has exact dimensions, backed by geometric audits and one shared model." },
        metrics: { zh: ["官方 bevel-offset 倒角仪", "单点修改模型参数", "零件+读数+动画同步变"], en: ["Official bevel-offset gauge", "Change 1 number in model", "Parts, readouts & anim sync"] },
        stageCue: "CODE_BEVEL",
        scriptText: {
          zh: "区别很实在。代码做的图可以改，可以查，每个零件有尺寸，几何有审计背书。改模型里的一个数，零件、读数、动画一起跟着变，它们读的是同一份数据。",
          en: "The difference is practical. Code-built figures can be edited and inspected; every part has dimensions backed by geometric audits. Change one number in the model, and the parts, readouts, and animation all update together from the same data."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 进生产环境的门票", en: "30s · Ticket to Production" },
        headline: { zh: "可编辑 + 可验证，决定了它能进文档、进生产环境", en: "Editability and verifiability let it ship in real docs and production apps" },
        detail: { zh: "舞台切入官方 shared-canvas：可查、可改、有几何审计背书的代码组件，才能真正进入严肃的生产环境文档。", en: "Stage switches to official shared-canvas: being editable and verifiable is why this belongs in production while dead bitmaps don't." },
        metrics: { zh: ["官方 shared-canvas 组件", "可编辑 + 可数学验证", "直接嵌入生产环境"], en: ["Official shared-canvas rig", "Editable + verifiable", "Ships in production docs"] },
        stageCue: "CODE_SHARED",
        scriptText: {
          zh: "很多人会觉得这是抠字眼，看起来差不多。但可编辑和可验证，决定了这东西能进文档、进生产环境，一张死图进不去。",
          en: "Some might think that's splitting hairs since they look similar. But being editable and verifiable is what lets this enter documentation and production environments — a dead bitmap never could."
        }
      }
    ]
  },
  {
    id: "ch13",
    index: 12,
    number: "13",
    title: { zh: "社区用星投票", en: "The Community Votes with Stars" },
    subtitle: { zh: "OFFICIAL FIGURES: DEBOUNCE · MERGE-SORT · GRADIENT-DESCENT · FLEX-GROW", en: "Official Figures: Debounce · Merge Sort · Gradient Descent · Flex Grow" },
    duration: 40,
    stageType: "official-pkg",
    machineKey: "debounce",
    thesis: {
      zh: "Claude 很会造，但不太会看 —— 管用的修复，来自你盯着它跑，说出哪里别扭。",
      en: "Claude is great at building, but poor at seeing — real fixes come from watching it run and calling out what feels off."
    },
    takeaway: {
      zh: "第一版当草稿 → 上手玩 → 说出哪里不对 → 再来一轮",
      en: "Treat v1 as a draft → Play with it → Point out what feels off → Run another round"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [debounce] · 6 DAYS: 2,100 -> 4,100 -> 8,203 STARS · 586 FORKS";
        if (beat === 1) return "OFFICIAL [merge-sort] · 1.4M X VIEWS · 19,000+ BOOKMARKS";
        if (beat === 2) return "OFFICIAL [gradient-descent] · CLAUDE BUILDS WELL, SEES POORLY";
        return "OFFICIAL [flex-grow] · DRAFT -> PLAY -> CRITIQUE -> ITERATE";
      }
      if (beat === 0) return "OFFICIAL [debounce] · 6天增长: 2,100 → 4,100 → 8,203 星 · 586 Forks";
      if (beat === 1) return "OFFICIAL [merge-sort] · 发布帖 140万浏览 · 1.9万收藏 · 全球二创";
      if (beat === 2) return "OFFICIAL [gradient-descent] · 作者坦言: Claude 很会造，不太会看";
      return "OFFICIAL [flex-grow] · 官方建议: 第一版当草稿 → 上手玩 → 挑错再来一轮";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 六天八千星曲线", en: "00s · 8,203 Stars in 6 Days" },
        headline: { zh: "10月8日建仓 → 11号 2,100 星 → 12号 4,100 星 → 14号 8,203 星", en: "Created Oct 8 → 2,100 stars Oct 11 → 4,100 Oct 12 → 8,203 stars & 586 forks Oct 14" },
        detail: { zh: "舞台运行官方 debounce（八音盒打孔记录仪）：短短 6 天斩获 8,203 Stars 与 586 Forks。", en: "Stage runs official debounce music-box drum: in 6 days the repo hit 8,203 stars and 586 forks." },
        metrics: { zh: ["官方 debounce 八音盒记录仪", "6 天突破 8,203 Stars", "586 Forks 席卷社区"], en: ["Official debounce drum recorder", "8,203 stars in 6 days", "586 GitHub forks"] },
        stageCue: "STARS_DEBOUNCE",
        scriptText: {
          zh: "社区有多买账，看数字。10月8日建的仓库，11号两千一百星，12号四千一百星，到我做这期视频的14号，八千二百星，五百八十六个fork。",
          en: "How much did the community buy in? Look at the numbers. Repo created October 8; 2,100 stars by the 11th; 4,100 by the 12th; and by the 14th, 8,200 stars and 586 forks."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 全球二创引爆", en: "10s · 1.4M Views & Global Remixes" },
        headline: { zh: "发布帖两天 140 万浏览、1.9 万收藏，多语种二创全面开花", en: "Launch post hit 1.4M views and 19K bookmarks in two days across Reddit & YouTube" },
        detail: { zh: "舞台切入官方 merge-sort（归并排序编钟架）：X 发布帖 140 万浏览，Reddit、YouTube、西语频道全面跟进。", en: "Stage switches to official merge-sort chime rack: 1.4M views on X, 19K bookmarks, and community videos in multiple languages." },
        metrics: { zh: ["官方 merge-sort 编钟架", "140 万浏览 / 1.9 万收藏", "多语种社区实测二创"], en: ["Official merge-sort chime rack", "1.4M views / 19K bookmarks", "Reddit, YouTube & Spanish channels"] },
        stageCue: "VIEWS_CHIME",
        scriptText: {
          zh: "Ryan那条发布帖，两天冲到一百四十万浏览，一万九千人收藏。Reddit上已经有人晒自己跑出来的图，YouTube和Instagram上的二创视频也起来了，西班牙语的频道都在做。",
          en: "Ryan's launch post hit 1.4 million views and 19,000 bookmarks in two days. People are sharing their own builds on Reddit, remix videos are popping up on YouTube and Instagram, even on Spanish-language channels."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 作者最冷静的坦白", en: "20s · The Author's Candid Truth" },
        headline: { zh: "Ryan 坦言：Claude 很会造，不太会看，零件数字全对样子仍可能别扭", en: "Ryan's sober note: Claude is great at building, poor at seeing — human eyes matter" },
        detail: { zh: "舞台切入官方 gradient-descent（梯度下降等高线仪）：真正管用的修复，来自人眼盯着它跑，指出哪里别扭。", en: "Stage switches to official gradient-descent contour table: numbers can be right while the look is off; watching it run is the cure." },
        metrics: { zh: ["官方 gradient-descent 等高线", "AI 强于建造弱于直觉审视", "人眼反馈是收敛关键"], en: ["Official gradient-descent table", "Claude builds well, sees poorly", "Watch it run & call out flaws"] },
        stageCue: "EYE_CONTOUR",
        scriptText: {
          zh: "冷静的声音也有，而且最冷静的来自作者自己。他写得很坦白，Claude很会造，不太会看，零件数字全对，样子还是可能不对。管用的修复，来自你盯着它跑，说出哪里别扭。",
          en: "There are sober voices too — the most sober coming from the author himself. He admits frankly: Claude is great at building, but poor at seeing. Every number can be right while the look is still off. Real fixes come from watching it run and saying what feels awkward."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 黄金四步用刀法", en: "30s · The Four-Step Workflow" },
        headline: { zh: "官方建议：第一版当草稿，上手玩，说出哪里不对，再来一轮", en: "Official advice: Treat v1 as a draft, play with it, say what's wrong, iterate" },
        detail: { zh: "舞台切入官方 flex-grow（自适应台钳）：把第一版当草稿，亲手把玩并指出别扭之处，迭代一轮即可夹紧成型。", en: "Stage switches to official flex-grow vise: treat the first version as a draft, play with it hands-on, critique, and run one more pass." },
        metrics: { zh: ["官方 flex-grow 精密台钳", "第一版当草稿上手玩", "指出别扭再来一轮"], en: ["Official flex-grow precision vise", "Treat v1 as a rough draft", "Play, critique, and iterate"] },
        stageCue: "ITERATE_VISE",
        scriptText: {
          zh: "所以官方建议，第一版当草稿，上手玩，说出哪里不对，再来一轮。",
          en: "So the official advice is simple: treat the first version as a draft, play with it yourself, tell Claude what feels wrong, and go one more round."
        }
      }
    ]
  },
  {
    id: "ch14",
    index: 13,
    number: "14",
    title: { zh: "品味可以打包", en: "Taste Can Be Packaged" },
    subtitle: { zh: "OFFICIAL FIGURES: FOUNDRY · GLASS-FURNACE · FORGE · STUDIO", en: "Official Figures: Foundry · Glass Furnace · Forge · Studio" },
    duration: 40,
    stageType: "official-pkg",
    machineKey: "foundry",
    thesis: {
      zh: "Ryan 从没亲手画过一条线 —— 他做的是看、指出不对、把教训写成规则。",
      en: "Ryan never drew a single line by hand — he watched, pointed out flaws, and turned lessons into rules."
    },
    takeaway: {
      zh: "你的经验、品味、验收标准，都能打包成文件，让任何一个 Agent 继承",
      en: "Your experience, taste, and quality bar can be packaged into files for any agent to inherit"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [foundry] · 155L SKILL.md + 8 REFS + 16,000L KIT";
        if (beat === 1) return "OFFICIAL [glass-furnace] · LESSON-BACKED RULES > BARE RULES";
        if (beat === 2) return "OFFICIAL [forge] · SKILL AS NEW ENGINEERING ARTIFACT";
        return "OFFICIAL [studio] · TASTE & STANDARDS INHERITED BY ANY AGENT";
      }
      if (beat === 0) return "OFFICIAL [foundry] · 155行 SKILL.md + 8份参考文档 + 1.6万行工具包";
      if (beat === 1) return "OFFICIAL [glass-furnace] · 从不画线的作者 · 带着教训写规则";
      if (beat === 2) return "OFFICIAL [forge] · Skill 正在变成全新的工程制品";
      return "OFFICIAL [studio] · 经验、品味、验收标准打包供任何 Agent 继承";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 审美资产三件套", en: "00s · The Three-Part Asset" },
        headline: { zh: "155 行 SKILL.md + 8 份参考文档 + 1.6 万行绘图工具包", en: "155-line SKILL.md + 8 reference docs + a 16,000-line drawing toolkit" },
        detail: { zh: "舞台直接运行官方 foundry（字模铸造机）：把审美与工艺固化成了可复用的工程资产。", en: "Stage runs official foundry type-caster: crystallizing taste and craftsmanship into a reusable engineering asset." },
        metrics: { zh: ["官方 foundry 铸造机", "155 行 SKILL.md + 8 份文档", "16,000 行绘图工具包"], en: ["Official foundry type-caster", "155L SKILL.md + 8 ref docs", "16,000-line isometric toolkit"] },
        stageCue: "FOUNDRY_1",
        scriptText: {
          zh: "Anatomy给我的启发，超出这些图本身。一个155行的SKILL.md，八份参考文档，一个一万六千行的绘图工具包，就把审美和工艺固化成了能复用的资产。",
          en: "What inspires me about Anatomy goes beyond the figures themselves. A 155-line SKILL.md, eight reference docs, and a 16,000-line drawing toolkit crystallize taste and craft into a reusable asset."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 从不画线的作者", en: "10s · Lesson-Backed Rules" },
        headline: { zh: "Ryan 从没画过一条线：他的工作是看，说哪里不对，写成规则", en: "Ryan never drew a line: he watched, called out flaws, and wrote rules with lessons" },
        detail: { zh: "舞台切入官方 glass-furnace（玻璃熔炉）：带着翻车教训写出来的规则，比光秃秃的口号管用，AI 下次真会守。", en: "Stage switches to official glass-furnace: rules written with the scar of a past failure work far better than bare commandments." },
        metrics: { zh: ["官方 glass-furnace 玻璃熔炉", "作者手绘线条：0 条", "带翻车教训的规则最有效"], en: ["Official glass-furnace lehr", "0 lines hand-drawn by author", "Rules with lessons actually stick"] },
        stageCue: "FOUNDRY_2",
        scriptText: {
          zh: "Ryan说他从没画过一条线。他做的事是看，说哪里不对，把这句话写成规则。带着教训写出来的规则，比光秃秃的规则管用，AI下一次真的会守。",
          en: "Ryan says he has never drawn a single line himself. His job is to look, say what's wrong, and turn that into a rule. Rules written with a lesson attached work far better than bare rules — next time, the AI actually obeys them."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 新型工程制品", en: "20s · Skills as Engineering Artifacts" },
        headline: { zh: "Skill 正在变成 AI 时代全新的核心工程制品", en: "Skills are becoming a brand-new class of software engineering artifact" },
        detail: { zh: "舞台切入官方 forge（锻造冲压台）：把人类的审美判断与质量护栏锻造成标准化的 Skill 制品。", en: "Stage switches to official forge press: forging human judgment and quality guardrails into standardized skill bundles." },
        metrics: { zh: ["官方 forge 锻造冲压台", "Skill = 新型工程制品", "元能力与护栏标准化"], en: ["Official forge hydraulic press", "Skill = new engineering artifact", "Standardized craft & guardrails"] },
        stageCue: "FOUNDRY_3",
        scriptText: {
          zh: "这指向一个更大的事，skill正在变成新的工程制品。",
          en: "This points to something much bigger: skills are becoming a brand-new kind of engineering artifact."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 让Agent继承品味", en: "30s · Inheriting Human Taste" },
        headline: { zh: "你的经验、品味、验收标准，都能打包成文件让任何 Agent 继承", en: "Package your experience, taste, and acceptance bar for any agent to inherit" },
        detail: { zh: "舞台切入官方 studio（精密摄影棚）：无论哪个 Agent 加载这份文件，都能直接继承你的品味与标准。", en: "Stage switches to official studio lighting rig: any coding agent loading your skill file inherits your taste and standards." },
        metrics: { zh: ["官方 studio 精密摄影棚", "打包经验与审美品味", "让任何 Agent 直接继承"], en: ["Official studio lighting bench", "Package experience & taste", "Inherited by any AI agent"] },
        stageCue: "FOUNDRY_4",
        scriptText: {
          zh: "你的经验、品味、验收标准，都能打包成文件，让任何一个agent继承。",
          en: "Your experience, your aesthetic taste, and your acceptance standards can all be packaged into files for any agent to inherit."
        }
      }
    ]
  },
  {
    id: "ch15",
    index: 14,
    number: "15",
    title: { zh: "接下来看什么", en: "What to Watch Next" },
    subtitle: { zh: "OFFICIAL FIGURES: PUBLIC-KEY · TURNING-DIAL (3D) · PLASMA-CUTTER · TOKAMAK", en: "Official Figures: Public Key · Turning Dial (3D) · Plasma Cutter · Tokamak" },
    duration: 40,
    stageType: "official-pkg",
    machineKey: "public-key",
    thesis: {
      zh: "一行字，一台机器 —— 技术文档、落地页与 AI 技能的下一站已经开启。",
      en: "One prompt, one machine — the next frontier for technical docs, landing pages, and AI skills has begun."
    },
    takeaway: {
      zh: "评论区留下你最想讲清的概念 · 点赞过千下期实测 · 欢迎一键三连",
      en: "Drop a concept you want explained in the comments · 1,000 likes and we test it live"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "TREND 01 · OFFICIAL [public-key] · npm i anatomy-figures (33 REACT COMPONENTS)";
        if (beat === 1) return "TREND 02 · OFFICIAL [turning-dial] · 3D BETA · 380-PART HAND @ 20 FPS";
        if (beat === 2) return "TREND 03 · OFFICIAL [plasma-cutter] · MODEL-DRIVEN EVERYTHING";
        return "OFFICIAL [tokamak] · ONE PROMPT, ONE MACHINE · SEE YOU NEXT TIME";
      }
      if (beat === 0) return "趋势 01 · OFFICIAL [public-key] · anatomy-figures npm包 33台机器一行 import";
      if (beat === 1) return "趋势 02 · OFFICIAL [turning-dial] · 3D 模式 Beta · 380零件测试手 20 FPS";
      if (beat === 2) return "趋势 03 · OFFICIAL [plasma-cutter] · 模型驱动一切渗入更多 Skill";
      return "OFFICIAL [tokamak] · 一行字，一台机器 · 评论区见！";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 趋势一：进军生产文档", en: "00s · Trend 1: Production Docs" },
        headline: { zh: "anatomy-figures npm 包已把 33 台机器封装为 React 组件", en: "The anatomy-figures npm package wraps all 33 machines as React components" },
        detail: { zh: "舞台运行官方 public-key（公钥双芯锁）：正是本次视频直接调用的 anatomy-figures 包，一行 import 即可用。", en: "Stage runs official public-key dual-cylinder lock: import any of the 33 figures into docs or landing pages in one line." },
        metrics: { zh: ["官方 public-key 锁具机", "npm: anatomy-figures", "33 台机器一行 import"], en: ["Official public-key lock", "npm: anatomy-figures", "33 machines in 1 import line"] },
        stageCue: "NEXT_REACT",
        scriptText: {
          zh: "后面可以盯三件事。第一件，这种插图会开始出现在技术文档和落地页里，anatomy-figures这个npm包已经把33台机器做成了React组件，一行import就能用。",
          en: "Watch for three things next. First, these figures will start appearing in technical docs and landing pages — the anatomy-figures npm package already wraps all 33 machines into React components ready in a single import."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 趋势二：3D模式突破", en: "10s · Trend 2: 3D Mode Beta" },
        headline: { zh: "3D 模式尚处 Beta：380 零件测试手目前 20 帧，成熟后天花板再抬一截", en: "3D mode is still in beta: a 380-part test hand runs at 20 FPS, raising the ceiling" },
        detail: { zh: "舞台切入官方 turning-dial（3D 机械手与密码转盘）：90 个金属零件在真实 3D 纵深中旋转重投影。", en: "Stage switches to official turning-dial (3D mechanical hand & dial): once 3D matures, the ceiling lifts another notch." },
        metrics: { zh: ["官方 turning-dial 3D 机械手", "380 零件测试手 @ 20 FPS", "3D 成熟后上限再抬一截"], en: ["Official turning-dial 3D hand", "380-part test hand @ 20 FPS", "3D beta raising the ceiling"] },
        stageCue: "NEXT_3D_HAND",
        scriptText: {
          zh: "第二件，3D模式还是beta，一个三百八十零件的测试手只跑到20帧，这块成熟了，天花板再抬一截。",
          en: "Second, 3D mode is still in beta — a 380-part test hand currently runs at 20 frames per second. Once that matures, the ceiling rises another notch."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 趋势三：模型驱动一切", en: "20s · Trend 3: Model-Driven Skills" },
        headline: { zh: "“底层数学模型驱动一切”的做法，会加速渗进更多领域 Skill", en: "The 'model-drives-everything' approach will spread into many more skills" },
        detail: { zh: "舞台切入官方 plasma-cutter（WebGL 等离子切割机）：数学模型驱动几何、读数与着色器的范式将重塑更多 Skill。", en: "Stage switches to official plasma-cutter: one line of text, one working machine — simple as that." },
        metrics: { zh: ["官方 plasma-cutter 等离子机", "数学模型驱动一切", "渗入更多工程级 Skill"], en: ["Official plasma-cutter torch", "Model-driven architecture", "One prompt, one machine"] },
        stageCue: "NEXT_PLASMA",
        scriptText: {
          zh: "第三件，模型驱动一切这套做法，会渗进更多skill。一行字，一台机器，就这么简单。",
          en: "Third, this model-drives-everything approach will spread into many more skills. One line of text, one working machine — it's that simple."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 互动召唤：下期实测", en: "30s · Call to Action" },
        headline: { zh: "你手里有没有一直想讲清、始终画不明白的概念？评论区见！", en: "Have a concept you've always wanted to explain clearly? Drop it in the comments!" },
        detail: { zh: "舞台切入官方终极巨作 tokamak（托卡马克核聚变装置）：评论区留下你想看的概念，点赞过千下期实测，欢迎一键三连！", en: "Stage switches to official tokamak fusion torus: leave your concept in the comments — 1,000 likes and we test it live!" },
        metrics: { zh: ["官方 tokamak 核聚变反应堆", "评论区征集实测概念", "点赞过 1,000 下期安排"], en: ["Official tokamak fusion reactor", "Comment your hardest concept", "1,000+ likes = live test"] },
        stageCue: "NEXT_TOKAMAK",
        scriptText: {
          zh: "你手里有没有一个一直想讲清、始终画不明白的概念？评论区告诉我，点赞过一千，我拿来实测。觉得有收获，一键三连，我们下期见。",
          en: "Do you have a concept you've always wanted to explain clearly but could never draw right? Tell me in the comments — if it hits a thousand likes, I'll put it to the test. See you next time!"
        }
      }
    ]
  }
];

export function getChapterState(
  chIndexOrId: number | string,
  tSec: number,
  lang: Language = "zh"
): ChapterState {
  let ch: Chapter | undefined;
  if (typeof chIndexOrId === "number") {
    ch = CHAPTERS[Math.max(0, Math.min(CHAPTERS.length - 1, Math.floor(chIndexOrId)))];
  } else {
    ch = CHAPTERS.find((c) => c.id === chIndexOrId) || CHAPTERS[0];
  }
  const clamped = Math.max(0, Math.min(ch.duration - 0.001, Number.isFinite(tSec) ? tSec : 0));
  const beatIndex = getBeatIndex(clamped);
  const activeBeat = ch.beats[beatIndex] || ch.beats[0];
  const beatSpan = Math.max(0.001, activeBeat.end - activeBeat.start);
  const beatProgress = Math.max(0, Math.min(1, (clamped - activeBeat.start) / beatSpan));
  const readout = ch.readout ? ch.readout(clamped, beatIndex, lang) : "";
  const activeFigureKey = getActiveFigureKey(ch.id, clamped, beatIndex);

  return {
    chapter: ch,
    beatIndex,
    timeSec: clamped,
    beatProgress,
    readout,
    activeFigureKey,
  };
}
