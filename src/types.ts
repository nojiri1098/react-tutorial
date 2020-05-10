export type SquareValue = string | null;
export type Squares = Array<SquareValue>;
export type Position = number | null;
export type Sort = 'asc' | 'desc';
export type StepNumber = number;
export type Highlights = Array<number>;

export interface SquareProps {
  value: SquareValue;
  onClick: () => void;
  isHighlight: boolean;
}

export interface BoardProps {
  squares: Squares;
  shape: { "col": number, "row": number };
  onClick: (i: number) => void;
  highlights: Highlights;
}

export interface GameProps { }

export interface GameState {
  history: Array<{
    squares: Squares;
    position: Position;
  }>;
  stepNumber: number;
  xIsNext: boolean;
  sort: Sort;
}
