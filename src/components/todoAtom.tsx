import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";
import dayjs from "dayjs";

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

// 선택된 날짜 (기본값은 오늘)
export const selectDateAtom = atom<string>(dayjs().format("YYYY-MM-DD"));

// 이번 달 이룬 목표 개수
export const achievedThisMonthAtom = atom((get) => {
  const todos = get(todosAtom);
  const currentMonth = dayjs().format("YYYY-MM");
  return todos.filter(
    (todo) => todo.completed && todo.date.startsWith(currentMonth)
  ).length;
});

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
