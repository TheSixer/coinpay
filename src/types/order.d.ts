declare namespace Order {

  interface LoginParams {
    userName: string;
    password: string;
  }

  interface ResponseData {
    code: number;
    data: any;
    ts?: string;
    msg?: string;
  }

  interface OrderInfo {
    amount: number
    createTime: string;
    currency: string
    expirationTime: string
    id: number
    memo: string
    merchantId: string
    orderCode: string
    payChannel: string
    realName: string
    status: string
    updateTime: string
    usdAmount: number
    usdRate: number
    bankName: string
    subBankName: string
    traderName: string
    bankCardNum: string
  }
}