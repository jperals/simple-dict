import React, { Component } from 'react'
import yaml from 'js-yaml'
import fs from 'fs'

class DictionaryApp extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const dictPath = 'src/data/' + this.props.dict + '.yaml'
        const content = yaml.safeLoad(fs.readFileSync(dictPath))
        return (
            <div>
                {
                    Object.keys(content).map(function(key, i) {
                        return <div class="word"><h2>{key}</h2><p>{content[key].translation}</p></div>
                    })
                }
            </div>
        )
    }
}



export default DictionaryApp