import BillingRecord from '../interface/Record';

function parseMozeCSV(data: string) {
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

export default parseMozeCSV;
