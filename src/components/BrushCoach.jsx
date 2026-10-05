import { useEffect, useRef, useState } from 'react'
import { DENTAL_TIPS } from '../data/dentalInfo.js'
import { SectionIntro } from './ToothAtlas.jsx'

const TOTAL = 120
const QUADS = [
  { name: '右上外侧', tip: '刷右上唇颊面' },
  { name: '左上外侧', tip: '刷左上唇颊面' },
  { name: '左上内侧', tip: '刷左上舌腭面' },
  { name: '右上内侧', tip: '刷右上舌腭面' },
  { name: '右下外侧', tip: '刷右下唇颊面' },
  { name: '左下外侧', tip: '刷左下唇颊面' },
  { name: '左下内侧', tip: '刷左下舌面' },
  { name: '右下内侧', tip: '刷右下舌面' },
]

export default function BrushCoach() {
  const [left, setLeft] = useState(TOTAL)
  const [running, setRunning] = useState(false)
  const [done, setDone] = useState(false)
  const [days, setDays] = useState([]) // 已打卡日期字符串数组
  const [tipIdx, setTipIdx] = useState(0)
  const iv = useRef(null)

  const seg = Math.min(QUADS.length - 1, Math.floor((TOTAL - left) / (TOTAL / QUADS.length)))

  useEffect(() => {
    if (!running) return
    iv.current = setInterval(() => {
      setLeft((l) => {
        if (l <= 1) {
          clearInterval(iv.current)
          setRunning(false)
          setDone(true)
          checkinToday()
          return 0
        }
        return l - 1
      })
    }, 1000)
    return () => clearInterval(iv.current)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [running])

  useEffect(() => {
    const t = setInterval(() => setTipIdx((i) => (i + 1) % DENTAL_TIPS.length), 6000)
    return () => clearInterval(t)
  }, [])

  const start = () => {
    if (left === 0) setLeft(TOTAL)
    setDone(false)
    setRunning(true)
  }
  const pause = () => setRunning(false)
  const reset = () => {
    setRunning(false)
    setLeft(TOTAL)
    setDone(false)
  }

  const mm = String(Math.floor(left / 60)).padStart(1, '0')
  const ss = String(left % 60).padStart(2, '0')
  const progress = ((TOTAL - left) / TOTAL) * 100

  return (
    <div className="space-y-6">
      <SectionIntro
        title="刷牙教练 · 把 2 分钟刷够"
        desc="大多数人刷牙不到 45 秒。这里用巴氏刷牙法的分区思路，把 2 分钟切成 8 段、每 15 秒换一个区域，跟着提示刷就不会漏。刷完自动帮你在下方打卡。"
      />

      <div className="grid gap-4 md:grid-cols-2">
        {/* 计时器 */}
        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
          <div className="relative mx-auto flex h-52 w-52 items-center justify-center">
            <svg viewBox="0 0 100 100" className="absolute h-full w-full -rotate-90">
              <circle cx="50" cy="50" r="45" fill="none" stroke="#eef5f5" strokeWidth="8" />
              <circle
                cx="50" cy="50" r="45" fill="none" stroke="#16a09c" strokeWidth="8"
                strokeLinecap="round" strokeDasharray={`${(progress / 100) * 283} 283`}
              />
            </svg>
            <div className="text-center">
              <div className="text-4xl font-bold tabular-nums">
                {mm}:{ss}
              </div>
              <div className="mt-1 text-sm font-medium text-brand-600">
                {running ? QUADS[seg].name : done ? '完成啦 🎉' : '准备开始'}
              </div>
              <div className="text-xs text-ink/50">{running ? QUADS[seg].tip : '按开始计时'}</div>
            </div>
          </div>
          <div className="mt-5 flex justify-center gap-2">
            {!running ? (
              <button onClick={start} className="rounded-xl bg-brand-500 px-6 py-2.5 font-semibold text-white transition hover:bg-brand-600">
                {left === TOTAL ? '开始' : left === 0 ? '再来一次' : '继续'}
              </button>
            ) : (
              <button onClick={pause} className="rounded-xl bg-amber-500 px-6 py-2.5 font-semibold text-white transition hover:bg-amber-600">
                暂停
              </button>
            )}
            <button onClick={reset} className="rounded-xl border border-brand-200 px-5 py-2.5 font-semibold text-brand-700 transition hover:bg-brand-50">
              重置
            </button>
          </div>
          <p className="mt-4 min-h-[2.5rem] rounded-xl bg-brand-50 p-3 text-center text-sm text-brand-700">
            {DENTAL_TIPS[tipIdx]}
          </p>
        </div>

        {/* 分区进度 */}
        <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
          <h4 className="mb-3 text-sm font-bold">本次分区进度</h4>
          <div className="grid grid-cols-2 gap-2">
            {QUADS.map((q, i) => {
              const state = left === 0 ? 'done' : running && i === seg ? 'now' : i < seg ? 'done' : 'todo'
              return (
                <div
                  key={q.name}
                  className={
                    'rounded-xl border px-3 py-2 text-sm transition ' +
                    (state === 'now'
                      ? 'border-brand-500 bg-brand-500 text-white'
                      : state === 'done'
                      ? 'border-brand-100 bg-brand-50 text-brand-700'
                      : 'border-brand-100 text-ink/40')
                  }
                >
                  <div className="font-medium">{i + 1}. {q.name}</div>
                  <div className="text-[11px] opacity-80">{state === 'done' ? '✓ 已刷' : state === 'now' ? '进行中…' : '待刷'}</div>
                </div>
              )
            })}
          </div>
          <p className="mt-3 text-xs leading-relaxed text-ink/50">
            提示：最后别忘了轻刷舌苔，口臭常常来自这里。
          </p>
        </div>
      </div>

      <Checkin days={days} onToggle={toggle(setDays)} manual />
    </div>
  )

  function checkinToday() {
    setDays((d) => (d.includes(today()) ? d : [...d, today()]))
  }
  function toggle(setter) {
    return (day) => setter((d) => (d.includes(day) ? d.filter((x) => x !== day) : [...d, day]))
  }
}

function Checkin({ days }) {
  const streak = computeStreak(days)
  return (
    <div className="rounded-3xl border border-brand-100 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-end justify-between">
        <div>
          <h4 className="text-sm font-bold">21 天刷牙打卡</h4>
          <p className="text-xs text-ink/50">每天刷够 2 分钟自动打卡，也可手动补勾（刷新页面会重置，仅作演示）。</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-brand-600">{days.length}</div>
          <div className="text-xs text-ink/50">已连续 {streak} 天</div>
        </div>
      </div>
      <div className="grid grid-cols-7 gap-2">
        {Array.from({ length: 21 }, (_, i) => {
          const day = dayOffset(i - 20) // 最近 21 天
          const on = days.includes(day)
          return (
            <div
              key={day}
              className={
                'flex aspect-square items-center justify-center rounded-xl text-xs font-medium ' +
                (on ? 'bg-brand-500 text-white' : 'bg-brand-50 text-brand-700/50')
              }
              title={day}
            >
              {on ? '✓' : day.slice(5)}
            </div>
          )
        })}
      </div>
    </div>
  )
}

function today() {
  return dayOffset(0)
}
function dayOffset(n) {
  const d = new Date()
  d.setDate(d.getDate() + n)
  return d.toISOString().slice(0, 10)
}
function computeStreak(days) {
  if (!days.length) return 0
  const set = new Set(days)
  let s = 0
  for (let i = 0; ; i++) {
    if (set.has(dayOffset(-i))) s++
    else break
  }
  return s
}
