import connectToDB from "@/database";
import { NextResponse } from "next/server";
import AuthUser from "@/middleware/AuthUser";
import Order from "@/models/order";

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

            const extractAllOrders = await Order.find({ userId: userId })
                .populate('orderItems.productId');
            
            if (extractAllOrders) {
                return NextResponse.json({
                    success: true,
                    data: extractAllOrders
                }, { status: 200 });
            } else {
                return NextResponse.json({
                    success: false,
                    message: "No orders found for this user."
                }, { status: 404 });
            }

        } else {
            return NextResponse.json({
                success: false,
                message: "You are not authenticated."
            }, { status: 401 });
        }
    } catch (error) {
        console.error("Error in GET /api/order/get-all-orders:", error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong! Please try again later."
        }, { status: 500 });
    }
}