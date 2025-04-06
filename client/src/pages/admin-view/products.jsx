import CommonForm from '@/components/Common/form'
import { Button } from '@/components/ui/button';
import {Sheet, SheetContent , SheetHeader , SheetTitle } from '@/components/ui/sheet';
import { addProductFormElements } from '@/config';
import React, { useEffect } from 'react'
import { useState , Fragment} from 'react';
import ProductImageUpload from '../../components/admin-view/imageUpload';
import { useDispatch, useSelector } from 'react-redux';
import { addNewProduct, deleteProduct, editProduct, fetchAllProducts } from '@/store/admin/product-slice';
import AdminProductTile from '@/components/admin-view/product-tile';

const initialState = {
  image : null,
  title : "",
  description : "",
  category : "",
  brand : "",
  price : "",
  salePrice : "",
  totalStock : "",
}
const AdminProducts = () => {
  const [openCreateProductsDialog, setOpenCreateProductsDialog] = useState(false);
  const [formData, setFormData] = useState(initialState);
  const [imageFile, setImageFile] = useState(null);
  const [uploadedImageUrl, setUploadedImageUrl] = useState("");
  const [imageLoadingState, setImageLoadingState] = useState(false);
  const [currentEditedId, setCurrentEditedId] = useState(null);
  
  const {productList} = useSelector(
    (state) => state.adminProducts || {}   
  );

  const dispatch = useDispatch();

  function onSubmit(event) {
    event.preventDefault();

    currentEditedId !== null
      ? dispatch(
          editProduct({
            id: currentEditedId,
            formData,
          })
        ).then((data) => {
          console.log(data, "edit");

          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setFormData(initialState);
            setOpenCreateProductsDialog(false);
            setCurrentEditedId(null);
            alert("Product edited successfully");
          }
        })
      : dispatch(
          addNewProduct({
            ...formData,
            image: uploadedImageUrl,
          })
        ).then((data) => {
          if (data?.payload?.success) {
            dispatch(fetchAllProducts());
            setOpenCreateProductsDialog(false);
            setImageFile(null);
            setFormData(initialState);
            alert("Product added successfully");
          }
        });
  }

  function handleDelete(deleteProductId) {
    // console.log(deleteProductId , "delete product")
    dispatch(deleteProduct(deleteProductId)).then((data) => {
      if (data?.payload?.success) {
        dispatch(fetchAllProducts());
        alert("Product deleted successfully")
      }
    });
  }

  function isFormValid() {
    return Object.keys(formData)
      .filter((currentKey) => currentKey !== "averageReview")
      .map((key) => formData[key] !== "")
      .every((item) => item);
  }

  useEffect(() => {
    dispatch(fetchAllProducts())
  },[dispatch]);


  console.log(productList, "productList")

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={()=>setOpenCreateProductsDialog(true)}>Add New Product</Button>
      </div> 
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet open={openCreateProductsDialog} onOpenChange={()=>{
        setOpenCreateProductsDialog(false) ; setFormData(initialState) ; setCurrentEditedId(null);}}>
        {/* //this open and onOpenChange is used to open and close the sheet */}
        <SheetContent side="right" className="overflow-auto">
          <SheetHeader>
            <SheetTitle>{currentEditedId !== null ? "Edit Product" : "Add New Product"}</SheetTitle>
          </SheetHeader>
          <ProductImageUpload 
          imageFile={imageFile}
          setImageFile={setImageFile}
          uploadedImageUrl={uploadedImageUrl}
          setUploadedImageUrl={setUploadedImageUrl}
          setImageLoadingState={setImageLoadingState}
          imageLoadingState={imageLoadingState}
          isEditMode={currentEditedId !== null}
          />
          <div className='py-6'>
            <CommonForm formData={formData} setFormData={setFormData} buttonText={currentEditedId !== null ? "Edit" : "Add"}
             onSubmit={onSubmit} formControls={addProductFormElements} isBtnDisabled={!isFormValid()}
             />
            </div> 
        </SheetContent>
        </Sheet>  
    </Fragment>
  )
}

export default AdminProducts



// import ProductImageUpload from "@/components/admin-view/image-upload";
// import AdminProductTile from "@/components/admin-view/product-tile";
// import CommonForm from "@/components/common/form";
// import { Button } from "@/components/ui/button";
// import {
//   Sheet,
//   SheetContent,
//   SheetHeader,
//   SheetTitle,
// } from "@/components/ui/sheet";
// import { useToast } from "@/components/ui/use-toast";
// import { addProductFormElements } from "@/config";
// import {
//   addNewProduct,
//   deleteProduct,
//   editProduct,
//   fetchAllProducts,
// } from "@/store/admin/products-slice";
// import { Fragment, useEffect, useState } from "react";
// import { useDispatch, useSelector } from "react-redux";

