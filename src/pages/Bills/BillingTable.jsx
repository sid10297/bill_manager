/* eslint-disable react/prop-types */
import { Box } from "@mui/material";
import {
  DataGrid,
  GridRowEditStopReasons,
  GridRowModes,
} from "@mui/x-data-grid";
import { makeColumns } from "./makeColumns";
import { EditToolbar } from "./EditToolbar";
import { useState } from "react";

export function BillingTable({ setRows, rows }) {
  const [rowModesModel, setRowModesModel] = useState({});

  const handleRowEditStop = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const handleEditClick = (id) => () => {
    setRows((prevRows) =>
      prevRows.map((row) => {
        if (row?.billItemID) {
          return row?.billItemID === id ? { ...row, isEditable: true } : row;
        } else if (row?.id) {
          return row?.id === id ? { ...row, isEditable: true } : row;
        }
      })
    );
  };

  const handleSaveClick = (id) => () => {
    setRowModesModel({ ...rowModesModel, [id]: { mode: GridRowModes.View } });
  };

  const handleDeleteClick = (id) => () => {
    setRows((prevRows) =>
      prevRows.filter((row) => {
        if (row?.billItemID) {
          return row.billItemID !== id;
        } else {
          return row.id !== id;
        }
      })
    );
  };

  const handleCancelClick = (id) => () => {
    setRowModesModel({
      ...rowModesModel,
      [id]: { mode: GridRowModes.View, ignoreModifications: true },
    });

    const editedRow = rows.find((row) => {
      if (row?.billItemID) {
        return row.billItemID === id;
      } else {
        return row.id === id;
      }
    });
    if (editedRow.isNew) {
      setRows(
        rows.filter((row) => {
          if (row?.billItemID) {
            return row.billItemID !== id;
          } else {
            return row.id !== id;
          }
        })
      );
    }
  };

  const processRowUpdate = (newRow) => {
    const updatedRow = { ...newRow, isNew: false };
    setRows(
      rows.map((row) => {
        if (row?.billItemID) {
          return row.billItemID === newRow.billItemID ? updatedRow : row;
        } else {
          return row.id === newRow.id ? updatedRow : row;
        }
      })
    );
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  return (
    <Box
      sx={{
        width: "100%",
        "& .actions": {
          color: "text.secondary",
        },
        "& .textPrimary": {
          color: "text.primary",
        },
      }}
    >
      <DataGrid
        rows={rows}
        columns={makeColumns(
          rowModesModel,
          handleSaveClick,
          handleCancelClick,
          handleDeleteClick,
          handleEditClick
        )}
        getRowId={(row) => {
          return row?.billItemID ? row.billItemID : row.id;
        }}
        editMode="row"
        rowModesModel={rowModesModel}
        onRowModesModelChange={handleRowModesModelChange}
        onRowEditStop={handleRowEditStop}
        processRowUpdate={processRowUpdate}
        slots={{
          toolbar: EditToolbar,
        }}
        slotProps={{
          toolbar: { setRows, setRowModesModel, rows },
        }}
      />
    </Box>
  );
}
