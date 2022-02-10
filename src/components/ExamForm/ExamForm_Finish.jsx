import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AssignmentIcon from "@mui/icons-material/Assignment";
import {
  AppBar,
  Toolbar,
  Typography,
  CssBaseline,
  Divider,
  TextareaAutosize,
  Box,
  Container,
} from "@mui/material";

export default function ExamForm_Finish() {
  const [exam_name, setExam_name] = useState(null);
  const location = useLocation();
  let navigate = useNavigate();
  const handleClick = () => {
    navigate(-1);
    
  };
  useEffect(() => {
    if (location.state !== null) {
      setExam_name(location.state.name);
    }
  }, []);
  return (
    <>
      <CssBaseline />

      <AppBar
        style={{ background: "#2E303B" }}
        sx={{ p: 1, justifyContent: "center" }}
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center">
            <AssignmentIcon className="mr-2" />
            <Typography variant="h6" className="text-white">ฟอร์มสอบ</Typography>
          </div>
        </div>
      </AppBar>
      <Toolbar />
      <Container maxWidth="md" className="mt-10 sx:mt-0">
        <Box sx={{ my: 2 }}>
            {exam_name?(
          <div className="bg-gray-200 px-8 py-3  rounded-xl mt-4">
            <p className="text-3xl m-4">{exam_name}</p>
            <p className="text-2xl m-3">
              ส่งคำตอบของคุณเรียบร้อยแล้ว............................
            </p>
            <button
              className="bg-zinc-800 hover:bg-zinc-600 text-white font-bold py-3 px-8 rounded-lg m-4 focus:outline-none focus:shadow-outline"
              onClick={handleClick}
            >
              ส่งคำตอบเพิ่มเติม
            </button>
          </div>
          ):(
            <div className="bg-gray-200 px-8 py-3  rounded-xl mt-4">
            <p className="text-2xl m-3">
              หมดเวลาสอบแล้ว............................
            </p>
            
          </div>
          )}
        </Box>
      </Container>
    </>
  );
}
