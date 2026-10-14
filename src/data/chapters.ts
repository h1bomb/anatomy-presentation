import type { Chapter } from "../types";

const CHAPTER_FIGURES: Record<string, (t: number, beat: number) => string> = {
  ch01: () => "watch",
  ch02: (t, beat) => ["message-queue", "dns", "process-pump", "git-merge"][beat],
  ch03: (t, beat) => ["computer", "binary-search", "b-tree", "computer"][beat],
  ch04: (t, beat) => ["press-and-pull", "profile", "one-context", "press-and-pull"][beat],
  ch05: (t, beat) => ["lru-cache", "rate-limiter", "afterburner", "seasons"][beat],
  ch06: (t, beat) => ["one-stage", "fit", "separable-blur", "lens-bench"][beat],
  ch07: (t) => {
    if (t < 8) return "hash-map";
    if (t < 16) return "bloom-filter";
    if (t < 24) return "mutex";
    if (t < 32) return "tcp-handshake";
    return "sampling";
  },
  ch08: (t, beat) => ["turbofan", "reactor", "afterburner", "turbofan"][beat],
  ch09: (t, beat) => ["lit-by-facing", "easing", "turbofan", "three-reads"][beat],
  ch10: (t, beat) => ["mark-sweep", "four-frames", "turbofan", "frosted-copy"][beat],
  ch11: (t, beat) => ["watch", "seasons", "power-station", "turbofan"][beat],
  ch12: (t, beat) => ["box-model", "spot-plate", "bevel-offset", "shared-canvas"][beat],
  ch13: (t, beat) => ["debounce", "merge-sort", "gradient-descent", "flex-grow"][beat],
  ch14: (t, beat) => ["foundry", "glass-furnace", "forge", "studio"][beat],
  ch15: (t, beat) => ["public-key", "seasons", "plasma-cutter", "tokamak"][beat],
};

