const Product = require("../models/product");

exports.getProduct = async(req, res, next) => {
    const productId = req.params.prodId || "all";
    try{
        const product = (productId != "all") ? await Product.findById(productId) : await Product.find() ;
        if (!product){
            const error = new Error("Invalid product id");
            error.status = 400;
            throw error;
        }
        res.status(200).json({
            message: "product retrived successfully",
            product: product
        })
    }catch(error){
        next(error);
    }
}

exports.postProduct = async(req, res, next) => {
    const {title, price, description} = req.body;
    try{
        const product = new Product({
            title: title,
            price: price,
            describtion: description
        });
        await product.save()
        res.status(201).json({
            message: "product created successfully"
        });
    }catch(error){
        next(error)
    }
}