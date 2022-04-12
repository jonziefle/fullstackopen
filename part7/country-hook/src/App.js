import { useState } from 'react'
import { useField, useCountry } from './hooks'

import Country from './components/Country'

const App = () => {
    const nameInput = useField('name', 'text')
    const [name, setName] = useState('')
    const country = useCountry(name)

    const fetch = (event) => {
        event.preventDefault()
        setName(nameInput.attributes.value)
    }

    return (
        <div>
            <form onSubmit={fetch}>
                <input {...nameInput.attributes} />
                <button>find</button>
            </form>

            <Country country={country} />
        </div>
    )
}

export default App
