import React from 'react';
import ReactDOM from 'react-dom/client';
import { Provider } from 'react-redux';
import 'semantic-ui-css/semantic.min.css';
import * as log from 'loglevel';

import './index.css';
import RootRouter from './components/Routers/RootRouter';
import store from './store/configureStore';
import Config from './config';

log.setLevel(Config.logLevel);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RootRouter />
  </Provider>,
);
