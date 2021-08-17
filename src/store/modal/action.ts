import {ThunkAction} from 'redux-thunk';
import {RootAction, RootState} from '../index';

export const closeModal = (key: string): ThunkAction<Promise<any>, RootState, {}, RootAction> => {
  return async (dispatch): Promise<void> => {
    dispatch({type: 'modal/close', key});
    setTimeout(() => {
      dispatch({type: 'modal/remove', key});
    }, 500);
  };
};
