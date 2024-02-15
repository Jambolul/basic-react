import {useReducer} from 'react';

type State = {
  count: number;
};

type Action = {
  type: 'increment' | 'decrement';
  payload?: number;
};

const initialState: State = {count: 0};

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'increment':
      return {count: state.count + (action.payload ?? 1)};
    case 'decrement':
      return {count: state.count - (action.payload ?? 1)};
    default:
      throw new Error();
  }
};

const Counter = () => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <>
      Count: {state.count}
      <button onClick={() => dispatch({type: 'increment', payload: 30})}>+</button>
      <button onClick={() => dispatch({type: 'decrement'})}>-</button>
    </>
  );
};

export default Counter;
