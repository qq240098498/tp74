// 全局巡检：按语言给出译文已填与空缺的条数。同一次结果里占比的分母统一取
// 当前存在的文案总条数，取整统一对已填占比做一次四舍五入，空缺占比由
// 100 减去已填占比得到，保证两种占比加起来正好是 100，语言之间口径一致可以横着比
const { load } = require('./store');

function inspect() {
  const data = load();
  const total = data.entries.length;

  const languages = data.languages.map((language) => {
    let filled = 0;
    data.entries.forEach((entry) => {
      const value = entry.translations[language.code];
      if (typeof value === 'string' && value.trim()) filled += 1;
    });
    const empty = total - filled;
    const filledPercent = total ? Math.round((filled / total) * 100) : 0;
    return {
      code: language.code,
      name: language.name,
      enabled: language.enabled,
      isDefault: language.isDefault,
      filled,
      empty,
      total,
      filledPercent,
      emptyPercent: total ? 100 - filledPercent : 0,
    };
  });

  return { total, languages };
}

module.exports = {
  inspect,
};
