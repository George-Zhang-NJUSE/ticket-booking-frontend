import * as React from 'react';
import { List } from 'antd';
import { observer, inject } from 'mobx-react';
import { MEventFeedProps, eventFeedInjector } from '../../store/stores';
import { Event } from '../../model/models';
import { Link } from 'react-router-dom';

@inject(eventFeedInjector)
@observer
export class EventList extends React.Component<MEventFeedProps> {

    render() {
        const dataSource = this.props.eventFeed!.events.slice();
        return (
            <List
                itemLayout="vertical"
                size="large"
                dataSource={dataSource}
                renderItem={(item: Event) => (
                    <List.Item
                        key={item.eventId}
                        extra={<img style={{ height: '200px' }} src={item.posterUrl} />}
                    >
                        <List.Item.Meta
                            title={<Link to={'/event/' + item.eventId}>{item.eventName}</Link>}
                            description={item.description}
                        />
                    </List.Item>
                )}
            />
        );
    }
}