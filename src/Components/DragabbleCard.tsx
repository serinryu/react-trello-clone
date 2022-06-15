import React from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";

const Card = styled.div`
border-radius: 5px;
margin-bottom: 5px;
padding: 10px 10px;
background-color: ${(props) => props.theme.cardColor};
`;

interface IDraggableCardProps{
  toDoId: number;
  toDoText: string;
  index : number;
}

function DraggableCard({ toDoId, toDoText, index }: IDraggableCardProps){
  return(
    <Draggable key={toDoId} draggableId={toDoId + ""} index={index}>
      {(provided) => (
        <Card ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>{toDoText}</Card>)}
    </Draggable>
  );
}

export default React.memo(DraggableCard);