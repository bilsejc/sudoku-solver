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

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-100 to-pink-200 text-pink-900 flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl md:text-4xl font-bold mb-6 tracking-tight text-center">🌸 Sudoku Solver for my love Balauka 🌸</h1>

      <div className="bg-white p-4 rounded-2xl shadow-xl border-4 border-pink-300 max-w-full overflow-auto">
        <div className="grid grid-cols-9 gap-[2px]">
          {board.map((row, i) =>
            row.map((cell, j) => (
              <input
                key={`${i}-${j}`}
                value={board[i][j]}
                onChange={(e) => updateCell(i, j, e.target.value)}
                maxLength={1}
                className={`w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 text-center text-lg md:text-xl font-medium border border-pink-300 bg-pink-50 outline-none focus:ring-2 focus:ring-pink-400 transition-all duration-200 rounded-md shadow-sm ${
                  (i % 3 === 2 && i !== 8 ? "mb-2" : "") +
                  (j % 3 === 2 && j !== 8 ? " mr-2" : "")
                }`}
              />
            ))
          )}
        </div>
      </div>

      <button
        onClick={solve}
        className="mt-6 sm:mt-8 bg-pink-500 text-white px-6 py-2 sm:px-8 sm:py-3 text-base sm:text-lg font-semibold rounded-xl hover:bg-pink-600 transition-all shadow-md"
      >
        💖 Решить 💖
      </button>

      {solution && (
        <div className="mt-8 sm:mt-10 text-center">
          <h2 className="text-xl sm:text-2xl font-semibold mb-3">✨ Решение ✨</h2>
          {typeof solution === "string" ? (
            <p className="text-red-600 font-semibold">{solution}</p>
          ) : (
            <div className="inline-block p-4 bg-pink-50 rounded-2xl shadow-lg border border-pink-200 max-w-full overflow-auto">
              <div className="grid grid-cols-9 gap-[2px]">
                {solution.map((row, i) =>
                  row.map((cell, j) => (
                    <div
                      key={`sol-${i}-${j}`}
                      className="w-9 h-9 sm:w-10 sm:h-10 md:w-12 md:h-12 flex items-center justify-center bg-white border border-pink-300 rounded-md text-base md:text-lg font-medium"
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

      <div className="mt-6 text-sm text-pink-700">🌷 Made with love and flowers 🌷</div>
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

