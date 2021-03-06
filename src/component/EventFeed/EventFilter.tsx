import * as React from 'react';
import * as moment from 'moment';
import { DatePicker, Radio } from 'antd';
import { observer, inject } from 'mobx-react';
import { eventTypeText } from '../../model/models';
import { eventFeedInjector, MEventFeedProps } from '../../store/stores';
import { Moment } from 'moment';

const { RangePicker } = DatePicker;

@inject(eventFeedInjector)
@observer
export class EventFilter extends React.Component<MEventFeedProps> {

  handleDateChange = (omitted: any, dateRangeStr: [string, string]) => {
    const dateRange = dateRangeStr.map(dateStr => new Date(dateStr).setHours(0)); // 将小时设为0时（原本为8时，因为GMT+0800)
    this.props.eventFeed!.changeTimeRange(dateRange[0], dateRange[1]);
  }

  handleTypeChange = (e: any) => {
    this.props.eventFeed!.changeEventType(e.target.value);
  }

  isDisabledDate(value: Moment) {
    // 不能选择今天之前的日期
    return value < moment().startOf('day');
  }

  render() {
    return (
      <div>
        <label>类型：
          <Radio.Group onChange={this.handleTypeChange} defaultValue={this.props.eventFeed!.eventType}>
            {Object.getOwnPropertyNames(eventTypeText).map(
              key => <Radio.Button key={key} value={key}>{eventTypeText[key]}</Radio.Button>
            )}
          </Radio.Group>
        </label>
        <br />
        <label>举行时间：
          <RangePicker
            disabledDate={this.isDisabledDate}
            onChange={this.handleDateChange as any}
          />
        </label>
      </div>
    );
  }
}