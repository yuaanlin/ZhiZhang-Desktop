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

export default BillingRecord;
