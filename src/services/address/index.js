import Cookies from "js-cookie";

export const addNewAddress = async (formData) => {
    try {
        const getToken = Cookies.get('token');
        console.log("Token from cookies:", getToken);
        if (!getToken) {
            return { success: false, message: "User is not authenticated." };
        }
        
        const res = await fetch("/api/address/add-new-address", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken}`,
            },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        return data;
    } catch(error) {
        console.error("Error in addNewAddress service:", error);
        return { success: false, message: "Something went wrong! Please try again later." };
    }
}

export const fetchAllAddresses = async (id) => {
    try {
        const getToken = Cookies.get('token');
        console.log("Token from cookies:", getToken);
        if (!getToken) {
            return { success: false, message: "User is not authenticated." };
        }

        const res = await fetch(`/api/address/get-all-address?id=${id}`, {
            method: "GET",
            headers: {
                Authorization: `Bearer ${getToken}`,
            },
        });

        const data = await res.json();

        return data;
    } catch(error) {
        console.error("Error in addNewAddress service:", error);
        return { success: false, message: "Something went wrong! Please try again later." };
    }
}

export const updateAddress = async (formData) => {
    try {
        const getToken = Cookies.get('token');
        console.log("Token from cookies:", getToken);
        if (!getToken) {
            return { success: false, message: "User is not authenticated." };
        }

        const res = await fetch("/api/address/update-address", {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${getToken}`,
            },
            body: JSON.stringify(formData),
        });

        const data = await res.json();

        return data;
    } catch(error) {
        console.error("Error in addNewAddress service:", error);
        return { success: false, message: "Something went wrong! Please try again later." };
    }
}

export const deleteAddress = async (id) => {
    try {
        const getToken = Cookies.get('token');
        console.log("Token from cookies:", getToken);
        if (!getToken) {
            return { success: false, message: "User is not authenticated." };
        }

        const res = await fetch(`/api/address/delete-address?id=${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${getToken}`,
            },
        });

        const data = await res.json();

        return data;
    } catch(error) {
        console.error("Error in addNewAddress service:", error);
        return { success: false, message: "Something went wrong! Please try again later." };
    }
}