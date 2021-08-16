import React from 'react';
import 'rsuite/dist/styles/rsuite-default.css';
import './App.global.css';
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
