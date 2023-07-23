import { Button, Chip, Link, Stack, Typography } from "@mui/material";
import useRequest from "ahooks/lib/useRequest";
import { NumericFormat } from "react-number-format";
import { useNavigate } from "react-router-dom";
import { queryBalance, queryTraderInfo } from "../services/order"


const TradingList = () => {
  const navigate = useNavigate();
  const { data } = useRequest(queryBalance);
  const { data: info } = useRequest(queryTraderInfo);

  const balance = data?.data.balance || 0
  const coolBalance = data?.data.coolBalance || 0

  console.log(info)
  const useInfo = info?.data;

  return (
    <div className="text-white bg-gray-800 p-8 rounded min-h-56">

      <Stack direction="row" justifyContent="space-between" spacing={4}>
        <Typography sx={{ mb: 4 }} variant="h6" gutterBottom>
          账户信息 <Chip size="small" label={useInfo?.haveVerify === 1 ? '已审核' : useInfo?.haveVerify === 2 ? '审核未通过' : '审核中'} color={ useInfo?.haveVerify ? 'success' : 'warning'} variant="outlined" />
        </Typography>

        <Link href="/trader/update" color="primary" sx={{ fontSize: 12 }}>更新审核信息</Link>
      </Stack>

      <Stack direction="row" justifyContent="space-between" spacing={4}>
        <Stack direction="row" spacing={4}>
          <p>账户余额： <span>$ <NumericFormat value={Math.floor(balance) / 100} displayType={'text'} thousandSeparator={true} /></span></p>
          <p>冻结余额： <span>$ <NumericFormat value={Math.floor(coolBalance) / 100} displayType={'text'} thousandSeparator={true} /></span></p>
        </Stack>
        <Stack direction="row" spacing={2}>
          <Button variant="outlined" color="success" disabled={useInfo?.haveVerify !== 1} onClick={() => navigate('/trader/recharge')}>
            入金
          </Button>
          <Button variant="outlined" color="warning" disabled={useInfo?.haveVerify !== 1} onClick={() => navigate('/trader/withdraw')}>
            提现
          </Button>
          <Button variant="outlined" color="info" onClick={() => navigate('/trader/cards')}>
            我的银行卡
          </Button>
        </Stack>
      </Stack>

    </div>
  )
}

export default TradingList
