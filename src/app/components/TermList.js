import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Term from './Term'

class TermList extends Component {

    static contextTypes = {
        store: PropTypes.object.isRequired
    }

    render() {
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

export default TermList
