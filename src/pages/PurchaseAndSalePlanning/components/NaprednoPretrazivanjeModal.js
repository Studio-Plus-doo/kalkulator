import React, { useState } from "react";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";

import dayjs from "dayjs";
import "dayjs/locale/hr"; // Ensure this import is here
import { DemoContainer, DemoItem } from "@mui/x-date-pickers/internals/demo";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { MobileDatePicker } from "@mui/x-date-pickers/MobileDatePicker";
import { DesktopDatePicker } from "@mui/x-date-pickers/DesktopDatePicker";
import { StaticDatePicker } from "@mui/x-date-pickers/StaticDatePicker";
import CloseIcon from "@mui/icons-material/Close";
import TextField from "@mui/material/TextField";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import Checkbox from "@mui/material/Checkbox";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

dayjs.locale("hr");
const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "90%",
  bgcolor: "#142131",
  //   border: "3px solid #DFD0B8",
  borderRadius: "5px",
  boxShadow: 24,
  pt: 2,
  px: 4,
  pb: 3,
};

const textStyle = {
  color: "white",
};

const divStyle = {
  padding: "0.25%",
  backgroundColor: "#303c4b",
  borderRadius: "5px",
};

const darkTheme = createTheme({
  palette: {
    mode: "dark", // Enables dark mode
    background: {
      default: "#333", // Dark background color
      paper: "#424242", // Dark paper color
    },
    text: {
      primary: "#fff", // White text color
      secondary: "#ccc", // Light grey for secondary text
    },
  },
});

