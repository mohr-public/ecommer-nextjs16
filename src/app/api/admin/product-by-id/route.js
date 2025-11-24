import { NextResponse } from "next/server";
import connectToDB from "@/database";
import Product from "@/models/product";

export const dynamic = 'force-dynamic';


export async function GET(req) {

    try {
        await connectToDB();
        const {searchParams} = new URL(req.url);
        const productId = searchParams.get('id');

        if (!productId) {
            return NextResponse.json({
                success: false,
                status: 400,
                message: "Product ID is required"
            });
        }

        // const getData2 = await Product.findById(productId);
        const getData = await Product.find({_id : productId});
        
        if (getData && getData.length > 0) {
            return NextResponse.json({
                success: true,
                data: getData[0]
            })
        } else {
            return NextResponse.json({
                success: false,
                status: 204,
                message: "No Product found"
            })
        }
    } catch(error) {
        console.error("Error fetching product by ID:", error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong! Please try again later",
            error: error.message,
        }, { status: 500 });
    }
};