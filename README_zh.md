<div align="center">

# Anatomy 15章深度解析 · 等轴测动态演播系统

**1920×1080 高精交互式等轴测演示与 B-Roll 演播系统，涵盖 Anatomy 深度解析 15 章全流程。**

[![CI](https://github.com/h1bomb/anatomy-presentation/actions/workflows/ci.yml/badge.svg)](https://github.com/h1bomb/anatomy-presentation/actions/workflows/ci.yml)
[![Version](https://img.shields.io/badge/version-1.0.0-e5a93c.svg)](package.json)
[![License: ISC](https://img.shields.io/badge/license-ISC-blue.svg)](LICENSE)
[![React 19](https://img.shields.io/badge/React-19.3-61dafb?logo=react&logoColor=white)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-7.0-3178c6?logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-8.3-646cff?logo=vite&logoColor=white)](https://vitejs.dev)
[![React Router](https://img.shields.io/badge/React_Router-v7-ca4245?logo=reactrouter&logoColor=white)](https://reactrouter.com)
[![Bundle Size](https://img.shields.io/badge/initial%20bundle-130%20KB%20(gzip)-brightgreen)](#性能基准对比)
[![FCP](https://img.shields.io/badge/FCP-%3C%2010ms-success)](#性能基准对比)
[![Tests](https://img.shields.io/badge/tests-4%2F4%20passing-brightgreen)](tests/)
[![Live Demo](https://img.shields.io/badge/live%20demo-anatomy.easynote.cc-e5a93c?style=flat&logo=safari&logoColor=white)](https://anatomy.easynote.cc)

[English](README.md) · **简体中文**

<br/>

[![Anatomy 演播系统预览](docs/preview.png)](https://anatomy.easynote.cc)

*线上交互式机械表机芯（Calibre 15T），包含 4 节拍演进旁白卡片堆栈、实时遥测仪表与逐字卡拉OK式字幕提词 HUD。*

</div>

---

## 项目概述

**Anatomy Presentation & Isometric B-Roll Player** 是专为《Anatomy 深度解析》系列定制开发的高精交互式演示与动态演播系统。系统基于 **TypeScript 7 + React 19 + Vite 8 + React Router v7** 构建，拥有极致的暗色工业美学、零白屏秒开与按章节组件级懒加载能力。

### 核心亮点

- 🌐 **在线演示**: [https://anatomy.easynote.cc](https://anatomy.easynote.cc)
- 🖥️ **响应式 1920×1080 视口**: 固定 16:9 物理画布，基于 CSS 矩阵自适应任意浏览器窗口比例，无裁切居中等比缩放。
- 🎨 **Anatomy 官方暗色系调色盘**: 标志性 `#111110` 背景，四级等轴测明暗渐变，`#e5a93c` 金色点缀。
- ⚡ **零白屏极速体验**: HTML 内置原生内联 CSS 骨架屏，`< 10ms` 瞬时绘制，彻底消除脚本下载阶段的空白。
- 📦 **组件级按需懒加载**: 48 组矢量与 3D 等轴测部件全面基于 `React.lazy()` 代码分割，每章仅按需下载独立代码块。
- ⏱️ **确定性虚拟时钟与渲染接口**: 挂载 `window.__renderFrame(chIndex, timeSec)` 与 `window.__stepOfficialClock`，保证 CDP 无头浏览器逐帧录制与离线高清导出 100% 可重现。
- 🎙️ **卡拉OK逐字提词 HUD**: 根据节拍进度实时高亮当前发音汉字，与口播严格同步。

---

## 性能基准对比

| 评估指标 | 优化前（单体大包） | 优化后（按需分包） | 优化效果 |
| :--- | :--- | :--- | :--- |
| **首屏包体积** | 21.1 MB (同步阻塞 JS) | **130 KB (gzip)** | **体积削减 160 倍** |
| **首屏绘制耗时 (FCP)** | 5,000 ~ 15,000 ms | **< 10 ms** (内联骨架屏) | **实现零白屏秒开** |
| **部件加载策略** | 全量同步加载 | 动态按需引入 (`React.lazy`) | 仅加载当前章节 chunk (~300KB) |
| **切章过渡效果** | 白屏阻塞 | HUD 脉冲光环悬浮骨架屏 | 平滑暗色过渡，无视觉跳跃 |

---

## 演播控制与键盘快捷键

| 快捷键 | 动作 | 说明 |
| :---: | :--- | :--- |
| <kbd>Space</kbd> | **播放 / 暂停** | 切换当前章节时间轴的自动播放状态 |
| <kbd>→</kbd> | **下一章** | 切换至下一章节并自动同步浏览器 URL 路由（如 `/ch01` → `/ch02`） |
| <kbd>←</kbd> | **上一章** | 回退至上一章节 |
| <kbd>1</kbd> ~ <kbd>4</kbd> | **快速跳拍** | 分别跳转至当前章节第 1 拍 (0s)、第 2 拍 (10s)、第 3 拍 (20s) 或第 4 拍 (30s) |
| <kbd>C</kbd> | **切换字幕** | 显示或隐藏底部卡拉OK提词 HUD |
| <kbd>F</kbd> | **全屏切换** | 进入或退出全屏演示演播模式 |

---

## 技术架构与目录结构

```
opencode-gemini4/
├── index.html                  # 零白屏内联 CSS 骨架屏 (<3KB) 与 Vite 挂载入口
├── vite.config.ts              # Vite 8 配置（手动分包 React/Router，支持按需动态引入）
├── tsconfig.json               # TypeScript 7 强类型编译配置
├── public/
│   └── assets/                 # 官方 3D 嵌入模型 (raptor-engine 等独立交互部件)
├── src/
│   ├── main.tsx                # 应用挂载入口与确定性虚拟时钟钩子
│   ├── router.tsx              # React Router v7 路由定义 (/ch01 ~ /ch15)
│   ├── App.tsx                 # 自适应等比缩放视口容器与页面框架
│   ├── types.ts                # 核心类型接口：Chapter, Beat, ChapterState, FigureProps
│   ├── data/
│   │   └── chapters.ts         # 15 个完整章节的标题、核心命题、4 节拍文案与遥测数据
│   ├── kit/
│   │   ├── iso-kit.ts          # 纯 TypeScript 等轴测几何、投影与参数化矢量引擎
│   │   └── iso.css             # Anatomy 官方设计系统 Token 与 CSS 变量
│   ├── machines/
│   │   └── figure-loader.tsx   # 48 组官方部件的 React.lazy() 动态映射表
│   ├── components/
│   │   ├── TopBar.tsx          # FIG 标签、章节标题、节拍进度指示槽与遥测读数
│   │   ├── SlideNarrative.tsx  # 核心命题横幅、4 节拍推进卡片堆栈与 Takeaway 板块
│   │   ├── Teleprompter.tsx    # 卡拉OK逐字口播提词条与键盘操作提示
│   │   ├── IsometricStage.tsx  # 动态等轴测舞台（含 Suspense 骨架屏与运镜微晃）
│   │   ├── LoadingScreen.tsx   # 舞台 HUD 骨架屏与全屏加载旋转刻度盘
│   │   └── CornerMarks.tsx     # 4 处技术十字定位标记
│   └── pages/
│       └── ChapterPlayer.tsx   # 主播放器驱动器，协调时间轴、动画循环与 renderFrame
└── tests/
    ├── chapters-data.test.mjs  # 校验 15 章节数据与节拍时间跨度
    ├── custom-machines.test.mjs# 校验参数化等轴测 SVG 生成器
    └── vite-build.test.mjs     # 校验 Vite 代码分割产物与零白屏首屏
```

---

## 本地开发与构建

### 环境要求

- **Node.js**: `>= 20.10.0`
- **npm**: `>= 10.0.0`

### 安装项目依赖

```bash
git clone https://github.com/h1bomb/anatomy-presentation.git
cd anatomy-presentation
npm install
```

### 本地热更新开发

启动 Vite 开发服务器：

```bash
npm run dev
```

在浏览器打开 [http://localhost:3000](http://localhost:3000) 即可进行实时热更新调试。

### 运行自检测试

执行自动化单元测试套件：

```bash
npm test
```

### 生产环境打包

执行 TypeScript 静态类型检查与 Vite 生产打包：

```bash
npm run build
```

构建生成的静态资源将放置在 `dist/` 目录：
- `dist/index.html` & `dist/broll-player.html`: 演播主入口（含零白屏内联骨架屏）。
- `dist/assets/`: 
  - `vendor-react-*.js` & `vendor-router-*.js`: 基础公共依赖分包。
  - `index-*.js` & `index-*.css`: 核心播放器与控制器逻辑。
  - `watch-*.js`, `turbofan-*.js`...: 48 组按需懒加载代码块。

### 本地预览构建产物

在本地预览生产打包文件：

```bash
npm run preview
```

---

## 持续集成 (CI)

向 `main` 分支提交代码或发起 Pull Request 时，将自动触发 GitHub Actions CI 工作流：
- **依赖缓存与安装**（基于 npm clean install）。
- **自动化测试校验**（`npm test` 验证 15 章配置与矢量算法）。
- **静态站点打包**（`npm run build`）。
- **产物完整性校验**（确保分包产物与内联骨架屏正确生成）。

---

## 开源协议

本项目采用 [ISC License](LICENSE) 授权许可。
