
const dotenv = require('dotenv')
const app = require('./app')
const path = require('path')
const cors = require("cors");

app.use(cors())


const ConnectDatabase = require('./config/database')

dotenv.config({ path: path.join(__dirname, './config/config.env') })

ConnectDatabase()


const server = app.listen(process.env.PORT, () => {
    console.log(process.env.PORT)
    console.log(`Server started on port ${process.env.PORT} in ${process.env.NODE_ENV} mode.`);
});


// this aprasion consists of catch function
process.on('unhandledRejection', (err) => {
    console.log('err shuttong down', err)
    console.log('shutting down the server unhandledRejection error......')
    server.close(() => {
        process.exit(1)
    })
})


// console.log(a)  reference error 
process.on('uncaughtException', (err) => {
    console.log('server down the uncaughtException error',err)
    server.close(() => {
        process.exit(1)
    })
})

