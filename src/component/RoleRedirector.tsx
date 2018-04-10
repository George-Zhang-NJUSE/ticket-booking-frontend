import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { currentAccountInjector, MCurrentAccountProps } from '../store/stores';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { Role } from '../model/models';
import { message } from 'antd';

type Props = MCurrentAccountProps & RouteComponentProps<{}>;

type State = {
  redirect: string | null;
};

type RolePathConfig = {
  [key in Role]: {
    home: string
    permittedPaths: string[]
  }
};

export const rolePathConfig: RolePathConfig = {
  MANAGER: {
    home: '/manager',
    permittedPaths: ['/couponType']
  },
  USER: {
    home: '/user',
    permittedPaths: ['/event', '/modify/user', '/']
  },
  VENUE: {
    home: '/venue',
    permittedPaths: ['/event']
  }
};

@inject(currentAccountInjector)
@observer
export class RoleRedirector extends React.Component<Props, State> {

  state: State = {
    redirect: null
  };

  componentWillReceiveProps(nextProps: Props) {
    const { loggedAccount } = nextProps.currentAccount!;
    const { location } = nextProps;
    if (!loggedAccount) {
      return this.setState({ redirect: null });
    }

    const role = loggedAccount.role;
    const roleConfig = rolePathConfig[role];
    const availablePaths = roleConfig.permittedPaths.concat(roleConfig.home);
    const currentPath = location.pathname;

    const isPermitted = availablePaths.find(p => {
      // 根目录需要完全匹配
      if (currentPath === '/') {
        return currentPath === p;
      }
      return currentPath.startsWith(p);
    });

    if (isPermitted) {
      return this.setState({ redirect: null });
    } else {
      message.error('您没有权限查看该页面！');
      return this.setState({ redirect: roleConfig.home });
    }
  }

  render() {
    const redirect = this.state.redirect;
    if (redirect) {
      return <Redirect to={redirect} />;
    } else {
      return null;
    }
  }

}