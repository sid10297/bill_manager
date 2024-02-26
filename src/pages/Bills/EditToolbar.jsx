/* eslint-disable react/prop-types */
import { Button } from "@mui/material";
import { GridRowModes, GridToolbarContainer } from "@mui/x-data-grid";
import { randomId } from "@mui/x-data-grid-generator";
import AddIcon from "@mui/icons-material/Add";

export function EditToolbar(props) {
  const { setRows, setRowModesModel, rows } = props;
  const handleClick = () => {
    const id = randomId();
    setRows((oldRows) => [
      ...oldRows,
      {
        id,
        sNo: rows?.length + 1,
        descr: "",
        unit: "kg",
        rate: 0,
        qty: 0,
        discAmt: 0,
        amount: 0,
      },
    ]);
    setRowModesModel((oldModel) => ({
      ...oldModel,
      [id]: { mode: GridRowModes.Edit, fieldToFocus: "descr" },
    }));
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        Add record
      </Button>
    </GridToolbarContainer>
  );
}
