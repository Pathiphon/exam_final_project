import React, { useState, useContext } from "react";
import { FormControl, Input, InputLabel, TextField } from "@mui/material";
import ErrorMessage from "./ErrorMessage";
import API from "../config/api";
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  Container,
  Box,
  CssBaseline,
  Grid,
} from "@mui/material";
import index_img from "../img/index.png";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import { signin } from "../services/auth.service";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const navigate = useNavigate();

  const submitLogin = async () => {
    await signin(email, password)
      .then((res) => {
        navigate('/')
        window.location.reload();
      })
      .catch((err) => {
        console.log(err);
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
