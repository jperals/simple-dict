import MarkdownIt from 'markdown-it'
import React, {Component} from 'react'
import Definition from './Definition'

const md = new MarkdownIt()

class Term extends Component {
    render() {
        const data = this.props.termData
        return (
            <div className="term">
                <div className="anchor" id={this.props.term}></div>
                <div className="term-head">
                    <span className="written-form">
                        <a href={'#' + this.props.term}>
                            {this.props.term}
                        </a>
                    </span>
                    {
                        data.pronunciation &&
                        <span className="pronunciation">{ data.pronunciation }</span>
                    }
                    {
                        data.source &&
                        <div className="source" dangerouslySetInnerHTML={ {__html: md.renderInline(data.source)} }/>
                    }
                    {
                        data.since &&
                        <div className="since">afegit: { data.since }</div>
                    }
                    {
                        data.synonyms instanceof Array && (
                            <div className="synonyms">Sinònims: { data.synonyms.join(', ') }</div>
                        )
                    }
                </div>
                <div className="term-body">
                {
                    data instanceof Array ? (
                        <ol className="translations">
                            {
                                data.map(function (definition, i) {
                                    return (
                                        <li key={'definition-' + i}>
                                            <Definition definition={definition}/>
                                        </li>
                                    )
                                })
                            }
                        </ol>
                    ) : (
                        <Definition definition={data}/>
                    )
                }
                </div>
            </div>
        )
    }
}

export default Term
