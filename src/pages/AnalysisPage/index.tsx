import React, {useEffect, useState} from 'react';
import {Area, AreaChart, Tooltip, XAxis, YAxis} from 'recharts';
import './index.global.sass';
import BillingRecord from '../../interface/Record';
import Account from '../../interface/Account';
import useAppSelector from '../../../hooks/useAppSelector';
import accounts from '../../data/account';

function buildAnalysisDataFromRecords(options: { records: BillingRecord[], accounts: Account[], from: Date, to: Date }) {
  const res: any[] = [];

  while (options.from.getTime() <= options.to.getTime()) {
    const a: any = {
      'name': options.from.getFullYear() + '/' + (options.from.getMonth() + 1)
    };
    accounts.map(account => {
      a[account.name] = 0;
    });
    a['total'] = 0;
    res.push(a);
    options.from.setTime(options.from.setMonth(options.from.getMonth() + 1));
  }

  options.records.map(record => {
    res.map((month: any) => {
      const ry = record.time.getFullYear();
      const rm = record.time.getMonth() + 1;
      const cy = +month.name.split('/')[0];
      const cm = +month.name.split('/')[1];
      if (ry < cy || (ry === cy && rm <= cm)) {
        if (record.title === 'CATEGORY_ADJUSTMENT') {
          month[record.account] = record.amount;
          return;
        }
        month[record.account] += record.amount + record.fee + record.discount;
      }
      if (record.account === '國泰世華') {
        console.log(ry, rm, cy, cm);
      }
    });
  });

  res.map((month: any) => {
    month['中國銀行'] *= 4.3;
    accounts.map(account => {
      month[account.name] = Math.round(month[account.name]);
      month['total'] += month[account.name];
    });
  });
  return res;
}

function AnalysisPage() {
  const records = useAppSelector<BillingRecord[]>(r => r.record.records);
  const [data, setData] = useState<any[]>([]);

  useEffect(() => {
    const today = new Date();
    const aYearAgo = new Date(new Date().setFullYear(today.getFullYear() - 1));
    setData(buildAnalysisDataFromRecords(
      {records, accounts, from: aYearAgo, to: today}));
  }, []);

  return <div className="analysis-page">
    <AreaChart width={730} height={250} data={data}>
      <defs>
        <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#8884d8" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#8884d8" stopOpacity={0}/>
        </linearGradient>
        <linearGradient id="colorPv" x1="0" y1="0" x2="0" y2="1">
          <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8}/>
          <stop offset="95%" stopColor="#82ca9d" stopOpacity={0}/>
        </linearGradient>
      </defs>
      <XAxis dataKey="name"/>
      <YAxis/>
      <Tooltip/>
      {accounts.map(account =>
        <Area type="monotone" dataKey={account.name} stroke="#8884d8"
              fillOpacity={1}
              fill="url(#colorUv)"/>
      )}
      <Area type="monotone" dataKey="total" stroke="#8884d8"
            fillOpacity={1}
            fill="url(#colorPv)"/>
    </AreaChart>
  </div>;
}

export default AnalysisPage;
