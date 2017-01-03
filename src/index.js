import React, { Component } from 'react'
import { render } from 'react-dom'

const randomItemFromArray = arr => arr[Math.floor(Math.random() * arr.length)]

class MarkovChain extends Component {

  constructor() {
    super()

    this.state = {
      results: [],
      ngrams: {},
      beginnings: [],
      showAll: true
    }
  }

  componentWillMount() {

    fetch('./res/list.json')
      .then(res => res.json())
      .then(list => {
        this.setState({ list })
        this.setup()
      })
  }

  setup() {

    const { order } = this.props
    const { ngrams, list, beginnings } = this.state

    for (let j = 0; j < list.length; j++) {

      const text = list[j]

      for (let i = 0; i <= text.length - order; i++) {

        const gram = text.substring(i, i + order)

        if (i === 0) {
          beginnings.push(gram)
          this.setState({ beginnings })
        }

        if (!ngrams[gram]) {
          ngrams[gram] = []
        }

        ngrams[gram].push(text.charAt(i + order))
      }
    }

    this.setState({
      ngrams
    })
  }

  generate() {

    const { order, count } = this.props
    const { ngrams, beginnings, list } = this.state

    let currentGram = randomItemFromArray(beginnings)
    let result = currentGram

    for (let i = 0; i < count; i++) {

      const possibilities = ngrams[currentGram]

      if (!possibilities) {
        break
      }

      result += randomItemFromArray(possibilities)

      currentGram = result.substring(result.length - order, result.length)
    }

    console.log(result.length)

    result = result.split(/\s\s+/).join('\'')

    if(list.includes(result)) {
      return this.generate()
    }

    this.setState({
      results: [
        result,
        ...this.state.results
      ]
    })
  }

  render() {
    return (
      <div>
        <button onClick={this.generate.bind(this)}>Generate Proverb</button>

        <label style={{ padding: '1em' }} htmlFor="show">Show all proverbs</label>

        <input onChange={() => {
          this.setState({ showAll: !this.state.showAll })
        }} checked={this.state.showAll} id="show" type="checkbox"/>

        <h1>{this.state.results[0]}</h1>

        {this.state.showAll ?
          <ol>
            {this.state.results.map((result, i) => <li key={i}>{result}</li>)}
          </ol> : null}
      </div>
    )
  }
}

render(
  <MarkovChain
    order={6}
    count={400}
  />,
  document.getElementById('root')
)
