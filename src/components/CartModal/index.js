'use client';

import { Fragment, useContext, useEffect } from "react";
import CommonModal from "../CommonModal";
import { GlobalContext } from "@/context";
import { getAllCartItems } from "@/services/cart";
import ComponentLevelLoader from "../Loader/componentlevel";
import { toast } from "react-toastify";
import { deleteCartItem } from "@/services/cart";
import { useRouter } from "next/navigation";

export default function CartModal() {

    const { 
        showCartModal, setShowCartModal, cartItems, setCartItems, user,
        componentLevelLoader, setComponentLevelLoader
    } = useContext(GlobalContext);

    const router = useRouter();

    async function extractAllCartItems() {
        const res = await getAllCartItems(user?._id);
        if (res && res.success) {
            const updatedData = res.data && res.data.length ? 
                res.data.map(item=> ({
                        ...item,
                        productId : {
                            ...item.productId,
                            price: item.productId.onSale === 'yes' ? parseFloat(
                        item.productId.price - item.productId.price * (item.productId.priceDrop / 100)
                        ).toFixed(2) : parseFloat(item.productId.price).toFixed(2)
                        }
                    }
                ))
            : [];
            setCartItems(updatedData);
            localStorage.setItem('cartItems', JSON.stringify(updatedData));
        }
        console.log(res);
    }

    useEffect(() => {
        if (showCartModal && user !== null) {
            extractAllCartItems();
        }
    }, [showCartModal, user]);

    async function handleDeleteCartItem(getCartItemId) {
        setComponentLevelLoader({ loading: true, id: getCartItemId });
        const res = await deleteCartItem(getCartItemId);
        if (res && res.success) {
            setComponentLevelLoader({ loading: false, id: '' });
            toast.success(res.message, {
                position: "top-right"
            });
            extractAllCartItems();
            // router.refresh();
        } else {
            toast.error(res.message, {
                position: "top-right"
            });
            setComponentLevelLoader({ loading: false, id: '' });
        }
        console.log("deleteCartItem: ",res);
    }


    return (
        <CommonModal
            showButtons={true}
            show={showCartModal}
            setShow={setShowCartModal}
            mainContent={
                cartItems && cartItems.length ?
                    <ul role="list" className="-my-6 divide-y divide-gray-200">
                        {
                            cartItems.map((cartItem) => (
                                <li key={cartItem._id} className="flex py-6">
                                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                                        <img
                                            src={cartItem && cartItem.productId && cartItem.productId.imageUrl}
                                            alt="Cart Item"
                                            className="h-full w-full object-cover object-center"
                                        />
                                    </div>
                                    <div className="ml-4 flex flex-1 flex-col">
                                        <div>
                                            <div className="flex justify-between text-base font-medium text-gray-900">
                                                <h3>
                                                    <a>
                                                        {cartItem && cartItem.productId && cartItem.productId.name}
                                                    </a>
                                                </h3>
                                            </div>
                                            <p className="mt-1 text-sm text-gray-600">
                                                ${cartItem && cartItem.productId && cartItem.productId.price}
                                            </p>
                                            <p className="mt-1 text-sm text-gray-500">
                                                Qty: {cartItem.quantity}
                                            </p>
                                        </div>
                                        <div className="flex flex-1 items-end justify-between text-sm">
                                            <button 
                                                type="button" 
                                                className="font-medium text-yellow-600 hover:text-yellow-500 sm:order-2 cursor-pointer"
                                                onClick={() => handleDeleteCartItem(cartItem._id)}
                                            >
                                                {
                                                    componentLevelLoader && componentLevelLoader.loading && componentLevelLoader.id === cartItem._id ? (
                                                        <ComponentLevelLoader 
                                                            text={"Removing"}
                                                            color={"#000000"}
                                                            loading={componentLevelLoader && componentLevelLoader.loading}
                                                        />
                                                    ) : (
                                                        "Remove"
                                                    )
                                                }
                                            </button>
                                        </div>
                                    </div>
                                </li>
                            ))
                        }
                    </ul>
                    : null
            }
            buttonComponent={
                <Fragment>
                    <button
                        type="button"
                        onClick={() => {
                            router.push('/cart')
                            setShowCartModal(false)
                        }}
                        className="mt-1.5 w-full inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide hover:bg-gray-800 cursor-pointer"
                    >
                        Go To Cart
                    </button>
                    <button
                        disabled={cartItems && cartItems.length === 0}
                        type="button"
                        onClick={()=>{router.push('/checkout'); setShowCartModal(false);}}
                        className="mt-1.5 w-full inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed mt-3 cursor-pointer"
                    >
                        Checkout
                    </button>
                    <div className="mt-6 flex justify-center text-center text-sm text-gray-600">
                        <button type="button" className="font-medium text-grey-600 hover:text-grey-500 cursor-pointer">
                            Continue Shopping
                            <span aria-hidden="true"> &rarr;</span>
                        </button>
                    </div>
                </Fragment>
            }
        />
    );
}