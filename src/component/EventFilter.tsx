import * as React from 'react';
import { match } from 'react-router-dom';
import { DatePicker, Radio } from 'antd';
import { observer, inject } from 'mobx-react';
import { EventType } from '../model/models';
import { eventListInjector, EventListProps } from '../store/stores';

const { RangePicker } = DatePicker;

type EventTypeMap = {
    [key in EventType]: string
};

const eventTypeMap: EventTypeMap = {
    ALL: '全部',
    MUSIC: '音乐会',
    OPERA: '戏剧歌剧',
    SPORTS: '体育赛事',
    DANCE: '舞蹈',
    MOVIE: '电影'
};

type Props = EventListProps & {
    match: match<{ type: string }>
};

@inject(eventListInjector)
@observer
export class EventFilter extends React.Component<Props> {

    handleDateChange = (omitted: any, dateRangeStr: [string, string]) => {
        const dateRange = dateRangeStr.map(dateStr => new Date(dateStr).setHours(0)); // 将小时设为0时（原本为8时，因为GMT+0800)
        this.props.eventList!.changeTimeRange(dateRange[0], dateRange[1]);
    }

    handleTypeChange = (e: any) => {
        this.props.eventList!.changeEventType(e.target.value);
    }

    render() {
        return (
            <div>
                <label>类型：
                    <Radio.Group onChange={this.handleTypeChange} defaultValue={this.props.eventList!.eventType}>
                        {Object.getOwnPropertyNames(eventTypeMap).map(
                            key => <Radio.Button key={key} value={key}>{eventTypeMap[key]}</Radio.Button>
                        )}
                    </Radio.Group>
                </label>
                <label>举行时间：<RangePicker onChange={this.handleDateChange as any} /></label>
            </div>
        );
    }
}