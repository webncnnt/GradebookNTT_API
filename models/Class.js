const db = require("../db.js");
const sequelize = require("sequelize");


const Class = db.define("Class", {

  clsName: sequelize.STRING,
  coverImage: sequelize.STRING,
  description: sequelize.STRING,
  inviteCode: sequelize.STRING,
  ownerId: sequelize.INTEGER,
  status: sequelize.BOOLEAN, // true: block
  expiredTime: sequelize.DATE

});

db.sync()
.then(()=>{
    console.log("Create class successfully...")
})

module.exports = Class