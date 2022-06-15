import { DragDropContext, DropResult } from "react-beautiful-dnd";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { toDoState } from './atoms';
import Board from './Components/Board';

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

function App() {
  const [toDos, setTodos] = useRecoilState(toDoState);
  const onDragEnd = (info: DropResult) => {
    //console.log(info);
    const { destination, draggableId, source } = info;
    if(!destination) return;
    //same board
    if(destination.droppableId === source.droppableId){
      setTodos((allBoards) => {
          const boardCopy = [...allBoards[source.droppableId]];
          const taskObj = boardCopy[source.index];
          boardCopy.splice(source.index, 1);
          boardCopy.splice(destination?.index, 0, taskObj);
          return {
            ...allBoards,
            [source.droppableId]: boardCopy,
          };
      });
    }
    //different board
    if(destination.droppableId !== source.droppableId){
      setTodos((allBoards) => {
        const sourceboardCopy = [...allBoards[source.droppableId]];
        const destinationboardCopy = [...allBoards[destination.droppableId]];
        const taskObj = sourceboardCopy[source.index];
        sourceboardCopy.splice(source.index, 1);
        destinationboardCopy.splice(destination?.index, 0, taskObj);
        return {
          ...allBoards,
          [source.droppableId]: sourceboardCopy,
          [destination.droppableId] : destinationboardCopy,
        };
    });
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
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
