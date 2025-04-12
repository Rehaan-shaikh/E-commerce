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

  return (
    <Fragment>
      <div className="mb-5 w-full flex justify-end">
        <Button onClick={()=>setOpenCreateProductsDialog(true)}>Add New Product</Button>
      </div> 
      <div className="grid gap-4 md:grid-cols-3 lg:grid-cols-4">
        {productList && productList.length > 0
          ? productList.map((productItem) => (
              <AdminProductTile
                key={productItem.id} // Added key prop
                setFormData={setFormData}
                setOpenCreateProductsDialog={setOpenCreateProductsDialog}
                setCurrentEditedId={setCurrentEditedId}
                product={productItem}
                handleDelete={handleDelete}
              />
            ))
          : null}
      </div>
      <Sheet 
        open={openCreateProductsDialog} 
        onOpenChange={()=>{
          setOpenCreateProductsDialog(false); 
          setFormData(initialState); 
          setCurrentEditedId(null);
        }}
      >
        <SheetContent                               
          side="right" 
          className="w-full sm:w-[600px] lg:w-[700px] overflow-y-auto bg-gray-50 dark:bg-gray-900"
        >
          <div className="h-full flex flex-col">
            <SheetHeader className="border-b border-gray-200 dark:border-gray-700 pb-4">
              <SheetTitle className="text-2xl font-bold text-gray-800 dark:text-white">
                {currentEditedId !== null ? "Edit Product" : "Add New Product"}
              </SheetTitle>
            </SheetHeader>
            
            <div className="flex-1 overflow-y-auto py-4 px-1">
              <ProductImageUpload 
                imageFile={imageFile}
                setImageFile={setImageFile}
                uploadedImageUrl={uploadedImageUrl}
                setUploadedImageUrl={setUploadedImageUrl}
                setImageLoadingState={setImageLoadingState}
                imageLoadingState={imageLoadingState}
                isEditMode={currentEditedId !== null}
                className="mb-6"
              />
              
              <div className="px-2">
                <CommonForm 
                  formData={formData} 
                  setFormData={setFormData} 
                  buttonText={currentEditedId !== null ? "Save Changes" : "Add Product"}
                  onSubmit={onSubmit} 
                  formControls={addProductFormElements} 
                  isBtnDisabled={!isFormValid()}
                />
              </div>
            </div>
            
            <div className="border-t border-gray-200 dark:border-gray-700 pt-4 px-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setOpenCreateProductsDialog(false);
                  setFormData(initialState);
                  setCurrentEditedId(null);
                }}
                className="w-full"
              >
                Cancel
              </Button>
            </div>
          </div>
        </SheetContent>
      </Sheet>  
    </Fragment>
  )
}

export default AdminProducts
