const userServices = require('../services/userServices');
const SendMail = require('../services/mail/sendMail');

module.exports = {
	Homepage: homepage,
	GetSignup: getsignup,
	PostSignup: postsignup,
	GetLogin: getlogin,
	PostLogin: postlogin,
	Logout: logout,
	Validate: validate,
	GetChangePassword: getchangepassword,
	PostChangePassword: postchangepassword,
	GetForgotPassword: getforgotpassword,
	PostForgotPassword: postforgotpassword,
	ResetPassword: resetpassword
};

function homepage(req, res){
	if(!req.session.isLoggedIn){
		res.redirect('/login');
		return;
	}
	res.render('homepage', {username: req.session.user.username});
}

function getsignup(req, res){
	if(req.session.isLoggedIn){
		res.redirect('/');
		return;
	}
	res.render('signup', {error: ""});
}

function postsignup(req, res){
	if(!req.body.username || !req.body.password || !req.body['confirm-password']){
		res.render('signup', {error: "Cannot be empty"});
		res.end();
		return;
	} else if (req.body.password !== req.body['confirm-password']){
		res.render('signup', {error: "Password does not match"});
		return;
	}

	userServices.GetUser(req.body.username, req.body.password)
	.then( ele => {
		if(!ele){
			userServices.CreateUser(req.body.username, req.body.password);
			res.redirect("/login");
			return;
		} else {
			res.render("signup", {error: "user already exists"});
			return;
		}
	});
}

function getlogin(req, res){
	if(req.session.isLoggedIn){
		res.redirect('/');
		return;
	}
	res.render('login', {error: ""});
}

function postlogin(req, res){
	if(!req.body.username || !req.body.password){
		res.render('login', {error: "Cannot be empty"});
		res.end();
		return;
	}

	userServices.GetUser(req.body.username)
	.then( ele => {
		if(!ele){
			res.render('login', {error: "user does not exist"});
			return;
		} else if (ele.username === req.body.username && ele.password === req.body.password) {
			if(ele.hasValidated){
				req.session.isLoggedIn = true;
				req.session.user = ele;

				res.redirect('/');
				return;
			} else {
				res.render("login", {error: "please validate your email"});
			}
			
		} else {
			res.render('login', {error: "Invalid username or password"});
			return;
		}
	});
}

function logout(req, res){
	req.session.destroy();
	res.redirect('/login');
}

function validate(req, res){
	const userId = req.query.id;
	userServices.GetUserById(userId)
	.then(ele => {
		if(!ele) return;

		ele.hasValidated = true;
		ele.save().then(()=>{});
		res.redirect('/login');
	});
}

function getchangepassword(req, res){
	if(!req.session.isLoggedIn){
		res.redirect('/login');
		return;
	}
	res.render('changepassword', {error:"", specialError: false});
}

function postchangepassword(req, res){
	const new_password = req.body['new-password'];
	const confirm_password = req.body['confirm-new-password'];

	if(!new_password || !confirm_password){
		res.render('changepassword', {error:"cannot be empty", specialError: false});
		return;
	}
	else if(new_password != confirm_password){
		res.render('changepassword', {error:"passwords do not match", specialError: false});
		return;
	}

	const re = /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z]).{8,}$/;

	if(!re.test(new_password)){
		res.render('changepassword', {error: "Password must", specialError: true});
		return;
	}

	userServices.ChangePassword(req.session.user._id, new_password);
	res.session.destroy();
	res.redirect('/login');
}

function getforgotpassword(req, res){
	res.render('forgotpassword', {message: ""});
}

function postforgotpassword(req, res){
	const email = req.body.email;

	if(!email){
		res.render('forgotpassword', {message: "cannot be empty"});
		return;
	}

	userServices.GetUser(email)
	.then( ele => {
		if(!ele){
			res.render('forgotpassword', {message: "user not found"});
			return;
		} else {
			const verifyLink = `/resetpassword?id=${ele._id}`;
			SendMail([
				{
					To: ele.username,
					Name: ele.username
				}
			], `<h2><a href="${verifyLink}">click here to reset your password</a>`)
			.then();
			res.render('forgotpassword', {message: "check your email"});
			return;
		}
	})
}

function resetpassword(req, res){
	const id = req.query.id;
	if(req.session.isLoggedIn){
		req.session.destroy();
	}
	
	userServices.GetUser(id)
	.then( ele => {
		req.session.isLoggedIn = true;
		req.session.user = ele;

		res.redirect('/changepassword');
	});
}