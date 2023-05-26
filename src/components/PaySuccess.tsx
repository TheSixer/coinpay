import React from 'react'
import AccessTimeIcon from '@mui/icons-material/AccessTime'
import { green } from '@mui/material/colors'
import { Avatar } from '@mui/material'
import { Stack } from '@mui/system'

const PayInfo: React.FC = () => {

    return (
        <div className='p-4'>

            <Stack alignItems="center" justifyContent="center" spacing={2} sx={{ p: 4, backgroundColor: '#3e3e3e', borderRadius: 4 }}>
                <p className="text-lg text-green-500">您已完成支付</p>
                <Avatar sx={{ bgcolor: green[500] }}>
                    <AccessTimeIcon />
                </Avatar>
                <p>95%的订单会在5分钟内完成，请您耐心等待</p>
            </Stack>
        
        </div>
    )
}

export default PayInfo
