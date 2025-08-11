//檢查是不是管理員的中介曾
const rolesModule = require('../constants/roles');
const Roles = rolesModule.Roles;

function isAdmin(req, res, next){
    console.log('isAdmin 中間件執行')
    console.log('req.user:', req.user)
    console.log('req.user.role:', req.user?.role)
    console.log('Roles.ADMIN:', Roles.ADMIN)
    console.log('比較結果:', req.user?.role === Roles.ADMIN)
    
    // 檢查先前 decode 過的 JWT payload 裡的 role
    if(req.user && req.user.role === Roles.ADMIN){
        console.log('管理員驗證通過')
        return next(); //通過驗證
    }
    console.log('管理員驗證失敗')
    return res.status(403).json({ message: '需要管理員權限' });
}

module.exports = isAdmin;