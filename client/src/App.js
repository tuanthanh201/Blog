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
import SinglePost from './components/post/SinglePost'
import Profile from './components/profile/Profile'
import CreatePost from './components/createPost/CreatePost'
import useUser from './hooks/useUser'
import './App.css'

function App() {
  const { loading, user } = useUser()

  if (loading) {
    return null
  }

  return (
    <Router>
      <Container>
        <NavBar user={user} />
        <Routes>
          <Route path="/" element={<Posts />}></Route>
          {!user && <Route path="/login" element={<Login />}></Route>}
          {!user && <Route path="/register" element={<Register />}></Route>}
          {user && <Route path="/post/create" element={<CreatePost />}></Route>}
          <Route path="/posts/:postId" element={<SinglePost />}></Route>
          <Route path="/users/:userId" element={<Profile />}></Route>
          <Route path="*" element={<Navigate to="/" />}></Route>
        </Routes>
      </Container>
    </Router>
  )
}

export default App
