import {SET_USER} from "../types";
import {initialState} from "./reducers";

export default function (state = initialState.user, action) {
    switch (action.type) {
        case SET_USER:
            return action.payload
        default:
            return state
    }
}
