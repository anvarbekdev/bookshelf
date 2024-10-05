import { useNavigate } from "react-router-dom";
import React, { useState } from "react";
import { Button, TextField, Typography, Container, Box } from "@mui/material";
import { z } from "zod";
import CryptoJS from "crypto-js";

const signUpSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const signInSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

type SignUpData = z.infer<typeof signUpSchema>;
type SignInData = z.infer<typeof signInSchema>;

const SignUp = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<SignUpData>({
    name: "",
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<SignUpData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      signUpSchema.parse(formData);
      setErrors({});

      const key = Math.random().toString(36).substring(2, 15);
      const secret = "2892678138d8d793a28fc49055095d8b";
      const method = "POST";
      const url = "/signup";
      const body = JSON.stringify({
        name: formData.name,
        email: formData.email,
        key: key,
        secret: secret,
      });

      const stringToSign = `${method}${url}${body}${secret}`;
      const sign = CryptoJS.MD5(stringToSign).toString();

      const response = await fetch("https://no23.lavina.tech/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Key: key,
          Sign: sign,
        },
        body: body,
      });

      const result = await response.json();
      console.log("Signup result:", result);
      if (result.isOk) {
        localStorage.setItem("userData", JSON.stringify(result));
      }

      navigate("/books");
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors as Partial<SignUpData>);
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign Up
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            label="Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            error={!!errors.name}
            helperText={errors.name?.[0]}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email?.[0]}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password?.[0]}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

const SignIn = () => {
  const [formData, setFormData] = useState<SignInData>({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState<Partial<SignInData>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    try {
      signInSchema.parse(formData);
      setErrors({});
      console.log("Sign in data:", formData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        setErrors(error.flatten().fieldErrors as Partial<SignInData>);
      }
    }
  };

  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          mt: 8,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <Typography component="h1" variant="h5">
          Sign In
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            fullWidth
            label="Email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            error={!!errors.email}
            helperText={errors.email?.[0]}
          />
          <TextField
            margin="normal"
            fullWidth
            label="Password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            error={!!errors.password}
            helperText={errors.password?.[0]}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default function Auth() {
  return (
    <div>
      <SignUp />
      {/* <SignIn /> */}
    </div>
  );
}
