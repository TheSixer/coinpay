/* eslint-disable jsx-a11y/alt-text */
import { PhotoCamera, Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, Card, CardContent, FormControl, IconButton, OutlinedInput, InputAdornment, InputLabel, Stack, Typography, Paper, Select, InputBase, MenuItem } from "@mui/material";
import { useRequest, useThrottleFn } from "ahooks";
import React, { useEffect, useMemo, useState } from "react";
import countryTelData  from 'country-telephone-data';
import { getImgUrl, queryRegisterPolicy, traderRegister } from "../../services/order";
import { toast } from "react-toastify";

const Login = () => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [password1, setPassword1] = useState<string>('');
  const [idCardUrl, setIdCardUrl] = useState('');
  const [frontPhoto, setFrontPhoto] = useState('');
  const [phone, setPhone] = useState('');
  const [realName, serRealName] = useState('');
  const [exPhone, setExPhone] = useState('86');
  
  const [showPassword, setShowPassword] = React.useState(false);

  const { data, loading, run: handleRegister } = useRequest(traderRegister, {
    manual: true,
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const { run: handleSubmit } = useThrottleFn(async () => {
    if (password !== password1) {
      toast.warn('两次输入的密码不一致')
      return;
    }
    await handleRegister({
      email,
      password,
      idCardUrl,
      realName,
      phone: exPhone + phone,
    })
  }, { wait: 1000 })
  
  const { data: Policy } = useRequest(queryRegisterPolicy, {
    defaultParams: [],
  });

  const policy = Policy?.data || null;
  
  useEffect(() => {
    if (data?.code === 0) {
      toast.success('注册成功，请等待管理员审核');
      window.location?.reload();
    }
  }, [data]);

  const allCountries = useMemo(() => {
    const obj = countryTelData.allCountries.find(({iso2}: any) => iso2 === 'cn');
    const list = countryTelData.allCountries.filter(({iso2}: any) => iso2 !== 'cn');
    if (obj) {
      list.unshift(obj);
    }
    return list
  }, [])

  const onChange = (file: any) => {
    if (file) uploadImg(file);
  }

  const uploadImg = async (file: File) => {
    const formdata = new FormData();
    console.log(policy);
    formdata.append('OSSAccessKeyId', policy.accessid);
    formdata.append('key', policy.dir + '/' + file.name);
    formdata.append('success_action_status', '200');
    formdata.append('policy', policy.policy);
    formdata.append('signature', policy.signature);
    formdata.append('file', file);

    fetch(policy.host, {
      method: 'POST',
      body: formdata
    }).then(res => {
      setIdCardUrl(`${policy.dir}/${file.name}`);
      fetchImg(`${policy.dir}/${file.name}`);
    })
  }

  const fetchImg = async (url: string) => {
    const { code, data } = await getImgUrl(url);
    if (!code) {
      setFrontPhoto(data);
    }
  }

  return (
    <div className="flex items-center justify-center h-full">
      <Card sx={{ minWidth: 600 }}>
        <CardContent sx={{ py: 4, px: 4, textAlign: 'center' }}>
          <Typography sx={{ textAlign: 'left', fontWeight: 600, marginBottom: 4 }} variant="h6" gutterBottom>
            交易员注册
          </Typography>
          <Stack spacing={2}>
            <FormControl variant="outlined">
              <InputLabel htmlFor="standard-adornment-userName">邮箱</InputLabel>
              <OutlinedInput
                id="standard-adornment-userName"
                aria-describedby="standard-userName-helper-text"
                inputProps={{
                  'aria-label': '邮箱',
                }}
                onChange={e => setEmail(e.target.value)}
                label="邮箱"
              />
              {/* <FormHelperText id="standard-userName-helper-text">Weight</FormHelperText> */}
            </FormControl>
            <FormControl variant="outlined">
              <InputLabel htmlFor="standard-adornment-password">密码</InputLabel>
              <OutlinedInput
                id="standard-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                onChange={e => setPassword(e.target.value)}
                label="密码"
              />
            </FormControl>
            <FormControl variant="outlined">
              <InputLabel htmlFor="standard-adornment-password">确认密码</InputLabel>
              <OutlinedInput
                id="standard-adornment-password"
                type={showPassword ? 'text' : 'password'}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={handleClickShowPassword}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                onChange={e => setPassword1(e.target.value)}
                label="确认密码"
              />
            </FormControl>
            <FormControl variant="outlined">
              <InputLabel htmlFor="standard-adornment-userName">真实姓名</InputLabel>
              <OutlinedInput
                id="standard-adornment-userName"
                aria-describedby="standard-userName-helper-text"
                inputProps={{
                  'aria-label': '真实姓名',
                }}
                onChange={e => serRealName(e.target.value)}
                label="真实姓名"
              />
              {/* <FormHelperText id="standard-userName-helper-text">Weight</FormHelperText> */}
            </FormControl>
            <Paper
              component="form"
              variant="outlined"
              className='border-gray-400'
              sx={{ display: 'flex', alignItems: 'center', p: 1.5, background: 'none' }}
            >
              {/* <InputLabel id="demo-simple-select-label">Age</InputLabel> */}
              <Select
                className='border-none'
                sx={{ width: 92, borderColor: '#525252' }}
                labelId="tel"
                id="tel"
                value={exPhone}
                onChange={e => setExPhone(e.target.value)}
                variant="standard"
              >
                {
                  allCountries.map(({dialCode, iso2}: any) => <MenuItem value={dialCode} key={iso2}>+{dialCode}</MenuItem>)
                }
              </Select>
              <InputBase
                sx={{ ml: 1, flex: 1 }}
                placeholder="请输入手机号"
                value={phone}
                inputProps={{ 'aria-label': '请输入手机号' }}
                onChange={e => setPhone(e.target.value)}
              />
            </Paper>

            <p className="text-left">上传手持身份证</p>
            <IconButton className='w-full h-36 border border-gray-400 bg-gray-800' aria-label="upload picture" sx={{borderRadius: '10px', bgcolor: 'gray'}} component="label">
              <input hidden accept="image/*" type="file" onChange={e => onChange(e?.target?.files?.[0])} />
              {!frontPhoto && <PhotoCamera fontSize='large' />}
              {frontPhoto && <img className='w-full h-full' src={frontPhoto} />}
            </IconButton>

          </Stack>
          <Button sx={{ mt: 6, mb: 4, width: '100%' }} disabled={loading || !email || !password || !password1 || !idCardUrl || !realName} variant="contained" onClick={handleSubmit}>注 册</Button>
          <p>已有账号，<a className="underline" href="/">立即登录</a></p>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
