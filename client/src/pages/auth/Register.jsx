import CommonForm from "@/components/common/form";
// import { useToast } from "@/components/ui/use-toast";
import { registerFormControls } from "@/config";
import { registerUser } from "@/store/auth-slice";
import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";

const initialState = {
  userName: "",
  email: "",
  password: "",
};

function AuthRegister() {
  const [formData, setFormData] = useState(initialState);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  // const { toast } = useToast();

  function onSubmit(event) {
    console.log(event)
    event.preventDefault();
    // The createAsyncThunk function is triggered when you dispatch it from your React component.
    dispatch(registerUser(formData)).then((data) => {
      if (data?.payload?.success) {
        alert("Success")
        // toast({
        //   title: data?.payload?.message,
        // });
        navigate("/auth/login");
      } else {
        alert("UnSuccess")
        
        // toast({
        //   title: data?.payload?.message,
        //   variant: "destructive",
        // });
      }
    });
  }

  console.log(formData);

  return (
    <div className="mx-auto w-full max-w-md space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Create new account
        </h1>
        <p className="mt-2">
          Already have an account?
          <Link className="font-medium ml-2 text-primary hover:underline" to="/auth/login">
            Login
          </Link>
        </p>
      </div>
      <CommonForm
        formControls={registerFormControls}
        buttonText={"Sign Up"}
        formData={formData}
        setFormData={setFormData}
        onSubmit={onSubmit}
      />
    </div>
  );
}

export default AuthRegister; 

