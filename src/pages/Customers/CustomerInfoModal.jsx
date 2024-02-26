import { InputLabel, TextField } from "@mui/material";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import { useRef } from "react";
import PropTypes from "prop-types";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  boxShadow: 24,
  p: 4,
  borderRadius: 5,
};

export function CustomerInfoModal({ onClose, customerData, onSubmit }) {
  const customerName = useRef(customerData?.name || "");

  const handleSubmit = () => {
    onSubmit({ ...customerData, name: customerName.current });
  };

  const handleOnChange = (event) => {
    const newValue = event.target.value;
    customerName.current = newValue;
  };

  return (
    <Modal
      open
      onClose={onClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <div>
          <InputLabel htmlFor="customer-name">Customer Name</InputLabel>
          <TextField
            id="customer-name"
            placeholder="Enter customer name"
            defaultValue={customerName.current}
            onChange={handleOnChange}
            fullWidth
          />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            margin: "1rem 0",
          }}
        >
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </div>
      </Box>
    </Modal>
  );
}

CustomerInfoModal.propTypes = {
  onClose: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  customerData: PropTypes.shape({
    name: PropTypes.string,
  }),
};
