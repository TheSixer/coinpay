import qs from 'qs'
import fetch from '../utility/customAxios'

export const queryOrderInfo = (data: string): Promise<Order.ResponseData> => fetch.get(`/normal/order/detail?orderCode=${data}`)

export const confirmTransfer = (data: { orderCode: string }): Promise<Order.ResponseData> => fetch.post(`/normal/order/confirm`, data)

export const traderLogin = (data: Order.LoginParams): Promise<Order.ResponseData> => fetch.post(`/trader/login`, data)

export const queryBalance = (): Promise<Order.ResponseData> => fetch.get(`/trader/wallet/balance`)

export const queryTradingList = (data: any): Promise<Order.ResponseData> => fetch.get(`/trader/order/list?${qs.stringify(data)}`)

export const confirmRecieve = (data: {orderCode: string}): Promise<Order.ResponseData> => fetch.post(`/trader/order/havePay`, data)

export const confirmReject = (data: {orderCode: string; reason: string}): Promise<Order.ResponseData> => fetch.post(`/trader/order/reject`, data)
