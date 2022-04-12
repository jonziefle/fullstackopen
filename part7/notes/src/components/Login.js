import { useNavigate } from "react-router-dom"
import {
    TextField,
    Button
} from '@material-ui/core'

const Login = (props) => {
    const navigate = useNavigate()

    const onSubmit = (event) => {
        event.preventDefault()
        props.onLogin(event.target.username.value)
        navigate('/')
    }

    return (
        <div>
            <h2>login</h2>
            <form onSubmit={onSubmit}>
                <div>
                    <TextField
                        label="username"
                        name="username"
                        type="text" />
                </div>
                <div>
                    <TextField
                        label="password"
                        name="password"
                        type="password" />
                </div>
                <div>
                    <Button variant="contained" color="primary" type="submit">
                        login
                    </Button>
                </div>
            </form>
        </div>
    )
}

export default Login