import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useState } from "react";
import { css } from "@emotion/react";
import { IconWorld, IconDots } from "@tabler/icons-react";

type TodoItem = {
  id: number;
  text: string;
  completed: boolean;
};

const showTodoListAtom = atom(false);

// 로컬 스토리지에 저장되도록 atomWithStorage 사용
const todosAtom = atomWithStorage<TodoItem[]>("todos", []);

function Todo() {
  const [showTodoList, setShowTodoList] = useAtom(showTodoListAtom);
  const [todos, setTodos] = useAtom(todosAtom);
  const [inputValue, setInputValue] = useState("");
  const [nextId, setNextId] = useState(1);

  const handleCategoryClick = () => {
    setShowTodoList((prev) => !prev);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.nativeEvent.isComposing) return;
    if (e.key === "Enter" && inputValue.trim() !== "") {
      setTodos([
        ...todos,
        { id: nextId, text: inputValue.trim(), completed: false },
      ]);
      setNextId(nextId + 1);
      setInputValue("");
    }
  };

  const toggleTodo = (id: number) => {
    const updated = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updated);
  };

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
      `}
    >
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
        onClick={handleCategoryClick}
      >
        <IconWorld width={15} height={15} color="#979aa4" />
        <p
          css={css`
            font-family: Pretendard;
            font-weight: 600;
            font-size: 14px;
            margin: 0;
            color: #5e9d68;
          `}
        >
          todo
        </p>
        <img
          src="./images/feed/feedAddBtnIcon.png"
          css={css`
            width: 20px;
            height: 20px;
          `}
        />
      </button>

      {showTodoList && (
        <div
          css={css`
            gap: 12px;
          `}
        >
          <div
            css={css`
              display: flex;
              justify-content: center;
              align-items: center;
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
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              css={css`
                border: none;
                border-bottom: 2px solid #5e9d68;
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

          {[...todos]
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
                  <img
                    src={
                      todo.completed
                        ? "./images/feed/goalCompletedIcon.svg"
                        : "./images/feed/goalIcon.svg"
                    }
                    css={css`
                      width: 21px;
                      height: 21px;
                    `}
                  />
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
                  css={css`
                    background-color: white;
                    padding: 0;
                    height: 20px;
                    margin-left: 10px;
                  `}
                >
                  <IconDots stroke={2} width={20} height={20} color="#acacac" />
                </button>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}

export default Todo;
