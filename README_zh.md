<div align="center">

# Anatomy 15章深度解析 · 等轴测动态演播系统

**1920×1080 高精交互式等轴测演示与 B-Roll 演播系统，涵盖 Anatomy 深度解析 15 章全流程。**

[![CI](https://github.com/h1bomb/anatomy-presentation/actions/workflows/ci.yml/badge.svg)](https://github.com/h1bomb/anatomy-presentation/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-1.0.0-e5a93c.svg)](package.json)
[![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![Node.js](https://img.shields.io/badge/Node.js-%3E%3D22.18.0-339933?logo=node.js&logoColor=white)](package.json)
[![TypeScript](https://img.shields.io/badge/TypeScript-100%25-3178c6?logo=typescript&logoColor=white)](tsconfig.json)
[![React 19](https://img.shields.io/badge/React-19.3-61dafb?logo=react&logoColor=white)](https://react.dev)
[![Tailwind CSS v4](https://img.shields.io/badge/Tailwind_CSS-v4-38bdf8?logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Vite 8](https://img.shields.io/badge/Vite-8.3-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![React Router](https://img.shields.io/badge/React_Router-v7-ca4245?logo=reactrouter&logoColor=white)](https://reactrouter.com)
[![Web Speech API](https://img.shields.io/badge/Web_Speech_API-内置语音-e5a93c)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API)
[![Tests](https://img.shields.io/badge/tests-5%2F5%20passing-brightgreen)](tests/)
[![Live Demo](https://img.shields.io/badge/在线演示-anatomy.easynote.cc-e5a93c?style=flat&logo=safari&logoColor=white)](https://anatomy.easynote.cc)

[English](README.md) · **简体中文**

<br/>

[![Anatomy 演播系统预览](docs/preview.png)](https://anatomy.easynote.cc)

*线上交互式机械表机芯（Calibre 15T），包含 4 节拍演进旁白卡片堆栈、实时遥测仪表、3D 机械键盘按键中控台与逐字卡拉OK式字幕提词 HUD。*

</div>

---

## 项目概述

**Anatomy Presentation & Isometric B-Roll Player** 是专为《Anatomy 深度解析》系列定制开发的高精交互式演示与动态演播系统。系统基于 **TypeScript + React 19 + Vite 8 + Tailwind CSS v4 + React Router v7** 构建，拥有极致的双色调工业美学、零白屏秒开与按章节组件级懒加载能力。

### 核心亮点

- 🌐 **在线演示**: [https://anatomy.easynote.cc](https://anatomy.easynote.cc)
- 🌏 **中英文双语支持 (Bilingual i18n)**: 15 个章节、60 个分节拍全量配备高质量专业中英文文本，一键无感实时切换。
- 🌓 **深浅色双主题引擎 (Dark/Light Themes)**: 右下角中控台一键切换暗黑工业风（`#111110`）与日光工装风（`#f5f4ef`），所有等轴测机器自动应用配套光照材质。
- ⌨️ **3D 机械键盘按钮样式 (Mechanical Keycaps)**: 底部控制台操作提示采用真实 3D 机械轴键帽造型，大字号、斜面立体边框、下沉触感阴影与按压回弹交互。
- 🎙️ **浏览器原生语音朗读 (Web Speech API)**: 深度集成 `window.speechSynthesis` 接口，根据当前激活语言（`zh-CN` 或 `en-US`）进行口播文稿的自然语音同步播报，支持一键启闭与智能暂停。
- ◀▶ **显式上一页/下一页导航 (Prev/Next Buttons)**: 中控台常驻醒目的上一章与下一章机械按键，支持点击与键盘箭头无缝联动。
- 🎨 **Tailwind CSS v4 全新集成**: 基于 `@tailwindcss/vite` 原生插件，现代化工具类极速编译。
- 🛡️ **严格零 JavaScript 规范 (Zero-JS Policy)**: 项目严禁出现任何 `.js`、`.mjs` 文件，源码 100% 纯 TypeScript；Node.js 22.18.0+ 原生直接通过 `--experimental-strip-types` 运行测试。
- 🖥️ **响应式 1920×1080 视口**: 固定 16:9 物理画布，基于 CSS 矩阵自适应任意浏览器窗口比例，无裁切居中等比缩放。
- ⚡ **零白屏极速体验**: HTML 内置原生内联 CSS 骨架屏，`< 10ms` 瞬时绘制，彻底消除空白。
- 📦 **组件级按需懒加载**: 48 组矢量与 3D 等轴测部件全面基于 `React.lazy()` 代码分割，每章仅按需下载独立代码块。

---

## 性能基准对比

| 评估指标 | 优化前（单体大包） | 优化后（按需分包） | 优化效果 |
| :--- | :--- | :--- | :--- |
| **首屏包体积** | 21.1 MB (同步阻塞 JS) | **130 KB (gzip)** | **体积削减 160 倍** |
| **首屏绘制耗时 (FCP)** | 5,000 ~ 15,000 ms | **< 10 ms** (内联骨架屏) | **实现零白屏秒开** |
| **部件加载策略** | 全量同步加载 | 动态按需引入 (`React.lazy`) | 仅加载当前章节 chunk (~300KB) |
| **切章过渡效果** | 白屏阻塞 | HUD 脉冲光环悬浮骨架屏 | 平滑暗色过渡，无视觉跳跃 |
| **语言与主题切换** | 需刷新页面重载 | 纯 DOM 响应式即时渲染 | 零延迟无刷新切换 |

---

## 演播控制与键盘快捷键

系统提供快捷键和右下角可点击的 3D 机械键帽中控台双模交互：

| 控件按钮 | 键盘快捷键 | 动作 | 功能说明 |
| :---: | :---: | :--- | :--- |
| **上一章** | <kbd>←</kbd> | **上一章 (Prev)** | 返回上一章节并切换路由地址 |
| **播放 / 暂停** | <kbd>Space</kbd> | **播放/暂停 (Play/Pause)** | 启停当前章节的 40 秒连续演播循环 |
| **下一章** | <kbd>→</kbd> | **下一章 (Next)** | 进入下一章节并更新路由地址 |
| **语音朗读** | 点击 | **开启/关闭语音朗读** | 切换浏览器原生 Web Speech API 同步口播语音 |
| **中 / EN** | 点击 | **切换语言 (Language)** | 在中文和英文之间实时无感切换 |
| **深色 / 浅色** | 点击 | **切换主题 (Theme)** | 在深色铸铁模式与浅色工装模式间切换 |
| **节拍跳转** | <kbd>1</kbd> ~ <kbd>4</kbd> | **快速定位节拍** | 快速跳转至 00s、10s、20s 或 30s 对应小节 |
| **字幕开关** | <kbd>C</kbd> | **字幕开关 (Captions)** | 显示或隐藏底部提词与解说面板 |
| **全屏模式** | <kbd>F</kbd> | **全屏演播 (Fullscreen)** | 进入或退出 16:9 全屏专注演播视口 |

---

## 技术架构目录

```
anatomy-presentation/
├── index.html                  # 极简秒开内联 CSS 骨架屏 (<3KB) 与根挂载点
├── vite.config.ts              # Vite 8 配置（集成 Tailwind CSS v4 与 Rollup 手动分包）
├── tsconfig.json               # 严格 TypeScript 编译器配置（启用 allowImportingTsExtensions）
├── package.json                # "engines": { "node": ">=22.18.0" }，纯 TS 原生测试指令
├── public/
│   └── assets/                 # 独立 3D 等轴测模型资源包（猛禽发动机等）
├── src/
│   ├── main.tsx                # 应用启动入口与虚拟时钟钩子
│   ├── router.tsx              # React Router v7 路由定义 (/ch01 ~ /ch15)
│   ├── App.tsx                 # 视口自适应缩放容器与布局
│   ├── App.css                 # Tailwind CSS、深浅主题变量、3D 机械键帽样式
│   ├── types.ts                # 强类型定义：Language, Theme, Chapter, Beat, Bilingual
│   ├── data/
│   │   └── chapters.ts         # 15 章全量中英文双语文稿、节拍、动效指令与翻译工具函数
│   ├── kit/
│   │   ├── iso-kit.ts          # 纯 TypeScript 等轴测几何解算与投影引擎
│   │   └── iso.css             # Anatomy 官方设计令牌与 CSS 变量
│   ├── machines/
│   │   ├── figure-loader.tsx   # 48 组官方部件的 React.lazy() 动态加载注册表
│   │   └── custom-machines.ts  # 9 台纯 TypeScript 严格编写的等轴测定制机械
│   ├── components/
│   │   ├── TopBar.tsx          # 双语顶栏、FIG 标识、节拍进度槽与状态遥测
│   │   ├── SlideNarrative.tsx  # 核心命题看板、4 节拍演进卡片组与结论展示
│   │   ├── Teleprompter.tsx    # 提词字幕 HUD、卡拉OK同步高亮与大字号按键提示
│   │   ├── IsometricStage.tsx  # 动态模型加载器（带 Suspense 骨架屏与相机微动）
│   │   ├── ControlsDock.tsx    # 右下角 3D 机械键帽中控台
│   │   ├── LoadingScreen.tsx   # HUD 悬浮脉冲骨架屏与全屏加载动画
│   │   └── CornerMarks.tsx     # 4 组四角工程十字准星
│   └── pages/
│       └── ChapterPlayer.tsx   # 核心演播控制器（管理时间轴、语音合成与全局交互）
└── tests/
    ├── chapters-data.test.ts   # 校验 15 章节元数据、节拍边界与双语覆盖率
    ├── custom-machines.test.ts # 校验定制等轴测机械生成的 SVG 与动画钩子 (TS)
    ├── i18n-theme-speech.test.ts # 校验中英文双语一致性与语音朗读元数据
    └── vite-build.test.ts      # 校验产物代码分割完整性与零白屏骨架屏
```

---

## 本地开发指南

### 环境依赖

- **Node.js**: `>= 22.18.0`（Node 22 原生支持 TypeScript `--experimental-strip-types`）
- **npm**: `>= 10.0.0`

### 安装与运行

```bash
git clone https://github.com/h1bomb/anatomy-presentation.git
cd anatomy-presentation
npm install
npm run dev
```

浏览器打开 `http://localhost:3000` 即可启动交互演播系统。

### 原生 TypeScript 单元测试

无需任何 Babel、ts-node 或打包编译步骤，直接由 Node.js 22+ 原生直接剥离类型执行测试：

```bash
npm test
```

### 生产环境构建

```bash
npm run build
npm run preview
```

---

## 开源协议

ISC License. 基于 Anatomy 视觉解释系统开发。
