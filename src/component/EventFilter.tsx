import * as React from 'react';
import { match } from 'react-router-dom';
import { DatePicker } from 'antd';

const { RangePicker } = DatePicker;

type Props = {
    match: match<{ type: string }>
};
type State = {
    fromDate: number,
    toDate: number
};

export class EventFilter extends React.Component<Props, State> {

    state = {
        fromDate: 0,
        toDate: 0,
    };

    handleDateChange = (omitted: any, dateRangeStr: [string, string]) => {
        const dateRange = dateRangeStr.map(dateStr => new Date(dateStr).setHours(0)); // 将小时设为0时（原本为8时，因为GMT+0800)
        this.setState({
            fromDate: dateRange[0],
            toDate: dateRange[1]
        });
    }

    render() {
        return (
            <div>
                <label>举行时间：<RangePicker onChange={this.handleDateChange as any} /></label>
            </div>
        );
    }
}