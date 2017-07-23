import fs from 'fs'
import React, {Component} from 'react'
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
            <ul>
                {
                    Object.keys(content).map(function (term, i) {
                        return <li class="term" key={'term-' + i}>
                            <h2>{term}</h2>
                            <p>{content[term].translation}</p>
                        </li>
                    })
                }
            </ul>
        )
    }
}


export default DictionaryApp