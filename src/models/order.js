import mongoose from "mongoose";
import Product from "./product";
import User from "./user";

const OrderSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'Users', required: true },
    orderItems: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Products', required: true },
            quantity: { type: Number, required: true, min: 1 }
        }
    ],
    shippingAddress: {
        fullName: { type: String, required: true },
        address: { type: String, required: true },
        city: { type: String, required: true },
        country: { type: String, required: true },
        postalCode: { type: String, required: true },
    },
    paymentMethod: { type: String, required: true, default: 'Stripe' },
    totalPrice: { type: Number, required: true },
    isPaid: { type: Boolean, required: true },
    paidAt: { type: Date, required: true },
    isProcessing: { type: Boolean, required: true },
    
}, { timestamps: true });

const Order = mongoose.models.Orders || mongoose.model("Orders", OrderSchema);

export default Order;
