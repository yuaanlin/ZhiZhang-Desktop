import BillingRecord from '../../interface/Record';

export interface RecordState {
  records: BillingRecord[];
}

interface SetRecordsAction {
  type: 'record/set_records';
  payload: BillingRecord[];
}

interface PutRecordAction {
  type: 'record/put';
  payload: BillingRecord;
}

export type RecordAction = SetRecordsAction | PutRecordAction
