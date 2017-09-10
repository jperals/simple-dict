import { connect } from 'react-redux'
import React, {Component} from 'react'
import PropTypes from 'prop-types'
import Term from './Term'

class TermList extends Component {

    static contextTypes = {
        store: PropTypes.object.isRequired
    }

    render() {
        const state = this.context.store.getState()
        const content = state.dictContent
        const filterValue = state.filterValue
        return (
            <ul className="terms">
                {
                    Object.keys(content)
                        .filter( (str)  => {
                            return !filterValue || str.toLowerCase().includes(filterValue)
                        })
                        .map(function (term, i) {
                            return (
                                <li key={ 'term-' + i }>
                                    <Term term={ term } termData={ content[term] }/>
                                </li>
                            )
                        })
                }
            </ul>
        )
    }
}

function mapStateToProps(state) {
    state.filterValue = state.filterValue? state.filterValue.value.toLowerCase() : state.filterValue
    return Object.assign({}, state)
}

export default connect(mapStateToProps)(TermList)
