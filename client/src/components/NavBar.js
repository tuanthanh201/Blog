import { useLocation } from 'react-router-dom'
import { Menu } from 'semantic-ui-react'
import { Link } from 'react-router-dom'

const NavBar = (props) => {
  const { pathname } = useLocation()

  return (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item as={Link} name="home" active={pathname === '/'} to="/" />
      <Menu.Menu position="right">
        <Menu.Item
          as={Link}
          active={pathname === '/post/create'}
          name="post"
          to="/post/create"
        />
        <Menu.Item
          as={Link}
          active={pathname === '/login'}
          name="login"
          to="/login"
        />
        <Menu.Item
          as={Link}
          active={pathname === '/register'}
          name="register"
          to="/register"
        />
      </Menu.Menu>
      {/* <Menu.Menu position="right">
          <Menu.Item name="logout" to="/" />
        </Menu.Menu> */}
    </Menu>
  )
}

export default NavBar
