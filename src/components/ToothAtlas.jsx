import { useMemo, useState } from 'react'
import { QUADRANTS, TOOTH_TYPE_INFO, classifyTooth } from '../data/dentalInfo.js'

const SYMPTOMS = [
  { key: 'sensitive', label: '遇冷热酸甜敏感' },
  { key: 'pain', label: '自发性疼痛或咬合痛' },
  { key: 'bleeding', label: '刷牙/咬硬物时出血' },
  { key: 'swelling', label: '牙龈肿胀或流脓' },
  { key: 'badbreath', label: '持续口臭' },
  { key: 'mobile', label: '牙齿松动' },
]

// 牙弓布局：上 16 颗（18→11 · 21→28），下 16 颗（48→41 · 31→38）
const UPPER = [...QUADRANTS[0].fdi, ...QUADRANTS[1].fdi].slice().reverse()
const LOWER = [...QUADRANTS[3].fdi, ...QUADRANTS[2].fdi].slice().reverse()

export default function ToothAtlas() {
  const [selected, setSelected] = useState(16)
  const [sym, setSym] = useState([])

  const info = useMemo(() => {
    const type = classifyTooth(selected)
    return { fdi: selected, type, data: TOOTH_TYPE_INFO[type], quad: quadrantOf(selected) }
  }, [selected])

  const toggleSym = (k) =>
    setSym((s) => (s.includes(k) ? s.filter((x) => x !== k) : [...s, k]))

  return (
    <div className="space-y-6">
      <SectionIntro
        title="牙齿自测 · 认识你的 32 颗牙"
        desc="牙医记录牙齿用的是 FDI 两位编号：第一位代表象限（1 右上、2 左上、3 左下、4 右下），第二位是从门牙往后的序号。点下方牙弓里的任意一颗，看看它的分工、常见问题和护理要点。"
      />

      <div className="rounded-3xl border border-brand-100 bg-white p-4 shadow-sm sm:p-6">
        <DentalChart selected={selected} onSelect={(f) => { setSelected(f); setSym([]) }} />
        <p className="mt-1 text-center text-xs text-ink/45">
          上颌在上、下颌在下 · 中缝在正中 · 数字为 FDI 牙位号
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-5">
        <div className="rounded-3xl border border-brand-100 bg-white p-5 shadow-sm md:col-span-3">
          <div className="mb-1 flex items-center gap-2">
            <span className="rounded-full bg-brand-500 px-2.5 py-0.5 text-sm font-semibold text-white">
              {info.fdi}
            </span>
            <h3 className="text-lg font-bold">{info.data.label}</h3>
          </div>
          <p className="text-sm text-brand-700">{info.quad} · {info.data.role}</p>

          <Block title="常见问题" items={info.data.issues} tone="warn" />
          <Block title="护理要点" items={info.data.tips} tone="good" />
        </div>

        <div className="rounded-3xl border border-brand-100 bg-white p-5 shadow-sm md:col-span-2">
          <h4 className="mb-2 text-sm font-bold text-ink">这颗牙最近有没有……</h4>
          <div className="flex flex-wrap gap-2">
            {SYMPTOMS.map((s) => {
              const on = sym.includes(s.key)
              return (
                <button
                  key={s.key}
                  onClick={() => toggleSym(s.key)}
                  className={
                    'rounded-full border px-3 py-1.5 text-sm transition ' +
                    (on
                      ? 'border-rose-400 bg-rose-50 text-rose-600'
                      : 'border-brand-100 text-ink/70 hover:bg-brand-50')
                  }
                >
                  {s.label}
                </button>
              )
            })}
          </div>
          <SymptomAdvice count={sym.length} />
        </div>
      </div>
    </div>
  )
}

function quadrantOf(f) {
  return { 1: '右上区', 2: '左上区', 3: '左下区', 4: '右下区' }[Math.floor(f / 10)]
}

