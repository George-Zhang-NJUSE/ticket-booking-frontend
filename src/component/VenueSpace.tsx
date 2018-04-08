import * as React from 'react';
import { MCurrentAccountProps, currentAccountInjector } from '../store/stores';
import { inject, observer } from 'mobx-react';
import { Collapse, List, Popover, Button, Popconfirm, Card, Tag, message, Modal } from 'antd';
import {
  orderStateText, Venue, VenueSeatType, Event,
  eventTypeText, Order, Ticket, ticketStateText
} from '../model/models';
import { Link } from 'react-router-dom';
import { MCurrentVenue } from '../store/currentAccount';
import { getEventList } from '../netAccess/event';
import { deleteVenueSeatType, modifyVenueSeatType, addNewVenueSeatType } from '../netAccess/venueSeatType';
import { getVenueOrderList } from '../netAccess/order';
import { getEventTicketList } from '../netAccess/ticket';
import { flattenArray } from '../util/objectUtil';
import { addNewVenueChange } from '../netAccess/venueChange';
import { VenueChangeEdit } from './VenueChangeEdit';
import { SeatTypeEdit } from './SeatTypeEdit';

const Panel = Collapse.Panel;

type Props = MCurrentAccountProps;

type State = {
  events: Event[]
  orders: Order[]
  tickets: Ticket[]
  editingSeatType: VenueSeatType | undefined
  isVenueChangeEditVisible: boolean
  isSeatTypeEditVisible: boolean
  isSeatTypeAddVisible: boolean
};

@inject(currentAccountInjector)
@observer
export class UserSpace extends React.Component<Props, State> {

  state: State = {
    events: [],
    orders: [],
    tickets: [],
    editingSeatType: undefined,
    isVenueChangeEditVisible: false,
    isSeatTypeEditVisible: false,
    isSeatTypeAddVisible: false
  };

  componentDidMount() {
    this.loadExtraData();
  }

  async loadExtraData() {
    const account = this.props.currentAccount!.loggedAccount;
    if (!account) {
      return;
    }
    const venue = account.profile as Venue;
    const getAllEvents = getEventList({
      type: 'VENUE',
      condition: venue.venueId,
      fromTime: 0,
      toTime: Date.now(),
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

  handleSubmitEditSeatType = async (data: VenueSeatType) => {
    await modifyVenueSeatType(data);
    message.success('编辑成功！');
    this.setState({ isSeatTypeEditVisible: false });
    this.refreshData();
  }

  handleSubmitAddSeatType = async (data: Partial<VenueSeatType>) => {
    const account = this.props.currentAccount!.loggedAccount;
    if (!account) {
      return;
    }
    const venue = account.profile as Venue;
    await addNewVenueSeatType({
      venueId: venue.venueId,
      quantity: data.totalRowNum! * data.totalColumnNum!,
      ...data
    });
    message.success('添加成功！');
    this.setState({ isSeatTypeAddVisible: false });
    this.refreshData();
  }

  handleSubmitVenueChange = async (newName: string, newAddress: string, newDescription: string) => {
    const account = this.props.currentAccount!.loggedAccount;
    if (!account) {
      return;
    }
    const venue = account.profile as Venue;
    await addNewVenueChange({
      venueId: venue.venueId,
      newName,
      newAddress,
      newDescription
    });
    message.success(`申请修改成功！请等待管理员审批。`);
    this.setState({ isVenueChangeEditVisible: false });
  }

  showVenueChangeEdit = () => {
    this.setState({ isVenueChangeEditVisible: true });
  }

  handleVenueChangeEditCancel = () => {
    this.setState({ isVenueChangeEditVisible: false });
  }

  showSeatTypeEdit(data?: VenueSeatType) {
    this.setState({ isSeatTypeEditVisible: true, editingSeatType: data });
  }

  handleSeatTypeEditCancel = () => {
    this.setState({ isSeatTypeEditVisible: false, editingSeatType: undefined });
  }

  showSeatTypeAdd = () => {
    this.setState({ isSeatTypeAddVisible: true });
  }

  handleSeatTypeAddCancel = () => {
    this.setState({ isSeatTypeAddVisible: false });
  }

  render() {
    const { loggedAccount } = this.props.currentAccount!;
    if (!loggedAccount) {
      return null;
    }

    const { name, address, description, seatTypes, venueId, profit } = loggedAccount.profile as Venue;
    const availableSeatTypes = seatTypes.filter(s => !s.isDeleted);

    const { events, orders, tickets, isVenueChangeEditVisible,
      editingSeatType, isSeatTypeAddVisible, isSeatTypeEditVisible } = this.state;
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
        <Panel header="场馆信息" key="info">
          <h3>{name}</h3>
          <p>识别码：{venueId}</p>
          <p>地址：{address}</p>
          <p>简介：{description}</p>
          <Button type="primary" onClick={this.showVenueChangeEdit}>修改</Button>
          <VenueChangeEdit
            visible={isVenueChangeEditVisible}
            onCommit={this.handleSubmitVenueChange}
            onCancel={this.handleVenueChangeEditCancel}
            oldName={name}
            oldAddress={address}
            oldDescription={description}
          />
        </Panel>
        <Panel header="座位情况" key="seats">
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
          <SeatTypeEdit
            visible={isSeatTypeEditVisible}
            action="编辑"
            data={editingSeatType}
            onCommit={this.handleSubmitEditSeatType}
            onCancel={this.handleSeatTypeEditCancel}
          />
          <Button type="primary" onClick={this.showSeatTypeAdd}>新增</Button>
          <SeatTypeEdit
            visible={isSeatTypeAddVisible}
            action="增加"
            onCommit={this.handleSubmitAddSeatType}
            onCancel={this.handleSeatTypeAddCancel}
          />
        </Panel>
        <Panel header="活动" key="events">
          <List
            dataSource={events}
            renderItem={(e: Event) => {

              // 编辑、检票、线下购票
              const actions = [

              ];  

              return (
                <List.Item
                  key={e.eventId}
                  extra={<img style={{ height: '200px' }} src={e.posterUrl} />}
                  actions={[<Button key="edit">编辑</Button>]}
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
              );
            }}
          />
          <Button type="primary">增加</Button>
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