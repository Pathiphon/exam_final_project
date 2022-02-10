import React, { useEffect } from "react";
import useState from "react-usestateref";
import { Link } from "react-router-dom";
import { Table, Tag } from "antd";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
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

function Reply_Exam() {
  const [exam, setExam, examRef] = useState([]);
  const [token] = useState(getCurrentUser());
  const [exam_data, setExam_data] = useState([]);

  const get_Exam = async () => {
    await API_URL.get(`api/reply/${token && token.user.id}/all`)
      .then((res) => {
        setExam(res.data);
        const data_table = examRef.current;
        console.log(data_table);
        for (var j = 0; j < data_table.length; j++) {
          Object.assign(
            data_table[j],
            { question_num: data_table[j].question.length },
            { check_num: data_table[j].replies.length }
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
      title: <div className="header_table">แบบทดสอบ</div>,
      dataIndex: "name",
      render: (name) => <p className="text-lg ">{name}</p>,
    },
    {
      title: <div className="header_table">จำนวนคำถาม</div>,
      dataIndex: "question_num",
      sorter: (a, b) => a.question_num - b.question_num,
      align: "center",
      render: (question_num) => (
        <div >
          <p className="text-base my-auto">{question_num}</p>
        </div>
      ),
    },
    {
      title: "จำนวนผู้เข้าสอบ",
      dataIndex: "stu_num",
      align: "center",
    },
    {
      title: "จำนวนที่ต้องพิจารณา",
      dataIndex: "check_num",
      align: "center",
      sorter: (a, b) => a.check_num - b.check_num,
      render: (check_num) => (
        <Tag key={check_num} color="volcano">
          <p className="text-base my-auto">{check_num}</p>
        </Tag>
      ),
    },
    {
      title: "การจัดการ",
      dataIndex: "exam_id",
      key: "exam_id",
      render: (exam_id,index) => (
        <Link key={index} to={`/${exam_id}/Manage_Reply`}>
          <Button
            variant="outlined"
            color="success"
            size="large"
            startIcon={<ManageSearchIcon />}
            //   onClick={() => handleUpdate(exams.exam_id)}
          >
            ตรวจ
          </Button>
        </Link>
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

export default Reply_Exam;
