import 'core-js/stable/index.js'
import 'regenerator-runtime/runtime.js'

import React from 'react'
import ReactDOM from 'react-dom'
import App from './App'

import './index.css'

import PromisePolyfill from 'promise-polyfill'

if (!window.Promise) {
    window.Promise = PromisePolyfill
}

ReactDOM.render(<App />, document.getElementById('root'))