import qs from 'qs'
import fetch from '../utility/customAxios'

export const queryOrderInfo = (data: string): Promise<Order.ResponseData> => fetch.get(`/normal/order/detail?orderCode=${data}`)

export const confirmTransfer = (data: { orderCode: string }): Promise<Order.ResponseData> => fetch.post(`/normal/order/confirm`, data)

export const traderLogin = (data: Order.LoginParams): Promise<Order.ResponseData> => fetch.post(`/trader/login`, data)

export const adminLogin = (data: Order.LoginParams): Promise<Order.ResponseData> => fetch.post(`/admin/login`, data)

export const queryBalance = (): Promise<Order.ResponseData> => fetch.get(`/trader/wallet/balance`)

export const queryTradingList = (data: any): Promise<Order.ResponseData> => fetch.get(`/trader/order/list?${qs.stringify(data)}`)

export const confirmRecieve = (data: {orderCode: string}): Promise<Order.ResponseData> => fetch.post(`/trader/order/havePay`, data)

export const confirmReject = (data: {orderCode: string; reason: string}): Promise<Order.ResponseData> => fetch.post(`/trader/order/reject`, data)

export const queryRechargeList = (data: any): Promise<Order.ResponseData> => fetch.get(`/trader/recharge/list?${qs.stringify(data)}`)

export const queryWithdrawList = (data: any): Promise<Order.ResponseData> => fetch.get(`/trader/withdraw/list?${qs.stringify(data)}`)

export const queryPolicy = (): Promise<Order.ResponseData> => fetch.get(`/trader/oss/verify/policy`)
// 加签
export const getImgUrl = (objectName: string): Promise<Order.ResponseData> => fetch.get(`/trader/oss/sign?objectName=${objectName}`);

export const queryBankCards = (data: any): Promise<Order.ResponseData> => fetch.get(`/trader/bankCard/list?${qs.stringify(data)}`)

export const activeCard = (data: any): Promise<Order.ResponseData> => fetch.post(`/trader/bankCard/active`, data)

export const saveCard = (data: any): Promise<Order.ResponseData> => fetch.post(`/trader/bankCard/save`, data)

export const traderWithdraw = (data: any): Promise<Order.ResponseData> => fetch.post(`/trader/withdraw`, data)

export const traderRecharge = (data: any): Promise<Order.ResponseData> => fetch.post(`/trader/recharge`, data)
