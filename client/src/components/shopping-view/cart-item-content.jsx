import { Minus, Plus, Trash } from "lucide-react";
import { Button } from "../ui/button";
import { useDispatch, useSelector } from "react-redux";

import React from 'react'
import { deleteCartItem, updateCartQuantity } from "@/store/shop/cart-slice";

const UserCartItemsContent = ({cartItem}) => {
    // console.log(cartItem , "cartItem")

    const { user } = useSelector((state) => state.auth);
    const { cartItems } = useSelector((state) => state.shopCart);
    const { productList } = useSelector((state) => state.shopProducts);

    const dispatch = useDispatch();
    
    function handleCartItemDelete(getProductId) {
        // console.log(getProductId , user?.id , "getProductId user?.id")
        dispatch(
          deleteCartItem({ userId: user?.id, productId: getProductId })
        ).then((data) => {
          if (data?.payload?.success) {
            alert("Cart item is deleted successfully");
            // console.log(data?.payload?.message);
          }
        });
    }

    function handleUpdateQuantity(getCartItemData, typeOfAction) {
      // console.log(productList , "productList")
      // console.log(getCartItemData , typeOfAction , "getCartItem typeOfAction")
      const getCurrCartIndex = productList.findIndex((product) => product.id === getCartItemData?.productId);
      // console.log(getCurrCartIndex , "getCurrCartIndex")
      const getTotalStock = productList[getCurrCartIndex]?.totalStock;
        if (typeOfAction == "plus") {
          let getCartItem = cartItems.items || [];
          if (getCartItem.length) {
            const getCurrIndex = getCartItem.findIndex((Item) => Item.productId === getCartItemData.productId);
            if (getCurrIndex > -1) {
              const getCurrQuantity = getCartItem[getCurrIndex].quantity;
              if (getCurrQuantity + 1 > getTotalStock) {
                alert("only " + getTotalStock + " items can be added to cart");
                return;
              }
            }
          }
        }

        dispatch(updateCartQuantity({
                userId : user?.id , productId : getCartItemData?.productId ,
                 quantity : typeOfAction === "plus" ? getCartItemData?.quantity + 1 : getCartItemData?.quantity - 1
            }))

    }    

  return (
    <div className="flex items-center space-x-4">
      <img
        src={cartItem?.image}
        alt={cartItem?.title}
        className="w-20 h-20 rounded object-cover"
      />
      <div className="flex-1">
        <h3 className="font-extrabold">{cartItem?.title}</h3>
        <div className="flex items-center gap-2 mt-1">
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            disabled={cartItem?.quantity === 1}
            onClick={() => handleUpdateQuantity(cartItem, "minus")}
          >
            <Minus className="w-4 h-4" />
            <span className="sr-only">Decrease</span>
          </Button>
          <span className="font-semibold">{cartItem?.quantity}</span>
          <Button
            variant="outline"
            className="h-8 w-8 rounded-full"
            size="icon"
            onClick={() => handleUpdateQuantity(cartItem, "plus")}
          >
            <Plus className="w-4 h-4" />
            <span className="sr-only">Increase</span>
          </Button>
        </div>
      </div>
      <div className="flex flex-col items-end">
        <p className="font-semibold">
          $
          {(
            (cartItem?.salePrice > 0 ? cartItem?.salePrice : cartItem?.price) *
            cartItem?.quantity
          ).toFixed(2)}
        </p>
        <Trash
          onClick={() => handleCartItemDelete(cartItem?.productId)}
          className="cursor-pointer mt-1"
          size={20}
        />
      </div>
    </div>
  )
}

export default UserCartItemsContent
