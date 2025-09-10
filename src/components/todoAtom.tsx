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

// 오늘 이루지 못한 목표 개수
export const todayUnachievedAtom = atom((get) => {
  const todos = get(todosAtom);
  const today = dayjs().format("YYYY-MM-DD");
  const todayTotal = todos.filter((todo) => todo.date === today).length;
  const todayAchieved = todos.filter(
    (todo) => todo.date === today && todo.completed
  ).length;
  const todayUnachieved = todayTotal - todayAchieved;
  if(todayUnachieved === 0) return null;
  return todayUnachieved;
});
