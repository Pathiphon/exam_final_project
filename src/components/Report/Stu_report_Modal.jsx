import React, { useEffect } from "react";
import useState from "react-usestateref";
import Toast from "../Toast/Toast.js";
import { Checkbox, FormGroup, FormControlLabel, Button } from "@mui/material";
import API_URL from "../../config/api";

export default function Stu_report_Modal({
  active,
  handleModalReport,
  exam_id,
  stu_code,
}) {
    const [students,setStudents] = useState([]);
    

  return(
    <div className={`modal ${active && "is-active"}`}>
    <div className="modal-background" onClick={handleModalReport}></div>
    <div className="modal-card w-5/6">
      <header className="modal-card-head text-left justify-between">
        <p className=" text-lg my-auto ">
         
        </p>
        <button
          className="delete"
          aria-label="close"
          onClick={handleModalReport}
        ></button>
      </header>
      <section className="modal-card-body">
        
      </section>

      <footer className="modal-card-foot justify-end ">
        
      </footer>
    </div>
  </div>
  );
}
