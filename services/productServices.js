const productSchema = require('../database/models/products');

module.exports = {
    GetProducts: getproducts,
    GetProduct: getproduct,
    AddNewProduct: addnewproduct,
    UpdateAProduct: updateproduct,
    DeleteAProduct: deleteproduct
}

function getproducts(limit, pageNumber){
    return productSchema.find().limit(limit).skip(limit * pageNumber);
}

function getproduct(id){
    return productSchema.findOne({id});
}

async function addnewproduct(body){
    const {id} = await productSchema.findOne().sort({'id': 'desc'});
    body.id = id+1;
    await productSchema.create(body);
}

async function updateproduct(body){
    await productSchema.findOneAndUpdate(
        {id: body.id},
        {
            title: body.title,
            description: body.description,
            price: body.price,
            category: body.category,
            stock: body.stock
        }
    );
}

async function deleteproduct(id){
    await productSchema.deleteOne({id});
}