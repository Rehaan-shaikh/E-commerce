import { imageUploadUtil } from "../../helpers/cloudinary.js";


const handleImageUpload = async (req, res) => {
  try {
    const b64 = Buffer.from(req.file.buffer).toString("base64"); // req.file.buffer provide raw data of file in the form of binary content
    const url = "data:" + req.file.mimetype + ";base64," + b64; // req.file.mimetype provide type of like jpg,pdf,etc
    const result = await imageUploadUtil(url);//then this url converted file is store in cloudinary

    res.json({
      success: true,
      result,
    });
  } catch (error) {
    console.log(error);
    res.json({
      success: false,
      message: "Error occured",
    });
  }
};

export default handleImageUpload;