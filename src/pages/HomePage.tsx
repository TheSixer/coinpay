import { Box, Skeleton } from '@mui/material';
import useRequest from 'ahooks/lib/useRequest';
import React, { useState } from 'react'
import { useSearchParams } from 'react-router-dom';
import PayInfo from '../components/PayInfo'
import PaySuccess from '../components/PaySuccess'
import { queryOrderInfo } from '../services/order';

const HomePage: React.FC = () => {
    const [URLSearchParams] = useSearchParams();
    const orderCode = URLSearchParams.get('orderCode') || ''
    const [status, setStatus] = useState<boolean>(false)

    const { data, loading } = useRequest(queryOrderInfo, {
        defaultParams: [orderCode]
    });

    if (loading) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                {/* For variant="text", adjust the height via font-size */}
                <Skeleton variant="text" sx={{ bgcolor: 'grey.800' }} />
                {/* For other variants, adjust the size with `width` and `height` */}
                <Skeleton variant="rounded" sx={{ my: 2, mx: 'auto', bgcolor: 'grey.800' }} width={100} height={40} />
                <Skeleton variant="rounded" sx={{ my: 2, mx: 'auto', bgcolor: 'grey.800' }} width={200} height={40} />
                <Skeleton sx={{ my: 2, bgcolor: 'grey.800' }} />
                <Skeleton sx={{ my: 2, mx: 'auto', bgcolor: 'grey.800' }} width="60%" />
                <Skeleton variant="rounded" sx={{ my: 2, bgcolor: 'grey.800' }} height={60} />
                <Skeleton sx={{ my: 2, bgcolor: 'grey.800' }} />
                <Skeleton sx={{ my: 2, mx: 'auto', bgcolor: 'grey.800' }} width="60%" />
                <Skeleton variant="rounded" sx={{ my: 2, bgcolor: 'grey.800' }} height={40} />
                <Skeleton variant="rounded" sx={{ my: 2, bgcolor: 'grey.800' }} height={20} />
                <Skeleton variant="rounded" sx={{ mt: 4, bgcolor: 'grey.800' }} height={60} />
            </Box>
        )
    }

    return (
        <div className='container mx-auto p-2 text-center'>
            {
                !status ? <PayInfo data={data?.data} onFinish={() => setStatus(true)} /> : <PaySuccess />
            }
        </div>
    )
}

export default HomePage
