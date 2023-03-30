const mongoose = require('mongoose');

module.exports = function()
{
  mongoose.connect('mongodb+srv://username:password@cluster0.all2bx7.mongodb.net/?retryWrites=true&w=majority')
  .then(()=>
  {
    console.log("db connection successful");
  })
  .catch((err)=>
  {
    console.log("db connection unsuccessful");
  });
}