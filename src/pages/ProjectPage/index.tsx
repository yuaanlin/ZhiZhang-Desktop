import React, {useMemo, useState} from 'react';
import BillingRecord from '../../interface/Record';
import useAppSelector from '../../../hooks/useAppSelector';
import RecordCard from '../../components/RecordCard';
import convertRecord from '../../utils/convertRecord';

function groupRecordsByProject(records: BillingRecord[]) {
  const res: { [project: string]: BillingRecord[] } = {};

  records.map((record) => {
    if (res.hasOwnProperty(record.project)) {
      res[record.project] = [...res[record.project], record];
    } else {
      res[record.project] = [record];
    }
  });

  return res;
}

function Index() {

  const records = useAppSelector<BillingRecord[]>(r => r.record.records);

  const [selectedProject, selectProject] = useState<string>();

  const projects = useMemo(() => groupRecordsByProject(records), [records]);

  return <div className="project-page">
    <div className="left-section">
      {Object.keys(projects)
        .map(p => <p key={p} onClick={() => selectProject(p)}>{p}</p>)}
    </div>
    <h1>{selectedProject}</h1>
    <div className="record-list">
      {selectedProject && <div>
        {projects[selectedProject]
          .map(r =>
            <RecordCard
              key={r.id}
              record={convertRecord(r)}
              onClick={() => {
              }}/>
          )}
      </div>}
    </div>
  </div>;
}

export default Index;