// const initialFormData = {
//   image: null,
//   title: "",
//   description: "",
//   category: "",
//   brand: "",
//   price: "",
//   salePrice: "",
//   totalStock: "",
//   averageReview: 0,
// };

// function AdminProducts() {
//   const [openCreateProductsDialog, setOpenCreateProductsDialog] =
//     useState(false);
//   const [formData, setFormData] = useState(initialFormData);
//   const [imageFile, setImageFile] = useState(null);
//   const [uploadedImageUrl, setUploadedImageUrl] = useState("");
//   const [imageLoadingState, setImageLoadingState] = useState(false);
//   const [currentEditedId, setCurrentEditedId] = useState(null);

//   const { productList } = useSelector((state) => state.adminProducts);
//   const dispatch = useDispatch();
//   const { toast } = useToast();

  // function onSubmit(event) {
  //   event.preventDefault();

  //   currentEditedId !== null
  //     ? dispatch(
  //         editProduct({
  //           id: currentEditedId,
  //           formData,
  //         })
  //       ).then((data) => {
  //         console.log(data, "edit");

  //         if (data?.payload?.success) {
  //           dispatch(fetchAllProducts());
  //           setFormData(initialFormData);
  //           setOpenCreateProductsDialog(false);
  //           setCurrentEditedId(null);
  //         }
  //       })
  //     : dispatch(
  //         addNewProduct({
  //           ...formData,
  //           image: uploadedImageUrl,
  //         })
  //       ).then((data) => {
  //         if (data?.payload?.success) {
  //           dispatch(fetchAllProducts());
  //           setOpenCreateProductsDialog(false);
  //           setImageFile(null);
  //           setFormData(initialFormData);
  //           toast({
  //             title: "Product add successfully",
  //           });
  //         }
  //       });
  // }

//   function handleDelete(getCurrentProductId) {
//     dispatch(deleteProduct(getCurrentProductId)).then((data) => {
//       if (data?.payload?.success) {
//         dispatch(fetchAllProducts());
//       }
//     });
//   }

  // function isFormValid() {
  //   return Object.keys(formData)
  //     .filter((currentKey) => currentKey !== "averageReview")
  //     .map((key) => formData[key] !== "")
  //     .every((item) => item);
  // }

//   useEffect(() => {
//     dispatch(fetchAllProducts());
//   }, [dispatch]);

//   console.log(formData, "productList");

//   return (
//     <Fragment>
//       <div className="mb-5 w-full flex justify-end">
//         <Button onClick={() => setOpenCreateProductsDialog(true)}>
//           Add New Product
//         </Button>
//       </div>
//       <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
//         {productList && productList.length > 0
//           ? productList.map((productItem) => (
//               <AdminProductTile
//                 setFormData={setFormData}
//                 setOpenCreateProductsDialog={setOpenCreateProductsDialog}
//                 setCurrentEditedId={setCurrentEditedId}
//                 product={productItem}
//                 handleDelete={handleDelete}
//               />
//             ))
//           : null}
//       </div>
//       <Sheet
//         open={openCreateProductsDialog}
//         onOpenChange={() => {
//           setOpenCreateProductsDialog(false);
//           setCurrentEditedId(null);
//           setFormData(initialFormData);
//         }}
//       >
//         <SheetContent side="right" className="overflow-auto">
//           <SheetHeader>
//             <SheetTitle>
//               {currentEditedId !== null ? "Edit Product" : "Add New Product"}
//             </SheetTitle>
//           </SheetHeader>
//           <ProductImageUpload
//             imageFile={imageFile}
//             setImageFile={setImageFile}
//             uploadedImageUrl={uploadedImageUrl}
//             setUploadedImageUrl={setUploadedImageUrl}
//             setImageLoadingState={setImageLoadingState}
//             imageLoadingState={imageLoadingState}
//             isEditMode={currentEditedId !== null}
//           />
//           <div className="py-6">
//             <CommonForm
//               onSubmit={onSubmit}
//               formData={formData}
//               setFormData={setFormData}
//               buttonText={currentEditedId !== null ? "Edit" : "Add"}
//               formControls={addProductFormElements}
//               isBtnDisabled={!isFormValid()}
//             />
//           </div>
//         </SheetContent>
//       </Sheet>
//     </Fragment>
//   );
// }

// export default AdminProducts;
