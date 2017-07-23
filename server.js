// Based on
// http://redux.js.org/docs/recipes/ServerRendering.html

import Express from 'express'
import React from 'react'
import { createStore } from 'redux'
import { Provider } from 'react-redux'
import { renderToString } from 'react-dom/server'
import App from './src/components/App'
import mainReducer from './src/reducers/index'
import qs from 'qs'

const app = Express()
const port = 3000

app.use('static', Express.static('static'))

app.use(handleRender)

function handleRender (req, res) {
    // Read the dictionary id from the request, if provided
    const params = qs.parse(req.query)
    const dictId = params.dict

    let preloadedState = { dictId }

    // Create a new Redux store instance
    const store = createStore(mainReducer, preloadedState)

    // Render the component to a string
    const html = renderToString(
        <Provider store={store}>
            <App />
        </Provider>
    )

    // Grab the initial state from out Redux store
    const finalState = store.getState()

    // Send the rendered page back to the client
    res.send(renderFullPage(html, finalState))
}

function renderFullPage(html, state) {
    return `
        <!doctype html>
        <html>
            <head>
                <title>Dictionary</title>
                <link rel="icon" type="image/gif" href="data:image/gif;base64,R0lGODlhEAAQAIAAAAAAAAAAACH5BAkAAAEALAAAAAAQABAAAAIgjI+py+0PEQiT1lkNpppnz4HfdoEH2W1nCJRfBMfyfBQAOw==" />
            </head>
            </body>
                <div id="root">${html}</div>
            </body>
        </html>
    `
}

app.listen(port)
