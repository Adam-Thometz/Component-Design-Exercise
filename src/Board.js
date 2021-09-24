import React, { useState } from "react";
import Cell from "./Cell";
import "./Board.css";
import _ from "lodash";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows = 5, ncols = 5, chanceLightStartsOn = 0.5 }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    const initialBoard = [];
    for (let y = 0; y < nrows; y++) {
      const row = []
      for (let x = 0; x < ncols; x++) {
        const isOn = Math.random() < chanceLightStartsOn
        row.push(isOn)
      }
      initialBoard.push(row)
    }
    return initialBoard;
  }

  function hasWon() {
    // TODO: check the board in state to determine whether the player has won.
    return board.every(row => {
      row.every(cell => cell === false)
    })
  }

  function flipCellsAround(coord) {
    setBoard(oldBoard => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      const newBoard = _.cloneDeep(oldBoard)

      flipCell(y, x, newBoard)     // center
      flipCell(y + 1, x, newBoard) // top
      flipCell(y - 1, x, newBoard) // bottom
      flipCell(y, x + 1, newBoard) // right
      flipCell(y, x - 1, newBoard) // left

      return newBoard
    });
  }

  if (hasWon()) return (
    <div>
      <h1>You won the game!!</h1>
      <button onClick={createBoard}>Play again</button>
    </div>
  )

  const tableBoard = []

  for (let y = 0; y < nrows; y++) {
    const row = []
    for (let x = 0; x < ncols; x++) {
      const coord = `${y}-${x}`
      row.push(
        <Cell 
          key={coord}
          isLit={board[y][x]}
          flipCellsAroundMe={() => flipCellsAround(coord)}
        />
      )
    }
    tableBoard.push(<tr key={y}>{row}</tr>)
  }
  return (
    <table className="Board">
      <tbody>{tableBoard}</tbody>
    </table>
  );
}

export default Board;
