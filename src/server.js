// Based on
// http://redux.js.org/docs/recipes/ServerRendering.html

import Express from 'express'
import fs from 'fs'
import livereload from 'connect-livereload'
import path from 'path'
import renderFullPage from './renderPage'
import yaml from 'js-yaml'

const app = Express()
const port = 3000
const dataDir = path.join(__dirname, 'data')

app.use(Express.static(path.join(__dirname, 'static')))
app.use('/data', Express.static(dataDir))
app.use(livereload())

app.get('/dictionary/:dictId', function (req, res) {
    // Read the dictionary id from the request, if provided
    const dictId = req.params.dictId
    const dictPath = dataDir + '/dicts/' + dictId + '.yaml'
    const dictContent = yaml.safeLoad(fs.readFileSync(dictPath))
    // Send the rendered page back to the client
    res.send(renderFullPage({dictId: dictId, dictContent: dictContent}))
})

console.log('Listening to port', port)
app.listen(port)
