# Global Ascent

制作留学APP的原型交互应用，专门针对高三和大四想申请海外大学（包含中国香港、英国、美国、加拿大等）的本科和研究生同学：

1. 智能筛选与匹配引擎模块：
- 身份选择：申请本科 vs 申请研究生。
- 意向留学地区：中国香港、英国、美国、加拿大等多选。
- 专业大类与具体方向：Engineering、Computer Science、Economics & Business、Social Sciences 等。
- 生源背景与学制细致匹配：
  * 高考生：智能筛选接受高考成绩的海外与香港名校，标明高考分数要求与语言（雅思/托福）要求；
  * 国际课程体系：支持 A-Level、IB、AP、HKDSE 等不同体制的分数输入与自动折算；
  * 申研同学：录入本科院校层次（985/211/双非/海本）与 GPA。
- 检索匹配结果：按保底校（Safety）、匹配校（Target）、冲刺校（Reach）分层卡片展示符合条件的大学项目及具体专业要求，支持筛选结果收藏与对比。全部检索匹配功能免费开放。

2. 在读学长学姐 1v1 咨询与预约模块：
- 在专业卡片中直接关联该校该专业在读的认证学长学姐（展示大学官方认证标签、当年申请录取背景、评分与咨询次数）；
- 提供导师个人主页、服务类型（如 15 分钟快速答疑、45 分钟深度申请复盘、文书批注）与透明标价；
- 支持模拟发起对话沟通、选择可预约时间槽以及模拟托管支付流程。

界面采用现代、清晰、专业且富有名校学术感的 UI 风格（适配桌面端与移动端响应式体验）。

This project was built with [Lovable](https://lovable.dev).

**Live app**: https://global-pathfinder-10.lovable.app

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/eed61428-501b-415b-bfd2-0d7c9d7967f1).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
