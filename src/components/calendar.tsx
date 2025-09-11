import { css } from "@emotion/react";
import type { FC } from "react";
import { useMemo } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { atom, useAtom, useAtomValue } from "jotai";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { achievedThisMonthAtom, unachievedByDateAtom } from "./todoAtom";

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

  const achievedThisMonth = useAtomValue(achievedThisMonthAtom);
  const unachievedByDate = useAtomValue(unachievedByDateAtom);

  return (
    <div css={styles.container}>
      <div css={styles.header}>
        <div css={styles.headerLeft}>
          <p>{viewDate.format("YYYY년 M월")}</p>
          <img
            src="./images/calendar/calendarVictoryIcon.svg"
            alt="완료한 개수"
          />
          <p>{achievedThisMonth}</p>
        </div>

        <div>
          <button
            css={styles.navigationButton}
            onClick={() => changeMonth("subtract")}
          >
            <IconChevronLeft stroke={2} />
          </button>
          <button
            css={styles.navigationButton}
            onClick={() => changeMonth("add")}
          >
            <IconChevronRight stroke={2} />
          </button>
        </div>
      </div>

      {/* 요일 header */}
      <div css={styles.weekDaysGrid}>
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
      <div css={styles.datesContainer}>
        {Array.from(
          { length: endWeek - startWeek + 1 },
          (_, idx) => startWeek + idx
        ).map((week) => (
          <div key={week} css={styles.weekGrid}>
            {Array.from({ length: 7 }, (_, i) => {
              const current = viewDate.week(week).startOf("week").add(i, "day");

              const isSelected = fmt(selectDate) === fmt(current);
              const isToday = fmt(dayjs()) === fmt(current);
              const isOtherMonth = fmtMonth(current) !== fmtMonth(viewDate);

              // 다른 달일 때 비우기
              if (isOtherMonth) {
                return <div key={`${week}_${i}`} css={styles.emptyDateCell} />;
              }

              return (
                <button
                  key={`${week}_${i}`}
                  css={styles.dateBtn}
                  onClick={() => setSelectDate(current)}
                >
                  <div
                    css={[
                      styles.dateCell,
                      {
                        color:
                          i === 0 ? "#EC5E58" : i === 6 ? "#2F7CF6" : "black",
                      },
                    ]}
                  >
                    <div css={styles.dateIconContainer}>
                      <span css={styles.unachievedCount}>
                        {unachievedByDate[fmt(current)] || ""}
                      </span>
                      <svg css={styles.dateSvg}>
                        <circle
                          cx={6.46154}
                          cy={6.46154}
                          r={6.46154}
                          fill="rgb(219, 221, 223)"
                          fillOpacity={1}
                        />
                        <circle
                          cx={6.46154}
                          cy={14.5387}
                          r={6.46154}
                          fill="rgb(219, 221, 223)"
                          fillOpacity={1}
                        />
                        <circle
                          cx={14.5387}
                          cy={14.5387}
                          r={6.46154}
                          fill="rgb(219, 221, 223)"
                          fillOpacity={1}
                        />
                        <circle
                          cx={14.5387}
                          cy={6.46154}
                          r={6.46154}
                          fill="rgb(219, 221, 223)"
                          fillOpacity={1}
                        />
                      </svg>
                    </div>
                    <div
                      css={[
                        styles.dateDiv,
                        {
                          opacity: isOtherMonth ? 0.35 : 1,
                          ...(isSelected
                            ? {
                                background: "black",
                                color:
                                  i === 0
                                    ? "#EC5E58"
                                    : i === 6
                                    ? "#2F7CF6"
                                    : "white",
                                fontWeight: 700,
                              }
                            : isToday
                            ? {
                                background: "#DADDE1",
                                color: "black",
                                fontWeight: 700,
                              }
                            : {}),
                        },
                      ]}
                    >
                      {current.format("D")}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

// 스타일 정의
const styles = {
  container: css`
    margin-top: 16px;
    transform: translate3d(-14px, 0px, 0px);
    width: calc(100% + 28px);
  `,

  header: css`
    font-size: 14px;
    font-weight: 700;
    display: flex;
    justify-content: space-between;
    margin: auto 14px 10px;
  `,

  headerLeft: css`
    display: flex;
    justify-content: center;
    gap: 10px;
  `,

  navigationButton: css`
    width: 26px;
    margin-left: 8px;
    cursor: pointer;
    background-color: white;
    border: none;
  `,

  weekDaysGrid: css`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    font-size: 10px;
    margin: 4px auto;
    padding: 0 14px;
  `,

  datesContainer: css`
    padding: 0 14px;
  `,

  weekGrid: css`
    display: grid;
    grid-template-columns: repeat(7, 1fr);
    text-align: center;
    margin-bottom: 6px;
  `,

  emptyDateCell: css`
    height: 30px;
  `,

  dateBtn: css`
    cursor: pointer;
    background-color: white;
  `,

  dateCell: css`
    padding: 6px 0;
  `,

  dateIconContainer: css`
    height: 21px;
    position: relative;
    cursor: pointer;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 4px;
  `,

  unachievedCount: css`
    position: absolute;
    padding-top: 3px;
    font-size: 13px;
    font-family: Pretendard;
    text-shadow: rgba(0, 0, 0, 0.2) 0px 0px 5px;
    font-weight: 700;
    color: white;
  `,

  dateSvg: css`
    width: 21px;
    height: 21px;
    fill: none;
  `,

  dateDiv: css`
    display: inline-flex;
    justify-content: center;
    align-items: center;
    width: 20px;
    height: 20px;
    margin: 0 auto;
    border-radius: 50%;
    font-family: Pretendard;
    font-size: 12px;
    font-weight: 400;
    border: none;
    background: none;
  `,
};

export default Calendar;
