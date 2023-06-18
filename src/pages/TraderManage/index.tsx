import { Box, Button, Chip, CircularProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField, Toolbar, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useThrottleFn } from "ahooks";
import useRequest from "ahooks/lib/useRequest";
import { useState } from "react";
import { queryTraderList, disableTrader,  enableTrader } from "../../services/admin"
import { toast } from 'react-toastify'

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
      label: '余额（USDT）'
    },
    {
      id: 'coolBalance',
      numeric: true,
      disablePadding: true,
      label: '可用余额（USDT）'
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

const TradingList = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  
  const { data, loading, run: fetchList } = useRequest(queryTraderList, {
    defaultParams: [{ page: page + 1, limit: rowsPerPage }]
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

  const { run: handleConfirm } = useThrottleFn(async (id) => {
    const { code, msg } = await enableTrader({
      id,
    })
    if (!code) {
      fetchList({ page, limit: rowsPerPage });
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
      fetchList({ page, limit: rowsPerPage });
    } else {
      toast.error(msg)
    }
  }, { wait: 1000 })

  return (
    <div className="text-white bg-gray-800 p-4 rounded">
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
                    <Chip
                      label={!row.loginStatus ? '启用' : '禁用'}
                      color={!row.loginStatus ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="left">
                    <Stack direction="row" spacing={1}>
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
    </div>
  )
}

export default TradingList
