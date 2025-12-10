from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import random
import time

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 模拟数据库
topics = [
    '人工智能基础',
    '机器学习入门', 
    '深度学习原理',
    '自然语言处理',
    '计算机视觉'
]

lesson_topics = [
    '人工智能概述',
    '机器学习基础',
    '神经网络原理', 
    '数据预处理技术',
    '模型评估方法'
]

# 存储测验问题的模拟数据库
quiz_questions = {
    '人工智能基础': [
        {
            'id': 1,
            'question': '什么是人工智能?',
            'options': ['A. 人类智能', 'B. 机器模拟人类智能', 'C. 计算机硬件', 'D. 网络技术'],
            'correctAnswer': 'B'
        },
        {
            'id': 2,
            'question': '人工智能的英文缩写是什么?',
            'options': ['A. AI', 'B. MI', 'C. BI', 'D. CI'],
            'correctAnswer': 'A'
        }
    ],
    '机器学习入门': [
        {
            'id': 1,
            'question': '机器学习的主要类型有哪些?',
            'options': ['A. 监督学习', 'B. 无监督学习', 'C. 强化学习', 'D. 以上都是'],
            'correctAnswer': 'D'
        },
        {
            'id': 2,
            'question': '以下哪个是监督学习的例子?',
            'options': ['A. 聚类', 'B. 分类', 'C. 降维', 'D. 关联规则'],
            'correctAnswer': 'B'
        }
    ]
}

@app.route('/')
def home():
    return jsonify({'message': 'AI智能学习系统后端API'})

# 获取所有学习主题
@app.route('/api/topics', methods=['GET'])
def get_topics():
    return jsonify(topics)

# 为选定主题生成测验
@app.route('/api/quiz/generate', methods=['POST'])
def generate_quiz():
    data = request.get_json()
    topic = data.get('topic', '')
    
    # 如果主题有预设问题，使用预设的，否则生成模拟问题
    if topic in quiz_questions:
        questions = quiz_questions[topic]
    else:
        # 生成模拟问题
        questions = [
            {
                'id': 1,
                'question': f'关于{topic}的第一个问题?',
                'options': [f'A. 选项1', f'B. 选项2', f'C. 选项3', f'D. 选项4'],
                'correctAnswer': 'B'
            },
            {
                'id': 2,
                'question': f'关于{topic}的第二个问题?',
                'options': [f'A. 选项A', f'B. 选项B', f'C. 选项C', f'D. 选项D'],
                'correctAnswer': 'C'
            }
        ]
    
    return jsonify({
        'topic': topic,
        'questions': questions
    })

# 提交测验并获取AI评分
@app.route('/api/quiz/submit', methods=['POST'])
def submit_quiz():
    data = request.get_json()
    user_answers = data.get('answers', [])
    topic = data.get('topic', '')
    
    # 模拟AI评分过程
    correct_count = 0
    total = len(user_answers)
    
    if topic in quiz_questions:
        questions = quiz_questions[topic]
        for i, answer in enumerate(user_answers):
            if i < len(questions) and answer == questions[i]['correctAnswer']:
                correct_count += 1
    
    score = int((correct_count / total) * 100) if total > 0 else 0
    
    # 生成AI评语
    if score >= 90:
        feedback = "优秀！您对这个主题有深入的理解。"
    elif score >= 70:
        feedback = "良好！您掌握了大部分概念，继续加油。"
    elif score >= 50:
        feedback = "及格。您对基础概念有一定了解，但还需要进一步学习。"
    else:
        feedback = "需要加强。建议重新学习相关概念，并多做练习。"
    
    return jsonify({
        'score': score,
        'feedback': feedback,
        'correctCount': correct_count,
        'totalCount': total
    })

# 获取所有备课主题
@app.route('/api/lesson-topics', methods=['GET'])
def get_lesson_topics():
    return jsonify(lesson_topics)

# 生成AI教学内容
@app.route('/api/lesson/generate', methods=['POST'])
def generate_lesson():
    data = request.get_json()
    topic = data.get('topic', '')
    
    # 模拟AI生成教学内容
    time.sleep(1)  # 模拟处理时间
    
    lesson_content = f"""# {topic} 教学内容

## 1. 概述
{topic}是当前人工智能领域的核心概念之一。它涵盖了理论基础、技术实现和实际应用等多个方面。

## 2. 学习目标
- 理解{topic}的基本概念
- 掌握相关的核心技术
- 了解实际应用场景

## 3. 主要内容
- 核心概念与原理
- 技术实现方法
- 应用场景分析
- 实践案例研究

## 4. 重点难点
- 重点：{topic}的核心算法
- 难点：实际应用中的问题解决

## 5. 实践练习
1. 完成相关编程练习
2. 分析实际案例
3. 总结学习心得

## 6. 总结
通过本节学习，您应该掌握了{topic}的基本概念和应用方法。建议继续深入学习相关进阶内容。
"""
    
    return jsonify({
        'topic': topic,
        'content': lesson_content
    })

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)