import connectToDB from "@/database";
import Joi from "joi";
import { NextResponse } from "next/server";
import Product from "@/models/product";
import AuthUser from "@/middleware/AuthUser";

const AddNewProductSchema = Joi.object({
    name: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    category: Joi.string().required(),
    // sizes: Joi.array().items(Joi.string().valid('XS', 'S', 'M', 'L', 'XL', 'XXL')).required(),
    sizes: Joi.array().required(),
    deliveryInfo: Joi.string().required(),
    onSale: Joi.string().default(false),
    priceDrop: Joi.number().min(0).default(0),
    imageUrl: Joi.string().uri().required(),
});


export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        await connectToDB();

        const isAuthUser = await AuthUser(req);
        console.log("isAuthUser: ", isAuthUser);

        if (isAuthUser?.role === 'admin') {
            const extractData = await req.json();

            const {
                name, description, price, category,
                sizes, deliveryInfo, onSale, priceDrop, imageUrl
            } = extractData;

            const { error } = AddNewProductSchema.validate({
                name, description, price, category,
                sizes, deliveryInfo, onSale, priceDrop, imageUrl
            });

            if(error){
                console.log(error);
                return NextResponse.json({
                    success : false,
                    message : error.details[0].message,
                })
            }

            const newlyCreatedProduct = await Product.create(extractData);

            if (newlyCreatedProduct) {
                return NextResponse.json({
                    success: true,
                    message: 'Product added successfully.'
                })
            }
            else {
                return NextResponse.json({
                    success: false,
                    message: 'Failed to add product. Please try again.'
                })
            }
        } else {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized. Admins only.'
            }, { status: 403 });
        }

        // You can add code here to save the product to the database
        // return new Response(JSON.stringify({ message: "Product added successfully" }), { status: 201 });
    } catch (error) {
        console.error("Error adding product:", error);
        // return new Response(JSON.stringify({ error: "Failed to add product" }), { status: 500 });
        return NextResponse.json({
            success: false,
            message: "Failed to add product"
        }, { status: 500 });
    }
}