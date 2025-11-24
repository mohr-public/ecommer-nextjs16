import CommonListing from '@/components/CommonListing'
import { getAllAdminProducts } from '@/services/product'



export default async function AdminAllProducts() {
  // console.log("AdminAllProducts 2");
  const allAdminProducts = await getAllAdminProducts();
  // console.log(allAdminProducts)
  return <CommonListing data={allAdminProducts && allAdminProducts.data} />
}
