import { forwardRef, useState } from "react";
import { Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import { traderWithdraw } from "../../services/order";
import { useThrottleFn } from "ahooks";
import { toast } from 'react-toastify';
import { NumericFormat } from "react-number-format";

const NumericFormatCustom: any = forwardRef(function NumericFormatCustom(
  props: any,
  ref: any,
) {
  const { onChange, ...other } = props;

  return (
    <NumericFormat
      {...other}
      getInputRef={ref}
      onValueChange={(values) => {
        onChange({
          target: {
            name: props.name,
            value: values.value,
          },
        });
      }}
      thousandSeparator
      valueIsNumericString
      prefix="$"
    />
  );
});

const Recharge = () => {
  const [amount, setAmount] = useState('');
  const [usdtAccount, setUsdtAccount] = useState('');

  const {
    run: handleWithdraw,
  } = useThrottleFn(() => {
    if (Number(amount) < 100) {
      toast.success("提现金额不得少于100")
      return;
    }
    traderWithdraw({
      amount: Number(amount) * 100,
      usdtAccount
    }).then(({ code }) => {
      !code && toast.success("提现申请已提交，请等待管理员审核")
      setAmount('');
      setUsdtAccount('');
    }).catch((err: any) => {
      console.log(err);
    });
  }, { wait: 700 });
  
  return (
    <Container maxWidth="md">
      <Typography sx={{ mb: 4 }} variant="h6" gutterBottom>
        提现
      </Typography>
      <Paper elevation={3} sx={{ mx: 'auto', py: 8, maxWidth: 560 }}>
        <Stack direction="column" spacing={4} sx={{ mx: 'auto', maxWidth: 360 }}>
          <TextField
            label="提现金额"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            name="numberformat"
            id="formatted-numberformat-input"
            InputProps={{
              inputComponent: NumericFormatCustom,
            }}
          />
          <TextField
            required
            id="outlined-required"
            label="账户名称"
            value={usdtAccount}
            onChange={(e) => setUsdtAccount(e.target.value)}
          />

          <Button variant="contained" disabled={!amount || !usdtAccount} sx={{ py: 1.5 }} onClick={handleWithdraw}>提现</Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Recharge;
