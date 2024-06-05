import zod from "zod";

const RegisterSchema = zod.object({
  name: zod
    .string({ required_error: "Username is required" })
    .trim()
    .min(3, { message: "Username must be at least 3 characters" })
    .max(255, { message: "Username can be at most 255 characters" }),
  email: zod
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email should be at least 3 characters" })
    .max(255, { message: "Email can be at most 255 characters" }),
  password: zod
    .string({ required_error: "Password is required" })
    .trim()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(20, { message: "Password Length should be less than 20 Characters" })
  });

const LoginSchema = zod.object({
  email: zod
    .string({ required_error: "Email is required" })
    .trim()
    .email({ message: "Invalid email address" })
    .min(3, { message: "Email should be at least 3 characters" })
    .max(255, { message: "Email can be at most 255 characters" }),
    password: zod
    .string({ required_error: "Password is required" })
    .trim()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(20, { message: "Password Length should be less than 20 Characters" }),
});

export { RegisterSchema, LoginSchema };