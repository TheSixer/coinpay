import { forwardRef, useEffect, useState } from "react";
import { PhotoCamera } from "@mui/icons-material";
import { Button, Container, IconButton, Paper, Stack, TextField, Typography } from "@mui/material";
import { useRequest, useThrottleFn } from "ahooks";
import { queryPolicy, getImgUrl, traderRecharge } from "../../services/order";
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
  const [money, setMoney] = useState('');
  const [certificateUrl, setCertificateUrl] = useState('');
  const [policy, setPolicy] = useState<any>(null);
  const [backendPhotoUrl, setBackendPhotoUrl] = useState('');
  
  const { data } = useRequest(queryPolicy, {
    defaultParams: [],
  });

  useEffect(() => {
    setPolicy(data?.data);
  }, [data])

  const onChange = (e: any, id: number) => {
    uploadImg(policy, e.target.files[0], id);
  }

  const uploadImg = (params: any, file: File, id: number) => {
    const formdata = new FormData();
    formdata.append('OSSAccessKeyId', params.accessid);
    formdata.append('key', params.dir + '/' + file.name);
    formdata.append('success_action_status', '200');
    formdata.append('policy', params.policy);
    formdata.append('signature', params.signature);
    formdata.append('file', file);

    fetch(params.host, {
      method: 'POST',
      body: formdata
    }).then(res => {
      setBackendPhotoUrl(`${params.dir}/${file.name}`);
      fetchImg(`${params.dir}/${file.name}`, id);
    })
  }

  const fetchImg = async (url: string, id:  number) => {
    const { code, data } = await getImgUrl(url);
    if (!code) {
      setCertificateUrl(data);
    }
  }

  const { run: handleRecharge } = useThrottleFn(() => {
    // if (Number(money) < 100) {
    //   toast.success("ch金额不得少于100")
    //   return;
    // }
    traderRecharge({
      money: Number(money) * 100,
      certificateUrl: backendPhotoUrl
    }).then(({ code }) => {
      !code && toast.success("充值申请已提交，请等待管理员审核")
      setMoney('');
      setCertificateUrl('');
    }).catch((err: any) => {
      console.log(err);
    });
  }, { wait: 700 });

  return (
    <Container maxWidth="md">
      <Typography sx={{ mb: 4 }} variant="h6" gutterBottom>
        充值
      </Typography>
      <Paper elevation={3} sx={{ py: 8, mx: 'auto', maxWidth: 560 }}>
        <Stack direction="column" spacing={4} sx={{ mx: 'auto', maxWidth: 360 }}>
          <TextField
            label="充值金额"
            value={money}
            onChange={(e) => setMoney(e.target.value)}
            name="numberformat"
            id="formatted-numberformat-input"
            InputProps={{
              inputComponent: NumericFormatCustom,
            }}
          />

            <div>
              <Typography  variant="h6" gutterBottom>
                上传凭证
              </Typography>

              <IconButton className='w-full h-36' aria-label="upload picture" sx={{maxWidth: 220, borderRadius: '10px', bgcolor: '#434343' }} component="label">
                <input hidden accept="image/*" type="file" onChange={e => onChange(e, 1)} />
                {!certificateUrl && <PhotoCamera fontSize='large' />}
                {certificateUrl && <img className='w-full h-full' src={certificateUrl} />}
              </IconButton>
            </div>

          <Button variant="contained" disabled={!money} sx={{ py: 1.5 }} onClick={handleRecharge}>提交</Button>
        </Stack>
        
      </Paper>
    </Container>
  );
}

export default Recharge;
