import MarkdownIt from 'markdown-it'
import React, {Component} from 'react'

const md = new MarkdownIt()

class Definition extends Component {
    render() {
        const data = this.props.definition
        return (
            <div className="definition" dangerouslySetInnerHTML={createMarkup(data)} />
        )
    }
}

function createMarkup(data) {
    return {
        __html: data instanceof Object && data.translation ? md.renderInline(data.translation)
            : !(data instanceof Object) && md.renderInline(data)
    }

}

export default Definition
