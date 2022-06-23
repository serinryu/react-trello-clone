import { useForm } from "react-hook-form";
import { Droppable } from "react-beautiful-dnd";
import DraggableCard from './DragabbleCard';
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { ITodo, toDoState, menuState } from "../atoms";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faEllipsis } from "@fortawesome/free-solid-svg-icons";
import React, {useState} from "react";
import TitleForm from "./TitleForm";
import Menu from "./Menu";

const Wrapper = styled.div`
  background-color: ${(props) => props.theme.boardColor};
`

const Content = styled.div`
  width: 300px;
  padding: 20px 10px;
  min-height: 300px;
`;

const Head = styled.div`
  display: flex;
  justify-content: space-between;
  padding: 10px;
`

const Title = styled.h2`
  display: flex;
  justify-content: flex-start;
  font-weight: 600;
  font-size: 18px;
  div {
    padding-left: 8px;
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
  padding: 10px 0px;
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  padding-bottom: 20px;
  background-color: ${(props) => props.theme.boardColor};
  input {
    opacity: 80%;
    border: 0;
    width: 90%;
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
  const [ isMenuAppear, setMenuState ] = useRecoilState(menuState);
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

  
  const onEdit = (event: React.MouseEvent<HTMLDivElement>) => {
    setEditClick((prev) => !prev);
  }

  const onClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const { pageX, pageY } = event;
    setMenuState((MenuState) => {
      const { isAppear } = MenuState;
      return {
        isAppear: !isAppear,
        positionX: pageX,
        positionY: pageY,
        boardId,
      };
    });
  };

  return(
    <Wrapper>
    <Content>
    <Head>
      <Title> 
        {isEditClicked ? (
          <TitleForm key={boardId} boardId={boardId} setEditClick={setEditClick} />
        ) : (
          <>
            {boardId} 
            <div onClick={onEdit}>
              <FontAwesomeIcon icon={faEdit}/>
            </div>
          </>
        )}
      </Title>
      <div onClick={onClick}>
        <FontAwesomeIcon icon={faEllipsis} />
        {isMenuAppear.isAppear ? <Menu/> : null}
      </div>
    </Head>
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
    </Content> 
    <Form onSubmit={handleSubmit(onValid)}>
      <input 
        {...register("addTask", { required: true })}
        type="text"
        placeholder={`Add another card on ${boardId}`}
      />
    </Form>
    </Wrapper>
  )
}

export default Board;