import React, {Component, PropTypes} from 'react';
import {Stage, Sprite} from 'react-pixi';
import {render} from 'react-dom';
import PIXI from 'pixi.js';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import App from './App';

import reducer from './worldReducer';

const devTools = devToolsExtension && devToolsExtension();
const store = devTools ? createStore(reducer, devTools) : createStore(reducer);

render(
  <Provider store={store}><App /></Provider>,
  document.querySelector('#root')
);
