import { useState } from "react"
import Home from "./components/Home"


const App = () => {
  const [text, setText] = useState("testi")
  const [counter,  setCounter] = useState(0)

  return (
    <>
    <h2 onClick={() => {
      setCounter(counter + 1)
      setText("Uutta asiaa")
    }}>{text} Counter: {counter}</h2>
      <h1>My app</h1>
      <Home />
    </>
  )
}

export default App
