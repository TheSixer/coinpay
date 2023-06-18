import { Box, Button, Chip, CircularProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Toolbar, FormControl, InputLabel, Select, MenuItem, Modal } from "@mui/material";
import { useThrottleFn } from "ahooks";
import useRequest from "ahooks/lib/useRequest";
import { useState } from "react";
import { queryRechargeList, confirmRecharge,  rejectRecharge } from "../../services/admin"
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
      id: 'orderCode',
      numeric: false,
      disablePadding: true,
      label: '订单号'
    },
    {
      id: 'traderId',
      numeric: true,
      disablePadding: true,
      label: '交易员ID'
    },
    {
      id: 'amount',
      numeric: true,
      disablePadding: true,
      label: '金额（USDT）'
    },
    {
      id: 'traderRealName',
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
      id: 'auditTime',
      numeric: true,
      disablePadding: true,
      label: '更新时间'
    },
    {
      id: 'certificateUrl',
      numeric: true,
      disablePadding: true,
      label: '交易凭证'
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
  const [status, setStatus] = useState('wait');

  const {
    run: handleSearch,
  } = useThrottleFn(() => {
    props.onSearch(status);
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
            <MenuItem value={'wait'}>待支付</MenuItem>
            <MenuItem value={'confirm'}>已转账</MenuItem>
            <MenuItem value={'paid'}>已支付</MenuItem>
            <MenuItem value={'cancle'}>已取消</MenuItem>
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
  const [open, setOpen] = useState(false);
  const [img, setImg] = useStateWithCallback('');
  
  const { data, loading, run: fetchList } = useRequest(queryRechargeList, {
    defaultParams: [{ page: page + 1, limit: rowsPerPage, status }]
  });

  const rows = data?.data.rows || []
  const total = data?.data.total || 0

  const handleChangePage = (event: any, newPage: number) => {
    setPage(newPage);
    fetchList({ page: newPage + 1, limit: rowsPerPage });
  };

  const handleChangeRowsPerPage = (event: any) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
    fetchList({ page: 1, limit: event.target.value });
  };

  const { run: handleConfirm } = useThrottleFn(async () => {
    const { code, msg } = await confirmRecharge({
      orderCode,
    })
    if (!code) {
      fetchList({ page: 1, limit: rowsPerPage });
      setIsShowConfirm(false);
    } else {
      toast.error(msg)
    }
  }, { wait: 1000 })

  const { run: handleReject } = useThrottleFn(async () => {
    const { code, msg } = await rejectRecharge({
      orderCode,
      reason
    })
    if (!code) {
      setPage(0);
      fetchList({ page: 1, limit: rowsPerPage });
      setIsShowReject(false);
    } else {
      toast.error(msg)
    }
  }, { wait: 1000 })

  const handleSearch = (status: string) => {
    setStatus(status);
    fetchList({ page: page + 1, limit: rowsPerPage, status });
  }

  const showImg = (url?: string) => {
    setImg(url || '', () => {
      setOpen(!open);
    })
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
                  <TableCell align="left" width={120}>{row.orderCode}</TableCell>
                  <TableCell align="left">{row.traderId}</TableCell>
                  <TableCell align="left">${Math.floor(row.amount * 100) / 10000}</TableCell>
                  <TableCell align="left">{row.traderRealName || '-'}</TableCell>
                  <TableCell align="left">{row.createTime}</TableCell>
                  <TableCell align="left">{row.auditTime}</TableCell>
                  <TableCell align="left">
                    <img className="pointer" src={row.certificateUrl} width={120} alt="交易凭证" onClick={() => showImg(row.certificateUrl)} />
                  </TableCell>
                  <TableCell align="center">
                    <Chip
                      label={row.status === 'wait' ? '待支付' : row.status === 'confirm' ? '已转账' : row.status === 'paid' ? '已支付' : row.status === 'cancle' ? '已取消' : '已驳回'}
                      color={row.status === 'wait' ? 'warning' : row.status === 'paid' || row.status === 'confirm' ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
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
                          label={row.status === 'wait' ? '待支付' : row.status === 'confirm' ? '已完成' : row.status === 'paid' ? '已支付' : row.status === 'cancle' ? '已取消' : '已驳回'}
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
