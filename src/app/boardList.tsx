import { BoardData } from "@/types/boardData";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  horizontalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import Board from "./board";
import BoardForm from "./boardForm";

interface BoardListProps {
  updateBoardsSocket: (boards: BoardData[]) => void;
  setBoardData: (data: BoardData[]) => void;
  boardData: BoardData[];
}

//Componente sorteable para los boards
function SortableBoard({
  board,
  removeBoard,
  boardData,
  setBoardData,
  updateSocket,
}: {
  board: BoardData;
  removeBoard: (id: string) => void;
  boardData: BoardData[];
  updateSocket: (data: BoardData[]) => void;
  setBoardData: (data: BoardData[]) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: board.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className="flex-shrink-0"
    >
      <div className="kanban-handle">
        <Board
          id={board.id}
          title={board.title}
          elements={board.elements}
          removeBoard={removeBoard}
          boardsData={boardData}
          updateSocket={updateSocket}
          setBoardData={setBoardData}
        />
      </div>
    </li>
  );
}

const BoardList = ({
  updateBoardsSocket,
  setBoardData,
  boardData,
}: BoardListProps) => {
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = boardData.findIndex((b) => b.id === active.id);
    const newIndex = boardData.findIndex((b) => b.id === over.id);

    const newBoardData = arrayMove(boardData, oldIndex, newIndex);
    setBoardData(newBoardData);
    updateBoardsSocket(newBoardData);
  };

  const removeBoard = (id: string) => {
    const newBoards = boardData.filter((board) => board.id !== id);
    setBoardData(newBoards);
    updateBoardsSocket(newBoards);
  };

  return (
    <div className="flex-1 overflow-x-auto p-6">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={boardData.map((b) => b.id)}
          strategy={horizontalListSortingStrategy}
        >
          <div className="flex gap-6 min-w-max h-full">
            <ul className="flex flex-row list-none">
              {boardData.map((board) => (
                <SortableBoard
                  key={board.id}
                  board={board}
                  removeBoard={removeBoard}
                  boardData={boardData}
                  updateSocket={updateBoardsSocket}
                  setBoardData={setBoardData}
                />
              ))}
            </ul>
            <div className="flex-shrink-0">
              <BoardForm
                setBoards={setBoardData}
                boards={boardData}
                updateSocket={updateBoardsSocket}
              />
            </div>
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
};

export default BoardList;
