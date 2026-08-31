import { Button, Form, Input, Label, TextField, Spinner } from "@heroui/react";
import { Check } from "iconsax-reactjs";
import axiosInter from "../../axiosInterceptors/axiosInterceptors";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";
import { useForm } from "react-hook-form";

interface cahngePasswordForm {
  password: string;
  newPassword: string;
}

export default function ChangePassword() {
  const navigate = useNavigate();
  const {
    reset,
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
    },
    mode: "all",
  });
  async function handelUSerSubmit(userData: cahngePasswordForm) {
    toast.promise(axiosInter.patch("/users/change-password", userData), {
      loading: "Wait for Changing Your Passowrd",
      success: function ({ data: { message, data } }) {
        localStorage.setItem("tkn", data.token);
        setTimeout(function () {
          navigate("/posts");
        }, 3000);
        reset({
            password: "",
            newPassword: "",
        })
        return <h1 className="text-main-color capitalize">{message}</h1>;
      },

      error: function ({ message }) {
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
        <TextField isRequired type="password" isInvalid={!!errors.newPassword}>
          <Label>New Password</Label>
          <Input
            {...register("newPassword", {
              required: { value: true, message: "New Password is required" },
              pattern: {
                value:
                  /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/i,
                message: "Invalid password format",
              },
            })}
            placeholder="Enter your New Password"
            className={`${!errors.newPassword && "focus:ring-main-color"} `}
          />
          {errors.newPassword && (
            <span className="text-red-500 text-sm">
              {errors.newPassword.message}
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
