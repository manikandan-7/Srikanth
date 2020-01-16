import MessageReducer from './MessageReducer'
import ChatReducer from './ChatReducer'
import { combineReducers } from 'redux'

const allReducers = combineReducers({
    MessageReducer,ChatReducer
})

export default allReducers