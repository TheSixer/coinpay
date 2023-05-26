import { Stack, Typography } from "@mui/material";
import useRequest from "ahooks/lib/useRequest";
import { NumericFormat } from "react-number-format";
import { queryBalance } from "../services/order"


const TradingList = () => {

  const { data } = useRequest(queryBalance);

  const balance = data?.data.balance || 0
  const coolBalance = data?.data.coolBalance || 0

  return (
    <div className="text-white bg-gray-800 p-8 rounded min-h-56">

      <Typography sx={{ mb: 4 }} variant="h6" gutterBottom>
        账户信息
      </Typography>

      <Stack direction="row" spacing={4}>

        <p>账户余额： <span>$ <NumericFormat value={Math.floor(balance) / 100} displayType={'text'} thousandSeparator={true} /></span></p>
        <p>冻结余额： <span>$ <NumericFormat value={Math.floor(coolBalance) / 100} displayType={'text'} thousandSeparator={true} /></span></p>

      </Stack>

    </div>
  )
}

export default TradingList
