import React, {useEffect} from 'react';
import './App.global.sass';
import './custom-theme.global.less';
import {Provider} from 'react-redux';
import store from './store';
import Router from './router';

export default function App() {

  function handleContextMenu(e: MouseEvent) {
    e.preventDefault();
  }

  useEffect(() => {
    window.addEventListener('contextmenu', handleContextMenu);
    return () => {
      window.removeEventListener('contextmenu', handleContextMenu);
    };
  }, []);

  return (
    <Provider store={store}>
      <div className="title-bar"/>
      <div className="main">
        <Router/>
      </div>
    </Provider>
  );
}
