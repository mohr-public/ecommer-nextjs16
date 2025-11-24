import Cookies from 'js-cookie';

export const BACKEND_BASE_URL = process.env.BACKEND_BASE_URL;

export const addNewProduct = async(formData) => {
    try {
        const getToken = Cookies.get('token');
        console.log("Token from cookies:", getToken);

        if (!getToken) {
            return { success: false, message: "User is not authenticated." };
        }

        const response = await fetch('/api/admin/add-product', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${Cookies.get('token')}`
            },
            body: JSON.stringify(formData)
        });

        const data = await response.json();

        return data;
        
    } catch (error) {
        console.error("Error in addNewProduct service:", error);
        throw error;
    }
};

export const getAllAdminProductsToken = async () => {
    try {
        const getToken = Cookies.get('token');
        console.log("Token from cookies:", getToken);
        if (!getToken) {
            return { success: false, message: "User is not authenticated." };
        }

        const res = await fetch('/api/admin/all-products', {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${getToken}`,
                'Content-Type': 'application/json'
            }
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error in getAllAdminProducts service:", error);
        throw error;
    }
};

export const getAllAdminProducts = async () => {
    try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/admin/all-products`, {
            method: 'GET',
            cache: 'no-store',
        });

        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error in getAllAdminProducts service:", error);
        throw error;
    }
};


export const updateProduct = async(formData) => {
    try {
        const getToken = Cookies.get('token');
        console.log("Token from cookies:", getToken);
        if (!getToken) {
            return { success: false, message: "User is not authenticated." };
        }
        const res = await fetch('/api/admin/update-product', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken}`
            },
            body: JSON.stringify(formData)
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error in updateProduct service:", error);
        throw error;
    }
};


export const deleteProduct = async(id) => {
    try {
        const getToken = Cookies.get('token');
        console.log("Token from cookies:", getToken);
        if (!getToken) {
            return { success: false, message: "User is not authenticated." };
        }
        const res = await fetch(`/api/admin/delete-product?id=${id}`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken}`
            }
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error in deleteProduct service:", error);
        throw error;
    }
};

export const productByCategory = async(id) => {
    try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/admin/product-by-category?id=${id}`, {
            method: 'GET',
            cache: 'no-store',
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error in productByCategory service:", error);
        throw error;
    }
};

export const productByIdAndToken = async(id) => {
    try {
        const getToken = Cookies.get('token');
        console.log("Token from cookies:", getToken);
        if (!getToken) {
            return { success: false, message: "User is not authenticated." };
        }
        const res = await fetch(`/api/admin/product-by-id?id=${id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken}`
            }
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error in productById service:", error);
        throw error;
    }
};

export const productById = async(id) => {
    try {
        const res = await fetch(`${BACKEND_BASE_URL}/api/admin/product-by-id?id=${id}`, {
            method: 'GET',
            cache: 'no-store',
        });
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error in productById service:", error);
        throw error;
    }
};