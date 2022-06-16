import { DragDropContext, DropResult } from "react-beautiful-dnd";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { toDoState } from './atoms';
import Board from './Components/Board';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from "@fortawesome/free-solid-svg-icons";


const Wrapper = styled.div`
  display: flex;
  width: 100vw;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 15px;
`;

const Button = styled.div`
  position: absolute;
  top: 30px;
  right: 50px;
  font-size: 50px;
  opacity: 0.8;
`

function App() {
  const [toDos, setTodos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    //console.log(info);
    const { destination, draggableId, source } = info;
    if(!destination) return;
    //same board
    if(destination.droppableId === source.droppableId){
      const boardCopy = [...toDos[source.droppableId]];
      const taskObj = boardCopy[source.index];
      setTodos((allBoards) => {
          boardCopy.splice(source.index, 1);
          boardCopy.splice(destination?.index, 0, taskObj);
          return {
            ...allBoards,
            [source.droppableId]: boardCopy,
          };
      });
      localStorage.setItem('storage', JSON.stringify({
        ...toDos,
        [source.droppableId]: boardCopy,
      }));
    };
    //different board
    if(destination.droppableId !== source.droppableId){
      const sourceboardCopy = [...toDos[source.droppableId]];
      const destinationboardCopy = [...toDos[destination.droppableId]];
      const taskObj = sourceboardCopy[source.index];
      sourceboardCopy.splice(source.index, 1);
      destinationboardCopy.splice(destination?.index, 0, taskObj);
      setTodos((allBoards) => {
        return {
          ...allBoards,
          [source.droppableId]: sourceboardCopy,
          [destination.droppableId] : destinationboardCopy,
        };
      });
      localStorage.setItem('storage', JSON.stringify({
        ...toDos,
        [source.droppableId]: sourceboardCopy,
        [destination.droppableId] : destinationboardCopy,
      }));
    }
  };
  const onButtonClick = (e :any) => {
    setTodos((allBoards) => {
      return { ...allBoards, [Math.random().toString(36).replace(/[^a-z]+/g, '').substring(0, 5)]: [] }
    })
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Button onClick={onButtonClick}><FontAwesomeIcon icon={faPlus}/></Button>
      <Wrapper>
        <Boards>
          {Object.keys(toDos).map((boardId) => (
            <Board key={boardId} boardId={boardId} toDos={toDos[boardId]}/>
          ))}
        </Boards>
      </Wrapper>
    </DragDropContext>


  );
}

export default App;
