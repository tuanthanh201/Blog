import { Link, useLocation } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { Menu } from 'semantic-ui-react'
import nProgress from 'nprogress'
import { LOGOUT, cacheUpdateLogout } from '../graphql'

const NavBar = ({ user }) => {
  const { pathname } = useLocation()
  const [logout] = useMutation(LOGOUT, {
    update(cache, payload) {
      cacheUpdateLogout(cache, payload)
    },
  })

  const logoutHandler = async () => {
    nProgress.start()
    await logout()
    nProgress.done()
  }

  return (
    <Menu pointing secondary size="massive" color="teal">
      <Menu.Item as={Link} name="home" active={pathname === '/'} to="/" />
      <Menu.Menu position="right">
        {!user && (
          <>
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
          </>
        )}
        {user && (
          <>
            <Menu.Item
              as={Link}
              active={pathname === '/post/create'}
              name="post"
              to="/post/create"
            />
            <Menu.Item as={Link} name="profile" to={`/users/${user?.id}`} />
            <Menu.Item
              style={{ cursor: 'pointer' }}
              name="logout"
              onClick={logoutHandler}
            />
          </>
        )}
      </Menu.Menu>
    </Menu>
  )
}

export default NavBar
