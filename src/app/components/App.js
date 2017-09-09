import React, {Component} from 'react'
import SearchBox from './SearchBox'
import TermList from './TermList'

class DictionaryApp extends Component {

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
