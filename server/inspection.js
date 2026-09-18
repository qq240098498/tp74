const { load } = require('./store');

// 已填：该语言下译文存在且去掉空白后不是空串；其余两种情况——译文留空（待翻译）
// 与从来没有写过这项语言（未登记）——在巡检里统一算作空缺
function countFilled(entries, code) {
  return entries.reduce((total, item) => {
    const value = item.translations[code];
    return typeof value === 'string' && value.trim() ? total + 1 : total;
  }, 0);
}

// 全局巡检：按语言给出已填与空缺的条数和占比。
// 占比口径在同一次结果里保持统一——分母都是当前现存的文案总条数，
// 已填占比四舍五入取整，空缺占比直接用 100 减去已填占比，两者合计必然是 100，
// 几种语言之间可以横着比较
function getInspection() {
  const data = load();
  const total = data.entries.length;
  const languages = data.languages.map((item) => {
    const filled = total ? countFilled(data.entries, item.code) : 0;
    const empty = total - filled;
    const filledPercent = total ? Math.round((filled / total) * 100) : 0;
    return {
      code: item.code,
      name: item.name,
      enabled: item.enabled,
      isDefault: item.isDefault,
      filled,
      empty,
      filledPercent,
      // 一条文案都没有时分母为 0，占比没有意义，两端都归 0，不出现“空缺 100%”
      emptyPercent: total ? 100 - filledPercent : 0,
    };
  });
  return { total, languages };
}

module.exports = {
  getInspection,
};
