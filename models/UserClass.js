const db = require("../db.js");
const sequelize = require("sequelize");


const UserClass = db.define("UserClass", {

  userId: sequelize.INTEGER,
  classId: sequelize.INTEGER,

});

db.sync()
.then(()=>{
    console.log("Create userclass successfully...")
})

module.exports = UserClass