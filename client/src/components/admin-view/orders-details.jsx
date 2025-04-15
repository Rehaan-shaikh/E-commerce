import { useState } from "react";
import CommonForm from "../common/form";
import { DialogContent } from "../ui/dialog";
import { Label } from "../ui/label";
import { Separator } from "../ui/separator";
import { Badge } from "../ui/badge";
import { useSelector } from "react-redux";
import { CheckoutformControls } from "@/config";

const initialFormData = {
  status: "",
};

function AdminOrderDetailsView() {
  const [formData, setFormData] = useState(initialFormData);
  const { user } = useSelector((state) => state.auth);
//   const dispatch = useDispatch();


  function handleUpdateStatus(event) {
    event.preventDefault();
  }

  return (
    <DialogContent className="sm:max-w-[600px]">
      <div className="grid gap-6">
        <div className="grid gap-2">
          <div className="flex mt-6 items-center justify-between">
            <p className="font-medium">Order ID</p>
            <Label>21</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Date</p>
            <Label>20/11/25</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Price</p>
            <Label>$1000</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment method</p>
            <Label>cash on delivery</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Payment Status</p>
            <Label>in process</Label>
          </div>
          <div className="flex mt-2 items-center justify-between">
            <p className="font-medium">Order Status</p>
          </div>
        </div>
        <Separator />
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Order Details</div>
            <ul className="grid gap-3">
                    <li className="flex items-center justify-between">
                      <span>Title: H&M Shoes</span>
                      <span>Quantity: 2</span>
                      <span>Price: $400</span>
                    </li>
            </ul>
          </div>
        </div>
        <div className="grid gap-4">
          <div className="grid gap-2">
            <div className="font-medium">Shipping Info</div>
            <div className="grid gap-0.5 text-muted-foreground">
              <span>{user.userName}</span>
              <span>plot no 24 , mantri chandak </span>
              <span>solapur</span>
              <span>413005</span>
              <span>83347392</span>
              <span>kriptes pitenka deotar saul</span>
            </div>
          </div>
        </div>

        <div>
          <CommonForm
            formControls={CheckoutformControls}
            formData={formData}
            setFormData={setFormData}
            buttonText={"Update Order Status"}
            onSubmit={handleUpdateStatus}
          />
        </div>
      </div>
    </DialogContent>
  );
}

export default AdminOrderDetailsView;
