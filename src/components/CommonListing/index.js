'use client';

import ProductTile from "./ProductTile";
import ProductButtons from "./ProductButtons";
import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import Notification from "@/components/Notification";


export default function CommonListing({data}) {

    const router = useRouter();

    useEffect(() => {
        router.refresh();
    }, [router]);

    if (router.isFallback) {
        return <div>Loading...</div>
    }
    
    return <section className="bg-white py-12 sm:py-16">
        <div className="mx-auto max-w-screen-xl px-4 sm-px-6 lg-px-8">
            <div className="mt-0 grid grid-cols-1 gap-1 sm:grid-cols-2 sm:gap-2 md:grid-cols-3 md:gap-3 lg:grid-cols-4 lg:gap-4 xl:grid-cols-5 xl:gap-5 lg:mt-0">
                {
                    data && data.length > 0 ? (
                        data.map((item) =>(
                            <article className="relative flex flex-col overflow-hidden border border-gray-200 cursor-pointer" 
                                key={item._id}
                            >
                                <ProductTile item={item} />
                                <ProductButtons item={item} />
                            </article>
                        ))
                    ) : (
                        null
                    )
                }
            </div>
        </div>
        <Notification />
    </section>;
}