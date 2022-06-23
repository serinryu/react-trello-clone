import React, {useState} from "react";
import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { ITodo, toDoState } from "../atoms";
import { useForm } from "react-hook-form";

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

interface IDraggableCardProps{
  toDoId: number;
  toDoText: string;
  index : number;
  boardId : string;
}

interface IForm {
  item: string;
}

function DraggableCard({ toDoId, toDoText, index, boardId }: IDraggableCardProps){
  const [ isEditClicked, setEditClick ] = useState(false);
  const [todo, setTodo] = useRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onDelete = (event : React.MouseEvent<HTMLButtonElement>) => {
    const {
      currentTarget : {name},
    } = event;
    const boardCopy = [...todo[boardId]];
    const targetIndex = todo[boardId].findIndex((data) => data.id.toString() === name);
    boardCopy.splice(targetIndex, 1);
    setTodo((allData) => {
      return {
        ...allData, 
        [boardId] : boardCopy,
      }
    });
  };
  const onEdit = () => {
    setEditClick((prev)=>!prev);
  };
  const onItemValid = ({ item }: IForm) => {
    setEditClick((prev)=>!prev);
    const tempAllItems = [ ...todo[boardId] ];
    const addItem = {id: toDoId, text: item}
    tempAllItems.splice(index, 1)
    tempAllItems.splice(index, 0, addItem)
    setTodo((oldToDos) => {
      return { 
        ...oldToDos,
        [boardId] : tempAllItems
      };
    });
  }
  return(
    <Draggable key={toDoId} draggableId={toDoId + ""} index={index}>
      {(provided) => (
        <Card ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps}>

        { isEditClicked ? (
          <Form onSubmit={handleSubmit(onItemValid)}>
            <input
              {...register("item", { required: true, onBlur: (e) => {onEdit()} })}
              type="text"
              placeholder={toDoText}
            />
            <div onClick={onEdit}> X </div>
          </Form>
        ) : (
          <>
          {toDoText}
          <button onClick={onEdit}> edit </button>
          <button type="submit" name={toDoId.toString()} onClick={onDelete}> Delete </button>
          </>
        )}

        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(DraggableCard);