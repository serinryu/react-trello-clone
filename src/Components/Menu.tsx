import styled from "styled-components";
import { useRecoilState } from "recoil";
import { toDoState, menuState, boardState } from "../atoms";
import React, {useState} from "react";

interface StyledBoxProps {
  topX: string;
  topY: string;
}

const BoxMenu = styled.div<StyledBoxProps>`
  width: 150px;
  height: 100px;
  background-color: white;
  position: absolute;
  left: ${(props) => props.topX};
  top: ${(props) => props.topY};
  border-radius: 5px;
`;

const SubElement = styled.button`
  width: 100%;
  height: 50px;
  border-bottom: 1px solid;
  display: flex;
  align-items: center;
  color: rgba(119, 119, 119, 0.8);
  padding: 10px 10px;
  font-size: 12px;
  :hover {
    background-color: grey;
    span {
      color: black;
    }
  }
`;


function Menu(){  
  const [ todo, setTodo ] = useRecoilState(toDoState);
  const [boardList, setBoardList] = useRecoilState(boardState);
  const [ menuValue, setMenuState ] = useRecoilState(menuState);

  const onBoardDelete = () => {
    setBoardList((allBoards) => {
      const copyBoard = [...allBoards];
      copyBoard.splice(copyBoard.indexOf(menuValue.boardId), 1);
      console.log(copyBoard);
      return [ ...copyBoard ];
    });
    setTodo((allBoards) => {
      const copyBoard = {...allBoards};
      const targetIndex = Object.keys(todo).map((data) => data === menuValue.boardId).indexOf(true);
      const targetKey = Object.keys(copyBoard)[targetIndex];
      delete copyBoard[targetKey];
      return {...copyBoard};
    })
  };
  const onDeleteAll = (event : React.MouseEvent<HTMLButtonElement>) => {
    setTodo((allBoards) => {
        return {
          ...allBoards,
          [menuValue.boardId] : [],
        }
    })
  };

  return(
    <BoxMenu
      topX={menuValue.positionX - 140 + "px"}
      topY={menuValue.positionY + 10 + "px"}
    >
      <SubElement onClick={onBoardDelete}>
        <span>Delete Board</span>
      </SubElement>
      <SubElement type="submit" onClick={onDeleteAll}>
        <span>Delete All To Dos</span>
      </SubElement>
    </BoxMenu>
  )
}

export default Menu;