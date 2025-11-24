export const navOptions = [
    {
        id: 'home',
        label: 'Home',
        path: '/'
    },
    {
        id: 'listing',
        label: 'All Products',
        path: '/product/listing/all-products'
    },
    {
        id: 'listingMen',
        label: 'Men',
        path: '/product/listing/men'
    },
    {
        id: 'listingWomen',
        label: 'Women',
        path: '/product/listing/women'
    },
    {
        id: 'listingKids',
        label: 'Kids',
        path: '/product/listing/kids'
    },
];

export const adminNavOptions = [
    {
        id: 'adminListing',
        label: 'Manage All Products',
        path: '/admin-view/all-products'
    },
    {
        id: 'adminNewProduct',
        label: 'Add New Product',
        path: '/admin-view/add-product'
    },
]

// export const styles = {
//     button: 'mt-1.5 inline-block bg-black px-5 py-3 text-xs font-medium uppercase tracking-wide text-white'
// };

export const registrationFormControls = [
    {
        id: 'name',
        type: 'text',
        placeholder: 'Enter your name',
        label: 'Name',
        componentType: 'input'
    },
    {
        id: 'email',
        type: 'email',
        placeholder: 'Enter your email',
        label: 'Email',
        componentType: 'input'
    },
    {
        id: 'password',
        type: 'password',
        placeholder: 'Enter your password',
        label: 'Password',
        componentType: 'input'
    },
    {
        id: 'role',
        type: '',
        placeholder: '',
        label: 'Role',
        componentType: 'select',
        options: [
            {
                id: 'admin',
                label: 'Admin',
            },
            {
                id: 'customer',
                label: 'Customer',
            }
        ]
    }
];

export const loginFormControls = [
    {
        id: 'email',
        type: 'email',
        placeholder: 'Enter your email',
        label: 'Email',
        componentType: 'input'
    },
    {
        id: 'password',
        type: 'password',
        placeholder: 'Enter your password',
        label: 'Password',
        componentType: 'input'
    }
];

export const adminAddNewProductFormControls = [
  {
    id: "name",
    type: "text",
    placeholder: "Enter name",
    label: "Name",
    componentType: "input",
  },
  {
    id: "price",
    type: "number",
    placeholder: "Enter price",
    label: "Price",
    componentType: "input",
  },
  {
    id: "description",
    type: "text",
    placeholder: "Enter description",
    label: "Description",
    componentType: "input",
  },
  {
    id: "category",
    type: "",
    placeholder: "",
    label: "Category",
    componentType: "select",
    options: [
      {
        id: "men",
        label: "Men",
      },
      {
        id: "women",
        label: "Women",
      },
      {
        id: "kids",
        label: "Kids",
      },
    ],
  },
  {
    id: "deliveryInfo",
    type: "text",
    placeholder: "Enter deliveryInfo",
    label: "Delivery Info",
    componentType: "input",
  },
  {
    id: "onSale",
    type: "",
    placeholder: "",
    label: "On Sale",
    componentType: "select",
    options: [
      {
        id: "yes",
        label: "Yes",
      },
      {
        id: "no",
        label: "No",
      },
    ],
  },
  {
    id: "priceDrop",
    type: "number",
    placeholder: "Enter Price Drop",
    label: "Price Drop",
    componentType: "input",
  },
];

export const AvailableSizes = [
  {
    id: "2XL",
    label: "2XL",
  },
  {
    id: "S",
    label: "S",
  },
  {
    id: "M",
    label: "M",
  },
  {
    id: "L",
    label: "L",
  },
  {
    id: "XL",
    label: "XL",
  },
];

export const firebaseConfig = {
  apiKey: "AIzaSyAZzt7zya8IxtLsuM7cwi4HRSrlWzKoGAk",
  authDomain: "admin-corporation.firebaseapp.com",
  databaseURL: "https://admin-corporation-default-rtdb.firebaseio.com",
  projectId: "admin-corporation",
  storageBucket: "admin-corporation.appspot.com",
  messagingSenderId: "1016199921024",
  appId: "1:1016199921024:web:2574764dac0d008f1c5565",
  measurementId: "G-70FEXGRKL1"
};

export const firebaseStorageURL = "gs://admin-corporation.appspot.com";

export const addNewAddressFormControls = [
    {
        id: 'fullName',
        type: 'text',
        placeholder: 'Enter your full name',
        label: 'Full Name',
        componentType: 'input'
    },
    {
        id: 'address',
        type: 'text',
        placeholder: 'Enter your address',
        label: 'Address',
        componentType: 'input'
    },
    {
        id: 'city',
        type: 'text',
        placeholder: 'Enter your city',
        label: 'City',
        componentType: 'input'
    },
    {
        id: 'country',
        type: 'text',
        placeholder: 'Enter your country',
        label: 'Country',
        componentType: 'input'
    },
    {
        id: 'postalCode',
        type: 'text',
        placeholder: 'Enter your postal code',
        label: 'Postal Code',
        componentType: 'input'
    }
];