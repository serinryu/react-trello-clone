import { Droppable } from "react-beautiful-dnd";
import DraggableCard from './DragabbleCard';
import styled from "styled-components";

const Wrapper = styled.div`
  width: 300px;
  padding: 20px 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 3px;
  min-height: 300px;
`;

const Title = styled.h2`
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`

interface IWrapper {
  toDos : string[],
  boardId : string
}

function Board({ toDos, boardId }:IWrapper){
  return(
    <Wrapper>
    <Title> {boardId} </Title>
    <Droppable droppableId={boardId}>
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {toDos?.map((toDo, index) => (
            <DraggableCard key={toDo} toDo={toDo} index={index}  />
          ))}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
    </Wrapper>
  )
}

export default Board;