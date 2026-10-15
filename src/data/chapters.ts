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

export function getBeatIndex(tSec: number): number {
  if (tSec < 10) return 0;
  if (tSec < 20) return 1;
  if (tSec < 30) return 2;
  return 3;
}

export const CHAPTER_FIGURES: Record<string, (t: number, beat: number) => string> = {
  ch01: () => "watch",
  ch02: (_t, beat) => ["message-queue", "dns", "process-pump", "git-merge"][beat],
  ch03: (_t, beat) => ["computer", "binary-search", "b-tree", "computer"][beat],
  ch04: (_t, beat) => ["press-and-pull", "profile", "one-context", "press-and-pull"][beat],
  ch05: (_t, beat) => ["lru-cache", "rate-limiter", "afterburner", "seasons"][beat],
  ch06: (_t, beat) => ["one-stage", "fit", "separable-blur", "lens-bench"][beat],
  ch07: (t) => {
    if (t < 8) return "hash-map";
    if (t < 16) return "bloom-filter";
    if (t < 24) return "mutex";
    if (t < 32) return "tcp-handshake";
    return "sampling";
  },
  ch08: (_t, beat) => ["turbofan", "reactor", "afterburner", "turbofan"][beat],
  ch09: (_t, beat) => ["lit-by-facing", "easing", "turbofan", "three-reads"][beat],
  ch10: (_t, beat) => ["mark-sweep", "four-frames", "turbofan", "frosted-copy"][beat],
  ch11: (_t, beat) => ["watch", "seasons", "power-station", "turbofan"][beat],
  ch12: (_t, beat) => ["box-model", "spot-plate", "bevel-offset", "shared-canvas"][beat],
  ch13: (_t, beat) => ["debounce", "merge-sort", "gradient-descent", "flex-grow"][beat],
  ch14: (_t, beat) => ["foundry", "glass-furnace", "forge", "studio"][beat],
  ch15: (_t, beat) => ["public-key", "seasons", "plasma-cutter", "tokamak"][beat],
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
    subtitle: { zh: "官方 FIGURE: WATCH MOVEMENT · 单行 PROMPT", en: "Official Figure: Watch Movement · One-Line Prompt" },
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
        return "BUILD 1h 54m · 0 HUMAN STROKES · 8,200+ STARS";
      }
      if (beat === 0) return "OFFICIAL [watch] · 4 Hz · 28,800 vph · CROWN WINDING";
      if (beat === 1) return "KEY [S] · 1/20× SLOW SPEED · 15-TOOTH ESCAPE WHEEL";
      if (beat === 2) return "KEY [E] · BRIDGES LIFTED APART · 60:1 GEAR TRAIN";
      return "BUILD 1h 54m · 0 人工绘图 · 8,200+ Stars";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 上链储能", en: "00s · Winding & Energy" },
        headline: { zh: "拖动表冠上发条，动力储存逐格攀升", en: "Drag the crown to wind the mainspring, watch power reserve build" },
        detail: { zh: "棘轮啮合旋转、棘爪止逆作响，发条盒游丝盘紧，动力储存实时涨向 38 小时。", en: "Ratchet teeth mesh with clicking pawls, barrel spring coils tight, power climbs towards 38 hours." },
        metrics: { zh: ["官方 watch 原版机芯", "表冠拖拽上发条", "棘轮+棘爪止逆联动"], en: ["Official watch movement", "Crown drag winding", "Ratchet & click mechanism"] },
        stageCue: "WATCH_WIND",
        scriptText: {
          zh: "先看一个东西。这是一块机械表的机芯。你可以拖动表冠上发条，棘轮转，棘爪响，动力储存一格一格涨上去。",
          en: "Take a look at this. This is the caliber movement of a mechanical watch. Drag the crown to wind the spring, hear the pawl click, and watch the power reserve fill."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 慢镜擒纵", en: "10s · Slow-Mo Escapement" },
        headline: { zh: "按 S 键放慢至 1/20，看清半齿释放", en: "Press S to slow down to 1/20x and observe half-tooth escapement release" },
        detail: { zh: "时间流速降至二十分之一，双叉瓦擒纵叉精准卡入 15 齿擒纵轮，每次摆动恰好放行半个齿距。", en: "Time slows by 20x, ruby pallet jewels lock into the 15-tooth escape wheel, releasing exactly half a pitch per swing." },
        metrics: { zh: ["KEY [S] · 1/20× 慢镜", "15 齿擒纵轮", "单次放行 0.5 齿"], en: ["Key [S] · 1/20x Slow-Mo", "15-tooth escape wheel", "0.5 tooth release per beat"] },
        stageCue: "WATCH_SLOW",
        scriptText: {
          zh: "按一下S键，时间放慢到二十分之一，你能看到擒纵叉把十五齿的擒纵轮，一次放过去半个齿。",
          en: "Press the S key to slow time down to one-twentieth. Watch the pallet fork release the 15-tooth escape wheel half a tooth at a time."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 夹板拆解", en: "20s · Exploded Bridges" },
        headline: { zh: "按 E 键升起夹板，真实齿轮比全公开", en: "Press E to lift the bridges and expose authentic gear reduction ratios" },
        detail: { zh: "上夹板与摆轮夹板沿定位立柱平稳抬升，底层轮系一览无余：秒轮一分钟一圈，中心轮一小时一圈。", en: "Top plates and balance cock lift on guide pillars, exposing the underlying gear train: fourth wheel 1 rpm, center wheel 1 rph." },
        metrics: { zh: ["KEY [E] · 夹板抬升", "秒轮 1 r/min", "中心轮 1 r/hour"], en: ["Key [E] · Exploded Bridges", "Fourth wheel 1 rpm", "Center wheel 1 rph"] },
        stageCue: "WATCH_APART",
        scriptText: {
          zh: "再按E键，夹板升起来，下面的轮系露出来，齿轮比例全是真的，秒轮一分钟一圈，中心轮一小时一圈。",
          en: "Press the E key to elevate the bridges. The complete gear train is revealed beneath with accurate mechanical gear ratios."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 一次成型", en: "30s · Zero-Human Generation" },
        headline: { zh: "无人手绘：来自一行 Prompt 的工程奇迹", en: "Zero human drafting: An engineering marvel prompted by a single sentence" },
        detail: { zh: "Prompt: “解释机械表怎么计时” —— Claude 独立运转 1 小时 54 分钟一次成型，Anatomy 开源 6 天突破 8,200 星。", en: "Prompt: 'Explain how a mechanical watch keeps time' — Claude worked autonomously for 1h 54m in one shot. Anatomy hit 8,200+ stars in 6 days." },
        metrics: { zh: ["耗时 1h 54m 一次成型", "Claude Code 技能", "6 天 8,200+ Stars"], en: ["1h 54m autonomous run", "Claude Code skill", "8,200+ stars in 6 days"] },
        stageCue: "WATCH_FULL",
        scriptText: {
          zh: "这块表没有任何人画过。它来自一行字：解释机械表怎么计时。Claude自己干了一小时五十四分钟，一次成型。做出它的，是一个叫Anatomy的Claude Code技能。上线六天，GitHub八千多星。这期视频，从原理到实践，把它讲透。",
          en: "No human artist drew this watch. It came from a single prompt: explain how a mechanical watch tells time. Claude ran for 1 hour 54 minutes straight to produce it."
        }
      }
    ]
  },
  {
    id: "ch02",
    index: 1,
    number: "02",
    title: { zh: "方块和箭头的老问题", en: "The Flaw of Boxes and Arrows" },
    subtitle: { zh: "OFFICIAL FIGURES: MESSAGE-QUEUE · DNS · PROCESS-PUMP · GIT-MERGE", en: "Official Figures: Message Queue · DNS · Process Pump · Git Merge" },
    duration: 40,
    stageType: "official-pkg",
    machineKey: "message-queue",
    thesis: {
      zh: "方块只告诉你部件存在，箭头把最关键的“怎么动”丢给读者脑补。",
      en: "Boxes only declare parts exist; arrows leave the most critical question — how it moves — to the reader's imagination."
    },
    takeaway: {
      zh: "画出那个东西本身 —— 读者不用脑补，伸手玩一遍就懂了",
      en: "Draw the machine itself — no guessing needed, interact and understand immediately"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [message-queue] · MARBLE RUN ESCAPEMENT";
        if (beat === 1) return "OFFICIAL [dns] · GRAVITY CHUTE MULTI-TIER ROUTING";
        if (beat === 2) return "OFFICIAL [process-pump] · HYDRAULIC PRESSURE CHAMBER";
        return "OFFICIAL [git-merge] · CONVEYOR BELT MERGE JUNCTION";
      }
      if (beat === 0) return "OFFICIAL [message-queue] · 滚珠轨道重力擒纵";
      if (beat === 1) return "OFFICIAL [dns] · 多级重力滑槽路由";
      if (beat === 2) return "OFFICIAL [process-pump] · 液压腔体压力反馈";
      return "OFFICIAL [git-merge] · 双轨传送带合并节点";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 消息队列", en: "00s · Message Queue" },
        headline: { zh: "滚珠入仓：削峰填谷的机械直觉", en: "Marbles enter the hopper: The mechanical intuition of peak-shaving" },
        detail: { zh: "并发消息化作密集落下的钢珠，漏斗缓冲暂存，擒纵爪匀速放行给后端处理工位。", en: "Concurrent messages turn into falling steel marbles, buffered in the hopper and metered out evenly by the escapement." },
        metrics: { zh: ["高并发滚珠流", "缓冲漏斗削峰", "擒纵爪匀速释放"], en: ["High-concurrency marble flow", "Buffer hopper peak shaving", "Escapement metered release"] },
        stageCue: "MQ_MARBLE",
        scriptText: {
          zh: "过去二十年，我们画架构图就是方块连箭头。消息队列画个方块，写个MQ，然后画三个箭头指向三个消费者方块。可是，削峰填谷是怎么削的？背压是怎么传导的？",
          en: "For twenty years, architecture diagrams were just boxes and arrows. A box labeled MQ with three arrows. But how does peak shaving actually work? How does backpressure propagate?"
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · DNS 递归", en: "10s · DNS Recursion" },
        headline: { zh: "重力滑槽逐级分流，根域到权威全可视", en: "Gravity chutes branch step by step, from root to authoritative servers" },
        detail: { zh: "滚珠从根域滑槽滚入顶级域分拣器，再落入权威服务器抽屉，递归解析一目了然。", en: "A marble rolls from the root chute into the TLD sorter and drops into the authoritative drawer, making recursive lookup obvious." },
        metrics: { zh: ["根域名滑槽", "TLD 顶级分拣器", "权威抽屉落入"], en: ["Root domain chute", "TLD branch sorter", "Authoritative drawer"] },
        stageCue: "DNS_CHUTE",
        scriptText: {
          zh: "DNS递归解析呢？画五个方块绕一圈。读者看懂了吗？根本没有。Anatomy画的是滑槽，滚珠从根域滑到顶级域，再掉进权威服务器的抽屉里。",
          en: "And DNS recursive lookup? Drawing five boxes in a circle teaches nothing. Anatomy renders a physical gravity chute rolling from root to TLD to authoritative drawers."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 进程与管道", en: "20s · Process & Pipe" },
        headline: { zh: "活塞推压与液压传导，背压机制直观呈现", en: "Piston compression and hydraulic transfer bring backpressure to life" },
        detail: { zh: "上游进程如液压活塞下压流体，下游消费慢时管路压力指针飙红，阻塞物理化。", en: "Upstream processes act like hydraulic pistons; when downstream consumption slows, pressure gauges spike red." },
        metrics: { zh: ["液压活塞泵", "管道流体阻尼", "压力表背压显影"], en: ["Hydraulic piston pump", "Pipeline fluid damping", "Pressure gauge visualization"] },
        stageCue: "PUMP_BACKPRESSURE",
        scriptText: {
          zh: "进程间通信不是一根虚线，而是一根充满液压油的管道。上游压得太快，下游处理不过来，压力表的指针当场飙红。",
          en: "Inter-process communication is not a dotted line; it is a pressurized hydraulic conduit. Push too fast upstream, and the dial spikes red."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · Git 分支合并", en: "30s · Git Merge" },
        headline: { zh: "双轨传送带汇入主线，冲突变道清晰可见", en: "Dual conveyor belts merge into main, resolving branch conflicts visually" },
        detail: { zh: "特性分支与主分支在机械交汇点合流，三方合并算法化为履带拨叉的分拣动作。", en: "Feature and main tracks merge at a physical switch point, turning three-way merge logic into mechanical sorting arms." },
        metrics: { zh: ["双轨传送带", "机械分拣拨叉", "冲突传感器示警"], en: ["Dual conveyor tracks", "Mechanical sorting arm", "Conflict sensor alert"] },
        stageCue: "GIT_TRACK",
        scriptText: {
          zh: "Git合并画成两条传送带汇入主轨，读者一眼看懂为什么会有冲突，以及快进合并为什么不需要动传送带的分拣手臂。",
          en: "Git merge is rendered as two conveyor belts joining the main line. Viewers instantly see why conflicts occur and why fast-forwards require no sorting action."
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
      zh: "Anatomy 不是代码库，是一个赋予 Claude '机械设计直觉' 的技能指令包。",
      en: "Anatomy is not a library; it is a skill bundle imparting mechanical design intuition to Claude."
    },
    takeaway: {
      zh: "把代码世界翻译为物理世界 · 57KB 纯指令撬动复杂工程建模",
      en: "Translating code into physical machinery · 57KB of instructions driving intricate engineering"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [computer] · 8-BIT MECHANICAL CPU · ALU ACCUMULATOR";
        if (beat === 1) return "OFFICIAL [binary-search] · LOG2(N) MECHANICAL COMPARATOR BALANCE";
        if (beat === 2) return "OFFICIAL [b-tree] · MULTI-WAY BALANCED SPLITTING CONVEYOR";
        return "ANATOMY CORE · 57KB SKILL.MD · ZERO NPM RUNTIME DEPENDENCY";
      }
      if (beat === 0) return "OFFICIAL [computer] · 8-BIT 机械计算架构 · ALU 累加器";
      if (beat === 1) return "OFFICIAL [binary-search] · LOG2(N) 机械天平比较器";
      if (beat === 2) return "OFFICIAL [b-tree] · 多路平衡自平衡分拣履带";
      return "ANATOMY CORE · 57KB SKILL.MD · 零 NPM 运行时依赖";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 技能定位", en: "00s · Skill Definition" },
        headline: { zh: "不是 NPM 库，而是注入 AI 脑中的机械设计直觉", en: "Not an NPM library, but mechanical intuition injected into AI" },
        detail: { zh: "Anatomy 本质是一份精心调优的 SKILL.md，向 LLM 讲授等轴测透视、光照模型与物理隐喻法则。", en: "Anatomy is an engineered SKILL.md teaching isometric perspective, shading models, and mechanical metaphor rules to LLMs." },
        metrics: { zh: ["Claude Code 扩展技能", "57KB 纯文本指导", "零框架运行时侵入"], en: ["Claude Code extension skill", "57KB pure guidance", "Zero framework runtime intrusion"] },
        stageCue: "CPU_ALU",
        scriptText: {
          zh: "许多人以为 Anatomy 是个新的前端动画库。完全不是。它没有 npm install，没有 runtime。它是给 Claude Code 用的一个技能，文件大小只有 57KB。",
          en: "Many assume Anatomy is a new animation library. It isn't. No npm package, no runtime. It is a 57KB skill file for Claude Code."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 物理映射", en: "10s · Physical Mapping" },
        headline: { zh: "将抽象数据结构还原为可触碰的传动机构", en: "Restoring abstract data structures into tactile mechanical transmissions" },
        detail: { zh: "二叉搜索变成物理杠杆天平，B 树节点裂变成带分流道岔的多路履带，算力化为扭矩。", en: "Binary search becomes a mechanical balance scale; B-tree node splits become track switches, and compute turns into torque." },
        metrics: { zh: ["二叉天平折半比较", "B树节点履带分流", "扭矩映射计算负载"], en: ["Binary scale half-splits", "B-Tree conveyor branches", "Torque maps compute load"] },
        stageCue: "BS_BALANCE",
        scriptText: {
          zh: "这 57KB 的提示词教会了 Claude 一件事：世界上任何抽象的代码概念，都能在物理世界找到一个对应的机械结构。",
          en: "This 57KB prompt teaches Claude one fundamental rule: any abstract software concept maps to a tangible physical mechanism."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 等轴测美学", en: "20s · Isometric Aesthetic" },
        headline: { zh: "30度轴测投影，工业灰配合醒目点缀", en: "30-degree isometric projection with industrial gray and vivid accents" },
        detail: { zh: "严格遵循 30° 等轴测投影，采用铸铁深灰搭配安全橙与机床黄，赋予技术图表精密仪器质感。", en: "Strictly adheres to 30-degree isometric projection, blending cast iron dark grays with safety orange and machine yellow." },
        metrics: { zh: ["30° 经典等轴测角", "三色工业调色板", "SVG 无损矢量缩放"], en: ["30° classic isometric angle", "Tri-color industrial palette", "SVG lossless vector scaling"] },
        stageCue: "BTREE_SPLIT",
        scriptText: {
          zh: "它甚至规定了三十度等轴测视角、冷暖光源的分层反射、以及严苛的工业铸铁配色标准。",
          en: "It even standardizes 30-degree isometric angles, directional lighting layers, and rigorous cast-iron color palettes."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 即刻可用", en: "30s · Instant Execution" },
        headline: { zh: "一行文字输入，端到端交付高精度动效 SVG", en: "Single prompt input, end-to-end delivery of high-precision animated SVG" },
        detail: { zh: "无需配置 CAD 或 3D 建模环境，Claude 直接在终端生成纯原生 SVG 与 CSS 关键帧动画。", en: "No CAD or 3D setup required; Claude generates pure native SVG and CSS keyframe animations right in your terminal." },
        metrics: { zh: ["零 CAD 建模要求", "纯原生 SVG+CSS", "直接嵌入 Web 应用"], en: ["Zero CAD requirements", "Native SVG+CSS", "Direct web embedding"] },
        stageCue: "CPU_CYCLE",
        scriptText: {
          zh: "你只要对 Claude 说一句话，它就自动调度空间坐标、绘制几何体、拼接零件、加上键盘交互，直接吐出可以直接运行的网页。",
          en: "You give Claude a single prompt, and it calculates spatial geometry, coordinates parts, adds interactive hooks, and yields ready-to-run web components."
        }
      }
    ]
  },
  {
    id: "ch04",
    index: 3,
    number: "04",
    title: { zh: "物体就是解释", en: "Objects are the Explanation" },
    subtitle: { zh: "OFFICIAL FIGURES: PRESS-AND-PULL · PROFILE · ONE-CONTEXT", en: "Official Figures: Press & Pull · Profile · One Context" },
    duration: 40,
    stageType: "official-pkg",
    machineKey: "press-and-pull",
    thesis: {
      zh: "真正高超的解释不需要旁白：观察机件的几何咬合，因果关系不言自明。",
      en: "True explanatory mastery needs no narrator: observe the interlocking teeth, and causality is evident."
    },
    takeaway: {
      zh: "几何咬合取代文本描述 · 动态因果链自我证明",
      en: "Geometric mesh replaces prose · Dynamic causal chains prove themselves"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [press-and-pull] · CAM INTERLOCK & DIE STAMPING";
        if (beat === 1) return "OFFICIAL [profile] · STEPPED CONTOUR TURNING TOOL";
        if (beat === 2) return "OFFICIAL [one-context] · CYLINDRICAL COAXIAL SPINDLE";
        return "MECHANICAL EPISTEMOLOGY · FORM FOLLOWS FUNCTION";
      }
      if (beat === 0) return "OFFICIAL [press-and-pull] · 凸轮联动与冲压模具";
      if (beat === 1) return "OFFICIAL [profile] · 台阶轮廓仿形切削刀架";
      if (beat === 2) return "OFFICIAL [one-context] · 圆柱同轴旋转主轴";
      return "机械认识论 · 形式紧随功能";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 形式即逻辑", en: "00s · Form is Logic" },
        headline: { zh: "凸轮与滑块的物理制约，胜过一万字架构说明", en: "Physical cam and slider constraints outperform ten thousand words of docs" },
        detail: { zh: "凸轮的凹槽强制滑块沿特定轨迹往复，正如软件协议的刚性状态机转移规则。", en: "Cam grooves force sliders along exact paths, just like rigid state transitions in software protocols." },
        metrics: { zh: ["凸轮导槽物理约束", "刚性状态机转移", "零理解歧义"], en: ["Cam groove constraints", "Rigid state transitions", "Zero ambiguity"] },
        stageCue: "CAM_SLIDER",
        scriptText: {
          zh: "为什么我们常说‘物体就是解释’？因为在机械里，一个零件能往哪动、能转多快，完全写在它的形状和咬合点上。",
          en: "Why do we say 'objects are the explanation'? In mechanics, where a part moves and how fast it turns is stamped into its physical shape."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 轮廓仿形", en: "10s · Profile Contouring" },
        headline: { zh: "车刀切削出阶梯轴，公差与层级直观呈现", en: "Lathe tool turning stepped shafts makes hierarchies and tolerances tactile" },
        detail: { zh: "不同直径的阶梯轴体现了数据分层的容量差异，切削切痕就是计算成本的具象化。", en: "Stepped shafts of varying diameters reflect tiered capacities; tooling cuts physicalize computational overhead." },
        metrics: { zh: ["阶梯轴直径分层", "切削公差可视化", "工序推进反馈"], en: ["Stepped diameter tiers", "Machining tolerances", "Process feedback"] },
        stageCue: "LATHE_TOOL",
        scriptText: {
          zh: "你看这个车刀切削台阶轴的零件。粗的地方承受大扭矩，细的地方追求高转速。这不就是高并发架构里读写分离的写端和读端吗？",
          en: "Observe this lathe turning a stepped shaft. The thick section carries high torque, while the thin section hits high speeds. That is CQRS in metal."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 同轴约束", en: "20s · Coaxial Alignment" },
        headline: { zh: "同轴主轴确保一致性，打破单点异构隐患", en: "Coaxial spindles enforce synchronization, eliminating single-point divergence" },
        detail: { zh: "所有轮系穿在同一根淬火钢主轴上，只要主轴旋转，所有附属部件必须保持绝对角速度同步。", en: "Gears share a hardened steel spindle; as it rotates, all sub-assemblies preserve absolute angular synchronization." },
        metrics: { zh: ["淬火同轴主轴", "强一致性物理锁定", "消除异构漂移"], en: ["Hardened coaxial spindle", "Strong mechanical lock", "Eliminates drift"] },
        stageCue: "COAXIAL_SHAFT",
        scriptText: {
          zh: "把分布式锁画成一根贯穿所有齿轮的同轴主轴。主轴被销子卡住，所有齿轮一瞬间停摆，没有脑补空间，这就是物理确定性。",
          en: "Render a distributed lock as a coaxial shaft through every gear. Pin the shaft, and every gear stops. No guessing; pure physical certainty."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 认知闭环", en: "30s · Cognitive Loop" },
        headline: { zh: "让观看者从‘听讲座’转变为‘操作仪器’", en: "Transforms the audience from passive listeners into machine operators" },
        detail: { zh: "通过键盘按键与拖拽滑块直接干预机械运转，观众在因果反馈中建立真正的系统级直觉。", en: "Through key presses and dragging sliders, viewers manipulate parts directly, building genuine intuition via immediate tactile feedback." },
        metrics: { zh: ["按键实时触发交互", "微观宏观双向缩放", "建立系统级心智模型"], en: ["Keyboard interactive triggers", "Micro/macro bidirectional zoom", "Builds system mental models"] },
        stageCue: "PRESS_RUN",
        scriptText: {
          zh: "当读者可以用手指按键去扳动机床离合器的时候，他不再是被动的信息接收者，而是这台数字机器的试车工程师。",
          en: "When users tap keys to engage a machine clutch, they stop being passive listeners and become test engineers driving a digital engine."
        }
      }
    ]
  },
  {
    id: "ch05",
    index: 4,
    number: "05",
    title: { zh: "提示词的三个关键词", en: "Three Keywords for Prompts" },
    subtitle: { zh: "OFFICIAL FIGURES: LRU-CACHE · RATE-LIMITER · AFTERBURNER · SEASONS", en: "Official Figures: LRU Cache · Rate Limiter · Afterburner · Seasons" },
    duration: 40,
    stageType: "official-pkg",
    machineKey: "lru-cache",
    thesis: {
      zh: "驾驭 Anatomy 只需掌握三个黄金词汇：隐喻 (Metaphor)、传动 (Drive)、剖面 (Cross-Section)。",
      en: "Mastering Anatomy boils down to three golden words: Metaphor, Drive, and Cross-Section."
    },
    takeaway: {
      zh: "Metaphor 锚定形态 · Drive 注入活力 · Section 剖视内部",
      en: "Metaphor anchors form · Drive breathes life · Section reveals the interior"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [lru-cache] · CONVEYOR REORDERING & HEAD EVICTION";
        if (beat === 1) return "OFFICIAL [rate-limiter] · TOKEN ESCAPEMENT & SPILL OVERFLOW";
        if (beat === 2) return "OFFICIAL [afterburner] · FUEL SPRAY RINGS & SUPERSONIC NOZZLE";
        return "OFFICIAL [seasons] · ORBITAL TILT & SOLAR DIAL CYCLES";
      }
      if (beat === 0) return "OFFICIAL [lru-cache] · 履带重排与末端淘汰";
      if (beat === 1) return "OFFICIAL [rate-limiter] · 令牌漏斗与溢出滑梯";
      if (beat === 2) return "OFFICIAL [afterburner] · 环形喷油环与尾喷口膨胀";
      return "OFFICIAL [seasons] · 轨道倾角与日晷周年循环";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 隐喻 Metaphor", en: "00s · Metaphor" },
        headline: { zh: "第一词：为抽象代码赋予坚固的实体机械隐喻", en: "Word 1: Metaphor — anchor code into tangible industrial machinery" },
        detail: { zh: "不要写“生成 LRU 缓存图”，而要写“带循环履带与机械抓手的货架分拣机，热数据放顶层，冷数据落废料框”。", en: "Don't say 'draw an LRU cache.' Say 'a reordering conveyor with magnetic claws: hot items ride high, cold items drop into waste bins.'" },
        metrics: { zh: ["实体机械映射", "摒弃抽象框图", "赋予工业现实感"], en: ["Physical machine mapping", "Abandons abstract diagrams", "Grants industrial realism"] },
        stageCue: "LRU_CONVEYOR",
        scriptText: {
          zh: "想要让 Claude 做出惊艳的机器，提示词有三个关键词。第一个词是：Metaphor，隐喻。你得告诉它，这个概念在物理世界长什么样。",
          en: "To get Claude to build jaw-dropping machines, remember three keywords. The first is Metaphor. You must define what this concept looks like as metal and stone."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 传动 Drive", en: "10s · Drive" },
        headline: { zh: "第二词：明确动力源头与机械运动传递链条", en: "Word 2: Drive — trace the power source through mechanical link chains" },
        detail: { zh: "必须写清驱动轴、皮带轮、齿轮减速箱与阻尼器，运动有始有终，各构件角速度严格符合比例。", en: "Explicitly detail drive shafts, pulleys, reduction gearboxes, and dampers so every motion has clear mechanical lineage." },
        metrics: { zh: ["动力源物理传递", "齿轮减速比一致", "阻尼与反馈链路"], en: ["Power transmission line", "Consistent gear ratios", "Damping and feedback loop"] },
        stageCue: "RL_ESCAPEMENT",
        scriptText: {
          zh: "第二个词是：Drive，传动。机器不能凭空动，必须有曲轴、飞轮、连杆或者擒纵机构。动力从哪来，传递给谁，全链条闭环。",
          en: "The second word is Drive. Parts cannot float; they require crankshafts, flywheels, connecting rods, or escapements. Trace power from motor to output."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 剖面 Section", en: "20s · Cross-Section" },
        headline: { zh: "第三词：切开外壳，显露核心运作腔体与流道", en: "Word 3: Cross-Section — slice the casing to reveal internal chambers" },
        detail: { zh: "如同喷气发动机加力燃烧室的剖视图，剥开厚重金属机壳，让内部喷油嘴与点火电极清晰显露。", en: "Like an afterburner cutaway, slice away heavy outer cladding to expose internal fuel rings, igniters, and supersonic nozzles." },
        metrics: { zh: ["四分之一透视剖切", "内部流场工况可见", "零件装配层级分明"], en: ["Quarter-cut perspective", "Visible internal fluid paths", "Clear subassembly tiers"] },
        stageCue: "AB_NOZZLE",
        scriptText: {
          zh: "第三个词是：Cross-Section，剖切。不要画一个黑盒子或者封闭机箱，把外壳切开四分之一，露出里面的气道、活塞和轴承。",
          en: "The third word is Cross-Section. Never draw a sealed black box. Slice away a quarter quadrant to reveal internal conduits, pistons, and bearings."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 组合魔法", en: "30s · Formula in Action" },
        headline: { zh: "三词合璧，Claude 即可秒级构筑复杂工业奇观", en: "Combine all three, and Claude generates complex industrial wonders in seconds" },
        detail: { zh: "只要提示词包含这三要素，哪怕是复杂的公钥加密或季节变化，都能一次性蜕变为兼具科学与艺术的杰作。", en: "When prompts cover metaphor, drive, and section, even public-key cryptography or orbital mechanics turn into functional masterpieces." },
        metrics: { zh: ["三位一体构筑规范", "Prompt 工程标准化", "一次通过率达 95%"], en: ["Triad architectural spec", "Standardized prompt engineering", "95% first-pass success rate"] },
        stageCue: "SEASONS_ORBIT",
        scriptText: {
          zh: "只要你在提示词里写好隐喻、传动和剖面，Claude 就能在不需要任何人工干预的情况下，一次性吐出令人叹为观止的高精度工业级模型。",
          en: "Whenever your prompt specifies Metaphor, Drive, and Section, Claude outputs stunning high-precision industrial models without human hand-holding."
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
      zh: "Anatomy 将机器生成细分为严谨的十步工序，绝不让 AI 产生模糊幻觉。",
      en: "Anatomy deconstructs machine synthesis into a strict 10-step pipeline, eliminating AI hallucination."
    },
    takeaway: {
      zh: "从概念解构到光照渲染 · 十步流水线铸就工业级确定性",
      en: "From deconstruction to shader rendering · 10-step pipeline guarantees industrial certainty"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [one-stage] · PIPELINE STAGE 1..3 · BOUNDING CUBE";
        if (beat === 1) return "OFFICIAL [fit] · PIPELINE STAGE 4..6 · GEOMETRIC TOLERANCE FIT";
        if (beat === 2) return "OFFICIAL [separable-blur] · PIPELINE STAGE 7..8 · DUAL-PASS GAUSSIAN";
        return "OFFICIAL [lens-bench] · PIPELINE STAGE 9..10 · OPTICAL FOCUS FINAL INSPECTION";
      }
      if (beat === 0) return "OFFICIAL [one-stage] · 流水线步骤 1..3 · 包围盒与空间基准";
      if (beat === 1) return "OFFICIAL [fit] · 流水线步骤 4..6 · 几何公差与部件配合";
      if (beat === 2) return "OFFICIAL [separable-blur] · 流水线步骤 7..8 · 双通道高斯模糊";
      return "OFFICIAL [lens-bench] · 流水线步骤 9..10 · 光学透镜最终检验台";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 空间定界", en: "00s · Bounding Bounds" },
        headline: { zh: "步骤 1~3：建立 3D 轴测网格与包围盒基准", en: "Steps 1–3: Establish 3D isometric grid and bounding cube bounds" },
        detail: { zh: "从三维坐标系投影公式出发，规划设备长宽高的安全包围盒，防止机件穿模出界。", en: "Derives projection matrices, establishing a tight safety bounding cube in 3D coordinate space to prevent clipping." },
        metrics: { zh: ["3D 等轴测投影矩阵", "安全包围盒锁定", "零零件穿模风险"], en: ["3D isometric projection matrix", "Bounding cube lock", "Zero boundary clipping"] },
        stageCue: "STAGE_BOUND",
        scriptText: {
          zh: "很多人好奇，AI 怎么可能把这么复杂的机器画得严丝合缝？秘密就是 Anatomy 内置的十步流水线。前三步，先定空间基准和包围盒。",
          en: "Many wonder how AI produces complex assemblies without misalignments. The secret is Anatomy's 10-step pipeline. Steps 1 through 3 define spatial bounds."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 零件公差", en: "10s · Geometric Fit" },
        headline: { zh: "步骤 4~6：机加工零件配合与传动咬合解算", en: "Steps 4–6: Resolve component fits and mechanical mesh clearances" },
        detail: { zh: "计算齿轮模数、节圆直径、轴承间隙与连杆行程，确保每一个零件在数学上具备真实运动可行性。", en: "Computes gear modules, pitch diameters, bearing clearances, and rod strokes, ensuring mathematical kinematics." },
        metrics: { zh: ["齿轮模数与节圆匹配", "精密滑动间隙解算", "刚体运动学校验"], en: ["Gear module & pitch fit", "Precision slip tolerance", "Rigid body kinematics"] },
        stageCue: "FIT_CLEARANCE",
        scriptText: {
          zh: "四到六步是零件配合。齿轮的模数是多少、齿数对不对、滑动槽的间隙留几毫米，全部通过严格的三角函数计算。",
          en: "Steps 4 through 6 calculate mechanical tolerances. Gear tooth pitch, clearance gaps, and slide strokes are solved with exact trigonometry."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 光影渲染", en: "20s · Lighting Passes" },
        headline: { zh: "步骤 7~8：法线朝向光照计算与双通道阴影投射", en: "Steps 7–8: Normal vector lighting calculations and dual-pass shadows" },
        detail: { zh: "依据三个轴向的面法向量分配顶光、侧光与环境底光，辅以高斯柔化投射阴影，烘托沉重体量感。", en: "Assigns directional key, rim, and ambient bounce lights based on face normals, rendered with Gaussian drop shadows." },
        metrics: { zh: ["三向法向量光照分层", "柔和接触环境遮挡", "工业铸铁漫反射模型"], en: ["3-way face normal shading", "Soft contact ambient occlusion", "Cast iron matte diffuse model"] },
        stageCue: "BLUR_PASS",
        scriptText: {
          zh: "七到八步是光影渲染。朝上的面吃顶光，朝侧面的面吃侧光，背光面留深灰，再叠加上柔和的接触阴影，金属质感瞬间立住。",
          en: "Steps 7 and 8 calculate illumination. Top-facing facets catch ceiling highlights, side faces take rim tints, grounded by soft drop shadows."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 交互挂载", en: "30s · Interaction Hooks" },
        headline: { zh: "步骤 9~10：数据驱动属性注入与键盘交互绑定", en: "Steps 9–10: Inject data-anim attributes and keyboard listeners" },
        detail: { zh: "为各运动组件挂载 data-anim 标签，暴露速度调节与拆解按键事件，使静态绘图一秒化身可操控交互装置。", en: "Appends data-anim hooks and keyboard listeners, turning static vector art into a fully interactive digital machine." },
        metrics: { zh: ["data-anim 状态驱动", "全局热键监听注入", "无缝衔接业务状态机"], en: ["data-anim state hooks", "Global shortcut injection", "Seamless state machine hookup"] },
        stageCue: "LENS_INSPECT",
        scriptText: {
          zh: "最后两步挂载交互属性。按下按键时哪根轴转、哪块夹板升起，全通过标准的 data 属性暴露出来，业务代码一行就能接管。",
          en: "The final two steps inject data-anim attributes and keyboard listeners. Every gear, shaft, and slider becomes directly programmable."
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
      zh: "哈希表是分拣格子，布隆过滤器是多孔筛网，互斥锁是铁栓销子 —— 一切算法皆有形。",
      en: "Hash maps are sorting pigeonholes, Bloom filters are multi-mesh sieves, mutexes are hardened locking pins — all code has physical form."
    },
    takeaway: {
      zh: "五大经典算法全实物化 · 算法学习从此告别死记硬背",
      en: "Five classic algorithms physically realized · Farewell to rote memorization"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [hash-map] · HASH BUCKET PIGEONHOLE SORTER";
        if (beat === 1) return "OFFICIAL [bloom-filter] · MULTI-LAYER PROBABILISTIC MESH";
        if (beat === 2) return "OFFICIAL [mutex] · LOCKING PIN PIN-TUMBLER ARREST";
        return "OFFICIAL [tcp-handshake] · SYN-ACK TRIPARTITE INTERLOCK";
      }
      if (beat === 0) return "OFFICIAL [hash-map] · 哈希桶分拣料槽与链表抽屉";
      if (beat === 1) return "OFFICIAL [bloom-filter] · 多层概率微孔筛网";
      if (beat === 2) return "OFFICIAL [mutex] · 淬火闭锁插销与防并发掣动";
      return "OFFICIAL [tcp-handshake] · 三次握手安全联锁连杆";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 哈希分拣", en: "00s · Hash Map Bucket" },
        headline: { zh: "哈希桶化为并排料槽，哈希冲突化身拉链抽屉", en: "Hash buckets become sorting hoppers; collisions expand into pull-out drawers" },
        detail: { zh: "哈希值如同滑槽分拣器，将数据球精准投掷到对应储物格；一旦冲突，格子底部弹出垂直拉链链表。", en: "Hash codes act like mechanical diverters, routing data balls into slots; collisions expand downwards as chained drawers." },
        metrics: { zh: ["分拣滑槽准确定位", "O(1) 机械寻址", "拉链法抽屉展开"], en: ["Diverter sorting guide", "O(1) mechanical retrieval", "Collision drawer unfolding"] },
        stageCue: "HASH_BUCKET",
        scriptText: {
          zh: "哈希表怎么画？在 Anatomy 看来，它就是一排整齐的精密物料槽。哈希函数是分拣导轨，把进来的零件按槽位分流，遇到冲突就向下接出拉链式储物斗。",
          en: "How do you render a hash map? In Anatomy, it is an array of precision parts bins. Hash functions act as diverter tracks, dropping items into buckets."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 布隆筛网", en: "10s · Bloom Filter Sieve" },
        headline: { zh: "三重偏斜筛网：误判可能存在，绝对没有漏判", en: "Triple angled sieves: False positives possible, false negatives impossible" },
        detail: { zh: "多重哈希函数化为三个不同角度的精密滤孔，只有全部透过的才可能命中，堵在网上的绝对未被记录。", en: "Multiple hash functions turn into three angled laser meshes. Anything blocked is definitely absent; what passes might be present." },
        metrics: { zh: ["三重对角滤波孔径", "零假阴性物理保证", "位图微型挡板翻转"], en: ["Triple angled apertures", "Zero false-negative guarantee", "Bitmap shutter toggles"] },
        stageCue: "BLOOM_SIEVE",
        scriptText: {
          zh: "布隆过滤器更绝，直接做成了三道交错的金属筛网。滚珠只要被任何一张网挡住，百分之百不存在；掉到底部的，大概率存在。",
          en: "Bloom filters become three cascading metal sieves. If a marble is stopped by any sieve, it is 100% absent. If it drops through, it likely exists."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 互斥闭锁", en: "20s · Mutex Deadbolt" },
        headline: { zh: "气动锁舌重重落下，临界区独占一目了然", en: "Pneumatic deadbolt slams down: Critical section exclusivity is obvious" },
        detail: { zh: "线程竞争化为两条冲向同一加工工位的滑轨，第一辆车就位瞬间气动锁销插死通道，后车必须原地等待排空。", en: "Thread contention is two carriages racing for one workstation. The first car trips a pneumatic bolt, locking out competitors." },
        metrics: { zh: ["高强度气动锁插销", "毫秒级临界区独占", "等待队列物理阻挡"], en: ["High-strength pneumatic bolt", "Millisecond exclusive lock", "Physical wait queue stop"] },
        stageCue: "MUTEX_BOLT",
        scriptText: {
          zh: "互斥锁就是机床上的气动锁销。一个工件滑进工位，咔嗒一声，钢销插死，第二辆车被硬生生卡在阻挡器前面，直到第一个工件加工完毕释放锁销。",
          en: "A mutex is a pneumatic deadbolt. When a workpiece rolls in, a steel bolt snaps shut, holding the second workpiece at bay until released."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 三次握手", en: "30s · Three-Way Handshake" },
        headline: { zh: "SYN、ACK 转化为三道机械联锁棘爪啮合", en: "SYN and ACK turn into three interlocking mechanical security pawls" },
        detail: { zh: "客户端与服务端化为两台相邻的联锁装置，三个按键依序推下连杆，三重保险销依次落锁，通道建立。", en: "Client and server act as two interlocked consoles: three linkages push forward, engaging safety pawls sequentially to seal the circuit." },
        metrics: { zh: ["双向通信通道互验", "三级联动机械安全销", "全双工信道接通"], en: ["Bidirectional channel verification", "3-stage safety pin linkage", "Full-duplex channel engaged"] },
        stageCue: "TCP_HANDSHAKE",
        scriptText: {
          zh: "还有 TCP 三次握手，成了两台操作台之间的三道机械连杆。推过去一根、回传一根、再锁死一根，全双工数据信道当场贯通。",
          en: "TCP's 3-way handshake becomes three mechanical linkages between control consoles: send, ack, verify, locking the circuit open."
        }
      }
    ]
  },
  {
    id: "ch08",
    index: 7,
    number: "08",
    title: { zh: "两台大机器", en: "Two Heavyweight Machines" },
    subtitle: { zh: "OFFICIAL FIGURES: TURBOFAN · REACTOR · AFTERBURNER", en: "Official Figures: Turbofan · Nuclear Reactor · Afterburner" },
    duration: 40,
    stageType: "official-pkg",
    machineKey: "turbofan",
    thesis: {
      zh: "不仅能做微观算法，Anatomy 同样能驾驭双转子涡扇引擎与核反应堆这种顶级工业重器。",
      en: "Beyond microscopic algorithms, Anatomy masters apex industrial giants like twin-spool turbofans and nuclear reactors."
    },
    takeaway: {
      zh: "双转子涡扇与核反应堆 · 工业级复杂度极限施压验证",
      en: "Turbofan and nuclear reactor · Stress-testing complexity at industrial scales"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [turbofan] · TWIN-SPOOL JET ENGINE · 300 KN THRUST";
        if (beat === 1) return "OFFICIAL [reactor] · PRESSURIZED WATER REACTOR";
        if (beat === 2) return "OFFICIAL [afterburner] · MACH 2 SUPERSONIC REHEAT · 300 KN THRUST";
        return "HEAVY MACHINES · ZERO DIAGRAM ABSTRACTION";
      }
      if (beat === 0) return "OFFICIAL [turbofan] · 双转子涡扇喷气引擎 · 300 kN 推力";
      if (beat === 1) return "OFFICIAL [reactor] · 压水堆压力容器与控制棒组";
      if (beat === 2) return "OFFICIAL [afterburner] · 2马赫超音速加力燃烧室 · 300 kN 推力";
      return "重型机械 · 拒绝示意图抽象";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 航空涡扇", en: "00s · Turbofan Engine" },
        headline: { zh: "高低压双轴嵌套逆转，300kN 推力真实喷涌", en: "Concentric high/low pressure shafts counter-rotate, delivering 300kN thrust" },
        detail: { zh: "大涵道比前风扇低速运转，高压压气机与燃烧室高速尖啸，双同心轴以不同转速驱动，推力喷管动态收放。", en: "High-bypass front fan spins at low rpm while high-pressure core screams at high rpm on concentric dual shafts." },
        metrics: { zh: ["高低压双转子同心轴", "大涵道比气流分流", "300 kN 额定推力输出"], en: ["High/low pressure concentric shafts", "High-bypass air split", "300 kN rated thrust output"] },
        stageCue: "TURBOFAN_CORE",
        scriptText: {
          zh: "如果你觉得画算法只是小打小闹，来看看这两台大机器。第一台：航空涡扇喷气发动机。这是现代工程学的皇冠。",
          en: "If you think algorithms are small toys, look at these heavy giants. First: an aerospace turbofan engine — the crown jewel of engineering."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 反应堆芯", en: "10s · Reactor Core" },
        headline: { zh: "压水堆控制棒升降，核燃料棒切口工况全显", en: "PWR control rods elevate, revealing fuel assembly cutaway thermodynamics" },
        detail: { zh: "重型压力容器侧向剖切，银白色锆合金包壳与十字形控制棒束平稳升降，主冷却剂循环泵低频运转。", en: "Heavy pressure vessel cutaway exposes zirconium alloy fuel claddings, cruciform control rods, and coolant loops." },
        metrics: { zh: ["锆合金燃料组件", "银铟镉控制棒升降", "压水堆一回路稳压"], en: ["Zircaloy fuel assemblies", "Control rod drive mechanism", "Primary coolant loop balance"] },
        stageCue: "REACTOR_RODS",
        scriptText: {
          zh: "第二台是压水堆核反应堆。整台机器切掉四分之一，露出堆芯里的燃料棒和十字控制棒。你可以通过按键调节控制棒的插入深度。",
          en: "Second: a pressurized water reactor. Sliced by a quarter quadrant, exposing fuel assemblies and control rods you can adjust via keys."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 加力全开", en: "20s · Afterburner Reheat" },
        headline: { zh: "双环燃油喷管点火，超音速尾喷口急剧扩张", en: "Dual fuel spray rings ignite, supersonic convergent-divergent nozzle expands" },
        detail: { zh: "按下空格键激活加力燃烧室，环形喷油圈喷出雾化航空煤油，尾喷口鱼鳞调节板向外扩张，模拟 300 kN 极限过载推力。", en: "Press Space to kick the afterburner: fuel rings vaporize kerosene, iris flaps expand, simulating 300 kN extreme overload thrust." },
        metrics: { zh: ["鱼鳞状可调收扩喷口", "环状加力喷油圈", "300 kN 极限过载推力"], en: ["Iris convergent-divergent nozzle", "Dual afterburner spray rings", "300 kN maximum overload thrust"] },
        stageCue: "AFTERBURNER_FIRE",
        scriptText: {
          zh: "按一下空格，加力燃烧室点火，尾喷口的钛合金收扩片瞬间张开，火焰从喷口喷涌而出，整台发动机在等轴测视角下轰鸣震颤。",
          en: "Tap Space to ignite the afterburner. Titanium nozzle flaps expand outward, flames surge, and the engine shakes in isometric perspective."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 复杂性突破", en: "30s · Complexity Mastery" },
        headline: { zh: "超越传统示意图，达到工程级真实度标准", en: "Surpassing traditional diagrams to reach genuine engineering-grade fidelity" },
        detail: { zh: "几百个精密配合零件，无一人工在 CAD 软件里建模，全部由 Claude 解析物理公式后纯代码直接生成。", en: "Hundreds of interlocking parts, zero CAD drafting, purely synthesized from physics formulas by Claude directly into code." },
        metrics: { zh: ["纯代码生成几百个零件", "工程力学模型支撑", "重塑工程知识传播方式"], en: ["Hundreds of parts from code", "Grounded in engineering physics", "Redefining technical education"] },
        stageCue: "HEAVY_RUN",
        scriptText: {
          zh: "这证明了什么？证明了由大语言模型驱动的代码生成，已经有能力完成具备真实机械逻辑的工业级重型装备建模。",
          en: "What does this prove? It proves LLM code synthesis can autonomously construct industrial-grade heavy machinery with kinematic integrity."
        }
      }
    ]
  },
  {
    id: "ch09",
    index: 8,
    number: "09",
    title: { zh: "相机与审计", en: "Camera Perspective and Visual Audit" },
    subtitle: { zh: "OFFICIAL FIGURES: LIT-BY-FACING · EASING · TURBOFAN · THREE-READS", en: "Official Figures: Lit-By-Facing · Easing · Turbofan · Three Reads" },
    duration: 40,
    stageType: "official-pkg",
    machineKey: "lit-by-facing",
    thesis: {
      zh: "AI 会画错，但通过多重视角相机审计与法线光照检查，错误在提交前被全部绞杀。",
      en: "AI makes mistakes, but multi-camera audits and surface-normal checks snuff them out before delivery."
    },
    takeaway: {
      zh: "全方位镜头审计 · 法线与投影双重校准规避穿模",
      en: "Omni-directional camera audit · Normal vectors & projections prevent clipping"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [lit-by-facing] · SURFACE-NORMAL ILLUMINATION AUDIT";
        if (beat === 1) return "OFFICIAL [easing] · CUBIC-BEZIER ACCELERATION CAM CURVES";
        if (beat === 2) return "OFFICIAL [turbofan] · 360-DEGREE CAMERA ORBITAL AUDIT";
        return "OFFICIAL [three-reads] · TRIPLE-RENDER RECONCILIATION";
      }
      if (beat === 0) return "OFFICIAL [lit-by-facing] · 面法线矢量光照审计";
      if (beat === 1) return "OFFICIAL [easing] · 三次贝塞尔缓动凸轮曲线";
      if (beat === 2) return "OFFICIAL [turbofan] · 360度相机轨道漫游审计";
      return "OFFICIAL [three-reads] · 三重渲染一致性交叉核对";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 法线检查", en: "00s · Normal Check" },
        headline: { zh: "面法线着色审计：一眼揪出破面与翻面错误", en: "Surface-normal shading audit catches broken and flipped faces instantly" },
        detail: { zh: "通过给每个多边形的面法向赋予绝对基准色，朝向错误的逆法线多边形在着色器检查模式下无所遁形。", en: "Assigning base hues to face normals makes inverted polygons stand out unmistakably during shader audit modes." },
        metrics: { zh: ["法向绝对矢量着色", "翻面破面实时报警", "光照模型数学自洽"], en: ["Absolute vector normal shading", "Inverted face alert", "Self-consistent lighting math"] },
        stageCue: "NORMAL_CHECK",
        scriptText: {
          zh: "有人会问：AI 画机器难道不会画穿模、画歪吗？当然会。但 Anatomy 有一套严密的自审机制，第一步就是面法线光照审计。",
          en: "People ask: Doesn't AI draw clipping parts and distorted angles? Of course it can. But Anatomy runs a strict self-audit using normal shaders."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 缓动曲线", en: "10s · Easing Curves" },
        headline: { zh: "三次贝塞尔凸轮曲线，消除机械生硬感", en: "Cubic-bezier cam curves eliminate mechanical rigidity and synthetic stiffness" },
        detail: { zh: "拒绝匀速直线运动，所有加速度均被映射到三次贝塞尔弹簧缓动曲线上，完美还原物理机件的惯性启动与阻尼刹车。", en: "Forbids uniform linear motion; all accelerations map to cubic-bezier spring curves, capturing physical inertia and damped stops." },
        metrics: { zh: ["Cubic-Bezier 动力学曲线", "质量惯性物理模拟", "末端回弹阻尼微动"], en: ["Cubic-bezier dynamics", "Mass inertia simulation", "Terminal spring rebound damping"] },
        stageCue: "EASING_CURVE",
        scriptText: {
          zh: "第二是动态审计。机械运动绝不能是死板的匀速。启动时要吃质量惯性，制动时要有阻尼回弹，曲线全部用三次贝塞尔严格约束。",
          en: "Second is kinematic audit. Real parts never move at dead constant speeds. They overcome inertia when starting and rebound with damping when stopping."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 轨道漫游", en: "20s · Orbit Inspection" },
        headline: { zh: "多角度虚拟相机漫游，消除视角盲区破绽", en: "Multi-angle virtual camera traversal eradicates blind spot glitches" },
        detail: { zh: "虚拟相机绕机器进行三维轨道漫游，检查不同缩放与旋转角度下的遮挡关系与图层层叠顺序 (Z-Index)。", en: "Virtual camera orbits the assembly, validating occlusion relationships and SVG DOM z-index stacking from every viewpoint." },
        metrics: { zh: ["全轨道视角遍历", "图层 Z-Index 遮挡核查", "无死角视觉自洽"], en: ["Full orbital viewpoint traversal", "DOM z-index occlusion audit", "360-degree visual consistency"] },
        stageCue: "ORBIT_CAM",
        scriptText: {
          zh: "第三是相机巡检。Anatomy 让虚拟相机绕着刚建好的机器转一圈，检查在不同角度下零件有没有穿帮，图层的遮挡关系是否绝对正确。",
          en: "Third is camera inspection. Anatomy sweeps a virtual camera around the machine to verify part occlusions and layering from all angles."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 三重校核", en: "30s · Triple Check" },
        headline: { zh: "代码、几何、视觉三重闭环，保障成品交付", en: "Code, geometry, and optics form a triple closed loop for flawless delivery" },
        detail: { zh: "代码层做类型校验，几何层做公差干涉运算，视觉层做无头浏览器截图比对，三重保险确保零低级缺陷。", en: "TypeScript types at the code level, collision checks at the geometry level, headless rendering at the optics level." },
        metrics: { zh: ["TypeScript 静态断言", "无头浏览器截图比对", "零人工修图交付"], en: ["TypeScript static assertions", "Headless browser visual diff", "Zero manual retouching"] },
        stageCue: "AUDIT_PASS",
        scriptText: {
          zh: "经过类型检查、物理干涉计算、再加上图像比对这三重闭环，AI 自己造的机器，甚至比许多人类手绘的图表还要精准可靠。",
          en: "Combining type checks, collision calculations, and headless rendering audits, AI machines achieve fidelity rivaling human master drafters."
        }
      }
    ]
  },
  {
    id: "ch10",
    index: 9,
    number: "10",
    title: { zh: "一群 AI 互相挑错", en: "Multi-AI Adversarial Review" },
    subtitle: { zh: "OFFICIAL FIGURES: MARK-SWEEP · FOUR-FRAMES · TURBOFAN · FROSTED-COPY", en: "Official Figures: Mark & Sweep · Four Frames · Turbofan · Frosted Copy" },
    duration: 40,
    stageType: "official-pkg",
    machineKey: "mark-sweep",
    thesis: {
      zh: "设计者、工程师与质检员：三个 AI 子代理在流水线上展开激烈的对抗性博弈。",
      en: "Architect, Engineer, and Inspector: Three AI subagents engage in fierce adversarial games on the pipeline."
    },
    takeaway: {
      zh: "多代理对抗质检 · 终结大模型‘自吹自擂’的幻觉怪圈",
      en: "Multi-agent adversarial review · Breaks LLM self-congratulatory hallucinations"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [mark-sweep] · GARBAGE COLLECTION MARK-SWEEP SENTRY";
        if (beat === 1) return "OFFICIAL [four-frames] · ADVERSARIAL MULTI-STAGE ARTIFACT AUDIT";
        if (beat === 2) return "OFFICIAL [turbofan] · PEER REVIEW STRESS COLLISION BENCH";
        return "OFFICIAL [frosted-copy] · FROSTED GLASS TRANSLUCENCY COMPARATOR";
      }
      if (beat === 0) return "OFFICIAL [mark-sweep] · 标记清除垃圾回收岗哨";
      if (beat === 1) return "OFFICIAL [four-frames] · 对抗性多工位阶段制品审查";
      if (beat === 2) return "OFFICIAL [turbofan] · 同行评审碰撞干涉极限压测";
      return "OFFICIAL [frosted-copy] · 毛玻璃半透光干涉比对器";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 垃圾回收", en: "00s · Garbage Collection" },
        headline: { zh: "垃圾回收岗哨：清除冗余废料与脱靶机件", en: "Garbage collection sentry: Clears orphaned elements and detached geometry" },
        detail: { zh: "如同一套高效的 Mark-Sweep 机制，实时标记未被传动链关联的孤立零件，并将其自动移出 DOM 渲染树。", en: "Acts as a live Mark-Sweep pass, tagging isolated parts unlinked from drive chains and purging them from the DOM tree." },
        metrics: { zh: ["孤立节点实时扫描", "无用 DOM 元素彻底清除", "保障渲染 60 FPS"], en: ["Orphan node live scan", "Dead DOM element purge", "Sustained 60 FPS delivery"] },
        stageCue: "GC_SWEEP",
        scriptText: {
          zh: "单个 AI 生成很容易自嗨。Anatomy 的精髓在于它不是一个 AI 在干活，而是一群 AI 扮演不同角色在工位上互相挑错。",
          en: "A single AI easily traps itself in self-satisfaction. Anatomy's true power lies in multiple agents playing distinct roles to critique each other."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 四幕审查", en: "10s · Four Frames" },
        headline: { zh: "四幕制品严密对比：几何、传动、材质与手感", en: "Four-frame scrutiny: Geometry, kinematics, material textures, and tactile response" },
        detail: { zh: "质检 AI 将生成物按四幕拆开：基础拓扑是否合规、传动链条是否断裂、金属高光是否自然、交互事件是否灵敏。", en: "The Inspector AI decomposes artifacts across four panels: base topology, kinematic continuity, specular highlights, and touch feedback." },
        metrics: { zh: ["四幕独立评审看板", "一票否决重绘机制", "各司其职专业分工"], en: ["4-frame independent review", "Veto and redraw mechanism", "Specialized agent division"] },
        stageCue: "FOUR_FRAMES_REVIEW",
        scriptText: {
          zh: "第一个 AI 负责画结构，第二个工程师 AI 负责查传动，第三个挑刺质检 AI 拿着放大镜查穿模。发现一处错误，直接驳回重做。",
          en: "Agent 1 drafts geometry, Agent 2 validates kinematics, and Agent 3 audits collisions with a magnifying glass. One failure triggers an instant redraw."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 极限压测", en: "20s · Extreme Stress" },
        headline: { zh: "高转速高负载极限压测，验证零件刚体边界", en: "High-rpm high-load stress testing proves rigid body boundary limits" },
        detail: { zh: "让整台设备在 10 倍速极速运转，检测关键传动节点在极端边界值下是否发生数值溢出或坐标抖动破裂。", en: "Spins assemblies at 10x overdrive to check whether linkage joints suffer numeric overflow or coordinate jitter under extreme limits." },
        metrics: { zh: ["10× 超速压力测试", "数值精度溢出检测", "极端边界刚体防抖"], en: ["10x overdrive stress test", "Floating point overflow catch", "Extreme limit jitter stabilization"] },
        stageCue: "STRESS_TEST",
        scriptText: {
          zh: "不仅要静态看，质检 AI 还会给机器加上十倍速狂转，看看在最极端的极限速度下，齿轮会不会卡死，数值计算会不会浮点溢出。",
          en: "Static checks are not enough. The Inspector spins the machine at 10x speed to verify no teeth lock up and floating-point errors stay zero."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 品质收敛", en: "30s · Quality Convergence" },
        headline: { zh: "经过多轮对抗博弈，最终淬炼出无懈可击的精品", en: "Adversarial games converge toward bulletproof engineering perfection" },
        detail: { zh: "正是这套严密的代理间博弈协议，使得即使在零人工干预的情况下，产出的机件依然具备殿堂级的艺术与工业品质。", en: "This adversarial consensus loop enables zero-human-input pipelines to reliably craft museum-grade engineering artwork." },
        metrics: { zh: ["零人工审查通过率", "多代理博弈收敛", "殿堂级工业品味"], en: ["Autonomous pass rate", "Multi-agent game convergence", "Museum-grade industrial aesthetic"] },
        stageCue: "FROSTED_PASS",
        scriptText: {
          zh: "这种多 AI 对抗协议彻底终结了大模型的‘自吹自擂’。最后端到你面前的作品，是经过严苛内部质检对抗后的顶级结晶。",
          en: "This adversarial protocol eradicates LLM hallucinations. The output presented to you is forged through rigorous internal trials."
        }
      }
    ]
  },
  {
    id: "ch11",
    index: 10,
    number: "11",
    title: { zh: "时间的真相", en: "The Truth of Time" },
    subtitle: { zh: "OFFICIAL FIGURES: WATCH · SEASONS · POWER-STATION · TURBOFAN", en: "Official Figures: Watch · Seasons · Power Station · Turbofan" },
    duration: 40,
    stageType: "official-pkg",
    machineKey: "watch",
    thesis: {
      zh: "时间不是均匀流逝的标量，在机械世界里，时间是被齿轮齿距一次次切碎的离散脉冲。",
      en: "Time is not a smooth scalar; in mechanics, time is a stream of discrete pulses sliced tooth by tooth."
    },
    takeaway: {
      zh: "连续流动 vs 离散切分 · 机械世界里对时间本质的深刻审视",
      en: "Continuous flow vs discrete slices · Mechanical introspection on the nature of time"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [watch] · 28,800 BEATS PER HOUR · MECHANICAL QUANTUM";
        if (beat === 1) return "OFFICIAL [seasons] · ORBITAL PRECESSION & AXIAL TILT TIME";
        if (beat === 2) return "OFFICIAL [power-station] · 50HZ GRID PHASE SYNCHRONIZATION";
        return "OFFICIAL [turbofan] · THERMODYNAMIC UNIDIRECTIONAL ENTROPY";
      }
      if (beat === 0) return "OFFICIAL [watch] · 28,800 次/小时 · 机械时间量子";
      if (beat === 1) return "OFFICIAL [seasons] · 轨道进动与地轴倾角时间尺度";
      if (beat === 2) return "OFFICIAL [power-station] · 50Hz 电网相位同步与力矩平衡";
      return "OFFICIAL [turbofan] · 热力学单向不可逆熵增时间箭头";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 离散量子", en: "00s · Discrete Quantum" },
        headline: { zh: "每小时 28,800 次滴答：时间被擒纵叉切成离散颗粒", en: "28,800 ticks per hour: Time sliced into discrete packets by the pallet fork" },
        detail: { zh: "摆轮游丝以 4Hz 高频摆动，每一次释放都是一个不可分割的时间量子，连续时间在此崩解为离散数值。", en: "Balance spring oscillates at 4Hz; every impulse is an indivisible time quantum, discretizing continuous flow." },
        metrics: { zh: ["4Hz / 28,800 vph 频率", "0.125 秒时间微颗粒", "机械离散化哲学"], en: ["4Hz / 28,800 vph frequency", "0.125s discrete time grain", "Mechanical discretization"] },
        stageCue: "WATCH_QUANTUM",
        scriptText: {
          zh: "我们总觉得时间像流水一样平滑。但机械表告诉你：时间不是流动的，时间是被切碎的。一秒钟被擒纵叉咔嗒咔嗒切成八瓣。",
          en: "We perceive time as a smooth river. But the watch caliber proves otherwise: time is chopped into discrete packets, 8 beats per second."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 天文循环", en: "10s · Astronomical Scale" },
        headline: { zh: "地轴倾角与日晷轨迹：宏观尺度下的周期律动", en: "Axial tilt and solar shadow arcs: Periodic cycles on astronomical scales" },
        detail: { zh: "从微观齿轮跳跃到地球公转黄道平面，齿轮比化作 365 天四季轮回，时间从微观离散扩展为宏观天文周期。", en: "Leaping from watch escapements to orbital ecliptics, gear trains convert into 365-day seasonal rhythms." },
        metrics: { zh: ["23.5° 地轴黄赤交角", "四季昼夜光影演进", "宏观与微观时间呼应"], en: ["23.5° axial obliquity", "Seasonal diurnal lighting", "Micro/macro temporal harmony"] },
        stageCue: "SEASONS_YEAR",
        scriptText: {
          zh: "放大到第二台机器，地球公转与四季变化。齿轮比变成了三百六十五比一，时间的颗粒度从八分之一秒被拉长到整整一年的季节律动。",
          en: "Zoom out to our second machine: orbital seasons. Gear ratios shift to 365 to 1, stretching granular eighth-seconds into whole annual seasons."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 电网相位", en: "20s · Grid Phase Sync" },
        headline: { zh: "50Hz 电网同步：全网千万台发电机绝对同相运转", en: "50Hz grid sync: Tens of thousands of turbines running in absolute lockstep" },
        detail: { zh: "发电机转子旋转频率必须与整个大陆电网的交流电相位维持微秒级对齐，任何时差都会引发剧烈机电震荡。", en: "Generator rotors must stay phase-aligned with continental grids to microsecond accuracy to avert massive electromechanical swings." },
        metrics: { zh: ["50Hz 严格工频电网", "微秒级相位同步锁定", "力矩平衡稳定器"], en: ["50Hz strict grid frequency", "Microsecond phase alignment", "Torque balance stabilizer"] },
        stageCue: "GRID_SYNC",
        scriptText: {
          zh: "再看电网。全国成千上万台巨型汽轮机，每秒钟必须严格旋转五十圈，相位相差微秒级就会烧毁电网。这是人类用钢铁铸造的统一时间场。",
          en: "Consider the electrical grid: thousands of massive turbines revolving 50 times per second, phase-locked to microseconds."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 熵增之箭", en: "30s · Arrow of Entropy" },
        headline: { zh: "单向喷涌的热力学之箭，标记着时间的不可逆性", en: "The unidirectional thermodynamic plume marks time's irreversible arrow" },
        detail: { zh: "涡扇发动机喷出的熊熊烈焰展现了热力学第二定律：燃料燃烧转化为推力与废热，时间只能单向向前，绝无回头可能。", en: "Turbofan plumes illustrate the second law of thermodynamics: fuel expands into thrust and entropy. Time flows strictly forward." },
        metrics: { zh: ["热力学第二定律不可逆", "单向膨胀燃烧做功", "物理时间的终极注脚"], en: ["Second law irreversibility", "Unidirectional expansion", "Ultimate physical footnote"] },
        stageCue: "ENTROPY_FLAME",
        scriptText: {
          zh: "最后在涡扇发动机的喷火口上，燃料燃烧膨胀，熵增不可逆转。Anatomy 用四台机器，把人类历史上对时间的所有理解，全部变成了可触碰的机械现实。",
          en: "Finally, at the jet nozzle, fuel combusts and entropy climbs irreversibly. Across four machines, Anatomy turns humanity's conception of time into reality."
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
      zh: "“这不就是画画吗？” —— 不，它不是绘画，是用高阶几何与数学严密推导出的机械工程系统。",
      en: "“Isn't this just illustrations?” — No, it is a mechanical engineering system deduced from high-order geometry and mathematics."
    },
    takeaway: {
      zh: "不是插画，是机械工程规范 · 严谨几何学打破刻板印象",
      en: "Not illustrations, but mechanical specs · Rigorous geometry shatters stereotypes"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [box-model] · CSS BOX MODEL AS HARDWARE ENCLOSURE";
        if (beat === 1) return "OFFICIAL [spot-plate] · MATRIX DRILL-HOLE JIG FIXTURE";
        if (beat === 2) return "OFFICIAL [bevel-offset] · 45-DEGREE BEVEL CHAMFER TOOLPATH";
        return "OFFICIAL [shared-canvas] · MULTI-LAYER COMPOSITING BACKPLANE";
      }
      if (beat === 0) return "OFFICIAL [box-model] · 实体机箱化 CSS 盒模型";
      if (beat === 1) return "OFFICIAL [spot-plate] · 矩阵定位钻孔工装夹具";
      if (beat === 2) return "OFFICIAL [bevel-offset] · 45度精密倒角仿形刀路";
      return "OFFICIAL [shared-canvas] · 多层复合总线背板架构";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 实体盒模", en: "00s · Physical Box Model" },
        headline: { zh: "CSS 盒模型变身铸铝机箱：外边距就是安装间隙", en: "CSS box model reimagined as cast chassis: Margins become clearance gaps" },
        detail: { zh: "Margin 是底座安全螺栓间距，Padding 是内部减震垫层，Content 是主板核心芯片，前端概念全部实物化。", en: "Margin becomes bolt clearance, padding becomes vibration dampers, content becomes the central processing die." },
        metrics: { zh: ["Margin 安装螺栓间距", "Padding 内部避震间距", "Border 实心铸铝机箱壁"], en: ["Margin bolt clearance", "Padding damper spacing", "Border cast aluminum wall"] },
        stageCue: "BOX_CHASSIS",
        scriptText: {
          zh: "有人说：Anatomy 不就是让 AI 画几张漂亮的插画吗？这是对它最大的误读。看这个 CSS 盒模型，它不是画出来的，它是一座实实在在的铸铝机箱。",
          en: "Some claim: Isn't Anatomy just AI drawing pretty illustrations? That is the biggest misconception. Look at this CSS box model — it is a CNC-milled chassis."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 工装夹具", en: "10s · Jig Fixture" },
        headline: { zh: "点阵夹具板：每一个安装孔位都有绝对坐标约束", en: "Matrix spot plate: Every mounting hole is governed by absolute coordinates" },
        detail: { zh: "绝非画家随性涂鸦，所有构件固定在标准 20mm 间距工装夹具底板上，每个孔位坐标由代数方程精确导出。", en: "No artistic improvisation: every component mounts onto a 20mm grid fixture plate driven by analytic geometry formulas." },
        metrics: { zh: ["20mm 标准模数阵列", "数控机床定位基准", "严格对齐无公差积累"], en: ["20mm modular grid array", "CNC coordinate origin", "Zero cumulative tolerance drift"] },
        stageCue: "SPOT_PLATE_JIG",
        scriptText: {
          zh: "所有机件安装在带有标准化螺孔的工装夹具板上。孔距、沉头螺钉深度、板材厚度，全部是机加工工程图纸的标准规范。",
          en: "All parts mount on jig plates with standard threaded holes. Hole pitch, countersink depth, plate thickness meet machine-shop blueprints."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 精密倒角", en: "20s · Chamfer Toolpath" },
        headline: { zh: "45度精密斜切倒角：高光修饰源自真实数控刀路", en: "45-degree chamfers: Specular rim lights traced directly from CNC cutter paths" },
        detail: { zh: "边缘那一抹细腻的金属高光，不是手绘渐变色，而是按照 45° 倒角铣刀刀具路径算出的法线反光带。", en: "That delicate rim highlight along the edge is not painted shading; it is calculated specular reflection off a 45-degree chamfer toolpath." },
        metrics: { zh: ["45° 数控铣刀刀路", "法线连续高光计算", "彻底剔除纸片感"], en: ["45° CNC milling toolpath", "Continuous normal specular line", "Eliminates flat paper feel"] },
        stageCue: "BEVEL_CUTTER",
        scriptText: {
          zh: "机壳边缘那道反射高光，在数学上是一条经过四十五度倒角刀切削后的连续法线反射带。这不是绘画，这是计算机辅助制造级别的几何运算。",
          en: "That specular highlight along the edge is mathematically derived from a 45-degree chamfer cutter path. This is CAD-grade geometric deduction."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 工程尊严", en: "30s · Engineering Dignity" },
        headline: { zh: "给数字世界注入物理实体的重量感与工程尊严", en: "Injecting physical weight and engineering dignity into the digital world" },
        detail: { zh: "把虚无缥缈的代码和无趣的方块图，转化为有质量、有扭矩、有温度的机械实体，这是技术的浪漫，也是工程的尊严。", en: "Transforming ephemeral code and boring wireframes into weighted, torqued, living machines: the romance of engineering." },
        metrics: { zh: ["赋予纯数字以物理实体", "打破二维抽象隔阂", "极致工程工程美学"], en: ["Physicalizing the digital", "Overcomes 2D abstract silos", "Apex engineering aesthetic"] },
        stageCue: "CANVAS_DONE",
        scriptText: {
          zh: "它把原本冰冷虚无的软件逻辑，变成了一个个沉甸甸、摸得着、看得懂的机械实体。这才是 Anatomy 真正撼动人心的力量所在。",
          en: "It turns cold, formless software logic into heavy, tactile, comprehensible mechanical engines. That is the true heart of Anatomy."
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
      zh: "开源 6 天突破 8,200 Stars：全球开发者自发用最具创意的交互算法为它投下信任票。",
      en: "Over 8,200 stars in 6 days: Global developers cast their votes with creative interactive algorithms."
    },
    takeaway: {
      zh: "开源 6 天 8,200+ Stars · 社区创意井喷见证范式转移",
      en: "8,200+ Stars in 6 days · Community explosion validates paradigm shift"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [debounce] · SPRING-LOADED DELAY TRIGGER TRAP";
        if (beat === 1) return "OFFICIAL [merge-sort] · DUAL-TRACK DIVIDE & CONQUER SIFTER";
        if (beat === 2) return "OFFICIAL [gradient-descent] · BALLISTIC LOSS SURFACE OSCILLATOR";
        return "OFFICIAL [flex-grow] · HYDRAULIC ACCORDION PROPORTIONAL EXPANSION";
      }
      if (beat === 0) return "OFFICIAL [debounce] · 弹簧阻尼延时防抖绊发锁";
      if (beat === 1) return "OFFICIAL [merge-sort] · 双轨分治归并排序筛分机";
      if (beat === 2) return "OFFICIAL [gradient-descent] · 损失曲面滚珠梯度下降寻优";
      return "OFFICIAL [flex-grow] · 液压风琴伸缩空间等比扩张";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 防抖阻尼", en: "00s · Debounce Damper" },
        headline: { zh: "防抖函数化为弹簧连杆，连续冲击归一化", en: "Debounce turns into a spring-damped linkage, buffering chaotic pulses" },
        detail: { zh: "频繁敲击被气缸阻尼器吸收，只有当撞击暂停指定毫秒后，后级绊发机构才释放一次有效动作。", en: "Rapid hammer strikes are absorbed by a dashpot damper; only when strikes pause does the trip lever release one action." },
        metrics: { zh: ["气缸阻尼缓冲撞击", "可调毫秒防抖窗口", "单次有效触发保障"], en: ["Dashpot impact damper", "Adjustable ms debounce window", "Single clean trigger release"] },
        stageCue: "DEBOUNCE_DAMP",
        scriptText: {
          zh: "开源六天，GitHub 突破八千二百星。社区不仅狂赞，还自发造出了海量惊人的机器。比如这个前端防抖函数，被做成了一个带阻尼气缸的机械绊马索。",
          en: "8,200 stars in six days. The community not only cheered, but spontaneously built incredible machines. Like this frontend debounce mechanism with a dashpot damper."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 归并分拣", en: "10s · Merge Sort" },
        headline: { zh: "归并排序：双轨滚珠按大小自动交替咬合", en: "Merge sort: Dual-track marbles mesh alternately by size automatically" },
        detail: { zh: "左右两条输送带分别带着有序滚珠到达交叉口，两枚机械触须实时比较尺寸，小球先落入主通道。", en: "Two feeder tracks deliver sorted marbles to an intersection; dual feelers compare sizes in real time, dropping smaller balls first." },
        metrics: { zh: ["分治交汇机械传感器", "大小球尺寸即时分流", "O(N log N) 物理流水线"], en: ["Divide-and-conquer sensor", "Instant size-based diversion", "Physical O(N log N) pipeline"] },
        stageCue: "MERGE_TRACK",
        scriptText: {
          zh: "归并排序被做成两条交错的履带，两个小球在路口碰头，机械天平一翘，小的先滑过去，大的留在原地等下一轮，读者三秒就懂了分治法。",
          en: "Merge sort became two crossing tracks where marbles meet at a gate: the lighter rolls forward, the heavier waits — divide and conquer understood in 3 seconds."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 梯度下降", en: "20s · Gradient Descent" },
        headline: { zh: "小球在损失曲面凹坑滚动，学习率即重力加速度", en: "A marble rolls on a loss surface: Learning rate equals gravity acceleration" },
        detail: { zh: "起伏的三维金属凹陷曲面就是高维损失函数，小球从山峰沿最陡峭下坡滚动，精准落入全局极小值鞍点。", en: "A contoured 3D metal bowl embodies the loss surface; a rolling marble follows the steepest descent right into the global minimum." },
        metrics: { zh: ["三维金属抛物面曲面", "学习率重力矢量可调", "鞍点振荡与动量收敛"], en: ["3D contoured parabolic bowl", "Adjustable gravity vector", "Saddle oscillation & momentum"] },
        stageCue: "GRADIENT_BOWL",
        scriptText: {
          zh: "甚至还有机器学习的梯度下降！做成一个带有微弱阻尼的曲面金属碗。小球在碗里滚，学习率太大就冲出碗口，学习率合适就稳稳停在碗底最低点。",
          en: "Even machine learning gradient descent! Rendered as a damped metal bowl. Too large a learning rate jumps out; the right rate nests in the minimum."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 弹性伸缩", en: "30s · Flex Grow" },
        headline: { zh: "Flex 伸缩风琴箱：剩余空间等比例液压舒展", en: "Flex accordion: Residual space expands proportionally via hydraulic pistons" },
        detail: { zh: "三个不同比例的金属风琴气箱并排在导轨上，总空间拉大时，连通器液压油同步推动各箱体等比充气扩张。", en: "Three proportional bellows mount on a slide rail; widening total width pumps fluid through equalizers, inflating each box proportionally." },
        metrics: { zh: ["液压连通管等比分流", "风琴箱无损折叠舒展", "直观掌握 Flex 伸缩权重"], en: ["Hydraulic proportional split", "Accordion folding expansion", "Tactile flex factor comprehension"] },
        stageCue: "FLEX_ACCORDION",
        scriptText: {
          zh: "还有 CSS 的 flex-grow，被做成了三个并排的风琴箱。外框一拉开，液压油均等注入，三个箱子按照一比二比一的比例同时扩张，极其治愈。",
          en: "And CSS flex-grow: three accordion bellows side by side. Pull the outer frame, and hydraulic fluid inflates them in 1:2:1 proportion. Pure visual satisfaction."
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
      zh: "高超的美学与工程品味不再是不可名状的天赋，它被固化成了一份可分发的 AI 技能资产。",
      en: "Exquisite taste is no longer an ineffable gift; it has been crystallized into a distributable AI skill bundle."
    },
    takeaway: {
      zh: "品味不是玄学，是工程资产 · 57KB 技能包开启审美工业化",
      en: "Taste is not magic, but an engineering asset · 57KB skill sparks aesthetic industrialization"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [foundry] · MOLTEN CAST IRON INDUCTION CRUCIBLE";
        if (beat === 1) return "OFFICIAL [glass-furnace] · OPTICAL CLEAR QUARTZ FLOAT LEHR";
        if (beat === 2) return "OFFICIAL [forge] · HEAVY HYDRAULIC DIE FORGING PRESS";
        return "OFFICIAL [studio] · INDUSTRIAL DESIGN WORKBENCH CALIBRATION";
      }
      if (beat === 0) return "OFFICIAL [foundry] · 铁水浇铸中频感应坩埚";
      if (beat === 1) return "OFFICIAL [glass-furnace] · 光学石英玻璃浮法退火炉";
      if (beat === 2) return "OFFICIAL [forge] · 重型液压模锻机锻打工位";
      return "OFFICIAL [studio] · 工业设计工作室基准校准台";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 铸铁熔炉", en: "00s · Iron Foundry" },
        headline: { zh: "铁水浇铸坩埚：把对金属质感的极致追求固化为算法", en: "Molten crucible: Crystallizing devotion to metal luster into code" },
        detail: { zh: "倾倒的金黄铁水在铸模中逐渐冷却变暗，凝固为沉稳厚重的哑光铸铁构件，象征着品味的锻造历程。", en: "Molten gold iron pours into sand molds, cooling into matte cast iron, symbolizing the forging of aesthetic taste." },
        metrics: { zh: ["中频感应熔炼炉", "千度铁水流体高光", "深色漫反射物理着色"], en: ["Induction melting crucible", "1000°C liquid iron specular", "Dark matte physical shading"] },
        stageCue: "FOUNDRY_POUR",
        scriptText: {
          zh: "过去大家总觉得，'审美'和'品味'是玄学，只能靠极少数顶级设计师的人肉手绘。但 Anatomy 证明了：品味是可以被精确描述和打包的。",
          en: "We used to think aesthetic taste was an ineffable talent exclusive to elite human designers. Anatomy proves taste can be codified and distributed."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 玻璃退火", en: "10s · Glass Lehr" },
        headline: { zh: "光学石英透镜：通透反射折射，赋予数字界面呼吸感", en: "Quartz lehr: Transparent refraction gives digital interfaces room to breathe" },
        detail: { zh: "高温浮法退火炉生产出澄澈透明的石英玻璃罩，双层菲涅尔反射折射光晕，破除单调纯色块的死板。", en: "A float lehr crafts crystal-clear quartz covers, their dual-layer Fresnel reflections banishing dead monochrome surfaces." },
        metrics: { zh: ["光学级浮法石英玻璃", "双层菲涅尔半透反射", "数字界面的呼吸感"], en: ["Optical-grade quartz glass", "Dual-layer Fresnel reflections", "Breathing digital interface"] },
        stageCue: "GLASS_FURNACE",
        scriptText: {
          zh: "它把什么是好看的倒角、什么是真实的铸铁漫反射、什么是通透的玻璃反光，全部写成了清晰确凿的几何与光照约束规则。",
          en: "What makes a satisfying bevel, how cast iron reflects diffuse light, how quartz refracts photons — all formalized into geometric constraints."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 万吨重锻", en: "20s · Heavy Forge" },
        headline: { zh: "万吨水压机锻造：去除浮夸杂质，保留纯粹工程骨架", en: "Forging press strikes: Hammering away fluff to reveal pure engineering bone" },
        detail: { zh: "重锤千锤百炼砸击红热钢坯，剔除所有不必要的视觉装饰与花哨特效，只留下最直接、最铿锵的物理骨架。", en: "A massive die press strikes glowing billets, stripping decorative fluff to reveal uncompromising structural integrity." },
        metrics: { zh: ["万吨级锻压冲击", "无多余装饰主义", "纯粹功能主义骨骼"], en: ["Ten-thousand-ton impact", "Zero decorative fluff", "Pure functionalist skeleton"] },
        stageCue: "FORGE_HAMMER",
        scriptText: {
          zh: "这份只有五十七 KB 的文件，就像万吨水压机的一记重锤，把所有花里胡哨、不接地气的无用修饰全部砸碎，只留下最硬核的工程骨架。",
          en: "This 57KB file hits like a 10,000-ton hydraulic forging press, smashing decorative noise to expose raw functional skeletal power."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 资产分发", en: "30s · Skill Packaging" },
        headline: { zh: "一份 57KB 文件，让全世界开发者即刻拥有大师级品味", en: "A 57KB file endows developers worldwide with master-class craftsmanship" },
        detail: { zh: "任何普通工程师只需将该技能加载入 Claude，就能秒级产出足以入驻现代艺术馆的高精度交互工程仪器。", en: "Any developer loading this skill into Claude instantly commands the craftsmanship to yield museum-worthy interactive machinery." },
        metrics: { zh: ["57KB 超轻量资产分发", "一人顶一个专业设计团队", "开启工程美学普及化"], en: ["57KB ultra-light distribution", "One person equals a design studio", "Democratizes engineering aesthetics"] },
        stageCue: "STUDIO_EXPORT",
        scriptText: {
          zh: "从此，品味不再是少数人的特权。你只要把它装进 Claude，你写出来的每一个网页、每一份技术说明，都拥有了世界顶级工业设计的灵魂。",
          en: "Taste is no longer an elite privilege. Install it into Claude, and every doc and UI you build inherits the soul of world-class industrial design."
        }
      }
    ]
  },
  {
    id: "ch15",
    index: 14,
    number: "15",
    title: { zh: "接下来看什么", en: "What to Watch Next" },
    subtitle: { zh: "OFFICIAL FIGURES: PUBLIC-KEY · SEASONS · PLASMA-CUTTER · TOKAMAK", en: "Official Figures: Public Key · Seasons · Plasma Cutter · Tokamak" },
    duration: 40,
    stageType: "official-pkg",
    machineKey: "public-key",
    thesis: {
      zh: "Anatomy 只是第一步：当 AI 真正掌握物理世界的机械语法，人机协作的疆界将被彻底改写。",
      en: "Anatomy is merely step one: When AI commands the grammar of the physical world, human-machine symbiosis is rewritten."
    },
    takeaway: {
      zh: "从公钥密码到可控聚变 · 探索人机共生创作的星辰大海",
      en: "From public-key ciphers to fusion reactors · Exploring uncharted frontiers of AI creation"
    },
    readout: (_t, beat, lang = "zh") => {
      if (lang === "en") {
        if (beat === 0) return "OFFICIAL [public-key] · ASYMMETRIC CIPHER MECHANICAL PADLOCK";
        if (beat === 1) return "OFFICIAL [seasons] · ORBITAL LONG-TERM CHRONOMETER";
        if (beat === 2) return "OFFICIAL [plasma-cutter] · CNC TORCH METAL SPARKS CUTTING";
        return "OFFICIAL [tokamak] · MAGNETIC CONFINEMENT FUSION TORUS";
      }
      if (beat === 0) return "OFFICIAL [public-key] · 非对称密码机械密码锁套件";
      if (beat === 1) return "OFFICIAL [seasons] · 轨道长期天象历法日晷";
      if (beat === 2) return "OFFICIAL [plasma-cutter] · 数控等离子弧板材火花切割";
      return "OFFICIAL [tokamak] · 磁约束托卡马克可控核聚变环";
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: { zh: "00s · 非对称锁", en: "00s · Asymmetric Lock" },
        headline: { zh: "公钥与私钥：双槽机械锁具的物理单向陷门", en: "Public & private keys: Dual-chamber lock embodying mathematical one-way trapdoors" },
        detail: { zh: "公钥是任何人都能按下的自锁簧片，私钥则是唯一能拨动内部隐藏滑块反向复位的精密齿形钥匙。", en: "The public key is an open-access spring latch; the private key is the unique bitted tool capable of resetting internal tumblers." },
        metrics: { zh: ["单向自锁机械弹簧", "私钥精密钥匙逆向解锁", "单向陷门函数物理化"], en: ["One-way spring latch", "Precision private key release", "Physical one-way trapdoor"] },
        stageCue: "PUBLIC_KEY_LOCK",
        scriptText: {
          zh: "未来我们还能用它造什么？看，这是非对称加密。公钥是一把任何人都能按下的防盗按扣，私钥则是世界上唯一能对准弹子开锁的齿形钥匙。",
          en: "What else can we build? Behold asymmetric cryptography. The public key is an open snap-lock; the private key is the only key shaped to reset it."
        }
      },
      {
        start: 10,
        end: 20,
        label: { zh: "10s · 宇宙时计", en: "10s · Cosmic Clock" },
        headline: { zh: "万年历日晷：在宇宙尺度下度量知识与文明的沉淀", en: "Millennial solar clock: Measuring the endurance of knowledge and civilization" },
        detail: { zh: "黄铜刻度盘随黄道倾角永恒运转，光影交错间记录着人类文明从结绳记事到硅基智能的跨越式跃迁。", en: "A brass dial tracks the ecliptic, its evolving shadow chronicling humanity's journey from stone marks to silicon intelligence." },
        metrics: { zh: ["黄铜精雕日晷刻度", "地轴黄道长期运转", "文明知识跨尺度沉淀"], en: ["Brass engraved solar dial", "Long-term axial precession", "Civilization scale knowledge"] },
        stageCue: "SEASONS_COSMIC",
        scriptText: {
          zh: "甚至是对宇宙尺度的探索。这台万年历日晷，把天体运行规律与数千年的文明知识，凝聚在一块缓缓旋转的黄铜指针上。",
          en: "Even cosmic frontiers: This millennial sundial fuses orbital celestial mechanics with human history onto a slowly turning brass dial."
        }
      },
      {
        start: 20,
        end: 30,
        label: { zh: "20s · 火花切割", en: "20s · Plasma Cutting" },
        headline: { zh: "等离子弧火花四射：数字指令直接击穿现实壁垒", en: "Plasma arc sparks fly: Digital commands piercing physical barriers" },
        detail: { zh: "高能等离子火炬沿钢板边缘高速切削，飞溅的耀眼火花象征着由纯代码生成的指令正以前所未有的速度熔断现实与虚拟的隔阂。", en: "A high-energy plasma torch cuts steel plate, its sparks symbolizing pure code shattering the barriers between virtual and real." },
        metrics: { zh: ["两万度等离子电弧", "火花飞溅粒子系统", "虚拟走向现实的隐喻"], en: ["20,000°C plasma arc", "Sparks dynamic particle effect", "Virtual-to-real metaphor"] },
        stageCue: "PLASMA_CUT",
        scriptText: {
          zh: "等离子切割机的割枪划过钢板，两万度的高温弧光火花四溅。代码不再局限于屏幕像素，它正在直接穿透并重塑现实世界的物质形态。",
          en: "The plasma torch cuts steel, 20,000-degree arcs sending sparks flying. Code is no longer pixels; it slices through physical boundaries."
        }
      },
      {
        start: 30,
        end: 40,
        label: { zh: "30s · 终极托卡马克", en: "30s · Fusion Tokamak" },
        headline: { zh: "托卡马克人造太阳：人机协作奔向无限可能的终点", en: "Tokamak artificial sun: Human-AI synergy racing toward boundless horizons" },
        detail: { zh: "环形强磁场紧紧束缚着上亿度发光的超高温等离子体环，正如人类智慧与大模型智能在紧密啮合中点燃未来的无限潜能。", en: "Toroidal magnets confine 100-million-degree plasma rings: human and artificial intelligence igniting boundless potential." },
        metrics: { zh: ["托卡马克环形磁笼", "亿度等离子体螺旋自旋", "人机共创新纪元起点"], en: ["Tokamak magnetic torus", "100M-degree spinning plasma", "Dawn of human-AI synergy"] },
        stageCue: "TOKAMAK_FUSION",
        scriptText: {
          zh: "最后一台机器：磁约束托卡马克可控核聚变装置。环形磁场束缚着一亿度的人造太阳。这是一场刚刚开始的革命。带上 Anatomy，去创造属于你的机器吧！",
          en: "The final machine: a magnetic confinement Tokamak fusion reactor holding an artificial sun. This revolution has just begun. Go build your own machines!"
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
    ch = CHAPTERS[Math.max(0, Math.min(CHAPTERS.length - 1, chIndexOrId))];
  } else {
    ch = CHAPTERS.find((c) => c.id === chIndexOrId) || CHAPTERS[0];
  }
  const clamped = Math.max(0, Math.min(ch.duration - 0.001, tSec));
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
