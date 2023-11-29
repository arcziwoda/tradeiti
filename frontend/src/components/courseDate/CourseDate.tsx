import { useEffect } from "react";
import { CourseDateData } from "../../models/CourseDate";
import "./CourseDate.scss";
import { useFormContext } from "react-hook-form";

interface CourseDateProps {
  date: CourseDateData;
  handleChooseDate?: (date: CourseDateData, hourType: string) => void;
  hourType?: string;
}

export function CourseDateComponent({
  date,
  handleChooseDate = () => {},
  hourType = "",
}: CourseDateProps) {
  const { watch } = useFormContext();
  const choosenHour: CourseDateData = watch(hourType);

  const getAllElementsByClassName = (className: string) => {
    return document.querySelectorAll(`.${className}`);
  };

  const handleChange = () => {
    handleChooseDate(date, hourType);
  };

  const handleSpanClick = (event: React.MouseEvent<HTMLSpanElement>) => {
    if (
      event.currentTarget &&
      event.currentTarget.classList.contains("unavailable")
    ) {
      return;
    }
    const radioInput = event.currentTarget.querySelector('input[type="radio"]');
    const spans = getAllElementsByClassName(event.currentTarget.classList[1]);
    if (radioInput) {
      (radioInput as HTMLElement).click(); // Trigger a click on the radio input
      for (let i = 0; i < spans.length; i++) {
        (spans[i] as HTMLElement).style.borderRadius = "0px";
        if (
          spans[i] == event.currentTarget &&
          event.currentTarget.classList.contains("myHour")
        ) {
          const oppSpans = getAllElementsByClassName("opponentHour");
          for (let o = 0; o < oppSpans.length; o++) {
            const oppenentSpan = oppSpans[o] as HTMLElement;
            const spanFirstChild = oppenentSpan.firstChild as HTMLInputElement;
            if (oppenentSpan.classList.contains("unavailable")) {
              oppenentSpan.classList.remove("unavailable");
              spanFirstChild.disabled = false;
            }
          }
          const op2Span = oppSpans[i] as HTMLElement;
          const op2SpanFirstChild = op2Span.firstChild as HTMLInputElement;
          op2Span.classList.add("unavailable");
          op2Span.style.borderRadius = "0px";
          op2SpanFirstChild.disabled = true;
          op2SpanFirstChild.checked = false;
        }
      }
      event.currentTarget.style.borderRadius = "15px";
      handleChooseDate(date, hourType);
    }
  };

  useEffect(() => {
    if (
      choosenHour &&
      choosenHour.course_day === date.course_day &&
      choosenHour.course_time === date.course_time &&
      choosenHour.lecturer === date.lecturer
    ) {
      const span = document.getElementById(
        `radioSpan/${hourType}/${date.course_day}/${date.course_time}`
      ) as HTMLElement;
      span.click();
    }
  }, []);

  return (
    <span
      id={`radioSpan/${hourType}/${date.course_day}/${date.course_time}`}
      className={`radioSpan ${hourType}`}
      onClick={handleSpanClick}
    >
      <div className="radioSpan-date">
        <input type="radio" name={`hours/${hourType}`} onClick={handleChange} />{" "}
        <div>
          {date.course_day} - {date.course_time}
        </div>
      </div>
      <div>{date.lecturer}</div>
    </span>
  );
}
