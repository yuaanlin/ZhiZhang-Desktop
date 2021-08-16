import BillingRecord, {RecordForDisplay} from '../interface/Record';
import categories, {subCategories} from '../data/categories';

function convertRecord(r: BillingRecord): RecordForDisplay {
  const c = categories.find(ca => ca.name === r.catagory);
  const s = subCategories.find(sc => sc.name === r.subCatagory);
  return {
    ...r,
    category: c ||
      {name: r.catagory, color: 'gray', icon: '🤔️', subCategories: []},
    subCategory: s ||
      {
        name: r.catagory,
        icon: c ? c.icon : '🤔️',
        category: r.catagory
      }
  };
}

export default convertRecord;
