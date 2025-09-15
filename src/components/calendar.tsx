import styled from "@emotion/styled";
import { css } from "@emotion/react";
import type { FC } from "react";
import { useMemo } from "react";
import dayjs from "dayjs";
import weekday from "dayjs/plugin/weekday";
import isoWeek from "dayjs/plugin/isoWeek";
import weekOfYear from "dayjs/plugin/weekOfYear";
import { atom, useAtom, useAtomValue } from "jotai";
import {
  IconChevronLeft,
  IconChevronRight,
  IconCheck,
} from "@tabler/icons-react";
import { unachievedByDateAtom, todosAtom } from "./todoAtom";
import TodoIconSvg from "./todoIconSvg";

dayjs.extend(weekOfYear);
dayjs.extend(isoWeek);
dayjs.extend(weekday);

export const selectDateAtom = atom(dayjs());

const viewDateAtom = atom(dayjs());

const achievedThisMonthAtom = atom((get) => {
  const todos = get(todosAtom);
  const selectDate = get(selectDateAtom);

  return todos.filter(
    (todo) =>
      todo.date.startsWith(selectDate.format("YYYY-MM")) && todo.completed
  ).length;
});

export const Calendar: FC = () => {
  const [selectDate, setSelectDate] = useAtom(selectDateAtom);
  const [viewDate, setViewDate] = useAtom(viewDateAtom);
  const todos = useAtomValue(todosAtom);

  const startWeek = viewDate.startOf("month").week();
  const endWeek =
    viewDate.endOf("month").week() === 1 ? 53 : viewDate.endOf("month").week();

  const weekDays = useMemo(
    () => Object.freeze(["일", "월", "화", "수", "목", "금", "토"]),
    []
  );

  const categoryColors = {
    1: "var(--category-1-color)",
    2: "var(--category-2-color)",
    3: "var(--category-3-color)",
    4: "var(--category-4-color)",
  };

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

  const isAllCompletedForDate = (dateStr: string) => {
    const todosForDate = todos.filter((todo) => todo.date === dateStr);
    return (
      todosForDate.length > 0 && todosForDate.every((todo) => todo.completed)
    );
  };

  const achievedThisMonth = useAtomValue(achievedThisMonthAtom);
  const unachievedByDate = useAtomValue(unachievedByDateAtom);

  const getColorsForDate = (dateStr: string): string[] => {
    const todosForDate = todos.filter(
      (todo) => todo.date === dateStr && todo.completed
    );
    const uniqueCategories = [
      ...new Set(todosForDate.map((todo) => todo.categoryId)),
    ];

    return uniqueCategories.map(
      (categoryId) => categoryColors[categoryId as keyof typeof categoryColors]
    );
  };

  return (
    <Container>
      <Header>
        <HeaderLeft>
          <p>{viewDate.format("YYYY년 M월")}</p>
          <img
            src="./images/calendar/calendarVictoryIcon.svg"
            alt="완료한 개수"
          />
          <p>{achievedThisMonth}</p>
        </HeaderLeft>

        <div>
          <NavigationButton onClick={() => changeMonth("subtract")}>
            <IconChevronLeft stroke={2} />
          </NavigationButton>
          <NavigationButton onClick={() => changeMonth("add")}>
            <IconChevronRight stroke={2} />
          </NavigationButton>
        </div>
      </Header>

      {/* 요일 header */}
      <WeekDaysGrid>
        {weekDays.map((day, i) => (
          <div
            key={i}
            css={css`
              color: ${i === 0
                ? `var(--calendar-sunday-color)`
                : i === 6
                ? `var(--calendar-saturday-color)`
                : `var(--main-black-color)`};
            `}
          >
            {day}
          </div>
        ))}
      </WeekDaysGrid>

      {/* 날짜 */}
      <DatesContainer>
        {Array.from(
          { length: endWeek - startWeek + 1 },
          (_, idx) => startWeek + idx
        ).map((week) => (
          <WeekGrid key={week}>
            {Array.from({ length: 7 }, (_, i) => {
              const current = viewDate.week(week).startOf("week").add(i, "day");

              const isSelected = fmt(selectDate) === fmt(current);
              const isToday = fmt(dayjs()) === fmt(current);
              const isOtherMonth = fmtMonth(current) !== fmtMonth(viewDate);

              // 다른 달일 때 비우기
              if (isOtherMonth) {
                return <EmptyDateCell key={`${week}_${i}`} />;
              }

              const dateColors = getColorsForDate(fmt(current));

              return (
                <DateBtn
                  key={`${week}_${i}`}
                  onClick={() => setSelectDate(current)}
                >
                  <DateCell
                    css={{
                      color:
                        i === 0
                          ? `var(--calendar-sunday-color)`
                          : i === 6
                          ? `var(--calendar-saturday-color)`
                          : `var(--main-black-color)`,
                    }}
                  >
                    <DateIconContainer>
                      <DateIconContainer>
                        <TodoIconSvg colors={dateColors} />

                        {/* 아직 남은 목표 개수 표시 */}
                        {!isAllCompletedForDate(fmt(current)) && (
                          <UnachievedCount>
                            {unachievedByDate[fmt(current)] || ""}
                          </UnachievedCount>
                        )}

                        {/* 체크 표시 */}
                        {isAllCompletedForDate(fmt(current)) && (
                          <IconCheck
                            stroke={3}
                            css={`
                              position: absolute;
                              color: var(--main-white-color);
                              padding-top: 3px;
                              width: 13px;
                              height: 13px;
                            `}
                          />
                        )}
                      </DateIconContainer>
                    </DateIconContainer>
                    <DateDiv
                      css={{
                        opacity: isOtherMonth ? 0.35 : 1,
                        ...(isSelected
                          ? {
                              background: `var(--main-black-color)`,
                              color:
                                i === 0
                                  ? `var(--calendar-sunday-color)`
                                  : i === 6
                                  ? `var(--calendar-saturday-color)`
                                  : `var(--main-white-color)`,
                              fontWeight: 700,
                            }
                          : isToday
                          ? {
                              background: "#DADDE1",
                              color: `var(--main-black-color)`,
                              fontWeight: 700,
                            }
                          : {}),
                      }}
                    >
                      {current.format("D")}
                    </DateDiv>
                  </DateCell>
                </DateBtn>
              );
            })}
          </WeekGrid>
        ))}
      </DatesContainer>
    </Container>
  );
};

