import * as React from 'react';
import { MCurrentAccountProps, currentAccountInjector } from '../store/stores';
import { inject, observer } from 'mobx-react';
import { Collapse, Progress, List, Popover, Button, Popconfirm, message, Card, Tag } from 'antd';
import { Order, User, Ticket, Coupon, orderStateText, ticketStateText } from '../model/models';
import { getUserOrderList, cancelOrder, payOrder } from '../netAccess/order';
import { Link } from 'react-router-dom';
import { MCurrentUser } from '../store/currentAccount';
import { getUserCouponList } from '../netAccess/coupon';

const Panel = Collapse.Panel;

type Props = MCurrentAccountProps;

type State = {
  orders: Order[]
  coupons: Coupon[]
};

const nextLevelScores = [0, 100, 300, 600, 1000, 1500, 2100, 2800, 3600, 4500, 5500];

@inject(currentAccountInjector)
@observer
export class UserSpace extends React.Component<Props, State> {

  state: State = {
    orders: [],
    coupons: []
  };

  componentDidMount() {
    this.refreshData();
  }

  refreshData() {
    const account = this.props.currentAccount!.loggedAccount;
    if (!account || account.role !== 'USER') {
      return;
    }
    this.loadOrderAndCoupon();
    (account as MCurrentUser).refreshProfile();
  }

  async loadOrderAndCoupon() {
    const account = this.props.currentAccount!.loggedAccount;
    if (!account || account.role !== 'USER') {
      return;
    }
    const user = account.profile as User;
    const loadOrders = getUserOrderList(user.userId),
      loadCoupons = getUserCouponList(user.userId);

    this.setState({
      orders: await loadOrders,
      coupons: await loadCoupons
    });
  }

  async handleCancelOrder(orderId: number) {
    await cancelOrder(orderId);
    this.refreshData();
  }

  async handlePayOrder(orderId: number) {
    const result = await payOrder(orderId);
    if (result === true) {
      message.success('支付成功！');
      this.refreshData();
    } else {
      message.error('您的余额不足，支付失败！');
    }
  }

  render() {
    const { loggedAccount } = this.props.currentAccount!;
    if (!loggedAccount || loggedAccount.role !== 'USER') {
      return null;
    }

    const { accumulatedScore, score, level, name, gender, balance, email } = loggedAccount.profile as User;
    const remainingScoreToNextLevel = nextLevelScores[level] - accumulatedScore;
    const neededScoreToNextLevel = nextLevelScores[level] - nextLevelScores[level - 1];

    const { orders, coupons } = this.state;
    const gridStyleSmall = {
      width: '20%',
      textAlign: 'center',
    };
    const gridStylebig = {
      width: '50%',
      textAlign: 'center',
    };

    return (
      <Collapse defaultActiveKey={['info']}>
        <Panel header="个人信息" key="info">
          <p>姓名：{name}</p>
          <p>性别：{gender}</p>
          <p>邮箱：{email}</p>
          <p>等级：{level}级</p>
          {level < 11 ?
            <div>
              升级进度：
              <Progress
                percent={Math.round((1 - remainingScoreToNextLevel / neededScoreToNextLevel) * 100)}
                size="small"
                status="active"
              />
            </div>
            : <p>已经是最高等级</p>
          }
          <p>还需{remainingScoreToNextLevel}分即可升级</p>
          <p>账户余额：{balance}元</p>
          <p>可用积分：{score}分</p>
          <Button type="primary">
            <Link to="/modify/user">修改</Link>
          </Button>
        </Panel>
        <Panel header="订单" key="orders">
          <List
            itemLayout="horizontal"
            dataSource={orders}
            renderItem={(order: Order) => {
              const ticketDetail = (
                <List
                  header="订票详情"
                  size="small"
                  bordered
                  dataSource={order.tickets}
                  renderItem={(t: Ticket) => (
                    <List.Item key={t.ticketId}>
                      <p>{t.venueSeatType.seatType}  {t.rowNum + 1}排{t.columnNum + 1}号</p>
                      <p>门票号：{t.ticketId}</p>
                      <Tag color="cyan" style={{ marginLeft: '16px' }}>{ticketStateText[t.ticketState]}</Tag>
                    </List.Item>
                  )}
                />
              );

              const actions = [
                <Popover key="ticketDetail" content={ticketDetail} trigger="click">
                  <Button>查看详情</Button>
                </Popover>
              ];

              // 根据订单状态添加支付或取消动作
              const cancelOrderButton = (
                <Popconfirm
                  title="您确定要取消这个订单吗？"
                  onConfirm={() => this.handleCancelOrder(order.orderId)}
                  okText="确定"
                  cancelText="算了"
                  key="cancel"
                >
                  <Button type="danger">取消订单</Button>
                </Popconfirm>
              );

              const payOrderButton = (
                <Popconfirm
                  title="您确定要支付这个订单吗？"
                  onConfirm={() => this.handlePayOrder(order.orderId)}
                  okText="确定"
                  cancelText="算了"
                  key="pay"
                >
                  <Button type="primary">支付订单</Button>
                </Popconfirm>
              );

              if (order.state === 'PAID') {
                actions.push(cancelOrderButton);
              } else if (order.state === 'UNPAID') {
                actions.push(cancelOrderButton, payOrderButton);
              }

              return (
                <List.Item
                  key={order.orderId}
                  actions={actions}
                >
                  <List.Item.Meta
                    title={<Link to={`/event/${order.eventId}`}>{order.event.eventName}</Link>}
                    description={`订单号：${order.orderId}`}
                  />
                  <div>
                    <p>状态：{orderStateText[order.state]}</p>
                    <p>总价：{order.totalPrice}</p>
                    <p>创建时间：{new Date(order.createTime).toLocaleString()}</p>
                  </div>
                </List.Item>
              );
            }}
          />
        </Panel>
        <Panel header="优惠券" key="coupons">
          <Card>
            {coupons.map(c =>
              <Card.Grid key={c.couponId} style={gridStyleSmall}>
                {c.isUsed ?
                  <Tag color="volcano">已使用</Tag>
                  : null
                }
                <h3>{c.couponType.description}</h3>
                {c.couponType.isActivated ?
                  null
                  : <p>当前不可用（网站方已禁用此种优惠券）</p>
                }
                <p>获取时间：{new Date(c.getTime).toLocaleString()}</p>
              </Card.Grid>
            )}
          </Card>
        </Panel>
        <Panel header="统计信息" key="statistics">
          <Card title="订单">
            <Card.Grid style={gridStyleSmall}>总订单数：{orders.length}</Card.Grid>
            {Object.getOwnPropertyNames(orderStateText).map(state =>
              <Card.Grid
                key={state}
                style={gridStyleSmall}
              >
                {orderStateText[state]}：{orders.filter(o => o.state === state).length}
              </Card.Grid>
            )}
          </Card>
          <Card title="金额">
            <Card.Grid style={gridStylebig}>
              已完成订单金额：{orders.reduce((accu, next) => accu + next.state === 'COMPLETED' ? next.totalPrice : 0, 0)}元
            </Card.Grid>
            <Card.Grid style={gridStylebig}>
              累计获得积分：{accumulatedScore}分
            </Card.Grid>
          </Card>
        </Panel>
      </Collapse>
    );
  }
}