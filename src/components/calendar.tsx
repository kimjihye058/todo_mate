import { css } from "@emotion/react";
import type { FC } from "react";
import { useMemo } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { atom, useAtom } from "jotai";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(weekday);

export const selectDateAtom = atom(dayjs());
const viewDateAtom = atom(dayjs());

export const Calendar: FC = () => {
  const [selectDate, setSelectDate] = useAtom(selectDateAtom);

  const [viewDate, setViewDate] = useAtom(viewDateAtom);

  const startWeek = viewDate.startOf("month").week();
  const endWeek =
    viewDate.endOf("month").week() === 1 ? 53 : viewDate.endOf("month").week();

  const weekDays = useMemo(
    () => ["일", "월", "화", "수", "목", "금", "토"],
    []
  );

  const changeMonth = (type: "add" | "subtract" | "today") => {
    if (type === "add") {
      setViewDate((prev) => prev.add(1, "month"));
    } else if (type === "subtract") {
      setViewDate((prev) => prev.subtract(1, "month"));
    } else {
      setViewDate(dayjs());
    }
  };

  const fmt = (d: dayjs.Dayjs) => d.format("YYYY-MM-DD");
  const fmtMonth = (d: dayjs.Dayjs) => d.format("MM");

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

      {/* 요일 header */}
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
        {weekDays.map((day, i) => (
          <div
            key={i}
            css={css`
              color: ${i === 0 ? "#EC5E58" : i === 6 ? "#2F7CF6" : "black"};
            `}
          >
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 */}
      <div
        css={css`
          padding: 0 14px;
        `}
      >
        {Array.from(
          { length: endWeek - startWeek + 1 },
          (_, idx) => startWeek + idx
        ).map((week) => (
          <div
            key={week}
            css={css`
              display: grid;
              grid-template-columns: repeat(7, 1fr);
              text-align: center;
              margin-bottom: 6px;
            `}
          >
            {Array.from({ length: 7 }, (_, i) => {
              const current = viewDate.week(week).startOf("week").add(i, "day");

              const isSelected = fmt(selectDate) === fmt(current);
              const isToday = fmt(dayjs()) === fmt(current);
              const isOtherMonth = fmtMonth(current) !== fmtMonth(viewDate);

              // 다른 달일 때 비우기
              if (isOtherMonth) {
                return (
                  <div
                    key={`${week}_${i}`}
                    css={css`
                      height: 30px;
                    `}
                  />
                );
              }

              return (
                <div key={`${week}_${i}`}>
                  <div
                    css={css`
                      color: ${i === 0
                        ? "#EC5E58"
                        : i === 6
                        ? "#2F7CF6"
                        : "black"};
                      padding: 6px 0;
                    `}
                  >
                    <div
                      onClick={() => setSelectDate(current)}
                      css={css`
                        display: inline-flex;
                        justify-content: center;
                        align-items: center;
                        width: 30px;
                        height: 30px;
                        margin: 0 auto;
                        border-radius: 50%;
                        cursor: pointer;
                        ${isOtherMonth ? "opacity: 0.35;" : ""}
                        ${isSelected
                          ? "background: black; color: white; font-weight: 700;"
                          : ""}
                          ${!isSelected && isToday
                          ? "background: #DADDE1; color: black; font-weight: 700;"
                          : ""}
                      `}
                    >
                      {current.format("D")}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Calendar;
