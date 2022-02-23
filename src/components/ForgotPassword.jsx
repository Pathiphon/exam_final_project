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
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import { Link } from "react-router-dom";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState(false);

  const handleForgotPass = async (e) => {
    e.preventDefault();
    await API_URL.put(`/forgot-password`, {
      email: email,
    })
      .then((res) => {
        setStatus(true);
        return res.data;
      })
      .catch((err) => {
        Toast.fire({
          icon: "error",
          title: "ไม่มีอีเมลนี้ในระบบ",
        });
        console.log(err);
      });
  };

  return (
    <div className="w-100 p-4 bg-white rounded-lg">
      {status === false ? (
        <form
          className="container mx-auto text-center"
          onSubmit={handleForgotPass}
        >
          <LockResetIcon fontSize="large" className="my-2" />
          <Typography
            variant="h5"
            sx={{ mb: 2 }}
            component="div"
            style={{ color: "black" }}
          >
            ลืมรหัสผ่าน?
          </Typography>
          <p>ป้อนอีเมลเพื่อทำการรีเซ็ตรหัสผ่าน</p>
          <FormControl
            sx={{ m: 1, width: "80%" }}
            className="container"
            variant="standard"
          >
            <InputLabel>E-mail</InputLabel>
            <Input
              type="email"
              inputlabelprops={{
                shrink: true,
              }}
              variant="standard"
              focused="true"
              defaultValue={email}
              onChange={(e) => setEmail(e.target.value)}
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
              ส่งไปยังอีเมล
            </Button>
          </FormControl>
        </form>
      ) : (
        <>
          <p className="text-lg text-center py-8">
            เช็คอีเมลของคุณเพื่อทำการรีเซ็ตรหัสผ่าน
          </p>
          <div className="mt-2 w-80 text-left mx-auto underline">
            <Link to="./">
              <ArrowBackIosIcon /> กลับไปยังหน้าหลัก
            </Link>
          </div>
        </>
      )}
    </div>
  );
};
export default ForgotPassword;
