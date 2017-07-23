import React, { Component } from 'react'

class Term extends Component {
    render() {
        return (
            <li class="term">
                <h2>{this.props.term}</h2>
                <p>{this.props.termData.translation}</p>
            </li>
        )
    }
}

export default Term