import React from "react";
import { Button, Icon } from "semantic-ui-react";

const ORDER = 6;
const COUNT = 400;

const randomItemFromArray = arr => arr[Math.floor(Math.random() * arr.length)];

export default class App extends React.Component {
	state = {
		results: [],
		ngrams: {},
		beginnings: [],
		showAll: true,
	};

	componentWillMount() {
		fetch("./res/list.json")
			.then(res => res.json())
			.then(list => {
				this.setState({ list });
				this.setup();
			});
	}

	setup = () => {
		const { ngrams, list, beginnings } = this.state;

		for (let j = 0; j < list.length; j++) {

			const text = list[j];

			for (let i = 0; i <= text.length - ORDER; i++) {

				const gram = text.substring(i, i + ORDER);

				if (i === 0) {
					beginnings.push(gram);
					this.setState({ beginnings });
				}

				if (!ngrams[gram]) {
					ngrams[gram] = [];
				}

				ngrams[gram].push(text.charAt(i + ORDER));
			}
		}

		this.setState({ ngrams });
	};

	generate = () => {
		const { ngrams, beginnings, list } = this.state;

		let currentGram = randomItemFromArray(beginnings);
		let result = currentGram;

		for (let i = 0; i < COUNT; i++) {

			const possibilities = ngrams[currentGram];

			if (!possibilities) {
				break;
			}

			result += randomItemFromArray(possibilities);

			currentGram = result.substring(result.length - ORDER, result.length);
		}

		result = result.split(/\s\s+/).join("'");

		if (list.includes(result)) {
			return this.generate();
		}

		this.setState({
			results: [
				result,
				...this.state.results
			],
		});
	};

	render() {
		const { showAll, results } = this.state;
		return (
			<div>
				<Button
					primary
					animated
					onClick={this.generate}
				>
					<Button.Content visible>
						Generate
					</Button.Content>
					<Button.Content hidden>
						<Icon name="random" />
					</Button.Content>
				</Button>

				<label
					style={{ padding: "1em" }}
					htmlFor="show"
				>
					Show all functions
				</label>

				<input
					onChange={() => {
						this.setState({
							showAll: !showAll,
						});
					}}
					checked={showAll}
					id="show"
					type="checkbox"
				/>

				<h1>{results[0]}</h1>

				{showAll && (
					<ol>
						{results.map((result, i) => (
							<li key={i}>
								{result}
							</li>
						))}
					</ol>
				)}
			</div>
		);
	}
}