import React, {Component} from 'react'

class Definition extends Component {
    render() {
        const data = this.props.definition
        return (
            <div class="definition">
                { data instanceof Object ? (
                    data.translation
                ) : (
                    data
                )
                }
            </div>
        )
    }
}

export default Definition
