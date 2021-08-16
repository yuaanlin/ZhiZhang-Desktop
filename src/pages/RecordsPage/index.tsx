import BillingRecord, {
  emptyInsertRecordForm,
  RecordForDisplay
} from '../../interface/Record';
import React, {createRef, useEffect, useMemo, useRef, useState} from 'react';
import IndexedDb from '../../IndexedDB';
import parseMozeCSV from '../../utils/parseMozeCSV';
import categories, {subCategories} from '../../data/categories';
import accounts from '../../data/account';
import numberWithCommas from '../../utils/numberWithCommas';
import {
  Button,
  ControlLabel,
  DatePicker,
  Form,
  FormControl,
  FormGroup,
  InputNumber,
  SelectPicker
} from 'rsuite';
import UpdateRecordForm from '../../components/UpdateRecordForm';
import useAppSelector from '../../../hooks/useAppSelector';
import useAppDispatch from '../../../hooks/useAppDispatch';
import {insertRecord} from '../../store/record/action';
import RecordCard from '../../components/RecordCard';

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

function RecordsPage() {
  const records = useAppSelector<BillingRecord[]>(r => r.record.records);
  const dispatch = useAppDispatch();
  const [selectedRecord, setSelectedRecord] = useState<BillingRecord>();
  const [options, setOptions] = useState<BillingRecord[]>([]);
  const [storeOptions, setStoreOptions] = useState<string[]>([]);

  const innerRef = createRef<HTMLDivElement>();

  useEffect(() => {
    if (innerRef.current)
      innerRef.current.scrollTop = innerRef.current.scrollHeight;
  }, [records]);

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

  const [formData, setFormData] = useState(emptyInsertRecordForm);

  useEffect(() => {
    if (formData.title.length === 0) setOptions([]);
    const f = records.reverse().find((r) => r.title === formData.title);
    if (f)
      setFormData({
        ...formData,
        account: f.account,
        project: f.project,
        category: f.catagory,
        subCategory: f.subCatagory,
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
      r => Math.abs(r.time.getTime() - today.getTime()) < 2 * 30 * 24 * 60 *
        60 *
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
    await dispatch(insertRecord(formData));
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
      let d = records.filter(
        r => r.title.includes(formDataRef.current.title));
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
              <span style={{fontSize: 16, marginRight: 6, opacity: 0.5}}>
                {accounts.find(a => a.name === key)?.currency + '$'}
              </span>
              {numberWithCommas(sum[key])}
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
            <RecordCard
              key={record.id}
              record={record}
              onClick={setSelectedRecord}/>
          ))}
        </div>
      </div>
      <div className="right-section">
        {selectedRecord ? (
          <UpdateRecordForm
            Record={selectedRecord}
            onUpdated={() => setSelectedRecord(undefined)}
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
                  name="subCategory"
                  accepter={SelectPicker}
                  data={subCategories.filter(
                    s => s.category === formData.category).map(c => ({
                    label: c.icon + ' ' + c.name,
                    value: c.name
                  }))}/>
              </FormGroup>
              <FormGroup>
                <ControlLabel>標題</ControlLabel>
                <FormControl name="title"/>
                <div
                  style={{display: 'flex', flexWrap: 'wrap', marginTop: 8}}>
                  {options.map(opt => <div onClick={() => {
                    setFormData({
                      ...formData,
                      title: opt.title,
                      category: opt.catagory,
                      subCategory: opt.subCatagory,
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
                <ControlLabel>帳戶</ControlLabel>
                <FormControl cleanable={false} name="account"/>
              </FormGroup>
              <FormGroup>
                <ControlLabel>專案</ControlLabel>
                <FormControl cleanable={false} name="project"/>
              </FormGroup>
              <FormGroup>
                <ControlLabel>店家</ControlLabel>
                <FormControl name="store"/>
                <div
                  style={{display: 'flex', flexWrap: 'wrap', marginTop: 8}}>
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
                <FormControl accepter={InputNumber} step={0.01}
                             name="amount"/>
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
}

export default RecordsPage;
