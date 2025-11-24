import CommonDetails from "@/components/CommonDetails";
import { productById, productByIdAndToken } from "@/services/product"





export default  async function ProductDetails({params}) {

    const productDetailsData = await productById(params.details);
    console.log("productDetailsData", productDetailsData);

    return <CommonDetails
        item={productDetailsData && productDetailsData.data}
    />
}