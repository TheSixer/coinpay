/* eslint-disable react-hooks/exhaustive-deps */
import { Visibility, VisibilityOff } from "@mui/icons-material";
import { Button, Card, CardContent, FormControl, IconButton, Input, InputAdornment, InputLabel, Stack, Typography } from "@mui/material";
import { useRequest, useThrottleFn } from "ahooks";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { traderLogin } from "../services/order";

const Login = () => {
  const [userName, setUserName] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const [showPassword, setShowPassword] = React.useState(false);
  const navigate = useNavigate();

  const { data, loading, run: handleLogin } = useRequest(traderLogin, {
    manual: true,
  });

  const handleClickShowPassword = () => setShowPassword((show) => !show);

  const { run: handleSubmit } = useThrottleFn(async () => {
    await handleLogin({
      userName,
      password
    })
  }, { wait: 1000 })

  useEffect(() => {
    const token = localStorage.getItem('token')

    if (token) {
      navigate('/trader/balance')
    }
  }, []);

  useEffect(() => {
    if (data && !data?.code) {
      console.log(data);
      localStorage.setItem('token', data?.data)
      navigate('/trader/balance');
    }
  }, [data])

  return (
    <div className="flex items-center justify-center h-full">
      <Card sx={{ minWidth: 360 }}>
        <CardContent sx={{ py: 4, px: 4, textAlign: 'center' }}>
          <Stack spacing={2}>
            <Typography variant="h6" gutterBottom>
              交易员登录
            </Typography>
            <FormControl variant="standard">
              <InputLabel htmlFor="standard-adornment-userName">用户名</InputLabel>
              <Input
                id="standard-adornment-userName"
                aria-describedby="standard-userName-helper-text"
                inputProps={{
                  'aria-label': '用户名',
                }}
                onChange={e => setUserName(e.target.value)}
              />
              {/* <FormHelperText id="standard-userName-helper-text">Weight</FormHelperText> */}
            </FormControl>
            <FormControl variant="standard">
              <InputLabel htmlFor="standard-adornment-password">密码</InputLabel>
              <Input
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
              />
            </FormControl>
          </Stack>
          <Button sx={{ mt: 6, mb: 4, width: '100%' }} disabled={loading || !userName || !password} variant="contained" onClick={handleSubmit}>登 录</Button>
          <p className="mb-2">没有账号？<a className="underline hover:text-zinc-300" href="/trader-register">立即注册</a></p>
          <a className="underline hover:text-zinc-300" href="/admin-login">管理员登录</a>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
