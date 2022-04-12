import { useState, useEffect } from 'react'
import axios from 'axios'

export const useField = (name, type) => {
    const [value, setValue] = useState('')

    const onChange = (event) => {
        setValue(event.target.value)
    }

    const reset = (event) => {
        setValue('')
    }

    return {
        attributes: {
            name,
            type,
            value,
            onChange
        },
        reset
    }
}

export const useCountry = (name) => {
    const [country, setCountry] = useState(null)

    useEffect(() => {
        if (name !== '') {
            axios.get(`https://restcountries.com/v3.1/name/${name}?fullText=true`)
            .then((response) => {
                setCountry(response.data[0]);
            }).catch(error => {
                setCountry(null);
            })
        }
    }, [name])

    return country
}