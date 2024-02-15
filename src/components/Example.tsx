import {useExampleStore} from '../example-store';

export default function Example() {
  const {count, increment, decrement} = useExampleStore();

  return (
    <>
      Count: {count}
      <button onClick={increment}>+</button>
      <button onClick={decrement}>-</button>
    </>
  );
}
