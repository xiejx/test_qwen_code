# AI智能学习系统

一个基于前后端分离架构的AI智能学习系统，具备以下功能：

## 功能特性

1. **智能学习** - 支持用户选择主题进行学习
2. **智能测验** - 支持对用户学习的内容生成问题，以检验用户的学习成果，支持大模型对用户回答结果进行评分
3. **智能备课** - 针对用户选择的教学内容，生成教学内容

## 技术栈

- 前端：React + Vite
- 后端：Python Flask
- 数据库：模拟数据（可扩展为真实数据库）

## 项目结构

```
ai-learning-system/
├── frontend/          # 前端代码
│   ├── src/
│   │   ├── App.jsx    # 主应用组件
│   │   ├── main.jsx   # 入口文件
│   │   └── App.css    # 样式文件
│   └── index.html     # HTML模板
└── backend/           # 后端代码
    ├── app.py         # Flask应用
    └── requirements.txt # 依赖文件
```

## 快速开始

### 后端启动

1. 安装依赖：
```bash
cd backend
pip install -r requirements.txt
```

2. 启动服务：
```bash
python app.py
```

服务将运行在 `http://localhost:5000`

### 前端启动

1. 进入前端目录：
```bash
cd frontend
```

2. 安装依赖（如果需要）：
```bash
npm install
```

3. 启动开发服务器：
```bash
npm run dev
```

前端将运行在 `http://localhost:5173`

## API 接口

- `GET /api/topics` - 获取所有学习主题
- `POST /api/quiz/generate` - 为选定主题生成测验
- `POST /api/quiz/submit` - 提交测验并获取AI评分
- `GET /api/lesson-topics` - 获取所有备课主题
- `POST /api/lesson/generate` - 生成AI教学内容

## 功能说明

### 智能学习
用户可以从预设的学习主题中选择感兴趣的内容进行学习。

### 智能测验
系统会根据用户选择的主题生成相应的测验问题，用户答题后系统会进行AI评分并给出反馈。

### 智能备课
教师或学习者可以选择教学主题，系统会生成相应的教学内容大纲和详细内容。