function NaprednoPretrazivanjeModal() {
  const [open, setOpen] = useState(false);

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  return (
    <div>
      <Button variant="contained" color="success" onClick={handleOpen}>
        Napredno pretraživanje
      </Button>
      <Modal open={open} onClose={handleClose}>
        <Box sx={style}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <h3 style={textStyle}>NAPREDNO PRETRAŽIVANJE</h3>
            <CloseIcon
              onClick={handleClose}
              fontSize="large"
              sx={{ color: "white", cursor: "pointer" }}
            />
          </div>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {/* VREMENSKI PERIOD */}
            <div style={divStyle}>
              <h3 style={textStyle}>Vremenski period</h3>
              <div>
                <ThemeProvider theme={darkTheme}>
                  <LocalizationProvider dateAdapter={AdapterDayjs}>
                    <DemoContainer
                      components={[
                        "DatePicker",
                        "MobileDatePicker",
                        "DesktopDatePicker",
                        "StaticDatePicker",
                      ]}
                      sx={{
                        color: "white",
                      }}
                    >
                      <DemoItem label="Desktop variant">
                        <DesktopDatePicker
                          defaultValue={dayjs()}
                          minDate={dayjs("2021-01-01")}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </DemoItem>
                      <DemoItem label="Desktop variant">
                        <DesktopDatePicker
                          defaultValue={dayjs()}
                          minDate={dayjs("2021-01-01")}
                          renderInput={(params) => <TextField {...params} />}
                        />
                      </DemoItem>
                    </DemoContainer>
                  </LocalizationProvider>
                </ThemeProvider>
              </div>
            </div>

            {/* TVRTKA */}
            <div style={divStyle}>
              <h3 style={textStyle}>Tvrtka</h3>
              <div style={{ paddingBottom: "10%" }}>
                <FormGroup>
                  <FormControlLabel
                    style={textStyle}
                    control={<Checkbox defaultChecked />}
                    label="Sve tvrtke"
                    sx={{
                      "& .MuiFormControlLabel-label": {
                        fontWeight: "bold",
                      },
                    }}
                  />
                </FormGroup>
              </div>
              <div>
                <FormGroup>
                  <FormControlLabel
                    style={textStyle}
                    control={<Checkbox defaultChecked />}
                    label="G3 Spirits d.o.o."
                  />
                </FormGroup>
                <FormGroup>
                  <FormControlLabel
                    style={textStyle}
                    control={<Checkbox defaultChecked />}
                    label="Studio Plus d.o.o."
                  />
                </FormGroup>
                <FormGroup>
                  <FormControlLabel
                    style={textStyle}
                    control={<Checkbox defaultChecked />}
                    label="Studio Plus d.o.o. Banjaluka"
                  />
                </FormGroup>
              </div>
            </div>

            {/* NADGRUPA */}
            <div style={divStyle}>
              <h3 style={textStyle}>Nadgrupa</h3>
              <div style={{ paddingBottom: "10%" }}>
                <TextField
                  id="outlined-basic"
                  label="Nadgrupa"
                  variant="outlined"
                  sx={{
                    "& label.Mui-focused": {
                      color: "white", // Color of the label when the TextField is focused
                    },
                    "& label": {
                      color: "white", // Color of the label
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white", // Color of the border
                      },
                      "&:hover fieldset": {
                        borderColor: "white", // Color of the border on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white", // Color of the border when focused
                      },
                      color: "white", // Color of the input text
                    },
                    "& input": {
                      color: "white", // Color of the input text
                    },
                  }}
                />

                <FormGroup>
                  <FormControlLabel
                    style={textStyle}
                    control={<Checkbox defaultChecked />}
                    label="Sve nadgrupe"
                    sx={{
                      paddingTop: "10%",
                      "& .MuiFormControlLabel-label": {
                        fontWeight: "bold",
                      },
                    }}
                  />
                </FormGroup>
              </div>
              <div style={divStyle}>
                <FormGroup>
                  <FormControlLabel
                    style={textStyle}
                    control={<Checkbox defaultChecked />}
                    label="Jagermeister"
                  />
                </FormGroup>
                <FormGroup>
                  <FormControlLabel
                    style={textStyle}
                    control={<Checkbox defaultChecked />}
                    label="Hendrick's"
                  />
                </FormGroup>
                <FormGroup>
                  <FormControlLabel
                    style={textStyle}
                    control={<Checkbox defaultChecked />}
                    label="Brown Forman"
                  />
                </FormGroup>
              </div>
            </div>

            {/* BRAND MANAGER */}
            <div style={divStyle}>
              <h3 style={textStyle}>Brand manager</h3>
              <div style={{ paddingBottom: "10%" }}>
                <TextField
                  id="outlined-basic"
                  label="Brand manager"
                  variant="outlined"
                  sx={{
                    "& label.Mui-focused": {
                      color: "white", // Color of the label when the TextField is focused
                    },
                    "& label": {
                      color: "white", // Color of the label
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white", // Color of the border
                      },
                      "&:hover fieldset": {
                        borderColor: "white", // Color of the border on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white", // Color of the border when focused
                      },
                      color: "white", // Color of the input text
                    },
                    "& input": {
                      color: "white", // Color of the input text
                    },
                  }}
                />

                <FormGroup>
                  <FormControlLabel
                    style={textStyle}
                    control={<Checkbox defaultChecked />}
                    label="Svi brand manageri"
                    sx={{
                      paddingTop: "10%",
                      "& .MuiFormControlLabel-label": {
                        fontWeight: "bold",
                      },
                    }}
                  />
                </FormGroup>
              </div>
              <div style={divStyle}>
                <FormGroup>
                  <FormControlLabel
                    style={textStyle}
                    control={<Checkbox defaultChecked />}
                    label="Oliver Krešić"
                  />
                </FormGroup>
                <FormGroup>
                  <FormControlLabel
                    style={textStyle}
                    control={<Checkbox defaultChecked />}
                    label="Anamarija Lovrić"
                  />
                </FormGroup>
                <FormGroup>
                  <FormControlLabel
                    style={textStyle}
                    control={<Checkbox defaultChecked />}
                    label="Marija Primorac"
                  />
                </FormGroup>
              </div>
            </div>

            {/* GRUPA */}
            <div style={divStyle}>
              <h3 style={textStyle}>Grupa</h3>
              <div style={{ paddingBottom: "10%" }}>
                <TextField
                  id="outlined-basic"
                  label="Grupa"
                  variant="outlined"
                  sx={{
                    "& label.Mui-focused": {
                      color: "white", // Color of the label when the TextField is focused
                    },
                    "& label": {
                      color: "white", // Color of the label
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white", // Color of the border
                      },
                      "&:hover fieldset": {
                        borderColor: "white", // Color of the border on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white", // Color of the border when focused
                      },
                      color: "white", // Color of the input text
                    },
                    "& input": {
                      color: "white", // Color of the input text
                    },
                  }}
                />

                <FormGroup>
                  <FormControlLabel
                    style={textStyle}
                    control={<Checkbox defaultChecked />}
                    label="Sve grupe"
                    sx={{
                      paddingTop: "10%",
                      "& .MuiFormControlLabel-label": {
                        fontWeight: "bold",
                      },
                    }}
                  />
                </FormGroup>
              </div>
              <div style={divStyle}>
                <FormGroup>
                  <FormControlLabel
                    style={textStyle}
                    control={<Checkbox defaultChecked />}
                    label="Liker"
                  />
                </FormGroup>
                <FormGroup>
                  <FormControlLabel
                    style={textStyle}
                    control={<Checkbox defaultChecked />}
                    label="Gin"
                  />
                </FormGroup>
                <FormGroup>
                  <FormControlLabel
                    style={textStyle}
                    control={<Checkbox defaultChecked />}
                    label="Whiskey"
                  />
                </FormGroup>
              </div>
            </div>

            {/* ARTIKAL */}
            <div style={divStyle}>
              <h3 style={textStyle}>Artikal</h3>
              <div style={{ paddingBottom: "10%" }}>
                <TextField
                  id="outlined-basic"
                  label="Artikal"
                  variant="outlined"
                  sx={{
                    "& label.Mui-focused": {
                      color: "white", // Color of the label when the TextField is focused
                    },
                    "& label": {
                      color: "white", // Color of the label
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white", // Color of the border
                      },
                      "&:hover fieldset": {
                        borderColor: "white", // Color of the border on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white", // Color of the border when focused
                      },
                      color: "white", // Color of the input text
                    },
                    "& input": {
                      color: "white", // Color of the input text
                    },
                  }}
                />

                <FormGroup>
                  <FormControlLabel
                    style={textStyle}
                    control={<Checkbox defaultChecked />}
                    label="Svi artikli"
                    sx={{
                      paddingTop: "10%",
                      "& .MuiFormControlLabel-label": {
                        fontWeight: "bold",
                      },
                    }}
                  />
                </FormGroup>
              </div>
              <div style={divStyle}>
                <FormGroup>
                  <FormControlLabel
                    style={textStyle}
                    control={<Checkbox defaultChecked />}
                    label="Jagermeister Manifest 0.5"
                  />
                </FormGroup>
                <FormGroup>
                  <FormControlLabel
                    style={textStyle}
                    control={<Checkbox defaultChecked />}
                    label="Jagermeister 0.5"
                  />
                </FormGroup>
                <FormGroup>
                  <FormControlLabel
                    style={textStyle}
                    control={<Checkbox defaultChecked />}
                    label="Hendricks GIN 0.5"
                  />
                </FormGroup>
              </div>
            </div>

            {/* SIFRA ARTIKLA */}
            <div style={divStyle}>
              <h3 style={textStyle}>Šifra artikla</h3>
              <div style={{ paddingBottom: "10%" }}>
                <TextField
                  id="outlined-basic"
                  label="Šifra artikla"
                  variant="outlined"
                  sx={{
                    "& label.Mui-focused": {
                      color: "white", // Color of the label when the TextField is focused
                    },
                    "& label": {
                      color: "white", // Color of the label
                    },
                    "& .MuiOutlinedInput-root": {
                      "& fieldset": {
                        borderColor: "white", // Color of the border
                      },
                      "&:hover fieldset": {
                        borderColor: "white", // Color of the border on hover
                      },
                      "&.Mui-focused fieldset": {
                        borderColor: "white", // Color of the border when focused
                      },
                      color: "white", // Color of the input text
                    },
                    "& input": {
                      color: "white", // Color of the input text
                    },
                  }}
                />
              </div>
            </div>
          </div>
          <div
            style={{
              marginTop: "0.5%",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Button variant="contained">Očisti filtere</Button>
            <Button variant="contained" style={{ backgroundColor: "#2b3e36" }}>
              Pretraži
            </Button>
          </div>
        </Box>
      </Modal>
    </div>
  );
}

export default NaprednoPretrazivanjeModal;
