const jwt = require('jsonwebtoken');

//定義一個中介層含是
function verifyToken(req, res, next){
    const authHeader = req.headers['authorization'];

    if(!authHeader){
        return res.status(401).json({ message: '未授權，缺少 token '});
    }

    const token = authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({ message: '未授權，缺少 token '});
    }

    try{
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.user = {
            userId: decoded.userId,
            role: decoded.role
        };

        next();
    }catch(err){
        console.log('JWT驗證錯誤', err);
        return res.status(401).json({ message: 'token 驗證失敗'});
    }
}

module.exports = verifyToken;