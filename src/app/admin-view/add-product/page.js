"use client"

import InputComponent from '@/components/FormElements/InputComponent'
import SelectComponent from '@/components/FormElements/SelectComponent'
import TileComponent from '@/components/FormElements/TileComponent'
import { AvailableSizes, adminAddNewProductFormControls, firebaseConfig, firebaseStorageURL } from '@/utils'
import React, { useEffect } from 'react'
import { initializeApp } from "firebase/app";
import { getStorage, uploadBytesResumable, ref, getDownloadURL } from "firebase/storage";
import { get, set } from 'mongoose'
import { useContext, useState } from 'react'
import { GlobalContext } from '@/context'
import { addNewProduct, updateProduct } from '@/services/product'
import { useRouter } from 'next/navigation'
import { toast } from 'react-toastify'
import ComponentLevelLoader from '@/components/Loader/componentlevel'
import Notification from '@/components/Notification'

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const storage = getStorage(app, firebaseStorageURL);

const createUniqueFileName = (getFile) => {
    const timestamp = Date.now();
    const randomStringValue = Math.random().toString(36).substring(2, 12);
    // const randomNum = Math.floor(Math.random() * 1000000);
    // const fileExtension = getFile.name.split('.').pop();
    // return `${timestamp}_${randomNum}.${fileExtension}`;

    return `${getFile.name}_${timestamp}_${randomStringValue}`;
}

async function helperForUploadingImageToFirebase(file) {
    const getFileName = createUniqueFileName(file);
    const storageReference = ref(storage, `ecommerce/${getFileName}`);
    const uploadImage = uploadBytesResumable(storageReference, file);

    return new Promise((resolve, reject) => {
        uploadImage.on('state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                // console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        // console.log('Upload is paused');
                        break;
                    case 'running':
                        // console.log('Upload is running');
                        break;
                }
            },
            (error) => {
                console.error('Error uploading file:', error);
                reject(error);
            },
            () => {
                getDownloadURL(uploadImage.snapshot.ref)
                    .then((downloadURL) => {
                        console.log('File available at', downloadURL);
                        resolve(downloadURL);
                    })
                    .catch((error) => {
                        console.error('Error getting download URL:', error);
                        reject(error);
                    });
            }
        );
    });
}

const initialFormData = {
    name: '',
    price: 0,
    description: '',
    category: 'men',
    sizes: [],
    deliveryInfo: '',
    onSale: 'no',
    imageUrl: '',
    priceDrop: 0,
}

export default function AdminAddNewProduct() {

    const [formData, setFormData] = React.useState(initialFormData);
    const { componentLevelLoader, setComponentLevelLoader, currentUpdatedProduct, setCurrentUpdatedProduct } = useContext(GlobalContext);

    // console.log(currentUpdatedProduct);

    const router = useRouter();

    useEffect(() => {
        if (currentUpdatedProduct !== null) {
            setFormData(currentUpdatedProduct);
        } else {
            setFormData(initialFormData);
        }
    }, [currentUpdatedProduct]);


    async function handleImage(event) {
        // console.log(event.target.files[0]);
        const extractImageUrl = await helperForUploadingImageToFirebase(
            event.target.files[0]
        );

        // console.log(extractImageUrl);
        if (extractImageUrl !== '') {
            setFormData({
                ...formData,
                imageUrl: extractImageUrl
            });
        }
    }

    function handleTileClick(getCurrentItem) {
        // console.log(getCurrentItem);

        let cpySizes = [...formData.sizes];
        const index = cpySizes.findIndex(item => item.id === getCurrentItem.id);
        if (index === -1) {
            cpySizes.push(getCurrentItem);
        } else {
            cpySizes = cpySizes.filter(item => item.id !== getCurrentItem.id);
        }

        setFormData({
            ...formData,
            sizes: cpySizes
        });

    }

    async function handleAddProduct() {
        // console.log('Add product button clicked');
        // console.log(formData);
        setComponentLevelLoader({ loading: true, id: '' });
        const res = currentUpdatedProduct !== null ? await updateProduct(formData) : await addNewProduct(formData);

        // console.log(res);
        if (res && res.success) {
            setComponentLevelLoader({ loading: false, id: '' });
            toast.success(res.message, {
                position: "top-right"
            });
            setFormData(initialFormData);
            setCurrentUpdatedProduct(null);
            setTimeout(() => {
                router.push('/admin-view/all-products');
            }, 1000);
            // router.push('/admin-view/products');
        } else {
            toast.error(res.message, {
                position: "top-right"
            });
            setComponentLevelLoader({ loading: false, id: '' });
            setFormData(initialFormData);
        }
    }

    // console.log(formData);

    return (
        <div className='w-full mt-5 mr-0 mb-0 ml-0 relative'>
            <div className='flex flex-col items-start justify-start p-10 bg-white shadow-2xl rounded-xl relative'>
                <div className='w-full mt-6 mr-0 mb-0 ml-0 space-y-8'>
                    <input
                        accept="image/*"
                        max="1000000"
                        type="file"
                        onChange={handleImage}
                    />
                    <div className='flex gap-2 flex-col'>
                        <label>Available sizes</label>
                        <TileComponent selected={formData.sizes} onClick={handleTileClick} data={AvailableSizes} />
                    </div>
                    {
                        adminAddNewProductFormControls.map((controlItem) => (
                            controlItem.componentType === 'input' ? (
                                <InputComponent
                                    type={controlItem.type}
                                    placeholder={controlItem.placeholder}
                                    label={controlItem.label}
                                    key={controlItem.id}
                                    value={formData[controlItem.id]}
                                    onChange={(event) => {
                                        setFormData({
                                            ...formData,
                                            [controlItem.id]: event.target.value
                                        });
                                    }}
                                />
                            ) : controlItem.componentType === 'select' ? (
                                <SelectComponent
                                    label={controlItem.label}
                                    options={controlItem.options}
                                    key={controlItem.id}
                                    value={formData[controlItem.id]}
                                    onChange={(event) => {
                                        setFormData({
                                            ...formData,
                                            [controlItem.id]: event.target.value
                                        });
                                    }}
                                />
                            ) : null
                        ))
                    }
                    <button onClick={handleAddProduct}
                        className='inline-flex w-full items-center justify-center bg-black px-6 py-4 text-lg text-white font-medium uppercase tracking-wide cursor-pointer'
                    >
                        {
                            componentLevelLoader && componentLevelLoader.loading ? (
                                <ComponentLevelLoader
                                    text={currentUpdatedProduct !== null ? 'Updating Product' : 'Adding Product'}
                                    color={"#ffffff"}
                                    loading={componentLevelLoader && componentLevelLoader.loading}
                                />
                            ) : currentUpdatedProduct !== null ? ('Update Product') :
                            ('Add Product')
                        }
                    </button>
                </div>
            </div>
            <Notification />
        </div>
    )
}
