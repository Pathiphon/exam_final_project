import { TextField, Typography, InputLabel, Input } from "@mui/material";
import React, { useState, useContext } from "react";
import Button from "@mui/material/Button";
import ErrorMessage from "./ErrorMessage";

import { useNavigate } from "react-router-dom";

import Card from "@mui/material/Card";
import FormControl from "@mui/material/FormControl";

import { register } from "../services/auth.service";

const Register = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  const [name, setName] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const submitRegistration = async () => {
    try {
      const res = await register(name, email, password);
      if(res.status === 200){
        navigate("/Login");
      }else{
        alert(res.data)
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmationPassword && password.length > 5) {
      submitRegistration();
    } else {
      setErrorMessage("รหัสผ่านไม่ถูกต้องหรือต้องมากกว่า 8 ตัวอักษร");
    }
  };
  return (
    <div
      className="container w-100 p-4 mx-auto text-center"
      style={{ backgroundColor: "#ffffff", borderRadius: "10px" }}
    >
      <form
        onSubmit={handleSubmit}
        className="container mx-auto text-center w-100"
      >
        <Typography
          variant="h5"
          sx={{ mb: 2 }}
          component="div"
          style={{ color: "black" }}
        >
          สมัครสมาชิก
        </Typography>
        <FormControl
          sx={{ m: 1, width: "80%" }}
          className="container"
          variant="standard"
        >
          <InputLabel>ชื่อ - นามสกุล</InputLabel>
          <Input
            variant="standard"
            defaultValue={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </FormControl>
        <FormControl
          sx={{ m: 1, width: "80%" }}
          className="container"
          variant="standard"
        >
          <InputLabel>E-mail</InputLabel>
          <Input
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
          <InputLabel>ยืนยันรหัสผ่าน</InputLabel>
          <Input
            variant="standard"
            type="password"
            defaultValue={confirmationPassword}
            onChange={(e) => setConfirmationPassword(e.target.value)}
            required
          />
        </FormControl>
        <div>
          <ErrorMessage message={errorMessage} />
        </div>
        <FormControl
          sx={{ m: 3, width: "75%" }}
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
            ยืนยันการสมัคร
          </Button>
        </FormControl>
      </form>
    </div>
  );
};
export default Register;
