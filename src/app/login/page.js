'use client';

import React, { useContext, useState, useEffect } from 'react'
import InputComponent from '@/components/FormElements/InputComponent';
import { loginFormControls } from '@/utils';
import { GlobalContext } from '@/context';
import { useRouter } from 'next/navigation';
import { login } from '@/services/login';
import Cookies from 'js-cookie';
import { set } from 'mongoose';
import ComponentLevelLoader from '@/components/Loader/componentlevel';
import Notification from '@/components/Notification';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const initialFormData = {
  email: '',
  password: ''
}

export default function Login() {

  const [formData, setFormData] = useState(initialFormData);
  const { isAuthUser, setIsAuthUser, user, setUser, componentLevelLoader, setComponentLevelLoader } = useContext(GlobalContext);

  const router = useRouter();

  // console.log(formData);

  function isValidForm() {
    return formData && formData.email && formData.email.trim() !== ''
        && formData.password && formData.password.trim() !== '' ? true : false;
  }

  async function handleLogin() {
    // console.log('Login button clicked');
    setComponentLevelLoader({loading: true, id: ''});
    const res = await login(formData);
    // console.log(res);

    if (res && res.success) {
      toast.success(res.message, {
        position: "top-right"
      });
      setIsAuthUser(true);
      setUser(res.finalData.user);
      setFormData(initialFormData);
      Cookies.set('token', res.finalData.token);
      localStorage.setItem('user', JSON.stringify(res.finalData.user));
      setComponentLevelLoader({loading: false, id: ''});
      // router.push('/');
    } else {
      toast.error(res.message, {
        position: "top-right"
      });
      setIsAuthUser(false);
      setUser(null);
      setComponentLevelLoader({loading: false, id: ''});
    }

  }

  // console.log(isAuthUser, user);

  useEffect(() => {
    if (isAuthUser) {
      console.log('User is authenticated, redirecting to home page.');
      router.push('/');
    }
    else {
      console.log('User is not authenticated.');
      setIsAuthUser(false);
      setUser(null);
      Cookies.remove('token');
      localStorage.removeItem('user');
    }
  }, [isAuthUser, router, setIsAuthUser, setUser]);

  return (
    <div className='bg-white relative'>
      <div className='flex flex-col items-center justify-between pt-0 pr-10 pb-0 pl-10 mt-8 -mr-auto xl:px-5 lg:flex-row'>
          <div className='flex flex-col justify-center items-center w-full pr-10 pl-10 lg:flex-row'>
              <div className='w-full mt-10 mr-0 mb-0 ml-0 relative max-w-2xl lg:mt-0 lg:w-5/12'>
                  <div className='flex flex-col items-center justify-center pt-10 pr-10 pb-10 pl-10 bg-white shadow-2xl rounded-xl relattive z-10'>
                      <p className='w-full text-4xl font-medium text-center font-serif'>
                          Login
                      </p>
                      <div className='w-full mt-6 mr-0 mb-0 ml-0 relative space-y-8'>
                          {
                              loginFormControls.map((controlItem) => (
                                  controlItem.componentType === 'input' ? (
                                      <InputComponent
                                      type={controlItem.type}
                                      placeholder={controlItem.placeholder}
                                      label={controlItem.label}
                                      value={formData[controlItem.id]}
                                      onChange={(event) => setFormData({...formData, [controlItem.id]: event.target.value})}
                                      key={controlItem.id}
                                      />
                                  ) : null
                              ))
                          }
                          <button className='disabled:opacity-50 inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide cursor-pointer'
                          disabled={!isValidForm()}
                          onClick={handleLogin}
                          >
                            {
                              componentLevelLoader && componentLevelLoader.loading ? (
                              <ComponentLevelLoader
                                text={"Logging In"}
                                color={"#ffffff"}
                                loading={componentLevelLoader && componentLevelLoader.loading}
                              />
                            ) : (
                              'Login'
                            )}
                          </button>
                          <div className='flex flex-col gap-2'>
                            <p>New to website?</p>
                            <button className='inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white transition-all duration-200 ease-in-out focus:shadow font-medium uppercase tracking-wide cursor-pointer'
                            onClick={() => router.push('/register')}>
                              Register
                            </button>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
      </div>
      <Notification />
  </div>
  );
}
