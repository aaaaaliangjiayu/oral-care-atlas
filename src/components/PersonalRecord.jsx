import { useMemo, useState } from 'react'
import { Odontogram } from 'react-odontogram'
import { SectionIntro } from './ToothAtlas.jsx'

// 复用开源 react-odontogram（MIT），在其之上叠加：条件着色 + 逐个标记 + 档案导出
const CONDITIONS = [
  { key: 'sound', label: '健康', outline: '#6fd6d1', fill: '#eefcfb' },
  { key: 'caries', label: '龋齿', outline: '#f59e0b', fill: '#fef3c7' },
  { key: 'filled', label: '已补', outline: '#3b82f6', fill: '#dbeafe' },
  { key: 'crown', label: '牙冠', outline: '#8b5cf6', fill: '#ede9fe' },
  { key: 'missing', label: '缺失', outline: '#94a3b8', fill: '#e2e8f0' },
  { key: 'impacted', label: '阻生', outline: '#ef4444', fill: '#fee2e2' },
]

const FDI_ALL = [
  ...range(11, 18), ...range(21, 28), ...range(31, 38), ...range(41, 48),
]
function range(a, b) {
  return Array.from({ length: b - a + 1 }, (_, i) => String(a + i))
}

export default function PersonalRecord() {
  // fdi -> condition key
  const [marks, setMarks] = useState({})
  const [brush, setBrush] = useState('caries')
  const [name, setName] = useState('')
  const [resetKey, setResetKey] = useState(0)

  const handleSelect = (selected) => {
    if (!selected || !selected.length) return
    setMarks((m) => {
      const next = { ...m }
      for (const t of selected) {
        const fdi = t.notations?.fdi
        if (!fdi) continue
        if (next[fdi] === brush) delete next[fdi]
        else next[fdi] = brush
      }
      return next
    })
    setResetKey((k) => k + 1) // 清空组件自身选中态，改为用颜色表达
  }

  const groups = useMemo(() => {
    return CONDITIONS.map((c) => ({
      label: c.label,
      teeth: Object.keys(marks).filter((f) => marks[f] === c.key),
      outlineColor: c.outline,
      fillColor: c.fill,
    }))
  }, [marks])

  const summary = useMemo(
    () =>
      CONDITIONS.filter((c) => groups.find((g) => g.label === c.label)?.teeth.length),
    [groups],
  )

  const exportTxt = () => {
    const lines = [
      '—— 我的口腔牙位档案 ——',
      name ? `记录人：${name}` : '记录人：（未填写）',
      `日期：${new Date().toLocaleDateString('zh-CN')}`,
      '',
      '牙位（FDI）：状况',
      ...FDI_ALL.filter((f) => marks[f]).map(
        (f) => `  ${f} 号牙：${CONDITIONS.find((c) => c.key === marks[f]).label}`,
      ),
      '',
      '共标记 ' + Object.keys(marks).length + ' 颗牙。',
      '提示：本档案为自我观察记录，非诊断。建议携带就诊时供医生参考。',
    ]
    const blob = new Blob([lines.join('\n')], { type: 'text/plain;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `牙位档案-${name || '未命名'}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      <SectionIntro
        title="我的牙位档案"
        desc="选一种状况当“画笔”，再点牙位图上的牙齿即可标记，用来直观记录你补过、坏过或缺失的牙。这张图基于开源牙位图组件 react-odontogram 二次开发。记录后可导出文本，就诊时给医生当参考。"
      />

      <div className="rounded-3xl border border-brand-100 bg-white p-4 shadow-sm sm:p-6">
        {/* 画笔选择 */}
        <div className="mb-4 flex flex-wrap items-center gap-2">
          <span className="mr-1 text-sm font-semibold text-ink/70">画笔：</span>
          {CONDITIONS.map((c) => {
            const on = brush === c.key
            return (
              <button
                key={c.key}
                onClick={() => setBrush(c.key)}
                className={
                  'flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition ' +
                  (on ? 'border-brand-500 ring-2 ring-brand-100' : 'border-brand-100 hover:bg-brand-50')
                }
              >
                <span
                  className="inline-block h-3 w-3 rounded-full border"
                  style={{ background: c.fill, borderColor: c.outline }}
                />
                {c.label}
              </button>
            )
          })}
        </div>

        <div className="odonto-wrap mx-auto max-w-3xl" key={resetKey}>
          <Odontogram
            notation="FDI"
            layout="square"
            showLabels
            singleSelect={false}
            teethConditions={groups}
            selectedColor="#16a09c"
            onChange={handleSelect}
            tooltip={{ content: (t) => `${t?.notations?.fdi} 号牙` }}
          />
        </div>

        <p className="mt-2 text-center text-xs text-ink/45">
          再次点击已标记的牙可取消。标记颜色即代表对应状况。
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-brand-100 bg-white p-5 shadow-sm">
          <h4 className="mb-3 text-sm font-bold">档案概览</h4>
          {Object.keys(marks).length === 0 ? (
            <p className="text-sm text-ink/50">还没有标记任何牙齿。</p>
          ) : (
            <ul className="space-y-2 text-sm">
              {summary.map((c) => {
                const g = groups.find((x) => x.label === c.label)
                return (
                  <li key={c.key} className="flex items-center gap-2">
                    <span
                      className="inline-block h-3 w-3 rounded-full border"
                      style={{ background: c.fill, borderColor: c.outline }}
                    />
                    <span className="w-12">{c.label}</span>
                    <span className="font-mono text-ink/70">{g.teeth.join(' · ')}</span>
                    <span className="ml-auto text-ink/40">{g.teeth.length} 颗</span>
                  </li>
                )
              })}
            </ul>
          )}
        </div>

        <div className="flex flex-col justify-between rounded-3xl border border-brand-100 bg-white p-5 shadow-sm">
          <div>
            <h4 className="mb-3 text-sm font-bold">导出与就诊</h4>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="记录人姓名（选填）"
              className="w-full rounded-xl border border-brand-100 px-3 py-2 text-sm outline-none focus:border-brand-400"
            />
            <p className="mt-3 text-sm leading-relaxed text-ink/60">
              导出为文本档案，或直接用浏览器“打印/另存为 PDF”把整页牙位图保存下来带去门诊。
            </p>
          </div>
          <div className="mt-4 flex gap-2">
            <button
              onClick={exportTxt}
              className="flex-1 rounded-xl bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-600"
            >
              导出档案
            </button>
            <button
              onClick={() => window.print()}
              className="rounded-xl border border-brand-200 px-4 py-2.5 text-sm font-semibold text-brand-700 transition hover:bg-brand-50"
            >
              打印
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
