import * as React from 'react';
import { Row, Col, Menu } from 'antd';
import { Link } from 'react-router-dom';

const eventTypes = {
    music: '音乐会',
    opera: '戏剧歌剧',
    sports: '体育赛事',
    dance: '舞蹈',
    movie: '电影'
};

export class Header extends React.Component<{}, { selectedKey: string }> {

    state = {
        selectedKey: 'main'
    };

    handleClick = (e: Event & { key: string }) => {
        this.setState({ selectedKey: e.key });
    }

    render() {
        return (
            <Row>
                <Col span={24}>
                    <Menu
                        onClick={this.handleClick as any}
                        selectedKeys={[this.state.selectedKey]}
                        mode="horizontal"
                    >
                        <Menu.Item key="main">
                            <Link to="/">首页</Link>
                        </Menu.Item>
                        {Object.getOwnPropertyNames(eventTypes).map(key =>
                            <Menu.Item key={key}>
                                <Link to={`/event/${key}`}>{eventTypes[key]}</Link>
                            </Menu.Item>
                        )}
                        <Menu.Item key="login">
                            <Link to="/login">登录</Link>
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