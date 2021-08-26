import {ThunkAction} from 'redux-thunk';
import {AnyAction} from 'redux';
import {AppDispatch, RootAction, RootState} from '../index';
import IndexedDb from '../../IndexedDB';
import BillingRecord, {
  InsertRecordForm,
  UpdateRecordForm
} from '../../interface/Record';

export const loadRecordsFromIndexedDB = (): ThunkAction<Promise<void>, {}, {}, AnyAction> => {
  return async (dispatch: AppDispatch): Promise<void> => {
    const runIndexDb = async () => {
      const indexedDb = new IndexedDb('yuan');
      await indexedDb.createObjectStore(['billing_records']);
      const recs: BillingRecord[] = await indexedDb.getAllValue(
        'billing_records'
      );
      dispatch({type: 'record/set_records', payload: recs});
    };
    await runIndexDb();
  };
};

export const insertRecord = (formData: InsertRecordForm): ThunkAction<Promise<any>, RootState, {}, RootAction> => {
  return async (dispatch, getState): Promise<void> => {

    const sortByIndex = getState().record.records.sort((a, b) => a.id - b.id);
    const lastId = sortByIndex[sortByIndex.length - 1].id;

    const f: BillingRecord = {
      account: formData.account,
      currency: formData.currency,
      time: formData.time,
      title: formData.title,
      store: formData.store,
      type: formData.amount > 0 ? '收入' : '支出',
      fee: 0,
      discount: 0,
      id: lastId + 1,
      catagory: formData.category,
      subCatagory: formData.subCategory,
      tag: '',
      target: '',
      project: formData.project,
      amount: +formData.amount,
      description: '',
    };

    const runIndexDb = async () => {
      const indexedDb = new IndexedDb('yuan');
      await indexedDb.createObjectStore(['billing_records']);
      await indexedDb.putBulkValue('billing_records', [f]);
    };

    await runIndexDb();
    dispatch({type: 'record/put', payload: f});
  };
};

export const updateRecord = (formData: UpdateRecordForm): ThunkAction<Promise<any>, RootState, {}, RootAction> => {
  return async (dispatch): Promise<void> => {
    const f: BillingRecord = {
      account: formData.account,
      currency: formData.currency,
      time: formData.time,
      title: formData.title,
      store: formData.store,
      type: formData.amount > 0 ? '收入' : '支出',
      fee: 0,
      discount: 0,
      id: formData.id,
      catagory: formData.category,
      subCatagory: formData.subCategory,
      tag: '',
      target: '',
      project: formData.project,
      amount: +formData.amount,
      description: '',
    };

    const runIndexDb = async () => {
      const indexedDb = new IndexedDb('yuan');
      await indexedDb.createObjectStore(['billing_records']);
      await indexedDb.putBulkValue('billing_records', [f]);
    };

    await runIndexDb();
    dispatch({type: 'record/put', payload: f});
  };
};

export const deleteRecord = (id: number): ThunkAction<Promise<any>, RootState, {}, RootAction> => {
  return async (dispatch): Promise<void> => {
    const runIndexDb = async () => {
      const indexedDb = new IndexedDb('yuan');
      await indexedDb.createObjectStore(['billing_records']);
      await indexedDb.deleteValue('billing_records', id);
    };

    await runIndexDb();
    dispatch({type: 'record/remove', payload: id});
  };
};
