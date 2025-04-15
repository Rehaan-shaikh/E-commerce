import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

function AddressCard({
  addressInfo,
  handleDeleteAddress,
  handleEditAddress,
  // setCurrentSelectedAddress,
  // selectedId,
}) {
    // console.log(addressInfo,"adrresd info")
  if (!addressInfo) return null;

  return (
    <Card
      // onClick={
      //   setCurrentSelectedAddress
      //     ? () => setCurrentSelectedAddress(addressInfo)
      //     : null
      // }
      // className={`cursor-pointer hover:shadow-md transition ${
      //   selectedId?.id === addressInfo?.id
      //     ? "border-red-900 border-[4px]"
      //     : "border-black"
      // }`}
    >
      <CardContent className="grid p-4 gap-4">
        <Label>Address: {addressInfo?.address}</Label>
        <Label>City: {addressInfo?.city}</Label>
        <Label>Pincode: {addressInfo?.pincode}</Label>
        <Label>Phone: {addressInfo?.phone}</Label>
        <Label>Notes: {addressInfo?.notes}</Label>
      </CardContent>
      <CardFooter className="p-3 flex justify-between">
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleEditAddress(addressInfo);
          }}
        >
          Edit
        </Button>
        <Button
          onClick={(e) => {
            e.stopPropagation();
            handleDeleteAddress(addressInfo);
          }}
        >
          Delete
        </Button>
      </CardFooter>
    </Card>
  );
}

export default AddressCard;
