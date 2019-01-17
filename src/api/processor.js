import axios from '@/libs/api.request'

export const fetchAvailableFunc = (param) => {
  return axios.request({
    url: 'processor/fetchAvailableFunc',
    param:param,
    method: 'get'
  })
}
