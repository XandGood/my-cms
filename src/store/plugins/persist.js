export default ({ store }) => {
  // 从localStorage获取存储的状态
  const storedState = localStorage.getItem(`store-${store.$id}`)
  
  if (storedState) {
    // 恢复状态
    store.$patch(JSON.parse(storedState))
  }
  
  // 订阅状态变化
  store.$subscribe((mutation, state) => {
    // 将状态保存到localStorage
    localStorage.setItem(`store-${store.$id}`, JSON.stringify(state))
  })

  
}
