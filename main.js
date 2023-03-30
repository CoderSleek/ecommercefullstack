const express = require('express');
const session = require('express-session');
const multer = require('multer');
const db = require('./database/init');

const loginFunctions = require('./controllers/loginPage.js');
const productFunctions = require('./controllers/products.js');
const cartFunctions = require('./controllers/cartFunctions.js');
const adminFunctions = require('./controllers/adminFunctions');

app = express();
db();

app.use( express.static("./public"));
app.use( express.static("./uploads"));
app.use( express.urlencoded({ extended: true }));
app.use( express.json());
app.use(session({
    secret: 'verySecureSecret',
    resave: false,
    saveUninitialized: true,
    cookie: {secure: false}
}));

app.set("view engine", "ejs");
app.set("views", "./public");

const upload = multer({dest: 'uploads'});

app.get("/", loginFunctions.Homepage);
app.route("/signup").get(loginFunctions.GetSignup).post(loginFunctions.PostSignup);
app.route("/login").get(loginFunctions.GetLogin).post(loginFunctions.PostLogin);
app.get('/logout', loginFunctions.Logout);
app.get('/getProducts', productFunctions.GetProducts);
app.get('/validate', loginFunctions.Validate);
app.route('/changepassword').get(loginFunctions.GetChangePassword).post(loginFunctions.PostChangePassword);
app.route('/forgotpassword').get(loginFunctions.GetForgotPassword).post(loginFunctions.PostForgotPassword);
app.get('/resetpassword', loginFunctions.ResetPassword);
app.post('/additemtocart', cartFunctions.AddToCart);
app.get('/mycart', cartFunctions.GetCartPage);
app.get('/getcartitems', cartFunctions.GetCartItems);
app.post('/deletefromcart', cartFunctions.DeleteCartItems);
app.route('/adminlogin').get(adminFunctions.GetAdminPage).post(adminFunctions.PostAdminLogin);
app.post('/addproduct', upload.single('product-image'), adminFunctions.AddAProduct);
app.post('/changeproduct', adminFunctions.ChangeAProduct);

app.listen(3000, () => console.log('server running'));