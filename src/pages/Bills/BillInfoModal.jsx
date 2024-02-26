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
import { BillingTable } from "./BillingTable";

export function BillInfoModal({ onClose, billData, onSubmit }) {
  const [billItems, setBillItems] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  const { data: customers } = useAPI({
    path: "CustomerManagement/Customer/GetLookupList",
  });

  const { data: billNum } = useAPI({
    path: "BillManagement/Bill/GenerateBillNo",
  });

  const fetchBills = useCallback(async () => {
    try {
      const res = await axiosInstance.get(
        `BillManagement/Bill/GetModel/${billData?.id}`
      );

      setBillItems(res.data.billItems);
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
    for (let item of billItems) {
      total += item.rate * item.qty;
    }
    return total;
  };

  const getTotalDiscount = () => {
    let total = 0;
    for (let item of billItems) {
      total += item.discAmt;
    }
    return total;
  };

  const handleSubmit = () => {
    const totalAmount = getTotalAmount();
    const totalDiscount = getTotalDiscount();
    const formattedDate = formatDate(selectedDate);
    const _customerID = selectedCustomer?.customerID || billData?.customerID;

    const billItemsWithAmount = billItems.map((row) => ({
      ...row,
      amount: row.rate * row.qty,
    }));

    setBillItems(billItemsWithAmount);

    const payload = {
      billNo: billData?.billNo ? billData.billNo : billNum,
      billDate: formattedDate,
      customerID: _customerID,
      netAmount: totalAmount - totalDiscount,
      totalDiscountAmount: totalDiscount,
      Remarks: null,
      billItems: billItemsWithAmount,
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
        <Grid container gap={2}>
          <Grid
            item
            py={2}
            display="flex"
            justifyContent="space-between"
            xs={12}
          >
            <InputLabel>{`Bill Number: #${
              billData?.billNo ? billData.billNo : billNum
            }`}</InputLabel>
            <Grid item ml={2}>
              <InputLabel>Bill Date</InputLabel>
              <ReactDatePicker
                selected={selectedDate}
                onChange={(date) => setSelectedDate(date)}
                placeholderText="Bill Date"
                className="date-picker"
              />
            </Grid>
          </Grid>

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

          <Grid item xs={12}>
            <BillingTable rows={billItems} setRows={setBillItems} />
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
                <Typography>Total Amount: &#8377;{getTotalAmount()}</Typography>
              </Box>
              <Box>
                <Typography>Discount: &#8377;{getTotalDiscount()}</Typography>
              </Box>
              <Box>
                <Typography>
                  Net Amount: &#8377;{getTotalAmount() - getTotalDiscount()}
                </Typography>
              </Box>
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Box display="flex" justifyContent="flex-end">
              <Button
                disabled={
                  !(selectedCustomer?.customerID || billData?.customerID) ||
                  billItems.length <= 0
                }
                onClick={handleSubmit}
                variant="contained"
              >
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
