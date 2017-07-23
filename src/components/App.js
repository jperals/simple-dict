import fs from 'fs'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Term from './term'
import yaml from 'js-yaml'

class DictionaryApp extends Component {

    static contextTypes = {
        store: PropTypes.object.isRequired
    }

    render() {
        const dictId = this.context.store.getState().dictId
        const dictPath = 'data/dicts/' + dictId + '.yaml'
        const content = yaml.safeLoad(fs.readFileSync(dictPath))
        return (
            <ul className="terms">
                {
                    Object.keys(content).map(function (term, i) {
                        return (
                            <li key={ 'term-' + i }>
                                <Term term={ term } termData={ content[term] } />
                            </li>
                        )
                    })
                }
            </ul>
        )
    }
}

module.exports = DictionaryApp
