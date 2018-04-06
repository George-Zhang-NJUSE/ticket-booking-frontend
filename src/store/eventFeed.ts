import { observable, action, reaction, flow } from 'mobx';
import { Event, EventType, EventFilterType } from '../model/models';
import { getEventList } from '../netAccess/event';

type Condition = {
  eventType: EventType
  fromTime: number
  toTime: number
};

export class MEventFeed {

  filterType: EventFilterType = 'TYPE';
  pageSize = 10;

  @observable eventType: EventType = 'ALL';
  @observable fromTime = Date.now();
  @observable toTime = Date.now() + 365 * 24 * 60 * 60 * 1000;  // 一年后

  @observable events: Event[] = [];
  @observable nextPageNum = 0;
  @observable hasMorePage = true;

  onConditionChange = reaction<Condition>(() => ({
    eventType: this.eventType,
    fromTime: this.fromTime,
    toTime: this.toTime
  }), () => {
    this.reloadEvents();
  });

  @action changeTimeRange(fromTime: number, toTime: number) {
    this.fromTime = fromTime;
    this.toTime = toTime;
  }

  @action changeEventType(type: EventType) {
    this.eventType = type;
  }

  @action reloadEvents() {
    this.nextPageNum = 0;
    this.events = [];
    this.hasMorePage = true;
    this.fetchMoreEvents();
  }

  @action fetchMoreEvents = flow(function* (this: MEventFeed) {
    if (!this.hasMorePage) {
      return;
    }

    const eventsData = yield getEventList({
      type: this.filterType,
      condition: this.eventType,
      fromTime: this.fromTime,
      toTime: this.toTime,
      pageNum: this.nextPageNum,
      pageSize: this.pageSize
    });
    if (eventsData.length === 0) {
      this.hasMorePage = false;
    } else {
      this.events.push(...eventsData);
      this.nextPageNum++;
    }

  });

}