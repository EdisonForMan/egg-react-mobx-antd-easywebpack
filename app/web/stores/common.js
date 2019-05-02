/**
 * 输出格式化page
 * @param {Object} _page
 */
export const pageQuery = _page => {
  return {
    ..._page,
    start: (_page.draw - 1) * _page.length
  };
};

/**
 * 输出格式化query
 * 若存在日期字段[updateStart,updateEnd,createStart,createEnd] 则加上时分秒
 * @param {Object} _query
 */
export const query = _query => {
  return {
    ..._query,
    status: _query.status < 0 ? undefined : _query.status,
    updateStart: _query.updateStart
      ? `${_query.updateStart} 00:00:00`
      : undefined,
    updateEnd: _query.updateEnd ? `${_query.updateEnd} 23:59:59` : undefined,
    createStart: _query.createStart
      ? `${_query.createStart} 00:00:00`
      : undefined,
    createEnd: _query.createEnd ? `${_query.createEnd} 23:59:59` : undefined
  };
};
