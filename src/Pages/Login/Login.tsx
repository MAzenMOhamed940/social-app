import { Button, Form, Input, Label, TextField, Spinner } from "@heroui/react";
import { Check } from "iconsax-reactjs";
import axiosInter from "../../axiosInterceptors/axiosInterceptors";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { UserTokenContext } from "../../Context/AuthUserContext";
import { useContext } from "react";
import type { UserData } from "../../Components/Navbar/Navbar";

interface loginForm {
  email: string;
  password: string;
}

export async function gaetuserData() {
  try {
    const response = axiosInter.get("/users/profile-data");
    return (await response).data.data.user;
  } catch (error) {
    console.log(error);
    return null;
  }
}

export default function Login() {
  const { setUserData } = useContext(UserTokenContext) as {
    setUserData: (userData: UserData | null) => void;
  };
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "all",
  });
  async function handelUSerSubmit(userData: loginForm) {
    toast.promise(axiosInter.post("/users/signin", userData), {
      loading: "Wait for Creating Your Account",
      success: function ({
        data: {
          message,
          data: { token, user },
        },
      }) {
        localStorage.setItem("tkn", token);
        setUserData(user);
        navigate("/posts");
        return <h1 className="text-main-color capitalize">{message}</h1>;
      },

      error: function ({
        response: {
          data: { message },
        },
      }) {
        return <h1 className="text-red-500 capitalize">{message}</h1>;
      },
    });
  }
  // lg:container lg:mx-auto lg:px-90 md:px-20  py-5 bg-[#E8F5E9]
  return (
    <div className="">
      <Form
        className="flex md:min-w-2xl bg-white shadow-2xl p-10 rounded-3xl flex-col gap-4 border-2"
        onSubmit={handleSubmit(handelUSerSubmit)}
      >
        <div className="flex items-center justify-center">
          <img src="/logo2.png" alt="" className="lg:w-40 w-30" />
          <p className="lg:text-3xl text-2xl text-center font-bold p-3 text-main-color">
            Social App
          </p>
        </div>

        <h1 className="lg:text-6xl text-5xl text-center p-3">Login</h1>
        {/* Email Input */}
        <TextField isRequired type="email" isInvalid={!!errors.email}>
          <Label>Email</Label>
          <Input
            {...register("email", {
              required: { value: true, message: "Email is required" },
              pattern: {
                value: /^\S+@\S+\.\S+$/i,
                message: "Invalid email format",
              },
            })}
            placeholder="Enter your Email"
            className={`${!errors.email && "focus:ring-main-color"} `}
          />
          {errors.email && (
            <span className="text-red-500 text-sm">{errors.email.message}</span>
          )}
        </TextField>
        {/* Password Input */}
        <TextField isRequired type="password" isInvalid={!!errors.password}>
          <Label>Password</Label>
          <Input
            {...register("password", {
              required: { value: true, message: "Password is required" },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i,
                message: "Invalid password format",
              },
            })}
            placeholder="Enter your Password"
            className={`${!errors.password && "focus:ring-main-color"} `}
          />
          {errors.password && (
            <span className="text-red-500 text-sm">
              {errors.password.message}
            </span>
          )}
        </TextField>
        <div className="flex flex-col gap-3">
          <Button
            type="submit"
            className="w-full bg-main-color hover:bg-green-600 transition-colors duration-300"
            isPending={isSubmitting}
          >
            {isSubmitting ? (
              <Spinner color="current" />
            ) : (
              <>
                <Check />
                Submit
              </>
            )}
          </Button>
          <Button type="reset" variant="danger-soft" className="w-full">
            Reset
          </Button>
        </div>
      </Form>
    </div>
  );
}