function SymptomAdvice({ count }) {
  if (count === 0)
    return (
      <p className="mt-4 rounded-xl bg-brand-50 p-3 text-sm text-brand-700">
        没有勾选，先安心。坚持早晚刷牙 + 每天牙线，就是对它最好的照顾。
      </p>
    )
  const urgent = count >= 2
  return (
    <div className={'mt-4 rounded-xl p-3 text-sm ' + (urgent ? 'bg-rose-50 text-rose-700' : 'bg-amber-50 text-amber-700')}>
      <p className="font-semibold">
        {urgent ? '出现多个信号，建议尽快看牙医' : '有轻微信号，先加强日常清洁并观察'}
      </p>
      <p className="mt-1 leading-relaxed opacity-90">
        {urgent
          ? '多个症状同时出现，往往提示龋齿已较深或存在牙周问题，越早处理越省钱省痛。'
          : '单项敏感/出血常见于早期脱矿或牙龈炎，改善清洁习惯后若 1–2 周不缓解，仍建议就诊。'}
      </p>
    </div>
  )
}

function Block({ title, items, tone }) {
  return (
    <div className="mt-4">
      <p className="mb-1.5 text-xs font-bold uppercase tracking-wide text-ink/50">{title}</p>
      <ul className="space-y-1.5">
        {items.map((t) => (
          <li key={t} className="flex gap-2 text-sm leading-relaxed">
            <span className={tone === 'warn' ? 'text-amber-500' : 'text-brand-500'}>
              {tone === 'warn' ? '△' : '✓'}
            </span>
            <span className="text-ink/80">{t}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function DentalChart({ selected, onSelect }) {
  const { map, center } = useMemo(() => layoutPositions(), [])
  return (
    <svg viewBox="0 0 460 320" className="w-full">
      {UPPER.map((f) => (
        <Tooth key={f} f={f} p={map.get(f)} center={center.upper} selected={selected === f} onSelect={onSelect} />
      ))}
      {LOWER.map((f) => (
        <Tooth key={f} f={f} p={map.get(f)} center={center.lower} selected={selected === f} onSelect={onSelect} />
      ))}
      <text x="230" y="162" textAnchor="middle" fontSize="12" fill="#0f807e" opacity="0.5">
        前牙
      </text>
    </svg>
  )
}

function layoutPositions() {
  const CX = 230
  const center = { upper: { x: CX, y: 26 }, lower: { x: CX, y: 294 } }
  const map = new Map()
  // 上颌：圆心在上，弧口朝下
  const UT = { rx: 200, ry: 108 }
  UPPER.forEach((f, i) => {
    const t = Math.PI * ((i + 0.5) / UPPER.length)
    map.set(f, { x: CX - UT.rx * Math.cos(t), y: center.upper.y + UT.ry * Math.sin(t) })
  })
  // 下颌：圆心在下，弧口朝上
  const LT = { rx: 200, ry: 108 }
  LOWER.forEach((f, i) => {
    const t = Math.PI * ((i + 0.5) / LOWER.length)
    map.set(f, { x: CX - LT.rx * Math.cos(t), y: center.lower.y - LT.ry * Math.sin(t) })
  })
  return { map, center }
}

function Tooth({ f, p, center, selected, onSelect }) {
  const n = f % 10
  const w = n <= 2 ? 20 : n >= 6 ? 24 : 22 // 门牙窄、磨牙宽
  const h = 30
  // 标签沿牙弓径向朝外，避免相邻牙标签重叠
  let dx = p.x - center.x
  let dy = p.y - center.y
  const len = Math.hypot(dx, dy) || 1
  dx /= len
  dy /= len
  const lx = p.x + dx * (h / 2 + 11)
  const ly = p.y + dy * (h / 2 + 11) + 3
  return (
    <g
      transform={`translate(${p.x},${p.y})`}
      onClick={() => onSelect(f)}
      style={{ cursor: 'pointer' }}
      role="button"
      aria-label={`牙位 ${f}`}
    >
      <rect
        x={-w / 2}
        y={-h / 2}
        width={w}
        height={h}
        rx="8"
        fill={selected ? '#16a09c' : '#ffffff'}
        stroke={selected ? '#0f807e' : '#abe9e5'}
        strokeWidth="1.5"
      />
      <text
        x={lx - p.x}
        y={ly - p.y}
        textAnchor="middle"
        fontSize="10"
        fill={selected ? '#0f807e' : '#10303a'}
        opacity={selected ? 1 : 0.5}
        fontWeight={selected ? 700 : 400}
      >
        {f}
      </text>
    </g>
  )
}

export function SectionIntro({ title, desc }) {
  return (
    <div>
      <h2 className="text-2xl font-bold tracking-tight sm:text-[28px]">{title}</h2>
      <p className="mt-2 max-w-3xl leading-relaxed text-ink/70">{desc}</p>
    </div>
  )
}
