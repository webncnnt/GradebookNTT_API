const db = require("../db.js");
const sequelize = require("sequelize");


const User = db.define("User", {

  fullname: sequelize.STRING,
  email: sequelize.STRING,
  password: sequelize.STRING,
  role: sequelize.INTEGER,
  studentId: sequelize.STRING,
  avatar: sequelize.STRING,
  status: sequelize.BOOLEAN // true: block
});

// db.sync()
// .then(()=>{
//     console.log("Create user successfully...")
// })

module.exports = User