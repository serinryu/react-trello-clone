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

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: initialData,
});