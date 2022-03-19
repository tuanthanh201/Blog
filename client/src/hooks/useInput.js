import { useState } from 'react'

const useInput = (validateValue, initValue) => {
  const [value, setValue] = useState(initValue ? initValue : '')
  const [isTouched, setIsTouched] = useState(false)

  const valueIsValid = validateValue(value)
  const valueIsInvalid = !valueIsValid && isTouched

  const valueChangeHandler = (event) => {
    setValue(event.target.value)
  }

  const valueBlurHandler = () => {
    setIsTouched(true)
  }

  const addToInput = (toAdd) => {
    setValue((prev) => prev + toAdd)
  }

  const reset = () => {
    setValue(initValue ? initValue : '')
    setIsTouched(false)
  }

  return {
    value: value,
    valueIsValid,
    valueIsInvalid,
    valueChangeHandler,
    valueBlurHandler,
    addToInput,
    reset,
  }
}

export default useInput
