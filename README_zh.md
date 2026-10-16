<div align="center">

# Anatomy 15章深度解析 · 等轴测动态演播系统

**全屏自适应高精交互式等轴测演示与 B-Roll 演播系统，完整呈现《Anatomy 深度解析》15 章全流程。**

[![CI](https://github.com/h1bomb/anatomy-presentation/actions/workflows/ci.yml/badge.svg)](https://github.com/h1bomb/anatomy-presentation/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-1.0.0-e5a93c.svg)](package.json)
[![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.18.0-339933?logo=node.js&logoColor=white)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178c6?logo=typescript&logoColor=white)](tsconfig.json)
[![React 19](https://img.shields.io/badge/React-19.3-61dafb?logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![shadcn/ui](https://img.shields.io/badge/shadcn%2Fui-Radix_UI-000000?logo=shadcnui&logoColor=white)](https://ui.shadcn.com)
[![Vite 8](https://img.shields.io/badge/Vite-8.3-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![React Router](https://img.shields.io/badge/React_Router-v7-ca4245?logo=reactrouter&logoColor=white)](https://reactrouter.com)
[![Studio Voiceover](https://img.shields.io/badge/原声语音-120段双语配音-e5a93c)](#预制原声语音与生成管线)
[![Tests](https://img.shields.io/badge/tests-6%2F6%20passing-brightgreen)](tests/)
[![Live Demo](https://img.shields.io/badge/在线演示-anatomy.easynote.cc-e5a93c?style=flat&logo=safari&logoColor=white)](https://anatomy.easynote.cc)

[English](README.md) · **简体中文**

<br/>

[![Anatomy 演播系统预览](docs/preview.png)](https://anatomy.easynote.cc)

*线上交互式机械表机芯（`watch`），包含 4 分镜演进旁白卡片、实时遥测读数、音频时长锁定的逐字提词器与舞台悬停播放条。*

</div>

---

## 项目概述

**Anatomy Presentation & Isometric B-Roll Player** 是专为《Anatomy 深度解析》15 章长视频打造的交互式演示与动态 B-Roll 演播系统。系统基于 **TypeScript 5+、React 19、Vite 8、Tailwind CSS v4、shadcn/ui 与 React Router v7** 构建，将 48 组按需懒加载的官方等轴测动态模型、独立 3D WebGL/SVG 机械总成（猛禽 2 号发动机、三维机械指针）与 120 段预制中英双语原声配音深度融合。

### 核心亮点

- 🌐 **在线演示**: [https://anatomy.easynote.cc](https://anatomy.easynote.cc)
- 🎙️ **120 段预制双语原声配音 (Studio Voiceover)**: 内置全量 15 章 × 4 分镜的中英文预合成高保真语音（`public/audio/{zh,en}`，同时提供 `.m4a` 与 `.mp3`），由全局持久化单例 `<audio>` 引擎驱动，彻底禁用机械生硬的浏览器原生 Web Speech TTS。
- ⏱️ **音频真实时长锁定的时间轴与提词器**: 分镜进度条与底部卡拉 OK 字幕高亮直接绑定 `<audio>` 的实时播放进度（`currentTime / duration`），无论是 16 秒长段解说还是 6 秒短句，字幕均匀速贴合人声推进，并在语音播完瞬间平滑切入下一分镜或下一章节。
- 🎬 **口播词与右侧舞台动画精准联动**:
  - **`ch01`（机械表机芯 `watch`）**：随解说词自动触发 `Shift+W` 上发条储能、`S` 键 `1/20×` 慢镜观察 15 齿擒纵轮半齿释放、`E` 键升起夹板展示齿轮比，以及 `Escape` 整机复位。
  - **`ch07`（计算机科学隐喻）**：第 1 分镜按音频进度在 55% 处自动由 `hash-map`（邮局分拣室）切换至 `bloom-filter`（机械探针），随后依次联动 `mutex`、`tcp-handshake` 与 `sampling`。
  - **`ch08` / `ch11` / `ch15`（3D 猛禽发动机与三维指针）**：自动驱动 `raptor-engine.html` 完成 11 级组件悬停轴向拆解（`RAPTOR_EXPLODE`）与 300 bar 主燃烧室尾焰点火（`RAPTOR_IGNITE`），以及 `turning-dial.html` 的真三维旋转指针演示。
- 🧭 **现代化 HUD 与无遮挡交互控件 (`shadcn/ui` + `lucide-react`)**:
  - **右上角图标工具栏**：集成语音开关、中英切换、字幕开关、深浅主题、全屏切换与 GitHub 仓库入口，全部采用精简图标 + 悬停 Tooltip 提示。
  - **右侧舞台居中悬停播放条**：半透明圆角胶囊（上一页 / 播放暂停 / 下一页），默认隐藏保持画面纯净，鼠标悬停至右侧舞台时平滑浮现，并自动适配深色与浅色背景。
  - **底部独立提词器栏**：全宽展示当前口播字幕与 3D 机械键帽快捷键提示，与工具栏零重叠。
- 🌓 **深色 / 浅色双主题全链路同步**: 一键切换暗黑工业风（`#111110`）与浅色图纸风（`#f5f4ef`），顶栏、卡片、SVG 材质令牌、悬停播放条及内嵌 `iframe` 舞台背景全部实时同步。
- 🖥️ **100% 铺满整屏无留白**: 动态计算 `--stage-scale`、`--stage-w` 与 `--stage-h`，在 16:9、16:10 MacBook 或带鱼屏上均 100% 贴合 `100vw × 100vh` 边缘无黑边/灰边；同时在 `?export=1` 录制模式下严格锁定 `1920×1080` 标准画幅。
- 🛡️ **纯 TypeScript 工程规范**: 仓库源码 100% 采用 `.ts` / `.tsx`，零 `.js` / `.mjs` 文件；Node.js 22+ 直接通过 `--experimental-strip-types` 原生运行测试与构建脚本。

---

## 性能基准对比

| 评估指标 | 优化前（单体大包） | 优化后（按需分包） | 优化效果 |
| :--- | :--- | :--- | :--- |
| **首屏 JS 包体积** | 21.1 MB (同步阻塞 JS) | **~145 KB (gzip)** | **体积缩减 145 倍** |
| **首屏绘制耗时 (FCP)** | 5,000 ~ 15,000 ms | **< 10 ms** (内联 CSS 骨架屏) | **零白屏秒开** |
| **舞台部件加载** | 全量同步打包 | `React.lazy()` 按需动态分包 | 仅加载当前章节对应部件 |
| **跨段语音连续性** | 切段新建实例易被浏览器拦截中断 | 全局单例 `<audio>` 复用 | 切段与切章全程连贯不中断 |
| **语言与主题切换** | 刷新重载 | 响应式状态 + CSS 变量即时同步 | 零延迟无感切换 |

---

## 演播控制与快捷键说明

系统支持键盘快捷键、**右上角图标工具栏**以及**右侧舞台底部悬停播放条**多维交互：

| 所在区域 | 按钮 / 图标 | 快捷键 | 动作 | 功能说明 |
| :---: | :---: | :---: | :--- | :--- |
| **舞台悬停播放条** | `ChevronLeft` | <kbd>←</kbd> | **上一页 (Prev)** | 切换至上一章节 |
| **舞台悬停播放条** | `Play` / `Pause` | <kbd>Space</kbd> | **播放 / 暂停** | 启停当前章节演播与原声语音朗读 |
| **舞台悬停播放条** | `ChevronRight` | <kbd>→</kbd> | **下一页 (Next)** | 切换至下一章节（如 `/ch01` → `/ch02`） |
| **顶栏进度 / 左侧卡片** | 分镜 `01`–`04` | <kbd>1</kbd> ~ <kbd>4</kbd> | **分镜跳转** | 直接跳至当前章节的第 1、2、3、4 分镜 |
| **右上角工具栏** | `Volume2` / `VolumeX` | 点击 | **语音开关** | 开启或静音预制原声语音讲解 |
| **右上角工具栏** | `Languages` | 点击 | **中英切换** | 在中文与英文文案、字幕及配音间实时切换 |
| **右上角工具栏** | `Captions` | <kbd>C</kbd> | **字幕开关** | 显示或隐藏底部逐字提词器栏 |
| **右上角工具栏** | `Sun` / `Moon` | 点击 | **深浅色切换** | 在深色模式（`#111110`）与浅色模式（`#f5f4ef`）间切换 |
| **右上角工具栏** | `Maximize2` | <kbd>F</kbd> | **全屏模式** | 进入或退出全屏演示模式 |
| **右上角工具栏** | `GitHub` | 点击 | **GitHub 仓库** | 新标签页打开 `https://github.com/h1bomb/anatomy-presentation` |

---

## 技术架构目录

```text
anatomy-presentation/
├── index.html                        # <3KB 内联 CSS 极速骨架屏、Favicon 与根挂载点
├── vite.config.ts                    # Vite 8 配置（集成 Tailwind CSS v4、@ 别名与手动分包）
├── tsconfig.json                     # 严格 TypeScript 编译配置
├── package.json                      # Node >= 22.18.0，原生 TypeScript 测试与构建脚本
├── scripts/
│   └── generate-minimax-audio.ts     # MiniMax T2A 双语语音批量生成脚本（纯环境变量注入）
├── public/
│   ├── favicon.svg / favicon.ico     # 等轴测机械机芯蓝图风格站点图标
│   ├── assets/                       # 独立 3D WebGL/SVG 舞台资源（raptor-engine, turning-dial 等）
│   └── audio/
│       ├── zh/                       # 60 段中文原声配音（ch01_0..ch15_3，含 .m4a 与 .mp3）
│       └── en/                       # 60 段英文原声配音（ch01_0..ch15_3，含 .m4a 与 .mp3）
├── src/
│   ├── main.tsx                      # 应用启动入口与虚拟时钟注册
│   ├── router.tsx                    # React Router v7 路由定义 (/ch01 ~ /ch15)
│   ├── App.tsx                       # 全屏无留白视口缩放引擎 (--stage-scale, --stage-w, --stage-h)
│   ├── App.css                       # Tailwind CSS v4、深浅色主题令牌、HUD 与键帽样式
│   ├── types.ts                      # 核心类型定义：Language, Theme, Chapter, Beat, Bilingual
│   ├── data/
│   │   └── chapters.ts               # 15 章原版中英文口播稿、指标卡、遥测读数与舞台部件映射
│   ├── utils/
│   │   └── speech.ts                 # 全局单例 HTMLAudioElement 语音引擎与 Web Audio 解锁音效
│   ├── kit/
│   │   ├── iso-kit.ts                # 纯 TypeScript 等轴测几何与投影计算工具
│   │   └── iso.css                   # Anatomy 官方等轴测设计令牌与 CSS 变量
│   ├── machines/
│   │   ├── figure-loader.tsx         # 48 组官方部件的 React.lazy() 按需加载注册表
│   │   └── custom-machines.ts        # 纯 TypeScript 编写的定制等轴测矢量机械生成器
│   ├── components/
│   │   ├── TopBar.tsx                # 顶部状态栏、4 段分镜进度槽与右上角 shadcn 图标工具栏
│   │   ├── SlideNarrative.tsx        # 核心命题横幅、4 节拍演进卡片栈与底部要点铭牌
│   │   ├── IsometricStage.tsx        # 动态舞台加载器、自动化动作驱动器与居中悬停播放条
│   │   ├── Teleprompter.tsx          # 音频进度同步的逐字高亮提词器与 3D 机械键帽快捷键提示
│   │   ├── LoadingScreen.tsx         # 舞台 Suspense 骨架屏与全屏加载器
│   │   ├── CornerMarks.tsx           # 四角工程十字准星
│   │   └── ui/                       # shadcn/ui Button 与 Tooltip 基础组件
│   └── pages/
│       └── ChapterPlayer.tsx         # 核心演播控制器（驱动音频时长同步、时间轴、快捷键与路由）
└── tests/
    ├── chapters-data.test.ts         # 校验 15 章节结构、节拍边界与中英双语文案完整性
    ├── custom-machines.test.ts       # 校验定制等轴测机械 SVG 生成器
    ├── i18n-theme-speech.test.ts     # 校验双语一致性与无头环境下语音工具安全性
    └── vite-build.test.ts            # 校验生产构建分包与首屏骨架屏完整性
```

关于渲染管线、音频时长锁定状态机以及虚拟时钟视频导出协议的详细设计，请参阅 [docs/ARCHITECTURE_zh.md](docs/ARCHITECTURE_zh.md)。

---

## 本地开发指南

### 环境依赖

- **Node.js**: `>= 22.18.0`（使用 Node 22 原生 `--experimental-strip-types`）
- **npm**: `>= 10.0.0`

### 安装与启动

```bash
git clone https://github.com/h1bomb/anatomy-presentation.git
cd anatomy-presentation
npm install
npm run dev
```

浏览器访问 `http://localhost:3000` 即可体验交互式演播系统。

### 运行单元测试与生产构建

```bash
# 运行原生 TypeScript 单元测试（6/6 通过）
npm test

# 执行类型检查并构建生产静态包至 dist/
npm run build
npm run preview
```

---

## 预制原声语音与生成管线

仓库已内置全部 120 段中英文音频文件（位于 `public/audio/zh/` 与 `public/audio/en/`）。若修改了 [`src/data/chapters.ts`](src/data/chapters.ts) 中的 `scriptText` 口播词，可通过环境变量传入 MiniMax 凭证重新生成音频（需安装 `ffmpeg` 以同步转码 `.m4a`）：

```bash
MINIMAX_API_KEY="your_api_key" \
MINIMAX_VOICE_ID="your_voice_id" \
node --experimental-strip-types scripts/generate-minimax-audio.ts
```

可选环境变量：
- `MINIMAX_MODEL`：默认使用 `speech-2.8-hd`。
- `MINIMAX_CONCURRENCY`：并发工作协程数（默认为 `1`，平滑适配 RPM 速率限制）。
- `SKIP_RECENT_MINUTES`：跳过最近 $N$ 分钟内已生成的音频文件，支持断点续传。

---

## 开源协议

ISC License. 等轴测视觉组件基于 Ryan 的 Anatomy 项目构建。
