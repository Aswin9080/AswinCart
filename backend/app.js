const express = require('express')
const app = express()
const products = require('./routes/product')
const errorMiddleware = require('./middlewares/error')
const auth = require('./routes/Auth')
const order = require('./routes/order')
const cookieParser = require('cookie-parser')
const path = require('path')
const payment = require('./routes/Payment')

app.use(express.json())
app.use(cookieParser())

app.use('/uploads', express.static(path.join(__dirname, 'uploads')))

app.use('/api/v1', products)
app.use('/api/v2', auth)
app.use('/api/v3', order)
app.use('/api/v4', payment)



if (process.env.NODE_ENV === 'Production') {
    app.use(express.static(path.join(__dirname, '../frontend/build')));

    app.get('*', (req, res) => {
        const indexPath = path.resolve(__dirname, '../frontend/build', 'index.html');
        console.log('Index Path:', indexPath); // Check if path is correct
        res.sendFile(indexPath);
    });
    
}



app.use(errorMiddleware)

module.exports = app