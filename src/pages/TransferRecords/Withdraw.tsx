import { Box, Button, Chip, CircularProgress, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Typography, Toolbar, FormControl, InputLabel, Select, MenuItem } from "@mui/material";
import { useThrottleFn } from "ahooks";
import useRequest from "ahooks/lib/useRequest";
import { useState } from "react";
import { queryWithdrawList } from "../../services/order"
import { grey } from '@mui/material/colors';

function EnhancedTableHead() {
  const headCells = [
    {
      id: 'usdtAccount',
      numeric: false,
      disablePadding: true,
      label: '交易账户'
    },
    {
      id: 'usdAmount',
      numeric: true,
      disablePadding: true,
      label: '金额（USDT）'
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
      id: 'reason',
      numeric: true,
      disablePadding: true,
      label: '备注'
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
  const [status, setStatus] = useState<number | string>(-1);

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
            <MenuItem value={-1}>全部</MenuItem>
            <MenuItem value={0}>待审核</MenuItem>
            <MenuItem value={1}>已完成</MenuItem>
            <MenuItem value={2}>已驳回</MenuItem>
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
  const [status, setStatus] = useState<number | string>('');
  
  
  const { data, loading, run: fetchList } = useRequest(queryWithdrawList, {
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

  const handleSearch = (status: number) => {
    setStatus(status);
    fetchList({ page: page + 1, limit: rowsPerPage, status: status < 0 ? '' : status });
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
                  <TableCell align="left">{row.usdtAccount || '-'}</TableCell>
                  <TableCell align="left">¥{Math.floor(row.amount * 100) / 10000}</TableCell>
                  <TableCell align="left">{row.createTime || '-'}</TableCell>
                  <TableCell align="left">{row.auditTime || '-'}</TableCell>
                  <TableCell align="left">
                    <Chip
                      label={row.status === 1 ? '已驳回' : row.status === 2 ? '已完成' : '待审核'}
                      color={row.status === 1 ? 'error' : row.status === 2 ? 'success' : 'warning'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">{row.reason || '-'}</TableCell>
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
