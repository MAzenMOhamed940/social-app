import {
  Button,
  Form,
  Input,
  Label,
  TextField,
  Select,
  ListBox,
  Spinner,
} from "@heroui/react";
import { Check } from "iconsax-reactjs";
import { Controller, useForm } from "react-hook-form";
import axiosInter from "../../axiosInterceptors/axiosInterceptors";
import toast from "react-hot-toast";
import { useNavigate } from "react-router";

interface RegisterForm {
  name: string;
  username: string;
  email: string;
  dateOfBirth: string;
  gender: string;
  password: string;
  rePassword: string;
}

export default function Register() {
  const navigate = useNavigate();
  const {
    handleSubmit,
    register,
    control,
    formState: { errors, isSubmitting },
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      dateOfBirth: "",
      gender: "",
      password: "",
      rePassword: "",
    },
    mode: "all",
  });
  async function handelUSerSubmit(userData: RegisterForm) {
    toast.promise(axiosInter.post("/users/signup", userData), {
      loading: "Wait for Creating Your Account",
      success: function ({ data: { message } }) {
        setTimeout(function () {
          navigate("/login");
        }, 3000);
        reset({
          name: "",
          username: "",
          email: "",
          dateOfBirth: "",
          gender: "",
          password: "",
          rePassword: "",
        });

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
          <img src="/public/logo2.png" alt="" className="lg:w-40 w-30" />
          <p className="lg:text-3xl text-2xl text-center font-bold p-3 text-main-color">
            Social App
          </p>
        </div>

        <h1 className="lg:text-6xl text-5xl text-center p-3">Register</h1>
        {/* Name Input */}
        <TextField isRequired type="text" isInvalid={!!errors.name}>
          <Label>Name</Label>
          <Input
            {...register("name", {
              required: { value: true, message: "Name is required" },
              pattern: {
                value: /^[A-Za-z ]{3,20}$/i,
                message: "Invalid name format",
              },
            })}
            placeholder="Enter your Name"
            className={`${!errors.name && "focus:ring-main-color"} `}
          />
          {errors.name && (
            <span className="text-red-500 text-sm">{errors.name.message}</span>
          )}
        </TextField>
        {/* User Name Input */}
        <TextField isRequired type="text" isInvalid={!!errors.username}>
          <Label>User Name</Label>
          <Input
            {...register("username", {
              required: { value: true, message: "User Name is required" },
              pattern: {
                value: /^[A-Za-z]{3,20}$/i,
                message: "Invalid user name format",
              },
            })}
            placeholder="Enter your User Name"
            className={`${!errors.username && "focus:ring-main-color"} `}
          />
          {errors.username && (
            <span className="text-red-500 text-sm">
              {errors.username.message}
            </span>
          )}
        </TextField>
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
        {/* RePassword Input */}
        <TextField isRequired type="password" isInvalid={!!errors.rePassword}>
          <Label>Confirm Password</Label>

          <Input
            {...register("rePassword", {
              required: {
                value: true,
                message: "Confirm Password is required",
              },

              validate: (value) => {
                return (
                  value === getValues("password") || "Passwords do not match"
                );
              },
            })}
            placeholder="Enter your Confirm Password"
            className={`${!errors.rePassword && "focus:ring-main-color"}`}
          />

          {errors.rePassword && (
            <span className="text-red-500 text-sm">
              {errors.rePassword.message}
            </span>
          )}
        </TextField>
        {/* Date Input */}
        <TextField isRequired type="date" isInvalid={!!errors.dateOfBirth}>
          <Label>Date of birth</Label>
          <Input
            {...register("dateOfBirth", {
              required: { value: true, message: "Date of birth is required" },
              validate: (value) => {
                const today = new Date();
                const selectedDate = new Date(value);
                if (today.getFullYear() - selectedDate.getFullYear() > 14) {
                  return true;
                }
                return "You must be at least 14 years old to register.";
              },
            })}
            placeholder="Enter your Date of birth"
            className={`${!errors.dateOfBirth && "focus:ring-main-color"} `}
          />
          {errors.dateOfBirth && (
            <span className="text-red-500 text-sm">
              {errors.dateOfBirth.message}
            </span>
          )}
        </TextField>
        {/* Gender Input */}
        <Controller
          name="gender"
          control={control}
          rules={{ required: { value: true, message: "Gender is required" } }}
          render={function ({ field, fieldState }) {
            return (
              <Select
                className="w-full"
                placeholder="Select Gender"
                {...field}
                isInvalid={!!fieldState.error}
              >
                <Label>Gender</Label>
                <Select.Trigger>
                  <Select.Value />
                  <Select.Indicator />
                </Select.Trigger>
                <Select.Popover>
                  <ListBox>
                    <ListBox.Item id="male" textValue="male">
                      Male
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                    <ListBox.Item id="female" textValue="female">
                      Female
                      <ListBox.ItemIndicator />
                    </ListBox.Item>
                  </ListBox>
                </Select.Popover>
                {fieldState.error && (
                  <span className="text-red-500 text-sm">
                    {fieldState.error.message}
                  </span>
                )}
              </Select>
            );
          }}
        />
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
