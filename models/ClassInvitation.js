const db = require("../db.js");
const sequelize = require("sequelize");


const ClassInvitation = db.define("ClassInvitation", {

  inviteCode: sequelize.STRING, // inviteCode cua class tuong ung
  email: sequelize.STRING,
  
});

db.sync()
.then(()=>{
    console.log("Create class_invitation successfully...")
})

module.exports = ClassInvitation