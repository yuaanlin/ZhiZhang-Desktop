import Category from './Category';
import SubCategory from './SubCategory';

interface BillingRecord {
  id: number;
  // 帳戶
  account: string;
  // 幣種
  currency: string;
  // 記錄類型
  type: string;
  // 主類別
  catagory: string;
  // 子類別
  subCatagory: string;
  // 金額
  amount: number;
  // 手續費
  fee: number;
  // 折扣
  discount: number;
  // 名稱
  title: string;
  // 商家
  store: string;
  // 時間
  time: Date;
  // 專案
  project: string;
  // 描述
  description: string;
  // 標籤
  tag: string;
  // 對象
  target: string;
}

export function parseBillingRecord(data: BillingRecord) {
  data.time = new Date(data.time);
  return data;
}

export default BillingRecord;

export interface InsertRecordForm {
  title: string,
  store: string,
  amount: number,
  account: string,
  category: string,
  subCategory: string,
  project: string,
  currency: string,
  time: Date,
}

export const emptyInsertRecordForm: InsertRecordForm = {
  account: '',
  amount: 0,
  category: '',
  currency: '',
  project: '',
  store: '',
  subCategory: '',
  time: new Date,
  title: ''
};

export interface UpdateRecordForm {
  id: number,
  title: string,
  store: string,
  amount: number,
  account: string,
  category: string,
  subCategory: string,
  project: string,
  currency: string,
  time: Date,
}

export const emptyUpdateRecordForm: UpdateRecordForm = {
  id: 0,
  account: '',
  amount: 0,
  category: '',
  currency: '',
  project: '',
  store: '',
  subCategory: '',
  time: new Date,
  title: ''
};

export interface RecordForDisplay {
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

