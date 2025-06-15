import { useState } from 'react'
import { BrowserRouter,Route,Routes } from 'react-router-dom'
import Form from './pages/Form'
import Home from './pages/Home'

function App() {


  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<Home/>} />
          <Route path='/login' element={<Form/>}/>
          <Route path='/signUp' element={<Form/>}/>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
