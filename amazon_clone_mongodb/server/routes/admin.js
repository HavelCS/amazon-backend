const express = require("express");
const adminRouter = express.Router();
const admin = express("../middlewares/admin");
const { Product } = require("../models/product");
const Order = require("../models/order");


//Add Product
adminRouter.post("/admin/add-product", admin, async (req, res) => {
    try {
        const { name, description, images, quantity, price, category } = req.body;
        let product = Product({
            name,
            description,
            images,
            quantity,
            price,
            category
        });
        product = await product.save();
        res.json(product);


    } catch (error) {
        res.status(500).json({ error: e.message });
    }
});


//Get products 

adminRouter.get("/admin/get-product", admin, async (req, res) => {

    try {
        const products = await Product.find({});
        res.json(products);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


// Delete a product
adminRouter.post("/admin/delete-product", admin, async (res, req) => {

    try {
        const { id } = req.body;
        const product = await Product.findByIdAndDelete(id);
        res.json(product);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


//Get orders

adminRouter.get("/admin/get-orders", admin, async (res, req) => {
    try {
        const orders = Order.find({});
        res.json(orders);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});


//Change status of order

adminRouter.post("/admin/change-order-status", admin, async (req, res) => {
    try {
        const { id, status } = req.body;
        const order = await Order.findById(id);
        order.status = status;
        order = await order.save();
        res.json(order);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
})



// admin analytics

adminRouter.get("/admin/get-analytics", admin, async (req, res) => {

    try {
        let totalEarning = 0;
        let orders = await Order.find({});

        for (let i = 0; i < orders.length; i++) {
            for (let j = 0; j < orders[i].products; j++) {
                totalEarning += orders[i].products[j].quantity * orders[i].products[j].price;
            }
        }

        // CATEGORY WISE ORDER FETCHING
        let mobileEarnings = await fetchCategoryWiseProduct("Mobiles");
        let essentialEarnings = await fetchCategoryWiseProduct("Essentials");
        let applianceEarnings = await fetchCategoryWiseProduct("Appliances");
        let booksEarnings = await fetchCategoryWiseProduct("Books");
        let fashionEarnings = await fetchCategoryWiseProduct("Fashion");

        let earnings = {
            totalEarning,
            mobileEarnings,
            essentialEarnings,
            applianceEarnings,
            booksEarnings,
            fashionEarnings
        };
        res.json(earnings);
    } catch (e) {
        res.status(500).json({ error: e.message });
    }


})


//fetch category wise Product

async function fetchCategoryWiseProduct(category) {
    let earning = 0;
    let categoryOrders = await Order.find({
        "products.product.category": category
    });

    for (let i = 0; i < categoryOrders.length; i++) {
        for (let j = 0; j < categoryOrders[i].products.length; j++) {
            earning += categoryOrders[i].products[j].quantity * categoryOrders[i].products[j].price;
        }
    }
    return earning;
}