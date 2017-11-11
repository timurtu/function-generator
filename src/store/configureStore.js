module.exports = process.NODE_ENV === "production" ?
	require("configureStore.prod") :
	require("configureStore.dev");