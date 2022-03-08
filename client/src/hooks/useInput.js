import { useReducer } from 'react'

const initialInputState = {
  value: '',
  isTouched: false,
}

const inputStateReducer = (state, action) => {
  if (action.type === 'INPUT') {
    return { value: action.value, isTouched: state.isTouched }
  } else if (action.type === 'BLUR') {
    return { value: state.value, isTouched: true }
  }
  return initialInputState
}

const useInput = (validateValue, initialState = initialInputState) => {
  const [inputState, dispatch] = useReducer(
    inputStateReducer,
    initialState
  )

  const valueIsValid = validateValue(inputState.value)
  const valueIsInvalid = !valueIsValid && inputState.isTouched

  const valueChangeHandler = (event) => {
    dispatch({ type: 'INPUT', value: event.target.value })
  }

  const valueBlurHandler = () => {
    dispatch({ type: 'BLUR' })
  }

  const reset = () => {
    dispatch({ type: 'RESET' })
  }

  return {
    value: inputState.value,
    valueIsValid,
    valueIsInvalid,
    valueChangeHandler,
    valueBlurHandler,
    reset,
  }
}

export default useInput
