const Sequelize = require('sequelize')
const dotenv = require('dotenv');

dotenv.config();


const database = new Sequelize({
    database: process.env.DB_NAME,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,

    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: "postgres",
    
    // dialectOptions: {
    //     ssl: {
    //       require: true,
    //       rejectUnauthorized: false // <<<<<<< YOU NEED THIS
    //     }
    //   },

	
})

database.authenticate()
.then(() => console.log('Connect database successfully'))
.catch((e)=> console.log(e))

module.exports = database
