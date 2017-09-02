import React from 'react'
import { render } from 'react-dom'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import App from './components/App'
import rootReducer from './reducers'
import yaml from 'js-yaml'

// Grab the state from a global variable injected into the server-generated HTML
const preloadedState = window.__PRELOADED_STATE__

// Allow the passed state to be garbage-collected
delete window.__PRELOADED_STATE__


// Get the dictionary data from the corresponding JSON file
const dictFile = 'data/dicts/' + preloadedState.dictId + '.yaml'

fetch(dictFile)
    .then(function (response) {
        return response.text()
    })
    .then(function (data) {
        preloadedState.dictContent = yaml.safeLoad(data)
        // Create Redux store with initial state
        const store = createStore(rootReducer, preloadedState)
        // Render tha app with the reconstructed content
        render(
            <Provider store={store}>
                <App />
            </Provider>,
            document.getElementById('root')
        )
    })
    .catch(function (error) {
        console.error('wth')
        console.error(error)
    })
