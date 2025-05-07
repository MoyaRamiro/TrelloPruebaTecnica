"use client";
import { BoardItem } from "@/types/boardItem";
import { BoardData } from "@/types/boardData";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Board from "./board";
import BoardForm from "./boardForm";

export default function Home() {
  const elements1: BoardItem[] = [
    { id: uuidv4(), name: "Estudiar", isChecked: false },
    { id: uuidv4(), name: "Trabajar", isChecked: false },
    { id: uuidv4(), name: "Hacer ejercicio", isChecked: true },
    { id: uuidv4(), name: "Comprar comida", isChecked: true },
  ];

  const elements2: BoardItem[] = [
    { id: uuidv4(), name: "Hacer prueba tecnica", isChecked: false },
    { id: uuidv4(), name: "Producir", isChecked: false },
    { id: uuidv4(), name: "Bailar zamba", isChecked: true },
    { id: uuidv4(), name: "Jugar videojuegos", isChecked: false },
  ];

  const elements3: BoardItem[] = [
    { id: uuidv4(), name: "Salir al parque", isChecked: true },
    { id: uuidv4(), name: "Ver pelicula", isChecked: true },
    { id: uuidv4(), name: "Andar a caballo", isChecked: true },
    { id: uuidv4(), name: "Maradona", isChecked: true },
  ];

  const [boards, setBoards] = useState<BoardData[]>([
    { id: uuidv4(), title: "To Do", elements: elements1 },
    { id: uuidv4(), title: "En progreso", elements: elements2 },
    { id: uuidv4(), title: "Hecho", elements: elements3 },
  ]);

  const [wallTitle, setWallTitle] = useState("Mi Pared de Tableros");

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-gray-900 to-gray-950 text-white">
      {/* Header */}
      <div className="w-full p-6 bg-black shadow-lg z-10">
        <input
          className="text-4xl font-bold bg-transparent text-white outline-none border-b-2 border-transparent focus:border-blue-500 transition-all duration-300 w-full max-w-xl mx-auto pl-6"
          value={wallTitle}
          onChange={(e) => setWallTitle(e.target.value)}
        />
      </div>

      {/* Tableros */}
      <div className="flex-1 overflow-x-auto p-6">
        <div className="flex gap-6 min-w-max h-full">
          {boards.map((board) => (
            <div key={board.id} className="flex-shrink-0">
              <Board title={board.title} elements={board.elements} />
            </div>
          ))}

          {/* Agregar nueva columna */}
          <div className="flex-shrink-0">
            <BoardForm setBoards={setBoards} boards={boards} />
          </div>
        </div>
      </div>
    </div>
  );
}
