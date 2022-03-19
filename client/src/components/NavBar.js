import { Link, useLocation } from 'react-router-dom'
import { useMutation } from '@apollo/client'
import { Button, Dropdown, Item, Menu, Select } from 'semantic-ui-react'
import nProgress from 'nprogress'
import { LOGOUT, cacheUpdateLogout } from '../graphql'

const options = [
  { key: 'newest', text: 'Newest', value: 'newest' },
  { key: 'trending', text: 'Trending', value: 'trending' },
]

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
            <Menu.Item>
              <Dropdown text="Notifications" floating>
                <Dropdown.Menu>
                  <Dropdown.Item as={Link} to="/register">
                    <Item style={{padding: 0, margin: 0}}>
                      <Item.Meta style={{padding: 0, margin: 0}}>
                        <p style={{padding: 0, margin: 0}}>beta uploaded a post</p>
                        <p style={{padding: 0, margin: 0}}>2 hours ago</p>
                      </Item.Meta>
                    </Item>
                  </Dropdown.Item>
                  {/* <Dropdown.Item as={Link} to='/register' text="beta uploaded a post"/>
                  <Dropdown.Item as={Link} to='/register' text="beta uploaded a post"/>
                  <Dropdown.Item as={Link} to='/register' text="beta uploaded a post"/> */}
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
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
