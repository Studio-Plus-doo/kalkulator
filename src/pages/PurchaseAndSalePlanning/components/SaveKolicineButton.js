import React, { useState } from "react";
import Button from "@mui/material/Button";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

const modalStyle = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};

const SaveKolicineButton = ({ onSave, disabled }) => {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleConfirmSave = () => {
    onSave();
    handleClose();
  };

  return (
    <div>
      {/* Use the ternary operator to dynamically set the variant and color based on the disabled state */}
      <Button
        variant={disabled ? "outlined" : "contained"}
        onClick={handleOpen}
        disabled={disabled}
        sx={{
          color: disabled ? "black" : "white",
          backgroundColor: disabled ? "white" : "",
          borderColor: disabled ? "black" : "",
          "&:hover": {
            backgroundColor: disabled ? "white" : "",
            borderColor: disabled ? "black" : "",
          },
        }}
      >
        SPREMI KOLIČINE
      </Button>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="save-plan-modal-title"
        aria-describedby="save-plan-modal-description"
      >
        <Box sx={modalStyle}>
          <Typography
            id="save-plan-modal-title"
            variant="h6"
            component="h2"
            sx={{ color: "#313638" }}
          >
            Jeste li sigurni da želite spremiti ove količine?
          </Typography>
          <Box sx={{ display: "flex", justifyContent: "space-around", mt: 3 }}>
            <Button
              variant="outlined"
              color="error"
              onClick={handleClose}
              sx={{ width: "150px" }}
            >
              ne
            </Button>
            <Button
              variant="contained"
              color="success"
              onClick={handleConfirmSave}
              sx={{ width: "150px" }}
            >
              da
            </Button>
          </Box>
        </Box>
      </Modal>
    </div>
  );
};

export default SaveKolicineButton;
