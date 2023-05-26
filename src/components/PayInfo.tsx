import { Button, Card, Chip, Divider, Icon, IconButton, List, ListItem, ListItemText, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react'
import Countdown from 'react-countdown';
import { useSearchParams } from 'react-router-dom'
import Avatar from '@mui/material/Avatar'
import Stack from '@mui/material/Stack'
import { deepOrange, green } from '@mui/material/colors'
import {CopyToClipboard} from 'react-copy-to-clipboard'
import ContentCopyIcon from '@mui/icons-material/ContentCopy'
import { NumericFormat } from 'react-number-format'
import { toast } from 'react-toastify'
import InfoIcon from '@mui/icons-material/Info';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import { grey } from '@mui/material/colors';
import { confirmTransfer } from '../services/order';
import useRequest from 'ahooks/lib/useRequest';

type IProps = {
    data: Order.OrderInfo | null
    onFinish(): void
}

const PayInfo = (props: IProps) => {
    const { data, onFinish } = props;
    const [URLSearchParams] = useSearchParams();
    const orderCode = URLSearchParams.get('orderCode') || ''
    const [status, setStatus] = useState<number>(0)

    const { data: result, run: handleConfirm } = useRequest(confirmTransfer, {
        manual: true,
    });

    const handleCopy = () => {
        toast.success('已复制', {
            autoClose: 500
        })
    }

    // const handleConfirm = async () => {
    //     const res = await run({ orderCode })
    //     console.log(res);
    //     onFinish();
    // }

    useEffect(() => {
        if (result) {
            onFinish();
        }
    }, [result])

    return (
        <div className='container mx-auto p-2 text-center'>
            <p>您即将购买<NumericFormat value={Math.floor(Number(data?.usdAmount)) / 100} displayType={'text'} thousandSeparator={true} />USDT, 需支付</p>
            <p className='my-4 text-4xl text-yellow-500'>
                ¥ <NumericFormat value={Math.floor(Number(data?.amount)) / 100} displayType={'text'} thousandSeparator={true} />
                <span className='text-base'>CNY</span>
            </p>
            <p className='mb-4 text-yellow-500'>（含手续费）</p>

            {
                !status ? (
                    <>
                        <Stack direction="row" alignItems="center" justifyContent="center">
                            <InfoIcon fontSize='small' sx={{ color: grey[500] }} />
                            <p>将向官方认证承兑商购买USDT，成功后自动充值到您的账户</p>
                        </Stack>

                        <Stack direction="column" spacing={2} alignItems="start" justifyContent="center" sx={{ p: 2, my: 2, borderTop: '1px solid #5c5b5b', borderBottom: '1px solid #5c5b5b' }}>
                            <p>支付方式</p>
                            <Chip icon={<CreditCardIcon />} color="warning" label="网银转账" variant="outlined" />
                            <Stack direction="row" width="100%" justifyContent="space-between">
                                <span>价格</span>
                                <span>{ data?.usdRate }USDT</span>
                            </Stack>
                            <Stack direction="row" width="100%" justifyContent="space-between">
                                <span>数量</span>
                                <span><NumericFormat value={Math.floor(Number(data?.usdAmount)) / 100} displayType={'text'} thousandSeparator={true} />USDT</span>
                            </Stack>
                            <Stack direction="row" width="100%" justifyContent="space-between">
                                <span>姓名</span>
                                <span>{ data?.realName }</span>
                            </Stack>
                        </Stack>

                        <Button variant="contained" sx={{ mt: 6, minWidth: 320 }} color='success' onClick={() => setStatus(1)}>
                            下一步
                        </Button>
                    </>
                ) : (
                    <>
                        <Card elevation={3} sx={{ mx: 'auto', my: 2, py: 1, maxWidth: '300px', textAlign: 'center' }}>
                            <p>请您在 <span className='text-amber-500'><Countdown date={new Date(data?.expirationTime || '').getTime()} daysInHours /></span> 内完成支付</p>
                        </Card>
                        <p>以下是 CoinPay 官方认证承兑商信息，付款前请确认核对无误</p>

                        <Divider />

                        <Stack direction="row" spacing={1} alignItems="center" justifyContent="center" sx={{ p: 2, my: 2, borderTop: '1px solid #5c5b5b', borderBottom: '1px solid #5c5b5b' }}>
                            <Avatar sx={{ bgcolor: deepOrange[500] }}>CP</Avatar>
                            <Stack direction="row" spacing={1}>
                                <div className='flex align-center'>
                                    <Icon sx={{ color: green[500] }}>check_circle</Icon>
                                    <span>官方认证商户</span>
                                </div>
                                <div className='flex align-center'>
                                    <Icon sx={{ color: green[500] }}>check_circle</Icon>
                                    <span>已核验身份信息</span>
                                </div>
                            </Stack>
                        </Stack>

                        <List sx={{ width: '100%' }}>
                            <ListItem
                                disableGutters
                                secondaryAction={
                                    <Stack direction="row" alignItems="center">
                                        <p>{data?.bankCardNum}</p>
                                        <CopyToClipboard 
                                            onCopy={handleCopy} 
                                            text={data?.bankCardNum || ''}>                        
                                            <IconButton aria-label="comment">
                                                <ContentCopyIcon fontSize='small' color='success' />
                                            </IconButton>
                                        </CopyToClipboard>
                                    </Stack>
                                }
                            >
                                <ListItemText primary="卡号" />
                            </ListItem>
                            <ListItem
                                disableGutters
                                secondaryAction={
                                    <Stack direction="row" alignItems="center">
                                        <p>{ data?.traderName }</p>
                                        <CopyToClipboard 
                                            onCopy={handleCopy}
                                            text={data?.traderName || ''}>                        
                                            <IconButton aria-label="comment">
                                                <ContentCopyIcon fontSize='small' color='success' />
                                            </IconButton>
                                        </CopyToClipboard>
                                    </Stack>
                                }
                            >
                                <ListItemText primary="卖家姓名" />
                            </ListItem>
                            <ListItem
                                disableGutters
                                secondaryAction={
                                    <Stack direction="row" alignItems="center">
                                        <p>{ data?.bankName }</p>
                                        <CopyToClipboard 
                                            onCopy={handleCopy}
                                            text={data?.bankName || ''}>                        
                                            <IconButton aria-label="comment">
                                                <ContentCopyIcon fontSize='small' color='success' />
                                            </IconButton>
                                        </CopyToClipboard>
                                    </Stack>
                                }
                            >
                                <ListItemText primary="开户银行" />
                            </ListItem>
                            <ListItem
                                disableGutters
                                secondaryAction={
                                    <Stack direction="row" alignItems="center">
                                        <p>{data?.subBankName}</p>
                                        <CopyToClipboard 
                                            onCopy={handleCopy}
                                            text={data?.subBankName || ''}>                        
                                            <IconButton aria-label="comment">
                                                <ContentCopyIcon fontSize='small' color='success' />
                                            </IconButton>
                                        </CopyToClipboard>
                                    </Stack>
                                }
                            >
                                <ListItemText primary="支行信息" />
                            </ListItem>
                        </List>

                        <Typography variant="subtitle1" sx={{ mt: 4 }}>
                            <p className='text-base text-gray-400'>
                                注：转账金额必须保持一致，包含<span className='text-green-700'>小数位</span>
                            </p>
                        </Typography>

                        <Button variant="contained" sx={{ mt: 6, minWidth: 320 }} color='success' onClick={() => handleConfirm({ orderCode })}>
                            我已完成付款
                        </Button>
                    </>
                )
            }
        </div>
    )
}

export default PayInfo
