'use client';

import InputComponent from '@/components/FormElements/InputComponent';
import SelectComponent from '@/components/FormElements/SelectComponent';
import ComponentLevelLoader from '@/components/Loader/componentlevel';
import Notification from '@/components/Notification';
import { GlobalContext } from '@/context';
import { registerNewUser } from '@/services/register';
import { registrationFormControls } from '@/utils';
import { useRouter } from 'next/navigation';
import { useContext, useEffect, useState } from 'react';
import { toast } from 'react-toastify';

const initialFormData = {
    name: '',
    email: '',
    password: '',
    role: 'customer'
}

export default function Register() {
    const [formData, setFormData] = useState(initialFormData);
    const [isRegistered, setIsRegistered] = useState(false);
    const { pageLevelLoader, setPageLevelLoader , isAuthUser, setIsAuthUser } = useContext(GlobalContext);

    const router = useRouter()

    // console.log(formData);

    function isFormValid() {
        return formData && 
            formData.name && 
            formData.name.trim() !== '' && 
            formData.email && 
            formData.email.trim() !== '' && 
            formData.password && 
            formData.password.trim() !== '' 
            ? true 
            : false;
    }

    // console.log(isFormValid());

    async function handleRegisterOnSubmit() {
        // console.log('Register button clicked');
        // console.log(formData);
        setPageLevelLoader(true);
        const data = await registerNewUser(formData);

        if (data.success) {
            toast.success(data.message, {
                position: "top-right"
            });
            setIsRegistered(true);
            setPageLevelLoader(false);
            setFormData(initialFormData);
        } else {
            toast.error(data.message, {
                position: "top-right"
            });
            setPageLevelLoader(false);
            setFormData(initialFormData);
        }
        
        // console.log(data);
    }

    useEffect(() => {
        if (isAuthUser) {
            console.log('User is authenticated, redirecting to home page.');
            router.push('/');
        }
        else {
            console.log('User is not authenticated.');
            // setIsAuthUser(false);
            // setUser(null);
            // Cookies.remove('token');
            // localStorage.removeItem('user');
        }
    }, [isAuthUser, router]);

    return (
        <div className='bg-white relative'>
            <div className='flex flex-col items-center justify-between pt-0 pr-10 pb-0 pl-10 mt-8 -mr-auto xl:px-5 lg:flex-row'>
                <div className='flex flex-col justify-center items-center w-full pr-10 pl-10 lg:flex-row'>
                    <div className='w-full mt-10 mr-0 mb-0 ml-0 relative max-w-2xl lg:mt-0 lg:w-5/12'>
                        <div className='flex flex-col items-center justify-center pt-10 pr-10 pb-10 pl-10 bg-white shadow-2xl rounded-xl relattive z-10'>
                            <p className='w-full text-4xl font-medium text-center font-serif'>
                                {
                                    isRegistered ? 'Registration Successfull !' : 'Sign up for an account'
                                }
                            </p>
                            {
                                isRegistered ? (
                                    <button className='inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide cursor-pointer'
                                        onClick={() => router.push('/login')}
                                    >
                                        Login
                                    </button>
                                ) : (
                                    <div className='w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8'>
                                        {
                                            registrationFormControls.map((controlItem) => (
                                                controlItem.componentType === 'input' ? (
                                                    <InputComponent
                                                        type={controlItem.type}
                                                        placeholder={controlItem.placeholder}
                                                        label={controlItem.label}
                                                        key={controlItem.id}
                                                        onChange={(event) => {
                                                            setFormData({
                                                                ...formData,
                                                                [controlItem.id]: event.target.value
                                                            })
                                                        }}
                                                        value={formData[controlItem.id]}
                                                    />
                                                )
                                                    :
                                                    controlItem.componentType === 'select' ? (
                                                        <SelectComponent
                                                            options={controlItem.options}
                                                            label={controlItem.label}
                                                            key={controlItem.id}
                                                            onChange={(event) => {
                                                                setFormData({
                                                                    ...formData,
                                                                    [controlItem.id]: event.target.value
                                                                })
                                                            }}
                                                            value={formData[controlItem.id]}
                                                        />
                                                    ) : null
                                            ))
                                        }
                                        <button className='disabled:opacity-50 inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide cursor-pointer'
                                            disabled={!isFormValid()}
                                            onClick={handleRegisterOnSubmit}
                                            >
                                            {
                                                pageLevelLoader ? (
                                                <ComponentLevelLoader 
                                                    text={"Registering"} 
                                                    color={"#ffffff"} 
                                                    loading={pageLevelLoader} />
                                                ) : (
                                                'Register'
                                            )}
                                        </button>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                </div>
            </div>
            <Notification />
        </div>
    )
}
