import { useEffect, useState } from 'react'
import ToothAtlas from './components/ToothAtlas.jsx'
import PersonalRecord from './components/PersonalRecord.jsx'
import EruptionTimeline from './components/EruptionTimeline.jsx'
import BrushCoach from './components/BrushCoach.jsx'

const SECTIONS = [
  { key: 'atlas', label: '牙齿自测', hint: '点一点，认识自己的牙' },
  { key: 'record', label: '我的牙位档案', hint: '标记口腔状况并导出' },
  { key: 'timeline', label: '换牙时间线', hint: '乳牙恒牙什么时候来' },
  { key: 'brush', label: '刷牙打卡', hint: '2 分钟 + 21 天习惯' },
]

const KEYS = SECTIONS.map((s) => s.key)
const initialTab = () => {
  const h = window.location.hash.replace('#', '')
  return KEYS.includes(h) ? h : 'atlas'
}

export default function App() {
  const [active, setActive] = useState(initialTab)

  useEffect(() => {
    const onHash = () => setActive(initialTab())
    window.addEventListener('hashchange', onHash)
    return () => window.removeEventListener('hashchange', onHash)
  }, [])

  const go = (k) => {
    window.location.hash = k
    setActive(k)
  }

  return (
    <div className="min-h-screen bg-cream text-ink">
      <Header active={active} onNav={go} />
      <main className="mx-auto w-full max-w-5xl px-4 pb-24 pt-6 sm:px-6">
        {active === 'atlas' && <ToothAtlas />}
        {active === 'record' && <PersonalRecord />}
        {active === 'timeline' && <EruptionTimeline />}
        {active === 'brush' && <BrushCoach />}
      </main>
      <Footer />
    </div>
  )
}

function Header({ active, onNav }) {
  return (
    <header className="sticky top-0 z-20 border-b border-brand-100 bg-cream/85 backdrop-blur">
      <div className="mx-auto flex w-full max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <div className="flex items-center gap-2">
          <ToothMark />
          <div className="leading-tight">
            <div className="text-lg font-bold tracking-tight">齿间</div>
            <div className="text-[11px] text-brand-600">一口好牙自助指南</div>
          </div>
        </div>
        <nav className="hidden gap-1 md:flex">
          {SECTIONS.map((s) => (
            <NavBtn key={s.key} s={s} active={active} onNav={onNav} />
          ))}
        </nav>
      </div>
      {/* 移动端横向滑动导航 */}
      <nav className="flex gap-1 overflow-x-auto px-4 pb-2 md:hidden">
        {SECTIONS.map((s) => (
          <NavBtn key={s.key} s={s} active={active} onNav={onNav} />
        ))}
      </nav>
    </header>
  )
}

function NavBtn({ s, active, onNav }) {
  const on = active === s.key
  return (
    <button
      onClick={() => onNav(s.key)}
      className={
        'whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-medium transition ' +
        (on
          ? 'bg-brand-500 text-white shadow-sm'
          : 'text-brand-700 hover:bg-brand-100')
      }
    >
      {s.label}
    </button>
  )
}

function Footer() {
  return (
    <footer className="border-t border-brand-100 bg-white/60">
      <div className="mx-auto w-full max-w-5xl px-4 py-8 text-sm sm:px-6">
        <p className="mb-2 font-semibold text-brand-700">免责声明</p>
        <p className="max-w-3xl leading-relaxed text-ink/70">
          本站为口腔健康科普与自我观察工具，所有内容由公开资料整理，
          <strong className="text-ink">不构成医疗诊断或治疗建议</strong>。
          牙齿或口腔出现疼痛、出血、肿胀等异常，请及时到正规医疗机构就诊。
        </p>
        <p className="mt-4 text-xs text-ink/45">
          齿间 · 口腔健康自助指南 —— 口腔医学专业学生作品 · 牙位图组件基于开源项目
          react-odontogram（MIT）二次开发
        </p>
      </div>
    </footer>
  )
}

function ToothMark() {
  return (
    <svg width="30" height="30" viewBox="0 0 32 32" aria-hidden>
      <path
        d="M16 4c-3 0-4 1.6-7 1.6S5 4.5 5 9c0 6 2 9 3.5 14 .6 2 1 3 2.3 3s1.5-2 2-5c.4-2.3.8-4 3.2-4s2.8 1.7 3.2 4c.5 3 .7 5 2 5s1.7-1 2.3-3C30 18 31 15 31 9c0-4.5-2-3.4-5-3.4S19 4 16 4z"
        fill="#16a09c"
        opacity="0.14"
      />
      <path
        d="M16 5.5c-2.6 0-3.4 1.4-6 1.4S6 6 6 9.7c0 5.4 1.9 8.3 3.2 13 .6 2.1 1 2.8 2 2.8s1.3-1.9 1.8-4.6c.4-2.1.7-3.5 3-3.5s2.6 1.4 3 3.5c.5 2.7.8 4.6 1.8 4.6s1.4-.7 2-2.8c1.3-4.7 3.2-7.6 3.2-13C30 6 28.6 6.9 26 6.9s-3.4-1.4-6-1.4z"
        fill="none"
        stroke="#0f807e"
        strokeWidth="1.6"
      />
    </svg>
  )
}
