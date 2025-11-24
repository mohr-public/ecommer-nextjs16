import connectToDB from "@/database";
import Address from "@/models/address";
import { NextResponse } from "next/server";
import AuthUser from "@/middleware/AuthUser";

export const dynamic = 'force-dynamic';


export async function PUT(req) {
    try {
        await connectToDB();
        const isAuthUser = await AuthUser(req);

        if(isAuthUser){
            const data = await req.json();
            const {_id, fullName, city, address, country, postalCode} = data;

            const updateAddress = await Address.findOneAndUpdate(
                {
                    _id: _id,
                },
                { fullName, city, address, country, postalCode },
                { new: true }
            );

            if (updateAddress) {
                return NextResponse.json({
                success: true,
                message: "Address updated successfully!",
                });
            } else {
                return NextResponse.json({
                success: false,
                message: "Failed to update address! Please try again",
                });
            }

        } else {
            return NextResponse.json({
                success: false,
                message: "You are not authenticated"
            });
        }

        
        

    } catch (error) {
        console.error("Error getting address:", error);
        return NextResponse.json({
            success: false,
            message: "Something went wrong! Please try asan later"
        }, { status: 500 });
    }
}