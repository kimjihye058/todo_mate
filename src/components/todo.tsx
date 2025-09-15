import { atom, useAtom } from "jotai";
import { useRef } from "react";
import styled from "@emotion/styled";
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

  // 카테고리 바깥 영역 클릭 시 입력창 닫기
  const handleClickOutside = (e: MouseEvent) => {
    if (wrapperRef.current && !wrapperRef.current.contains(e.target as Node)) {
      setShowInputs(null);
    }
  };
  document.addEventListener("click", handleClickOutside);

  // 새로운 todo의 id 값 생성 함수(auto increase)
  const getNextId = () => {
    return todos.length > 0 ? Math.max(...todos.map((todo) => todo.id)) + 1 : 1;
  };

  // 입력창에서 Enter 누르면 todo 추가
  const inputTodo = (categoryId: number) => {
    const inputValue = inputValues[categoryId] || "";
    if (inputValue.trim() !== "") {
      // 새 todo 추가
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
    }

    // 입력창 초기화
    setInputValues((prev) => ({ ...prev, [categoryId]: "" }));
  };

  // 입력값을 상태에 저장
  const handleTodoChange = (categoryId: number, value: string) => {
    setInputValues((prev) => ({ ...prev, [categoryId]: value }));
  };

  // 선택된 todo 삭제
  const deleteTodo = (id: number) => {
    setOpen(false);
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  // todo 완료 상태 토글
  const completeTodo = (id: number) => {
    const updated = todos.map((todo) =>
      todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    setTodos(updated);
  };

  return (
    <Container ref={wrapperRef}>
      {categoryData.map((category) => (
        <CategorySection key={category.id}>

          <CategoryButton onClick={() => setShowInputs(category.id)}>
            <IconWorld width={15} height={15} color="#979aa4" />
            <CategoryText css={{ color: `var(${category.color})` }}>
              {category.category}
            </CategoryText>
            <CategoryIcon src="./images/feed/feedAddBtnIcon.png" />
          </CategoryButton>

          {todos.filter((todo) => todo.categoryId === category.id).length >
            0 && (
            <TodoList>
              {todos
                .filter(
                  (todo) =>
                    todo.categoryId === category.id &&
                    todo.date === formattedSelectDate
                )
                .sort((a, b) => Number(a.completed) - Number(b.completed))
                .map((todo) => (
                  <TodoItem key={todo.id}>
                    <CheckboxButton onClick={() => completeTodo(todo.id)}>
                      <TodoIconSvg
                        colors={[
                          todo.completed
                            ? `var(${category.color})`
                            : "var(--category-main-color)",
                        ]}
                      />
                      {todo.completed && (
                        <IconCheck
                          stroke={3}
                          css={`
                            height: 13px;
                            width: 13px;
                            position: relative;
                            left: -17px;
                            top: -4px;
                            color: var(--main-white-color);
                            z-index: 99;
                            margin-right: -13px;
                          `}
                        />
                      )}
                    </CheckboxButton>
                    <TodoText>{todo.text}</TodoText>
                    <TodoActionButton
                      onClick={() => {
                        setSelectedTodo(todo);
                        setOpen(true);
                      }}
                    >
                      <IconDots
                        stroke={2}
                        width={20}
                        height={20}
                        color="var(--todo-dots-color)"
                      />
                    </TodoActionButton>
                  </TodoItem>
                ))}

              {showInputs === category.id && (
                <InputContainer>
                  <CheckboxButton>
                    <TodoIconSvg colors={[]} />
                  </CheckboxButton>

                  <TodoInput
                    type="text"
                    placeholder="할 일 입력"
                    value={inputValues[category.id] || ""}
                    onChange={(e) =>
                      handleTodoChange(category.id, e.target.value)
                    }
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        inputTodo(category.id);
                      }
                      if (e.nativeEvent.isComposing) return; // 한글 입력 중 이벤트 무시
                    }}
                    css={{
                      borderBottom: `2px solid var(${category.color})`,
                    }}
                  />

                  <DotsButton>
                    <IconDots
                      stroke={2}
                      width={20}
                      height={20}
                      color="var(--todo-dots-color)"
                    />
                  </DotsButton>
                </InputContainer>
              )}
            </TodoList>
          )}
        </CategorySection>
      ))}

      <Sheet
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        initialSnap={1}
        detent="content"
      >
        <Sheet.Container
          style={{
            left: "25%",
            transform: "translate(-50%, -50%)",
            width: "50%",
            height: "100%",
            paddingBottom: "120px",
          }}
        >
          <Sheet.Header />
          <Sheet.Content>
            <SheetContent>
              <SheetTitle>{selectedTodo?.text}</SheetTitle>
              <ActionButtonsContainer>
                <ActionButton
                  onClick={() => selectedTodo && deleteTodo(selectedTodo.id)}
                >
                  <IconPencilMinus
                    stroke={2}
                    color="var(--modal-modify-color)"
                  />
                  <ActionButtonText>수정하기</ActionButtonText>
                </ActionButton>
                <ActionButton
                  onClick={() => selectedTodo && deleteTodo(selectedTodo.id)}
                >
                  <IconTrashX stroke={2} color="var(--modal-delete-color)" />
                  <ActionButtonText>삭제하기</ActionButtonText>
                </ActionButton>
              </ActionButtonsContainer>
            </SheetContent>
          </Sheet.Content>
        </Sheet.Container>
        <Sheet.Backdrop onClick={() => setOpen(false)} />
      </Sheet>
    </Container>
  );
}

// 스타일 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
`;

const CategorySection = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  width: 100%;
`;

const CategoryButton = styled.button`
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
`;

const CategoryText = styled.p`
  font-family: Pretendard;
  font-weight: 600;
  font-size: 14px;
  margin: 0;
`;

const CategoryIcon = styled.img`
  width: 20px;
  height: 20px;
`;

const TodoList = styled.div`
  margin-top: 10px;
`;

const TodoItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 432px;
  margin: 10px 0;
`;

const CheckboxButton = styled.button`
  background-color: var(--main-white-color);
  padding: 0;
  height: 21px;
  margin-right: 10px;
  border: none;
  cursor: pointer;
`;

const TodoText = styled.p`
  font-family: Pretendard;
  font-weight: 400;
  font-size: 14px;
  margin: 0;
  flex: 1;
  text-align: start;
  color: var(--main-black-color);
`;

const TodoActionButton = styled.button`
  background-color: var(--main-white-color);
  padding: 0;
  height: 20px;
  margin-left: 10px;
  border: none;
  cursor: pointer;
`;

const InputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const TodoInput = styled.input`
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
`;

const DotsButton = styled.button`
  background-color: var(--main-white-color);
  padding: 0;
  height: 20px;
  border: none;
  cursor: pointer;
`;

const SheetContent = styled.div`
  justify-items: center;
`;

const SheetTitle = styled.p`
  font-family: Pretendard;
  font-size: 20px;
  font-weight: 700;
`;

const ActionButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  gap: 20px;
`;

const ActionButton = styled.div`
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
`;

const ActionButtonText = styled.p`
  color: var(--main-black-color);
  font-size: 14px;
  margin: 0;
  margin-top: 5px;
`;

export default Todo;
