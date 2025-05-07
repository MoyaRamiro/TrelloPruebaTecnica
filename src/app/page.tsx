"use client";
import { BoardItem } from "@/types/boardItem";
import { BoardData } from "@/types/boardData";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import Board from "./board";
import BoardForm from "./boardForm";

export default function Home() {
  const elements1: BoardItem[] = [
    { id: uuidv4(), name: "Depeche" },
    { id: uuidv4(), name: "Duran" },
    { id: uuidv4(), name: "Pet" },
    { id: uuidv4(), name: "Kraftwerk" },
  ];

  const elements2: BoardItem[] = [
    { id: uuidv4(), name: "hola" },
    { id: uuidv4(), name: "mina" },
    { id: uuidv4(), name: "xd" },
    { id: uuidv4(), name: "4" },
  ];

  const elements3: BoardItem[] = [
    { id: uuidv4(), name: "asdf" },
    { id: uuidv4(), name: "sdfgsdfg" },
    { id: uuidv4(), name: "xsdfgsdfgd" },
    { id: uuidv4(), name: "sdfgssdgfsfg" },
  ];

  const [boards, setBoards] = useState<BoardData[]>([
    { id: uuidv4(), title: "Pendientes", elements: elements1 },
    { id: uuidv4(), title: "Hecho", elements: elements2 },
    { id: uuidv4(), title: "En progreso", elements: elements3 },
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
