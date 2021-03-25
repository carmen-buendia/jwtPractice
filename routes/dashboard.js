const express = require('express');
const router = express.Router();

//Protected route (Dashboard)
router.get('/', (req, res) => {
    console.log('Entramos a dashboard')
    res.json({
        error: null,
        data: {
            title: 'protected route',
            user: req.user
        }
    })
})

module.exports = router;