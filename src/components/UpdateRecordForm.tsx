import React, {useEffect, useState} from 'react';
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
import BillingRecord, {emptyUpdateRecordForm} from '../interface/Record';
import categories, {subCategories} from '../data/categories';
import useAppDispatch from '../../hooks/useAppDispatch';
import {deleteRecord, updateRecord} from '../store/record/action';

function UpdateRecordForm(props: {
  Record: BillingRecord;
  onUpdated: () => void;
  onCanceled: () => void;
}) {
  const dispatch = useAppDispatch();
  const [formData, setFormData] = useState(emptyUpdateRecordForm);

  async function submit() {
    await dispatch(updateRecord(formData));
    props.onUpdated();
  }

  useEffect(() => {
    if (props.Record) setFormData({
      ...formData, ...props.Record,
      category: props.Record.catagory,
      subCategory: props.Record.subCatagory
    });
  }, [props.Record]);

  return (
    <Form formValue={formData} onChange={(f: any) => setFormData(f)}>
      <h3>編輯紀錄</h3>
      <FormGroup>
        <FormControl
          inline cleanable={false}
          value={formData.time}
          onChangeCalendarDate={(v: Date) => setFormData(
            {...formData, time: v})}
          accepter={DatePicker}/>
      </FormGroup>
      <FormGroup>
        <ControlLabel>標題</ControlLabel>
        <FormControl
          name="title"
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>類別</ControlLabel>
        <FormControl
          searchable={false}
          cleanable={false}
          menuAutoWidth
          name="category"
          accepter={SelectPicker}
          data={categories.map(c => ({
            label: c.icon + ' ' + c.name,
            value: c.name
          }))}/>
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
        <ControlLabel>專案</ControlLabel>
        <FormControl name="project"/>
      </FormGroup>
      <FormGroup>
        <ControlLabel>帳戶</ControlLabel>
        <FormControl
          cleanable={false}
          name="account"
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>店家</ControlLabel>
        <FormControl
          name="store"
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>幣種</ControlLabel>
        <FormControl
          name="currency"
        />
      </FormGroup>
      <FormGroup>
        <ControlLabel>金額</ControlLabel>
        <FormControl accepter={InputNumber} step={0.01} name="amount"/>
      </FormGroup>
      <div style={{display: 'flex', justifyContent: 'space-between'}}>
        <Button
          onClick={async () => {
            await dispatch(deleteRecord(formData.id));
            props.onUpdated();
          }}
          color="red">
          刪除
        </Button>
        <div>
          <Button appearance="primary" onClick={submit}>
            送出
          </Button>
          <Button style={{marginLeft: 20}} onClick={props.onCanceled}>
            取消
          </Button>
        </div>
      </div>
    </Form>
  );
}

export default UpdateRecordForm;
