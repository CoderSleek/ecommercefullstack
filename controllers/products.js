const productServices = require('../services/productServices.js');

module.exports = {
    GetProducts: getproducts
};


function getproducts(req, res){
    productServices.GetProducts(req.query.limit, req.query.page)
    .then( ele => {
        res.send(ele);
    });
}