import { atom, useAtom } from "jotai";
import { useState } from "react";
import { css } from "@emotion/react";
import {
  IconWorld,
  IconDots,
  IconPencilMinus,
  IconTrashX,
} from "@tabler/icons-react";
import { Sheet } from "react-modal-sheet";
import dayjs from "dayjs";
import { todosAtom, selectedTodoAtom } from "./todoAtom";
import { selectDateAtom } from "./Calendar";

type Category = {
  id: number;
  category: string;
  color: string;
};

const showInputAtom = atom<Record<number, boolean>>({});
const isOpenAtom = atom(false);

function Todo() {
  const [showInputs, setShowInputs] = useAtom(showInputAtom);
  const [todos, setTodos] = useAtom(todosAtom);
  const [inputValues, setInputValues] = useState<Record<number, string>>({});
  const [isOpen, setOpen] = useAtom(isOpenAtom);
  const [selectedTodo, setSelectedTodo] = useAtom(selectedTodoAtom);
  const [selectDate] = useAtom(selectDateAtom);

  const formattedSelectDate = dayjs(selectDate).format("YYYY-MM-DD"); // 문자열 비교용

  const categoryData: Category[] = [
    { id: 1, category: "공부", color: "--category-1-color" },
    { id: 2, category: "취미", color: "--category-2-color" },
    { id: 3, category: "약속", color: "--category-3-color" },
    { id: 4, category: "기타", color: "--category-4-color" },
  ];

  const getNextId = () => {
    return todos.length > 0 ? Math.max(...todos.map((todo) => todo.id)) + 1 : 1;
  };

  const handleCategoryClick = (categoryId: number) => {
    setShowInputs((prev) => ({
      ...prev,
      [categoryId]: !prev[categoryId],
    }));
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    categoryId: number
  ) => {
    if (e.nativeEvent.isComposing) return;
    const inputValue = inputValues[categoryId] || "";
    if (e.key === "Enter" && inputValue.trim() !== "") {
      setTodos([
        ...todos,
        {
          id: getNextId(),
          text: inputValue.trim(),
          completed: false,
          categoryId,
          date: formattedSelectDate,
        },
      ]);
      setInputValues((prev) => ({ ...prev, [categoryId]: "" }));
    }
  };

  const handleInputChange = (categoryId: number, value: string) => {
    setInputValues((prev) => ({ ...prev, [categoryId]: value }));
  };

  const toggleTodo = (id: number) => {
    const updated = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updated);
  };

  const deleteTodo = (id: number) => {
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
    setSelectedTodo(null);
    setOpen(false);
  };

  const snapPoint = [0, 0.5, 1];

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        gap: 20px;
      `}
    >
      {categoryData.map((category) => (
        <div
          key={category.id}
          css={css`
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            width: 100%;
          `}
        >
          {/* 카테고리(버튼) */}
          <button
            css={css`
              border-radius: 50px;
              display: flex;
              justify-content: center;
              align-items: center;
              background-color: #f2f2f2;
              padding: 8px 10px;
              gap: 5px;
              margin-right: 339px;
            `}
            onClick={() => handleCategoryClick(category.id)}
          >
            <IconWorld width={15} height={15} color="#979aa4" />
            <p
              css={css`
                font-family: Pretendard;
                font-weight: 600;
                font-size: 14px;
                margin: 0;
                color: var(${category.color});
              `}
            >
              {category.category}
            </p>
            <img
              src="./images/feed/feedAddBtnIcon.png"
              css={css`
                width: 20px;
                height: 20px;
              `}
            />
          </button>

          {/* 입력창(토글) */}
          {showInputs[category.id] && (
            <div
              css={css`
                display: flex;
                justify-content: center;
                align-items: center;
                margin-top: 10px;
              `}
            >
              <button
                css={css`
                  background-color: white;
                  padding: 0;
                  height: 21px;
                  margin-right: 10px;
                `}
              >
                <img
                  src="./images/feed/goalIcon.svg"
                  css={css`
                    width: 21px;
                    height: 21px;
                  `}
                />
              </button>
              <input
                type="text"
                placeholder="할 일 입력"
                value={inputValues[category.id] || ""}
                onChange={(e) => handleInputChange(category.id, e.target.value)}
                onKeyDown={(e) => handleKeyDown(e, category.id)}
                css={css`
                  border: none;
                  border-bottom: 2px solid var(${category.color});
                  width: 377px;
                  height: 40px;
                  ::placeholder {
                    font-family: Pretendard;
                    font-weight: 500;
                    font-size: 15px;
                    color: #4c4c4c;
                  }
                `}
              />
              <button
                css={css`
                  background-color: white;
                  padding: 0;
                  height: 20px;
                `}
              >
                <IconDots stroke={2} width={20} height={20} color="#acacac" />
              </button>
            </div>
          )}

          {/* 해당 카테고리의 리스트 */}
          {todos.filter(
            (todo) =>
              todo.categoryId === category.id &&
              todo.date === formattedSelectDate // 날짜 조건
          ).length > 0 && (
            <div
              css={css`
                margin-top: 10px;
              `}
            >
              {todos
                .filter(
                  (todo) =>
                    todo.categoryId === category.id &&
                    todo.date === formattedSelectDate // 날짜 조건
                )
                .sort((a, b) => Number(a.completed) - Number(b.completed))
                .map((todo) => (
                  <div
                    key={todo.id}
                    css={css`
                      display: flex;
                      justify-content: flex-start;
                      align-items: center;
                      width: 432px;
                      margin: 10px 0;
                    `}
                  >
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      css={css`
                        background-color: white;
                        padding: 0;
                        height: 21px;
                        margin-right: 10px;
                      `}
                    >
                      <svg
                        css={css`
                          width: 21px;
                          height: 21px;
                          fill: none;
                        `}
                      >
                        <circle
                          cx={6.46154}
                          cy={6.46154}
                          r={6.46154}
                          fill="rgb(219, 221, 223)"
                          fillOpacity={1}
                        ></circle>
                        <circle
                          cx={6.46154}
                          cy={14.5387}
                          r={6.46154}
                          fill="rgb(219, 221, 223)"
                          fillOpacity={1}
                        ></circle>
                        <circle
                          cx={14.5387}
                          cy={14.5387}
                          r={6.46154}
                          fill="rgb(219, 221, 223)"
                          fillOpacity={1}
                        ></circle>
                        <circle
                          cx={14.5387}
                          cy={6.46154}
                          r={6.46154}
                          fill="rgb(219, 221, 223)"
                          fillOpacity={1}
                        ></circle>
                      </svg>
                    </button>
                    <p
                      css={css`
                        font-family: Pretendard;
                        font-weight: 600;
                        font-size: 14px;
                        margin: 0;
                        flex: 1;
                        text-align: start;
                        color: "#000";
                      `}
                    >
                      {todo.text}
                    </p>
                    <button
                      onClick={() => {
                        setSelectedTodo(todo);
                        setOpen(true);
                      }}
                      css={css`
                        background-color: white;
                        padding: 0;
                        height: 20px;
                        margin-left: 10px;
                      `}
                    >
                      <IconDots
                        stroke={2}
                        width={20}
                        height={20}
                        color="#acacac"
                      />
                    </button>
                  </div>
                ))}
            </div>
          )}
        </div>
      ))}

      <Sheet
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        initialSnap={1}
        snapPoints={snapPoint}
      >
        <Sheet.Container
          style={{
            left: "25%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            height: "100%",
          }}
        >
          <Sheet.Header />
          <Sheet.Content>
            <div
              css={css`
                justify-items: center;
              `}
            >
              <p
                css={css`
                  font-family: Pretendard;
                  font-size: 20px;
                  font-weight: 700;
                `}
              >
                {selectedTodo?.text}
              </p>
              <div
                css={css`
                  display: flex;
                  flex-direction: row;
                  gap: 20px;
                `}
              >
                <div
                  css={css`
                    background-color: #f5f5f5;
                    width: 222px;
                    height: 68px;
                    border-radius: 6px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                  `}
                  onClick={() => setOpen(false)}
                >
                  <IconPencilMinus stroke={2} color="#5C85F7" />
                  <p
                    css={css`
                      color: #000;
                      font-size: 14px;
                      margin: 0;
                      margin-top: 5px;
                    `}
                  >
                    수정하기
                  </p>
                </div>
                <div
                  css={css`
                    background-color: #f5f5f5;
                    width: 222px;
                    height: 68px;
                    border-radius: 6px;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    flex-direction: column;
                  `}
                  onClick={() => selectedTodo && deleteTodo(selectedTodo.id)}
                >
                  <IconTrashX stroke={2} color="#ED6863" />
                  <p
                    css={css`
                      color: #000;
                      font-size: 14px;
                      margin: 0;
                      margin-top: 5px;
                    `}
                  >
                    삭제하기
                  </p>
                </div>
              </div>
            </div>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onClick={() => setOpen(false)} />
      </Sheet>
    </div>
  );
}

export default Todo;
