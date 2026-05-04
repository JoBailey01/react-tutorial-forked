import { useState } from "react";

function Square({ value, onSquareClick, squareNum, winSquare }) {
  //console.error(">|"+squareColour+"|");
  return (
    <button
      className={winSquare ? "win-square" : "square"}
      onClick={() => onSquareClick(squareNum)}
    >
      {value}
    </button>
  );
}

function Board({ xIsNext, squares, onPlay }) {
  highlights = Array(9).fill(false); //Highlighted squares

  function handleClick(i) {
    //console.error("|"+i+"|");
    if (calculateWinner(squares)[0] || squares[i]) {
      return;
    }
    const nextSquares = squares.slice();
    if (xIsNext) {
      nextSquares[i] = "X";
    } else {
      nextSquares[i] = "O";
    }
    onPlay(nextSquares);
  }

  const winner = calculateWinner(squares);
  let status;
  if (winner[0]) {
    status = "Winner: " + winner[0];
    let tempArray = Array(9).fill(false);
    tempArray[winner[1]] = true;
    tempArray[winner[2]] = true;
    tempArray[winner[3]] = true;
    console.error(highlights);
    highlights = tempArray;
  } else {
    //Determine whether or not a draw has occurred (i.e., if the board is full)
    status = "Draw!";
    for (let i = 0; i < squares.length; i++) {
      if (!squares[i]) {
        status = "Next player: " + (xIsNext ? "X" : "O");
        break;
      }
    }
  }

  //Generate rows
  var rows = [];
  for (var i = 0; i < 3; i++) {
    var thisRow = [];
    for (var j = 0; j < 3; j++) {
      var index = j + i * 3;
      //(index) => {return squares[index]}
      //console.error("|"+index+"|");
      let winSquare = highlights[index];
      thisRow.push(
        <Square
          key={index}
          value={squares[index]}
          onSquareClick={function (k) {
            return handleClick(k);
          }}
          squareNum={index}
          winSquare={winSquare}
        />
      );
    }
    rows.push(
      <div key={i} className="board-row">
        {thisRow}
      </div>
    );
  }
  //squares = ["X","X",null,"O"];

  return (
    <>
      <div className="status">{status}</div>
      {rows}
    </>
  );
}

export default function Game() {
  const [history, setHistory] = useState([Array(9).fill(null)]);
  const [currentMove, setCurrentMove] = useState(0);
  const [reverseMoves, setReverseMoves] = useState(false);
  const xIsNext = currentMove % 2 === 0;
  const currentSquares = history[currentMove];

  function handlePlay(nextSquares) {
    const nextHistory = [...history.slice(0, currentMove + 1), nextSquares];
    setHistory(nextHistory);
    setCurrentMove(nextHistory.length - 1);
  }

  function jumpTo(nextMove) {
    setCurrentMove(nextMove);
  }
  /*
  const moves = history.map((squares, move) => {
    let description;
    if (move == currentMove){
      description = 'You are at move #' + move;
    } else if (move == 0){
      description = 'Go to game start';
    } else {
      description = 'Go to move #' + move;
    }
    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>{description}</button>
      </li>
    );
  });*/

  var moves = [];
  for (let i = 0; i < history.length; i++) {
    let moveData = "";
    //Compute recent move history, if applicable
    if (i > 0) {
      for (let j = 0; j < 9; j++) {
        if (history[i][j] != history[i - 1][j]) {
          let row = Math.floor(j / 3);
          let col = j - row * 3;
          row++;
          col++;
          moveData =
            " (" + (currentMove % 2 ? "O@" : "X@") + row + "," + col + ")";
        }
      }
    }

    if (!history[i]) break; //Ignore null
    let description;
    if (i == currentMove) {
      description = "You are at move #" + i + moveData;
    } else if (i == 0) {
      description = "Go to game start";
    } else {
      description = "Go to move #" + i + moveData;
    }

    moves.push(
      <li key={i}>
        <button onClick={() => jumpTo(i)}>{description}</button>
      </li>
    );
  }
  if (reverseMoves) moves.reverse();

  return (
    <div className="game">
      <div className="game-board">
        <Board xIsNext={xIsNext} squares={currentSquares} onPlay={handlePlay} />
      </div>
      <div className="game-info">
        <button
          onClick={() => {
            setReverseMoves(!reverseMoves);
          }}
        >
          Reverse move order
        </button>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return [squares[a], a, b, c];
    }
  }
  return [null];
}
