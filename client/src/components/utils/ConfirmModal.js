import { Confirm } from 'semantic-ui-react'

const ConfirmModal = (props) => {
  const { content, cancelButton, confirmButton, open, onCancel, onConfirm } =
    props

  return (
    <Confirm
      confirmButton={confirmButton}
      content={content}
      cancelButton={cancelButton}
      open={open}
      onCancel={onCancel}
      onConfirm={onConfirm}
    />
  )
}

export default ConfirmModal
