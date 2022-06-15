import { useForm } from "react-hook-form";
import { Droppable } from "react-beautiful-dnd";
import DraggableCard from './DragabbleCard';
import styled from "styled-components";
import { useSetRecoilState } from "recoil";
import { ITodo, toDoState } from "../atoms";

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

const Form = styled.form`
  width: 100%;
  input {
    width: 100%;
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
  const setTodo = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onValid = ({ addTask }: IForm) => {
    console.log(addTask);
    setTodo((allBoards) => {
      const addObj = {id: Date.now(), text: addTask};
      return {
        ...allBoards,
        [boardId]: [...allBoards[boardId], addObj],
      };
    });
    setValue("addTask", ""); // 추가 완료했으므로 비우기
    };
  
  return(
    <Wrapper>
    <Title> {boardId} </Title>
    <Form onSubmit={handleSubmit(onValid)}>
      <input
        {...register("addTask", { required: true })}
        type="text"
        placeholder={`Add task on ${boardId}`}
      />
      <button>add</button>
    </Form>
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