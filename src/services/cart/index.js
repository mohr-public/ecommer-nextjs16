
import Cookies from 'js-cookie';


export const addToCart = async (formData) => {
    try {
        const getToken = Cookies.get('token');
        console.log("Token from cookies:", getToken);
        if (!getToken) {
            return { success: false, message: "User is not authenticated." };
        }
        
        const response = await fetch('/api/cart/add-to-cart', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken}`,
            },
            body: JSON.stringify(formData),
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error in addToCart service:", error);
        return { success: false, message: "Something went wrong! Please try again later." };
    }
}

export const getAllCartItems = async (userId) => {
    try {
        const getToken = Cookies.get('token');
        console.log("Token from cookies:", getToken);
        if (!getToken) {
            return { success: false, message: "User is not authenticated." };
        }
        const response = await fetch(`/api/cart/all-cart-items?userId=${userId}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken}`,
            },
            cache: 'no-store',
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error in getAllCartItems service:", error);
        return { success: false, message: "Something went wrong! Please try again later." };
    }
}

export const deleteCartItem = async (id) => {
    try {
        const getToken = Cookies.get('token');
        console.log("Token from cookies:", getToken);
        if (!getToken) {
            return { success: false, message: "User is not authenticated." };
        }
        const response = await fetch(`/api/cart/delete-from-cart?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken}`,
            },
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error in deleteCartItem service:", error);
        return { success: false, message: "Something went wrong! Please try again later." };
    }
};
