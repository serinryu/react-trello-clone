import { useForm } from "react-hook-form";
import { Droppable } from "react-beautiful-dnd";
import DraggableCard from './DragabbleCard';
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { ITodo, toDoState } from "../atoms";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit } from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import TitleForm from "./TitleForm";

const Wrapper = styled.div`
  width: 300px;
  padding: 20px 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 3px;
  min-height: 300px;
`;

const Title = styled.h2`
  display: flex;
  justify-content: flex-start;
  padding-bottom: 5px;
  font-weight: 600;
  font-size: 18px;
  div {
    padding-left: 8px;
    opacity: 50%;
    font-size: 12px;
  }
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

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 10px;
  input {
    font-size: 16px;
    border: 0;
    background-color: white;
    width: 80%;
    padding: 10px;
    border-radius: 5px;
    text-align: center;
    margin: 0 auto;
  }
`;

interface IWrapper {
  toDos : ITodo[],
  boardId : string
}

interface IAreaProps {
  isDraggingFromThis: boolean;
  isDraggingOver: boolean;
}

interface IForm {
  addTask: string;
}

function Board({ toDos, boardId }:IWrapper){
  const [ isEditClicked, setEditClick ] = useState(false);
  const [ todo, setTodo ] = useRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();

  const onValid = ({ addTask }: IForm) => {
    console.log(addTask);
    const addObj = {id: Date.now(), text: addTask};
    setTodo((allBoards) => {
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], addObj],
      };
    });
    setValue("addTask", ""); // 추가 완료했으므로 비우기
  };

  const onDeleteAll = (event : React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget : {name},
    } = event;
    setTodo((allBoards) => {
        return {
          ...allBoards,
          [name] : [],
        }
    })
  };
  
  const onEditClick = (event: React.MouseEvent<HTMLDivElement>) => {
    setEditClick((prev) => !prev);
  }

  return(
    <Wrapper>
    <Title> 
      {isEditClicked ? (
        <TitleForm key={boardId} boardId={boardId} setEditClick={setEditClick} />
      ) : (
      <>
        {boardId} 
        <div onClick={onEditClick}>
          <FontAwesomeIcon icon={faEdit}/>
        </div>
      </>
      )}
    </Title>
    <Form onSubmit={handleSubmit(onValid)}>
      <input
        {...register("addTask", { required: true })}
        type="text"
        placeholder={`Add task on ${boardId}`}
      />
      <button>add</button>
    </Form>
    <button onClick={onDeleteAll} name={boardId}>Delete All</button>
    <Droppable droppableId={boardId} type={`droppableSubItem`}>
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
              boardId={boardId}
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