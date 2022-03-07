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
import './App.css'
import SinglePost from './components/post/SinglePost'
import Profile from './components/profile/Profile'
import PostForm from './components/post/PostForm'

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
            <Route path="/posts/:postId" element={<SinglePost />}></Route>
            <Route path="/post" element={<PostForm />}></Route>
            <Route path="/users/:userId" element={<Profile />}></Route>
            <Route path="*" element={<Navigate to="/" />}></Route>
          </Routes>
        </Container>
      </Router>
    </>
  )
}

export default App
