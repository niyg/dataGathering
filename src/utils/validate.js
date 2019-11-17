// 验证网址
export function isExternal(path) {
  return /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/.test(path)
}

// 验证邮箱
export function isEmail(path) {
  return /^[A-Za-z\d]+([-_.][A-Za-z\d]+)*@([A-Za-z\d]+[-.])+[A-Za-z\d]{2,4}$/.test(path)
}

// 验证手机
export function isPhone(tel) {
  return /^[1][3,4,5,7,8][0-9]{9}$/.test(tel)
}

export function isPositiveInteger(s) { // 是否为正整数
  var re = /^\d+(.\d+)?$/
  return re.test(s)
}
