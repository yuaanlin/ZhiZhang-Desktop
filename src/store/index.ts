import {applyMiddleware, combineReducers, createStore} from 'redux';
import recordReducer from './record/reducer';
import {RecordAction, RecordState} from './record/type';
import thunk, {ThunkDispatch} from 'redux-thunk';

export type RootState = {
  record: RecordState
}

export type RootAction = RecordAction;

export type AppDispatch = ThunkDispatch<RootState, any, RootAction>;

const store = createStore(
  combineReducers<RootState>({
    record: recordReducer
  }),
  applyMiddleware(thunk)
);

export default store;
