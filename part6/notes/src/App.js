import { useEffect } from 'react'
import { useDispatch } from 'react-redux'

import NewNote from './components/NewNote'
import VisibilityFilter from './components/VisibilityFilter'
import Notes from './components/Notes'

import { initializeNotes } from './reducers/noteReducer'

const App = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(initializeNotes())
    }, [dispatch])

    return (
        <div>
            <NewNote />
            <VisibilityFilter />
            <Notes />
        </div>
    )
}

export default App