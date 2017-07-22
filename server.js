// Based on
// http://redux.js.org/docs/recipes/ServerRendering.html

import Express from 'express'
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import App from './src/components/App'
import mainReducer from './src/reducers/index'
// ...

const app = Express()
const port = 3000

app.use('static', Express.static('static'))

app.use(handleRender)

function handleRender (req, res) {
    // Create a new Redux store instance
    const store = createStore(mainReducer)

    // Render the component to a string
    const html = renderToString(
        <Provider store={store}>
            <App />
        </Provider>
    )

    // Grab the initial state from out Redux store
    const preloadedState = store.getState()

    // Send the rendered page back to the client
    res.send(renderFullPage(html, preloadedState))
}

function renderFullPage(html, preloadedState) {
    return `
        <!doctype html>
        <html>
            <head>
                <title>Dictionary</title>
            </head>
            </body>
                <div id="root">${html}</div>
            </body>
        </html>
    `
}

app.listen(port)
