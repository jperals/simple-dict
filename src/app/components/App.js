import PropTypes from 'prop-types'
import React, {Component} from 'react'
import SearchBox from './SearchBox'
import TermList from './TermList'

class DictionaryApp extends Component {

    static contextTypes = {
        store: PropTypes.object.isRequired
    }

    render() {
        return (
            <div>
                <SearchBox></SearchBox>
                <TermList></TermList>
            </div>
        )
    }
}

module.exports = DictionaryApp
