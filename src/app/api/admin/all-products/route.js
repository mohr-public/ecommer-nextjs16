import connectToDB from "@/database";
import Product from "@/models/product";
import { NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req) {

    try {
        await connectToDB();

        const extractAllproducts = await Product.find({});
        
        if (extractAllproducts) {
            return NextResponse.json({
                success: true,
                data: extractAllproducts
            })
        } else {
            return NextResponse.json({
                success: false,
                status: 204,
                message: "No Products found"
            })
        }

    } catch(error) {
        console.error("Error getting product:", error);
        // return new Response(JSON.stringify({ error: "Failed to add product" }), { status: 500 });
        return NextResponse.json({
            success: false,
            message: "Something went wrong! Please tray again later",
            error: error.details[0].message,
        }, { status: 500 });
    }
    
}
