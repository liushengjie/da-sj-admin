import axios from '@/libs/api.request'

export const queryProcessor = (data) => {
  return axios.request({
    url: 'processor/queryProcessor',
    data,
    method: 'post'
  })
}
