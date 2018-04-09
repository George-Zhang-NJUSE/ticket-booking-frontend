import * as React from 'react';
import { observer, inject } from 'mobx-react';
import { currentAccountInjector, MCurrentAccountProps } from '../store/stores';
import { RouteComponentProps, Redirect } from 'react-router-dom';
import { Role } from '../model/models';

type Props = MCurrentAccountProps & RouteComponentProps<{}>;

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
export class RoleRedirector extends React.Component<Props> {

  render() {
    const { loggedAccount } = this.props.currentAccount!;
    const { location } = this.props;
    if (!loggedAccount) {
      return null;
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
      return null;
    } else {
      return <Redirect to={roleConfig.home} />;
    }
  }

}