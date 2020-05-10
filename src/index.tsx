import React, { useState } from 'react';
import ReactDOM from 'react-dom';
import './index.css';

type SquareValue = string | null;
type Squares = Array<SquareValue>;
type Highlights = Array<number>;

interface SquareProps {
  value: SquareValue;
  onClick: () => void;
  isHighlight: boolean;
}

function Square(props: SquareProps) {
  const background = props.isHighlight ? '#f55' : '#fff';

  return (
    <button className="square" onClick={props.onClick} style={{background: background}}>
      {props.value}
    </button>
  );
}

interface BoardProps {
  squares: Squares;
  shape: { "col": number, "row": number };
  onClick: (i: number) => void;
  highlights: Highlights;
}

function Board(props: BoardProps) {
  const renderSquare = (i: number, isHighlight: boolean) => {
    return (
      <Square
        value={props.squares[i]}
        onClick={() => props.onClick(i)}
        isHighlight={isHighlight}
      />);
  }

  const col = props.shape.col;
  const row = props.shape.row;

  return (
    <div>
      {Array.from(Array(row).keys()).map((i) => {
        return (
          <div className="board-row" key={i}>
            {Array.from(Array(col).keys()).map((j) => {
              const index = j + col * i;
              const isHighlight = props.highlights.includes(index);
              return renderSquare(index, isHighlight);
            })}
          </div>
        );
      })}
    </div>
  );
}

type History = Array<{
  squares: Squares;
  position: number | null;
}>;
type Sort = "asc" | "desc";

function Game() {
  const [history, setHistory] = useState<History>([{
    squares: Array(9).fill(null),
    position: null,
  }]);
  const [stepNumber, setStepNumber] = useState(0);
  const [xIsNext, setXIsNext] = useState(true);
  const [sort, setSort] = useState<Sort>("asc");

  const handleClick = (i: number): void => {
    const historyCp = history.slice(0, stepNumber + 1);
    const current = historyCp[history.length - 1];
    const squares = current.squares.slice();

    if (calculateResult(squares) || squares[i]) {
      return;
    }

    squares[i] = xIsNext ? 'X' : 'O';
    setHistory(historyCp.concat([{
      squares: squares,
      position: i,
    }]));
    setStepNumber(history.length);
    setXIsNext(!xIsNext);
  }

  const jumpTo = (step: number): void => {
    setStepNumber(step);
    setXIsNext((step % 2) === 0);
  }

  const sortHistory = (): void => {
    setSort(sort === 'asc' ? 'desc' : 'asc');
    setHistory(history.reverse());
  }

  let historyCp = history;
  const current = history[stepNumber];
  const result = calculateResult(current.squares);
  const highlights = calculateHighlights(current.squares);

  const COL = 3;
  const ROW = 3;

  const moves = historyCp.map((step, move) => {
    const desc = step.position !== null ?
      'Go to move #(' + (step.position % COL + 1)  + ', ' + (Math.floor(step.position / ROW) + 1) + ')' :
      'Go to game start';

    const fontWeight = (move === stepNumber) ? 'bold' : 'normal';

    return (
      <li key={move}>
        <button onClick={() => jumpTo(move)}>
          <span style={{fontWeight: fontWeight}}>{desc}</span>
        </button>
      </li>
    );
  });

  let status;
  if (result === 'settled') {
    status = 'Winner: ' + (xIsNext ? 'O' : 'X');
  } else if (result === 'draw') {
    status = 'Draw';
  } else {
    status = 'Next player: ' + (xIsNext ? 'X' : 'O');
  }

  return (
    <div className="game">
      <div className="game-board">
        <Board
          squares={current.squares}
          shape={{col: COL, row: ROW}}
          onClick= {(i) => handleClick(i)}
          highlights={highlights}
        />
      </div>
      <div className="game-info">
        <div>{status}</div>
        <div>
          <button onClick={() => sortHistory()}>sort</button>
        </div>
        <ol>{moves}</ol>
      </div>
    </div>
  );
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

function calculateResult(squares: Squares): string | null {
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
      return 'settled';
    }
  }

  if (squares.includes(null)) {
    return null
  }

  return 'draw';
}

function calculateHighlights(squares: Squares): Highlights {
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

  const highlights = [];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      highlights.push(a);
      highlights.push(b);
      highlights.push(c);
    }
  }

  return highlights;
}
