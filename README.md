# Anatomy 15-Chapter Presentation & Isometric B-Roll Player

> 1920×1080 等轴测动态 B-Roll 与交互式演播系统，涵盖 Anatomy 深度解析 15 章全流程。
> 基于 **TypeScript + Vite + React 19 + React Router v7** 全新重构，支持按章节代码分割懒加载与即时暗色 Loading 首屏。

- 🌐 **在线演示**: [https://anatomy.easynote.cc](https://anatomy.easynote.cc)
- 🖥️ **视口设计**: 1920 × 1080 (16:9 物理画布，CSS 矩阵自适应任意视口与窗口缩放)
- 🎨 **主题风格**: Anatomy 官方暗色系调色盘 (`#111110` 背景，四级明暗渐变，`#e5a93c` 金色点缀)
- ⚡ **性能优化**: 首屏体积从 21MB 骤降至 **130KB (gzip)**，首屏内联骨架屏 < 10ms 即时渲染，48 组部件按需动态引入，彻底告别白屏

---

## 技术架构

- **前端框架**: React 19 + TypeScript 7
- **构建工具**: Vite 8 (Rollup 手动 Chunk 分包 + ESM 动态引入)
- **路由系统**: React Router v7 (`/ch01` ~ `/ch15`，自动兜底与重定向，支持 URL 参数联动)
- **按需分包**: 48 组 `anatomy-figures` 矢量与 3D 等轴测组件全面采用 `React.lazy()` 懒加载，每章仅按需拉取独立 chunk
- **零白屏首屏**: `index.html` 包含 < 3KB 的原生内联暗色 Loading 指示器与金色发光环旋转动画，JS 解析前即刻呈现
- **确定性虚拟时钟**: 挂载 `window.__renderFrame(chIndex, timeSec)` 与 `window.__stepOfficialClock`，保证 CDP 自动化逐帧视频导出与离线渲染严格可重现

---

## 演播交互控制

- `Space`: 播放 / 暂停
- `←` / `→`: 上一章 / 下一章（同步更新浏览器路由与历史记录）
- `1` ~ `4`: 快速跳转至当前章节第 1 ~ 4 拍（0s / 10s / 20s / 30s）
- `C`: 切换显示 / 隐藏底部提词与逐字卡拉OK式口播 HUD
- `F`: 全屏切换

---

## 本地开发与构建

### 环境要求
- Node.js >= 20.10.0
- npm >= 10.0.0

### 安装依赖
```bash
npm install
```

### 本地热更新开发
```bash
npm run dev
```

### 运行自动化测试
```bash
npm test
```

### 生产环境打包
```bash
npm run build
```
构建产物输出至 `dist/` 目录：
- `dist/index.html` & `dist/broll-player.html`: 演播主入口（含零白屏内联 Loading 骨架屏）
- `dist/assets/`: 
  - `vendor-react-*.js` & `vendor-router-*.js`: 基础公共依赖分包
  - `index-*.js` & `index-*.css`: 核心演播播放器与控制器
  - `watch-*.js`, `turbofan-*.js`...: 48 组等轴测机构按需懒加载代码块

---

## CI/CD 自动化构建

本项目集成 GitHub Actions 自动化持续集成工作流：
- 每次向 `main` 分支提交代码或发起 Pull Request 时自动触发
- 自动执行依赖安装、自动化测试（`npm test`）、TypeScript 编译与 Vite 生产打包（`npm run build`）
- 自动校验产物完整性与代码分割 chunks
