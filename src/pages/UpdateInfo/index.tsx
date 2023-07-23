/* eslint-disable jsx-a11y/alt-text */
import { PhotoCamera } from "@mui/icons-material";
import { Button, Card, CardContent, FormControl, IconButton, OutlinedInput, InputLabel, Stack, Typography } from "@mui/material";
import { useRequest, useThrottleFn } from "ahooks";
import { useEffect, useState } from "react";
import { getImgUrl, queryRegisterPolicy, updateInfo } from "../../services/order";
import { toast } from "react-toastify";

const Login = () => {
  const [idCardUrl, setIdCardUrl] = useState('');
  const [frontPhoto, setFrontPhoto] = useState('');
  const [realName, serRealName] = useState('');
  

  const { data, loading, run: handleUpdate } = useRequest(updateInfo, {
    manual: true,
  });

  const { run: handleSubmit } = useThrottleFn(async () => {
    await handleUpdate({
      idCardUrl,
      realName,
    })
  }, { wait: 1000 })
  
  const { data: Policy } = useRequest(queryRegisterPolicy, {
    defaultParams: [],
  });

  const policy = Policy?.data || null;
  
  useEffect(() => {
    if (data?.code === 0) {
      toast.success('更新成功，请等待管理员审核');
      window.location?.reload();
    }
  }, [data]);


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
            更新审核信息
          </Typography>
          <Stack spacing={2}>
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
            <p className="text-left">上传手持身份证</p>
            <IconButton className='w-full h-36 border border-gray-400 bg-gray-800' aria-label="upload picture" sx={{borderRadius: '10px', bgcolor: 'gray'}} component="label">
              <input hidden accept="image/*" type="file" onChange={e => onChange(e?.target?.files?.[0])} />
              {!frontPhoto && <PhotoCamera fontSize='large' />}
              {frontPhoto && <img className='w-full h-full' src={frontPhoto} />}
            </IconButton>

          </Stack>
          <Button sx={{ mt: 6, mb: 4, width: '100%' }} disabled={loading || !idCardUrl || !realName} variant="contained" onClick={handleSubmit}>更 新</Button>
        </CardContent>
      </Card>
    </div>
  )
}

export default Login
