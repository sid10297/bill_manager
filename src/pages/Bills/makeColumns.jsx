import { GridActionsCellItem, GridRowModes } from "@mui/x-data-grid";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
// import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";

export function makeColumns(
  rowModesModel,
  handleSaveClick,
  handleCancelClick,
  handleDeleteClick
  // handleEditClick
) {
  const columns = [
    {
      field: "sNo",
      headerName: "Sr No",
      width: 10,
      editable: false,
      type: "number",
    },
    {
      field: "descr",
      headerName: "Description",
      type: "string",
      width: 200,
      align: "left",
      headerAlign: "left",
      editable: (row) => row.isEditable,
    },
    {
      field: "unit",
      headerName: "Unit",
      type: "string",
      width: 100,
      editable: (row) => row.isEditable,
    },
    {
      field: "rate",
      headerName: "Rate",
      type: "number",
      width: 100,
      editable: (row) => row.isEditable,
    },
    {
      field: "qty",
      headerName: "Quantity",
      type: "number",
      width: 100,
      editable: (row) => row.isEditable,
    },
    {
      field: "discAmt",
      headerName: "Discount",
      type: "number",
      width: 150,
      editable: (row) => row.isEditable,
    },
    {
      field: "amount",
      headerName: "Amount",
      type: "number",
      width: 100,
      editable: false,
      valueGetter: (params) => params.row.rate * params.row.qty,
    },
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 100,
      cellClassName: "actions",
      getActions: ({ id }) => {
        const isInEditMode = rowModesModel[id]?.mode === GridRowModes.Edit;

        if (isInEditMode) {
          return [
            <GridActionsCellItem
              key={id}
              icon={<SaveIcon />}
              label="Save"
              sx={{
                color: "primary.main",
              }}
              onClick={handleSaveClick(id)}
            />,
            <GridActionsCellItem
              key={id}
              icon={<CancelIcon />}
              label="Cancel"
              className="textPrimary"
              onClick={handleCancelClick(id)}
              color="inherit"
            />,
          ];
        }

        return [
          // <GridActionsCellItem
          //   key={id}
          //   icon={<EditIcon />}
          //   label="Edit"
          //   className="textPrimary"
          //   onClick={handleEditClick(id)}
          //   color="inherit"
          // />,
          <GridActionsCellItem
            key={id}
            icon={<DeleteIcon />}
            label="Delete"
            onClick={handleDeleteClick(id)}
            color="inherit"
          />,
        ];
      },
    },
  ];

  return columns;
}
