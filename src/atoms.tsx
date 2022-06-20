import { atom, selector } from "recoil";

export interface ITodo {
  id: number;
  text: string;
}

interface IToDoState {
  [key: string]: ITodo[];
}

const initialData = localStorage.getItem("storage") 
  ? JSON.parse(localStorage.getItem("storage") || "[]") 
  : {
    "to do": [{id: 1, text:"hi"}, {id: 2, text:"hahaha"}],
    "doing": [{id: 3, text:"meme"}, {id: 4, text:"yeah"}],
    "done": [],
  };

//todo 간의 이동을 위해 toDoState 구현
export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: initialData,
});

//보드 이동을 위해 boardState 구현 (keys 만 배열로)
export const boardState = atom<string[]>({
  key: "board",
  default: ["to do", "doing", "done"],
})