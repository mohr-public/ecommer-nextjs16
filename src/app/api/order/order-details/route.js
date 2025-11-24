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
            const orderId = searchParams.get('orderId');
            if (!orderId) {
                return NextResponse.json({
                    success: false,
                    message: "Order ID is required."
                }, { status: 400 });
            }
            const extractOrderDetails = await Order.findById(orderId)
                .populate('orderItems.productId')
                
            if (extractOrderDetails) {
                return NextResponse.json({
                    success: true,
                    data: extractOrderDetails
                }, { status: 200 });
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Order not found."
                }, { status: 404 });
            }
        } else {
            return NextResponse.json({
                success: false,
                message: "You are not authenticated."
            }, { status: 401 });
        }
    } catch (error) {
        console.error("Error in GET /api/order/order-details:", error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong! Please try again later."
        }, { status: 500 });
    }
}