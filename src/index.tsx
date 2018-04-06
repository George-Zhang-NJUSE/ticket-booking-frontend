import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { BrowserRouter, Route } from 'react-router-dom';
import { Provider } from 'mobx-react';
import { App } from './component/App';
import registerServiceWorker from './registerServiceWorker';
import { stores } from './store/stores';

import './index.css';

ReactDOM.render(
  <Provider stores={stores} >
    <BrowserRouter>
      <Route component={App} />
    </BrowserRouter>
  </Provider>,
  document.getElementById('root') as HTMLElement
);
registerServiceWorker();
