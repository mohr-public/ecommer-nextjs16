import connectToDB from "@/database";
import { NextResponse } from "next/server";
import Order from "@/models/order";
import AuthUser from "@/middleware/AuthUser";

export const dynamic = "force-dynamic";



export async function GET(req){
    try {
        await connectToDB();

        const isAuthUser = await AuthUser(req);

        console.log("Authenticated user:", isAuthUser);
        
        if (isAuthUser?.role === 'admin') {
            const getAllOrders = await Order.find({}).populate('orderItems.productId').populate('userId').sort({ createdAt: -1 });

            if (getAllOrders) {
                return NextResponse.json({
                    success: true,
                    message: 'All orders retrieved successfully.',
                    data: getAllOrders
                });
            } else {
                return NextResponse.json({
                    success: false,
                    message: 'Failed to fetch the orders! Please try again after some time.'
                }, { status: 204 });
            }

            
        } else {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized. Admins only.'
            }, { status: 403 });
        }

    } catch(error) {
        console.log(error);
        console.error("Error admin get all orders:", error);
        // return new Response(JSON.stringify({ error: "Failed to add product" }), { status: 500 });
        return NextResponse.json({
            success: false,
            message: "Something went wrong! Please tray again later",
        }, { status: 500 });
    }
}