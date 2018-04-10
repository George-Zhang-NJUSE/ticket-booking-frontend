import * as React from 'react';
import { MCurrentAccountProps, currentAccountInjector } from '../store/stores';
import { inject, observer } from 'mobx-react';
import { Link } from 'react-router-dom';
import { Collapse, message, List, Card, Button } from 'antd';
import {
  Venue, VenueChange, Summary, eventTypeText, Statistics,
} from '../model/models';
import { getApplyingVenueList, setVenueApplicationApproved } from '../netAccess/venue';
import { getVenueChangeList, setVenueChangeApproved } from '../netAccess/venueChange';
import { getAllSummaryList, setSummaryHandled } from '../netAccess/summary';
import { getStatistics } from '../netAccess/manager';

const Panel = Collapse.Panel;

type Props = MCurrentAccountProps;

type State = {
  venueApplies: Venue[]
  pendingVenueChanges: VenueChange[]
  summaries: Summary[]
  statistics: Statistics
};

@inject(currentAccountInjector)
@observer
export class ManagerSpace extends React.Component<Props, State> {

  state: State = {
    venueApplies: [],
    pendingVenueChanges: [],
    summaries: [],
    statistics: {
      activatedUserNum: 0,
      approvedVenueNum: 0,
      femaleUserNum: 0,
      maleUserNum: 0
    }
  };

  componentDidMount() {
    this.refreshData();
  }

  async refreshData() {
    const account = this.props.currentAccount!.loggedAccount;
    if (!account) {
      setTimeout(() => {
        this.refreshData();
      }, 1000);   // 重试
      return;
    }
    if (account.role !== 'MANAGER') {
      return;
    }
    const getVenueApplies = getApplyingVenueList();
    const getPendingVenueChanges = getVenueChangeList('PENDING', 10000, 0);
    const getAllSummaries = getAllSummaryList();
    const getStat = getStatistics();

    this.setState({
      venueApplies: await getVenueApplies,
      pendingVenueChanges: await getPendingVenueChanges,
      summaries: await getAllSummaries,
      statistics: await getStat
    });
  }

  async handleSettleVenueApply(venueId: number, isApproved: boolean) {
    await setVenueApplicationApproved(venueId, isApproved);
    message.success(isApproved ? '已批准！' : '已拒绝！');
    this.refreshData();
  }

  async handleSettleVenueChange(venueChangeId: number, isApproved: boolean) {
    await setVenueChangeApproved(venueChangeId, isApproved);
    message.success(isApproved ? '已批准！' : '已拒绝！');
    this.refreshData();
  }

  async handleSummary(summaryId: number) {
    await setSummaryHandled(summaryId);
    message.success('结算完成！');
    this.refreshData();
  }

  render() {
    const { loggedAccount } = this.props.currentAccount!;
    if (!loggedAccount || loggedAccount.role !== 'MANAGER') {
      return null;
    }

    const { pendingVenueChanges, summaries, venueApplies, statistics } = this.state;
    const unhandledSummaries = summaries.filter(s => !s.isHandled);
    const handledSummaries = summaries.filter(s => s.isHandled);

    const gridStyleSmall = {
      width: '20%',
      textAlign: 'center',
    };

    return (
      <Collapse defaultActiveKey={['apply']}>
        <Panel header="场馆注册申请" key="apply">
          <List
            dataSource={venueApplies}
            renderItem={(v: Venue) => (
              <List.Item
                key={v.venueId}
                actions={[
                  <Button
                    key="approve"
                    type="primary"
                    onClick={() => this.handleSettleVenueApply(v.venueId, true)}
                  >
                    批准
                  </Button>,
                  <Button
                    key="reject"
                    type="danger"
                    onClick={() => this.handleSettleVenueApply(v.venueId, false)}
                  >
                    拒绝
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={v.name}
                  description={v.address}
                />
                <div>{v.description}</div>
              </List.Item>
            )}
          />
        </Panel>
        <Panel header="场馆信息变更申请" key="change">
          <List
            dataSource={pendingVenueChanges}
            renderItem={(c: VenueChange) => (
              <List.Item
                key={c.venueChangeId}
                actions={[
                  <Button
                    key="approve"
                    type="primary"
                    onClick={() => this.handleSettleVenueChange(c.venueChangeId, true)}
                  >
                    批准
                  </Button>,
                  <Button
                    key="reject"
                    type="danger"
                    onClick={() => this.handleSettleVenueChange(c.venueChangeId, false)}
                  >
                    拒绝
                  </Button>
                ]}
              >
                <List.Item.Meta
                  title={c.venue.name}
                />
                <div>
                  {c.newName ? <p>名称：<del>{c.venue.name}</del> => {c.newName}</p> : null}
                  {c.newAddress ? <p>地址：<del>{c.venue.address}</del> => {c.newAddress}</p> : null}
                  {c.newDescription ? <p>简介：<del>{c.venue.description}</del> => {c.newDescription}</p> : null}
                </div>
              </List.Item>
            )}
          />
        </Panel>
        <Panel header="待结算活动" key="events">
          <List
            dataSource={unhandledSummaries}
            renderItem={(s: Summary) => (
              <List.Item
                key={s.summaryId}
                actions={[
                  <Button key="handle" type="primary" onClick={() => this.handleSummary(s.summaryId)}>结算</Button>
                ]}
              >
                <List.Item.Meta
                  title={<Link to={'/event/' + s.eventId}>{s.event.eventName}</Link>}
                />
                <div>
                  <p>活动类型：{eventTypeText[s.event.eventType]}</p>
                  <p>活动号：{s.eventId}</p>
                  <p>举行时间：{new Date(s.event.hostTime).toLocaleString()}</p>
                  <p>总收入：{s.totalMoney}元</p>
                  <p>场馆分成：{s.venueIncome}元</p>
                  <p>平台收入：{s.platformIncome}元</p>
                </div>
              </List.Item>
            )}
          />
        </Panel>
        <Panel header="统计信息" key="statistics">
          <Card title="场馆">
            <Card.Grid style={gridStyleSmall}>已入驻场馆数：{statistics.approvedVenueNum}</Card.Grid>
          </Card>
          <Card title="会员">
            <Card.Grid style={gridStyleSmall}>已激活会员数：{statistics.activatedUserNum}</Card.Grid>
            <Card.Grid style={gridStyleSmall}>男会员数：{statistics.maleUserNum}</Card.Grid>
            <Card.Grid style={gridStyleSmall}>女会员数：{statistics.femaleUserNum}</Card.Grid>
          </Card>
          <Card title="财务">
            <Card.Grid style={gridStyleSmall}>
              已完成订单金额：{summaries.reduce((accu, next) => accu + next.totalMoney, 0)}元
            </Card.Grid>
            <Card.Grid style={gridStyleSmall}>
              已结算金额：{handledSummaries.reduce((accu, next) => accu + next.totalMoney, 0)}元
            </Card.Grid>
            <Card.Grid style={gridStyleSmall}>
              平台累计收益：{handledSummaries.reduce((accu, next) => accu + next.platformIncome, 0)}元
            </Card.Grid>
            <Card.Grid style={gridStyleSmall}>
              场馆累计分成：{handledSummaries.reduce((accu, next) => accu + next.venueIncome, 0)}元
            </Card.Grid>
          </Card>
        </Panel>
      </Collapse>
    );
  }
}