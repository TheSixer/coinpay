import { Box, Button, Chip, CircularProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Toolbar, FormControl, InputLabel, Select, MenuItem, Modal, OutlinedInput } from "@mui/material";
import { useThrottleFn } from "ahooks";
import useRequest from "ahooks/lib/useRequest";
import { useState } from "react";
import { queryTraderList, disableTrader,  enableTrader, verifyPass, verifyRefuse } from "../../services/admin"
import { toast } from 'react-toastify'
import { grey } from '@mui/material/colors';
import { useStateWithCallback } from '../../hooks';

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function EnhancedTableHead() {
  const headCells = [
    {
      id: 'id',
      numeric: false,
      disablePadding: true,
      label: 'ID'
    },
    {
      id: 'balance',
      numeric: true,
      disablePadding: true,
      label: '可用余额（USDT）'
    },
    {
      id: 'coolBalance',
      numeric: true,
      disablePadding: true,
      label: '冻结余额（USDT）'
    },
    {
      id: 'realName',
      numeric: true,
      disablePadding: true,
      label: '真实姓名'
    },
    {
      id: 'createTime',
      numeric: true,
      disablePadding: true,
      label: '创建时间'
    },
    {
      id: 'idCardUrl',
      numeric: true,
      disablePadding: true,
      label: '身份证照片'
    },
    {
      id: 'status',
      numeric: true,
      disablePadding: true,
      label: '状态'
    },
    {
      id: 'id',
      numeric: true,
      disablePadding: true,
      label: '操作'
    },
  ];
  return (
    <TableHead>
      <TableRow>
        {headCells.map((headCell, index) => (
          <TableCell sx={{ color: 'white' }} align={index < headCells.length - 1 ? 'left' : "right"} key={headCell.id}>{headCell.label}</TableCell>
        ))}
      </TableRow>
    </TableHead>
  );
}

function EnhancedTableToolbar(props: any) {
  const [status, setStatus] = useState('-1');
  const [realName, serRealName] = useState('');
  
  const {
    run: handleSearch,
  } = useThrottleFn(() => {
    setStatus(status);
    serRealName(realName);
    props.onSearch(status, realName);
  });

  const {
    run: handleClear,
  } = useThrottleFn(() => {
    setStatus('');
    serRealName('');
    props.onSearch('', '');
  });

  return (
    <Toolbar>
      <Stack direction="row" sx={{ my: 2 }} spacing={{ xs: 1, sm: 2, md: 4 }} alignItems="center" justifyContent="space-between">
        <FormControl sx={{ m: 1, minWidth: 180 }}>
          <InputLabel id="demo-simple-select-label" sx={{ color: 'white' }}>审核状态</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={status}
            label="订单状态"
            sx={{ color: 'white', borderColor: grey[400] }}
            onChange={e => setStatus(e.target.value)}
          >
            <MenuItem value={'-1'}>全部</MenuItem>
            <MenuItem value={'0'}>待审核</MenuItem>
            <MenuItem value={'1'}>审核通过</MenuItem>
            <MenuItem value={'2'}>审核拒绝</MenuItem>
          </Select>
        </FormControl>
        <FormControl variant="outlined" sx={{ m: 1, minWidth: 180 }}>
          <InputLabel htmlFor="standard-adornment-userName">真实姓名</InputLabel>
          <OutlinedInput
            id="standard-adornment-userName"
            aria-describedby="standard-userName-helper-text"
            inputProps={{
              'aria-label': '真实姓名',
            }}
            value={realName}
            onChange={e => serRealName(e.target.value)}
            label="真实姓名"
          />
          {/* <FormHelperText id="standard-userName-helper-text">Weight</FormHelperText> */}
        </FormControl>

        <Button
          variant="contained"
          sx={{ py: 1.5 }}
          onClick={handleSearch}
          fullWidth
        >
          <span>查询</span>
        </Button>

        <Button
          variant="outlined"
          sx={{ py: 1.5 }}
          onClick={handleClear}
          fullWidth
        >
          <span>清空</span>
        </Button>
      </Stack>
    </Toolbar>
  );
}

