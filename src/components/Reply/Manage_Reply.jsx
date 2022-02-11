import React,{useEffect} from "react";
import useState from "react-usestateref";
import { Table,Tag } from 'antd';
import { useParams, useNavigate,Link } from "react-router-dom";
import { CssBaseline, Toolbar, Button, Divider } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import EditIcon from "@mui/icons-material/Edit";
import ManageSearchIcon from "@mui/icons-material/ManageSearch";
import API_URL from "../../config/api";


const Manage_Reply = () => {
  const { exam_id } = useParams();
  const [exam, setExam,examRef] = useState([]);
  const [exam_data,setExam_data] = useState([]);
  const [count_false,setCount_false] = useState([]);
  const [count_exam,setCount_exam] = useState([])
  
  let navigate = useNavigate();

  function handleClick_Back() {
    navigate("/Reply");
  }

  const get_Exam = async () => {
    await API_URL.get(`api/reply/${exam_id}`)
      .then((res) => {
        setExam(res.data);
        console.log(examRef.current);
        // for (var j =0;j<data_table.length;j++){
        //   Object.assign(
        //     data_table[j],
        //     {question_num:data_table[j].question.length},
        //     {check_num:data_table[j].replies.length}
        //   )
        // }
        setExam_data(examRef.current.question);
        setCount_false(examRef.current.replies.length);
        setCount_exam(examRef.current.question.length);

        return res.data;
      })
      .catch((err) => {
        console.log(err);
      });
      
      
  };

  useEffect(() => {
    get_Exam();

  }, []);

  const columns = [
    {
      title:<div className="header_table">ข้อที่</div> ,
      dataIndex: 'question',
      render:(question,index)=>(<p className="text-base "  > {question}</p>)
      // render:(question)=>(<p className="text-lg " > {question}</p>)
    },
    // },
    {
      title:<div className="header_table">จำนวนคนที่ตรวจแล้ว</div> ,
      dataIndex: 'check_status_true',
      sorter: (a, b) => a.check_status_true - b.check_status_true,
      align: 'center',
      render:check_status_true=>(
        <div><p className="text-base my-auto">{check_status_true}</p></div>
      )
    },
    {
      title:"จำนวนที่ต้องพิจารณา",
      dataIndex:'check_num',
      align: 'center',
      sorter: (a, b) => a.check_num - b.check_num,
      render: check_num =>(
            <Tag color='volcano'><p className="text-base my-auto">{check_num}</p></Tag>
      )
    },
    {
      title:"การจัดการ",
      dataIndex:"ques_id",
      key:'ques_id',
      render:ques_id =>
      <Link  to={`/${exam_id}/Manage_Reply/${ques_id}`}>
      <Button
      variant="outlined"
      color="success"
      size="large"
      startIcon={<ManageSearchIcon />}
    >
      ดูเพิ่มเติม
    </Button>
    </Link>
    }
  ];

  return (
    <div className="">
      <CssBaseline />
      <div className="shadow-md" style={{ background: "white" }}>
        <Toolbar>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBackIosIcon />}
            style={{ fontSize: "18px" }}
            onClick={handleClick_Back}
          >
            {" "}
            ตรวจข้อสอบ
          </Button>
        </Toolbar>
      </div>
      <div className="w-4/5 mx-auto shadow-md   bg-white rounded-xl">
        <div className="md:flex  items-center justify-between my-3 w-100 rounded-lg px-5 py-3">
          <div className="flex-col items-center w-full md:w-3/6 justify-center text-center">
            <p className="w-full text-xl">{exam.name} </p>
            <Button
              variant="outlined"
              color="warning"
              startIcon={<EditIcon />}
              //   onClick={() => setActiveModal(true)}
            >
              แก้ไขข้อสอบ
            </Button>
          </div>
          <div className="md:flex  w-full md:w-3/6 justify-end">
            <div className="flex-col mx-2 bg-gray-50 rounded-xl p-3 text-center">
              <p className="text-md">จำนวนที่ต้องพิจารณา</p>
              <p>{count_false}</p>
            </div>
            <div className="flex-col mx-2 bg-gray-50 rounded-xl px-5 py-3 text-center">
              <p className="text-md">คำถาม</p>
              <p>{count_exam}</p>
            </div>
            <div className="flex-col mx-2 bg-gray-50 rounded-xl py-3 px-5 text-center">
              <p className="text-md">ผู้เข้าสอบ</p>
              <p>1</p>
            </div>
          </div>
        </div>
      </div>
      <Divider
        className="mx-auto"
        sx={{
          my: 2,
          width: "88%",
          borderBottomWidth: 3,
          backgroundColor: "#000000",
        }}
      />
      <div className="w-4/5 mx-auto">
        <p className="text-xl">คำถามทั้งหมด</p>
        <Table columns={columns} className="rounded-lg" dataSource={exam_data} rowKey="ques_id"/>
      </div>
    </div>
  );
};
export default Manage_Reply;
