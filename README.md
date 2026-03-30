# 笔记 BS 系统

基于 React + Firebase 的交互式复习笔记，支持 SM-2 间隔重复算法。

## 本地开发

```bash
# 1. 安装依赖
npm install

# 2. 配置 Firebase
cp .env.example .env
# 填入 Firebase 项目配置

# 3. 启动开发服务器
npm run dev
```

## 追加笔记

```bash
# 1. 把新内容发给 LLM，附上 PARSE_FORMAT_GUIDE.md

# 2. 复制 LLM 修正后的内容到 note.md

# 3. 运行解析脚本
node ../parse-notes.ts note.md notes.json

# 4. 把新的 notes.json 复制到 public/
cp notes.json public/

# 5. 提交
git add note.md notes.json public/notes.json
git commit -m "add chXX"
git push
```

## 部署

推送到 `main` 分支后，GitHub Actions 自动构建并部署到 GitHub Pages。

首次部署需要：
1. 在 GitHub 仓库设置中启用 GitHub Pages，Source 选 "GitHub Actions"
2. 在仓库 Secrets 中添加 Firebase 环境变量（从 `.env.example` 复制）

## 项目结构

```
bs-notes/
├── public/
│   ├── notes.json          # 从 note.md 解析的静态笔记数据
│   └── _headers            # 安全响应头
├── src/
│   ├── components/         # React 组件
│   │   ├── ChapterSidebar.tsx
│   │   ├── MarkdownRenderer.tsx
│   │   ├── FormulaCard.tsx
│   │   ├── ReviewCard.tsx
│   │   ├── ProgressDashboard.tsx
│   │   └── ErrorBoundary.tsx
│   ├── firebase/            # Firebase 配置
│   ├── hooks/               # React hooks（useAuth, useNotes, useReview）
│   ├── lib/                 # 业务逻辑（SM-2, reviewStorage）
│   ├── types.ts             # TypeScript 类型
│   └── App.tsx
└── .github/workflows/deploy.yml
```

## 笔记格式规范

见 [PARSE_FORMAT_GUIDE.md](../PARSE_FORMAT_GUIDE.md)
