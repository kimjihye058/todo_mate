import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type TodoItem = {
  id: number;
  text: string;
  completed: boolean;
  categoryId: number;
  date: string;
};

// todosAtom(localstorage에 저장)
export const todosAtom = atomWithStorage<TodoItem[]>("todos", []);

// 선택된 todo
export const selectedTodoAtom = atom<TodoItem | null>(null);

// 모달 열림 상태
export const isOpenAtom = atom(false);

// 날짜별 못 이룬 목표 개수
export const unachievedByDateAtom = atom((get) => {
  const todos = get(todosAtom);

  return todos.reduce<Record<string, number>>((acc, todo) => {
    // { "2025-09-10": 2, "2025-09-11": 1, ... } 이런 식으로..
    if (!todo.completed) {
      acc[todo.date] = (acc[todo.date] || 0) + 1;
    }
    return acc;
  }, {});
});
