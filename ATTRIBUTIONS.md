# 第三方与开源出处（ATTRIBUTIONS）

本项目在多个开源项目基础上进行改造与融合，遵循各自的开源许可。

## 直接依赖（随项目分发）

| 项目 | 许可 | 用途 | 我的改动 |
|---|---|---|---|
| [react-odontogram](https://github.com/biomathcode/react-odontogram) | MIT | 牙位图（odontogram）核心组件 | 叠加「画笔式逐个标记 → 条件着色 → 档案概览 → 文本导出」的交互层 |
| React / React-DOM | MIT | 前端框架 | — |
| Vite | MIT | 构建工具 | 配置相对 base，适配静态部署 |
| Tailwind CSS v4 | MIT | 样式 | 自定义口腔医疗主题色板 |

## 思路 / 概念参考（未直接复制代码）

| 项目 | 许可 | 参考点 |
|---|---|---|
| [nilspreusker/toothbrush-timer](https://github.com/nilspreusker/toothbrush-timer) | 开源 | 2 分钟刷牙计时概念，已重写为巴氏分区引导 |
| [Madmin27/dental-knowledge-base](https://github.com/Madmin27/dental-knowledge-base) | 开源 | 牙科科普内容的结构化组织思路 |
| [kirill-markin/flashcards-open-source-app](https://github.com/kirill-markin/flashcards-open-source-app) | 开源 | 间隔重复/自测交互的参考（后续扩展方向） |

> 说明：`frpnasr-hash/dental-anatomy-atlas` 等同名项目因**未提供开源许可**，本项目仅将其作为公开资料级思路参考，**未复制其任何代码或资源**。

## 数据来源

牙位编号采用国际通用的 **FDI 牙位记录法**；乳/恒牙萌出月龄区间、常见口腔疾病与护理建议
整理自公开口腔健康科普资料（如中华口腔医学会、WHO 口腔健康要点等通识内容），
属公共常识范畴，用于科普演示，非诊断依据。
