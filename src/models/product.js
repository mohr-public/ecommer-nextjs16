import mongoose from "mongoose";


// const productoSchema = new mongoose.Schema({
//     name: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     description: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     price: {
//         type: Number,
//         required: true,
//         min: 0
//     },
//     category: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     brand: {
//         type: String,
//         required: true,
//         trim: true
//     },
//     sizes: {
//         type: [String],
//         enum: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
//         default: []
//     },
//     images: {
//         type: [String], // Array of image URLs
//         default: []
//     },
//     stock: {
//         type: Number,
//         required: true,
//         min: 0
//     },
//     createdAt: {
//         type: Date,
//         default: Date.now
//     },
//     updatedAt: {
//         type: Date,
//         default: Date.now
//     }
// });


// const ProductSchema = new mongoose.Schema(
//     {
//         name: { type: String, required: true, trim: true },
//         description: { type: String, required: true, trim: true },
//         price: { type: Number, required: true, min: 0 },
//         category: { type: String, required: true, trim: true },
//         sizes: Array,
//         deliveryInfo: String,
//         onSale: String,
//         priceDrop: Number,
//         imageUrl: String
//     },
//     { timestamps: true }
// );

const ProductSchema = new mongoose.Schema(
    {
        name: String,
        description: String,
        price: Number,
        category: String,
        sizes: Array,
        deliveryInfo: String,
        onSale: String,
        priceDrop: Number,
        imageUrl: String
    },
    { timestamps: true }
);

const Product = mongoose.models.Products || mongoose.model('Products', ProductSchema);

export default Product;