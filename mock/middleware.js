const fs = require('fs');
const path = require('path');

// 读取 db.json 文件
const dbPath = path.join(__dirname, 'db.json');
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
const multer = require('multer');


const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadDir = path.join(__dirname, '../public/images/avater');
    // 确保目录存在
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    // 文件名格式：时间戳-原始文件名（避免重复）
    cb(null, Date.now() + '-' + file.originalname);
  }
});

const upload = multer({ storage });


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
  if (req.path !== '/login' && req.path !== '/register' && req.path !== '/' && req.path !== '/logout') {
    // 从请求头中获取 Authorization 字段
    const authHeader = req.headers.authorization;
    // 简单的 Token 验证逻辑
    if (!authHeader || !authHeader.startsWith('Bearer ') || authHeader.split(' ')[1] !== 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkbWluIFVzZXIiLCJpYXQiOjE1MTYyMzkwMjJ9.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c') {
      return res.status(401).json({ message: '未经授权的访问，请提供有效的 Token' });
    }
  }

  if (req.method === 'POST' && req.url === '/avatar/upload') {
    upload.single('file')(req, res, (err) => {
      if (err) {
        return res.status(400).json({ error: err.message });
      }
      // 上传成功：返回图片 URL（供前端访问）
      const imageUrl = `/images/avater/${req.file.filename}`;
      res.json({ 
        message: '上传成功', 
        url: imageUrl 
      });
    });
    return;
  }





  // 继续处理请求
  next();
}