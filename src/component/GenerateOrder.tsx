import * as React from 'react';
import { Collapse, Card, Radio, Button, message } from 'antd';
import { observer, inject } from 'mobx-react';
import {
  currentAccountInjector, currentOrderInjector,
  MCurrentAccountProps, MCurrentOrderProps
} from '../store/stores';
import { Coupon, User } from '../model/models';
import { getUserCouponList } from '../netAccess/coupon';
import { RadioChangeEvent } from 'antd/lib/radio';
import { RouteComponentProps, Link } from 'react-router-dom';

const Panel = Collapse.Panel;
const RadioButton = Radio.Button;
const RadioGroup = Radio.Group;

type Props = MCurrentAccountProps & MCurrentOrderProps & RouteComponentProps<{}>;

type State = {
  availableCoupons: Coupon[]
};

@inject(currentOrderInjector)
@inject(currentAccountInjector)
@observer
export class GenerateOrder extends React.Component<Props, State> {

  state: State = {
    availableCoupons: []
  };

  async componentDidMount() {
    const user = this.props.currentAccount!.loggedAccount!.profile as User;
    const allCoupons = await getUserCouponList(user.userId);
    const totalTicketPrice = this.props.currentOrder!.totalTicketPrice;
    const availableCoupons = allCoupons.filter(c =>
      c.couponType.isActivated && (!c.isUsed) && (totalTicketPrice >= c.couponType.condition)
    );
    this.setState({ availableCoupons });
  }

  handleCouponSelect = (e: RadioChangeEvent) => {
    const value = e.target.value;
    const currentOrder = this.props.currentOrder!;
    if (value === 'dontuse') {
      currentOrder.setCoupon(null);
    } else {
      currentOrder.setCoupon(value as Coupon);
    }
  }

  handleSubmit = async () => {
    await this.props.currentOrder!.generateOrder();
    message.success('订单生成成功！');
  }

  handleCancel = () => {
    this.props.history.goBack();
  }

  render() {
    const event = this.props.currentOrder!.event!;
    const { tickets, totalPrice, totalTicketPrice, coupon,
      selectedPrice, userLevelDiscount } = this.props.currentOrder!;
    const { availableCoupons } = this.state;

    const gridStyleSmall = {
      width: '20%',
      textAlign: 'center',
    };

    return (
      <Collapse defaultActiveKey={['event', 'tickets', 'discount', 'final']}>
        <Panel header="活动信息" key="event">
          <p>{event.eventName}</p>
          <p>举办时间：{new Date(event.hostTime).toLocaleString()}</p>
        </Panel>
        <Panel header="订票信息" key="tickets">
          <Card title={`门票价格：${totalTicketPrice}元`}>
            {tickets.map(t =>
              <Card.Grid
                key={t.rowNum + '-' + t.columnNum}
                style={gridStyleSmall}
              >
                <b>{selectedPrice!.venueSeatType.seatType}</b>
                <b>{selectedPrice!.price}</b>
                <p>{t.rowNum! + 1}排 {t.columnNum! + 1}号</p>
              </Card.Grid>
            )}
          </Card>
        </Panel>
        <Panel header="优惠信息" key="discount">
          {availableCoupons.length > 0 ?
            <>
              <p>优惠券：</p>
              <RadioGroup onChange={this.handleCouponSelect} defaultValue={coupon || 'dontuse'}>
                <RadioButton value="dontuse">不使用优惠券</RadioButton>
                {availableCoupons.map(c =>
                  <RadioButton key={c.couponId} value={c}>{c.couponType.description}</RadioButton>
                )}
              </RadioGroup>
            </>
            : <p>无可用优惠券</p>
          }
          <p>{userLevelDiscount < 1 ? `用户等级优惠：${userLevelDiscount * 100}折` : '您的等级过低，不享受用户等级优惠'}</p>
        </Panel>
        <Panel header="总价" key="final">
          <h2>总价：{totalPrice}元</h2>
          <Link to="/user" style={{ marginRight: '20px' }}>
            <Button type="primary" onClick={this.handleSubmit}>下单</Button>
          </Link>
          <Button onClick={this.handleCancel}>取消</Button>
        </Panel>
      </Collapse>
    );
  }
}