import * as React from 'react';
import { Row, Col, Menu } from 'antd';
import { Link, RouteComponentProps } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { currentAccountInjector, MCurrentAccountProps } from '../store/stores';

type Props = MCurrentAccountProps & RouteComponentProps<{}>;

@inject(currentAccountInjector)
@observer
export class Header extends React.Component<Props> {

  handleLogout = () => {
    this.props.currentAccount!.logout();
  }

  shouldHide(path: string) {
    const hidePaths = ['login', 'apply'];
    return !!hidePaths.find(p => p === path);
  }

  render() {
    let levelOnePath = this.props.location.pathname.split('/')[1];
    if (!levelOnePath) {
      levelOnePath = 'main';
    }

    const style: any = {};
    if (this.shouldHide(levelOnePath)) {
      style.display = 'none';
    }

    return (
      <Row style={style}>
        <Col span={24}>
          <Menu
            selectedKeys={[levelOnePath]}
            mode="horizontal"
          >
            <Menu.Item key="main">
              <Link to="/">首页</Link>
            </Menu.Item>
            <Menu.Item key="login">
              {this.props.currentAccount!.isLoggedIn ?
                <Link to="/login" onClick={this.handleLogout}>退出</Link>
                : <Link to="/login">登录</Link>
              }
            </Menu.Item>
            <Menu.Item key="user">
              <Link to="/user">个人中心</Link>
            </Menu.Item>
            <Menu.Item key="couponType">
              <Link to="/couponType">优惠券中心</Link>
            </Menu.Item>
          </Menu>
        </Col>
      </Row>
    );
  }
}