import { useState } from "react";
import { Button, Container, Paper, Stack, TextField, Typography } from "@mui/material";
import { saveCard } from "../../services/order";
import { useThrottleFn } from "ahooks";
import { toast } from 'react-toastify'
import { useNavigate } from "react-router-dom";

const Recharge = () => {
  const [bankName, setBankName] = useState('');
  const [subBankName, setSubBankName] = useState('');
  const [bankCardNum, setBankCardNum] = useState('');
  const navigate = useNavigate();

  const {
    run: handleSave,
  } = useThrottleFn(() => {
    saveCard({
      bankName,
      subBankName,
      bankCardNum
    }).then(({ code }) => {
      !code && toast.success("保存成功")
      setBankName('');
      setSubBankName('');
      setBankCardNum('');
      navigate(-1);
    });
  }, { wait: 700 });
  
  return (
    <Container maxWidth="md">
      <Typography sx={{ mb: 4 }} variant="h6" gutterBottom>
        新建银行卡
      </Typography>
      <Paper elevation={3} sx={{ mx: 'auto', py: 8, maxWidth: 560 }}>
        <Stack direction="column" spacing={4} sx={{ mx: 'auto', maxWidth: 360 }}>
          <TextField
            required
            id="outlined-required"
            label="银行卡号"
            value={bankCardNum}
            onChange={(e) => setBankCardNum(e.target.value)}
          />
          <TextField
            required
            id="outlined-required"
            label="银行名称"
            value={bankName}
            onChange={(e) => setBankName(e.target.value)}
          />
          <TextField
            required
            id="outlined-required"
            label="所属支行"
            value={subBankName}
            onChange={(e) => setSubBankName(e.target.value)}
          />
          
          <Button variant="contained" disabled={!bankName || !subBankName || !bankCardNum} sx={{ py: 1.5 }} onClick={handleSave}>保存</Button>
        </Stack>
      </Paper>
    </Container>
  );
}

export default Recharge;
