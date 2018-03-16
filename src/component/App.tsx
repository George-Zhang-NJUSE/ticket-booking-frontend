import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from 'antd';
import { Header } from './Header';
import { EventFilter } from './EventFilter';

export class App extends React.Component {
    render() {
        return (
            <Layout>
                <Header />
                <Route path="/event/:type" component={EventFilter} />
            </Layout>
        );
    }
}
