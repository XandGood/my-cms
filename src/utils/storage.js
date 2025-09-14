export const getToken = () => {
 const authData = localStorage.getItem('store-auth')
  if (authData) {
    const parsedAuthData = JSON.parse(authData)
    return parsedAuthData.token
  }
  return null
}