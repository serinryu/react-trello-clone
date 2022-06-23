import { useForm } from "react-hook-form";
import styled from "styled-components";
import { useRecoilState, useSetRecoilState } from "recoil";
import { ITodo, toDoState, boardState } from "../atoms";
import React, {useState} from "react";

const TForm = styled.form`
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
  boardId : string;
  setEditClick : React.Dispatch<React.SetStateAction<boolean>>;
}

interface IForm {
  title: string;
}

function TitleForm({ boardId, setEditClick }:IWrapper){
  const [todo, setTodo] = useRecoilState(toDoState);
  const setBoardList = useSetRecoilState(boardState);
  const { register, setValue, handleSubmit } = useForm<IForm>();
  const onTitleValid = ({ title }: IForm) => {
    let tempAllBoards = { ...todo };
    tempAllBoards = Object.keys(tempAllBoards).reduce(
      (a, b) => ({
        ...a,
        [b === boardId ? title : b]: tempAllBoards[b],
      }),
      {}
    );
    setTodo((oldToDos) => {
      return { ...tempAllBoards };
    });
    setBoardList((allBoardList) => {
      return [ ...Object.keys(tempAllBoards) ];
    })
  };
  const onEdit = () => {
    setEditClick((prev) => !prev);
  };
  return(
    <TForm onSubmit={handleSubmit(onTitleValid)}>
      <input
        {...register("title", { required: true, onBlur: (e) => {onEdit()} })}
        type="text"
        placeholder={boardId}
      />
      <div onClick={onEdit}> X </div>
    </TForm>
  )
}

export default TitleForm;

