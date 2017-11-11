import { createStore, combineReducers } from "redux";
import * as reducers from "../reducers/index";

export default function configureStore() {
	return createStore(
		combineReducers(reducers),
	);
}