const TradingList = () => {
  const [verify, setVerify] = useState('-1');
  const [realName, serRealName] = useState('');
  const [currentId, setCurrentId] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [isShowConfirm, setIsShowConfirm] = useState(false);
  const [isShowReject, setIsShowReject] = useState(false);
  const [img, setImg] = useStateWithCallback('');
  
  const { data, loading, run: fetchList } = useRequest(queryTraderList, {
    defaultParams: [{ page: page + 1, limit: rowsPerPage, verify: verify === '-1' ? '' : verify, realName }]
  });

  const rows = data?.data.rows || []
  const total = data?.data.total || 0

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
    fetchList({ page: newPage + 1, limit: rowsPerPage, verify: verify === '-1' ? '' : verify, realName });
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    fetchList({ page: 1, limit: event.target.value, verify: verify === '-1' ? '' : verify, realName });
  };

  const { run: handleConfirm } = useThrottleFn(async (id) => {
    const { code, msg } = await enableTrader({
      id,
    })
    if (!code) {
      fetchList({ page, limit: rowsPerPage, verify: verify === '-1' ? '' : verify, realName });
    } else {
      toast.error(msg)
    }
  }, { wait: 1000 })

  const { run: handleReject } = useThrottleFn(async (id) => {
    const { code, msg } = await disableTrader({
      id,
    })
    if (!code) {
      setPage(0);
      fetchList({ page, limit: rowsPerPage, verify: verify === '-1' ? '' : verify, realName });
    } else {
      toast.error(msg)
    }
  }, { wait: 1000 })

  const { run: confirmVerify } = useThrottleFn(async () => {
    const { code, msg } = await verifyPass({
      id: currentId,
    })
    setIsShowConfirm(false);
    if (!code) {
      fetchList({ page, limit: rowsPerPage, verify: verify === '-1' ? '' : verify, realName });
    } else {
      toast.error(msg)
    }
  }, { wait: 1000 })

  const { run: rejectVerify } = useThrottleFn(async () => {
    const { code, msg } = await verifyRefuse({
      id: currentId,
    })
    setIsShowReject(false);
    if (!code) {
      setPage(0);
      fetchList({ page, limit: rowsPerPage, verify: verify === '-1' ? '' : verify, realName });
    } else {
      toast.error(msg)
    }
  }, { wait: 1000 })

  const showImg = (url?: string) => {
    setImg(url || '', () => {
      setOpen(!open);
    })
  }

  const handleSearch = (verify: string, realName: string) => {
    setVerify(verify);
    serRealName(realName);
    setPage(0);
    fetchList({ page: 1, limit: rowsPerPage, verify: verify === '-1' ? '' : verify, realName });
  }

  return (
    <div className="text-white bg-gray-800 p-4 rounded">
      <EnhancedTableToolbar onSearch={handleSearch} />
      <TableContainer>
        <Table
          sx={{ minWidth: 750, color: 'white' }}
          aria-labelledby="tableTitle"
        >
          <EnhancedTableHead />
          <TableBody>
            {rows.map((row: any, index: number) => {

              return (
                <TableRow
                  hover
                  // onClick={(event) => handleClick(event, row.name)}
                  role="checkbox"
                  // aria-checked={isItemSelected}
                  tabIndex={-1}
                  key={row.id}
                // sx={{ cursor: 'pointer' }}
                >
                  <TableCell align="left">{row.id}</TableCell>
                  <TableCell align="left">${Math.floor(row.balance * 100) / 10000}</TableCell>
                  <TableCell align="left">${Math.floor(row.coolBalance * 100) / 10000}</TableCell>
                  <TableCell align="left">{row.realName || '-'}</TableCell>
                  <TableCell align="left">{row.createTime}</TableCell>
                  <TableCell align="left">
                    {
                      row.idCardUrl ? 
                      <img className="pointer" src={row.idCardUrl} width={120} alt="交易凭证" onClick={() => showImg(row.idCardUrl)} /> : null
                    }
                  </TableCell>
                  <TableCell align="left">
                    {
                      row.haveVerify ? (
                        <Chip
                          label={row.haveVerify === 0 ? '待审核' : row.haveVerify === 2 ? '已拒绝' : !row.loginStatus ? '启用' : '禁用'}
                          color={row.haveVerify === 0 ? 'warning' : row.haveVerify === 2 ? 'error' : !row.loginStatus ? 'success' : 'error'}
                          variant="outlined"
                        />
                      ) : null
                    }
                  </TableCell>
                  <TableCell align="right">
                    <Stack direction="row" justifyContent="flex-end" spacing={1}>
                      {
                        row.haveVerify === 1 ? (
                          <>
                          <Button size="small" variant="contained" disabled={!row.loginStatus} color="success" onClick={() => {
                            handleConfirm(row.id)
                          }}>
                            启用
                          </Button>
                          <Button size="small" variant="outlined" disabled={row.loginStatus} color="error" onClick={() => {
                            handleReject(row.id)
                          }}>
                            禁用
                          </Button>
                          </>
                        ) : row.haveVerify === 0 ? (
                          <>
                            <Button size="small" variant="contained" color="success" onClick={() => {
                              setCurrentId(row.id)
                              setIsShowConfirm(true);
                            }}>
                              通过审核
                            </Button>
                            <Button size="small" variant="outlined" color="error" onClick={() => {
                              setCurrentId(row.id)
                              setIsShowReject(true);
                            }}>
                              拒绝审核
                            </Button>
                          </>
                        ) : null
                      }
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
      {
        loading ? (
          <>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', p: 4 }}>
              <CircularProgress />
            </Box>
          </>
        ) : null
      }

      {!total && !loading ? (
        <Typography sx={{ py: 4 }} variant="overline" align="center" display="block" gutterBottom>
          暂无数据
        </Typography>
      ) : (
        <>
          <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={total}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}
      <Dialog
        open={isShowConfirm}
        onClose={() => setIsShowConfirm(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          通过审核
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            您确认此交易员身份信息无误，继续通过？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsShowConfirm(false)}>取消</Button>
          <Button onClick={confirmVerify} autoFocus>
            确认通过
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog
        open={isShowReject}
        onClose={() => setIsShowReject(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          拒绝审核
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            此操作将拒绝通过交易员身份信息审核，继续拒绝？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsShowReject(false)}>取消</Button>
          <Button onClick={rejectVerify} autoFocus>
            确定拒绝
          </Button>
        </DialogActions>
      </Dialog>
      <Modal
        open={open}
        onClose={() => showImg()}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <img src={img} alt="" />
        </Box>
      </Modal>
    </div>
  )
}

export default TradingList
