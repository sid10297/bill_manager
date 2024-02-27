import { Button, ButtonGroup } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useRef, useState } from "react";

import { useAPI } from "../../hooks/useAPI";
import useSnackbar from "../../hooks/useSnackbar";
import { BillInfoModal } from "./BillInfoModal";
import { ListItem } from "./ListItem";
import { useReactToPrint } from "react-to-print";
import Snackbar from "../../components/Snackbar";
import { Loader } from "../../components/Loader";

export default function Bills() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedBill, setBill] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const { isSnackbarVisible, showSnackbar, closeSnackbar } = useSnackbar();

  const pdfRef = useRef();
  useReactToPrint();

  const {
    data: billData,
    refetch: refetchBillData,
    isLoading: isLoadingBillData,
    error: billError,
  } = useAPI({ path: "BillManagement/Bill/GetList" });

  const {
    isSuccess: isSuccessEdit,
    makeRequest: editBillData,
    error: billUpdateError,
  } = useAPI({ path: "BillManagement/Bill/Update", method: "PUT" });

  const {
    isSuccess: isSuccessAdd,
    makeRequest: addBillData,
    error: billAddError,
  } = useAPI({ path: "BillManagement/Bill/Insert", method: "POST" });

  const {
    isSuccess: isSuccessRemoveData,
    makeRequest: removeBillData,
    error: billRemoveError,
  } = useAPI({ path: "BillManagement/Bill/Delete", method: "DELETE" });

  useEffect(() => {
    if (billAddError || billRemoveError || billUpdateError) {
      showSnackbar(true);
    }
  }, [
    billAddError,
    billRemoveError,
    billUpdateError,
    refetchBillData,
    showSnackbar,
  ]);

  useEffect(() => {
    if (isSuccessEdit || isSuccessAdd || isSuccessRemoveData) {
      handleOnCloseBillInfoModal();
      refetchBillData();
    }
  }, [isSuccessAdd, isSuccessEdit, refetchBillData, isSuccessRemoveData]);

  const handleOnPrint = useReactToPrint({
    content: () => pdfRef.current,
    documentTitle: "Bills",
  });

  if (billError) {
    return <p>{billError}</p>;
  }

  const error = billAddError || billError || billRemoveError || billUpdateError;

  const bills = billData?.map((billData) => ({
    id: billData?.billID,
    billNo: billData?.billNo,
    date: billData?.billDate,
    customerName: billData?.customerName,
    customerID: billData?.customerID,
    netAmount: billData?.netAmount,
    remarks: billData?.remarks,
  }));

  function handleOnEdit(bill) {
    setIsEditing(true);
    setBill(bill);
    setIsEditing(true);
    setOpenModal(true);
  }

  function handleOnAdd() {
    setOpenModal(true);
  }

  async function handleRemove(id) {
    removeBillData(null, null, `BillManagement/Bill/Delete/${id}`);
    refetchBillData();
  }

  function handleSubmit(payload) {
    if (isEditing) {
      editBillData(payload);
    } else {
      addBillData(payload);
    }
  }

  function handleOnCloseBillInfoModal() {
    setIsEditing(false);
    setBill(null);
    setOpenModal(false);
  }

  if (isLoadingBillData) {
    return <Loader />;
  } else {
    return (
      <>
        <ButtonGroup
          sx={{ display: "flex", justifyContent: "right", margin: "1rem 0" }}
        >
          <Button variant="contained" onClick={handleOnAdd} color="success">
            Add
          </Button>
          <Button color="info" variant="contained" onClick={handleOnPrint}>
            Print
          </Button>
        </ButtonGroup>
        <div ref={pdfRef} style={{ width: "100%" }}>
          <TableContainer component={Paper}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell>Sr No.</TableCell>
                  <TableCell align="right">Bill No.</TableCell>
                  <TableCell align="right">Bill Date</TableCell>
                  <TableCell align="right">Customer Name</TableCell>
                  <TableCell align="right">Net Amount</TableCell>
                  <TableCell align="right">Remarks</TableCell>
                  <TableCell align="right">Actions</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {bills.map((bill, index) => (
                  <ListItem
                    key={bill.id}
                    srNo={index + 1}
                    data={bill}
                    onEdit={handleOnEdit}
                    onRemove={() => handleRemove(bill.id)}
                  />
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        {openModal && (
          <BillInfoModal
            onClose={handleOnCloseBillInfoModal}
            billData={selectedBill}
            onSubmit={handleSubmit}
          />
        )}

        <Snackbar
          message={error}
          open={isSnackbarVisible}
          setOpen={showSnackbar}
          onClose={closeSnackbar}
        />
      </>
    );
  }
}
