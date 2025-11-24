'use client';

import InputComponent from "@/components/FormElements/InputComponent";
import ComponentLevelLoader from "@/components/Loader/componentlevel";
import Notification from "@/components/Notification";
import { GlobalContext } from "@/context";
import { addNewAddress, deleteAddress, fetchAllAddresses, updateAddress } from "@/services/address";
import { addNewAddressFormControls } from "@/utils";
import { useContext, useEffect } from "react";
import { useState } from "react";
import { PulseLoader } from "react-spinners";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";

export default function Account() {

    const { user,
        addresses, setAddresses,
        addressFormData, setAddressFormData,
        componentLevelLoader, setComponentLevelLoader,
        pageLevelLoader, setPageLevelLoader
    } = useContext(GlobalContext);

    const [showAddressForm, setShowAddressForm] = useState(false);
    const [currentEditedAddressId, setCurrentEditedAddressId] = useState(null);

    const router = useRouter();

    async function extracAllAddresses() {
        setPageLevelLoader(true);
        const res = await fetchAllAddresses(user._id);
        console.log('extracAllAddresses -> res', res);
        if (res && res.success) {
            setPageLevelLoader(false);
            setAddresses(res.data);
        }
    }

    async function handleAddOrUpdateAddress() {
        setComponentLevelLoader({ loading: true, id: '' });
        const res = currentEditedAddressId !== null ?
            await updateAddress({ ...addressFormData, _id: currentEditedAddressId }) :
            await addNewAddress({
                ...addressFormData,
                userId: user._id
            });

        console.log('handleAddOrUpdateAddress -> res', res);

        if (res && res.success) {
            setComponentLevelLoader({ loading: false, id: '' });
            toast.success(res.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
            });
            setAddressFormData({
                fullName: '',
                city: '',
                country: '',
                postalCode: '',
                address: ''
            });
            extracAllAddresses();
            setCurrentEditedAddressId(null);
            setShowAddressForm(false);
        } else {
            setComponentLevelLoader({ loading: false, id: '' });
            toast.error(res.message || 'Failed to add address', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
            });
            setAddressFormData({
                fullName: '',
                city: '',
                country: '',
                postalCode: '',
                address: ''
            });
            setCurrentEditedAddressId(null);
            setShowAddressForm(false);
        }
    }

    function handleUpdateAddress(getCurrentAddress) {
        setShowAddressForm(true);
        setAddressFormData({
            fullName: getCurrentAddress.fullName,
            city: getCurrentAddress.city,
            country: getCurrentAddress.country,
            postalCode: getCurrentAddress.postalCode,
            address: getCurrentAddress.address
        });
        setCurrentEditedAddressId(getCurrentAddress._id);
    }

    async function handleDeleteAddress(getCurrentAddressId) {
        setComponentLevelLoader({ loading: true, id: getCurrentAddressId });
        const res = await deleteAddress(getCurrentAddressId);
        if (res && res.success) {
            setComponentLevelLoader({ loading: false, id: '' });
            toast.success(res.message, {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
            });
            extracAllAddresses();
        } else {
            setComponentLevelLoader({ loading: false, id: '' });
            toast.error(res.message || 'Failed to delete address', {
                position: "top-right",
                autoClose: 5000,
                hideProgressBar: false,
            });
        }
    }

    useEffect(() => {
        if (user && user._id) {
            extracAllAddresses();
        }
    }, [user]);

    return (
        <section>
            <div className="mx-auto bg-gray-100 px-4 sm:px-6 lg:px-8">
                <div className="bg-white shadow">
                    <div className="p-6 sm:p-12">
                        <div className="flex flex-col space-y-4 md:space-y-0 md:space-x-6 md:flex-row">

                        </div>
                        <div className="flex flex-col flex-1">
                            <h4 className="text-lg font-semibold text-center md:text-left">
                                {
                                    user?.name
                                }
                            </h4>
                            <p>
                                {
                                    user?.email
                                }
                            </p>
                            <p>
                                {
                                    user?.role
                                }
                            </p>
                        </div>
                        <button onClick={() => router.push('/orders')}
                            className="mt-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide hover:bg-gray-800 cursor-pointer"
                        >
                            View your Orders
                        </button>
                        <div className="mt-6">
                            <h1 className="font-bold text-lg">Your Address:</h1>
                            {
                                pageLevelLoader ? (
                                    <PulseLoader
                                        color={'#000000'}
                                        loading={pageLevelLoader}
                                        size={15}
                                        data-testid="loader"
                                    />
                                ) : (
                                    <div className="mt-4 flex flex-col gap-4">
                                        {
                                            addresses && addresses.length ? (
                                                addresses.map((item, index) => (
                                                    <div key={item._id} className="border p-6">
                                                        <p>Name : {item.fullName}</p>
                                                        <p>Address : {item.address}</p>
                                                        <p>City : {item.city}</p>
                                                        <p>Country : {item.country}</p>
                                                        <p>Postal Code : {item.postalCode}</p>
                                                        <p>Location : {item.city}, {item.country} {item.postalCode}</p>
                                                        <button onClick={() => handleUpdateAddress(item)}
                                                            className="mt-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide hover:bg-gray-800 cursor-pointer"
                                                        >
                                                            Update
                                                        </button>
                                                        <button onClick={() => { handleDeleteAddress(item._id) }}
                                                            className="mt-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide hover:bg-gray-800 cursor-pointer"
                                                        >
                                                            {
                                                                componentLevelLoader && componentLevelLoader.loading && componentLevelLoader.id === item._id ?
                                                                    <ComponentLevelLoader
                                                                        text={'Deleting'}
                                                                        color={"#ffffff"}
                                                                        loading={componentLevelLoader && componentLevelLoader.loading}
                                                                    /> : 'Delete'
                                                            }
                                                        </button>
                                                    </div>
                                                ))
                                            ) : (
                                                <p>No addresses found ! Please add a new address below.</p>
                                            )
                                        }
                                    </div>
                                )
                            }
                        </div>
                        <div className="mt-4">
                            <button
                                onClick={() => setShowAddressForm(!showAddressForm)}
                                className="mt-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide hover:bg-gray-800 cursor-pointer"
                            >
                                {
                                    showAddressForm ? 'Hide Address Form' : 'Add New Address'
                                }
                            </button>
                        </div>
                        {
                            showAddressForm ? (
                                <div className="flex flex-col mt-5 justify-center pt-4 items-center">
                                    <div className="w-full mt-6 mr-0 mb-0 ml-0 space-y-8">
                                        {
                                            addNewAddressFormControls.map((controlItem) => (
                                                <InputComponent
                                                    key={controlItem.id}
                                                    {...controlItem}
                                                    value={addressFormData[controlItem.id]}
                                                    onChange={(event) => setAddressFormData({
                                                        ...addressFormData,
                                                        [controlItem.id]: event.target.value
                                                    })}
                                                />
                                            ))
                                        }
                                    </div>
                                    <button
                                        onClick={handleAddOrUpdateAddress}
                                        className="mt-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide hover:bg-gray-800 cursor-pointer"
                                    >
                                        {
                                            componentLevelLoader && componentLevelLoader.loading ?
                                                <ComponentLevelLoader
                                                    text={'Saving'}
                                                    color={"#ffffff"}
                                                    loading={componentLevelLoader && componentLevelLoader.loading}
                                                /> : 'Save'
                                        }
                                    </button>
                                </div>
                            ) : null
                        }
                    </div>
                </div>
            </div>
            <Notification />
        </section>
    )
}