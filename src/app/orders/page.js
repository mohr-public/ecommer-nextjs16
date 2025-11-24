'use client';

import { useEffect } from "react";
import { useContext } from "react";
import { GlobalContext } from "../../context";
import { getAllOrdersByUser } from "@/services/order";
import { toast } from "react-toastify";
import { PulseLoader } from "react-spinners";
import Notification from "@/components/Notification";
import { useRouter } from "next/navigation";

export default function OrdersPage() {

  const { user,
    pageLevelLoader, setPageLevelLoader,
    allOrdersForUser, setAllOrdersForUser
  } = useContext(GlobalContext);

  const router = useRouter();

  async function extractAllOrders() {
    setPageLevelLoader(true);
    const res = await getAllOrdersByUser(user?._id);
    if (res.success) {
      console.log('All orders by user:', res.data);
      setPageLevelLoader(false);

      setAllOrdersForUser(res.data);

      toast.success(res.message, {
        position: "top-right"
      });

    } else {
      setPageLevelLoader(false);
      toast.error(
        res.message || 'Failed to fetch orders. Please try again.', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
      }
      );
    }
  }

  useEffect(() => {
    if (user !== null) {
      extractAllOrders();
    }
  }, [user]);

  console.log('All orders for user state:', allOrdersForUser);

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
        <div className="mt-8 mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8">
          <div>
            <div className="px-4 py-6 sm:px-8 sm:py-10">
              <div className="flow-root">
                {
                  allOrdersForUser && allOrdersForUser.length ?
                    <ul>
                      {
                        allOrdersForUser.map(item =>
                          <li key={item._id} className="bg-gray-200 shadow p-5 flex flex-col space-y-3 py-6 text-left mb-4">
                            <div className="flex">
                              <h1 className="font-bold text-lg mb-3 flex-1">#order: {item._id}</h1>
                              <div className="flex items-center">
                                <p className="mr-3 text-sm font-medium text-gray-900">Total paid amount</p>
                                <p className="mr-3 text-2xl font-semibold text-gray-900">${item.totalPrice}</p>
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
                              <button onClick={() => router.push(`/orders/${item._id}`)}
                                className="mt-5 mr-5 inline-block bg-black text-white px-5 py-3 text-xs font-medium uppercase tracking-wide hover:bg-gray-800 cursor-pointer"
                              >
                                View Order Details
                              </button>
                            </div>
                          </li>
                        )
                      }
                    </ul>
                    : <h1 className="font-bold text-lg">You have no orders yet.</h1>
                }
              </div>
            </div>
          </div>
        </div>
      </div>
      <Notification />
    </section>
  );
}