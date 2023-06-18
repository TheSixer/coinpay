import { Box, Chip, CircularProgress, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Typography } from "@mui/material";
import useRequest from "ahooks/lib/useRequest";
import { queryRates } from "../../services/admin"

function EnhancedTableHead() {
  const headCells = [
    {
      id: 'id',
      numeric: false,
      disablePadding: true,
      label: 'ID'
    },
    {
      id: 'currency',
      numeric: true,
      disablePadding: true,
      label: '货币'
    },
    {
      id: 'rate',
      numeric: true,
      disablePadding: true,
      label: '汇率'
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
  
  const { data, loading } = useRequest(queryRates, {
    defaultParams: []
  });

  const rows = data?.data || []

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
                  key={row.currency}
                // sx={{ cursor: 'pointer' }}
                >
                  <TableCell align="left">{index + 1}</TableCell>
                  <TableCell align="left">{row.currency}</TableCell>
                  <TableCell align="right">{row.rate || '-'}</TableCell>
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

      {!rows.length && !loading ? (
        <Typography sx={{ py: 4 }} variant="overline" align="center" display="block" gutterBottom>
          暂无数据
        </Typography>
      ) : null}
    </div>
  )
}

export default TradingList
