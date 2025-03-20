import prisma from "../DB/db.config.js";

export const RegisterUser = async (req , res)=>{
    const {userName , email , password} = req.body;
    console.log(req.body);

    const newUser = await prisma.user.create({
        data:{
            username : userName , 
            email : email ,
            password : password
        }
    })
    return res.json({status : 200 , data : newUser , message : "User is created"})
}
