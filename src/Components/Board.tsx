import { Droppable } from "react-beautiful-dnd";
import DraggableCard from './DragabbleCard';
import styled from "styled-components";
import { ITodo } from "../atoms";

const Wrapper = styled.div`
  width: 300px;
  padding: 20px 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 3px;
  min-height: 300px;
`;

const Title = styled.h2`
  font-weight: 600;
  font-size: 18px;
`
const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver 
      ? "pink" 
      : props.isDraggingFromThis 
      ? "lightblue" 
      : null};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px 0px;
`;

interface IWrapper {
  toDos : ITodo[],
  boardId : string
}

interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

function Board({ toDos, boardId }:IWrapper){
  return(
    <Wrapper>
    <Title> {boardId} </Title>
    <Droppable droppableId={boardId}>
      {(provided, snapshot) => (
        <Area 
          isDraggingOver={snapshot.isDraggingOver}
          isDraggingFromThis={Boolean(snapshot.draggingFromThisWith)}
          ref={provided.innerRef} 
          {...provided.droppableProps}
        >
          {toDos?.map((toDo, index) => (
            <DraggableCard                 
              key={toDo.id}
              index={index}
              toDoId={toDo.id}
              toDoText={toDo.text}  
            />
          ))}
          {provided.placeholder}
        </Area>
      )}
    </Droppable>
    </Wrapper>
  )
}

export default Board;