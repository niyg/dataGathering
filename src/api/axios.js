import request from './request'

function get(params, url) {
  return request({
    url: url,
    method: 'get',
    params
  })
}

function post(params, url, headersType) {
  return request({
    url: url,
    method: 'post',
    data: params,
    headers: {
      'Content-Type': headersType || 'application/x-www-form-urlencoded'
    }
  })
}

export {
  get,
  post
}
