const setToken = (token) => {
  localStorage.setItem('token', token);
}
const getToken = () => {
  return localStorage.getItem('token');
}

const removeToken = () => {
  localStorage.removeItem('token');
}

const setUserInfo = (userInfo) => {
  localStorage.setItem('userInfo', JSON.stringify(userInfo));
}
const getUserInfo = () => {
  return JSON.parse(localStorage.getItem('userInfo'));
}
const removeUserInfo = () => {
  localStorage.removeItem('userInfo');
}
export { setToken, getToken, removeToken , setUserInfo, getUserInfo, removeUserInfo};