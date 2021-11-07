const Sequelize = require('sequelize')


const database = new Sequelize({
    database: "ClassRoomDB",
    username: "postgres",
    password: "vuivelavang",

    host: "localhost",
    port: 5432,
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
