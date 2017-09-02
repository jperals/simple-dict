// Based on
// http://redux.js.org/docs/recipes/ServerRendering.html

import Express from 'express'
import fs from 'fs'
import livereload from 'connect-livereload'
import qs from 'qs'
import renderFullPage from './renderPage'
import yaml from 'js-yaml'

const app = Express()
const port = 3000

app.use('/css', Express.static('./dist/css'))
app.use('/static', Express.static('./static'))
app.use('/data', Express.static('./data'))
app.use(livereload())
app.use(handleRender)

function handleRender(req, res) {
    // Read the dictionary id from the request, if provided
    const params = qs.parse(req.query)
    const dictId = params.dict
    const dictPath = 'data/dicts/' + dictId + '.yaml'
    const dictContent = yaml.safeLoad(fs.readFileSync(dictPath))
    // Send the rendered page back to the client
    res.send(renderFullPage({dictId: dictId, dictContent: dictContent}))
}

console.log('Listening to port', port)
app.listen(port)
