import { connect } from 'react-redux'

const Notification = (props) => {
    const style = {
        border: 'solid',
        borderWidth: 1,
        padding: 10,
        marginBottom: 10
    }
    return (
        <>
            {
                props.notification !== null &&
                <div style={style}>
                    {props.notification}
                </div>
            }
        </>
    )
}

const mapStateToProps = (state) => {
    return {
        notification: state.notification
    }
}

const ConnectedNotification = connect(
    mapStateToProps
)(Notification)
export default ConnectedNotification