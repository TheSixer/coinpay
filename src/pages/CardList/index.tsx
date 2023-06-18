import { Box, Button, Chip, CircularProgress, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TablePagination, TableRow, Toolbar, Typography } from "@mui/material";
import useRequest from "ahooks/lib/useRequest";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { queryBankCards, activeCard } from "../../services/order"

function EnhancedTableHead() {
  const headCells = [
    {
      id: 'id',
      numeric: false,
      disablePadding: true,
      label: 'ID'
    },
    {
      id: 'bankName',
      numeric: true,
      disablePadding: true,
      label: '银行名称'
    },
    {
      id: 'subBankName',
      numeric: true,
      disablePadding: true,
      label: '所属支行'
    },
    {
      id: 'bankCardNum',
      numeric: true,
      disablePadding: true,
      label: '银行卡号'
    },
    {
      id: 'realName',
      numeric: true,
      disablePadding: true,
      label: '真实姓名'
    },
    {
      id: 'active',
      numeric: true,
      disablePadding: true,
      label: '激活状态'
    },
    {
      id: 'actions',
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

const EnhancedTableToolbar = () => {
  const navigate = useNavigate();
  return (
    <Toolbar>
      <Stack direction="row" sx={{ my: 2 }} spacing={{ xs: 1, sm: 2, md: 4 }} alignItems="center" justifyContent="space-between">
        <Button
          variant="contained"
          sx={{ py: 1.5 }}
          onClick={() => navigate('/trader/new-card')}
          fullWidth
        >
          <span>新增银行卡</span>
        </Button>
      </Stack>
    </Toolbar>
  );
};

const TradingList = () => {
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [page, setPage] = useState(0);
  const [open, setOpen] = useState(false);
  const [curId, setCurId] = useState<string | number>('');

  const handleClickOpen = (id: number) => {
    setCurId(id);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };
  
  const { data, loading, run: fetchList } = useRequest(queryBankCards, {
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

  const handleActive = () => {
    setOpen(false);
    activeCard({ id: curId })
      .then((res: any) => {
        setPage(0);
        fetchList({ page: 1, limit: 10 });
      })
  }

  return (
    <div className="text-white bg-gray-800 p-4 rounded">
      <EnhancedTableToolbar />
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
                  <TableCell align="left">{row.id}</TableCell>
                  <TableCell align="left">{row.bankName}</TableCell>
                  <TableCell align="left">{row.subBankName}</TableCell>
                  <TableCell align="left">{row.bankCardNum || '-'}</TableCell>
                  <TableCell align="left">{row.realName || '-'}</TableCell>
                  <TableCell align="left">
                    <Chip
                      label={row.active ? '激活中' : '未激活'}
                      color={row.active ? 'success' : 'error'}
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell align="right">
                    <>
                      <Button variant="outlined" disabled={row.active} color="success" onClick={() => handleClickOpen(row.id)}>激活</Button>
                    </>
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
        open={open}
        keepMounted
        onClose={handleClose}
        aria-describedby="alert-dialog-slide-description"
      >
        <DialogTitle>{"激活银行卡"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-slide-description">
            每位用户只能同时激活一张可用的银行卡，确定要激活此银行卡吗？
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>取消</Button>
          <Button onClick={handleActive}>确定</Button>
        </DialogActions>
      </Dialog>
    </div>
  )
}

export default TradingList
