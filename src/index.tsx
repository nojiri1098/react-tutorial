import React from 'react';
import ReactDOM from 'react-dom';
import { createStore } from 'redux';
import { app } from './modules/reducers';
import './index.css';
import { calculateResult } from './util';
import {
  Squares,
  Highlights,
  SquareProps,
  BoardProps,
  GameProps,
  GameState,
} from './types';

function Square(props: SquareProps) {
  const background = props.isHighlight ? '#f55' : '#fff';

  return (
    <button className="square" onClick={props.onClick} style={{background: background}}>
      {props.value}
    </button>
  );
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

class Game extends React.Component<GameProps, GameState> {
  constructor(props: any) {
    super(props);
    this.state = {
      history: [{
        squares: Array(9).fill(null),
        position: null,
      }],
      stepNumber: 0,
      xIsNext: true,
      sort: 'asc',
    };
  }

  handleClick(i: number): void {

  }

  jumpTo(step: number): void {

  }

  sortHistory(): void {

  }

  render() {
    let history = this.state.history;
    const current = history[this.state.stepNumber];
    const result = calculateResult(current.squares);
    const highlights = calculateHighlights(current.squares);

    const COL = 3;
    const ROW = 3;

    const moves = history.map((step, move) => {
      const desc = step.position !== null ?
        'Go to move #(' + (step.position % COL + 1)  + ', ' + (Math.floor(step.position / ROW) + 1) + ')' :
        'Go to game start';

      const fontWeight = (move === this.state.stepNumber) ? 'bold' : 'normal';

      return (
        <li key={move}>
          <button onClick={() => this.jumpTo(move)}>
            <span style={{fontWeight: fontWeight}}>{desc}</span>
          </button>
        </li>
      );
    });

    let status;
    if (result === 'settled') {
      status = 'Winner: ' + (this.state.xIsNext ? 'O' : 'X');
    } else if (result === 'draw') {
      status = 'Draw';
    } else {
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            shape={{col: COL, row: ROW}}
            onClick= {(i) => this.handleClick(i)}
            highlights={highlights}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <div>
            <button onClick={() => this.sortHistory()}>sort</button>
          </div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

const store = createStore(app);
ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

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
