import { useState } from "react";

export default function App() {
  const emptyBoard = Array.from({ length: 9 }, () => Array(9).fill(""));
  const [board, setBoard] = useState(emptyBoard);
  const [solution, setSolution] = useState(null);

  const updateCell = (row, col, value) => {
    const newBoard = board.map((r, i) =>
      r.map((c, j) => (i === row && j === col ? value.replace(/[^1-9]/g, "") : c))
    );
    setBoard(newBoard);
  };

  const solve = () => {
    const copied = board.map(row => row.map(cell => (cell === "" ? "." : cell)));
    if (solveSudoku(copied)) {
      setSolution(copied);
    } else {
      setSolution("❌ Невозможно решить");
    }
  };

  const generateSudoku = (difficulty = "easy") => {
    const board = generateSolvedBoard();
    const puzzle = maskBoard(board, difficulty);
    setBoard(puzzle);
    setSolution(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-gray-800 to-slate-900 text-white flex flex-col items-center justify-center p-4 font-sans">
      <h1 className="text-4xl md:text-5xl font-extrabold mb-6 text-center text-white drop-shadow-lg">🧩 Sudoku Solver for my love Balauka</h1>

      <div className="mb-6 flex flex-wrap gap-3 justify-center">
        <button
          onClick={() => generateSudoku("easy")}
          className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-5 py-2 rounded-full shadow-md transition"
        >
          Лёгкий
        </button>
        <button
          onClick={() => generateSudoku("medium")}
          className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-semibold px-5 py-2 rounded-full shadow-md transition"
        >
          Средний
        </button>
        <button
          onClick={() => generateSudoku("hard")}
          className="bg-rose-500 hover:bg-rose-600 text-white font-semibold px-5 py-2 rounded-full shadow-md transition"
        >
          Сложный
        </button>
      </div>

      <div className="bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-2xl border border-slate-700 max-w-full overflow-auto">
        <div className="grid grid-cols-9">
          {board.map((row, i) =>
            row.map((cell, j) => (
              <input
                key={`${i}-${j}`}
                value={board[i][j]}
                onChange={(e) => updateCell(i, j, e.target.value)}
                maxLength={1}
                className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 text-center text-lg md:text-xl font-bold border ${
                  (i % 3 === 2 && i !== 8 ? "border-b-4 border-b-slate-600" : "border-slate-600") +
                  (j % 3 === 2 && j !== 8 ? " border-r-4 border-r-slate-600" : "")
                } bg-slate-900 text-white outline-none focus:ring-2 focus:ring-indigo-400 transition-all duration-200`}
              />
            ))
          )}
        </div>
      </div>

      <button
        onClick={solve}
        className="mt-8 bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 text-lg font-semibold rounded-full transition-all shadow-lg"
      >
        Решить
      </button>

      {solution && (
        <div className="mt-10 text-center">
          <h2 className="text-2xl font-bold mb-4">Решение</h2>
          {typeof solution === "string" ? (
            <p className="text-red-500 font-semibold">{solution}</p>
          ) : (
            <div className="inline-block p-4 bg-slate-700 rounded-2xl shadow-xl border border-slate-600 max-w-full overflow-auto">
              <div className="grid grid-cols-9">
                {solution.map((row, i) =>
                  row.map((cell, j) => (
                    <div
                      key={`sol-${i}-${j}`}
                      className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center bg-slate-900 text-white border ${
                        (i % 3 === 2 && i !== 8 ? "border-b-4 border-b-slate-600" : "border-slate-600") +
                        (j % 3 === 2 && j !== 8 ? " border-r-4 border-r-slate-600" : "")
                      } rounded-md text-base md:text-lg font-bold`}
                    >
                      {cell}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

function solveSudoku(board) {
  const isValid = (r, c, ch) => {
    for (let i = 0; i < 9; i++) {
      if (board[r][i] === ch || board[i][c] === ch) return false;
    }
    const br = 3 * Math.floor(r / 3), bc = 3 * Math.floor(c / 3);
    for (let i = br; i < br + 3; i++) {
      for (let j = bc; j < bc + 3; j++) {
        if (board[i][j] === ch) return false;
      }
    }
    return true;
  };

  const solve = () => {
    for (let i = 0; i < 9; i++) {
      for (let j = 0; j < 9; j++) {
        if (board[i][j] === ".") {
          for (let ch = 1; ch <= 9; ch++) {
            if (isValid(i, j, ch.toString())) {
              board[i][j] = ch.toString();
              if (solve()) return true;
              board[i][j] = ".";
            }
          }
          return false;
        }
      }
    }
    return true;
  };

  return solve();
}

function generateSolvedBoard() {
  const board = Array.from({ length: 9 }, () => Array(9).fill("."));
  solveSudoku(board);
  return board.map(row => [...row]);
}

function maskBoard(board, difficulty) {
  const levels = { easy: 35, medium: 45, hard: 55 };
  const masked = board.map(row => [...row]);
  let blanks = levels[difficulty] || 45;
  while (blanks > 0) {
    const i = Math.floor(Math.random() * 9);
    const j = Math.floor(Math.random() * 9);
    if (masked[i][j] !== "") {
      masked[i][j] = "";
      blanks--;
    }
  }
  return masked;
}
