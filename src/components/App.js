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
        const dictPath = 'src/data/' + dictId + '.yaml'
        const content = yaml.safeLoad(fs.readFileSync(dictPath))
        return (
            <ul>
                {
                    Object.keys(content).map(function (term, i) {
                        return <Term term={ term } termData={ content[term] } key={ 'term-' + i }/>
                    })
                }
            </ul>
        )
    }
}

export default DictionaryApp
