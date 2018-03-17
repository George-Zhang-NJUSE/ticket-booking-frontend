import { observable, action, reaction } from 'mobx';
import { message } from 'antd';
import { Event, EventType, EventFilterType } from '../model/models';
import { getEventList } from '../netAccess/event';

type Condition = {
    eventType: EventType
    fromTime: number
    toTime: number
};

export class IncomingEventList {

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

    @action async fetchMoreEvents() {
        if (!this.hasMorePage) {
            return;
        }

        try {
            let eventsData = await getEventList({
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
        } catch (err) {
            message.error('出错啦!');
        }
    }

}