import * as React from 'react';
import { MCurrentAccountProps, currentAccountInjector } from '../store/stores';
import { inject, observer } from 'mobx-react';
import { Collapse, List, Button, Popconfirm, Card, message, Tag } from 'antd';
import {
  orderStateText, Venue, VenueSeatType, Event,
  eventTypeText, Order, Ticket, ticketStateText
} from '../model/models';
import { Link } from 'react-router-dom';
import { MCurrentVenue } from '../store/currentAccount';
import { getEventList, modifyEvent, addNewEvent } from '../netAccess/event';
import { deleteVenueSeatType, modifyVenueSeatType, addNewVenueSeatType } from '../netAccess/venueSeatType';
import { getVenueOrderList } from '../netAccess/order';
import { getEventTicketList, checkTicket } from '../netAccess/ticket';
import { flattenArray } from '../util/objectUtil';
import { addNewVenueChange } from '../netAccess/venueChange';
import { VenueChangeEdit } from './VenueChangeEdit';
import { SeatTypeEdit } from './SeatTypeEdit';
import { EventEdit } from './EventEdit';
import { TicketChecker } from './TicketChecker';

const Panel = Collapse.Panel;

type Props = MCurrentAccountProps;

type State = {
  events: Event[]
  orders: Order[]
  tickets: Ticket[]
  editingSeatType: VenueSeatType | undefined
  editingEvent: Event | undefined
  isVenueChangeEditVisible: boolean
  isSeatTypeEditVisible: boolean
  isSeatTypeAddVisible: boolean
  isEventEditVisible: boolean
  isEventAddVisible: boolean
  isTicketCheckerVisible: boolean
};

@inject(currentAccountInjector)
@observer
export class VenueSpace extends React.Component<Props, State> {

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
    isEventEditVisible: false,
    isTicketCheckerVisible: false
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
    if (account.role !== 'VENUE') {
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

  getCurrentVenue() {
    const account = this.props.currentAccount!.loggedAccount;
    if (!account) {
      return;
    }
    return account.profile as Venue;
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
    const venue = this.getCurrentVenue();
    if (!venue) {
      return;
    }
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
    const venue = this.getCurrentVenue();
    if (!venue) {
      return;
    }
    await addNewVenueChange({
      venueId: venue.venueId,
      newName,
      newAddress,
      newDescription
    });
    message.success('申请修改成功！请等待管理员审批。');
    this.setState({ isVenueChangeEditVisible: false });
  }

  handleSubmitEditEvent = async (data: Event) => {
    await modifyEvent(data);
    message.success('修改成功！');
    this.setState({ isEventEditVisible: false, editingEvent: undefined });
    this.refreshData();
  }

  handleSubmitAddEvent = async (data: Partial<Event>) => {
    const venue = this.getCurrentVenue();
    if (!venue) {
      return;
    }
    await addNewEvent({
      venueId: venue.venueId,
      ...data
    });
    message.success(`添加成功！`);
    this.setState({ isEventAddVisible: false });
    this.refreshData();
  }

  handleSubmitTicketChecker = async (ticketId: number) => {
    await checkTicket(ticketId);
    message.success(`检票成功！`);
    this.setState({ isTicketCheckerVisible: false });
    this.refreshData();
  }

  showVenueChangeEdit = () => {
    this.setState({ isVenueChangeEditVisible: true });
  }

  cancelVenueChangeEdit = () => {
    this.setState({ isVenueChangeEditVisible: false });
  }

  showSeatTypeEdit(data?: VenueSeatType) {
    this.setState({ isSeatTypeEditVisible: true, editingSeatType: data });
  }

  cancelSeatTypeEdit = () => {
    this.setState({ isSeatTypeEditVisible: false, editingSeatType: undefined });
  }

  showSeatTypeAdd = () => {
    this.setState({ isSeatTypeAddVisible: true });
  }

  cancelSeatTypeAdd = () => {
    this.setState({ isSeatTypeAddVisible: false });
  }

  showEventEdit(data?: Event) {
    this.setState({ isEventEditVisible: true, editingEvent: data });
  }

  cancelEventEdit = () => {
    this.setState({ isEventEditVisible: false, editingEvent: undefined });
  }

  showEventAdd = () => {
    this.setState({ isEventAddVisible: true });
  }

  cancelEventAdd = () => {
    this.setState({ isEventAddVisible: false });
  }

  showTicketChecker = () => {
    this.setState({ isTicketCheckerVisible: true });
  }

  cancelTicketChecker = () => {
    this.setState({ isTicketCheckerVisible: false });
  }

  render() {
    const { loggedAccount } = this.props.currentAccount!;
    if (!loggedAccount || loggedAccount.role !== 'VENUE') {
      return null;
    }

    const { name, address, description, seatTypes, venueId, profit } = loggedAccount.profile as Venue;
    const availableSeatTypes = seatTypes.filter(s => !s.isDeleted);

    const { events, orders, tickets, isVenueChangeEditVisible,
      editingSeatType, isSeatTypeAddVisible, isSeatTypeEditVisible,
      isEventAddVisible, isEventEditVisible, editingEvent, isTicketCheckerVisible } = this.state;
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
            onCancel={this.cancelVenueChangeEdit}
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
            onCancel={this.cancelSeatTypeEdit}
          />
          <Button type="primary" onClick={this.showSeatTypeAdd}>新增</Button>
          <SeatTypeEdit
            visible={isSeatTypeAddVisible}
            action="增加"
            onCommit={this.handleSubmitAddSeatType}
            onCancel={this.cancelSeatTypeAdd}
          />
        </Panel>
        <Panel header="活动" key="events">
          <List
            dataSource={events}
            renderItem={(e: Event) => (
              <List.Item
                key={e.eventId}
                extra={<img style={{ height: '200px' }} src={e.posterUrl} />}
                actions={e.isHosted ?
                  undefined
                  : [
                    <Button key="edit" onClick={() => this.showEventEdit(e)}>编辑</Button>,
                    <Button key="check" type="primary" onClick={this.showTicketChecker}>检票</Button>
                  ]}
              >
                <List.Item.Meta
                  title={<Link to={'/event/' + e.eventId}>{e.eventName}</Link>}
                  description={e.description}
                />
                <div>
                  {e.isHosted ? <Tag color="cyan">已举行</Tag> : null}
                  <p>活动类型：{eventTypeText[e.eventType]}</p>
                  <p>活动号：{e.eventId}</p>
                  <p>举行时间：{new Date(e.hostTime).toLocaleString()}</p>
                </div>
              </List.Item>
            )}
          />
          <EventEdit
            visible={isEventEditVisible}
            action="编辑"
            data={editingEvent}
            seatTypes={availableSeatTypes}
            onCommit={this.handleSubmitEditEvent}
            onCancel={this.cancelEventEdit}
          />
          <EventEdit
            visible={isEventAddVisible}
            action="增加"
            seatTypes={availableSeatTypes}
            onCommit={this.handleSubmitAddEvent}
            onCancel={this.cancelEventAdd}
          />
          <TicketChecker
            visible={isTicketCheckerVisible}
            onCancel={this.cancelTicketChecker}
            onCommit={this.handleSubmitTicketChecker}
          />
          <Button type="primary" onClick={this.showEventAdd}>增加</Button>
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
              累计收益：{profit}元
            </Card.Grid>
          </Card>
        </Panel>
      </Collapse>
    );
  }
}