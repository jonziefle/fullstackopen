import { useSelector } from 'react-redux'

const Notification = () => {
    const notification = useSelector(state => state.notification)


    const style = {
        border: 'solid',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10
    }
    return (
        <>
            {
                notification !== null &&
                <div style={style}>
                    {notification}
                </div>
            }
        </>
    )
}

export default Notification