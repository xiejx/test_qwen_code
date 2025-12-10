#!/bin/bash

echo "AI智能学习系统启动脚本"

# 启动后端服务
echo "启动后端服务..."
cd /workspace/ai-learning-system/backend

# 安装Python依赖
pip install -r requirements.txt

# 在后台启动Flask应用
python app.py &
BACKEND_PID=$!

# 等待后端启动
sleep 3

echo "后端服务已启动 (PID: $BACKEND_PID)"

# 启动前端服务
echo "启动前端服务..."
cd /workspace/ai-learning-system/frontend

# 安装前端依赖（如果需要）
# npm install

# 启动前端开发服务器
# 注意：在实际环境中，这通常会使用npm run dev，但在当前环境中我们只是检查文件
echo "前端服务准备就绪"

echo "系统启动完成！"
echo "后端地址: http://localhost:5000"
echo "前端地址: http://localhost:5173 (需要单独启动npm run dev)"

# 等待用户输入停止系统
echo "按 Ctrl+C 停止系统"
wait $BACKEND_PID