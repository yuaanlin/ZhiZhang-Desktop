import React, { createRef, useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import {
  AutoComplete,
  Button,
  ControlLabel,
  DatePicker,
  Form,
  FormControl,
  FormGroup,
  InputNumber,
  SelectPicker,
} from 'rsuite';
import 'rsuite/dist/styles/rsuite-default.css';
import './App.global.css';
import UpdateRecordForm from './components/UpdateRecordForm';
import IndexedDb from './IndexedDB';
import BillingRecord from './interface/Record';
import diffArray from './utils/diffArray';
import numberWithCommas from './utils/numberWithCommas';

function parseData(data: string) {
  const lines = data.split('\n');
  const cols = lines.map((l) => l.split(','));
  const res: BillingRecord[] = [];
  cols.slice(1, cols.length - 1).map((col, i) => {
    const d = col[10]?.split('/');
    const t = col[11]?.split(':');
    const date = new Date();
    if (d && t) {
      date.setFullYear(+d[0]);
      date.setMonth(+d[1] - 1);
      date.setDate(+d[2]);
      date.setHours(+t[0]);
      date.setMinutes(+t[1]);
      date.setSeconds(0);
    }
    res.push({
      id: i,
      account: col[0],
      currency: col[1],
      type: col[2],
      catagory: col[3],
      subCatagory: col[4],
      amount: +col[5],
      fee: +col[6],
      discount: +col[7],
      title: col[8],
      store: col[9],
      time: date,
      project: col[12],
      description: col[13],
      tag: col[14],
      target: col[15],
    });
  });
  return res;
}

function getSumOfAccounts(records: BillingRecord[]) {
  const res: { [account: string]: number } = {};
  records.map((record) => {
    if (record.title === 'CATEGORY_ADJUSTMENT') {
      res[record.account] = record.amount;
      return;
    }
    if (res.hasOwnProperty(record.account)) {
      res[record.account] += record.amount + record.fee + record.discount;
    } else {
      res[record.account] = record.amount + record.fee + record.discount;
    }
  });
  return res;
}

const Hello = () => {
  const [records, setRecords] = useState<BillingRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<BillingRecord>();

  const innerRef = createRef<HTMLDivElement>();

  async function refresh() {
    const runIndexDb = async () => {
      const indexedDb = new IndexedDb('yuan');
      await indexedDb.createObjectStore(['billing_records']);
      const recs: BillingRecord[] = await indexedDb.getAllValue(
        'billing_records'
      );
      setRecords(recs);
    };
    runIndexDb();
  }

  useEffect(() => {
    if (innerRef.current)
      innerRef.current.scrollTop = innerRef.current.scrollHeight;
  }, [records]);

  useEffect(() => {
    refresh();
  }, []);

  async function showFile(e: any) {
    e.preventDefault();
    const reader = new FileReader();
    reader.onload = async (ev) => {
      const text = ev.target?.result;
      const runIndexDb = async () => {
        const indexedDb = new IndexedDb('yuan');
        await indexedDb.createObjectStore(['billing_records']);
        await indexedDb.putBulkValue(
          'billing_records',
          parseData(text as string)
        );
      };
      runIndexDb();
    };
    reader.readAsText(e.target.files[0]);
  }

  const [formData, setFormData] = useState({
    title: '',
    store: '',
    amount: 0,
    account: '',
    catagory: '',
    subCatagory: '',
    currency: '',
    time: new Date(),
  });

  useEffect(() => {
    if (formData.title.length === 0) return;
    const f = records.reverse().find((r) => r.title === formData.title);
    if (f)
      setFormData({
        ...formData,
        account: f.account,
        catagory: f.catagory,
        subCatagory: f.subCatagory,
        store: f.store,
        amount: f.amount,
        currency: f.currency,
      });
  }, [formData.title]);

  // TODO: don't calculate from records!
  const possibleCatagory = useMemo(() => {
    let c = records.map((r) => r.catagory);
    return diffArray(c);
  }, [records]);

  // TODO: don't calculate from records!
  const possibleSubCatagory = useMemo(() => {
    let c = records.map((r) => r.subCatagory);
    return diffArray(c);
  }, [records]);

  // TODO: don't calculate from records!
  const possibleAccount = useMemo(() => {
    let c = records.map((r) => r.account);
    return diffArray(c);
  }, [records]);

  const possibleTitle = useMemo(() => {
    let c = records.map((r) => r.title);
    return diffArray(c);
  }, [records]);

  const possibleStore = useMemo(() => {
    let stores = records.map((r) => r.store);
    return diffArray(stores);
  }, [records]);

  // TODO: don't calculate from records!
  const possibleCurrency = useMemo(() => {
    let c = records.map((r) => r.currency);
    return diffArray(c);
  }, [records]);

  const sum = useMemo(() => {
    return getSumOfAccounts(records);
  }, [records]);

  async function submit() {
    const runIndexDb = async () => {
      const indexedDb = new IndexedDb('yuan');
      await indexedDb.createObjectStore(['billing_records']);
      const f: BillingRecord = {
        ...formData,
        type: formData.amount > 0 ? '收入' : '支出',
        fee: 0,
        discount: 0,
        id: records.length,
        tag: '',
        target: '',
        project: '',
        amount: +formData.amount,
        description: '',
      };
      await indexedDb.putBulkValue('billing_records', [f]);
    };
    await runIndexDb();
    await refresh();
    setFormData({
      ...formData,
      title: '',
      store: '',
      amount: 0,
      catagory: '',
      subCatagory: '',
    });
  }

  const downloadTxtFile = () => {
    const element = document.createElement('a');
    const file = new Blob([JSON.stringify(records)], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download =
      'YUAN-exported-' + new Date().toLocaleDateString() + '.json';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  return (
    <>
      <div className="left-section">
        <input type="file" onChange={showFile} />
        {Object.keys(sum).map((key) => (
          <div className="account-sum-card">
            <p>{key}</p>
            <h3>
              {} {numberWithCommas(sum[key])}
            </h3>
          </div>
        ))}
        <Button onClick={downloadTxtFile} appearance="primary">
          匯出為 JSON
        </Button>
      </div>
      <div className="center-section">
        <div className="inner" ref={innerRef}>
          {records.map((record) => (
            <div
              key={record.id}
              className="record-card"
              onClick={() => setSelectedRecord(record)}
            >
              <div>
                <h5>
                  {record.title.length === 0
                    ? record.subCatagory
                    : record.title}
                </h5>
                <p style={{ opacity: 0.5 }}>{record.store}</p>
              </div>
              <div>
                <p>
                  {record.currency} {record.amount}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="right-section">
        {selectedRecord ? (
          <UpdateRecordForm
            Record={selectedRecord}
            possibleAccount={possibleAccount}
            possibleCatagories={possibleCatagory}
            possibleCurrencies={possibleCurrency}
            possibleStores={possibleStore}
            possibleSubCatagories={possibleSubCatagory}
            possibleTitles={possibleTitle}
            onUpdated={refresh}
            onCanceled={() => setSelectedRecord(undefined)}
          />
        ) : (
          <React.Fragment>
            <h4>新增紀錄</h4>
            <Form formValue={formData} onChange={(f: any) => setFormData(f)}>
              <FormGroup>
                <ControlLabel>日期</ControlLabel>
                <FormControl
                  name="time"
                  cleanable={false}
                  accepter={DatePicker}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>分類</ControlLabel>
                <FormControl
                  cleanable={false}
                  name="catagory"
                  accepter={SelectPicker}
                  data={possibleCatagory.map((c) => ({ label: c, value: c }))}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>子分類</ControlLabel>
                <FormControl
                  cleanable={false}
                  name="subCatagory"
                  accepter={SelectPicker}
                  data={possibleSubCatagory.map((c) => ({
                    label: c,
                    value: c,
                  }))}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>標題</ControlLabel>
                <FormControl
                  accepter={AutoComplete}
                  data={possibleTitle.map((c) => ({ label: c, value: c }))}
                  name="title"
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>帳戶</ControlLabel>
                <FormControl
                  cleanable={false}
                  name="account"
                  accepter={SelectPicker}
                  data={possibleAccount.map((c) => ({ label: c, value: c }))}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>店家</ControlLabel>
                <FormControl
                  accepter={AutoComplete}
                  data={possibleStore}
                  name="store"
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>幣種</ControlLabel>
                <FormControl
                  accepter={AutoComplete}
                  data={possibleCurrency}
                  name="currency"
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>金額</ControlLabel>
                <FormControl accepter={InputNumber} step={0.01} name="amount" />
              </FormGroup>
              <Button appearance="primary" onClick={submit}>
                送出
              </Button>
            </Form>
          </React.Fragment>
        )}
      </div>
    </>
  );
};

export default function App() {
  return (
    <React.Fragment>
      <div className="title-bar" />
      <div className="main">
        <Router>
          <div className="side-bar"></div>
          <Switch>
            <Route path="/" component={Hello} />
          </Switch>
        </Router>
      </div>
    </React.Fragment>
  );
}
