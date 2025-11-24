'use client'


import { useContext, useEffect } from 'react';
import { GlobalContext } from '@/context';
import { getAllOrdersForAllUsers, updateStatusOfOrder } from '@/services/order';
import { PulseLoader } from 'react-spinners';
import ComponentLevelLoader from '@/components/Loader/componentlevel';

export default function AdminView() {

  const {allOrdersForAllUsers, setAllOrdersForAllUsers, user,
    pageLevelLoader, setPageLevelLoader,
    componentLevelLoader, setComponentLevelLoader,
  } = useContext(GlobalContext);

  async function extractAllOrdersForAllUsers(){
    setPageLevelLoader(true);
    const res = await getAllOrdersForAllUsers();

    console.log("All orders for all users:", res);

    if (res?.success) {
      setPageLevelLoader(false);
      setAllOrdersForAllUsers(res.data && res.data.length ? res.data.filter(item => item.userId._id !== user._id) : []);
    } else {
      setPageLevelLoader(false);
      setAllOrdersForAllUsers([]);
    }
  }

  useEffect(() => {
    if (user !== null) {
      extractAllOrdersForAllUsers();
    }
  }, [user]);

  console.log("All orders: ", allOrdersForAllUsers);

  async function handleUpdateOrderStatus(getItem) {
    setComponentLevelLoader({ loading: true, id: getItem._id });
    const res = await updateStatusOfOrder({
      ...getItem,
      isProcessing: false
    });

    if (res.success) {
      setComponentLevelLoader({ loading: false, id: '' });
      extractAllOrdersForAllUsers();
    } else {
      setComponentLevelLoader({ loading: true, id: '' });
    }
  }

  if (pageLevelLoader) {
    return (
      <div className="w-full min-h-screen flex justify-center items-center">
        <PulseLoader
          color={'#000000'}
          loading={pageLevelLoader}
          size={30}
          data-testid="loader"
        />
      </div>
    )
  }

  return (
    <section>
      <div className="mx-auto px-4 sm:px-6 lg:px-8">
        <div>
            <div className="px-4 py-6 sm:px-8 sm:py-10">
              <div className="flow-root">
                {
                  allOrdersForAllUsers && allOrdersForAllUsers.length ?
                    <ul>
                      {
                        allOrdersForAllUsers.map(item =>
                          <li key={item._id} className="bg-gray-200 shadow p-5 flex flex-col space-y-3 py-6 text-left mb-4">
                            <div className="flex">
                              <h1 className="font-bold text-lg mb-3 flex-1">#order: {item._id}</h1>
                              <div className="flex flex-col gap-2">
                                <div className="flex items-center">
                                  <p className="mr-3 text-sm font-medium text-gray-900">User Name :</p>
                                  <p className="text-sm font-semibold text-gray-900">{item.userId.name}</p>
                                </div>
                                <div className="flex items-center">
                                  <p className="mr-3 text-sm font-medium text-gray-900">User Email :</p>
                                  <p className="text-sm font-semibold text-gray-900">{item.userId.email}</p>
                                </div>
                                <div className="flex items-center">
                                  <p className="mr-3 text-sm font-medium text-gray-900">Total paid amount :</p>
                                  <p className="text-sm font-semibold text-gray-900">${item.totalPrice}</p>
                                </div>
                              </div>                              
                            </div>
                            <div className="flex gap-2">
                              {
                                item.orderItems.map((orderItem, index) =>
                                  <div key={index} className="shrink-0">
                                    <img className="h-24 w-24 max-w-full rounded-lg object-cover"
                                      alt={orderItem && orderItem.productId && orderItem.productId.name}
                                      src={orderItem && orderItem.productId && orderItem.productId.imageUrl}
                                    />
                                  </div>
                                )
                              }
                            </div>
                            <div className="flex gap-5">
                              <button
                                className="mt-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide hover:bg-gray-800 cursor-pointer"
                              >
                                {
                                  item.isProcessing ? 'Order is Processing' : 'Order is delivered'
                                }
                              </button>
                              <button 
                                onClick={() => handleUpdateOrderStatus(item)}
                                disabled={!item.isProcessing}
                                className="disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none mt-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide hover:bg-gray-800 cursor-pointer"
                              >
                                {
                                  componentLevelLoader && componentLevelLoader.loading && componentLevelLoader.id === item._id ?
                                  <ComponentLevelLoader
                                    text={'Updating Order Status'}
                                    color={"#ffffff"}
                                    loading={componentLevelLoader && componentLevelLoader.loading}
                                  />
                                  :
                                  'Update Order Status'
                                  }
                              </button>
                            </div>
                          </li>
                        )
                      }
                    </ul>
                    : null
                }
              </div>
            </div>
          </div>
      </div>
    </section>
  )
}
