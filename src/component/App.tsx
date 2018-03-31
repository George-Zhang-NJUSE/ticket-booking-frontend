import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from 'antd';
// import DevTools from 'mobx-react-devtools';
import { Header } from './Header';
import { EventFeed } from './EventFeed/EventFeed';
import { EventDetail } from './EventDetail';

export class App extends React.Component {
    render() {
        return (
            <Layout>
                <Header />
                <Route exact path="/" component={EventFeed} />
                <Route path="/event/:eventId" component={EventDetail} />
                {/* <DevTools /> */}
            </Layout>
        );
    }
}
