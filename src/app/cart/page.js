'use client';

import CommonCart from "@/components/CommonCart";
import { getAllCartItems } from "@/services/cart";
import { GlobalContext } from "@/context";
import { useEffect, useContext } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";
import { deleteCartItem } from "@/services/cart";


export default function Cart() {

    const { showCartModal, user, setCartItems, cartItems, pageLevelLoader, setPageLevelLoader, setComponentLevelLoader, componentLevelLoader } = useContext(GlobalContext);

    async function extractAllCartItems() {
        setPageLevelLoader(true);
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
            setPageLevelLoader(false);
            localStorage.setItem('cartItems', JSON.stringify(updatedData));
        }
        console.log(res);
    }

    useEffect(() => {
        if (user !== null) {
            extractAllCartItems();
        }
    }, [user]);

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
        console.log("deleteCartItem: ", res);
    }

    if (pageLevelLoader) {
        return (
            <div className="w-full min-h-screen flex justify-center items-center">
                <PulseLoader
                    color={'#000000'}
                    loading={pageLevelLoader}
                    size={30}
                    data-testid="loader"
                />
            </div>
        )
    }

    return <CommonCart componentLevelLoader={componentLevelLoader} handleDeleteCartItem={handleDeleteCartItem} cartItems={cartItems} />
}