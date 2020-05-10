import { Position, Sort, StepNumber } from '../types';

export const CLICK_SQUARE = "CLICK_SQUARE";
export const CLICK_SORT = "CLICK_SORT";
export const CliCK_HISTORY = "CLICK_HISTORY";

export function clickSquare(position: Position) {
  return {
    type: CLICK_SQUARE,
    position: position,
  };
}

export function clickSort(sort: Sort) {
  return {
    type: CLICK_SORT,
  };
}

export function clickHistory(step: StepNumber) {
  return {
    type: CliCK_HISTORY,
    step: step,
  };
}
