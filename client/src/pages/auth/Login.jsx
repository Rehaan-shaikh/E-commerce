// import CommonForm from "@/components/common/form";
// import { useToast } from "@/components/ui/use-toast";
// import CommonForm from "@/components/Common/form";
import CommonForm from "@/components/Common/form";
import { loginFormControls } from "@/config";
import { loginUser } from "@/store/auth-slice";
import { useState } from "react";
import { useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { toast } from "react-toastify";


const initialState = {
  email: "",
  password: "",
};

function AuthLogin() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  // const navigate = useNavigate();
  // const { toast } = useToast();

  function onSubmit(event) {
    event.preventDefault();
    dispatch(loginUser(formData)).then((data) => {
    // console.log(data.payload)
      if (data?.payload?.status==200) {
        // alert("Success")
        toast.success("Login Successfull")
        // console.log(data?.payload ,"PAylod Ex");
        // toast({
        //   title: data?.payload?.message,
        // });
    }
    else{
      // console.log(data)
      // alert(data.payload.message);
      toast.error(data.payload.message)
    }
  })
  }
  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Sign in to your account
        </h1>
        <p className="mt-2">
          Don't have an account
          <Link
            className="font-medium ml-2 text-primary hover:underline"
            to="/auth/register"
          >
            Register
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={loginFormControls}
        buttonText={"Sign In"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthLogin;
