import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from 'antd';
// import DevTools from 'mobx-react-devtools';
import { Header } from './Header';
import { EventFeed } from './EventFeed/EventFeed';

export class App extends React.Component {
    render() {
        return (
            <Layout>
                <Header />
                <Route exact path="/" component={EventFeed} />
                {/* <DevTools /> */}
            </Layout>
        );
    }
}
