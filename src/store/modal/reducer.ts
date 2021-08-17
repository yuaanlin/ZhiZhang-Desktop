import {ModalAction, ModalState, OpenedModal} from './type';

const initState: ModalState = {
  modals: []
};

function modalReducer(state = initState, action: ModalAction) {
  switch (action.type) {
    case 'modal/open':
      const n: OpenedModal = {
        isOpened: true,
        key: new Date().getTime().toString(),
        modal: action.modal,
        props: action.props
      };
      return {...state, modals: [...state.modals, n]};
    case 'modal/remove':
      return {
        ...state,
        modals: [...state.modals.filter(m => m.key !== action.key)]
      };
    case 'modal/close':
      const k = state.modals.find(m => m.key === action.key);
      if (!k) return state;
      k.isOpened = false;
      return {
        ...state,
        modals: [...state.modals.filter(m => m.key !== action.key), k]
      };

    default:
      return state;
  }
}

export default modalReducer;
