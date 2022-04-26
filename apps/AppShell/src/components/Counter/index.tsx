import {useDispatch, useSelector} from 'react-redux'

import {RootState, counterActions} from '../../store'

const {increment, set} = counterActions

const Counter = () => {
  const count = useSelector((state: RootState) => state.counter.value)
  const dispatch = useDispatch()

  return (
    <div>
      <h2>Count: {count}</h2>
      <button onClick={() => dispatch(increment())}>Make number go up plz</button>
      <button onClick={() => dispatch(set(0))}>Reset</button>
    </div>
  )
}
export default Counter