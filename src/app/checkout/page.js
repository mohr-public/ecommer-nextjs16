'use client';

import { GlobalContext } from '@/context';
import { fetchAllAddresses } from '@/services/address';
import { loadStripe } from '@stripe/stripe-js';
import { useRouter, useSearchParams } from 'next/navigation';
import { use, useContext, useEffect, useState } from 'react';
import { callStripeSession } from '@/services/stripe';
import { PulseLoader } from 'react-spinners';
import { set } from 'mongoose';
import { createNewOrder } from '@/services/order';
import { toast } from 'react-toastify';
import Notification from '@/components/Notification';

export default function CheckoutPage() {

    const { cartItems, setCartItems,
        user,
        addresses, setAddresses,
        checkoutFormData, setCheckoutFormData
    } = useContext(GlobalContext);

    const [selectedAddress, setSelectedAddress] = useState(null);
    const [isOrderProcessing, setIsOrderProcessing] = useState(false);
    const [orderSuccess, setOrderSuccess] = useState(false);

    const router = useRouter();
    const searchParams = useSearchParams();

    const publishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;

    if (!publishableKey) {
        console.error("Stripe publishable key is not set.");
    }

    const stripePromise = loadStripe(publishableKey);

    console.log('Cart Items:', cartItems);

    async function getAllAddresses() {
        const res = await fetchAllAddresses(user?._id);
        if (res && res.success) {
            setAddresses(res.data);
        }
    }

    useEffect(() => {
        if (user !== null) {
            getAllAddresses();
        }
    }, [user]);

    useEffect(() => {
        async function createFinalOrder() {
            const isStripe = JSON.parse(localStorage.getItem('stripe'));
            if (isStripe && searchParams.get('status') === 'success' && cartItems && cartItems.length > 0) {
                setIsOrderProcessing(true);
                const getCheckoutFormData = JSON.parse(localStorage.getItem('checkoutFormData'));

                const createFinalCheckoutFormData = {
                    userId: user._id,
                    shippingAddress: getCheckoutFormData.shippingAddress,
                    orderItems: cartItems.map(item => ({
                        productId: item.productId._id,
                        quantity: item.quantity
                    })),
                    paymentMethod: 'Stripe',
                    totalPrice: cartItems.reduce((total, item) => {
                        return total + (item.productId ? item.productId.price : 0);
                    }, 0).toFixed(2),
                    isPaid: true,
                    isProcessing: true,
                    paidAt: new Date(),
                };

                const res = await createNewOrder(createFinalCheckoutFormData);
                console.log("createNewOrder response:", res);

                if (res && res.success) {
                    setIsOrderProcessing(false);
                    setOrderSuccess(true);
                    toast.success(res.message, {
                        position: "top-right"
                    });
                    localStorage.removeItem('stripe');
                    localStorage.removeItem('checkoutFormData');

                    setCartItems([]);
                    localStorage.setItem('cartItems', JSON.stringify([]));

                    // router.push('/order-success');
                } else {
                    setIsOrderProcessing(false);
                    setOrderSuccess(false);
                    toast.error(res.message, {
                        position: "top-right"
                    });
                }
            }
        }

        createFinalOrder();
    }, [searchParams.get('status'), cartItems]);

    function handleSelectedAddress(getAddress) {
        if (getAddress._id === selectedAddress) {
            setSelectedAddress(null);
            setCheckoutFormData({
                ...checkoutFormData,
                shippingAddress: {}
            });
            return;
        }

        setSelectedAddress(getAddress._id);
        setCheckoutFormData({
            ...checkoutFormData,
            shippingAddress: {
                ...checkoutFormData.shippingAddress,
                fullName: getAddress.fullName,
                city: getAddress.city,
                country: getAddress.country,
                postalCode: getAddress.postalCode,
                address: getAddress.address,
            }
        });
    }

    async function handleCheckout() {
        const stripe = await stripePromise;

        const createLineItems = cartItems.map(item => ({
            price_data: {
                currency: 'usd',
                product_data: {
                    images: [item.productId.imageUrl],
                    name: item.productId.name,
                },
                unit_amount: Math.round(item.productId.price * 100),
            },
            quantity: item.quantity
        }));

        const res = await callStripeSession(createLineItems);
        setIsOrderProcessing(true);
        localStorage.setItem('stripe', true);
        localStorage.setItem('checkoutFormData', JSON.stringify(checkoutFormData));

        const { error } = await stripe.redirectToCheckout({
            sessionId: res.id
        });        

        console.error("Stripe redirect error:", error);

        // const { error } = await stripe.redirectToCheckout({
        //     lineItems: cartItems.map(item => ({
        //         price: item.productId.priceId,
        //         quantity: item.quantity
        //     })),
        //     mode: 'payment',
        //     successUrl: `${window.location.origin}/success`,
        //     cancelUrl: `${window.location.origin}/cancel`
        // });
        // if (error) {
        //     console.error("Error redirecting to checkout:", error);
        // }

    }

    // console.log('Addresses:', addresses);
    // console.log('Checkout Form Data:', checkoutFormData);

    useEffect(() => {
        if (orderSuccess) {
            const timeoutId = setTimeout(() => {
                // setOrderSuccess(false);
                router.push('/orders');
            }, 2000);
            return () => clearTimeout(timeoutId);
        }
    }, [orderSuccess, router]);

    if (orderSuccess) {
        return (
            <section className="h-screen bg-gray-200">
                <div className="mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="mx-auto mt-8 max-w-screen-xl px-4 sm:px-6 lg:px-8">
                        <div className="bg-white shadow">
                            <div className="px-4 py-6 sm:px-8 sm:py-10 flex flex-col gap-5">
                                <h1 className="font-bold text-lg">
                                    Your payment is successfull and you will be redirected to orders page in 2 seconds
                                </h1>
                            </div>
                        </div>
                    </div>
                </div>
            </section>
        )
    }

    if (isOrderProcessing) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <PulseLoader
                    color={'#000000'}
                    loading={isOrderProcessing}
                    size={30}
                    data-testid="loader"
                />
            </div>
        );
    }

    return (
        <div>
            <div className="mt-8 grid sm:mt-0 sm:px-10 md:mt-8 lg:grid-cols-2 lg:px-20 lg:mt-0 xl:px-32">
                <div className="px-4 pt-8">
                    <p className="text-xl font-medium">Cart Summary</p>
                    <div className="mt-8 space-y-3 rounded-lg border bg-white px-2 py-4 sm:px-5">
                        {
                            cartItems && cartItems.length ?
                                cartItems.map((item) => (
                                    <div key={item._id} className="flex flex-col rounded-lg bg-white sm:flex-row">
                                        <img className="m-2 h-24 w-28 rounded-md border object-cover object-center" src={item && item.productId && item.productId.imageUrl} alt="Cart Item" />
                                        <div className="flex w-full flex-col px-4 py-4">
                                            <span className="font-bold">{item && item.productId && item.productId.name}</span>
                                            <span className="font-semibold">{item && item.productId && item.productId.price}</span>
                                        </div>

                                    </div>
                                )) : (
                                    <div className="p-4 text-center text-gray-500">
                                        Your cart is empty.
                                    </div>
                                )
                        }
                    </div>
                </div>
                <div className="mt-10 bg-gray-50 px-4 pt-8 lg:mt-0">
                    <p className="text-xl font-medium">Shipping address details</p>
                    <p className="text-gray-400 font-bold">Complete your order by selecting address below</p>
                    <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-6">
                        {
                            addresses && addresses.length ?
                                addresses.map((item) => (
                                    <div key={item._id} 
                                        onClick={() => handleSelectedAddress(item)}
                                        className={`border p-6 ${selectedAddress === item._id ? 'border-red-900 bg-gray-100' : 'border-gray-200'} rounded-lg cursor-pointer hover:border-black`}>
                                        <p>Name : {item.fullName}</p>
                                        <p>Address : {item.address}</p>
                                        <p>City : {item.city}</p>
                                        <p>Country : {item.country}</p>
                                        <p>Postal Code : {item.postalCode}</p>
                                        <p>Location : {item.city}, {item.country} {item.postalCode}</p>
                                        <button
                                            className="mt-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide hover:bg-gray-800 cursor-pointer"
                                        >
                                            {item._id === selectedAddress ? 'Selected Address' : 'Select Address'}
                                        </button>
                                    </div>
                                )) : (
                                    <div className="p-4 text-center text-gray-500">
                                        No addresses added.
                                    </div>
                                )
                        }
                    </div>
                    <button onClick={() => router.push('/account')}
                        className="mt-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide hover:bg-gray-800 cursor-pointer"
                    >
                        Add new Address
                    </button>
                    <div className="mt-6 border-t border-b py-2">
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">Subtotal</p>
                            <p className="text-lg font-bold text-gray-900">
                                ${
                                    cartItems && cartItems.length ?
                                        cartItems.reduce((total, item) => parseFloat(item.productId.price) + total, 0).toFixed(2)
                                        : '0.00'
                                }
                            </p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">Shipping</p>
                            <p className="text-lg font-bold text-gray-900">Free</p>
                        </div>
                        <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">Total</p>
                            <p className="text-lg font-bold text-gray-900">
                                ${
                                    cartItems && cartItems.length ?
                                        cartItems.reduce((total, item) => {
                                            return (item.productId ? parseFloat(item.productId.price) : 0) + total;
                                        }, 0).toFixed(2)
                                        : '0.00'
                                }
                            </p>
                        </div>
                        <div className="pb-10">
                            <button disabled={(cartItems && cartItems.length === 0) || Object.keys(checkoutFormData.shippingAddress).length === 0}
                            onClick={handleCheckout}
                                className="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none mt-5 mr-5 w-full inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide hover:bg-gray-800 cursor-pointer"
                            >
                                Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Notification />
        </div>
    )

}