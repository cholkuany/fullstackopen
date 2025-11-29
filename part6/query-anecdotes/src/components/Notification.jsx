import { useContext } from "react"
import AnecdoteContext from "../AnecdoteContext"

const Notification = () => {
  const { notification} = useContext(AnecdoteContext)
  const style = {
    border: 'solid',
    padding: 10,
    borderWidth: 1,
    marginBottom: 5
  }
  console.log(notification)
  if (!notification) return null

  return (
    <div style={style}>
      {notification}
    </div>
  )
}

export default Notification
