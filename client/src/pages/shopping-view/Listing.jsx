import ProductFilter from "@/components/shopping-view/filter";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
// import { useToast } from "@/components/ui/use-toast";
import { sortOptions } from "@/config";
// import { addToCart, fetchCartItems } from "@/store/shop/cart-slice";
// import {
//   fetchAllFilteredProducts,
//   fetchProductDetails,
// } from "@/store/shop/products-slice";
import { ArrowUpDownIcon } from "lucide-react";
import { useEffect , useState} from "react";
import { useDispatch, useSelector } from "react-redux";
// import { useSearchParams } from "react-router-dom";

import React from 'react'
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import ShoppingProductTile from "@/components/shopping-view/product-tile";
import { useSearchParams } from "react-router-dom";
// It is a React Router hook that lets you read and update the query parameters in the browser URL.

function createSearchParamsHelper(filterParams) {
  const queryParams = [];

  // This line uses destructuring with Object.entries() to loop through the object.
  // Each key is like "brand" or "category", and each value is an array like ["nike", "adidas" or "men" , "women"].
  for (const [key, value] of Object.entries(filterParams)) {

    // This checks if the value is an array and has at least one element.
    if (Array.isArray(value) && value.length > 0) {

      // This joins the array into a string. Example: ["nike", "adidas"] → "nike,adidas"
      const paramValue = value.join(",");  //%2C is just encoded , which is used in the URL to separate multiple values.

      queryParams.push(`${key}=${encodeURIComponent(paramValue)}`);  //queryParams is an array of 2 strings
    }
  }

  console.log(queryParams, "queryParams");

  return queryParams.join("&");
}


const ShoppingListing = () => {

  const dispatch = useDispatch();
  const { productList } = useSelector(
    (state) => state.shopProducts
  );

  const [filters, setFilters] = useState({}); // filter is object of 2 arrays 
  const [sort, setSort] = useState(null);

  // eslint-disable-next-line no-unused-vars
  const [searchParams, setSearchParams] = useSearchParams();
// It is a React Router hook that lets you read and update the query parameters in the browser URL.

  useEffect(() => {
    setSort("price-lowtohigh");
    setFilters(JSON.parse(sessionStorage.getItem("filters")) || {}); 
  }, []);

  useEffect(() => {
    if (filters !== null && sort !== null)
      // console.log(filters ,sort, "filters and sort");  
      dispatch(
        fetchAllFilteredProducts({ filterParams: filters, sortParams: sort })
      );
  }, [dispatch, sort, filters]);

  useEffect(() => {
    if (filters && Object.keys(filters).length > 0) {
      const createQueryString = createSearchParamsHelper(filters);
      // new URLSearchParams is the built-in URLSearchParams class to turn the string into proper format,vice versa
      setSearchParams(new URLSearchParams(createQueryString));
    }
  }, [filters]);
  


  function handleSort(value) {
    // console.log(value , "dropdown value")
    setSort(value);
  }

  function handleFilter(getSectionId, getCurrentOption) {
    // https://chatgpt.com/share/67f91cac-dc38-8007-b595-a8ed2c88f15a reference to understand the code
    let cpyFilters = { ...filters };
    const indexOfCurrentSection = Object.keys(cpyFilters).indexOf(getSectionId);

    if (indexOfCurrentSection === -1) {
      cpyFilters = {
        ...cpyFilters,
        [getSectionId]: [getCurrentOption],
      };
    } else {
      const indexOfCurrentOption =
        cpyFilters[getSectionId].indexOf(getCurrentOption);

      if (indexOfCurrentOption === -1)
        cpyFilters[getSectionId].push(getCurrentOption);
      else cpyFilters[getSectionId].splice(indexOfCurrentOption, 1);
    }
    // console.log(cpyFilters, "i am cpyfilters from handler");

    setFilters(cpyFilters);
    sessionStorage.setItem("filters", JSON.stringify(cpyFilters));
  }

  // console.log(productList, "i am productlis")
  // console.log(filters, "Filters");
  // console.log(sort, "Sort");

  return (
    <div className='grid  md:grid-cols-[200px_1fr] gap-6 p-4 md:p-6'>
      <ProductFilter filters= {filters} handleFilter={handleFilter} />
      <div className="bg-background w-full rounded-lg shadow-sm">
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="text-lg font-extrabold">All Products</h2>
          <div className="flex items-center gap-3">
            <span className="text-muted-foreground">
              {productList.length} Products
            </span>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1"
                >
                  <ArrowUpDownIcon className="h-4 w-4" />
                  <span>Sort by</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-[200px]">
              {/*onValueChange is a prop that Radix UI designed to automatically pass the selected value to your handler function. */}
              {/* and it will still work if we dont specify value={sort} in the dropdown menu radio group. */}
                <DropdownMenuRadioGroup value={sort} onValueChange={handleSort}>
                  {sortOptions.map((sortItem) => (
                    <DropdownMenuRadioItem
                      value={sortItem.id}
                      key={sortItem.id}
                    >
                      {sortItem.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 p-4">
          {productList && productList.length > 0
            ? productList.map((productItem) => (
                <ShoppingProductTile
                  // handleGetProductDetails={handleGetProductDetails}
                  key={productItem.id}
                  product={productItem}
                  // handleAddtoCart={handleAddtoCart}
                />
              ))
            : null}
        </div>
      </div>
      {/* <ProductDetailsDialog
        open={openDetailsDialog}
        setOpen={setOpenDetailsDialog}
        productDetails={productDetails}
      /> */}
    </div>
  ) 
}

export default ShoppingListing
