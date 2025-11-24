import connectToDB from "@/database";
import Product from "@/models/product";
import { NextResponse } from "next/server";
import AuthUser from "@/middleware/AuthUser";

export const dynamic = 'force-dynamic';

export async function DELETE(req) {
    try {

        await connectToDB();
        const isAuthUser = await AuthUser(req);

        if (isAuthUser?.role === 'admin') {
            // console.log("isAuthUser: ", isAuthUser);

            const { searchParams } = new URL(req.url);
            const id = searchParams.get('id');

            if (!id) {
                return NextResponse.json({
                    success: false,
                    message: "Product ID is required."
                }, { status: 400 });
            }

            const deletedProduct = await Product.findByIdAndDelete(id);

            if (deletedProduct) {
                return NextResponse.json({
                    success: true,
                    message: "Product deleted successfully."
                }, { status: 200 });
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Failed to delete the product! Please try again."
                }, { status: 404 });
            }

        } else {
            return NextResponse.json({
                success: false,
                message: 'Unauthorized. Admins only.'
            }, { status: 403 });
        }

    } catch (error) {
        console.error("Error in DELETE /api/admin/delete-product:", error);
        // return new Response(JSON.stringify({ success: false, message: "Failed to delete product." }), { status: 500 });
        return NextResponse.json({
            success: false,
            message: error.details[0].message,
            error: "Something went wrong! Plaease try again later"
        }, { status: 500 });
    }
}