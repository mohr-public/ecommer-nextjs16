import connectToDB from "@/database";
import { NextResponse } from "next/server";
import AuthUser from "@/middleware/AuthUser";
import Order from "@/models/order";
import Cart from "@/models/cart";

export const dynamic = 'force-dynamic';

export async function POST(req) {
    try {
        await connectToDB();
        const isAuthUser = await AuthUser(req);
        if (isAuthUser) {            
            const data = await req.json();
            const { userId } = data;

            const saveNeworder = await Order.create(data);
            if (saveNeworder) {
                await Cart.deleteMany({ userId: userId });

                return NextResponse.json({
                    success: true,
                    message: "Order created successfully. Products are removed from cart.",
                    data: saveNeworder
                }, { status: 201 });
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Failed to create order! Please try again later."
                }, { status: 500 });
            }
            
        } else {
            return NextResponse.json({
                success: false,
                message: "Your are not authenticated."
            }, { status: 401 });
        }
    } catch (error) {
        console.error("Error in POST /api/order/create-order:", error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong! Please try again later"
        }, { status: 500 });
    }
}