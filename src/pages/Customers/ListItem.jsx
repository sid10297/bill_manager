import { Button, ButtonGroup, TableCell, TableRow } from "@mui/material";
import PropTypes from "prop-types";

export const ListItem = ({ data, srNo, onEdit, onRemove }) => {
  const { name, id } = data;

  return (
    <TableRow sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
      <TableCell component="th" scope="row">
        {srNo}
      </TableCell>

      <TableCell align="right">{name}</TableCell>

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
  }),
  srNo: PropTypes.number.isRequired,
  onEdit: PropTypes.func,
  onRemove: PropTypes.func,
};
