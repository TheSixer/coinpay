import qs from 'qs'
import fetch from '../utility/customAxios'

export const queryRates = (): Promise<Order.ResponseData> => fetch.get(`/admin/exchange/rate/list`)

export const queryRechargeList = (data: any): Promise<Order.ResponseData> => fetch.get(`/admin/audit/trader/recharge?${qs.stringify(data)}`)

export const confirmRecharge = (data: { orderCode: string }): Promise<Order.ResponseData> => fetch.post(`/admin/audit/trader/recharge/havePay`, data)

export const rejectRecharge = (data: { orderCode: string; reason: string }): Promise<Order.ResponseData> => fetch.post(`/admin/audit/trader/recharge/reject`, data)

export const queryWithdrawList = (data: any): Promise<Order.ResponseData> => fetch.get(`/admin/audit/trader/withdraw?${qs.stringify(data)}`)

export const confirmWithdraw = (data: { orderCode: string }): Promise<Order.ResponseData> => fetch.post(`/admin/audit/trader/withdraw/havePay`, data)

export const rejectWithdraw = (data: { orderCode: string; reason: string }): Promise<Order.ResponseData> => fetch.post(`/admin/audit/trader/withdraw/reject`, data)

export const queryTraderList = (data: any): Promise<Order.ResponseData> => fetch.get(`/admin/trader/manager/list?${qs.stringify(data)}`)

export const disableTrader = (data: { id: string }): Promise<Order.ResponseData> => fetch.post(`/admin/trader/manager/disable`, data)

export const enableTrader = (data: { id: string }): Promise<Order.ResponseData> => fetch.post(`/admin/trader/manager/enable`, data)