// 스타일 정의
const Container = styled.div`
  margin-top: 16px;
  transform: translate3d(-14px, 0px, 0px);
  width: calc(100% + 28px);
`;

const Header = styled.div`
  font-size: 14px;
  font-weight: 700;
  display: flex;
  justify-content: space-between;
  margin: auto 14px 10px;
`;

const HeaderLeft = styled.div`
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const NavigationButton = styled.button`
  width: 26px;
  margin-left: 8px;
  cursor: pointer;
  background-color: var(--main-white-color);
  border: none;
`;

const WeekDaysGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  font-size: 10px;
  margin: 4px auto;
  padding: 0 14px;
`;

const DatesContainer = styled.div`
  padding: 0 14px;
`;

const WeekGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 6px;
`;

const EmptyDateCell = styled.div`
  height: 30px;
`;

const DateBtn = styled.button`
  cursor: pointer;
  background-color: var(--main-white-color);
`;

const DateCell = styled.div`
  padding: 6px 0;
`;

const DateIconContainer = styled.div`
  height: 21px;
  position: relative;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 4px;
`;

const UnachievedCount = styled.span`
  position: absolute;
  padding-top: 3px;
  font-size: 13px;
  font-family: Pretendard;
  text-shadow: rgba(0, 0, 0, 0.2) 0px 0px 5px;
  font-weight: 700;
  color: var(--main-white-color);
`;

const DateDiv = styled.div`
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
`;

export default Calendar;
