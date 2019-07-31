export function demo () {
  return global.axios.get(`/please_see_examples_in_src_api_index`)
    .then(resp => resp.data.body);
}

/**
 * 获取任务列表（分页）
 * @param page {number}
 * @param size {number}
 */
export function getJobs (page = 1, size = 30) {
  return global.axios.get(`/apps/${global.APP_ID}/jobs`, {
    params: {
      page,
      size
    }
  }).then(resp => resp.data.body.jobs);
}

/**
 * 获取结果文件
 * @param jobId {number}
 * @param outputName {string}
 */
export function getJobOutput (jobId, outputName) {
  return global.axios.get(`/apps/${global.APP_ID}/jobs/${jobId}/outputs`, {
    params: {
      outputName
    }
  }).then(resp => resp.data.body.output)
}
