import * as React from 'react';
import { Card, Button, message } from 'antd';
import { CouponType, User } from '../model/models';
import { MCurrentAccountProps, currentAccountInjector } from '../store/stores';
import { inject, observer } from 'mobx-react';
import { getCouponTypeList, setCouponTypeActivated } from '../netAccess/couponType';
import { acquireCoupon } from '../netAccess/coupon';

type Props = MCurrentAccountProps;

type State = {
  couponTypes: CouponType[]
};

@inject(currentAccountInjector)
@observer
export class CouponCenter extends React.Component<Props, State> {

  state: State = {
    couponTypes: []
  };

  componentDidMount() {
    this.refreshData();
  }

  async refreshData() {
    const activatedOnly = this.props.currentAccount!.loggedAccount!.role === 'USER';
    this.setState({ couponTypes: await getCouponTypeList(activatedOnly) });
  }

  async handleAcquireCoupon(couponTypeId: number) {
    const user = this.props.currentAccount!.loggedAccount!.profile as User;
    const result = await acquireCoupon(user.userId, couponTypeId);
    if (result) {
      message.success('兑换成功！');
    } else {
      message.error('积分不足，兑换失败！');
    }
  }

  async handleToggleCouponType(couponTypeId: number, setActivated: boolean) {
    await setCouponTypeActivated(couponTypeId, setActivated);
    this.refreshData();
  }

  render() {
    const gridStyleSmall = {
      width: '20%',
      textAlign: 'center',
    };

    const { couponTypes } = this.state;
    const { role } = this.props.currentAccount!.loggedAccount!;

    return (
      <Card title="优惠券类型">
        {couponTypes.map(c =>
          <Card.Grid key={c.couponTypeId} style={gridStyleSmall}>
            <b>{c.description}</b>
            <p>兑换所需积分：{c.scoreNeeded}</p>
            {role === 'USER' ?
              <Button type="primary" onClick={() => this.handleAcquireCoupon(c.couponTypeId)}>兑换</Button>
              : role === 'MANAGER' ?
                c.isActivated ?
                  <Button type="danger" onClick={() => this.handleToggleCouponType(c.couponTypeId, false)}>取消</Button>
                  : <Button type="primary" onClick={() => this.handleToggleCouponType(c.couponTypeId, true)}>激活</Button>
                : null
            }
          </Card.Grid>
        )}
      </Card>
    );
  }

}