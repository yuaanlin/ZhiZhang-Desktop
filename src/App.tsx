import React, {createRef, useEffect, useMemo, useRef, useState} from 'react';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {
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
import numberWithCommas from './utils/numberWithCommas';
import parseMozeCSV from './utils/parseMozeCSV';
import categories, {subCategories} from './categories';
import Category from './interface/Category';
import SubCategory from './interface/SubCategory';

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

interface RecordForDisplay {
  id: number;
  account: string;
  currency: string;
  type: string;
  category: Category;
  subCategory: SubCategory;
  amount: number;
  fee: number;
  discount: number;
  title: string;
  store: string;
  time: Date;
  project: string;
  description: string;
  tag: string;
  target: string;
}

const Hello = () => {
  const [records, setRecords] = useState<BillingRecord[]>([]);
  const [selectedRecord, setSelectedRecord] = useState<BillingRecord>();
  const [options, setOptions] = useState<BillingRecord[]>([]);
  const [storeOptions, setStoreOptions] = useState<string[]>([]);

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
          parseMozeCSV(text as string)
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

  const sum = useMemo(() => {
    return getSumOfAccounts(records);
  }, [records]);

  const displayRecords: RecordForDisplay[] = useMemo(() => {
    const today = new Date();
    return records.filter(
      r => Math.abs(r.time.getTime() - today.getTime()) < 60 * 24 * 60 * 60 *
        1000)
      .map(r => {
        const c = categories.find(ca => ca.name === r.catagory);
        const s = subCategories.find(sc => sc.name === r.subCatagory);
        return {
          ...r,
          category: c ||
            {name: r.catagory, color: 'gray', icon: '🤔️', subCategories: []},
          subCategory: s ||
            {
              name: r.catagory,
              color: 'gray',
              icon: c ? c.icon : '🤔️',
              category: r.catagory
            }
        };
      });
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
    const file = new Blob([JSON.stringify(records)], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download =
      'YUAN-exported-' + new Date().toLocaleDateString() + '.json';
    document.body.appendChild(element); // Required for this to work in FireFox
    element.click();
  };

  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  useEffect(() => {
    setTimeout(async () => {
      if (formDataRef.current.title.length === 0) return;
      let d = records.filter(r => r.title.includes(formDataRef.current.title));
      if (d.length > 5) d = d.slice(0, 5);
      setOptions(d);
    }, 100);
  }, [formData.title]);

  useEffect(() => {
    setTimeout(async () => {
      if (formDataRef.current.store.length === 0) return;
      let d = records.filter(r => r.store.includes(formDataRef.current.store))
        .map(r => r.store);
      if (d.length > 5) d = d.slice(0, 5);
      setStoreOptions(d);
    }, 100);
  }, [formData.store]);

  return (
    <>
      <div className="left-section">
        <input type="file" onChange={showFile}/>
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
          {displayRecords.map((record) => (
            <div key={record.id} className="record-card-wrapper">
              <div
                className="record-card"
                onClick={() => setSelectedRecord({
                  ...record,
                  catagory: record.category.name,
                  subCatagory: record.subCategory.name
                })}
              >
                <div style={{display: 'flex', alignItems: 'center'}}>
                  <span style={{marginRight: 12, fontSize: 24}}>
                  {record.subCategory.icon.length === 0
                    ? record.category.icon
                    : record.subCategory.icon}
                  </span>
                  <div>
                    <h5>
                      {record.title.length === 0
                        ? record.subCategory.name
                        : record.title}
                    </h5>
                    <p style={{opacity: 0.5}}>{record.store}</p>
                  </div>
                </div>
                <div>
                  <p>
                    {record.currency} {record.amount}
                  </p>
                </div>
                <div className="category-bar" style={{
                  backgroundColor: record.category
                    ? record.category.color
                    : 'gray'
                }}>

                  <p>
                    {record.subCategory.name}
                  </p>
                </div>
              </div>
              <p style={{opacity: 0.2, marginLeft: 16}}>
                {record.time.toLocaleDateString()}
              </p>
            </div>
          ))}
        </div>
      </div>
      <div className="right-section">
        {selectedRecord ? (
          <UpdateRecordForm
            Record={selectedRecord}
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
                <ControlLabel>類別</ControlLabel>
                <FormControl
                  searchable={false}
                  cleanable={false}
                  menuAutoWidth
                  name="catagory"
                  accepter={SelectPicker}
                  data={categories.map(c => ({
                    label: c.icon + ' ' + c.name,
                    value: c.name
                  }))}/>
              </FormGroup>
              <FormGroup>
                <ControlLabel>子分類</ControlLabel>
                <FormControl
                  searchable={false}
                  cleanable={false}
                  menuAutoWidth
                  name="subCatagory"
                  accepter={SelectPicker}
                  data={subCategories.filter(
                    s => s.category === formData.catagory).map(c => ({
                    label: c.icon + ' ' + c.name,
                    value: c.name
                  }))}/>
              </FormGroup>
              <FormGroup>
                <ControlLabel>標題</ControlLabel>
                <FormControl name="title"/>
                <div style={{display: 'flex', flexWrap: 'wrap', marginTop: 8}}>
                  {options.map(opt => <div onClick={() => {
                    setFormData({
                      ...formData,
                      title: opt.title,
                      catagory: opt.catagory,
                      subCatagory: opt.subCatagory,
                      account: opt.account,
                      currency: opt.currency,
                      amount: opt.amount,
                      store: opt.store
                    });
                  }} key={opt.id} style={{
                    backgroundColor: 'rgb(25,27,32)',
                    padding: 8,
                    margin: '0 4px',
                    cursor: 'pointer',
                    borderRadius: 8
                  }}>
                    {opt.title}
                  </div>)}
                </div>
              </FormGroup>
              <FormGroup>
                <ControlLabel> 帳戶</ControlLabel>
                <FormControl cleanable={false} name="account"/>
              </FormGroup>
              <FormGroup>
                <ControlLabel>店家</ControlLabel>
                <FormControl name="store"/>
                <div style={{display: 'flex', flexWrap: 'wrap', marginTop: 8}}>
                  {storeOptions.map((opt, i) => <div onClick={() => {
                    setFormData({
                      ...formData,
                      store: opt
                    });
                  }} key={i} style={{
                    backgroundColor: 'rgb(25,27,32)',
                    padding: 8,
                    margin: '0 4px',
                    cursor: 'pointer',
                    borderRadius: 8
                  }}>
                    {opt}
                  </div>)}
                </div>
              </FormGroup>
              <FormGroup>
                <ControlLabel>幣種</ControlLabel>
                <FormControl name="currency"/>
              </FormGroup>
              <FormGroup>
                <ControlLabel>金額</ControlLabel>
                <FormControl accepter={InputNumber} step={0.01} name="amount"/>
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
      <div className="title-bar"/>
      <div className="main">
        <Router>
          <div className="side-bar"/>
          <Switch>
            <Route path="/" component={Hello}/>
          </Switch>
        </Router>
      </div>
    </React.Fragment>
  );
}
