import React,{useEffect} from 'react'
import useState from "react-usestateref";
import { Table,Tag } from 'antd';
import { useParams, useNavigate,Link } from "react-router-dom";
import { CssBaseline, Toolbar, Button, Divider } from "@mui/material";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import API_URL from "../../config/api";

const Manage_Reply_one = ()=> {
    const { ques_id,exam_id } = useParams();
    const [exam_data,setExam_data] = useState();
    const [exam, setExam,examRef] = useState();

    let navigate = useNavigate();

  function handleClick_Back() {
    navigate(`/${exam_id}/Manage_Reply`);
    window.location.reload();
  }

  const get_Exam = async () => {
    await API_URL.get(`api/reply/${exam_id}/question/${ques_id}`)
      .then((res) => {
        setExam(res.data);
        setExam_data(examRef.current.question[0].student);
        console.log(examRef.current.question[0].student);
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
      title:<div >ชื่อ - นามสกุล</div> ,
      dataIndex: ['name'],
        key:'name',
    },
    {
      title:<div >คำตอบ</div> ,
      dataIndex: ['reply','stu_code'],
      key:'stu_code',
      render:stu_code=>(
        <div><p className="text-base my-auto">{stu_code}</p></div>
      )
    },
    {
        title:"สถานะ",
        dataIndex:['reply','check_status'],
        render:check_status=>(
            <>
            {check_status.map(check=>{
                let color = "";
                if(check === true){
                    color = 'text-green'
                }else{
                    color = "text-red"
                }
                return(
                    <p className={color}>ตรวจแล้ว</p>
                )
            })}
            </>
        )
    }
    // {
    //   title:"ความถูกต้อง",
    //   dataIndex:'check_num',
    //   align: 'center',
    //   sorter: (a, b) => a.check_num - b.check_num,
    //   render: check_num =>(
    //         <Tag color='volcano'><p className="text-base my-auto">{check_num}</p></Tag>
    //   )
    // },
    // {
    //   title:"คะแนน",
    //   dataIndex:"score_stu",
    // },
    // {
    //     title:"สถานะ",
    //     dataIndex:"check_status",
    // }

  ];


  return (
    <div>
         <CssBaseline />
      <div className="shadow-zinc-500 flex justify-between items-center" style={{ background: "white" }}>
          <div>
        <Toolbar>
          <Button
            variant="outlined"
            size="large"
            startIcon={<ArrowBackIosIcon />}
            style={{ fontSize: "18px" }}
            onClick={handleClick_Back}
          >
            {" "}
            พิจารณาข้อสอบ
          </Button>
        </Toolbar>
        </div>
        <div className='items-center text-center bg-gray-500 text-white p-3 mx-2 rounded-md'>
            <p className='text-lg my-auto'>คะแนนเต็ม {exam?exam.question[0].full_score:''} คะแนน </p>
        </div>
      </div>
      <div className='bg-gray-600 px-20 py-16'>
        <p className='text-2xl mx-10 px-20 text-white'>
        คำถาม : {exam?exam.question[0].question:''}
        </p>
      </div>
      <div className="w-4/5 mx-auto ">
      <Table columns={columns} className="rounded-lg" dataSource={exam_data} />
      </div>
    </div>
  )
}
export default Manage_Reply_one;
