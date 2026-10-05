// 口腔健康科普知识库
// 数据来源参考：FDI 牙位记录法、乳恒牙萌出规律、常见口腔疾病防治常识（公开科普资料整理）
// 说明：本项目为科普与自检工具，不构成医疗诊断，异常请就医。

// 牙位分区（FDI 两位编号：第一位象限，第二位该象限内由中线向后的序号）
export const QUADRANTS = [
  { key: 'UR', name: '右上区', fdi: [11, 12, 13, 14, 15, 16, 17, 18] },
  { key: 'UL', name: '左上区', fdi: [21, 22, 23, 24, 25, 26, 27, 28] },
  { key: 'LL', name: '左下区', fdi: [31, 32, 33, 34, 35, 36, 37, 38] },
  { key: 'LR', name: '右下区', fdi: [41, 42, 43, 44, 45, 46, 47, 48] },
];

// 按牙位类型归类的科普内容（切牙/尖牙/前磨牙/磨牙/智齿）
export const TOOTH_TYPE_INFO = {
  incisor: {
    label: '切牙（门牙）',
    role: '负责切割食物，也是微笑时的"门面"。',
    issues: [
      '易因外伤磕碰出现缺角或松动',
      '唇侧颈部易生楔状缺损（横刷用力过大）',
      '排列不齐会影响咬合与发音',
    ],
    tips: ['避免用门牙啃硬物（如开瓶盖、咬坚果壳）', '改用巴氏刷牙法、软毛牙刷', '磕碰后 24 小时内尽早就医'],
  },
  canine: {
    label: '尖牙（虎牙）',
    role: '负责撕扯食物，支撑口角、维持面部轮廓。',
    issues: ['恒尖牙萌出晚，易因空间不足而"虎牙"错位', '牙根长，是口内最结实的牙之一'],
    tips: ['换牙期关注尖牙萌出位置，必要时early矫治评估', '清洁时照顾到尖牙旁的牙弓转角处'],
  },
  premolar: {
    label: '前磨牙（双尖牙）',
    role: '协助磨碎食物，连接尖牙与磨牙。',
    issues: ['窝沟与牙缝易嵌塞食物', '龋坏常从咬合面窝沟开始'],
    tips: ['配合牙线/间隙刷清洁邻面', '窝沟封闭可显著降低龋齿风险'],
  },
  molar: {
    label: '磨牙（大牙）',
    role: '主要咀嚼研磨牙齿，承担最大咬合力。',
    issues: [
      '窝沟深，是最易龋坏的牙位',
      '六龄齿（第一恒磨牙）萌出早、易被误认为乳牙而忽视',
      '食物残渣易积存导致口臭与龋齿',
    ],
    tips: ['重点做窝沟封闭', '刷牙时最后再刷到最里面的磨牙', '每 6–12 个月口腔检查'],
  },
  wisdom: {
    label: '智齿（第三磨牙）',
    role: '人类退化中的牙齿，多数现代人无足够萌出空间。',
    issues: ['阻生（长歪/长不全）最常见', '易引发冠周炎、顶坏邻牙', '清洁死角，反复发炎'],
    tips: ['拍全景片评估是否阻生', '反复发炎或顶邻牙的阻生智齿建议拔除', '孕期前建议先做口腔评估'],
  },
};

// FDI 编号 → 牙位类型
export function classifyTooth(fdi) {
  const q = Math.floor(fdi / 10);
  const n = fdi % 10;
  if (q < 1 || q > 4 || n < 1 || n > 8) return null;
  if (n === 8) return 'wisdom';
  if (n <= 2) return 'incisor';
  if (n === 3) return 'canine';
  if (n <= 5) return 'premolar';
  return 'molar';
}

// 乳牙 → 恒牙 萌出时间线（月龄，用于可视化时间轴；个体有差异）
export const ERUPTION_TIMELINE = [
  { tooth: '下中切牙', primary: [6, 10], permanent: [72, 84] },
  { tooth: '上中切牙', primary: [8, 12], permanent: [72, 90] },
  { tooth: '上侧切牙', primary: [9, 13], permanent: [84, 108] },
  { tooth: '下侧切牙', primary: [10, 16], permanent: [72, 96] },
  { tooth: '第一乳磨牙', primary: [13, 19], permanent: null },
  { tooth: '乳尖牙', primary: [16, 23], permanent: [108, 132] },
  { tooth: '第二乳磨牙', primary: [23, 33], permanent: null },
  { tooth: '第一恒磨牙(六龄齿)', primary: null, permanent: [72, 96] },
  { tooth: '前磨牙', primary: null, permanent: [120, 144] },
  { tooth: '第二恒磨牙', primary: null, permanent: [144, 168] },
  { tooth: '智齿', primary: null, permanent: [216, 300] },
];

// 日常护牙小贴士（滚动展示用）
export const DENTAL_TIPS = [
  '每天刷牙 2 次、每次至少 2 分钟，晚上睡前那次尤其重要。',
  '牙刷每 3 个月更换一次，刷毛外翻就该换了。',
  '牙线不是"可选"，它是清洁邻面龋的关键。',
  '含氟牙膏是预防龋齿性价比最高的手段。',
  '少喝黏性含糖饮料，喝完后漱口，别立刻刷牙（酸性软化期）。',
  '六龄齿窝沟封闭，做一遍能保护好多年。',
];
