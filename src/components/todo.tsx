import { atom, useAtom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import { useState } from "react";
import { css } from "@emotion/react";
import {
  IconWorld,
  IconDots,
  IconPencilMinus,
  IconTrashX,
} from "@tabler/icons-react";
import { Sheet } from "react-modal-sheet";

type TodoItem = {
  id: number;
  text: string;
  completed: boolean;
};

const showInputAtom = atom(false);
const isOpenAtom = atom(false);

// 로컬 스토리지에 저장되도록 atomWithStorage 사용
const todosAtom = atomWithStorage<TodoItem[]>("todos", []);
const selectedTodoAtom = atom<TodoItem | null>(null);

function Todo() {
  const [showInput, setShowInput] = useAtom(showInputAtom);
  const [todos, setTodos] = useAtom(todosAtom);
  const [inputValue, setInputValue] = useState("");
  const [nextId, setNextId] = useState(1);
  const [isOpen, setOpen] = useAtom(isOpenAtom);
  const [selectedTodo, setSelectedTodo] = useAtom(selectedTodoAtom);

  const handleCategoryClick = () => {
    setShowInput((prev) => !prev); // 입력창만 토글
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

  const snapPoint = [0, 0.5, 1];

  return (
    <div
      css={css`
        display: flex;
        flex-direction: column;
        align-items: flex-start;
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

      {/* 입력창(토글) */}
      {showInput && (
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
      )}

      {/* 리스트 */}
      {todos.length > 0 && (
        <div css={css``}>
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
                  <IconDots stroke={2} width={20} height={20} color="#acacac" />
                </button>
              </div>
            ))}
        </div>
      )}
      <Sheet
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        initialSnap={1}
        snapPoints={snapPoint}
      >
        <Sheet.Container>
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
                  onClick={() => setOpen(false)}
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
