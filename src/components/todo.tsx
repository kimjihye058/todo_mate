import { atom, useAtom } from "jotai";
import { useEffect, useRef } from "react";
import { css } from "@emotion/react";
import {
  IconWorld,
  IconDots,
  IconPencilMinus,
  IconTrashX,
  IconCheck,
} from "@tabler/icons-react";
import { Sheet } from "react-modal-sheet";
import dayjs from "dayjs";
import { todosAtom, selectedTodoAtom } from "./todoAtom";
import { selectDateAtom } from "./Calendar";
import TodoIconSvg from "./todoIconSvg";

type Category = {
  id: number;
  category: string;
  color: string;
};

const showInputAtom = atom<number | null>(null);
const isOpenAtom = atom(false);
const inputValuesAtom = atom<Record<number, string>>({});

function Todo() {
  const [todos, setTodos] = useAtom(todosAtom);
  const [inputValues, setInputValues] = useAtom(inputValuesAtom);
  const [isOpen, setOpen] = useAtom(isOpenAtom);
  const [selectedTodo, setSelectedTodo] = useAtom(selectedTodoAtom);
  const [selectDate] = useAtom(selectDateAtom);
  const [showInputs, setShowInputs] = useAtom(showInputAtom);

  const wrapperRef = useRef<HTMLDivElement>(null);
  const formattedSelectDate = dayjs(selectDate).format("YYYY-MM-DD");

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
    setShowInputs((prev) => (prev === categoryId ? null : categoryId));
  };

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target as Node)
      ) {
        setShowInputs(null);
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [setShowInputs]);

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
    <div ref={wrapperRef} css={styles.container}>
      {categoryData.map((category) => (
        <div key={category.id} css={styles.categorySection}>
          {/* 카테고리(버튼) */}
          <button
            css={styles.categoryButton}
            onClick={() => handleCategoryClick(category.id)}
          >
            <IconWorld width={15} height={15} color="#979aa4" />
            <p css={[styles.categoryText, { color: `var(${category.color})` }]}>
              {category.category}
            </p>
            <img
              src="./images/feed/feedAddBtnIcon.png"
              css={styles.categoryIcon}
            />
          </button>

          {/* 해당 카테고리의 리스트 */}
          {todos.filter((todo) => todo.categoryId === category.id).length >
            0 && (
            <div css={styles.todoList}>
              {todos
                .filter(
                  (todo) =>
                    todo.categoryId === category.id &&
                    todo.date === formattedSelectDate
                )
                .sort((a, b) => Number(a.completed) - Number(b.completed))
                .map((todo) => (
                  <div key={todo.id} css={styles.todoItem}>
                    <button
                      onClick={() => toggleTodo(todo.id)}
                      css={styles.checkboxButton}
                    >
                      <TodoIconSvg
                        colors={[
                          todo.completed
                            ? `var(${category.color})`
                            : "var(--category-main-color)",
                        ]}
                      />
                      {todo.completed && (
                        <IconCheck stroke={3} css={styles.checkIcon} />
                      )}
                    </button>
                    <p css={styles.todoText}>{todo.text}</p>
                    <button
                      onClick={() => {
                        setSelectedTodo(todo);
                        setOpen(true);
                      }}
                      css={styles.todoActionButton}
                    >
                      <IconDots
                        stroke={2}
                        width={20}
                        height={20}
                        color="var(--todo-dots-color)"
                      />
                    </button>
                  </div>
                ))}

              {/* 입력창(토글) */}
              {showInputs === category.id && (
                <div css={styles.inputContainer}>
                  <button css={styles.checkboxButton}>
                    <TodoIconSvg colors={[]} />
                  </button>
                  <input
                    type="text"
                    placeholder="할 일 입력"
                    value={inputValues[category.id] || ""}
                    onChange={(e) =>
                      handleInputChange(category.id, e.target.value)
                    }
                    onKeyDown={(e) => handleKeyDown(e, category.id)}
                    css={[
                      styles.todoInput,
                      {
                        borderBottom: `2px solid var(${category.color})`,
                      },
                    ]}
                  />
                  <button css={styles.dotsButton}>
                    <IconDots
                      stroke={2}
                      width={20}
                      height={20}
                      color="var(--todo-dots-color)"
                    />
                  </button>
                </div>
              )}
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
            <div css={styles.sheetContent}>
              <p css={styles.sheetTitle}>{selectedTodo?.text}</p>
              <div css={styles.actionButtonsContainer}>
                <div css={styles.actionButton} onClick={() => setOpen(false)}>
                  <IconPencilMinus
                    stroke={2}
                    color="var(--modal-modify-color)"
                  />
                  <p css={styles.actionButtonText}>수정하기</p>
                </div>
                <div
                  css={styles.actionButton}
                  onClick={() => selectedTodo && deleteTodo(selectedTodo.id)}
                >
                  <IconTrashX stroke={2} color="var(--modal-delete-color)" />
                  <p css={styles.actionButtonText}>삭제하기</p>
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

// 스타일 정의
const styles = {
  container: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;
  `,

  categorySection: css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    width: 100%;
  `,

  categoryButton: css`
    border-radius: 50px;
    display: flex;
    justify-content: center;
    align-items: center;
    background-color: var(--category-bg-color);
    padding: 8px 10px;
    gap: 5px;
    margin-right: 339px;
    border: none;
    cursor: pointer;
  `,

  categoryText: css`
    font-family: Pretendard;
    font-weight: 600;
    font-size: 14px;
    margin: 0;
  `,

  categoryIcon: css`
    width: 20px;
    height: 20px;
  `,

  inputContainer: css`
    display: flex;
    justify-content: center;
    align-items: center;
  `,

  checkboxButton: css`
    background-color: var(--main-white-color);
    padding: 0;
    height: 21px;
    margin-right: 10px;
    border: none;
    cursor: pointer;
  `,

  checkboxSvg: css`
    width: 21px;
    height: 21px;
    fill: none;
  `,

  todoInput: css`
    border: none;
    width: 377px;
    height: 21px;
    outline: none;

    &::placeholder {
      font-family: Pretendard;
      font-weight: 500;
      font-size: 15px;
      color: #4c4c4c;
    }
  `,

  dotsButton: css`
    background-color: var(--main-white-color);
    padding: 0;
    height: 20px;
    border: none;
    cursor: pointer;
  `,

  todoList: css`
    margin-top: 10px;
  `,

  todoItem: css`
    display: flex;
    justify-content: flex-start;
    align-items: center;
    width: 432px;
    margin: 10px 0;
  `,

  todoText: css`
    font-family: Pretendard;
    font-weight: 400;
    font-size: 14px;
    margin: 0;
    flex: 1;
    text-align: start;
    color: var(--main-black-color);
  `,

  todoActionButton: css`
    background-color: var(--main-white-color);
    padding: 0;
    height: 20px;
    margin-left: 10px;
    border: none;
    cursor: pointer;
  `,

  checkIcon: css`
    height: 13px;
    width: 13px;
    position: absolute;
    position: relative;
    left: -17px;
    top: -4px;
    color: var(--main-white-color);
    z-index: 99;
    margin-right: -13px;
  `,

  sheetContent: css`
    justify-items: center;
  `,

  sheetTitle: css`
    font-family: Pretendard;
    font-size: 20px;
    font-weight: 700;
  `,

  actionButtonsContainer: css`
    display: flex;
    flex-direction: row;
    gap: 20px;
  `,

  actionButton: css`
    background-color: var(--modal-bg-color);
    width: 222px;
    height: 68px;
    border-radius: 6px;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
    border: none;
  `,

  actionButtonText: css`
    color: var(--main-black-color);
    font-size: 14px;
    margin: 0;
    margin-top: 5px;
  `,
};

export default Todo;
