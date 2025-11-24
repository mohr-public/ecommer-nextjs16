import connectToDB from "@/database";
import Cart from "@/models/cart";
import { NextResponse } from "next/server";
import AuthUser from "@/middleware/AuthUser";

export const dynamic = 'force-dynamic';

export async function GET(req) {
    try {
        await connectToDB();
        const isAuthUser = await AuthUser(req);
        if (isAuthUser) {
            const { searchParams } = new URL(req.url);
            const userId = searchParams.get('userId');
            if (!userId) {
                return NextResponse.json({
                    success: false,
                    message: "User ID is required."
                }, { status: 400 });
            }
            const extractAllCartItems = await Cart.find({ userId : userId })
                .populate('productId');

            if (extractAllCartItems) {
                return NextResponse.json({
                    success: true,
                    data: extractAllCartItems
                }, { status: 200 });
            } else {
                return NextResponse.json({
                    success: false,
                    message: "No cart items found for this user."
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