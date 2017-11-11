const trainingData = (state = [], action) => ({
	TD_GET: [],
})[action.type] || state;

export default trainingData;
