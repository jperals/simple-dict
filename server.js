// Based on
// http://redux.js.org/docs/recipes/ServerRendering.html

import Express from 'express'
import qs from 'qs'
import renderFullPage from './renderPage'

const app = Express()
const port = 3000

app.use('static', Express.static('static'))

app.use(handleRender)

function handleRender (req, res) {
    // Read the dictionary id from the request, if provided
    const params = qs.parse(req.query)
    const dictId = params.dict

    // Send the rendered page back to the client
    res.send(renderFullPage({ dictId:dictId }))
}

app.listen(port)
