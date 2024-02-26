import { Button } from "@mui/material";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useEffect, useState } from "react";

import { useAPI } from "../../hooks/useAPI";
import { ListItem } from "./ListItem";
import useSnackbar from "../../hooks/useSnackbar";
import Snackbar from "../../components/Snackbar";
import { CustomerInfoModal } from "./CustomerInfoModal";
import { Loader } from "../../components/Loader";

export default function Customers() {
  const [openModal, setOpenModal] = useState(false);
  const [selectedCustomer, setCustomer] = useState(null);
  const { openSnackbar, setOpenSnackbar, handleSnackbarClose } = useSnackbar();

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
      setOpenSnackbar(true);
    }
  }, [
    customerAddError,
    customerRemoveError,
    customerUpdateError,
    refetchCustomersData,
    setOpenSnackbar,
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
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
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
          onClose={handleOnCloseCustomerInfoModal}
          customerData={selectedCustomer}
          onSubmit={handleSubmit}
        />
      )}

      <Snackbar
        message={
          customerAddError
            ? customerAddError?.response.data
            : customerRemoveError
            ? customerRemoveError?.response.data
            : customerUpdateError?.response.data
        }
        open={openSnackbar}
        setOpen={setOpenSnackbar}
        onClose={handleSnackbarClose}
      />
    </>
  );
}
