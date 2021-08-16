import React from 'react';
import {Icon} from 'rsuite';
import {useHistory} from 'react-router-dom';

function SideBar() {
  const history = useHistory();

  return <div className="side-bar">
    <div className="item" onClick={() => history.push('/')}>
      <Icon icon="dashboard" size="2x"/>
    </div>
    <div className="item" onClick={() => history.push('/project')}>
      <Icon icon="detail" size="2x"/>
    </div>
  </div>;
}

export default SideBar;
