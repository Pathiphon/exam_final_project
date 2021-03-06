import React, { useEffect, useState } from "react";
import Manage_exam_full from "../img/manage_exam_full.png";
import { useNavigate, useLocation } from "react-router-dom";
import ExamModal from "./ExamModal";
import dayjs from "dayjs";
import Table_Ques from "./Table_Ques";
import {
  Box,
  Card,
  CardContent,
  CssBaseline,
  CardMedia,
  Toolbar,
  Typography,
  Button,
  Divider,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import API_URL from "../config/api";

export default function Create_exam() {
  const [activeModalQ, setActiveModalQ] = useState(false);
  const [name, setName] = useState("");
  const [date_pre, setDate_pre] = useState("");
  const [date_post, setDate_post] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const [id, setId] = useState(null);
  const location = useLocation();
  const [activeModal, setActiveModal] = useState(location.state?false:true);

  let navigate = useNavigate();

  const handleModal = () => {
    setActiveModal(!activeModal);
    get_Exam();
  };

  const Id_toperent = (id) => {
    setId(id);
  };

  function handleClick() {
    navigate(-1);
  }
  useEffect(() => {
    get_Exam();
    if (location.state !== null) {
      setId(location.state.id);
    }
  }, [id,handleModal]);

  const get_Exam = async () => {
    await API_URL.get(`api/exam/${id}`)
      .then((res) => {
        const data = res.data;
        setName(data.name);
        setDate_pre(dayjs(data.date_pre).format("DD/MM/YYYY HH:mm"));
        setDate_post(dayjs(data.date_post).format("DD/MM/YYYY HH:mm"));
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const get_modal_create_exam = () => {
    setActiveModalQ(!activeModalQ);
  };

  return (
    <Box className="w-full">
      <ExamModal
        active={activeModal}
        handleModal={handleModal}
        id={id}
        Id_toperent={Id_toperent}
        setErrorMessage={setErrorMessage}
      />
      <Box>
        <CssBaseline />
        <div className="shadow-md" style={{ background: "white" }}>
          <Toolbar>
            <Button
              variant="outlined"
              className="shadow-md"
              size="large"
              startIcon={<ArrowBackIosIcon />}
              style={{ fontSize: "18px" }}
              onClick={handleClick}
            >
              {" "}
              ????????????????????????????????????
            </Button>
          </Toolbar>
        </div>
      </Box>
      <Box className="container" sx={{ flexGrow: 1, p: 2 }}>
        <Card sx={{ display: "flex", borderRadius: 5 }}>
          <CardMedia
            component="img"
            sx={{ width: 150, padding: 1, borderRadius: 5 }}
            src={Manage_exam_full}
          />
          <Box sx={{ display: "flex", flexDirection: "column" }} flexGrow={1}>
            <CardContent sx={{ flex: "1 0 auto" }}>
              <Typography
                component="div"
                sx={{ display: "flex" }}
                variant="h6"
                className="mb-5"
              >
                ??????????????????????????? : {id ? name : <h6>-</h6>}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ display: "flex" }}
                component="div"
              >
                ?????????/???????????????????????????????????? :{" "}
                {id ? <>{date_pre}</> : <Typography>-</Typography>}
              </Typography>
              <Typography
                variant="subtitle1"
                color="text.secondary"
                sx={{ display: "flex" }}
                component="div"
              >
                ?????????/????????????????????????????????? :{" "}
                {id ? <>{date_post}</> : <Typography>-</Typography>}
              </Typography>
            </CardContent>
          </Box>
          <Box
            sx={{ p: 2, flexDirection: "column" }}
            display="flex"
            alignItems="flex-end"
            flexGrow={0}
          >
            <Button
              variant="outlined"
              color="warning"
              className="is-fullwidth shadow-md" 
              startIcon={<EditIcon />}
              onClick={() => setActiveModal(true)}
            >
              ???????????????
            </Button>
          </Box>
        </Card>
      </Box>
      <Box className="container">
        <Divider variant="middle" />

        <Table_Ques
          exam_id={id}
          get_modal_create_exam={get_modal_create_exam}
        />
      </Box>
    </Box>
  );
}
