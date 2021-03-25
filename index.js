const express = require('express');
const bodyparser = require('body-parser');
const mongoose = require('mongoose');
require('dotenv').config()

const app = express();

//Capture body
app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());

//Connect to database
const uri = `${process.env.DB_URL}`;
mongoose.connect(uri,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
.then(() => console.log('Database coneccted'))
.catch(e => console.log('error db:', e))

//Import Routes
const authRoutes = require('./routes/auth');
const dashboadRoutes = require('./routes/dashboard');
const verifyToken = require('./routes/validate-token');

// route middlewares
app.use('/user', authRoutes);
app.use('/dashboard', verifyToken, dashboadRoutes);

// route middlewares
app.get('/', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'runnnn!'
    })
    console.log('Runnnnn')
});



// iitialize server
const PORT = process.env.PORT;
app.listen(PORT, () => {
    console.log(`run server on: ${PORT}`)
})

