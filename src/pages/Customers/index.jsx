import { useEffect, useState } from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import {
  Button,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";

import Snackbar from "../../components/Snackbar";
import useSnackbar from "../../hooks/useSnackbar";
import { Loader } from "../../components/Loader";
import { useAPI } from "../../hooks/useAPI";
import { CustomerInfoModal } from "./CustomerInfoModal";
import { ListItem } from "./ListItem";

export default function Customers() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCustomer, setCustomer] = useState(null);
  const { isSnackbarVisible, showSnackbar, closeSnackbar } = useSnackbar();

  const {
    data: customersData,
    refetch: refetchCustomersData,
    isLoading: isLoadingCustomersData,
    error: customersError,
  } = useAPI({ path: "CustomerManagement/Customer/GetList" });

  const {
    isSuccess: isSuccessEdit,
    makeRequest: editCustomerData,
    error: customerUpdateError,
  } = useAPI({ path: "CustomerManagement/Customer/Update", method: "PUT" });

  const {
    isSuccess: isSuccessAdd,
    makeRequest: addCustomerData,
    error: customerAddError,
  } = useAPI({ path: "CustomerManagement/Customer/Insert", method: "POST" });

  const {
    isSuccess: isSuccessRemoveData,
    makeRequest: removeCustomerData,
    error: customerRemoveError,
  } = useAPI({ path: "CustomerManagement/Customer/Delete", method: "DELETE" });

  useEffect(() => {
    if (customerAddError || customerRemoveError || customerUpdateError) {
      showSnackbar(true);
    }
  }, [
    customerAddError,
    customerRemoveError,
    customerUpdateError,
    refetchCustomersData,
    showSnackbar,
  ]);

  useEffect(() => {
    if (isSuccessEdit || isSuccessAdd || isSuccessRemoveData) {
      handleOnCloseCustomerInfoModal();
      refetchCustomersData();
    }
  }, [isSuccessEdit, isSuccessAdd, refetchCustomersData, isSuccessRemoveData]);

  if (isLoadingCustomersData) {
    return <Loader />;
  }

  if (customersError) {
    return <p>{customersError}</p>;
  }

  const customers = customersData.map((customerData) => ({
    id: customerData?.customerID,
    name: customerData?.customerName,
  }));

  const error =
    customersError ||
    customerAddError ||
    customerUpdateError ||
    customerRemoveError;

  function handleOnEdit(customer) {
    setCustomer(customer);
    setOpenModal(true);
  }

  function handleOnAdd() {
    setOpenModal(true);
  }

  async function handleRemove(id) {
    removeCustomerData(null, null, `${id}`);
    refetchCustomersData();
  }

  function handleSubmit(customerData) {
    if (customerData.id) {
      editCustomerData({
        customerID: customerData.id,
        customerName: customerData.name,
      });
    } else {
      addCustomerData({ customerName: customerData.name });
    }
  }

  function handleOnCloseCustomerInfoModal() {
    setCustomer(null);
    setOpenModal(false);
  }

  return (
    <>
      <div style={{ width: "100%", display: "flex", justifyContent: "end" }}>
        <Button
          style={{ margin: "1rem 0" }}
          variant="contained"
          onClick={handleOnAdd}
          color="success"
        >
          Add
        </Button>
      </div>
      <TableContainer component={Paper}>
        <Table sx={{ minWidth: 650 }}>
          <TableHead>
            <TableRow>
              <TableCell>Sr No.</TableCell>
              <TableCell align="right">Customer Name</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {customers.map((customer, index) => (
              <ListItem
                key={customer.id}
                srNo={index + 1}
                data={customer}
                onEdit={handleOnEdit}
                onRemove={handleRemove}
              />
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {openModal && (
        <CustomerInfoModal
          customerData={selectedCustomer}
          onSubmit={handleSubmit}
          onClose={handleOnCloseCustomerInfoModal}
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
