import { NextResponse } from "next/server";
import AuthUser from "@/middleware/AuthUser";

const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
export const FRONTEND_BASE_URL = process.env.BACKEND_BASE_URL;

export const dynamic = 'force-dynamic';


export async function POST(req) {
    try {
        const isAuthUser = await AuthUser(req);

        if (isAuthUser) {

            const res = await req.json();
            console.log("Request body res:", res);

            // const session = await stripe.checkout.sessions.create({
            //     line_items: res.items,
            //     mode: 'payment',
            //     success_url: `${res.url}/success?session_id={CHECKOUT_SESSION_ID}`,
            //     cancel_url: `${res.url}/cancel`,
            // });
            const session = await stripe.checkout.sessions.create({
                payment_method_types: ['card'],
                line_items: res,
                mode: 'payment',
                success_url: `${FRONTEND_BASE_URL}/checkout?status=success`,
                cancel_url: `${FRONTEND_BASE_URL}/checkout?status=cancel`,
            });
            return NextResponse.json({
                status: 200,
                success: true,
                id: session.id,
                url: session.url
            }, { status: 200 });

        } else {
            return NextResponse.json({
                success: false,
                message: "Your are not authenticated."
            }, { status: 401 });
        }

    } catch (error) {
        console.error("Error in POST /api/stripe:", error);
        return NextResponse.json({
            status: 500,
            success: false,
            message: "Something went wrong! Please try again later."
        }, { status: 500 });
    }
}