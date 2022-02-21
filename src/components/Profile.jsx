import React, { useState } from "react";
import { Box, Toolbar, Divider } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LockIcon from '@mui/icons-material/Lock';
import { getCurrentUser } from "../services/auth.service";
import API_URL from "../config/api";

export default function Profile() {
  const [token] = useState(getCurrentUser());
  const [username,setUsername] = useState(token.user?token.user.username:'');

  return (
    <div className="container w-100  ">
      <Box component="main">
        <form className=" mx-10 px-10 py-5 bg-white rounded-lg shadow-md">
          <div className="flex items-center my-2">
            <AccountCircleIcon sx={{ width: 40, height: 40, mr: 3 }} />
            <p className="text-xl">บัญชี</p>
          </div>
          <Divider
            sx={{ my: 2, borderBottomWidth: 3, backgroundColor: "#000000" }}
          />
          <div className="flex flex-wrap -mx-3 my-3">
            <div className="w-full  px-3 ">
              <label className="block uppercase tracking-wide text-gray-700 text-xl mb-1 ml-2">
                ชื่อ - นามสกุล
              </label>
              <input
                className="bg-white appearance-none border-1  text-lg border-gray-300 rounded-lg w-100  py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-600"
                placeholder="ชื่อ - นามสกุล"
                value={token.user?token.user.username:''}
              />
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 my-4">
            <div className="w-full  px-3 ">
              <label className="block uppercase tracking-wide text-gray-700 text-xl mb-1 ml-2">
                E-mail
              </label>
              <input
                className="bg-slate-100 appearance-none border-1  text-lg border-gray-300 rounded-lg w-100  py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-600"
                placeholder="email"
                disabled
                value={token.user?token.user.email:''}
              />
            </div>
          </div>

          <div className="flex items-center justify-around mt-4">
                  <button
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-20 rounded-lg focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    บันทึกการเปลี่ยนแปลง
                  </button>
                </div>
        </form>
        {/* <form className=" mx-10 px-10 py-5 bg-white rounded-lg shadow-md">
          <div className="flex items-center my-2">
            <LockIcon sx={{ width: 40, height: 40, mr: 3 }} />
            <p className="text-xl">เปลี่ยนรหัสผ่าน</p>
          </div>
          <Divider
            sx={{ my: 2, borderBottomWidth: 3, backgroundColor: "#000000" }}
          />
          <div className="flex flex-wrap -mx-3 my-3">
            <div className="w-full  px-3 ">
              <label className="block uppercase tracking-wide text-gray-700 text-xl mb-1 ml-2">
                รหัสผ่านใหม่ (อย่างน้อย 6 ตัวอักษร)
              </label>
              <input
                className="bg-white appearance-none border-2  text-lg border-gray-300 rounded-lg w-100  py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-600"
                placeholder="รหัสผ่านใหม่"
          
              />
            </div>
          </div>

          <div className="flex flex-wrap -mx-3 my-3">
            <div className="w-full  px-3 ">
              <label className="block uppercase tracking-wide text-gray-700 text-xl mb-1 ml-2">
              ป้อนรหัสผ่านใหม่อีกครั้ง
              </label>
              <input
                className="bg-white appearance-none border-2  text-lg border-gray-300 rounded-lg w-100  py-3 px-4 text-gray-700 leading-tight focus:outline-none focus:bg-white focus:border-gray-600"
                placeholder="ใส่รหัสผ่านอีกครั้ง"
          
              />
            </div>
          </div>

          <div className="flex items-center justify-around mt-4">
                  <button
                    className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3 px-20 rounded-lg focus:outline-none focus:shadow-outline"
                    type="submit"
                  >
                    เปลี่ยนรหัสผ่าน
                  </button>
                </div>
        </form> */}
      </Box>
    </div>
  );
}
