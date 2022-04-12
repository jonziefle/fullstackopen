import { Link } from "react-router-dom"
import styled from 'styled-components'

const StyledNavigation = styled.div`
  background: BurlyWood;
  padding: 1em;
`

const Navigation = ({ user }) => {
    const padding = {
        padding: 5
    }

    return (
        <StyledNavigation>
            <Link style={padding} to="/">home</Link>
            <Link style={padding} to="/notes">notes</Link>
            <Link style={padding} to="/users">users</Link>
            {user
                ? <em>{user} logged in</em>
                : <Link style={padding} to="/login">login</Link>
            }
        </StyledNavigation>
    )
}

export default Navigation