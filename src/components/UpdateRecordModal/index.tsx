import React, {useEffect, useRef, useState} from 'react';
import {
  Button,
  ControlLabel,
  DatePicker,
  Form,
  FormControl,
  FormGroup,
  InputNumber,
  Modal,
  SelectPicker
} from 'rsuite';
import useAppDispatch from '../../../hooks/useAppDispatch';
import BillingRecord, {
  emptyUpdateRecordForm,
  UpdateRecordForm
} from '../../interface/Record';
import useAppSelector from '../../../hooks/useAppSelector';
import {deleteRecord, updateRecord} from '../../store/record/action';
import categories, {subCategories} from '../../data/categories';
import accounts from '../../data/account';

interface Props {
  isOpened: boolean;
  onClose: () => void;
  key: string;
  Record: BillingRecord;
  onUpdated: () => void;
}

function UpdateRecordModal(props: Props) {

  const dispatch = useAppDispatch();
  const records = useAppSelector<BillingRecord[]>(r => r.record.records);
  const [formData, setFormData] = useState<UpdateRecordForm>({
    ...props.Record,
    category: props.Record.catagory,
    subCategory: props.Record.subCatagory
  });

  const [storeOptions, setStoreOptions] = useState<BillingRecord[]>([]);
  const [options, setOptions] = useState<BillingRecord[]>([]);
  const [isTitleInputFocused, setTitleInputFocused] = useState(false);
  const [mode, setMode] = useState('outcome');

  async function submit() {
    await dispatch(updateRecord(formData));
    setFormData(emptyUpdateRecordForm);
    props.onUpdated()
  }

  async function submitDelete() {
    await dispatch(deleteRecord(formData.id))
    setFormData(emptyUpdateRecordForm);
    props.onClose()
  }

  const formDataRef = useRef(formData);
  formDataRef.current = formData;

  useEffect(() => {
    setTimeout(async () => {
      if (formDataRef.current.store.length === 0) return;
      let d = records.filter(r => r.store.includes(formDataRef.current.store));
      if (d.length > 5) d = d.slice(0, 5);
      setStoreOptions(d);
    }, 100);
  }, [formData.store]);

  useEffect(() => {
    if (!isTitleInputFocused) {
      setTimeout(() => {
        setOptions([]);
      }, 500);
      return;
    }
    setTimeout(async () => {
      if (formDataRef.current.title.length === 0) return;
      let d = records.filter(
        r => r.title.includes(formDataRef.current.title));
      if (d.length > 5) d = d.slice(0, 5);
      setOptions(d);
    }, 100);
  }, [formData.title, isTitleInputFocused]);

  return <Modal
    show={props.isOpened}
    className="create-record-modal"
    backdrop
    onHide={props.onClose}
  >
    <Modal.Header>
      <p>編輯記帳</p>
    </Modal.Header>
    <Modal.Body>
      <Form formValue={formData} onChange={(f: any) => setFormData(f)}>
        <FormGroup>
          <FormControl
            value={formData.time}
            onChangeCalendarDate={(v: Date) => setFormData(
              {...formData, time: v})}
            cleanable={false}
            inline
            accepter={DatePicker}
          />
        </FormGroup>
        <input
          onBlur={() => setTitleInputFocused(false)}
          onFocus={() => setTitleInputFocused(true)}
          className="record-title-input" placeholder="紀錄標題"
          value={formData.title}
          onChange={(e) => setFormData(
            {...formData, title: e.target.value})}/>
        <div className="options">
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
        <div style={{display: 'flex'}}>
          <FormGroup>
            <ControlLabel>類別</ControlLabel>
            <FormControl
              name="category"
              searchable={false}
              cleanable={false}
              menuAutoWidth
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
        </div>
        <FormGroup>
          <ControlLabel>帳戶</ControlLabel>
          <FormControl
            name="account"
            searchable={false}
            cleanable={false}
            menuAutoWidth
            accepter={SelectPicker}
            data={accounts.map(c => ({
              label: c.name,
              value: c.name
            }))}/>
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
                store: opt.store
              });
            }} key={i} style={{
              backgroundColor: 'rgb(25,27,32)',
              padding: 8,
              margin: '0 4px',
              cursor: 'pointer',
              borderRadius: 8
            }}>
              {opt.store}
            </div>)}
          </div>
        </FormGroup>
        <FormGroup>
          <ControlLabel>幣種</ControlLabel>
          <FormControl
            name="currency"
            searchable={false}
            cleanable={false}
            menuAutoWidth
            accepter={SelectPicker}
            data={[
              {label: 'NTD 新台幣', value: 'NTD'},
              {label: 'CNY 人民幣', value: 'CNY'}
            ]}/>
        </FormGroup>
        <FormGroup>
          <ControlLabel>金額</ControlLabel>
          <div style={{display: 'flex'}}>
            <SelectPicker
              value={mode}
              cleanable={false}
              searchable={false}
              onChange={v => setMode(v)}
              data={[
                {label: '收入', value: 'income'},
                {label: '支出', value: 'outcome'}
              ]}/>
            <InputNumber
              step={0.01}
              value={Math.abs(formData.amount)}
              onChange={v => setFormData(
                {...formData, amount: mode === 'income' ? +v : -v})}
            />
          </div>
        </FormGroup>
      </Form>
    </Modal.Body>
    <Modal.Footer>
      <Button color="red" onClick={submitDelete}>
        刪除
      </Button>
      <Button appearance="primary" onClick={submit}>
        送出
      </Button>
    </Modal.Footer>
  </Modal>;
}

export default UpdateRecordModal;
