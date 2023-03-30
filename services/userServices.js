const userSchema = require('../database/models/user');
const SendMail = require('./mail/sendMail');

module.exports = {
    GetUser: getuser,
    GetUserById: getuserbyid,
    CreateUser: createnewuser,
    ChangePassword: changepassword,
    AddToCart: addtocart,
    DeleteFromCart: deletefromcart
};

function getuser(username){
    return userSchema.findOne({username});
}

function getuserbyid(_id){
    return userSchema.findOne({_id});
}

function createnewuser(username, password){
    userSchema.create({username, password})
    .then( (ele) => {
        const verifyLink = `/validate?id=${ele._id}`;
        SendMail([{
            Email: ele.username,
            Name: ele.username
        }], `<h3><a href="${verifyLink}">Verify your account!</a></h3><br/>Enjoy the time!`)
        .then(()=>{});
    });
}

function changepassword(id, password){
    userSchema.findOneAndUpdate({_id:id}, {password})
    .then();
}

function addtocart(product, userID){
    product._doc.quantity = 1;

    userSchema.updateOne(
        {_id: userID},
        {$push: {cartList: product}}
    ).then();
}

async function deletefromcart(userid, id){
    const user = await userSchema.findOne({_id: userid});

    let new_array = user.cartList.filter( ele => ele.id != id);
    user.cartList = new_array;
    await user.save();
}