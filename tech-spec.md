# 技术规格文档 — 远方观点

## 依赖

| 包名 | 版本 | 用途 |
|------|------|------|
| `react` | ^19.0.0 | UI 框架 |
| `react-dom` | ^19.0.0 | DOM 渲染 |
| `vite` | ^7.2.4 | 构建工具 |
| `@vitejs/plugin-react` | ^4.3.4 | Vite React 插件 |
| `tailwindcss` | ^3.4.19 | 样式系统 |
| `typescript` | ^5.7.0 | 类型系统 |
| `three` | ^0.172.0 | 页脚流体模拟 WebGL 渲染 |
| `gsap` | ^3.12.7 | 卡片级联滚动动画 + ScrollTrigger |
| `lenis` | ^1.3.0 | 惯性平滑滚动 |
| `@vfx-js/core` | ^0.11.6 | 首屏文本液体浸润 WebGL 着色器渲染 |
| `@fontsource/noto-sans-sc` | ^5.0.0 | 中文字体 |

## 组件清单

### shadcn/ui

本项目追求极致极简，不使用任何 shadcn/ui 组件。所有 UI 元素均为极简的纯文本和线框链接。

### 自定义组件

| 组件 | 来源 | 复用 | 说明 |
|------|------|------|------|
| `Navigation` | 自建 | 全局 | 顶部固定导航栏，透明背景，滚动后颜色反转 |
| `SplashText` | 自建 | 首屏一次 | 被 `@vfx-js/core` 接管的文本渲染组件，实现液体浸润效果 |
| `BlogGrid` | 自建 | 一次 | 6篇博客卡片列表容器，包含 SVG 滤镜定义 |
| `BlogCard` | 自建 | 6 次 | 单张博客卡片，包含线框边框、日期、标题、摘要 |
| `FooterFluid` | 自建 | 一次 | 全屏 Three.js 流体模拟画布 + 品牌信息叠加层 |
| `FluidWebGL` | 自建 | FooterFluid 内 | ping-pong 流体模拟核心渲染器 |

### Hooks

| Hook | 说明 |
|------|------|
| `useLenis` | 初始化 Lenis 惯性滚动，管理全局 raf 循环，暴露 velocity 给子组件 |
| `useScrollDirection` | 基于 Lenis 滚动位置检测导航栏颜色反转时机 |

## 动画实现表

| 动画 | 库 | 实现方式 | 复杂度 |
|------|------|----------|--------|
| 首屏文本液体浸润 (farsight-splash-text) | `@vfx-js/core` + 自定义 Fragment Shader | 通过 `@vfx-js/core` 将 DOM 文本捕获为纹理，注入自定义 Fragment Shader 实现径向扭曲、时间驱动的聚合显形、冷白高光扩散效果 | **🔒 High** |
| 液态形变列表卡片 (distorted-blog-grid) | `gsap` + `ScrollTrigger` + SVG `feTurbulence` | 双层动画：① `gsap.quickTo` 响应 Lenis velocity 驱动卡片 `y` 位移和 `feDisplacementMap` 的 `scale` 属性 ② `ScrollTrigger` 驱动滚动区间内卡片从 `y:150` 到 `y:-150` 的级联位移 | **🔒 High** |
| 黑白水墨流体交互 (footer-smoke-fluid-simulation) | `three` + 自定义 GLSL Shader | 双纹理 ping-pong 流体模拟：速度场 `RG` 通道 + 墨迹浓度 `B` 通道，包含回溯平流、耗散、邻域平滑、Divergence-Free 投影、鼠标注入。显示 pass 将墨迹浓度映射为暖白/纯黑混合色 | **🔒 High** |
| 导航栏颜色反转 | CSS transition | 基于滚动位置越过首屏后切换文字颜色，纯 CSS transition | Low |
| 全局平滑滚动 | `lenis` | 全站惯性滚动，`lerp: 0.15`，所有动画系统共享同一 raf 循环 | Low |

## 状态与逻辑

### Lenis ↔ Three.js RAF 循环协调

Lenis 的 `lenis.raf(time)` 必须在 Three.js 的 `renderer.render()` 之后调用。统一使用一个 `requestAnimationFrame` 循环：

```
raf loop:
  1. Three.js 更新纹理 + 渲染流体 (若页脚可见)
  2. @vfx-js/core 更新 (若首屏可见)
  3. lenis.raf(time)
  4. gsap.update() (ScrollTrigger 依赖 Lenis 的 scroll 位置)
```

### 流体模拟统一更新架构

流体系统的状态更新顺序（每帧一次）：
1. 读取鼠标 `pointermove` 数据 → 写入 `uBrush` uniform（位置 XY + 速度 Z）
2. Fluid pass：读取 ping-pong buffer F → 输出到 A（平流+耗散+平滑+投影+注入）
3. Display pass：读取 A → 渲染到屏幕
4. 交换 F ↔ A

### 卡片畸变状态共享

`BlogGrid` 通过 `useLenis` hook 获取全局 `velocity`，然后通过 props 传递给每个 `BlogCard`。每个卡片内部持有：
- 一个 `gsap.quickTo` 实例用于 Y 位移
- 一个 `gsap.quickTo` 实例用于 SVG `feDisplacementMap` 的 `scale`
- 避免在滚动事件中重复创建 `quickTo` 实例

## 其他关键决策

### 中文字体加载
使用 `@fontsource/noto-sans-sc` 的 `300` 和 `400` 字重，在 `main.tsx` 中同步 `import` 确保首屏渲染前字体就绪。

### @vfx-js/core 与 React 的集成模式
`@vfx-js/core` 直接操作 DOM 和 Canvas，不走 React 的虚拟 DOM。`SplashText` 组件使用 `useRef` 获取真实 DOM 节点，在 `useEffect` 中初始化 VFX，在卸载时销毁。

### Three.js 画布层级
页脚流体使用单独的 `<canvas>` 元素，绝对定位在页脚容器内，`z-index: 0`。品牌信息 HTML 叠加层 `z-index: 1` 且 `pointer-events: none`，确保鼠标事件穿透到画布。

### 滚动性能
- 卡片位移和滤镜畸变全部使用 `gsap.quickTo`（基于 RAF 的优化 setter），不在 `scroll` 事件处理器中直接操作 DOM
- Lenis 的 `velocity` 值通过回调机制传递给卡片组件，避免每帧读取
- 流体模拟的 `simResolution` 固定为 `512x512`，与显示分辨率解耦，保证性能稳定
