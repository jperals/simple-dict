import PropTypes from 'prop-types'
import React, {Component} from 'react'
import setSearchFilter from '../actions'

class SearchBox extends Component {

    static contextTypes = {
        store: PropTypes.object.isRequired
    }

    handleChange(event) {
        this.context.store.dispatch(setSearchFilter({value: event.target.value}))
    }

    render() {
        return (
            <input type="text" onChange={this.handleChange.bind(this)}></input>
        )
    }

}

export default SearchBox
