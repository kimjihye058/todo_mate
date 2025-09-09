import { atom, useAtom } from "jotai";
import { useState } from "react";
import { css } from "@emotion/react";

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
    if (e.nativeEvent.isComposing) return;

    if (e.key === "Enter" && inputValue.trim() !== "") {
      setTodos([...todos, inputValue.trim()]);
      setInputValue("");
    }
  };

  return (
    <div>
      <button
        css={css`
          border-radius: 50px;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: #f2f2f2;
          padding: 8px 10px;
          margin-top: 8px;
        `}
        onClick={handleCategoryClick}
      >
        <img
          src="./images/feed/globalIcon.svg"
          css={css`
            width: 16px;
            height: 16px;
            margin-right: 5px;
          `}
        />
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
            margin-left: 5px;
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
              <img
                src="./images/option/feedOptionMenuIcon.png"
                css={css`
                  width: 20px;
                  height: 20px;
                `}
              />
            </button>
          </div>

          {todos.map((todo, index) => (
            <div
              key={index}
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
              <p
                css={css`
                  font-family: Pretendard;
                  font-weight: 600;
                  font-size: 14px;
                  margin: 0;
                `}
              >
                {todo}
              </p>
              <button
                css={css`
                  background-color: white;
                  padding: 0;
                  height: 20px;
                `}
              >
                <img
                  src="./images/option/feedOptionMenuIcon.png"
                  css={css`
                    width: 20px;
                    height: 20px;
                  `}
                />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Todo;
