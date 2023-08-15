import { Box, Button, Chip, CircularProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Toolbar, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useThrottleFn } from "ahooks";
import useRequest from "ahooks/lib/useRequest";
import { useState } from "react";
import { queryTradingList, confirmRecieve,  confirmReject } from "../services/order"
import { toast } from 'react-toastify'
import { grey } from '@mui/material/colors';

function EnhancedTableHead() {
  const headCells = [
    {
      id: 'orderCode',
      numeric: false,
      disablePadding: true,
      label: '订单号'
    },
    {
      id: 'amount',
      numeric: true,
      disablePadding: true,
      label: '金额（CNY）'
    },
    {
      id: 'usdAmount',
      numeric: true,
      disablePadding: true,
      label: '金额（USDT）'
    },
    {
      id: 'usdRate',
      numeric: true,
      disablePadding: true,
      label: '汇率'
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
      id: 'updateTime',
      numeric: true,
      disablePadding: true,
      label: '更新时间'
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

  const {
    run: handleSearch,
  } = useThrottleFn(() => {
    props.onSearch(status === '-1' ? '' : status);
  });

  return (
    <Toolbar>
      <Stack direction="row" sx={{ my: 2 }} spacing={{ xs: 1, sm: 2, md: 4 }} alignItems="center" justifyContent="space-between">
        <FormControl sx={{ m: 1, minWidth: 180 }}>
          <InputLabel id="demo-simple-select-label" sx={{ color: 'white' }}>订单状态</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={status}
            label="订单状态"
            sx={{ color: 'white', borderColor: grey[400] }}
            onChange={e => setStatus(e.target.value)}
          >
            <MenuItem value={'-1'}>全部</MenuItem>
            <MenuItem value={'wait'}>待支付</MenuItem>
            <MenuItem value={'confirm'}>已转账</MenuItem>
            <MenuItem value={'paid'}>已支付</MenuItem>
            <MenuItem value={'cancel'}>已取消</MenuItem>
            <MenuItem value={'reject'}>已拒绝</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          sx={{ py: 1.5 }}
          onClick={handleSearch}
          fullWidth
        >
          <span>查询</span>
        </Button>
      </Stack>
    </Toolbar>
  );
}

const TradingList = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [isShowConfirm, setIsShowConfirm] = useState(false);
  const [isShowReject, setIsShowReject] = useState(false);
  const [orderCode, setOrderCode] = useState('');
  const [reason, setReason] = useState('');
  const [status, setStatus] = useState('');
  
  const { data, loading, run: fetchList } = useRequest(queryTradingList, {
    defaultParams: [{ page: page + 1, limit: rowsPerPage, status }]
  });

  const rows = data?.data.rows || []
  const total = data?.data.total || 0

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
    fetchList({ page: newPage + 1, limit: rowsPerPage, status });
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    fetchList({ page: 1, limit: event.target.value, status });
  };

  const { run: handleConfirm } = useThrottleFn(async () => {
    const { code, msg } = await confirmRecieve({
      orderCode,
    })
    if (!code) {
      fetchList({ page: 1, limit: rowsPerPage, status });
      setIsShowConfirm(false);
    } else {
      toast.error(msg)
    }
  }, { wait: 1000 })

  const { run: handleReject } = useThrottleFn(async () => {
    const { code, msg } = await confirmReject({
      orderCode,
      reason
    })
    if (!code) {
      setPage(0);
      fetchList({ page: 1, limit: rowsPerPage, status });
      setIsShowReject(false);
    } else {
      toast.error(msg)
    }
  }, { wait: 1000 })

  const handleSearch = (status: string) => {
    setStatus(status);
    setPage(0);
    fetchList({ page: 1, limit: rowsPerPage, status });
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
                  key={row.orderCode}
                // sx={{ cursor: 'pointer' }}
                >
                  <TableCell align="left">{row.orderCode}</TableCell>
                  <TableCell align="left">¥{Math.floor(row.amount * 100) / 10000}</TableCell>
                  <TableCell align="left">${Math.floor(row.usdAmount * 100) / 10000}</TableCell>
                  <TableCell align="left">{row.usdRate}</TableCell>
                  <TableCell align="left">{row.realName || '-'}</TableCell>
                  <TableCell align="left">{row.createTime}</TableCell>
                  <TableCell align="left">{row.updateTime}</TableCell>
                  <TableCell align="right">
                    <Chip
                      label={row.status === 'wait' ? '待支付' : row.status === 'confirm' ? '已转账' : row.status === 'paid' ? '已支付' : row.status === 'cancel' ? '已取消' : '已驳回'}
                      color={row.status === 'wait' ? 'warning' : row.status === 'paid' || row.status === 'confirm' ? 'success' : row.status === 'cancel' ? 'default' : 'error'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="left">
                    {
                      row.status === 'confirm' ? (
                        <>
                          <Stack direction="row" spacing={1}>
                            <Button size="small" variant="contained" color="success" onClick={() => {
                              setOrderCode(row.orderCode)
                              setIsShowConfirm(true)
                            }}>
                              通过
                            </Button>
                            <Button size="small" variant="outlined" color="error" onClick={() => {
                              setReason('')
                              setOrderCode(row.orderCode)
                              setIsShowReject(true)
                            }}>
                              拒绝
                            </Button>
                          </Stack>
                        </>
                      ): (
                        <Chip
                          label={row.status === 'wait' ? '待支付' : row.status === 'confirm' ? '已完成' : row.status === 'paid' ? '已支付' : row.status === 'cancel' ? '已取消' : '已驳回'}
                          variant="outlined"
                        />
                      )
                    }
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
            您确认已收到转账，此操作将通过该笔转账审核，继续通过？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsShowConfirm(false)}>取消</Button>
          <Button onClick={handleConfirm} autoFocus>
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
            您确认未收到转账，此操作将拒绝通过该笔转账审核，继续拒绝？
          </DialogContentText>
          <TextField
            autoFocus
            value={reason}
            margin="dense"
            id="name"
            label="拒绝原因"
            type="text"
            fullWidth
            variant="standard"
            onChange={(e: any) => setReason(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsShowReject(false)}>取消</Button>
          <Button onClick={handleReject} disabled={!reason} autoFocus>
            确定拒绝
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default TradingList
