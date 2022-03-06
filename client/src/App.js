import {
  BrowserRouter as Router,
  Navigate,
  Route,
  Routes,
} from 'react-router-dom'
import { Container } from 'semantic-ui-react'
import NavBar from './components/NavBar'
import Posts from './components/posts/Posts'
import Login from './components/auth/Login'
import Register from './components/auth/Register'
import "./App.css"

function App() {
  return (
    <>
      <Router>
        <Container>
          <NavBar />
          <Routes>
            <Route path="/" element={<Posts />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/register" element={<Register />}></Route>
            <Route path="*" element={<Navigate to="/" />}></Route>
          </Routes>
        </Container>
      </Router>
    </>
  )
}

export default App
