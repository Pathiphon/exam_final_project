import React, { useState } from "react";
import ErrorMessage from "./ErrorMessage";
import {
  Typography,
  FormControl, Input, InputLabel,
  Button,
} from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { signin } from "../services/auth.service";
import Toast from "./Toast/Toast";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const submitLogin = async () => {
    await signin(email, password)
      .then((res) => {
        Toast.fire({
          icon: "success",
          title: "เข้าสู่ระบบแล้ว",
        });
        navigate("/");
        window.location.reload();
      })
      .catch((err) => {
        Toast.fire({
          icon: "error",
          title: "มีข้อผิดพลาดในการเข้าสู่ระบบ",
        });
      });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    submitLogin();
  };

  return (
    <div
      className="w-100 p-4"
      style={{ backgroundColor: "#ffffff", borderRadius: "10px" }}
    >
      <form onSubmit={handleSubmit} className="container mx-auto text-center">
        <Typography
          variant="h5"
          sx={{ mb: 2 }}
          component="div"
          style={{ color: "black" }}
        >
          เข้าสู่ระบบ
        </Typography>
        <FormControl
          sx={{ m: 1, width: "80%" }}
          className="container"
          variant="standard"
        >
          <InputLabel>E-mail</InputLabel>
          <Input
            type="email"
            variant="standard"
            defaultValue={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </FormControl>
        <FormControl
          sx={{ m: 1, width: "80%" }}
          className="container"
          variant="standard"
        >
          <InputLabel>รหัสผ่าน</InputLabel>
          <Input
            variant="standard"
            type="password"
            defaultValue={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </FormControl>
        <div className="mt-2 w-80 text-left underline mx-auto">
          <Link to="./ForgotPassword">
          ลืมรหัสผ่าน?
          </Link>
        </div>
        <FormControl
          sx={{ m: 1, width: "80%" }}
          className="container"
          variant="standard"
        >
          {errorMessage ? <ErrorMessage message={errorMessage} /> : <></>}
        </FormControl>
        <FormControl
          sx={{ m: 1, width: "75%" }}
          className="container"
          variant="standard"
        >
          <Button
            variant="contained"
            size="large"
            type="submit"
            sx={{
              backgroundColor: "#000000",
              ":hover": {
                bgcolor: "#000033",
              },
              borderRadius: "10px",
            }}
          >
            เข้าสู่ระบบ
          </Button>
        </FormControl>
      </form>
    </div>
  );
};
export default Login;
