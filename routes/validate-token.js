const jwt = require('jsonwebtoken')

// middleware to validate token (rutas protegidas)
const verifyToken = (req, res, next) => {
    const token = req.header('auth-token')
    console.log(token)
    if (!token) return res.status(401).json({ error: 'Access denied' })
    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET)
        req.user = verified
        next() // nest step
    } catch (error) {
        res.status(400).json({error: 'invalid toket'})
    }
}

module.exports = verifyToken;
