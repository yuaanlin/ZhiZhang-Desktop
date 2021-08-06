import React, { useEffect, useState } from 'react';
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
import IndexedDb from '../IndexedDB';
import BillingRecord from '../interface/Record';

function UpdateRecordForm(props: {
  Record: BillingRecord;
  possibleStores: string[];
  possibleCatagories: string[];
  possibleSubCatagories: string[];
  possibleTitles: string[];
  possibleCurrencies: string[];
  possibleAccount: string[];
  onUpdated: () => void;
  onCanceled: () => void;
}) {
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

  async function submit() {
    const runIndexDb = async () => {
      const indexedDb = new IndexedDb('yuan');
      await indexedDb.createObjectStore(['billing_records']);
      const f: BillingRecord = {
        ...formData,
        id: props.Record.id,
        type: formData.amount > 0 ? '收入' : '支出',
        fee: 0,
        discount: 0,
        tag: '',
        target: '',
        project: '',
        amount: +formData.amount,
        description: '',
      };
      await indexedDb.putBulkValue('billing_records', [f]);
    };
    await runIndexDb();
    props.onUpdated();
  }

  useEffect(() => {
    if (props.Record) setFormData({ ...formData, ...props.Record });
  }, [props.Record]);

  return (
    <Form formValue={formData} onChange={(f: any) => setFormData(f)}>
      <FormGroup>
        <ControlLabel>日期</ControlLabel>
        <FormControl name="time" cleanable={false} accepter={DatePicker} />
      </FormGroup>
      <FormGroup>
        <ControlLabel>分類</ControlLabel>
        <FormControl
          cleanable={false}
          name="catagory"
          accepter={SelectPicker}
          data={props.possibleCatagories.map((c) => ({ label: c, value: c }))}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>子分類</ControlLabel>
        <FormControl
          cleanable={false}
          name="subCatagory"
          accepter={SelectPicker}
          data={props.possibleSubCatagories.map((c) => ({
            label: c,
            value: c,
          }))}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>標題</ControlLabel>
        <FormControl
          accepter={AutoComplete}
          data={props.possibleTitles.map((c) => ({ label: c, value: c }))}
          name="title"
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>帳戶</ControlLabel>
        <FormControl
          cleanable={false}
          name="account"
          accepter={SelectPicker}
          data={props.possibleAccount.map((c) => ({ label: c, value: c }))}
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>店家</ControlLabel>
        <FormControl
          accepter={AutoComplete}
          data={props.possibleStores}
          name="store"
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>幣種</ControlLabel>
        <FormControl
          accepter={AutoComplete}
          data={props.possibleCurrencies}
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
      <Button style={{ marginLeft: 20 }} onClick={props.onCanceled}>
        取消
      </Button>
    </Form>
  );
}

export default UpdateRecordForm;
