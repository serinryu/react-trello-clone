import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { useSetRecoilState } from "recoil";
import { ITodo, toDoState } from "../atoms";

const Card = styled.div`
  border-radius: 5px;
  margin-bottom: 5px;
  padding: 10px 10px;
  background-color: ${(props) => props.theme.cardColor};
  display: flex;
  justify-content: space-between;
  button {
    background-color: none;
    
  }
`;

interface IDraggableCardProps{
  toDoId: number;
  toDoText: string;
  index : number;
  boardId : string;
}

function DraggableCard({ toDoId, toDoText, index, boardId }: IDraggableCardProps){
  const setTodo = useSetRecoilState(toDoState);
  const onDelete = (event : React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget : {name},
    } = event;
    console.log(event);
    setTodo((allData) => {
      const boardCopy = [...allData[boardId]];
      const targetIndex = allData[boardId].findIndex((data) => data.id.toString() === name);
      boardCopy.splice(targetIndex, 1);
      return {
        ...allData, 
        [boardId] : boardCopy,
      }
    })
  }
  return(
    <Draggable key={toDoId} draggableId={toDoId + ""} index={index}>
      {(provided) => (
        <Card ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>
          {toDoText}
          <button name={toDoId.toString()} onClick={onDelete}> X </button>
        </Card>)}
    </Draggable>
  );
}

export default React.memo(DraggableCard);