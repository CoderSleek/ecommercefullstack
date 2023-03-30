const userServices = require('../services/userServices');
const productServices = require('../services/productServices');

module.exports = {
    PostAdminLogin: postadminlogin,
    GetAdminPage: getadminpage,
    ChangeAProduct: changeaproduct,
    AddAProduct: addproduct
}

function postadminlogin(req, res){
    const username = req.body.username;
    const password = req.body.password;
    
    if(!username || !password){
		res.render('login', {error: "Cannot be empty"});
		res.end();
		return;
	}

	userServices.GetUser(username)
	.then( ele => {
		if(!ele){
			res.render('login', {error: "user does not exist"});
			return;
		} else if (ele.username === req.body.username && ele.password === req.body.password) {
			if(ele.hasValidated){
                if(ele.isAdmin){
                    req.session.isLoggedIn = true;
				    req.session.user = ele;

				    res.redirect('/adminlogin');
				    return;
                } else {
                    res.render("login", {error: "not an admin"});
                    return;
                }
				
			} else {
				res.render("login", {error: "please validate your email"});
                return;
			}
			
		} else {
			res.render('login', {error: "Invalid username or password"});
			return;
		}
	});
}

function getadminpage(req, res){
    if(!req.session.isLoggedIn){
        res.redirect('/login');
        return;
    } else if(!req.session.user.isAdmin){
        res.redirect('/login');
        return;
    }

    res.render('adminpage', {username: req.session.user.username});
}

function addproduct(req, res){
    const body = {};

    body.title = req.body.name;
    body.description = req.body.description;
    body.price = req.body.price;
    body.image = req.file.filename;
    body.category = req.body.category;
    body.stock = req.body.quantity;

    productServices.AddNewProduct(body);

    res.redirect('/adminlogin');
}

function changeaproduct(req, res){
    const body = {};
    if(req.body.type == 'update'){
        body.id = req.body.id;
        body.title = req.body.name;
        body.description = req.body.description;
        body.price = req.body.price;
        body.category = req.body.category;
        body.stock = req.body.quantity;
        
        productServices.UpdateAProduct(body);
    } else {
       productServices.DeleteAProduct(req.body.id);
    }

    res.redirect('/adminlogin');
}
