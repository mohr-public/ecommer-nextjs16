




export const registerNewUser = async (formData) => {
    try {
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        });

        const finalData = await response.json();
        return finalData;
    } catch (error) {
        console.error('Error registering new user:', error);
        return { success: false, message: 'An error occurred while registering the user.' };
    }
}