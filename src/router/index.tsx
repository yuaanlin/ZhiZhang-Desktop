import SideBar from '../components/SideBar';
import {BrowserRouter, Route, Switch} from 'react-router-dom';
import Index from '../pages/ProjectPage';
import React, {useEffect} from 'react';
import useAppDispatch from '../../hooks/useAppDispatch';
import {loadRecordsFromIndexedDB} from '../store/record/action';
import RecordsPage from '../pages/RecordsPage';

function Router() {

  const dispatch = useAppDispatch();

  useEffect(() => {
    dispatch(loadRecordsFromIndexedDB());
  }, []);

  return <BrowserRouter>
    <SideBar/>
    <Switch>
      <Route path="/project" component={Index}/>
      <Route path="/" component={RecordsPage}/>
    </Switch>
  </BrowserRouter>;
}

export default Router;
