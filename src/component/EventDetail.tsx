import * as React from 'react';
import { Layout, Radio, Button, Alert, List } from 'antd';
import { match } from 'react-router-dom';
import { Event, EventSeatPrice, Seat } from '../model/models';
import { getEvent } from '../netAccess/event';
import { getEventSeatPriceList } from '../netAccess/eventSeatPrice';
import { getAvailableSeats } from '../netAccess/ticket';
import { flattenArray } from '../util/objectUtil';
import { SeatPicker } from './SeatPicker';

const { Sider, Content } = Layout;
const { Button: RadioButton, Group: RadioGroup } = Radio;

type Props = {
    match: match<{ eventId: number }>
};

type State = Event & {
    priceList: EventSeatPrice[]
    selectedPrice: EventSeatPrice | null
    selectedSeats: Seat[]
};

export class EventDetail extends React.Component<Props, State> {

    state: State = {
        description: '',
        eventId: this.props.match.params.eventId,
        eventName: '',
        eventType: 'ALL',
        hostTime: 0,
        posterUrl: '',
        venueId: 0,
        priceList: [],
        selectedPrice: null,
        selectedSeats: []
    };

    async componentDidMount() {
        const eventId = this.state.eventId;

        // 避免两个请求串行化
        const fetchEvent = getEvent(eventId);
        const fetchSeatPrices = getEventSeatPriceList(eventId);
        const event = await fetchEvent, priceList = await fetchSeatPrices;
        this.setState({ ...event, priceList });

        // 获取可购座位
        await Promise.all(priceList.map(async price => {
            price.availableSeats = await getAvailableSeats(eventId, price.venueSeatTypeId);
        }));
        this.setState({ priceList });
    }

    handlePriceSelect = (event: any) => {
        this.setState({
            selectedPrice: event.target.value,
            selectedSeats: []
        });
    }

    handleToggleSeat = (rowNum: number, columnNum: number) => {
        const { selectedSeats, selectedPrice } = this.state;
        if (!selectedPrice) {
            return;
        }
        const allSeats = selectedPrice.availableSeats;

        if (!allSeats) {
            return;
        }
        const state = allSeats[rowNum][columnNum];
        if (state !== 0) {
            return;
        }

        const index = selectedSeats.findIndex(s => s.rowNum === rowNum && s.columnNum === columnNum);
        if (index !== -1) {
            // 删除已有的
            selectedSeats.splice(index, 1);
        } else if (selectedSeats.length < 6) {
            // 添加没有的
            selectedSeats.push({ rowNum, columnNum });
        }
        this.setState({ selectedSeats });
    }

    isAvailable(price: EventSeatPrice) {
        if (!price.availableSeats) {
            return false;
        }
        const seats = flattenArray(price.availableSeats);
        return seats.findIndex(v => v === 0) !== -1;
    }

    render() {
        const { description, eventName, hostTime, posterUrl,
            priceList, selectedPrice, selectedSeats } = this.state;
        let hostDateStr = new Date(hostTime).toLocaleString();
        return (
            <Layout>
                <Layout>
                    <Sider >
                        <div
                            style={{
                                backgroundImage: `url(${posterUrl})`,
                                backgroundPosition: 'center',
                                backgroundSize: 'contain',
                                backgroundRepeat: 'no-repeat',
                                height: '265px'
                            }}
                        />
                    </Sider>
                    <Content>
                        <h2>{eventName}</h2>
                        <p>演出时间：{hostDateStr}</p>
                        <div>选择票价：
                            <RadioGroup onChange={this.handlePriceSelect}>
                                {priceList.map(price =>
                                    <RadioButton
                                        key={price.venueSeatTypeId}
                                        value={price}
                                        disabled={!this.isAvailable(price)}
                                    >{price.venueSeatType.seatType} {price.price}元
                                    </RadioButton>
                                )}
                            </RadioGroup>
                        </div>
                        {selectedPrice ?
                            <div>
                                您选择了：{selectedPrice.venueSeatType.seatType} 单价{selectedPrice.price}元
                                <List
                                    size="small"
                                    bordered
                                    dataSource={selectedSeats}
                                    renderItem={(s: Seat) => (<List.Item>{s.rowNum + 1}排{s.columnNum + 1}号</List.Item>)}
                                />
                                {selectedSeats.length >= 6 ?
                                    <Alert type="info" message="单次最多购买6张" showIcon />
                                    : null}
                                <span>选择座位：</span>
                                <SeatPicker
                                    seatMap={selectedPrice.availableSeats || [[]]}
                                    selectedSeats={selectedSeats}
                                    onToggle={this.handleToggleSeat}
                                />
                                <Button type="primary">购买</Button>
                            </div>
                            : null}
                    </Content>
                </Layout>
                <Content>{description}</Content>
            </Layout>
        );
    }
}