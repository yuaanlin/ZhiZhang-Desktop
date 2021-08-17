import React from 'react';
import BillingRecord, {RecordForDisplay} from '../interface/Record';

function RecordCard(props: { record: RecordForDisplay, onClick: (b: BillingRecord) => void }) {
  const {record, onClick} = props;

  return <div className="record-card-wrapper">
    <div
      className="record-card"
      onClick={() => onClick({
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
  </div>;
}

export default RecordCard;
