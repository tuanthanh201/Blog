import { Button, Icon } from 'semantic-ui-react'

const FadeButton = (props) => {
  const { icon, content, onClick, negative } = props
  return (
    <Button
      style={{ margin: 0 }}
      animated="fade"
      negative={negative}
      onClick={onClick}>
      <Button.Content visible>
        <Icon name={icon} style={{ margin: 0 }} />
      </Button.Content>
      <Button.Content hidden>{content}</Button.Content>
    </Button>
  )
}

export default FadeButton
