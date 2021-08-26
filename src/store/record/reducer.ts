import {RecordAction, RecordState} from './type';

const initState: RecordState = {
  records: []
};

function recordReducer(state = initState, action: RecordAction) {
  switch (action.type) {
    case 'record/set_records':
      return {
        ...state,
        records: action.payload.sort(
          (a, b) => a.time.getTime() - b.time.getTime())
      };
    case 'record/put':
      return {
        ...state,
        records: [...state.records.filter(r => r.id !== action.payload.id),
          action.payload].sort(
          (a, b) => a.time.getTime() - b.time.getTime())
      };
    case 'record/remove':
      return {
        ...state,
        records: [...state.records.filter(r => r.id !== action.payload)].sort(
          (a, b) => a.time.getTime() - b.time.getTime())
      };
    default:
      return state;
  }
}

export default recordReducer;
