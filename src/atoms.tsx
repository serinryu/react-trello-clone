import { atom, selector } from "recoil";
export const localId = "toDo";
export const boardId = "board";

export interface ITodo {
  id: number;
  text: string;
}

interface IToDoState {
  [key: string]: ITodo[];
}

export const localStorageEffect = (id: string) =>
  ({ setSelf, onSet }: any) => {
    const savedValue = localStorage.getItem(id);
    if (savedValue != null) {
      setSelf(JSON.parse(savedValue));
    }
    onSet((newValue: any, _: any, isReset: boolean) => {
      isReset
        ? localStorage.removeItem(id)
        : localStorage.setItem(id, JSON.stringify(newValue));
    });
  };

//todo 간의 이동을 위해 toDoState 구현
export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    "to do": [{id: 1, text:"hi"}, {id: 2, text:"hahaha"}],
    "doing": [{id: 3, text:"meme"}, {id: 4, text:"yeah"}],
    "done": [],
  },
  effects: [localStorageEffect(localId)],
});

//보드 이동을 위해 boardState 구현 (keys 만 배열로)
export const boardState = atom<string[]>({
  key: "board",
  default: ["to do", "doing", "done"],
  effects: [localStorageEffect(boardId)],
})