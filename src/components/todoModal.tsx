import { useAtom } from "jotai";
import { Sheet } from "react-modal-sheet";
import { IconPencilMinus, IconTrashX } from "@tabler/icons-react";
import styled from "@emotion/styled";
import { selectedTodoAtom, todosAtom, isOpenAtom} from "./todoAtom";

function TodoModal() {
  const [isOpen, setOpen] = useAtom(isOpenAtom);
  const [selectedTodo] = useAtom(selectedTodoAtom);
  const [, setTodos] = useAtom(todosAtom);

  // todo 삭제
  const deleteTodo = (id: number) => {
    setOpen(false);
    setTodos((prevTodos) => prevTodos.filter((todo) => todo.id !== id));
  };

  return (
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
              <ActionButton>
                <IconPencilMinus stroke={2} color="var(--modal-modify-color)" />
                <ActionButtonText>수정하기</ActionButtonText>
              </ActionButton>
              <ActionButton
                onClick={() =>
                  selectedTodo && deleteTodo(selectedTodo.id)
                }
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
  );
}

// 스타일 정의
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

export default TodoModal;
