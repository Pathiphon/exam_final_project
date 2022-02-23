import React, { useState } from "react";
import {
  Typography,
  FormControl,
  Input,
  InputLabel,
  Button,
} from "@mui/material";
import Toast from "./Toast/Toast.js";
import API_URL from "../config/api";
import LockResetIcon from "@mui/icons-material/LockReset";
import { useParams,useNavigate } from "react-router-dom";

const ResetPassword = () => {
    const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [confirmationPassword, setConfirmationPassword] = useState("");
  

  const handleResetPass = async () => {
    await API_URL.put(`/resetpassword`, {
      resetLink: token,
      newPassword: confirmationPassword,
    })
      .then((res) => {
        Toast.fire({
            icon: "success",
            title: "รีเซ็ตรหัสผ่านแล้วทำการเข้าสู่ระบบใหม่",
          });
          navigate("/");
      })
      .catch((err) => {
        Toast.fire({
          icon: "error",
          title: "มีข้อผิดพลาดในการรีเซ็นรหัสผ่าน",
        });
        console.log(err);
      });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (password === confirmationPassword && password.length > 8 &&token.length!==0) {
      handleResetPass();
    } else {
      Toast.fire({
        icon: "error",
        title: "รหัสผ่านไม่ถูกต้องหรือต้องมากกว่า 8 ตัวอักษร",
      });
    }
  };

  return (
    <div className="w-50 p-4 bg-white rounded-lg mx-auto m-10">
      <form className="container mx-auto text-center" onSubmit={handleSubmit}>
        <LockResetIcon fontSize="large" className="my-2" />
        <Typography
          variant="h5"
          sx={{ mb: 2 }}
          component="div"
          style={{ color: "black" }}
        >
          รีเซ็ตรหัสผ่านของคุณ
        </Typography>
        <p>ป้อนรหัสผ่านใหม่</p>
        <FormControl
          sx={{ m: 1, width: "80%" }}
          className="container"
          variant="standard"
        >
          <InputLabel>รหัสผ่าน</InputLabel>
          <Input
            type="password"
            inputlabelprops={{
              shrink: true,
            }}
            variant="standard"
            focused="true"
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
            type="password"
            inputlabelprops={{
              shrink: true,
            }}
            variant="standard"
            focused="true"
            defaultValue={confirmationPassword}
            onChange={(e) => setConfirmationPassword(e.target.value)}
            required
          />
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
            รีเซ็ตรหัสผ่าน
          </Button>
        </FormControl>
      </form>
    </div>
  );
};
export default ResetPassword;
