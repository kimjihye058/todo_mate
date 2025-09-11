import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { css } from "@emotion/react";
import type { FC } from "react";
import { useMemo } from "react";
import dayjs from "dayjs";
import { atom, useAtom } from "jotai";

interface ICalendarProps {
  selectDate: dayjs.Dayjs;
  setSelectDate: (date: dayjs.Dayjs) => void;
}

const viewDateAtom = atom(dayjs());

export const Calendar: FC<ICalendarProps> = ({ selectDate, setSelectDate }) => {
  const [viewDate, setViewDate] = useAtom(viewDateAtom);

  const weekDays = useMemo(
    () => ["일", "월", "화", "수", "목", "금", "토"],
    []
  );

  // 달력 날짜 생성하는 함수
  const generateCalendarDates = useMemo(() => {
    const startOfMonth = viewDate.startOf("month");
    const endOfMonth = viewDate.endOf("month");
    const startDate = startOfMonth.startOf("week");
    const endDate = endOfMonth.endOf("week");

    const dates = [];
    let currentDate = startDate;

    while (
      currentDate.isBefore(endDate) ||
      currentDate.isSame(endDate, "day")
    ) {
      dates.push(currentDate);
      currentDate = currentDate.add(1, "day");
    }

    return dates;
  }, [viewDate]);

  const changeMonth = (changeString: string) => {
    switch (changeString) {
      case "add":
        return setViewDate(viewDate.add(1, "month"));
      case "subtract":
        return setViewDate(viewDate.subtract(1, "month"));
      case "today":
        return setViewDate(dayjs());
      default:
        return viewDate;
    }
  };

  const today = dayjs();

  return (
    <div
      css={css`
        margin-top: 16px;
        transform: translate3d(-14px, 0px, 0px);
        width: calc(100% + 28px);
      `}
    >
      <div
        css={css`
          font-size: 14px;
          font-weight: 700;
          display: flex;
          justify-content: space-between;
          margin: auto 14px 10px;
        `}
      >
        <div
          css={css`
            display: flex;
            justify-content: center;
            gap: 10px;
          `}
        >
          <p>{viewDate.format("YYYY년 M월")}</p>
          <img
            src="./images/calendar/calendarVictoryIcon.svg"
            alt="완료한 개수"
          />
          <p></p>
        </div>

        <div>
          <button
            css={css`
              width: 26px;
              margin-left: 8px;
              cursor: pointer;
              background-color: white;
              border: none;
            `}
            onClick={() => changeMonth("subtract")}
          >
            <IconChevronLeft stroke={2} />
          </button>
          <button
            css={css`
              width: 26px;
              margin-left: 8px;
              cursor: pointer;
              background-color: white;
              border: none;
            `}
            onClick={() => changeMonth("add")}
          >
            <IconChevronRight stroke={2} />
          </button>
        </div>
      </div>

      <div
        css={css`
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          text-align: center;
          font-size: 10px;
          margin: 4px auto;
          padding: 0 14px;
        `}
      >
        {weekDays.map((day) => (
          <div key={day}>{day}</div>
        ))}
      </div>

      <div
        css={css`
          display: grid;
          grid-template-columns: repeat(7, 1fr);
          padding: 0 14px;
        `}
      >
        {generateCalendarDates.map((date) => {
          const isToday = date.isSame(today, "day");
          const isCurrentMonth = date.isSame(viewDate, "month");
          const isSelected = date.isSame(selectDate, "day");

          return (
            <div
              key={date.format("YYYY-MM-DD")}
              css={css`
                width: 21px;
                height: 35px;
                margin: 8px auto;
                display: flex;
                flex-direction: column;
                text-align: center;
                cursor: pointer;
              `}
              onClick={() => setSelectDate(date)}
            >
              <p
                css={css`
                  color: ${
                    isSelected
                      ? "white"
                      : isToday
                      ? "black"
                      : !isCurrentMonth
                      ? "#DADDE1"
                      : "black"
                  };
                  background-color: ${
                    isSelected
                      ? "black"
                      : isToday
                      ? "#DADDE1"
                      : "transparent"
                  };
                  border-radius: ${isSelected || isToday ? "50%" : "0"};
                  width: 20px;
                `}
              >
                {date.date()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
