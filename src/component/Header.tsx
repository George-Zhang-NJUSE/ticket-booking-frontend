import * as React from 'react';
import { Row, Col, Menu } from 'antd';
import { Link } from 'react-router-dom';
import { inject, observer } from 'mobx-react';
import { currentAccountInjector, MCurrentAccountProps } from '../store/stores';

type Props = MCurrentAccountProps;

@inject(currentAccountInjector)
@observer
export class Header extends React.Component<Props, { selectedKey: string }> {

    state = {
        selectedKey: 'main'
    };

    handleMenuClick = (e: Event & { key: string }) => {
        this.setState({ selectedKey: e.key });
    }

    handleLogout = () => {
        this.props.currentAccount!.logout();
    }

    render() {
        return (
            <Row>
                <Col span={24}>
                    <Menu
                        onClick={this.handleMenuClick as any}
                        selectedKeys={[this.state.selectedKey]}
                        mode="horizontal"
                    >
                        <Menu.Item key="main">
                            <Link to="/">首页</Link>
                        </Menu.Item>
                        <Menu.Item key="log">
                            {this.props.currentAccount!.isLoggedIn ?
                                <Link to="/login" onClick={this.handleLogout}>退出</Link>
                                : <Link to="/login">登录</Link>
                            }
                        </Menu.Item>
                        <Menu.SubMenu title="我的">
                            <Menu.Item key="userInfo">账号信息</Menu.Item>
                            <Menu.Item key="userOrders">我的订单</Menu.Item>
                            <Menu.Item key="userCoupons">我的优惠券</Menu.Item>
                        </Menu.SubMenu>
                    </Menu>
                </Col>
            </Row>
        );
    }
}