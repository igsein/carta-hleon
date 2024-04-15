import React, {useState} from 'react'
import Menu from './pages/Menu'
import Home from './pages/Home'
const App = () => {

  const [resize,setResize] = useState(false)
  return (
    <div
 
   style={{marginTop: '-2%'}}
    
    
    
    
    
    ><Home setResize={setResize} /></div>
  )
}

export default App