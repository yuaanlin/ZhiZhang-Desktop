import React from 'react';
import {RecordForDisplay} from '../interface/Record';
import UpdateRecordModal from './UpdateRecordModal';
import useAppDispatch from '../../hooks/useAppDispatch';

function RecordCard(props: { record: RecordForDisplay }) {
  const {record} = props;
  const dispatch = useAppDispatch();

  return <div className="record-card-wrapper">
    <div
      className="record-card"
      onClick={() => dispatch(
        {
          type: 'modal/open',
          modal: UpdateRecordModal,
          props: {
            Record: record, onUpdated: () => {
            }
          }
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
        <p style={{color: record.amount > 0 ? 'green' : 'red'}}>
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
