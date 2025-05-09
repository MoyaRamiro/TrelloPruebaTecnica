import { BoardData } from "@/types/boardData";
import { BoardItem } from "@/types/boardItem";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
  arrayMove,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

interface BoardListProps {
  id: string;
  title: string;
  elements: BoardItem[];
  removeBoard: (id: string) => void;
  boardsData: BoardData[];
  updateSocket: (data: BoardData[]) => void;
  setBoardData: (data: BoardData[]) => void;
}

// Componente Sortable para las cards
function SortableCard({
  card,
  removeCard,
  toggleCardChecked,
  updateCardName,
}: {
  card: BoardItem;
  removeCard: (id: string) => void;
  toggleCardChecked: (id: string) => void;
  updateCardName: (id: string, name: string) => void;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <li ref={setNodeRef} style={style} {...attributes} {...listeners}>
      <div className="kanban-handle flex items-center w-full max-w-xs p-3.5 text-gray-300 bg-gray-700 my-2 rounded-xl hover:border-2 hover:border-gray-500 focus-within:border-2 focus-within:border-gray-500">
        <div className="flex">
          <input
            type="checkbox"
            checked={card.isChecked}
            onChange={() => toggleCardChecked(card.id)}
            className="w-4 h-4 rounded-full bg-gray-700 text-blue-600"
          />
          <label htmlFor="default-checkbox" className=""></label>
        </div>

        <textarea
          ref={(el) => {
            if (el) {
              el.style.height = "auto";
              el.style.height = `${el.scrollHeight}px`;
            }
          }}
          value={card.name}
          onChange={(e) => updateCardName(card.id, e.target.value)}
          className="p-1 mr-3 ms-3 text-sm font-normal break-words overflow-hidden bg-transparent w-full resize-none"
          rows={1}
        />

        <button
          type="button"
          className="cursor-pointer ms-auto -mx-1.5 -my-1.5 bg-white text-gray-400 hover:text-gray-900 rounded-lg focus:ring-2 focus:ring-gray-300 p-1.5 hover:bg-gray-100 inline-flex items-center justify-center h-8 w-8 dark:text-gray-500 dark:hover:text-white dark:bg-gray-700 dark:hover:bg-gray-700"
          onClick={() => removeCard(card.id)}
        >
          <svg className="w-3 h-3">
            <use href="icons.svg#cross" />
          </svg>
        </button>
      </div>
    </li>
  );
}

