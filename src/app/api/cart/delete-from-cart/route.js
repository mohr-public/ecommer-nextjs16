import { NextResponse } from 'next/server';
import connectToDB from "@/database";
import Cart from "@/models/cart";
import AuthUser from "@/middleware/AuthUser";


export const dynamic = 'force-dynamic';

export async function DELETE(req) {

    try {
        await connectToDB();
        const isAuthUser = await AuthUser(req);
        if (isAuthUser) {
            const { searchParams } = new URL(req.url);
            const id = searchParams.get('id');
            if (!id) {
                return NextResponse.json({
                    success: false,
                    message: "Cart Item Id is required."
                }, { status: 400 });
            }
            const deleteCartItem = await Cart.findByIdAndDelete(id);

            if (deleteCartItem) {
                return NextResponse.json({
                    success: true,
                    message: "Cart item deleted successfully."
                }, { status: 200 });
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Failed to delete Cart Item ! Please try again."
                }, { status: 404 });
            }
            
        } else {
            return NextResponse.json({
                success: false,
                message: "Your are not authenticated."
            }, { status: 401 });
        }
    } catch (error) {
        console.error("Error in GET /api/cart/all-cart-items:", error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong! Please try again later."
        }, { status: 500 });
    }

}