export const CHAPTERS: Chapter[] = [
  {
    id: "ch01",
    index: 0,
    number: "01",
    title: "一行字造一台机器",
    subtitle: "OFFICIAL FIGURE: WATCH MOVEMENT · ONE-LINE PROMPT",
    duration: 40,
    stageType: "official-pkg",
    machineKey: "watch",
    thesis: "“解释机械表怎么计时” —— 1小时54分钟，零人工绘图，一次成型。",
    takeaway: "一行字，一台机器 · 上线 6 天斩获 8,200+ GitHub Stars",
    readout: (t, beat) => {
      if (beat === 0) return `OFFICIAL [watch] · 4 Hz · 28,800 vph · CROWN WINDING`;
      if (beat === 1) return `KEY [S] · 1/20× SLOW SPEED · 15-TOOTH ESCAPE WHEEL`;
      if (beat === 2) return `KEY [E] · BRIDGES LIFTED APART · 60:1 GEAR TRAIN`;
      return `BUILD 1h 54m · 0 HUMAN STROKES · ★ 8,203`;
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: "00s · 上链储能",
        headline: "拖动表冠上发条，动力储存逐格攀升",
        detail: "棘轮啮合旋转、棘爪止逆作响，发条盒游丝盘紧，动力储存实时涨向 38 小时。",
        metrics: ["官方 watch 原版机芯", "表冠拖拽上发条", "棘轮+棘爪止逆联动"],
        stageCue: "WATCH_WIND",
        scriptText: "先看一个东西。这是一块机械表的机芯。你可以拖动表冠上发条，棘轮转，棘爪响，动力储存一格一格涨上去。"
      },
      {
        start: 10,
        end: 20,
        label: "10s · 慢镜擒纵",
        headline: "按 S 键放慢至 1/20，看清半齿释放",
        detail: "时间流速降至二十分之一，双叉瓦擒纵叉精准卡入 15 齿擒纵轮，每次摆动恰好放行半个齿距。",
        metrics: ["KEY [S] · 1/20× 慢镜", "15 齿擒纵轮", "单次放行 0.5 齿"],
        stageCue: "WATCH_SLOW",
        scriptText: "按一下S键，时间放慢到二十分之一，你能看到擒纵叉把十五齿的擒纵轮，一次放过去半个齿。"
      },
      {
        start: 20,
        end: 30,
        label: "20s · 夹板拆解",
        headline: "按 E 键升起夹板，真实齿轮比全公开",
        detail: "上夹板与摆轮夹板沿定位立柱平稳抬升，底层轮系一览无余：秒轮一分钟一圈，中心轮一小时一圈。",
        metrics: ["KEY [E] · 夹板抬升", "秒轮 1 r/min", "中心轮 1 r/hour"],
        stageCue: "WATCH_APART",
        scriptText: "再按E键，夹板升起来，下面的轮系露出来，齿轮比例全是真的，秒轮一分钟一圈，中心轮一小时一圈。"
      },
      {
        start: 30,
        end: 40,
        label: "30s · 一次成型",
        headline: "无人手绘：来自一行 Prompt 的工程奇迹",
        detail: "Prompt: “解释机械表怎么计时” —— Claude 独立运转 1 小时 54 分钟一次成型，Anatomy 开源 6 天突破 8,200 星。",
        metrics: ["耗时 1h 54m 一次成型", "Claude Code 技能", "6 天 8,200+ Stars"],
        stageCue: "WATCH_FULL",
        scriptText: "这块表没有任何人画过。它来自一行字：解释机械表怎么计时。Claude自己干了一小时五十四分钟，一次成型。做出它的，是一个叫Anatomy的Claude Code技能。上线六天，GitHub八千多星。这期视频，从原理到实践，把它讲透。"
      }
    ]
  },
  {
    id: "ch02",
    index: 1,
    number: "02",
    title: "方块和箭头的老问题",
    subtitle: "OFFICIAL FIGURES: MESSAGE-QUEUE · DNS · PROCESS-PUMP · GIT-MERGE",
    duration: 40,
    stageType: "official-pkg",
    machineKey: "message-queue",
    thesis: "方块只告诉你部件存在，箭头把最关键的“怎么动”丢给读者脑补。",
    takeaway: "画出那个东西本身 —— 读者不用脑补，伸手玩一遍就懂了",
    readout: (t, beat) => {
      if (beat === 0) return `OFFICIAL [message-queue] · MARBLE RUN ESCAPEMENT`;
      if (beat === 1) return `OFFICIAL [dns] · PNEUMATIC TUBE CARRIER ROUTING`;
      if (beat === 2) return `OFFICIAL [process-pump] · REAL PISTON & VALVE ACTUATION`;
      return `OFFICIAL [git-merge] · HANDS-ON MECHANISM`;
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: "00s · 流程图困局",
        headline: "讲消息队列或网络寻址，为什么以前总是方块加箭头？",
        detail: "方块只声明模块存在，单向箭头暗示某种联系，但真正的动态机制在静态框图里完全缺席。",
        metrics: ["官方 message-queue 弹珠轨", "告别静态方块箭头", "真实重力滑道排队"],
        stageCue: "MARBLE_QUEUE",
        scriptText: "你可能遇到过这种情况。想给别人讲清一个技术概念，哈希冲突也好，TCP握手也好，画出来的都是方块加箭头。方块告诉你部件存在，箭头代表某种运动，运动本身全靠读者脑补。"
      },
      {
        start: 10,
        end: 20,
        label: "10s · 脑补的歧义",
        headline: "A 指向 B 的箭头：是推送、拉取还是轮询？",
        detail: "一千个读者脑补出一千种时序。换成官方 DNS 气动管道机，请求胶囊如何逐级寻址投递一目了然。",
        metrics: ["官方 dns 气动管道机", "消除推/拉/轮询歧义", "物理管道因果闭环"],
        stageCue: "DNS_TUBES",
        scriptText: "脑补这件事最麻烦的地方在于，每个人补出来的都不一样。一个箭头从A指向B，到底是推送、拉取还是轮询，图里根本没有答案。看完的人点点头，其实什么都没带走。"
      },
      {
        start: 20,
        end: 30,
        label: "20s · 造出实体机器",
        headline: "Ryan 的解法：直接让 AI 画出那个东西本身",
        detail: "切入官方 process-pump 进程水泵机：一台真实的机器，阀门怎么开、活塞怎么动，概念就是什么样。",
        metrics: ["官方 process-pump 水泵", "零件运动 = 概念本身", "实时物理状态读数"],
        stageCue: "PROCESS_PUMP",
        scriptText: "开发者Ryan对这件事忍了很久。他的想法很直接，让AI画出那个东西本身。一台真实的机器，零件怎么动，概念就是什么样。"
      },
      {
        start: 30,
        end: 40,
        label: "30s · 伸手即懂",
        headline: "零件怎么动，概念就是什么样",
        detail: "切入官方 git-merge 轨道合流机：读者完全不用脑补，伸手拨动一次开关就彻底懂了。",
        metrics: ["官方 git-merge 合流轨", "零脑补歧义", "伸手玩一遍即懂"],
        stageCue: "GIT_MERGE",
        scriptText: "读者不用脑补，伸手玩一遍就懂了。"
      }
    ]
  },
  {
    id: "ch03",
    index: 2,
    number: "03",
    title: "Anatomy 是什么",
    subtitle: "OFFICIAL FIGURES: COMPUTER · BINARY-SEARCH · B-TREE",
    duration: 40,
    stageType: "official-pkg",
    machineKey: "computer",
    thesis: "一句话生成可交互等轴测机器插图，MIT 开源，全平台 Agent 通用。",
    takeaway: "npx skills add wheresryan22/anatomy · 工程与艺术的交汇点",
    readout: (t, beat) => {
      if (beat === 0) return `OFFICIAL [computer] · 1984 DESK COMPUTER · MIT LICENSE`;
      if (beat === 1) return `OFFICIAL [binary-search] · PRECISION LAB BALANCE`;
      if (beat === 2) return `OFFICIAL [b-tree] · ROTARY CARD INDEX FILE`;
      return `OFFICIAL [computer] · 85 SOLIDS · CRT COLLAPSE`;
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: "00s · 开源诞生",
        headline: "10月8日开源的 Agent Skill，MIT 协议完全免费",
        detail: "输入一句话，Anatomy 驱动大模型发明一台实体机器来解释概念，输出可拖拽、可按键的等轴测插图。",
        metrics: ["官方 computer 桌面电脑", "MIT License 免费开源", "拖 / 按 / 转全交互"],
        stageCue: "CRT_INTRO",
        scriptText: "Anatomy是Ryan在10月8日开源的Agent Skill，MIT协议，免费。你给它一句话，它让Claude发明一台机器来解释这句话，产出一张能上手玩的等轴测插图。拖、按、转，都支持。"
      },
      {
        start: 10,
        end: 20,
        label: "10s · 33台机器图集",
        headline: "从二分查找天平到涡扇发动机，官网已收录 33 台机器",
        detail: "舞台切入官方 binary-search（二分查找实验室天平）：砝码逐级折半称量，精准映射算法收敛过程。",
        metrics: ["官方 binary-search 天平", "33 台官方展品", "算法 → 航空重工"],
        stageCue: "BINARY_BALANCE",
        scriptText: "到现在，官网图集里躺着33台机器，从二分查找到涡轮风扇发动机都有。"
      },
      {
        start: 20,
        end: 30,
        label: "20s · 跨端一键安装",
        headline: "通吃 Claude Code、OpenCode 与 Codex",
        detail: "舞台切入官方 b-tree（B树旋转卡片柜）：一行命令 npx skills add wheresryan22/anatomy 即可全局加载。",
        metrics: ["官方 b-tree 旋转卡片柜", "Claude Code / OpenCode / Codex", "npx skills add 一键装"],
        stageCue: "BTREE_ROTARY",
        scriptText: "它不只跑在Claude Code里，OpenCode和Codex也能加载。安装一条命令，npx skills add wheresryan22/anatomy。"
      },
      {
        start: 30,
        end: 40,
        label: "30s · 工程还是艺术",
        headline: "有人说这是工程，有人说是艺术",
        detail: "回到官方 1984 桌面电脑：连键盘敲击与 CRT 显像管关机坍缩成中心亮点的物理细节都严丝合缝。",
        metrics: ["官方 computer 实时渲染", "CRT 关机坍缩物理细节", "工程 × 艺术"],
        stageCue: "CRT_POWER",
        scriptText: "有人说这是工程，有人说是艺术，你怎么看，打在公屏上。"
      }
    ]
  },
  {
    id: "ch04",
    index: 3,
    number: "04",
    title: "物体就是解释",
    subtitle: "OFFICIAL FIGURES: PRESS-AND-PULL · PROFILE · ONE-CONTEXT",
    duration: 40,
    stageType: "official-pkg",
    machineKey: "press-and-pull",
    thesis: "SKILL.md 第一条铁律：不许画方块，不许画箭头，不许让标签飘在空中。",
    takeaway: "造一台叫得出名字的机器，一堆小零件，每个零件都有活干",
    readout: (t, beat) => {
      if (beat === 0) return `OFFICIAL [press-and-pull] · THE OBJECT IS THE EXPLANATION`;
      if (beat === 1) return `OFFICIAL [profile] · CONTOUR GAUGE PINS`;
      if (beat === 2) return `OFFICIAL [one-context] · 16-WELL GANTRY PLOTTER`;
      return `OFFICIAL [press-and-pull] · 53 SOLIDS · 4× ZOOM QUALITY BAR`;
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: "00s · 灵魂铁律",
        headline: "SKILL.md 置顶准则：物体就是解释",
        detail: "舞台展示官方质量标杆 press-and-pull（弹簧按键测试台）：探针按压玻璃按键，千分表同步读出倾角。",
        metrics: ["官方 press-and-pull 标杆", "禁止方块箭头与悬空标签", "运动即概念定义"],
        stageCue: "TEST_RIG_INTRO",
        scriptText: "这个技能的全部灵魂，写在SKILL.md的最顶上：物体就是解释。不许画方块，不许画箭头，不许让标签飘在空中。Claude必须发明一台真实的东西，它的运转方式等于概念本身，还要用一句话说清，什么在动，这个动代表什么。"
      },
      {
        start: 10,
        end: 20,
        label: "10s · 两种典型失败",
        headline: "Ryan 总结的无数次失败，只有两种死法",
        detail: "太抽象（悬浮板块）或太平淡（薄板画线）。舞台切入官方 profile（轮廓仿形尺）：几十根精密探针紧密贴合。",
        metrics: ["官方 profile 轮廓仿形尺", "拒绝悬浮抽象板块", "拒绝无体积扁平薄板"],
        stageCue: "PROFILE_GAUGE",
        scriptText: "Ryan说他看过无数次失败。失败只有两种。一种太抽象，一堆悬浮板块，看不出是个啥。一种太平，一块大板子画几条线，没体积没细节。"
      },
      {
        start: 20,
        end: 30,
        label: "20s · 唯一药方",
        headline: "造一台叫得出名字的机器，每个小零件都有活干",
        detail: "舞台切入官方 one-context（16孔龙门绘图仪）：一个共享 GPU 上下文变成单个打印头巡回访问 16 个墨水池。",
        metrics: ["官方 one-context 龙门绘图仪", "1 个打印头巡访 16 槽", "每个零件各司其职"],
        stageCue: "GANTRY_PLOTTER",
        scriptText: "药方也只有一个，造一台叫得出名字的机器，一堆小零件，每个零件都有活干。"
      },
      {
        start: 30,
        end: 40,
        label: "30s · 四倍细节标准",
        headline: "1× 看清整机，4× 放大处处皆有真实机械结构",
        detail: "回到 press-and-pull 放大视角：53 个实体、470 条路径，倒角、沉孔螺钉与弹簧在 4 倍镜下依然无懈可击。",
        metrics: ["53 实体 / 470 路径", "0.4–1.6 精密倒角", "1× 清晰 / 4× 耐看"],
        stageCue: "TEST_RIG_ZOOM",
        scriptText: "从整体到四倍放大，每一个倒角、螺钉、刻度都经得起审视。"
      }
    ]
  },
  {
    id: "ch05",
    index: 4,
    number: "05",
    title: "提示词的三个关键词",
    subtitle: "OFFICIAL FIGURES: LRU-CACHE · RATE-LIMITER · AFTERBURNER · SEASONS",
    duration: 40,
    stageType: "official-pkg",
    machineKey: "lru-cache",
    thesis: "提示词里只写想法，别写画什么；把发明机器的工作交给 Claude。",
    takeaway: "interactive（能拖能按） · WebGL（流体火焰着色器） · 3D（真纵深重投影）",
    readout: (t, beat) => {
      if (beat === 0) return `OFFICIAL [lru-cache] · BOOKCASE EVICTION METAPHOR`;
      if (beat === 1) return `KEYWORD [interactive] · OFFICIAL [rate-limiter]`;
      if (beat === 2) return `KEYWORD [WebGL] · OFFICIAL [afterburner] SHADER PLUME`;
      return `KEYWORD [3D] · OFFICIAL [seasons] 26 PARTS IN TRUE 3D`;
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: "00s · 反直觉铁律",
        headline: "只写你要解释的想法：LRU 缓存自动变成书架",
        detail: "舞台直接运行官方 lru-cache（自动退书架）：你只写“解释LRU缓存怎么淘汰条目”，Claude 自己发明了这台书架机。",
        metrics: ["官方 lru-cache 书架机", "只给想法不写画面", "最久未用书籍自动滑落"],
        stageCue: "LRU_BOOKCASE",
        scriptText: "用起来有个反直觉的地方。提示词里只写想法，别写画什么。你写解释LRU缓存怎么淘汰条目，就够了。决定把它画成书架这件事，是Claude的活。"
      },
      {
        start: 10,
        end: 20,
        label: "10s · 关键词 1：interactive",
        headline: "写下 interactive，死图瞬间变成可把玩的仪器",
        detail: "舞台切入官方 rate-limiter（令牌桶限流器）：写上 interactive，即刻支持拖拽阀门、按键调速与实时流量读数。",
        metrics: ["官方 rate-limiter 令牌桶", "interactive 激活拖拽按键", "不写则是静态图"],
        stageCue: "RATE_LIMITER",
        scriptText: "但这里有个很关键的地方，有三个词会改变结果，只有你写进去它才用。interactive，出来的图能拖能按，不写就是一张死图。"
      },
      {
        start: 20,
        end: 30,
        label: "20s · 关键词 2：WebGL",
        headline: "写下 WebGL，火焰、水流、等离子体嵌进同一个等轴相机",
        detail: "舞台切入官方 afterburner（喷气加力燃烧室）：WebGL 着色器在前后两层 SVG 之间实时渲染激波钻戒与尾焰。",
        metrics: ["官方 afterburner 加力燃烧室", "WebGL 着色器内嵌等轴相机", "火焰激波零突兀过渡"],
        stageCue: "AFTERBURNER_GL",
        scriptText: "WebGL，火焰、水流、等离子体交给着色器，嵌在同一个等轴相机里画。"
      },
      {
        start: 30,
        end: 40,
        label: "30s · 关键词 3：3D",
        headline: "写下 3D，零件真正在纵深里转，每帧重新投影排序",
        detail: "舞台切入官方 seasons（四季 3D 地球仪）：26 个三维零件在纵深中真实公转自转，每帧重算四级明暗与太阳光照。",
        metrics: ["官方 seasons 四季 3D 地球", "26 零件每帧真 3D 重投影", "耗时按小时计的重武器"],
        stageCue: "SEASONS_3D",
        scriptText: "3D，零件真正在纵深里转，每帧重新投影排序。这个最贵，按小时算，分钟就别想了。"
      }
    ]
  },
  {
    id: "ch06",
    index: 5,
    number: "06",
    title: "十步流水线",
    subtitle: "OFFICIAL FIGURES: ONE-STAGE · FIT · SEPARABLE-BLUR · LENS-BENCH",
    duration: 40,
    stageType: "official-pkg",
    machineKey: "one-stage",
    thesis: "质量大头在前 4 步就定了 —— 那时候屏幕上连一个像素都还没有。",
    takeaway: "先想清楚造什么，再动手画：在任何 AI 工程协作里都成立",
    readout: (t, beat) => {
      if (beat === 0) return `STEPS 01-02 · OFFICIAL [one-stage] · TIER & MODEL`;
      if (beat === 1) return `STEPS 03-05 · OFFICIAL [fit] · OBJECT & CAMERA PLAN`;
      if (beat === 2) return `STEPS 06-09 · OFFICIAL [separable-blur] · GEOMETRY & PAINTER`;
      return `STEP 10 · OFFICIAL [lens-bench] · CRITIC VERIFICATION`;
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: "00s · 定级报预算",
        headline: "第 1 步先报零件规模与耗时，绝不擅自开工",
        detail: "舞台运行官方 one-stage：Figure 40–80 零件（半小时+），Hero 80–150 零件（2–4小时），Epic 6小时起步必须先确认。",
        metrics: ["官方 one-stage 舞台机构", "Figure / Hero / Epic 三档", "不问用户绝不擅自开 Epic"],
        stageCue: "PIPELINE_1",
        scriptText: "从你敲回车到图做完，Claude走一条固定流水线，一共十步。定尺寸，先报预算，Figure四十到八十个零件，半小时出头，Hero八十到一百五十个零件，两到四小时，Epic六小时起步，而且不问你绝不擅自开工。"
      },
      {
        start: 10,
        end: 20,
        label: "10s · 前四步定乾坤",
        headline: "收集真数字 → 发明机器 → 列零件清单（零像素阶段）",
        detail: "舞台切入官方 fit（正交相机适配仪）：前四步屏幕上还没有一个像素，但数学模型与 40+ 零件清单已决定 80% 质量。",
        metrics: ["官方 fit 相机适配仪", "前 4 步零像素定成败", "纯数学模型驱动"],
        stageCue: "PIPELINE_2",
        scriptText: "收集真实数字，写成一个小模型。发明机器。列零件清单。关键来了，质量大头在前四步就定了，那时候屏幕上一个像素都还没有。"
      },
      {
        start: 20,
        end: 30,
        label: "20s · 几何与画家上色",
        headline: "规划相机 → 预计算静态几何 → 从后往前上色 → 装卡激活",
        detail: "舞台切入官方 separable-blur（49×49 钉板与双轨精密梳）：一次性预计算全部静态几何，按画家算法从后往前绘制。",
        metrics: ["官方 separable-blur 精密梳", "静态几何一次性预计算", "画家算法深度排序"],
        stageCue: "PIPELINE_3",
        scriptText: "规划坐标系和相机。一次性算好全部静态几何。从后往前上色。装进卡片。让它动起来。"
      },
      {
        start: 30,
        end: 40,
        label: "30s · 批评家终检",
        headline: "第 10 步：像最严苛的批评家一样光学放大验收",
        detail: "舞台切入官方 lens-bench（光学透镜检验台）：先想清楚造什么，再动手画，最后用自动化检验收尾。",
        metrics: ["官方 lens-bench 光学检验台", "几何审计 + 断线归零", "先想清楚，再动手画"],
        stageCue: "PIPELINE_4",
        scriptText: "第十步，像批评家一样验收。先想清楚造什么，再动手画。这个顺序放在任何AI协作里都成立。"
      }
    ]
  },
  {
    id: "ch07",
    index: 6,
    number: "07",
    title: "机器隐喻大全",
    subtitle: "OFFICIAL FIGURES: HASH-MAP · BLOOM-FILTER · MUTEX · TCP-HANDSHAKE · SAMPLING",
    duration: 40,
    stageType: "official-pkg",
    machineKey: "hash-map",
    thesis: "把看不见的软件概念，翻译成官网图集里最惊艳的 5 台原版物理机器。",
    takeaway: "分拣台 · 老虎机 · 联锁水箱 · 索道邮车 · 轮盘赌 —— 哪个隐喻最妙？",
    readout: (t) => {
      if (t < 8) return `OFFICIAL [hash-map] · POST-OFFICE SORTING DESK (MOD 8)`;
      if (t < 16) return `OFFICIAL [bloom-filter] · 3-REEL FRUIT MACHINE & 16 FLAGS`;
      if (t < 24) return `OFFICIAL [mutex] · DUAL-PUMP WATER TANK & INTERLOCK KEY`;
      if (t < 32) return `OFFICIAL [tcp-handshake] · AERIAL MAIL ROPEWAY (SYN / ACK)`;
      return `OFFICIAL [sampling] · 16-POCKET TEMPERATURE ROULETTE WHEEL`;
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: "00s · 哈希分拣台 & 布隆水果机",
        headline: "哈希冲突变邮局分拣台，布隆过滤器变三滚筒水果老虎机",
        detail: "0–8s 运行官方 hash-map（编码机打印 mod 8 投入鸽子笼）；8–16s 自动切入官方 bloom-filter（三滚筒水果老虎机）。",
        metrics: ["官方 hash-map 邮局分拣台", "官方 bloom-filter 水果机", "三标志位全立才中奖"],
        stageCue: "META_HASH_BLOOM",
        scriptText: "来看几个我最喜欢的映射。哈希表冲突，变成邮局分拣台，编码机给每封信打印哈希值，名字对八取模，投进对应的鸽子笼。布隆过滤器，变成水果老虎机，三个滚筒就是三个哈希函数，一个字的三个标志位全立着才中奖。"
      },
      {
        start: 10,
        end: 20,
        label: "10s · 互斥锁联锁水箱",
        headline: "互斥锁变成双水泵水箱与唯一一把物理联锁钥匙",
        detail: "16–24s 切入官方 mutex（水箱与联锁钥匙）：两个控制器同时读水位必溢出，只有持有钥匙的一方能读表开机。",
        metrics: ["官方 mutex 联锁水箱", "双泵并发读表 = 溢出", "唯一钥匙保障互斥访问"],
        stageCue: "META_MUTEX",
        scriptText: "互斥锁，变成一台水箱加一把联锁钥匙，两个水泵同时读水位就会溢出，只有拿着钥匙的那个能读表开机。"
      },
      {
        start: 20,
        end: 30,
        label: "20s · TCP 索道邮车",
        headline: "TCP 三次握手变成两站之间的往返架空索道邮车",
        detail: "24–32s 切入官方 tcp-handshake（索道邮车）：SYN、SYN+ACK、ACK 三个邮罐挂在钢索上来回飞渡并扳动信号旗。",
        metrics: ["官方 tcp-handshake 索道邮车", "SYN / SYN+ACK / ACK 邮罐", "双站信号旗状态同步"],
        stageCue: "META_TCP",
        scriptText: "TCP三次握手，变成两站之间的索道邮车，SYN、SYN加ACK、ACK三个罐子来回飞。"
      },
      {
        start: 30,
        end: 40,
        label: "30s · 温度采样轮盘赌",
        headline: "温度采样变成 16 格扇区宽度随概率变化的轮盘赌",
        detail: "32–40s 切入官方 sampling（温度采样轮盘赌）：16 个格子对应候选词，转动温控旋钮即可实时改变扇区宽度分布。",
        metrics: ["官方 sampling 温度轮盘赌", "16 格宽度 = Token 概率", "温控旋钮实时重塑分布"],
        stageCue: "META_ROULETTE",
        scriptText: "温度采样，变成轮盘赌，十六个格子是候选词，格子宽度就是概率。哪个映射最妙，公屏见。"
      }
    ]
  },
  {
    id: "ch08",
    index: 7,
    number: "08",
    title: "两台大机器",
    subtitle: "OFFICIAL FIGURES: TRENT 970 TURBOFAN & SPACEX RAPTOR 2",
    duration: 40,
    stageType: "official-pkg",
    machineKey: "turbofan",
    thesis: "小点子造小机器，大点子才见真功夫：官方遄达 970 与猛禽 2 号同台飙戏。",
    takeaway: "能跑的第一版 38 分钟就出来了 —— 改到挑不出毛病，又花了 10 个小时",
    readout: (t, beat) => {
      if (beat === 0) return `OFFICIAL [turbofan] · ROLLS-ROYCE TRENT 970 · 1.2 t/s AIR · 14 → 334 kN`;
      if (beat === 1) return `OFFICIAL [raptor-engine] · HOVER EXPLODED INTO 11 ASSEMBLIES`;
      if (beat === 2) return `OFFICIAL [raptor-engine] · KEY [I] IGNITION · Pc 300 BAR · WEBGL PLUME`;
      return `FIRST PROTOTYPE: 38 MIN · ZERO-DEFECT AUDIT: +10 HOURS`;
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: "00s · 遄达970涡扇真机",
        headline: "A380 遄达 970 挂上试车台，四分之一剖开见真章",
        detail: "舞台直接运行官方 turbofan（遄达970）：风扇、中压、高压三个转子按各自速度旋转，吞气 1.2 吨/秒，推力从 14 爬升至 334 kN。",
        metrics: ["官方 turbofan 遄达970", "三转子差速同轴旋转", "推力 14 kN → 334 kN"],
        stageCue: "TRENT_GROUND_RUN",
        scriptText: "小点子造小机器，大点子才见真功夫。遄达970，A380的发动机，挂在试车台上，四分之一剖开。拖油门杆，风扇、中压、高压三个转子按各自的速度转起来。每秒吞进去1.2吨空气，推力从14千牛爬到334千牛。"
      },
      {
        start: 10,
        end: 20,
        label: "10s · 猛禽11组件拆解",
        headline: "SpaceX 猛禽 2 号：悬停鼠标，整机分成 11 个组件散开",
        detail: "舞台切入官方 raptor-engine：11 个总成沿弹簧导轨平滑解体展开，高密度管路经审计证明零穿插。",
        metrics: ["官方 raptor-engine 猛禽2", "悬停触发 11 组件拆解", "全流量分级燃烧管路"],
        stageCue: "RAPTOR_EXPLODE",
        scriptText: "另一台更狠，SpaceX的猛禽2号，悬停鼠标，整机分成十一个组件散开，按I键点火。"
      },
      {
        start: 20,
        end: 30,
        label: "20s · 300大气压点火",
        headline: "按 I 键点火：液氧与甲烷在 300 bar 主燃烧室碰头",
        detail: "富氧与富燃两股热气在 300 bar 主燃烧室汇合，WebGL 着色器在等轴相机内实时喷涌马赫环尾焰与水冷蒸汽。",
        metrics: ["按 I 键触发实时点火", "主燃烧室 Pc = 300 bar", "WebGL 尾焰 + 马赫环"],
        stageCue: "RAPTOR_IGNITE",
        scriptText: "每一滴液氧先过富氧预燃室，带动氧泵，每一滴甲烷走富燃预燃室，两股热气在300个大气压的主燃烧室碰头。"
      },
      {
        start: 30,
        end: 40,
        label: "30s · 38分钟与10小时",
        headline: "第一版 38 分钟跑通，改到挑不出毛病又花了 10 小时",
        detail: "切回官方 turbofan 全速试车：能跑的第一版只需 38 分钟，但做到零穿插、零断线花费了整整十小时。",
        metrics: ["首版成型：38 分钟", "深度打磨：+10 小时", "两台重工传奇同台"],
        stageCue: "TRENT_TAKEOFF",
        scriptText: "能跑的第一版，38分钟就出来了。改到挑不出毛病，又花了十个小时。"
      }
    ]
  },
  {
    id: "ch09",
    index: 8,
    number: "09",
    title: "相机与审计",
    subtitle: "OFFICIAL FIGURES: LIT-BY-FACING · EASING · TURBOFAN · THREE-READS",
    duration: 40,
    stageType: "official-pkg",
    machineKey: "lit-by-facing",
    thesis: "零件一多，人眼根本调不动前后顺序 —— 必须用几何射线审计脚本来证明。",
    takeaway: "541 个实体 · 6,320 对重叠 · 62.4 秒射线验完零问题",
    readout: (t, beat) => {
      if (beat === 0) return `OFFICIAL [lit-by-facing] · AZIMUTH 45° · ELEVATION 30° · 4-TONE`;
      if (beat === 1) return `OFFICIAL [easing] · SPLIT COIL PAINTER'S ORDER`;
      if (beat === 2) return `OFFICIAL [turbofan] · 541 SOLIDS · 6,320 OVERLAPS · 62.4s · 0 ERRORS`;
      return `OFFICIAL [three-reads] · RAPTOR V1 CAUGHT 54 INTERSECTIONS`;
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: "00s · 正交相机与四档明暗",
        headline: "方位角 45°、俯角 30°，平行边永远平行，四档明暗锁死相机",
        detail: "舞台运行官方 lit-by-facing（双灯转台摄影棚）：直观演示每个侧面如何按法线朝向自动计算四级明暗。",
        metrics: ["官方 lit-by-facing 摄影台", "方位角 45° / 俯角 30°", "lo / mid / hi / lit 四档明暗"],
        stageCue: "CAM_ORTHO",
        scriptText: "程序员朋友，这部分是给你的。所有图共用一个正交相机，方位角45度，俯角30度，平行边永远平行，零件摆在哪都不变形。每个侧面按朝向分四档明暗，光源锁死在相机上。"
      },
      {
        start: 10,
        end: 20,
        label: "10s · 弹簧劈开画家算法",
        headline: "弹簧绕柱子怎么画？劈成前后两半，把柱子夹在中间",
        detail: "舞台切入官方 easing（阻尼弹簧台）：SVG 画家算法从后往前画，环绕柱子的弹簧必须切分为后半圈、立柱、前半圈。",
        metrics: ["官方 easing 弹簧机构", "画家算法从后往前画", "后半簧 → 立柱 → 前半簧"],
        stageCue: "COIL_SPLIT",
        scriptText: "深度排序用画家算法，从后往前画。弹簧绕着柱子这种前后穿插的，把弹簧劈成前后两半，柱子画在中间。"
      },
      {
        start: 20,
        end: 30,
        label: "20s · 射线重叠审计",
        headline: "给每对重叠零件发射线测深度：6,320 对重叠 62.4 秒验完",
        detail: "舞台切入官方 turbofan（遄达970）：541 个三维实体、6,320 对重叠，审计脚本发射采样射线在 62.4 秒内完成零错误证明。",
        metrics: ["遄达：541 个三维实体", "6,320 对屏幕重叠检测", "62.4 秒验证 · 0 错误"],
        stageCue: "RAY_SCAN",
        scriptText: "零件一多，人眼调不动顺序，就交给审计脚本。它给每对重叠零件发射线，测出谁在前。遄达那一次，541个实体，6320对重叠，62.4秒验完，零问题。"
      },
      {
        start: 30,
        end: 40,
        label: "30s · 猛禽首版捉虫单",
        headline: "猛禽第一版跑审计：当场抓出 54 处管路穿插、323 处顺序错误",
        detail: "舞台切入官方 three-reads：没有确定性几何审计，AI 生成的复杂管路必然穿插错乱。",
        metrics: ["官方 three-reads 采样仪", "猛禽V1 抓出 54 处穿插", "抓出 323 处遮挡顺序错误"],
        stageCue: "AUDIT_DIFF",
        scriptText: "猛禽第一版，审计抓出54处穿插，323处顺序错误。"
      }
    ]
  },
  {
    id: "ch10",
    index: 9,
    number: "10",
    title: "一群 AI 互相挑错",
    subtitle: "OFFICIAL FIGURES: MARK-SWEEP · FOUR-FRAMES · TURBOFAN · FROSTED-COPY",
    duration: 40,
    stageType: "official-pkg",
    machineKey: "mark-sweep",
    thesis: "评审 Agent 绝不听信建造者的报告，而是自己重建页面、重跑审计、自己截图。",
    takeaway: "三轮评审留下 309 张截图 · 50×45 像素放大到 800×720 抓出叶片折痕",
    readout: (t, beat) => {
      if (beat === 0) return `OFFICIAL [mark-sweep] · BUILDER + REVIEWERS + FIXER LOOP`;
      if (beat === 1) return `OFFICIAL [four-frames] · 3 ROUNDS · 309 SCREENSHOTS`;
      if (beat === 2) return `OFFICIAL [turbofan] · 16× ZOOM (50×45 → 800×720 px) FAN BLADE`;
      return `OFFICIAL [frosted-copy] · 0.6 PITCH SMOOTH FADE FIX`;
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: "00s · 多Agent流水班组",
        headline: "1 个建造者 + 几个评审 + 1 个修复工，接力转到零瑕疵为止",
        detail: "舞台运行官方 mark-sweep（模块化合成器）：每个 Agent 维护独立进度文件，随时打断随时续接。",
        metrics: ["官方 mark-sweep 合成器", "Builder + Reviewers + Fixer", "进度文件持久化防中断"],
        stageCue: "AGENT_LOOP",
        scriptText: "大一点的图，背后是一个小团队。一个建造者，几个评审，一个修复工，一轮一轮转，转到某一轮挑不出毛病为止。每个agent维护自己的进度文件，因为你随时会打断它，文件在，活就在。"
      },
      {
        start: 10,
        end: 20,
        label: "10s · 独立重建与截图",
        headline: "评审不看报告点头：自己重建页面、重跑审计、自己截图",
        detail: "舞台切入官方 four-frames（四帧审校台）：遄达 970 历经三轮独立评审，足足留下 309 张检验截图。",
        metrics: ["官方 four-frames 四帧台", "独立重建 + 独立跑审计", "三轮留下 309 张截图"],
        stageCue: "REVIEW_309",
        scriptText: "评审不看建造者的报告点头，他们自己重建页面，重跑审计，自己截图。遄达三轮评审留下309张截图。"
      },
      {
        start: 20,
        end: 30,
        label: "20s · 16倍微距抓虫",
        headline: "把 50×45 像素放大到 800×720，揪出风扇叶片切口折成薄片",
        detail: "舞台切入官方 turbofan 并自动推镜放大风扇剖切口：发现叶片在切口处被折成了纸片。",
        metrics: ["官方 turbofan 微距推镜", "50×45 px 放大至 800×720", "揪出剖切处叶片折薄"],
        stageCue: "BLADE_ZOOM",
        scriptText: "有一轮，评审把风扇叶片一块50乘45像素的区域放大到800乘720，发现叶片在切口处折成了薄片。"
      },
      {
        start: 30,
        end: 40,
        label: "30s · 0.6节距优雅淡出",
        headline: "修复方案：每片叶子画完整，再用 0.6 个节距平滑淡出",
        detail: "舞台切入官方 frosted-copy：完整绘制每片叶子再用 0.6 节距渐隐。这套多 Agent 验收流在任何 AI 项目都管用。",
        metrics: ["官方 frosted-copy 渐隐光学", "完整叶片 + 0.6 节距淡出", "通用 AI 工程质量护栏"],
        stageCue: "BLADE_FIXED",
        scriptText: "修复方案，每片叶子画完整，再用0.6个节距淡出。这套流程，拿去管你自己的AI编码项目，一样好使。"
      }
    ]
  },
  {
    id: "ch11",
    index: 10,
    number: "11",
    title: "时间的真相",
    subtitle: "OFFICIAL FIGURES: WATCH (1h54m) · SEASONS (1h57m) · RAPTOR (10h33m) · TURBOFAN (14h)",
    duration: 40,
    stageType: "official-pkg",
    machineKey: "watch",
    thesis: "不管机器多大，第 1 个小时内一定有能跑的页面，剩下 90% 的时间全花在“第二眼”上。",
    takeaway: "生成只是起点，验收才是正文",
    readout: (t, beat) => {
      if (beat === 0) return `OFFICIAL [watch] · 1h 54m ACTIVE TIME · SINGLE PASS`;
      if (beat === 1) return `OFFICIAL [seasons] · 1h 57m ACTIVE TIME · 3D ORBIT AUDIT`;
      if (beat === 2) return `OFFICIAL [raptor-engine] · 10h 33m TOTAL (38m FIRST RUN)`;
      return `OFFICIAL [turbofan] · 14h 00m TOTAL (4h41m + 5 REVIEW ROUNDS)`;
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: "00s · 机械表与四季地球工时",
        headline: "只算 Claude 有效工时：机械表 1小时54分，四季地球 1小时57分",
        detail: "舞台展示官方 watch（1h54m）：口径极度干净，评审轮次算在内，人类发呆等待一秒不算。",
        metrics: ["官方 watch：1h 54m", "官方 seasons：1h 57m (3D)", "猛禽 10h33m / 遄达 14h"],
        stageCue: "TIME_WATCH",
        scriptText: "成本方面，Ryan给的全是真数字，而且口径干净，只算Claude的有效工时，评审轮次算在内，发呆等待不算。机械表，一小时五十四分钟，一次通过。四季地球，一小时五十七分钟，还是3D的。猛禽发动机，十小时三十三分钟。遄达，十四小时，首版四小时四十一分，后面跟了五轮评审修复。"
      },
      {
        start: 10,
        end: 20,
        label: "10s · 首小时定律",
        headline: "第一个小时内必出可运行页面，剩下的时间全花在加深它",
        detail: "舞台切入官方 seasons（四季 3D 地球）：能跑的第一版来得极快，大头时间全花在“第二眼”上。",
        metrics: ["官方 seasons 实时运转", "≤ 1 小时必出可跑页面", "大头时间全在“第二眼”"],
        stageCue: "TIME_SEASONS",
        scriptText: "不管尺寸多大，第一个小时内，浏览器里一定有一张能跑的页面，剩下的时间全花在加深它。规律摆在这。能跑的第一版来得很快，大头时间全花在第二眼上。"
      },
      {
        start: 20,
        end: 30,
        label: "20s · 四倍放大镜下的魔鬼",
        headline: "放大四倍看，毛病全藏在那：电缆穿管、阴影断层、叶片折薄",
        detail: "舞台切入官方 raptor-engine（10h33m）：放大四倍看，电缆穿过管道、喷口阴影断层等隐患全靠十小时深挖修平。",
        metrics: ["官方 raptor-engine 10h33m", "排查电缆穿管与阴影断层", "4× 放大镜逐个接头过筛"],
        stageCue: "RAPTOR_EXPLODE",
        scriptText: "放大四倍看，毛病全藏在那，电缆穿过管道，喷口阴影断层，叶片折成薄片。"
      },
      {
        start: 30,
        end: 40,
        label: "30s · 验收才是正文",
        headline: "用 AI 做过东西的人都懂：生成只是起点，验收才是正文",
        detail: "舞台切入官方 turbofan（14h，5轮评审修复）：生成只是 10% 的起点，严苛的验收才是 90% 的正文。",
        metrics: ["官方 turbofan 14h 打磨", "生成 = 起点", "验收 = 正文"],
        stageCue: "TIME_TURBOFAN",
        scriptText: "用AI做过东西都懂，生成只是起点，验收才是正文。"
      }
    ]
  },
  {
    id: "ch12",
    index: 11,
    number: "12",
    title: "最大的误读",
    subtitle: "OFFICIAL FIGURES: BOX-MODEL · SPOT-PLATE · BEVEL-OFFSET · SHARED-CANVAS",
    duration: 40,
    stageType: "official-pkg",
    machineKey: "spot-plate",
    thesis: "“Claude 终于能生成图片了” —— 这类 90 万浏览的热帖，错在根上。",
    takeaway: "Claude 一个像素都没画：可编辑、可验证的代码，才能进生产环境",
    readout: (t, beat) => {
      if (beat === 0) return `MYTH BUSTED · OFFICIAL [box-model] · NOT PIXEL DIFFUSION`;
      if (beat === 1) return `OFFICIAL [spot-plate] · PURE SVG + HTML + DISTANCE FIELD CODE`;
      if (beat === 2) return `OFFICIAL [bevel-offset] · 1 MODEL PARAM DRIVES PART + READOUT`;
      return `OFFICIAL [shared-canvas] · EDITABLE & AUDITABLE FOR PRODUCTION`;
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: "00s · 九十万浏览的误读",
        headline: "疯传“Claude 终于能画图了”？这个说法错在根上",
        detail: "舞台运行官方 box-model：90 万浏览的热帖把 Anatomy 当成了像素画图模型，彻底看反了技术本质。",
        metrics: ["官方 box-model 机械盒", "驳斥 90 万浏览误读帖", "绝非像素生成模型"],
        stageCue: "CODE_BOX_MODEL",
        scriptText: "项目火了以后，传播最广的说法是Claude终于能生成图片了，这类帖子九十万浏览起步。这个说法错在根上。"
      },
      {
        start: 10,
        end: 20,
        label: "10s · 一个像素都没画",
        headline: "Claude 一个像素都没画，它写的是 SVG、HTML 与 WebGL 代码",
        detail: "舞台切入官方 spot-plate（塞尺点滴板）：6 对玻璃水滴由距离场函数实时计算融合，100% 是结构化代码。",
        metrics: ["官方 spot-plate 塞尺点滴板", "0 像素位图 · 纯矢量代码", "距离场数学实时融合"],
        stageCue: "CODE_SPOT_PLATE",
        scriptText: "Claude一个像素都没画。它写的是代码，SVG、HTML、WebGL，浏览器把代码渲染成图。"
      },
      {
        start: 20,
        end: 30,
        label: "20s · 改一个数全局联动",
        headline: "改模型里的一个数，零件尺寸、仪表读数、动画一起跟着变",
        detail: "舞台切入官方 bevel-offset（倒角偏移量规）：所有零件、读数与动画读取同一份底层数据模型，改一处全局联动。",
        metrics: ["官方 bevel-offset 倒角仪", "单点修改模型参数", "零件+读数+动画同步变"],
        stageCue: "CODE_BEVEL",
        scriptText: "区别很实在。代码做的图可以改，可以查，每个零件有尺寸，几何有审计背书。改模型里的一个数，零件、读数、动画一起跟着变，它们读的是同一份数据。"
      },
      {
        start: 30,
        end: 40,
        label: "30s · 进生产环境的门票",
        headline: "可编辑 + 可验证，决定了它能进文档、进生产环境",
        detail: "舞台切入官方 shared-canvas：可查、可改、有几何审计背书的代码组件，才能真正进入严肃的生产环境文档。",
        metrics: ["官方 shared-canvas 组件", "可编辑 + 可数学验证", "直接嵌入生产环境"],
        stageCue: "CODE_SHARED",
        scriptText: "很多人会觉得这是抠字眼，看起来差不多。但可编辑和可验证，决定了这东西能进文档、进生产环境，一张死图进不去。"
      }
    ]
  },
  {
    id: "ch13",
    index: 12,
    number: "13",
    title: "社区用星投票",
    subtitle: "OFFICIAL FIGURES: DEBOUNCE · MERGE-SORT · GRADIENT-DESCENT · FLEX-GROW",
    duration: 40,
    stageType: "official-pkg",
    machineKey: "debounce",
    thesis: "Claude 很会造，但不太会看 —— 管用的修复，来自你盯着它跑，说出哪里别扭。",
    takeaway: "第一版当草稿 → 上手玩 → 说出哪里不对 → 再来一轮",
    readout: (t, beat) => {
      if (beat === 0) return `OFFICIAL [debounce] · 6 DAYS: 2,176 → 4,103 → 8,203 STARS`;
      if (beat === 1) return `OFFICIAL [merge-sort] · 1.4M VIEWS · 19,286 BOOKMARKS`;
      if (beat === 2) return `OFFICIAL [gradient-descent] · AI BUILDS WELL, SEES POORLY`;
      return `OFFICIAL [flex-grow] · DRAFT → PLAY → CRITIQUE → ITERATE`;
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: "00s · 六天八千星曲线",
        headline: "10月8日建仓 → 11号 2,100 星 → 12号 4,100 星 → 14号 8,203 星",
        detail: "舞台运行官方 debounce（八音盒打孔记录仪）：短短 6 天斩获 8,203 Stars 与 586 Forks。",
        metrics: ["官方 debounce 八音盒记录仪", "6 天突破 8,203 Stars", "586 Forks 席卷社区"],
        stageCue: "STARS_DEBOUNCE",
        scriptText: "社区有多买账，看数字。10月8日建的仓库，11号两千一百星，12号四千一百星，到我做这期视频的14号，八千二百星，五百八十六个fork。"
      },
      {
        start: 10,
        end: 20,
        label: "10s · 全球二创引爆",
        headline: "发布帖两天 140 万浏览、1.9 万收藏，多语种二创全面开花",
        detail: "舞台切入官方 merge-sort（归并排序编钟架）：X 发布帖 140 万浏览，Reddit、YouTube、西语频道全面跟进。",
        metrics: ["官方 merge-sort 编钟架", "140 万浏览 / 1.9 万收藏", "多语种社区实测二创"],
        stageCue: "VIEWS_CHIME",
        scriptText: "Ryan那条发布帖，两天冲到一百四十万浏览，一万九千人收藏。Reddit上已经有人晒自己跑出来的图，YouTube和Instagram上的二创视频也起来了，西班牙语的频道都在做。"
      },
      {
        start: 20,
        end: 30,
        label: "20s · 作者最冷静的坦白",
        headline: "Ryan 坦言：Claude 很会造，不太会看，零件数字全对样子仍可能别扭",
        detail: "舞台切入官方 gradient-descent（梯度下降等高线仪）：真正管用的修复，来自人眼盯着它跑，指出哪里别扭。",
        metrics: ["官方 gradient-descent 等高线", "AI 强于建造弱于直觉审视", "人眼反馈是收敛关键"],
        stageCue: "EYE_CONTOUR",
        scriptText: "冷静的声音也有，而且最冷静的来自作者自己。他写得很坦白，Claude很会造，不太会看，零件数字全对，样子还是可能不对。管用的修复，来自你盯着它跑，说出哪里别扭。"
      },
      {
        start: 30,
        end: 40,
        label: "30s · 黄金四步用刀法",
        headline: "官方建议：第一版当草稿，上手玩，说出哪里不对，再来一轮",
        detail: "舞台切入官方 flex-grow（自适应台钳）：把第一版当草稿，亲手把玩并指出别扭之处，迭代一轮即可夹紧成型。",
        metrics: ["官方 flex-grow 精密台钳", "第一版当草稿上手玩", "指出别扭再来一轮"],
        stageCue: "ITERATE_VISE",
        scriptText: "所以官方建议，第一版当草稿，上手玩，说出哪里不对，再来一轮。"
      }
    ]
  },
  {
    id: "ch14",
    index: 13,
    number: "14",
    title: "品味可以打包",
    subtitle: "OFFICIAL FIGURES: FOUNDRY · GLASS-FURNACE · FORGE · STUDIO",
    duration: 40,
    stageType: "official-pkg",
    machineKey: "foundry",
    thesis: "Ryan 从没亲手画过一条线 —— 他做的是看、指出不对、把教训写成规则。",
    takeaway: "你的经验、品味、验收标准，都能打包成文件，让任何一个 Agent 继承",
    readout: (t, beat) => {
      if (beat === 0) return `OFFICIAL [foundry] · 155L SKILL.md + 8 REFS + 16,000L KIT`;
      if (beat === 1) return `OFFICIAL [glass-furnace] · LESSON-BACKED RULES > BARE RULES`;
      if (beat === 2) return `OFFICIAL [forge] · SKILL AS NEW ENGINEERING ARTIFACT`;
      return `OFFICIAL [studio] · TASTE & STANDARDS INHERITED BY ANY AGENT`;
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: "00s · 审美资产三件套",
        headline: "155 行 SKILL.md + 8 份参考文档 + 1.6 万行绘图工具包",
        detail: "舞台直接运行官方 foundry（字模铸造机）：把审美与工艺固化成了可复用的工程资产。",
        metrics: ["官方 foundry 铸造机", "155 行 SKILL.md + 8 份文档", "16,000 行绘图工具包"],
        stageCue: "FOUNDRY_1",
        scriptText: "Anatomy给我的启发，超出这些图本身。一个155行的SKILL.md，八份参考文档，一个一万六千行的绘图工具包，就把审美和工艺固化成了能复用的资产。"
      },
      {
        start: 10,
        end: 20,
        label: "10s · 从不画线的作者",
        headline: "Ryan 从没画过一条线：他的工作是看，说哪里不对，写成规则",
        detail: "舞台切入官方 glass-furnace（玻璃熔炉）：带着翻车教训写出来的规则，比光秃秃的口号管用，AI 下次真会守。",
        metrics: ["官方 glass-furnace 玻璃熔炉", "作者手绘线条：0 条", "带翻车教训的规则最有效"],
        stageCue: "FOUNDRY_2",
        scriptText: "Ryan说他从没画过一条线。他做的事是看，说哪里不对，把这句话写成规则。带着教训写出来的规则，比光秃秃的规则管用，AI下一次真的会守。"
      },
      {
        start: 20,
        end: 30,
        label: "20s · 新型工程制品",
        headline: "Skill 正在变成 AI 时代全新的核心工程制品",
        detail: "舞台切入官方 forge（锻造冲压台）：把人类的审美判断与质量护栏锻造成标准化的 Skill 制品。",
        metrics: ["官方 forge 锻造冲压台", "Skill = 新型工程制品", "元能力与护栏标准化"],
        stageCue: "FOUNDRY_3",
        scriptText: "这指向一个更大的事，skill正在变成新的工程制品。"
      },
      {
        start: 30,
        end: 40,
        label: "30s · 让Agent继承品味",
        headline: "你的经验、品味、验收标准，都能打包成文件让任何 Agent 继承",
        detail: "舞台切入官方 studio（精密摄影棚）：无论哪个 Agent 加载这份文件，都能直接继承你的品味与标准。",
        metrics: ["官方 studio 精密摄影棚", "打包经验与审美品味", "让任何 Agent 直接继承"],
        stageCue: "FOUNDRY_4",
        scriptText: "你的经验、品味、验收标准，都能打包成文件，让任何一个agent继承。"
      }
    ]
  },
  {
    id: "ch15",
    index: 14,
    number: "15",
    title: "接下来看什么",
    subtitle: "OFFICIAL FIGURES: PUBLIC-KEY · TURNING-DIAL (3D) · PLASMA-CUTTER · TOKAMAK",
    duration: 40,
    stageType: "official-pkg",
    machineKey: "tokamak",
    thesis: "一行字，一台机器 —— 技术文档、落地页与 AI 技能的下一站已经开启。",
    takeaway: "评论区留下你最想讲清的概念 · 点赞过千下期实测 · 欢迎一键三连",
    readout: (t, beat) => {
      if (beat === 0) return `TREND 01 · OFFICIAL [public-key] · npm i anatomy-figures`;
      if (beat === 1) return `TREND 02 · OFFICIAL [turning-dial] · 3D HAND & DIAL BETA`;
      if (beat === 2) return `TREND 03 · OFFICIAL [plasma-cutter] · MODEL-DRIVEN EVERYTHING`;
      return `OFFICIAL [tokamak] · ONE LINE, ONE MACHINE · SEE YOU NEXT TIME`;
    },
    beats: [
      {
        start: 0,
        end: 10,
        label: "00s · 趋势一：进军生产文档",
        headline: "anatomy-figures npm 包已把 33 台机器封装为 React 组件",
        detail: "舞台运行官方 public-key（公钥双芯锁）：正是本次视频直接调用的 anatomy-figures 包，一行 import 即可用。",
        metrics: ["官方 public-key 锁具机", "npm: anatomy-figures", "33 台机器一行 import"],
        stageCue: "NEXT_REACT",
        scriptText: "后面可以盯三件事。第一件，这种插图会开始出现在技术文档和落地页里，anatomy-figures这个npm包已经把33台机器做成了React组件，一行import就能用。"
      },
      {
        start: 10,
        end: 20,
        label: "10s · 趋势二：3D模式突破",
        headline: "3D 模式尚处 Beta：380 零件测试手目前 20 帧，成熟后天花板再抬一截",
        detail: "舞台切入官方 turning-dial（3D 机械手与密码转盘）：90 个金属零件在真实 3D 纵深中旋转重投影。",
        metrics: ["官方 turning-dial 3D 机械手", "380 零件测试手 @ 20 FPS", "3D 成熟后上限再抬一截"],
        stageCue: "NEXT_3D_HAND",
        scriptText: "第二件，3D模式还是beta，一个三百八十零件的测试手只跑到20帧，这块成熟了，天花板再抬一截。"
      },
      {
        start: 20,
        end: 30,
        label: "20s · 趋势三：模型驱动一切",
        headline: "“底层数学模型驱动一切”的做法，会加速渗进更多领域 Skill",
        detail: "舞台切入官方 plasma-cutter（WebGL 等离子切割机）：数学模型驱动几何、读数与着色器的范式将重塑更多 Skill。",
        metrics: ["官方 plasma-cutter 等离子机", "数学模型驱动一切", "渗入更多工程级 Skill"],
        stageCue: "NEXT_PLASMA",
        scriptText: "第三件，模型驱动一切这套做法，会渗进更多skill。一行字，一台机器，就这么简单。"
      },
      {
        start: 30,
        end: 40,
        label: "30s · 互动召唤：下期实测",
        headline: "你手里有没有一直想讲清、始终画不明白的概念？评论区见！",
        detail: "舞台切入官方终极巨作 tokamak（托卡马克核聚变装置）：评论区留下你想看的概念，点赞过千下期实测，欢迎一键三连！",
        metrics: ["官方 tokamak 核聚变反应堆", "评论区征集实测概念", "点赞过 1,000 下期安排"],
        stageCue: "NEXT_TOKAMAK",
        scriptText: "你手里有没有一个一直想讲清、始终画不明白的概念？评论区告诉我，点赞过一千，我拿来实测。觉得有收获，一键三连，我们下期见。"
      }
    ]
  }
];

