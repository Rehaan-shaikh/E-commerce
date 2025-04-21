import Address from "@/components/shopping-view/address";
import img from "../../assets/account.jpg";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import UserCartItemsContent from "@/components/shopping-view/cart-item-content";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { createNewOrder } from "@/store/shop/order-slice";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const[currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [isPaymentStart, setIsPaymemntStart] = useState(false);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  console.log(approvalURL,"hi i am approvol")

  // console.log(currentSelectedAddress, "currentSelectedAddress");
  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

      function HandlePaypal() {
        if (!Array.isArray(cartItems?.items) || cartItems.items.length === 0) {
          alert("Cart is empty.");
          return;
        }
      
        if (!currentSelectedAddress) {
          alert("Please select an address.");
          return;
        }
      
        const orderData = {
          userId: user?.id,
          cartItems: cartItems.items.map((item) => ({
            productId: item.productId,
            title: item.title,
            price: item.price,
            salePrice: item.salePrice,
            quantity: item.quantity,
          })),
          cartId: cartItems.id,
          addressInfoId: currentSelectedAddress.id,
          orderStatus: "pending",
          paymentMethod: "paypal",
          paymentStatus: "pending",
          totalAmount: totalCartAmount,
          orderDate: new Date(),
          orderUpdateDate: new Date(),
          paymentId: "",
          payerId: "",
        };
      
        dispatch(createNewOrder({ orderData })).then((data) => {
          console.log(data, "order data");
          if (data?.payload?.success) {
            // alert("Order created successfully");
            setIsPaymemntStart(true)
            // window.location.href = data?.payload?.data?.approvalUrl;
          } else {
            setIsPaymemntStart(false)
            // alert("Error creating order");
          }
        });
      }
      if (approvalURL) {
        window.location.href = approvalURL;
      }
      
    

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address setCurrentSelectedAddress={setCurrentSelectedAddress}/>
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent cartItem={item} />
              ))
            : null}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold">Total</span>
              <span className="font-bold">${totalCartAmount}</span>
            </div>
          </div>
          <div className="mt-4 w-full">
            <Button  onClick={HandlePaypal} className="w-full">
              Checkout with Paypal
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;
