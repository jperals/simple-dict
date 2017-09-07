import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Term from './Term'

class DictionaryApp extends Component {

    static contextTypes = {
        store: PropTypes.object.isRequired
    }

    render() {
        const dictId = this.context.store.getState().dictId
        const content = this.context.store.getState().dictContent
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
