import React from "react";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Toast from './Toast/Toast.js'

export default function ShareExam_Modal({active, handleModalExamForm, exam_id}) {
  let location_index = window.location.href
  const copytoClipboard=()=>{
    Toast.fire({
      icon: "info",
      title: "คัดลอกลิงค์ข้อสอบแล้ว",
    });
    navigator.clipboard.writeText(`${location_index}ExamForm/${exam_id}`)
  }
  return (
    <div className={`modal ml-24 ${active && "is-active"}`}>
      <div className="modal-background" onClick={handleModalExamForm}></div>
      <div className="modal-card">
        <header className="modal-card-head ">     
          <h1 className="modal-card-title has-text-centered text-left"> <GroupAddIcon className="mr-4"/>ส่งลิงค์ข้อสอบให้ผู้สอบ</h1>
          <button
            className="delete"
            aria-label="close"
            onClick={handleModalExamForm}
          ></button>
        </header>
        <section className="modal-card-body w-full">
          <div className="w-100 max-w-full">
            <div className="flex items-center border-b border-teal-500 py-2 w-100">
              <input
                className=" appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="url"
                value={`${location_index}ExamForm/${exam_id}`}
                disabled
                placeholder="LINK"
                aria-label="LINK"
              />
              <button
                className="flex-shrink-0 bg-orange-400 hover:bg-orange-700 border-orange-400 hover:border-orange-700 text-sm border-4 text-white py-1 px-2 rounded"
                type="button"
                onClick={copytoClipboard}
              >
                  <ContentCopyIcon className="mr-2"/>
                คัดลอก
              </button>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
