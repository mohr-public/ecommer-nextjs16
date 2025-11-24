import { NextResponse } from 'next/server';
import connectToDB from '@/database';
import Product from '@/models/product';

export const dynamic = 'force-dynamic';

export async function GET(req) {

    try {
        await connectToDB();

        const {searchParams} = new URL(req.url);
        const id = searchParams.get('id');
        const getData = await Product.find({ category: id });
        
        if (getData) {
            return NextResponse.json({
                success: true,
                data: getData
            })
        } else {
            return NextResponse.json({
                success: false,
                status: 204,
                message: "No Products found"
            })
        }
    } catch(error) {
        console.error("Error adding product:", error);
        // return new Response(JSON.stringify({ error: "Failed to add product" }), { status: 500 });
        return NextResponse.json({
            success: false,
            message: "Something went wrong! Please tray again later",
            error: error.details[0].message,
        }, { status: 500 });
    }
    
}