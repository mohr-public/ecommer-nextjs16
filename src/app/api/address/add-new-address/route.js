import connectToDB from "@/database";
import Joi from "joi";
import { NextResponse } from "next/server";
import AuthUser from "@/middleware/AuthUser";
import Address from "@/models/address";

const AddNewAddress = Joi.object({
    fullName: Joi.string().required(),
    address: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().required(),
    postalCode: Joi.string().required(),
    userId: Joi.string().required(),
})

export const dynamic = 'force-dynamic';


export async function POST(req) {
    try {
        await connectToDB();

        const isAuthUser = await AuthUser(req);

        if (isAuthUser) {
            const data = await req.json();

            const { fullName, address, city, country, postalCode, userId } = data;

            const { error } = AddNewAddress.validate({
                fullName, address, city, country, postalCode, userId
            })

            if (error) {
                return NextResponse.json({
                    success: false,
                    message: error.details[0].message
                });
            }

            const newlyAddedAddess = await Address.create(data);

            if (newlyAddedAddess) {
                return NextResponse.json({
                    success: true,
                    message: "Address added successfully"
                });
            } else {
                return NextResponse.json({
                    success: false,
                    message: "Failed to add an address! Please try again later"
                });
            }


        } else {
            return NextResponse.json({
                success: false,
                message: "You are not authenticated"
            });
        }
    } catch (error) {
        console.error("Error adding address:", error);
        // return new Response(JSON.stringify({ error: "Failed to add product" }), { status: 500 });
        return NextResponse.json({
            success: false,
            message: "Something went wrong! Please try asan later"
        }, { status: 500 });
    }
}
