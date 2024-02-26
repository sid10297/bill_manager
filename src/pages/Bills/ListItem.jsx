import { Button, ButtonGroup, TableCell, TableRow } from "@mui/material";
import PropTypes from "prop-types";

export const ListItem = ({ data, srNo, onEdit, onRemove }) => {
  const { id, billNo, date, customerName, netAmount, remarks } = data;

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell component="th" scope="row">
        {srNo}
      </TableCell>

      <TableCell align="right">{billNo}</TableCell>
      <TableCell align="right">{date?.substring(0, 10)}</TableCell>
      <TableCell align="right">{customerName}</TableCell>
      <TableCell align="right">{netAmount}</TableCell>
      <TableCell align="right">{remarks}</TableCell>

      <TableCell align="right">
        <ButtonGroup>
          <Button variant="contained" onClick={() => onEdit(data)}>
            Edit
          </Button>
          <Button
            color="error"
            variant="contained"
            onClick={() => onRemove(id)}
          >
            Delete
          </Button>
        </ButtonGroup>
      </TableCell>
    </TableRow>
  );
};

ListItem.propTypes = {
  data: PropTypes.shape({
    id: PropTypes.number,
    name: PropTypes.string,
    netAmount: PropTypes.number,
    billNo: PropTypes.number,
    date: PropTypes.string,
    customerName: PropTypes.string,
    remarks: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null])]),
  }),
  srNo: PropTypes.number.isRequired,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
};
