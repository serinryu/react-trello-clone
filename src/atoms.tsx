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

interface IFormAppearState {
  id: string;
  isAppear: boolean;
}

interface IMenuState {
  isAppear: boolean;
  positionX: number;
  positionY: number;
  boardId: string;
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

//아이템 배열 상태
export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    "to do": [{id: 1, text:"hi"}, {id: 2, text:"hahaha"}],
    "doing": [{id: 3, text:"meme"}, {id: 4, text:"yeah"}],
    "done": [],
  },
  effects: [localStorageEffect(localId)],
});

//보드 순서 상태
export const boardState = atom<string[]>({
  key: "board",
  default: ["to do", "doing", "done"],
  effects: [localStorageEffect(boardId)],
})

//보드 생성 상태
export const createState = atom<IFormAppearState>({
  key: "form",
  default: {
    id: "",
    isAppear: false,
  },
});

//메뉴 생성 상태
export const menuState = atom<IMenuState>({
  key: "menu",
  default: {
    isAppear: false,
    positionX: 0,
    positionY: 0,
    boardId: "", // 어떤 보드가 열려 있는지 저장
  },
});