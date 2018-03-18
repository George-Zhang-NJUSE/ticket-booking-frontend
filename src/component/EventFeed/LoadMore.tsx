import * as React from 'react';
import { Alert, Button } from 'antd';
import { observer, inject } from 'mobx-react';
import { MEventFeedProps, eventFeedInjector } from '../../store/stores';

@inject(eventFeedInjector)
@observer
export class LoadMore extends React.Component<MEventFeedProps> {

    handleLoadMore = () => {
        this.props.eventFeed!.fetchMoreEvents();
    }

    render() {
        return (
            this.props.eventFeed!.hasMorePage ?
                <Button type="primary" onClick={this.handleLoadMore}>加载更多</Button>
                : <Alert type="info" message="没有更多活动了" showIcon />
        );
    }
}