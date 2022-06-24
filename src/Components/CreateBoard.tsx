import styled from "styled-components";
import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import { toDoState, boardState, createState } from "../atoms";
import { motion } from "framer-motion";

const Card = styled(motion.div)`
  width: 50%;
  display: flex;
  justify-content: center;
  text-align: center;
  margin: 0 auto;
  padding: 10px;
  border-radius: 5px;
  background-color: ${(props) => props.theme.cardColor};
  button {
    background-color: none;
  }
`;

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 5px;
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

interface IForm {
  newBoard: string;
}

const cardVariants = {
  initial : { 
    scale: 0, 
  },
  animate : { 
    scale: 1,
  },
}

function CreateBoard(){
  const [toDos, setTodos] = useRecoilState(toDoState);
  const [boardList, setBoardList] = useRecoilState(boardState);
  const [isCreate, setCreate] = useRecoilState(createState);
  const { register, handleSubmit, setValue } = useForm<IForm>();

  const onBoardValid = ({ newBoard }: IForm) => {
    setTodos((allBoards) => {
      return { ...allBoards, [newBoard]: [] }
    });
    setBoardList((allBoardList) => {
      return [ ...allBoardList , newBoard ]
    });
    setCreate((prev) => {
      return { ...prev, isCreate: false }
    });
    setValue("newBoard", ""); // 추가 완료했으므로 비우기
  }

  return(
    <Card variants={cardVariants} initial="initial" animate="animate" >
      <Form onSubmit={handleSubmit(onBoardValid)}>
        <input
          {...register("newBoard", { required: true })}
          type="text"
          placeholder="Create a board"
        ></input>
      </Form>
    </Card>
  );
};

export default CreateBoard;