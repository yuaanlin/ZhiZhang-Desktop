import {RecordAction, RecordState} from './type';

const initState: RecordState = {
  records: []
};

function recordReducer(state = initState, action: RecordAction) {
  switch (action.type) {
    case 'record/set_records':
      console.log(action);
      return {...state, records: action.payload};
    case 'record/put':
      return {...state,
        records: [...state.records.filter(r => r.id !== action.payload.id),
          action.payload]
      };
    default:
      return state;
  }
}

export default recordReducer;
