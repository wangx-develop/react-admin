export const deepCopy = (s) => {
  return JSON.parse(JSON.stringify(s))
}

export function find(arr, fn, result) {
  arr.forEach((item) => {
    if (fn(item)) {
      result.push(item)
    } else if (item.routes) {
      find(item.routes, fn, result)
    }
  })
}