export function getBeatIndex(timeSec: number): number {
  const t = Math.max(0, Math.min(39.999, Number.isFinite(timeSec) ? timeSec : 0));
  if (t < 10) return 0;
  if (t < 20) return 1;
  if (t < 30) return 2;
  return 3;
}

export function getActiveFigureKey(chId: string, timeSec: number, beatIndex: number): string {
  const fn = CHAPTER_FIGURES[chId];
  return fn ? fn(timeSec, beatIndex) : "watch";
}

export function getChapterState(chIndex: number, timeSec: number) {
  const safeIndex = Math.max(0, Math.min(CHAPTERS.length - 1, Math.floor(chIndex || 0)));
  const chapter = CHAPTERS[safeIndex];
  const clampedTime = Math.max(0, Math.min(chapter.duration, Number.isFinite(timeSec) ? timeSec : 0));
  const progress = clampedTime / chapter.duration;
  const beatIndex = getBeatIndex(clampedTime);
  const activeBeat = chapter.beats[beatIndex];
  const beatSpan = Math.max(0.001, activeBeat.end - activeBeat.start);
  const beatProgress = Math.max(0, Math.min(1, (clampedTime - activeBeat.start) / beatSpan));
  const readout = chapter.readout(clampedTime, beatIndex);
  const activeFigureKey = getActiveFigureKey(chapter.id, clampedTime, beatIndex);

  return {
    chapter,
    clampedTime,
    progress,
    beatIndex,
    beatProgress,
    activeBeat,
    readout,
    activeFigureKey,
  };
}
