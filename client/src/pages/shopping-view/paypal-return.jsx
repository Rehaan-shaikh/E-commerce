import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();

  // Extracting paymentId and PayerID from the URL parameters
  const params = new URLSearchParams(location.search); // Think of URLSearchParams like a helper that splits the URL query into key-value pairs.
  //https://yourwebsite.com/paypal-return?paymentId=abc123&PayerID=xyz789
  //?paymentId=abc123&PayerID=xyz789 this pRT IS location.search
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (paymentId && payerId) {
      const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

      dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
        // console.log(data, "i am capture datata");
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
          // window.location.href : Forces a full page reload.
          // Useful when:
          // You want to reset the app state after something critical (like a payment).
          // You want to avoid stale Redux/session state or side effects. etc
        }
      });
    }
  }, [paymentId, payerId, dispatch]);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Processing Payment...Please wait!</CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturnPage;
