import { useEffect, useState } from "react";
import { intervalToDuration, isBefore } from "date-fns";
import Swal from "sweetalert2";

export const useTicker = ( futureDate,warning_time) => {
  const [now, setNow] = useState(new Date());
  const isTimeUp = isBefore(futureDate, now);

  useEffect(() => {
    const interval = setInterval(() => {
      setNow(new Date());
    }, 1000);
    return () => {
      clearInterval(interval);
    };
    
  }, [futureDate]);
  if (isTimeUp) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0, isTimeUp };
  }

  let { days, hours, minutes, seconds } = intervalToDuration({
    start: now,
    end: futureDate,
  });
  // console.log((days*1440)+(hours*60)+(minutes*60)+seconds);
  // console.log(warning_time)
  if((days*1440)+(hours*60)+(minutes*60)+seconds===warning_time*60){
    const Toast = Swal.mixin({
      toast: true,
      position: 'bottom-end',
      showConfirmButton: false,
      timer: 5000,
      timerProgressBar: true,
      didOpen: (toast) => {
        toast.addEventListener('mouseenter', Swal.stopTimer)
        toast.addEventListener('mouseleave', Swal.resumeTimer)
      }
    })
    Toast.fire({
      icon: "warning",
      title: `เหลือเวลาสอบอีก ${warning_time} นาที`,
    });
  }
  return {
    
    days,
    hours,
    minutes,
    seconds,
    isTimeUp,
  };
};
