import CommonListing from "@/components/CommonListing";
import { getAllAdminProducts, productByCategory } from "@/services/product";

export default async function MenAllProducts() {
    const getAllProducts = await productByCategory('men');

    return <CommonListing
        data={getAllProducts && getAllProducts.success ? getAllProducts.data : []}
        title="All Products"
        type="products"
    />
}