import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Link } from "react-router-dom";
import { Table, Tag } from "antd";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import API_URL from "../../config/api";
import { getCurrentUser } from "../../services/auth.service";
import {
  Button,
  InputBase,
  IconButton,
  ListItem,
  ListItemText,
  ListItemIcon,
  Divider,
  Box,
  Typography,
  CardContent,
  CardMedia,
  Card,
  Toolbar,
} from "@mui/material";

export default function Report_Exam() {
  const [exam, setExam, examRef] = useState([]);
  const [token] = useState(getCurrentUser());
  const [exam_data, setExam_data] = useState([]);
  const get_Exam = async () => {
    await API_URL.get(`api/reply/${token && token.user.id}/all`)
      .then( async(res) => {
        setExam(res.data);
        const data_table = examRef.current;
        let stu_length = 0;
        console.log(data_table);
        for (var j = 0; j < data_table.length; j++) {
          await API_URL.get(`api/student/${data_table[j].exam_id}`)
          .then((stu)=>{
              stu_length=stu.data.length;
          })
          Object.assign(
            data_table[j],
            { question_num: data_table[j].question.length },
            { check_num: data_table[j].replies.length },
            {stu_length:stu_length}
          );
        }
        setExam_data(data_table);
        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    get_Exam();
  }, [token]);

  const columns = [
    {
      title: <div className="header_table max-w-xs truncate">แบบทดสอบ</div>,
      dataIndex: "name",
      render: (name) => <p className="text-lg max-w-xs truncate">{name}</p>,
    },
    {
      title: <div className="header_table">จำนวนคำถาม</div>,
      dataIndex: "question_num",
      sorter: (a, b) => a.question_num - b.question_num,
      align: "center",
      render: (question_num) => (
        <div>
          <p className="text-base my-auto">{question_num}</p>
        </div>
      ),
    },
    {
      title: "จำนวนผู้เข้าสอบ",
      dataIndex: "stu_length",
      align: "center",
    },
   
    {
      title: "การจัดการ",
      dataIndex: "exam_id",
      key: "exam_id",
      render: (exam_id, index) => (
          <div>
        <Link key={index} to={`/${exam_id}/Report_Exam_one`}>
          <Button
            variant="outlined"
            color="success"

            startIcon={<ManageSearchIcon />}
            //   onClick={() => handleUpdate(exams.exam_id)}
          >
            ดูเพิ่มเติม
          </Button>
          </Link>
          <Button
            variant="outlined"
            color="error"
            className="mx-2"
            startIcon={<DeleteForeverIcon />}
            //   onClick={() => handleUpdate(exams.exam_id)}
          >
            ลบ
          </Button>
          </div>
      ),
    },
  ];
  return (
    <div className=" mx-3">
      <Table
        columns={columns}
        className="rounded-lg ml-10"
        dataSource={exam_data}
        rowKey="exam_id"
      />
    </div>
  );
}
