import fs from 'fs'
import React, { Component } from 'react'
import PropTypes from 'prop-types'
import yaml from 'js-yaml'

class DictionaryApp extends Component {
    constructor(props) {
        super(props)
    }
    static contextTypes = {
        store: PropTypes.object.isRequired
    }
    render() {
        const dictId = this.context.store.getState().dictId
        const dictPath = 'src/data/' + dictId + '.yaml'
        const content = yaml.safeLoad(fs.readFileSync(dictPath))
        return (
            <div>
                {
                    Object.keys(content).map(function(key, i) {
                        return <div class="word" key={key}><h2>{key}</h2><p>{content[key].translation}</p></div>
                    })
                }
            </div>
        )
    }
}



export default DictionaryApp