import React, { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [activeTab, setActiveTab] = useState('learn') // learn, quiz, lesson

  return (
    <div className="app">
      <header className="header">
        <h1>AI智能学习系统</h1>
        <nav>
          <button 
            className={activeTab === 'learn' ? 'active' : ''} 
            onClick={() => setActiveTab('learn')}
          >
            智能学习
          </button>
          <button 
            className={activeTab === 'quiz' ? 'active' : ''} 
            onClick={() => setActiveTab('quiz')}
          >
            智能测验
          </button>
          <button 
            className={activeTab === 'lesson' ? 'active' : ''} 
            onClick={() => setActiveTab('lesson')}
          >
            智能备课
          </button>
        </nav>
      </header>

      <main className="main">
        {activeTab === 'learn' && <LearningModule />}
        {activeTab === 'quiz' && <QuizModule />}
        {activeTab === 'lesson' && <LessonModule />}
      </main>
    </div>
  )
}

// 学习模块组件
function LearningModule() {
  const [selectedTopic, setSelectedTopic] = useState('')
  const [topics, setTopics] = useState([])

  // 获取学习主题
  useEffect(() => {
    fetch('http://localhost:5000/api/topics')
      .then(response => response.json())
      .then(data => setTopics(data))
      .catch(error => console.error('Error fetching topics:', error));
  }, [])

  return (
    <div className="module">
      <h2>选择学习主题</h2>
      <div className="topic-selection">
        {topics.map(topic => (
          <button 
            key={topic} 
            className={selectedTopic === topic ? 'selected' : ''}
            onClick={() => setSelectedTopic(topic)}
          >
            {topic}
          </button>
        ))}
      </div>
      {selectedTopic && (
        <div className="learning-content">
          <h3>正在学习: {selectedTopic}</h3>
          <p>这里是关于 {selectedTopic} 的学习内容...</p>
        </div>
      )}
    </div>
  )
}

// 测验模块组件
function QuizModule() {
  const [questions, setQuestions] = useState([])
  const [userAnswers, setUserAnswers] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [quizResult, setQuizResult] = useState(null)
  const [selectedTopicForQuiz, setSelectedTopicForQuiz] = useState('')

  const generateQuiz = () => {
    if (!selectedTopicForQuiz) {
      alert('请先选择一个学习主题');
      return;
    }
    
    fetch('http://localhost:5000/api/quiz/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ topic: selectedTopicForQuiz })
    })
    .then(response => response.json())
    .then(data => {
      setQuestions(data.questions)
      setUserAnswers(new Array(data.questions.length).fill(""))
      setShowResults(false)
      setQuizResult(null)
    })
    .catch(error => console.error('Error generating quiz:', error));
  }

  const handleAnswerChange = (questionId, answer) => {
    const newAnswers = [...userAnswers]
    newAnswers[questionId - 1] = answer
    setUserAnswers(newAnswers)
  }

  const submitQuiz = () => {
    fetch('http://localhost:5000/api/quiz/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ 
        answers: userAnswers,
        topic: selectedTopicForQuiz
      })
    })
    .then(response => response.json())
    .then(data => {
      setQuizResult(data)
      setShowResults(true)
    })
    .catch(error => console.error('Error submitting quiz:', error));
  }

  return (
    <div className="module">
      <h2>智能测验</h2>
      {!questions.length ? (
        <div>
          <select 
            value={selectedTopicForQuiz} 
            onChange={(e) => setSelectedTopicForQuiz(e.target.value)}
          >
            <option value="">选择测验主题</option>
            <LearningTopicsOptions />
          </select>
          <button onClick={generateQuiz} disabled={!selectedTopicForQuiz}>生成测验</button>
        </div>
      ) : (
        <div className="quiz-container">
          <h3>测验主题: {selectedTopicForQuiz}</h3>
          {questions.map((q, index) => (
            <div key={q.id} className="question">
              <h4>{q.question}</h4>
              {q.options.map((option, idx) => (
                <div key={idx}>
                  <input
                    type="radio"
                    id={`q${q.id}-opt${idx}`}
                    name={`question-${q.id}`}
                    value={option.charAt(0)}
                    checked={userAnswers[index] === option.charAt(0)}
                    onChange={() => handleAnswerChange(q.id, option.charAt(0))}
                  />
                  <label htmlFor={`q${q.id}-opt${idx}`}>{option}</label>
                </div>
              ))}
            </div>
          ))}
          <button onClick={submitQuiz}>提交答案</button>
          
          {showResults && quizResult && (
            <div className="results">
              <h3>测验结果</h3>
              <p>AI评分：{quizResult.score}分</p>
              <p>{quizResult.feedback}</p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// 用于测验模块的下拉选项组件
function LearningTopicsOptions() {
  const [topics, setTopics] = useState([]);

  useEffect(() => {
    fetch('http://localhost:5000/api/topics')
      .then(response => response.json())
      .then(data => setTopics(data))
      .catch(error => console.error('Error fetching topics:', error));
  }, []);

  return (
    <>
      {topics.map(topic => (
        <option key={topic} value={topic}>{topic}</option>
      ))}
    </>
  );
}

// 备课模块组件
function LessonModule() {
  const [selectedLessonTopic, setSelectedLessonTopic] = useState('')
  const [generatedLesson, setGeneratedLesson] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [lessonTopics, setLessonTopics] = useState([])

  // 获取备课主题
  useEffect(() => {
    fetch('http://localhost:5000/api/lesson-topics')
      .then(response => response.json())
      .then(data => setLessonTopics(data))
      .catch(error => console.error('Error fetching lesson topics:', error));
  }, [])

  const generateLesson = () => {
    if (!selectedLessonTopic) {
      alert('请先选择一个教学主题');
      return;
    }
    
    setIsLoading(true)
    fetch('http://localhost:5000/api/lesson/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ topic: selectedLessonTopic })
    })
    .then(response => response.json())
    .then(data => {
      setGeneratedLesson(data.content)
      setIsLoading(false)
    })
    .catch(error => {
      console.error('Error generating lesson:', error)
      setIsLoading(false)
    })
  }

  return (
    <div className="module">
      <h2>智能备课</h2>
      <div className="lesson-controls">
        <select 
          value={selectedLessonTopic} 
          onChange={(e) => setSelectedLessonTopic(e.target.value)}
        >
          <option value="">选择教学主题</option>
          {lessonTopics.map(topic => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>
        <button 
          onClick={generateLesson} 
          disabled={!selectedLessonTopic || isLoading}
        >
          {isLoading ? '生成中...' : 'AI生成教学内容'}
        </button>
      </div>
      
      {generatedLesson && (
        <div className="lesson-content">
          <h3>生成的教学内容</h3>
          <pre>{generatedLesson}</pre>
        </div>
      )}
    </div>
  )
}

export default App