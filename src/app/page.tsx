"use client";
import { useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";
import { BoardData } from "@/types/boardData";
import BoardList from "./boardList";

export default function Home() {
  const socketRef = useRef<Socket | null>(null);
  const [boardData, setBoardData] = useState<BoardData[]>([]);
  const [isUpdated, setIsUpdated] = useState(false);

  useEffect(() => {
    if (!socketRef.current) {
      socketRef.current = io("http://localhost:3001");

      socketRef.current.on("connect", () => {
        console.log("✅ Conectado al servidor");
      });

      socketRef.current.on("initialBoardData", (data: BoardData[]) => {
        setBoardData(data);
      });

      socketRef.current.on("update", (data: BoardData[]) => {
        setBoardData(data);
        setIsUpdated(true);
      });
    }

    return () => {
      socketRef.current?.disconnect();
      socketRef.current = null;
    };
  }, []);

  const updateBoardsSocket = (data: BoardData[]) => {
    socketRef.current?.emit("boardUpdate", { boardData: data });
  };

  return (
    <div className="h-screen w-full flex flex-col bg-gradient-to-br from-gray-900 to-gray-950 text-white">
      <div className="w-full p-6 bg-black shadow-lg z-10">
        {isUpdated && (
          <div className="text-green-500 text-sm">
            {/* Boton implementado para las cards. Los boards no lo necesitan*/}
            <button
              onClick={() => {
                setIsUpdated(false);
                window.location.reload();
              }}
              className="flex items-center text-green-500 text-sm"
            >
              Datos actualizados...
              <span className="ml-5 p-5 bg-green-900 rounded-lg hover:bg-green-800 cursor-pointer">
                Refrescar pagina
              </span>
            </button>
          </div>
        )}
      </div>
      <BoardList
        updateBoardsSocket={updateBoardsSocket}
        setBoardData={setBoardData}
        boardData={boardData}
      />
    </div>
  );
}
