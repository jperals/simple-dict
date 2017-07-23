import React, {Component} from 'react'
import Definition from './Definition'

class Term extends Component {
    render() {
        const data = this.props.termData
        return (
            <div className="term" id={this.props.term}>
                <h2>
                    <a href={'#' + this.props.term}>
                        {this.props.term}
                    </a>
                </h2>
                {
                    data.pronunciation &&
                    <div className="pronunciation">{ data.pronunciation }</div>
                }
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
                {

                }
            </div>
        )
    }
}

export default Term
