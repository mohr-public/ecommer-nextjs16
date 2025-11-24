import Cookies from 'js-cookie';


export const callStripeSession = async (formData) => {
    try {
        const getToken = Cookies.get('token');
        console.log("Token from cookies:", getToken);
        if (!getToken) {
            return { success: false, message: "User is not authenticated." };
        }

        const res = await fetch('/api/stripe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${getToken}`,
            },
            body: JSON.stringify(formData),
        });
        
        const data = await res.json();
        return data;
    } catch (error) {
        console.error("Error in callStripeSession:", error);
        throw error;
    }
};
