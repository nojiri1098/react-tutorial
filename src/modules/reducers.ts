import { combineReducers } from 'redux';
import {
  CLICK_SQUARE,
  CLICK_SORT,
  CliCK_HISTORY,
} from './actions';
import {
  calculateResult
} from '../util';

const initialState = {
  history: [{
    squares: Array(9).fill(null),
    position: null,
  }],
  sort: "asc",
  stepNumber: 0,
  xIsNext: true,
}

function game(state = initialState, action: any) {
  switch (action.type) {
    case CLICK_SQUARE:
      const history = state.history.slice(0, state.stepNumber + 1);
      const current = history[state.history.length - 1];
      const squares = current.squares.slice();

      if (calculateResult(squares) || squares[action.position]) {
        return;
      }

      squares[action.position] = state.xIsNext ? 'X' : 'O';
      return {
        history: history.concat([{
          squares: squares,
          position: action.position,
        }]),
        stepNumber: history.length,
        xIsNext: !state.xIsNext,
      };
    case CLICK_SORT:
      const sort = state.sort === 'asc' ? 'desc' : 'asc';
      return {
        history: state.history.reverse(),
        sort: sort,
      };
    case CliCK_HISTORY:
      return {
        stepNumber: action.step,
        xIsNext: (action.step % 2) === 0,
      };
    default:
      return state;
  }
}

export const app = combineReducers({
  game,
});
