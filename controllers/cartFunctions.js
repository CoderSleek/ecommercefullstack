const productServices = require('../services/productServices');
const userServices = require('../services/userServices');

module.exports = {
    AddToCart: addtocart,
    GetCartPage: getcartpage,
    GetCartItems: getcartitems,
    DeleteCartItems: deletecartitems
};

async function addtocart(req, res){
    if(!req.session.isLoggedIn){
        res.redirect('/login');
        return;
    }

    const id = req.query.id;

    productServices.GetProduct(id)
    .then( ele => {
        userServices.AddToCart(ele, req.session.user._id)
    });
    
    res.end();
}

function getcartpage(req, res){
    if(!req.session.isLoggedIn){
        res.redirect('/login');
        return;
    }

    res.render('cartpage', {username: req.session.user.username});
}

function getcartitems(req, res){
    res.send(JSON.stringify(req.session.user.cartList));
}

function deletecartitems(req, res){
    const id = req.query.id;
    userServices.DeleteFromCart(req.session.user._id, id);

    res.end();
}