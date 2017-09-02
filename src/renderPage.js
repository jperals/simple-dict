import { createStore } from 'redux'
import { Provider } from 'react-redux'
import React from 'react'
import { renderToString } from 'react-dom/server'
import App from './components/App'
import mainReducer from './reducers/index'

function renderApp({ dictId, dictContent }) {
    let preloadedState = { dictId, dictContent }

    // Create a new Redux store instance
    const store = createStore(mainReducer, preloadedState)

    // Render the component to a string
    return renderToString(
        <Provider store={store}>
            <App />
        </Provider>
    )

}

function renderFullPage(state) {
    const html = renderApp(state)
    return `
        <!doctype html>
        <html>
            <head>
                <title>Dictionary</title>
                <link rel="icon" type="image/gif" href="data:image/gif;base64,R0lGODlhEAAQAIAAAAAAAAAAACH5BAkAAAEALAAAAAAQABAAAAIgjI+py+0PEQiT1lkNpppnz4HfdoEH2W1nCJRfBMfyfBQAOw==" />
                <link rel="stylesheet" href="../css/styles.css"></link>
                <script>
                  // WARNING: See the following for security issues around embedding JSON in HTML:
                  // http://redux.js.org/docs/recipes/ServerRendering.html#security-considerations
                  window.__PRELOADED_STATE__ = ${JSON.stringify({ dictId: state.dictId }).replace(/</g, '\\u003c')}
                </script>
                <script src="static/vendor.js"></script>
                <script defer src="static/client.js"></script>
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

