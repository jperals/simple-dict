import React, {Component} from 'react'
import Definition from './Definition'

class Term extends Component {
    render() {
        const data = this.props.termData
        return (
            <li class="term">
                <h2>{this.props.term}</h2>
                {
                    data.pronunciation &&
                    <div class="pronunciation">{ data.pronunciation }</div>
                }
                {
                    data instanceof Array ? (
                        <ol class="translations">
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
            </li>
        )
    }
}

export default Term
