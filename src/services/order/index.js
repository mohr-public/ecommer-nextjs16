import Cookies from 'js-cookie';

export const createNewOrder = async(formData)=>{
    try {
        const getToken = Cookies.get('token');
        console.log("Token from cookies:", getToken);
        if (!getToken) {
            return { success: false, message: "User is not authenticated." };
        }

        const response = await fetch('/api/order/create-order', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken}`
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error creating new order:", error);
        return {
            success: false,
            message: "Something went wrong! Please try again later."
        };
    }
}

export const getAllOrdersByUser = async(userId)=>{
    try {
        const getToken = Cookies.get('token');
        console.log("Token from cookies:", getToken);
        if (!getToken) {
            return { success: false, message: "User is not authenticated." };
        }
        const response = await fetch(`/api/order/get-all-orders?userId=${userId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching all orders:", error);
        return {
            success: false,
            message: "Something went wrong! Please try again later."
        };
    }
}

export const getOrderDetailsById = async(orderId)=>{
    try {
        const getToken = Cookies.get('token');
        console.log("Token from cookies:", getToken);
        if (!getToken) {
            return { success: false, message: "User is not authenticated." };
        }
        const response = await fetch(`/api/order/order-details?orderId=${orderId}`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching order details:", error);
        return {
            success: false,
            message: "Something went wrong! Please try again later."
        };
    }
}


export const getAllOrdersForAllUsers = async()=>{
    try {
        const getToken = Cookies.get('token');
        console.log("Token from cookies:", getToken);
        if (!getToken) {
            return { success: false, message: "User is not authenticated." };
        }
        const response = await fetch(`/api/admin/orders/get-all-orders`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken}`
            }
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching all orders:", error);
        return {
            success: false,
            message: "Something went wrong! Please try again later."
        };
    }
}


export const updateStatusOfOrder = async(formData) => {
    try {
        const getToken = Cookies.get('token');
        console.log("Token from cookies:", getToken);
        if (!getToken) {
            return { success: false, message: "User is not authenticated." };
        }
        const response = await fetch(`/api/admin/orders/update-order`, {
            method: 'PUT',
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken}`
            },
            body: JSON.stringify(formData)
        });
        const data = await response.json();
        return data;
    } catch (error) {
        console.error("Error fetching all orders:", error);
        return {
            success: false,
            message: "Something went wrong! Please try again later."
        };
    }
}