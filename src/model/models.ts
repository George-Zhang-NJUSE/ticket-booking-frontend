export type User = {
  userId: number
  email: string
  name: string
  gender: string
  level: number
  score: number  // 用于兑换优惠券
  balance: number
  accumulatedScore: number  // 累计积分，用于用户升级，类似于经验值
};

export type Coupon = {
  couponId: number
  couponTypeId: number
  userId: number
  getTime: number
  isUsed: boolean
  couponType: CouponType
};

export type CouponType = {
  couponTypeId: number
  description: string
  price: number       // 优惠券面额
  condition: number   // 订单价格满多少可以使用
  scoreNeeded: number   // 兑换所需积分
  isActivated: boolean    // 是否可供兑换
};

export type EventType = 'ALL' | 'MUSIC' | 'OPERA' | 'SPORTS' | 'DANCE' | 'MOVIE';

export type Event = {
  eventId: number
  venueId: number
  eventName: string
  description: string
  hostTime: number
  eventType: EventType
  posterUrl: string
  isHosted: boolean
};

export type EventFilterType = 'VENUE' | 'TYPE';

export type EventFilter = {
  type: EventFilterType
  condition: EventType | number  // 若type为TYPE，则为EventType类型；若type为VENUE，则为int类型(venueId)
  pageNum: number
  pageSize: number
  fromTime: number
  toTime: number
};

export type EventSeatPrice = {
  eventSeatPriceId: number
  eventId: number
  venueSeatTypeId: number
  price: number
  venueSeatType: VenueSeatType
  availableSeats?: number[][]     // 由客户端获取并加上，0表示可购买，1表示已售出
};

export type VenueSeatType = {
  venueSeatTypeId: number,
  venueId: number
  seatType: string
  quantity: number
  totalRowNum: number
  totalColumnNum: number
  isDeleted: boolean
};

export type Manager = {
  managerId: number
  name: string
};

export type OrderState = 'CANCELED' | 'PAID' | 'UNPAID' | 'COMPLETED';

export type Order = {
  orderId: number
  eventId: number
  userId: number
  state: OrderState
  totalPrice: number
  createTime: number
  event: Event
  tickets: Ticket[] | Partial<Ticket>[]
  coupon: Coupon | null
};

export type TicketState = 'NEW' | 'CANCELED' | 'CHECKED';

export type Ticket = {
  ticketId: number
  eventId: number
  venueSeatTypeId: number
  rowNum: number  // 从0开始
  columnNum: number   // 同上
  price: number
  isOnline: boolean  // false表示为线下非会员购买
  ticketState: TicketState
  venueSeatType: VenueSeatType
};

export type VenueApplyState = 'APPLYING' | 'APPROVED' | 'REJECTED';

export type Venue = {
  venueId: number
  name: string
  address: string
  description: string
  seatTypes: VenueSeatType[]
  profit: number
  state: VenueApplyState
};

export type VenueChangeState = 'PENDING' | 'APPROVED' | 'REJECTED';

export type VenueChange = {
  venueChangeId: number
  venueId: number
  submitTime: number
  state: VenueChangeState
  newAddress: string
  newDescription: string
  newName: string
};

export type Seat = {
  rowNum: number
  columnNum: number
};

export type Summary = {
  summaryId: number
  eventId: number
  venueId: number
  isHandled: boolean      // 已结算
  event: Event
  venue: Venue
  totalMoney: number
  platformIncome: number
  venueIncome: number
};

export type Role = 'USER' | 'VENUE' | 'MANAGER';

export type AuthTokenBody = {
  sub: Role
  id: number
};

export const eventTypeText: { [key in EventType]: string } = {
  ALL: '全部',
  MUSIC: '音乐会',
  OPERA: '戏剧歌剧',
  SPORTS: '体育赛事',
  DANCE: '舞蹈',
  MOVIE: '电影'
};

export const orderStateText: { [key in OrderState]: string } = {
  PAID: '已支付',
  UNPAID: '未支付',
  CANCELED: '已取消',
  COMPLETED: '已完成'
};

export const ticketStateText: { [key in TicketState]: string } = {
  NEW: '未检票',
  CHECKED: '已检票',
  CANCELED: '已取消'
};