import connectToDB from "@/database";
import { NextResponse } from "next/server";
import Order from "@/models/order";
import AuthUser from "@/middleware/AuthUser";

export const dynamic = "force-dynamic";


export async function PUT(req) {
    try {
        await connectToDB();
        const isAuthUser = await AuthUser(req);

        if (isAuthUser?.role === 'admin') {
            const data = await req.json();
            const { 
                _id, 
                shippingAddress, 
                orderItems, 
                paymentMethod,
                isPaid,
                paidAt,
                isProcessing,
            } = data;

            const updateOrder = await Order.findOneAndUpdate(
                { _id: _id },
                {
                    shippingAddress,
                    orderItems,
                    paymentMethod,
                    isPaid,
                    paidAt,
                    isProcessing
                },
                { new: true }
            );

            if (updateOrder) {
                return NextResponse.json({
                    success: true,
                    message: 'Order status updated successfully!.',
                    data: updateOrder
                });
            } else {
                return NextResponse.json({
                    success: false,
                    message: 'Failed to update the status of order.'
                }, { status: 400 });
            }

            // const updateOrder = await Order.findById(_id);
            // if (!updateOrder) {
            //     return NextResponse.json({
            //         success: false,
            //         message: 'Order not found.'
            //     }, { status: 404 });
            // }
            // updateOrder.shippingAddress = shippingAddress;
            // updateOrder.orderItems = orderItems;
            // updateOrder.paymentMethod = paymentMethod;
            // updateOrder.isPaid = isPaid;
            // updateOrder.paidAt = paidAt;
            // updateOrder.isProcessing = isProcessing;
            // await updateOrder.save();

            
        } else {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized. Admins only.'
            }, { status: 403 });
        }

    } catch (error) {
        console.error("Error admin update order:", error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong! Please try again later.",
            error: error.details[0].message,
        }, { status: 500 });
    }
}