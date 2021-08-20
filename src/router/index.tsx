import SideBar from '../components/SideBar';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import React, {useEffect} from 'react';
import useAppDispatch from '../../hooks/useAppDispatch';
import {loadRecordsFromIndexedDB} from '../store/record/action';
import useAppSelector from '../../hooks/useAppSelector';
import {OpenedModal} from '../store/modal/type';
import RecordsPage from '../pages/RecordsPage';
import ProjectPage from '../pages/ProjectPage';
import {closeModal} from '../store/modal/action';
import AnalysisPage from '../pages/AnalysisPage';

function Router() {

  const dispatch = useAppDispatch();
  const modals = useAppSelector<OpenedModal[]>(r => r.modal.modals);

  useEffect(() => {
    dispatch(loadRecordsFromIndexedDB());
  }, []);

  return <BrowserRouter>
    {modals.map(m =>
      <m.modal
        key={m.key}
        isOpened={m.isOpened}
        onClose={() => dispatch(closeModal(m.key))}
        {...m.props}
      />)}
    <SideBar/>
    <Switch>
      <Route path="/analysis" component={AnalysisPage}/>
      <Route path="/project" component={ProjectPage}/>
      <Route path="/" component={RecordsPage}/>
    </Switch>
  </BrowserRouter>;
}

export default Router;
;
