import * as React from 'react';
import { Route, RouteComponentProps } from 'react-router-dom';
import { History } from 'history';
import { Layout } from 'antd';
// import DevTools from 'mobx-react-devtools';
import { Header } from './Header';
import { EventFeed } from './EventFeed/EventFeed';
import { EventDetail } from './EventDetail';
import { currentAccountInjector, MCurrentAccountProps } from '../store/stores';
import { inject, observer } from 'mobx-react';
import { Login } from './Login';
import { UserApply } from './UserApply';
import { VenueApply } from './VenueApply';
import { UserSpace } from './UserSpace';
import { CouponCenter } from './CouponCenter';
import { ModifyUserInfo } from './ModifyUserInfo';
import { RoleRedirector } from './RoleRedirector';
import { GenerateOrder } from './GenerateOrder';
import { VenueSpace } from './VenueSpace';
import { ManagerSpace } from './ManagerSpace';

type Props = MCurrentAccountProps & RouteComponentProps<{}>;

export let history: History | null = null;

@inject(currentAccountInjector)
@observer
export class App extends React.Component<Props> {

  componentDidMount() {
    history = this.props.history;
  }

  render() {
    return (
      <Layout>
        <Route component={Header} />
        <Route component={RoleRedirector} />
        <Route exact path="/" component={EventFeed} />
        <Route path="/event/:eventId" component={EventDetail} />
        <Route path="/apply/user" component={UserApply} />
        <Route path="/apply/venue" component={VenueApply} />
        <Route path="/login" component={Login} />
        <Route path="/user" component={UserSpace} />
        <Route path="/couponType" component={CouponCenter} />
        <Route path="/modify/user" component={ModifyUserInfo} />
        <Route path="/addOrder" component={GenerateOrder} />
        <Route path="/venue" component={VenueSpace} />
        <Route path="/manager" component={ManagerSpace} />
        {/* <DevTools /> */}
      </Layout>
    );
  }
}
