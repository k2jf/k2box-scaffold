export function demo () {
  return global.axios.get(`/please_see_examples_in_src_api_index`)
    .then(resp => resp.data.body);
}

