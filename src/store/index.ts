import {applyMiddleware, combineReducers, createStore} from 'redux';
import recordReducer from './record/reducer';
import {RecordAction, RecordState} from './record/type';
import thunk, {ThunkDispatch} from 'redux-thunk';
import {ModalAction, ModalState} from './modal/type';
import modalReducer from './modal/reducer';

export type RootState = {
  modal: ModalState
  record: RecordState
}

export type RootAction = RecordAction | ModalAction;

export type AppDispatch = ThunkDispatch<RootState, any, RootAction>;

const store = createStore(
  combineReducers<RootState>({
    modal: modalReducer,
    record: recordReducer
  }),
  applyMiddleware(thunk)
);

export default store;
