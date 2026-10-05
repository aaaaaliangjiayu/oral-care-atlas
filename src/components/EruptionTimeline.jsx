import { useMemo, useState } from 'react'
import { ERUPTION_TIMELINE } from '../data/dentalInfo.js'
import { SectionIntro } from './ToothAtlas.jsx'

const MAX_M = 300 // 到 25 岁（智齿上限）
const AGE_TICKS = [0, 3, 6, 9, 12, 18, 25]

function pct(m) {
  return Math.max(0, Math.min(100, (m / MAX_M) * 100))
}
function years(m) {
  const y = Math.floor(m / 12)
  const mo = m % 12
  if (y === 0) return `${mo} 个月`
  if (mo === 0) return `${y} 岁`
  return `${y} 岁 ${mo} 个月`
}

export default function EruptionTimeline() {
  const [age, setAge] = useState(6)

  const rows = useMemo(() => {
    const cur = age * 12
    return ERUPTION_TIMELINE.map((r) => {
      const state = (rng) =>
        !rng ? null : cur < rng[0] ? 'future' : cur > rng[1] ? 'done' : 'now'
      return {
        ...r,
        pState: state(r.primary),
        qState: state(r.permanent),
      }
    })
  }, [age])

  return (
    <div className="space-y-6">
      <SectionIntro
        title="换牙时间线 · 乳牙恒牙什么时候来"
        desc="每个人略有差异，但规律大致固定。上方色条表示乳牙（暖色）与恒牙（青色）的萌出年龄段；拖动年龄尺，看看“这个年龄该有哪些牙”——家长对照孩子、同学背解剖常识都能用。"
      />

      <div className="rounded-3xl border border-brand-100 bg-white p-5 shadow-sm sm:p-6">
        {/* 年龄尺 */}
        <div className="mb-6">
          <div className="mb-2 flex items-baseline justify-between">
            <span className="text-sm font-semibold text-ink/70">当前查看年龄</span>
            <span className="text-2xl font-bold text-brand-600">{age} 岁</span>
          </div>
          <input
            type="range"
            min="0"
            max="25"
            value={age}
            onChange={(e) => setAge(+e.target.value)}
            className="w-full accent-brand-500"
          />
          <div className="mt-1 flex justify-between text-[11px] text-ink/40">
            {AGE_TICKS.map((a) => (
              <span key={a}>{a}</span>
            ))}
          </div>
        </div>

        <Legend />

        <div className="mt-4 space-y-1">
          {rows.map((r) => (
            <div
              key={r.tooth}
              className={
                'grid grid-cols-[8.5rem_1fr] items-center gap-3 rounded-xl px-2 py-2 ' +
                (r.pState === 'now' || r.qState === 'now' ? 'bg-brand-50' : '')
              }
            >
              <div className="text-xs font-medium leading-tight text-ink/75">
                {r.tooth}
              </div>
              <div className="relative h-7">
                {r.primary && (
                  <Bar rng={r.primary} color="#f59e0b" state={r.pState} top />
                )}
                {r.permanent && (
                  <Bar rng={r.permanent} color="#16a09c" state={r.qState} bottom={!r.primary} />
                )}
              </div>
            </div>
          ))}
        </div>
        <p className="mt-3 text-[11px] text-ink/40">
          参考月龄区间已折算为年龄，仅作科普。若明显偏离或乳牙滞留、恒牙迟萌，建议拍片检查。
        </p>
      </div>
    </div>
  )
}

function Bar({ rng, color, state, top, bottom }) {
  const left = pct(rng[0])
  const width = Math.max(3, pct(rng[1]) - left)
  const faded = state === 'future'
  const active = state === 'now'
  return (
    <div
      className="absolute h-2.5 rounded-full"
      style={{
        left: `${left}%`,
        width: `${width}%`,
        top: top ? 4 : undefined,
        bottom: bottom ? 12 : top ? undefined : 4,
        background: color,
        opacity: faded ? 0.22 : active ? 1 : 0.55,
        outline: active ? `2px solid ${color}` : 'none',
        outlineOffset: 2,
      }}
      title={`${years(rng[0])} – ${years(rng[1])}`}
    />
  )
}

function Legend() {
  return (
    <div className="flex flex-wrap gap-4 text-xs text-ink/60">
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-2.5 w-4 rounded-full" style={{ background: '#f59e0b' }} />
        乳牙萌出
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-2.5 w-4 rounded-full" style={{ background: '#16a09c' }} />
        恒牙萌出
      </span>
      <span className="flex items-center gap-1.5">
        <span className="inline-block h-3 w-3 rounded-full ring-2 ring-brand-400" />
        当前年龄正处于该阶段
      </span>
    </div>
  )
}
