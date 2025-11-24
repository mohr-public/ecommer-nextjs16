import connectToDB from "@/database";
import { NextResponse } from "next/server";
import AuthUser from "@/middleware/AuthUser";
import Joi from "joi";
import Cart from "@/models/cart";


const AddToCart = Joi.object({
    userId: Joi.string().required(),
    productId: Joi.string().required(),
    // quantity: Joi.number().min(1).required()
});

export const dynamic = 'force-dynamic';


export async function POST(req) {
    try {
        await connectToDB();
        const isAuthUser = await AuthUser(req);
        if (isAuthUser) {
            const data = await req.json();
            const { productId, userId } = data;

            // const { error } = AddToCart.validate({ productId, userId, quantity: data.quantity || 1 });
            const { error } = AddToCart.validate({ productId, userId });
            if (error) {
                console.log(error);
                return NextResponse.json({
                    success: false,
                    message: error.details[0].message,
                });
            }

            const isCurrentCartItemAlreadyExist = await Cart.findOne({ userId, productId });
            // const isCurrentCartItemAlreadyExist = await Cart.find({ userId, productId });
            if (isCurrentCartItemAlreadyExist) {
                // isCurrentCartItemAlreadyExist.quantity += data.quantity || 1;
                // await isCurrentCartItemAlreadyExist.save();
                return NextResponse.json({
                    success: false,
                    message: "Product is already added in cart! Pleade add different product."
                });
            }

            const saveProductToCart = await Cart.create(data);
            if (saveProductToCart) {
                return NextResponse.json({
                    success: true,
                    message: "Product added to cart successfully."
                });
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Failed to add product to cart! Please try again later."
                }, { status: 500 });
            }

        } else {
            return NextResponse.json({
                success: false,
                message: "Your are not authenticated."
            }, { status: 401 });
        }
        
    } catch (error) {
        console.error("Error in add-to-cart route:", error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong! Please try again later"
        }, { status: 500 });
    }
}

