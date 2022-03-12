import { Loader } from 'semantic-ui-react'

const Spinner = () => {
  return (
    <div style={{ height: '100vh' }}>
      <Loader active inline="centered" />
    </div>
  )
}

export default Spinner
