import React from 'react';
import './App.global.sass';
import './custom-theme.global.less';
import {Provider} from 'react-redux';
import store from './store';
import Router from './router';

export default function App() {
  return (
    <Provider store={store}>
      <div className="title-bar"/>
      <div className="main">
        <Router/>
      </div>
    </Provider>
  );
}
