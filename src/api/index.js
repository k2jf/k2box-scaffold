export function demo () {
  return global.axios.get(`/please_see_examples_in_src_api_index`)
    .then(resp => resp.data.body);
}

/**
 * 获取任务列表（分页）
 * @param page {number} 页码
 * @param size {number} 每页条数
 * @param options {{step:string, status:string, timeField:string, beginTime:number, endTime:number, orderTimeFieldDesc:boolean}} 其他选项
 */
export function getJobs (page = 1, size = 30, options = {}) {
  return global.axios.get(`/apps/${global.APP_ID}/jobs`, {
    params: {
      currentPage: page,
      pageSize: size,
      ...options
    }
  }).then(resp => resp.data.body.jobsPage.data);
}

/**
 * 获取结果文件
 * @param jobIds {number | number[] | '*'}
 * @param outputName {string}
 * @param columns {string | string[]}
 * @param options {{scriptName: string, timeField: string, beginTime: number, endTime: number}}
 */
export function getJobOutput (jobIds, outputName, columns, options = {}) {
  const validIdsRegex = /^(([1-9][0-9]*)|0)(,(([1-9][0-9]*)|0))*$/;
  const validColumnsRegex = /^([_$a-zA-Z][_$0-9a-zA-Z]*)(,[_$a-zA-Z][_$0-9a-zA-Z]*)*$/

  let composedIds;
  if (typeof jobIds === 'number') {
    composedIds = jobIds;
  } else if (typeof jobIds === 'string' && (jobIds === '*' || validIdsRegex.test(jobIds))) {
    composedIds = jobIds;
  } else if (Array.isArray(jobIds)) {
    composedIds = jobIds.map(c => parseInt(c, 10)).join(',');
  } else {
    throw new Error('invalid jobIds! need either: (1) id (2) "*" (3) "id1, id2, ..." (4) [id1, id2, ...]');
  }

  let composedColumns;
  if (typeof columns === 'string' && validColumnsRegex.test(columns)) {
    composedColumns = columns;
  } else if (Array.isArray(columns)) {
    composedColumns = columns.map(s => s.trim()).join(',');
  } else {
    throw new Error('invalid columns! need either: (1) "col1, col2, ..." (2) ["col1", "col2", ...]')
  }

  return global.axios.get(`/apps/${global.APP_ID}/jobs/${composedIds}/outputs`, {
    params: {
      outputName: outputName,
      columns: composedColumns,
      ...options
    }
  }).then(resp => resp.data.body.output)
}
