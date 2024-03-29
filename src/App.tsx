import { DragDropContext, Draggable, Droppable, DropResult } from "react-beautiful-dnd";
import styled from "styled-components";
import { useRecoilState } from "recoil";
import { toDoState, boardState, createState } from './atoms';
import Board from './Components/Board';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import CreateBoard from "./Components/CreateBoard";
import { Helmet, HelmetProvider } from 'react-helmet-async';
import { motion, AnimatePresence } from "framer-motion";
import React, {useEffect, useState} from "react";

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
  flex-wrap: wrap;
  width: 100%;
  gap: 15px;
`;

const Button = styled.div`
  position: absolute;
  z-index:1000;
  top: 30px;
  right: 50px;
  font-size: 50px;
  opacity: 0.8;
  cursor: pointer;
`
const Overlay = styled(motion.div)`
  width: 100%;
  height: 100%;
  position: absolute;
  z-index: 100;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0,0,0,0.5);
`

const Svg = styled.svg`
  width: 200px;
  height: 200px;
`

const svg = {
  start: { 
    fill: "rgba(255, 255, 255, 0)",
    pathLength: 0, 
    stroke: "white"
  },
  end: {
    fill: "rgba(255, 255, 255, 0.8)",
    pathLength: 1,
  },
};

function App() {
  const [isStart, setStart] = useState(true);
  const [toDos, setTodos] = useRecoilState(toDoState);
  const [boardList, setBoardList] = useRecoilState(boardState);
  const [isCreate, setCreate] = useRecoilState(createState);
  
  useEffect(()=>{
    let timer = setTimeout(()=>{ setStart(false) }, 4000);
  });

  const onDragEnd = (info: DropResult) => {
    //console.log(info);
    const { destination, draggableId, source, type } = info;
    if(!destination) return;

    console.log(destination);

    if(type === "trashCan"){
      setBoardList((allBoardList) => {
        const boardCopy = allBoardList;
        boardCopy.splice(source.index, 1);
        return [...boardCopy]
      })
    }

    if(type === "droppableSubItem"){ 
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
    }
    }; // end if(type === "droppableSubItem")

    if(type === "droppableItem"){
      //move board -> placement should be changed
      setBoardList((oldBoardList) => {
        const tempList = [...oldBoardList];
        tempList.splice(source.index, 1);
        tempList.splice(destination.index, 0, draggableId);
        return tempList;
      });
    };
  };

  const onButtonClick = (event : React.MouseEvent<HTMLDivElement>) => {
    setCreate((prev) => {
      return {...prev, isAppear: !prev.isAppear};
    })
  };

  return (

    <>
    <HelmetProvider>
      <Helmet>
        <title>Trello</title>
        <link rel="icon" href="favicon.ico" />
      </Helmet>
    </HelmetProvider>

    { isStart ? (
      <AnimatePresence>
      <Overlay>
      <Svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512">
        <motion.path           
          variants={svg}
          initial="start"
          animate="end"
          transition={{
            default: { duration: 3 },
            fill: { duration: 1, delay: 2 },
          }}
          d="M392.3 32H56.1C25.1 32 0 57.1 0 88c-.1 0 0-4 0 336 0 30.9 25.1 56 56 56h336.2c30.8-.2 55.7-25.2 55.7-56V88c.1-30.8-24.8-55.8-55.6-56zM197 371.3c-.2 14.7-12.1 26.6-26.9 26.6H87.4c-14.8.1-26.9-11.8-27-26.6V117.1c0-14.8 12-26.9 26.9-26.9h82.9c14.8 0 26.9 12 26.9 26.9v254.2zm193.1-112c0 14.8-12 26.9-26.9 26.9h-81c-14.8 0-26.9-12-26.9-26.9V117.2c0-14.8 12-26.9 26.8-26.9h81.1c14.8 0 26.9 12 26.9 26.9v142.1z"
        />
      </Svg>
      </Overlay>
      </AnimatePresence>
    ) : null }

    <DragDropContext onDragEnd={onDragEnd}>
      { isCreate.isAppear ? (
        <>
          <Button style={{transform: 'rotate(45deg)'}} onClick={onButtonClick}><FontAwesomeIcon icon={faPlus}/></Button>
          <Overlay>
            <CreateBoard key={Date.now()}/> 
          </Overlay>
        </>
      ) : (
        <Button onClick={onButtonClick}><FontAwesomeIcon icon={faPlus}/></Button>
      ) 
      }
      <Droppable droppableId="board" type="droppableItem" direction="horizontal">
        {(provided, snapshot) => (
          <Wrapper>
            <Boards 
              ref={provided.innerRef} 
              {...provided.droppableProps}>
            {boardList.map((boardId, index) => (
              <Draggable key={boardId} draggableId={boardId} index={index}>
                {(provided, snapshot) => (
                    <div ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}>
                    <Board key={boardId} boardId={boardId} toDos={toDos[boardId]}/>
                    </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
            </Boards>
          </Wrapper>
        )}
      </Droppable>
    </DragDropContext>
    </>
  );
}

export default App;
