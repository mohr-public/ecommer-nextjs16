import { NextResponse } from 'next/server';
import connectToDB from "@/database";
import Product from '@/models/product';
import AuthUser from '@/middleware/AuthUser';

export const dynamic = 'force-dynamic';

export async function PUT(req) {
    try {
        await connectToDB();

        const isAuthUser = await AuthUser(req);
        console.log("isAuthUser: ", isAuthUser);

        if (isAuthUser?.role === 'admin') {
            const extractData = await req.json();

            const { 
                _id, 
                name, price, 
                description, category, sizes, 
                deliveryInfo, onSale, 
                priceDrop, imageUrl 
            } = extractData;

            const updatedProduct = await Product.findOneAndUpdate(
                { 
                    _id: _id 
                },
                { 
                    name, 
                    price, 
                    description, category, sizes, 
                    deliveryInfo, onSale, 
                    priceDrop, imageUrl 
                },
                { new: true } // To return the updated document
            );
            if (updatedProduct) {
                return NextResponse.json({
                    success: true,
                    message: 'Product updated successfully.',
                    product: updatedProduct
                });
            } else {
                return NextResponse.json({
                    success: false,
                    message: 'Failed to update the product! Please try again later.'
                }, { status: 404 });
            }

        } else {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized. Admins only.'
            }, { status: 403 });
        }
        
    } catch (error) {
        console.error("Error in update-product route:", error);
        // return new Response(JSON.stringify({ success: false, message: "Internal Server Error" }), { status: 500 });
        return NextResponse.json({
                success: false,
                message: "Failed to add product"
            }, { status: 500 });
    }
}