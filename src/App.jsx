import React from 'react'
import { Routes, Route, Link } from 'react-router-dom'
import Home from './pages/Home'
import About from './pages/About'
import SmartRender from './components/ai/SmartRender'

export default function App() {
  return (
    <div className="min-h-screen bg-gray-100 text-gray-900 overflow-hidden flex flex-col">

      <SmartRender prompt={`一个header，左上角是logo，显示 Makeup，右侧是菜单，高度 50px
        / : Home
        /about: About
        `}></SmartRender>

      <main className="mx-auto p-4 flex flex-auto w-full">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
        </Routes>
      </main>
    </div>
  )
}
