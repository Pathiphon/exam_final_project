import React from "react";
import GroupAddIcon from '@mui/icons-material/GroupAdd';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

export default function ShareExam_Modal({active, handleModalExamForm, ques_id}) {
  return (
    <div className={`modal ${active && "is-active"}`}>
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
          <div className="w-100 max-w-sm">
            <div className="flex items-center border-b border-teal-500 py-2 w-100">
              <input
                className=" appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                type="url"
                value="/id/question"
                disabled
                placeholder="LINK"
                aria-label="LINK"
              />
              <button
                className="flex-shrink-0 bg-sky-700 hover:bg-sky-800 border-sky-700 hover:border-sky-800 text-sm border-4 text-white py-1 px-2 rounded"
                type="button"
                onClick={() => {navigator.clipboard.writeText("/id/question")}}
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
