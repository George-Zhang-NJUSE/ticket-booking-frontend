import * as React from 'react';
import { MCurrentAccountProps, currentAccountInjector } from '../store/stores';
import { inject, observer } from 'mobx-react';
import { Collapse, message, List, Card } from 'antd';
import {
  Venue, } from '../model/models';
import { MCurrentVenue } from '../store/currentAccount';
import { getEventList,  } from '../netAccess/event';
import { deleteVenueSeatType,  } from '../netAccess/venueSeatType';
import { getVenueOrderList } from '../netAccess/order';
import { getEventTicketList } from '../netAccess/ticket';
import { flattenArray } from '../util/objectUtil';

const Panel = Collapse.Panel;

type Props = MCurrentAccountProps;

type State = {
  
};

@inject(currentAccountInjector)
@observer
export class ManagerSpace extends React.Component<Props, State> {

  state: State = {
    events: [],
    orders: [],
    tickets: [],
    editingSeatType: undefined,
    editingEvent: undefined,
    isVenueChangeEditVisible: false,
    isSeatTypeEditVisible: false,
    isSeatTypeAddVisible: false,
    isEventAddVisible: false,
    isEventEditVisible: false
  };

  componentDidMount() {
    this.loadExtraData();
  }

  async loadExtraData() {
    const account = this.props.currentAccount!.loggedAccount;
    if (!account) {
      setTimeout(() => {
        this.loadExtraData();
      }, 1000);   // 重试
      return;
    }
    const venue = account.profile as Venue;
    const getAllEvents = getEventList({
      type: 'VENUE',
      condition: venue.venueId,
      fromTime: 0,
      toTime: Date.now() + 3 * 365 * 24 * 60 * 60 * 1000,
      pageSize: 10000,
      pageNum: 0
    });
    const getAllOrders = getVenueOrderList(venue.venueId);
    const getAllTickets = Promise.all((await getAllEvents).map(e => getEventTicketList(e.eventId)));

    this.setState({
      events: await getAllEvents,
      orders: await getAllOrders,
      tickets: flattenArray(await getAllTickets)
    });
  }

  refreshData() {
    this.loadExtraData();
    const venue = this.props.currentAccount!.loggedAccount! as MCurrentVenue;
    venue.refreshProfile();
  }

  async handleDeleteSeatType(seatTypeId: number) {
    await deleteVenueSeatType(seatTypeId);
    message.success('删除成功！');
    this.refreshData();
  }

  render() {
    const { loggedAccount } = this.props.currentAccount!;
    if (!loggedAccount) {
      return null;
    }

    const {} = this.state;

    return (
      <Collapse defaultActiveKey={['apply']}>
        <Panel header="场馆注册申请" key="apply">
          <h3>{name}</h3>
          <p>识别码：{venueId}</p>
          <p>地址：{address}</p>
          <p>简介：{description}</p>
          <Button type="primary" onClick={this.showVenueChangeEdit}>修改</Button>
          <VenueChangeEdit
            visible={isVenueChangeEditVisible}
            onCommit={this.handleSubmitVenueChange}
            onCancel={this.cancelVenueChangeEdit}
            oldName={name}
            oldAddress={address}
            oldDescription={description}
          />
        </Panel>
        <Panel header="场馆信息变更申请" key="change">
          <List
            itemLayout="horizontal"
            dataSource={availableSeatTypes}
            renderItem={(s: VenueSeatType) => {

              const actions = [
                <Button key="edit" onClick={() => this.showSeatTypeEdit(s)}>编辑</Button>,
                <Popconfirm
                  title="您确定要删除这个座位类型吗？"
                  key="delete"
                  onConfirm={() => this.handleDeleteSeatType(s.venueSeatTypeId)}
                  okText="确定"
                  cancelText="算了"
                >
                  <Button type="danger">删除</Button>
                </Popconfirm>
              ];

              return (
                <List.Item
                  key={s.venueSeatTypeId}
                  actions={actions}
                >
                  <List.Item.Meta
                    title={s.seatType}
                  />
                  <div>
                    <p>数量：{s.quantity}</p>
                    <p>行数：{s.totalRowNum}</p>
                    <p>列数：{s.totalColumnNum}</p>
                  </div>
                </List.Item>
              );
            }}
          />
        </Panel>
        <Panel header="待结算活动" key="events">
          <List
            dataSource={events}
            renderItem={(e: Event) => (
                <List.Item
                  key={e.eventId}
                  extra={<img style={{ height: '200px' }} src={e.posterUrl} />}
                  actions={[<Button key="edit" onClick={() => this.showEventEdit(e)}>编辑</Button>]}
                >
                  <List.Item.Meta
                    title={<Link to={'/event/' + e.eventId}>{e.eventName}</Link>}
                    description={e.description}
                  />
                  <div>
                    <p>活动类型：{eventTypeText[e.eventType]}</p>
                    <p>活动号：{e.eventId}</p>
                    <p>举行时间：{new Date(e.hostTime).toLocaleString()}</p>
                  </div>
                </List.Item>
              )
            }
          />
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
          <Card title="门票">
            <Card.Grid style={gridStyleSmall}>总售票数：{tickets.length}</Card.Grid>
            {Object.getOwnPropertyNames(ticketStateText).map(state =>
              <Card.Grid
                key={state}
                style={gridStyleSmall}
              >
                {ticketStateText[state]}：{tickets.filter(t => t.ticketState === state).length}
              </Card.Grid>
            )}
          </Card>
          <Card title="金额">
            <Card.Grid style={gridStylebig}>
              已完成订单金额：{orders.reduce((accu, next) => accu + next.state === 'COMPLETED' ? next.totalPrice : 0, 0)}元
            </Card.Grid>
            <Card.Grid style={gridStylebig}>
              累计受益：{profit}元
            </Card.Grid>
          </Card>
        </Panel>
      </Collapse>
    );
  }
}