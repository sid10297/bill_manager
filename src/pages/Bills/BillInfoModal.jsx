/* eslint-disable react/prop-types */
import {
  Autocomplete,
  Grid,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import PropTypes from "prop-types";
import { useCallback, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { useAPI } from "../../hooks/useAPI";

import { formatDate } from "../../utils";
import axiosInstance from "../../apis";
import { style } from "./BillInfoStyle";
import { DynamicTable } from "./DynamicTable";

export function BillInfoModal({ onClose, billData, onSubmit }) {
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [rows, setRows] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const {
    // isLoading: customersLoading,
    // error: customersError,
    data: customers,
  } = useAPI({
    path: "CustomerManagement/Customer/GetLookupList",
  });

  const {
    // isLoading: billNumLoading,
    // error: billNumError,
    data: billNum,
  } = useAPI({
    path: "BillManagement/Bill/GenerateBillNo",
  });

  const fetchBills = useCallback(async () => {
    try {
      const res = await axiosInstance.get(
        `BillManagement/Bill/GetModel/${billData?.id}`
      );

      setRows(res.data.billItems);
    } catch (error) {
      console.log(error);
    }
  }, [billData?.id]);

  useEffect(() => {
    if (billData?.id) {
      fetchBills();
    }
  }, [billData?.id, fetchBills]);

  const handleAutocompleteChange = (event, value) => {
    setSelectedCustomer(value);
  };

  const getTotalAmount = () => {
    let total = 0;
    for (let item of rows) {
      total += item.rate * item.qty;
    }
    return total;
  };

  const getTotalDiscount = () => {
    let total = 0;
    for (let item of rows) {
      total += item.discAmt;
    }
    return total;
  };

  const handleSubmit = () => {
    const totalAmount = getTotalAmount();
    const totalDiscount = getTotalDiscount();
    const formattedDate = formatDate(selectedDate);
    const billItems = [];
    setRows((prevRows) => {
      return prevRows.map((row) => {
        const newRow = { ...row, amount: row.rate * row.qty };
        billItems.push({
          descr: newRow.descr,
          unit: newRow.unit,
          qty: newRow.qty,
          rate: newRow.rate,
          discAmt: newRow.discAmt,
          amount: newRow.amount,
        });
        return newRow;
      });
    });
    const payload = {
      billNo: billData?.billNo ? billData.billNo : billNum,
      billDate: formattedDate,
      customerID: selectedCustomer?.customerID
        ? selectedCustomer?.customerID
        : billData?.customerID,
      netAmount: totalAmount - totalDiscount,
      totalDiscountAmount: totalDiscount,
      Remarks: null,
      billItems,
    };

    if (billData?.id) {
      payload.billID = billData.id;
    }

    onSubmit(payload);
    onClose();
  };

  return (
    <Modal
      open
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Grid container gap={1}>
          <Grid item xs={5}>
            <InputLabel>Bill Number</InputLabel>
            <TextField
              disabled
              value={billData?.billNo ? billData.billNo : billNum}
            />
          </Grid>
          <Grid item xs={5} display="flex" alignItems="flex-end">
            <div>
              <InputLabel>Bill Date</InputLabel>
              <ReactDatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                placeholderText="Bill Date"
                className="date-picker"
              />
            </div>
          </Grid>
          <Grid item xs={12}>
            <Autocomplete
              disablePortal
              id="customer-list"
              defaultValue={
                billData?.customerID && {
                  customerID: billData.customerID,
                  customerName: billData.customerName,
                }
              }
              options={customers || []}
              sx={{ width: 300 }}
              onChange={handleAutocompleteChange}
              getOptionLabel={(option) => option.customerName}
              renderInput={(params) => (
                <TextField {...params} label="Select Customer" />
              )}
            />
          </Grid>
          <Grid item xs={12}>
            <DynamicTable rows={rows} setRows={setRows} />
          </Grid>
          <Grid container>
            <Grid item xs={6}>
              <InputLabel>Remarks</InputLabel>
              {/* <Editor /> */}
            </Grid>
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                flexGrow: "1",
                alignItems: "end",
              }}
            >
              <Box>
                <Typography>Total Amount: {getTotalAmount()}</Typography>
              </Box>
              <Box>
                <Typography>Discount: {getTotalDiscount()}</Typography>
              </Box>
              <Box>
                <Typography>
                  Net Amount: {getTotalAmount() - getTotalDiscount()}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Button onClick={handleSubmit} variant="contained">
                Save
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Modal>
  );
}

BillInfoModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
};
