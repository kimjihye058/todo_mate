import { atom, useAtom } from "jotai";
import { useState } from "react";
import { css } from "@emotion/react";
import { IconWorld, IconDots } from "@tabler/icons-react";

const showTodoListAtom = atom(false);
const todosAtom = atom<string[]>([]);

function Todo() {
  const [showTodoList, setShowTodoList] = useAtom(showTodoListAtom);
  const [todos, setTodos] = useAtom(todosAtom);
  const [inputValue, setInputValue] = useState("");

  const handleCategoryClick = () => {
    setShowTodoList((prev) => !prev);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    // 한글일 때 두 번 나오는 것을 방지
    if (e.nativeEvent.isComposing) return;
    // 엔터 입력시 자동으로 등록되도록
    if (e.key === "Enter" && inputValue.trim() !== "") {
      setTodos([...todos, inputValue.trim()]);
      setInputValue("");
    }
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
        `}
        onClick={handleCategoryClick}
      >
        <IconWorld width={15} height={15} color="#979AA4" />
        <p
          css={css`
            font-family: Pretendard;
            font-weight: 600;
            font-size: 14px;
            margin: 0;
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
                border-bottom: 2px solid #000;
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
              <IconDots stroke={2} width={20} height={20} color="#ACACAC" />
            </button>
          </div>

          {todos.map((todo, index) => (
            <div
              key={index}
              css={css`
                display: flex;
                justify-content: flex-start;
                align-items: center;
                width: 432px;
                margin: 10px 0;
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
              <p
                css={css`
                  font-family: Pretendard;
                  font-weight: 600;
                  font-size: 14px;
                  margin: 0;
                  flex: 1;
                  text-align: start;
                `}
              >
                {todo}
              </p>
              <button
                css={css`
                  background-color: white;
                  padding: 0;
                  height: 20px;
                  margin-left: 10px;
                `}
              >
                <IconDots stroke={2} width={20} height={20} color="#ACACAC" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Todo;