const Board = ({
  id,
  title,
  elements,
  removeBoard,
  boardsData,
  updateSocket,
  setBoardData,
}: BoardListProps) => {
  const [cards, setCards] = useState<BoardItem[]>(elements);
  const [newName, setNewName] = useState("");
  const [boardTitle, setBoardTitle] = useState(title);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const removeCard = (id: string) => {
    const newList = cards.filter((item) => item.id !== id);
    setCards(newList);
    updateCardsSocket(newList);
  };

  const addCard = (name: string) => {
    const newCard = { id: uuidv4(), name, isChecked: false };
    setCards([...cards, newCard]);
    updateCardsSocket([...cards, newCard]);
  };

  const toggleCardChecked = (id: string) => {
    const newCards = cards.map((c) =>
      c.id === id ? { ...c, isChecked: !c.isChecked } : c
    );
    setCards(newCards);
    updateCardsSocket(newCards);
  };

  const updateCardName = (id: string, name: string) => {
    const newCards = cards.map((c) => (c.id === id ? { ...c, name } : c));
    setCards(newCards);
    updateCardsSocket(newCards);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = cards.findIndex((c) => c.id === active.id);
    const newIndex = cards.findIndex((c) => c.id === over.id);

    const newCards = arrayMove(cards, oldIndex, newIndex);
    setCards(newCards);
    updateCardsSocket(newCards);
  };

  const updateCardsSocket = (newCards: BoardItem[]) => {
    setBoardData(
      boardsData.map((board) =>
        board.id === id ? { ...board, elements: newCards } : board
      )
    );

    updateSocket(
      boardsData.map((board) =>
        board.id === id ? { ...board, elements: newCards } : board
      )
    );
  };

  const updateBoardTitle = (newTitle: string) => {
    setBoardTitle(newTitle);
    setBoardData(
      boardsData.map((board) =>
        board.id === id ? { ...board, title: newTitle } : board
      )
    );
    updateSocket(
      boardsData.map((board) =>
        board.id === id ? { ...board, title: newTitle } : board
      )
    );
  };

  return (
    <div className="my-5 mx-1 p-5 w-96">
      <div className="bg-gray-800 rounded-xl p-5">
        <div className="flex justify-between">
          <h2 className="break-words opacity-90 text-2xl font-bold pb-3">
            <textarea
              ref={(el) => {
                if (el) {
                  el.style.height = "auto";
                  el.style.height = `${el.scrollHeight}px`;
                }
              }}
              className="break-words overflow-hidden resize-none text-3xl bg-transparent text-white/90 outline-none border-b-2 border-transparent focus:border-blue-500 transition-all duration-300 w-full max-w-xl mx-auto pl-2"
              value={boardTitle}
              onChange={(e) => updateBoardTitle(e.target.value)}
              rows={1}
            />
          </h2>
          <button
            className="text-red px-3 py-2 rounded-md cursor-pointer"
            onClick={() => removeBoard(id)}
          >
            <svg className="w-3 h-3 hover:text-black">
              <use href="icons.svg#cross" />
            </svg>
          </button>
        </div>

        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={cards.map((c) => c.id)}
            strategy={verticalListSortingStrategy}
          >
            <ul>
              {cards.map((card) => (
                <SortableCard
                  key={card.id}
                  card={card}
                  removeCard={removeCard}
                  toggleCardChecked={toggleCardChecked}
                  updateCardName={updateCardName}
                />
              ))}
            </ul>
          </SortableContext>
        </DndContext>

        <div className="AddCard">
          <label
            htmlFor={title}
            className="text-gray-400 hover:text-gray-900 rounded-lg w-fit dark:text-gray-500 focus:text-black cursor-pointer"
          >
            <div className="flex items-center w-full p-2 max-w-xs text-gray-300 bg-gray-800 rounded-xl hover:bg-gray-700">
              <input type="checkbox" id={title} className="hidden peer" />

              <svg className="w-6 h-6 mr-1.5 items-center peer-checked:hidden hover:text-gray-900">
                <use href="icons.svg#add" />
              </svg>

              <label
                htmlFor={title}
                className="mr-1.5 text-gray-400 hover:text-gray-900 rounded-lg p-1.5 w-fit h-8 dark:text-gray-500 focus:text-black cursor-pointer hidden peer-checked:block"
              >
                <svg className="w-4 h-4 items-center">
                  <use href="icons.svg#cross" />
                </svg>
              </label>

              <span className="w-fit mt-2 peer-checked:hidden text-gray-400 cursor-pointer">
                Añadir tarjeta...
              </span>

              <div className="flex-col w-full hidden peer-checked:flex">
                <form>
                  <textarea
                    className="p-5 resize-none border-gray-700 border-2 w-full bg-transparent text-gray-300 focus:outline-none overflow-hidden px-5 pt-1 rounded-lg min-h-16"
                    rows={2}
                    value={newName || ""}
                    placeholder="Escribe el título de la tarjeta..."
                    onChange={(e) => setNewName(e.target.value)}
                    ref={(el) => {
                      if (el) {
                        el.style.height = "auto";
                        el.style.height = `${el.scrollHeight}px`;
                      }
                    }}
                  />
                  <div className="flex justify-end w-full">
                    <label
                      className="mr-5 rounded-lg bg-transparent text-gray-300 cursor-pointer hover:bg-gray-900 w-fit p-2"
                      htmlFor={title}
                      onClick={() => {
                        addCard(newName);
                        setNewName("");
                      }}
                    >
                      Añadir
                    </label>
                  </div>
                </form>
              </div>
            </div>
          </label>
        </div>
      </div>
    </div>
  );
};

export default Board;
