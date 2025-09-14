const fs = require('fs');
const path = require('path');

// 读取 db.json 文件
const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));


module.exports = (req, res, next) => {


  // 处理登录请求
  if (req.method === 'POST' && req.path === '/login') {
    // 解析请求体中的用户名和密码
    const { username, password } = req.body;

    const user = db.users.find(u => u.username === username && u.password === password);

    if (user) {
      const fakeToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIFVzZXIiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';
      
      return res.status(200).json({
        data: {
          token: fakeToken,
          userInfo: {
            id: user.id,
            username: user.username,
            name: user.name,
          }
        },
  success: true
      });
    } else {
      // 认证失败，返回错误信息
      return res.status(400).json({
        message: '用户名或密码错误',
        success: false
      });
    }
}

  // 处理注册请求
  if (req.method === 'POST' && req.path === '/register') {
    // 解析请求体中的用户名和密码
    const { username, password,name, role} = req.body;

    // 检查用户名是否已存在
    const userExists = db.users.some(u => u.username === username);
    if (userExists) {
      return res.status(400).json({
        message: '用户名已存在',
        success: false
      });
    }

    // 创建新用户
    const newUser = {
      id: db.users.length + 1,
      username,
      password, 
      name,
      role: role || 'user'
    };
    db.users.push(newUser);
    fs.writeFileSync(dbPath, JSON.stringify(db, null, 2), 'utf8');
    return res.status(201).json({
      message: '注册成功',
      success: true
    });
  }
      


  // 添加简单的 Token 验证（排除登录、注册等特定路径）
  if (req.path !== '/login' && req.path !== '/register' && req.path !== '/') {
    // 从请求头中获取 Authorization 字段
    const authHeader = req.headers.authorization;
    // 简单的 Token 验证逻辑
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIFVzZXIiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c') {
      return res.status(401).json({ message: '未经授权的访问，请提供有效的 Token' });
    }
  }





  // 继续处理请求
  next();
}