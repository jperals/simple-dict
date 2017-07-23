import { createStore } from 'redux'
import { Provider } from 'react-redux'
import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './src/components/App'
import mainReducer from './src/reducers/index'

function renderApp({ dictId }) {
    let preloadedState = { dictId }

    // Create a new Redux store instance
    const store = createStore(mainReducer, preloadedState)

    // Render the component to a string
    return renderToString(
        <Provider store={store}>
            <App />
        </Provider>
    )

}

function renderFullPage({ dictId }) {
    const html = renderApp({ dictId })
    return `
        <!doctype html>
        <html>
            <head>
                <title>Dictionary</title>
                <link rel="icon" type="image/gif" href="data:image/gif;base64,R0lGODlhEAAQAIAAAAAAAAAAACH5BAkAAAEALAAAAAAQABAAAAIgjI+py+0PEQiT1lkNpppnz4HfdoEH2W1nCJRfBMfyfBQAOw==" />
                <link rel="stylesheet" href="../static/css/styles.css"></link>
            </head>
            </body>
                <div id="root">${html}</div>
            </body>
        </html>
    `
}

// Babel allows us to use this syntax with nodemon...
export default renderFullPage

// ... but we still need this to import from the gulpfile
module.exports = renderFullPage

