import React, { useState, useContext } from "react";
import Box from "@mui/material/Box";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { InputLabel } from "@mui/material";
import { TableContext } from "../contexts/TableContext";

export default function BasicSelect() {
  const { setSelectedTable } = useContext(TableContext);
  const [table, setTable] = useState(2);

  const handleChange = (event) => {
    setTable(event.target.value);
    setSelectedTable(event.target.value);
  };

  return (
    <Box sx={{ minWidth: 120 }}>
      <FormControl fullWidth>
        <InputLabel
          id="demo-simple-select-label"
          sx={{ color: "white !important" }}
        >
          Odaberite
        </InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={table}
          onChange={handleChange}
          sx={{
            color: "white",
            backgroundColor: "#1976d2",
            "&:hover": {
              backgroundColor: "#1976d2",
            },
            hover: {
              backgroundColor: "#142131",
            },
          }}
        >
          <MenuItem value={1} disabled={table === 1}>
            Planiranje nabavke i prodaje
          </MenuItem>
          <MenuItem value={2} disabled={table === 2}>
            Planiranje prometa
          </MenuItem>
          <MenuItem value={3} disabled={table === 3}>
            Planiranje bruto marže
          </MenuItem>
          <MenuItem value={4} disabled={table === 4}>
            Planiranje gratisa
          </MenuItem>
          <MenuItem value={5} disabled={table === 5}>
            Koeficijent
          </MenuItem>
        </Select>
      </FormControl>
    </Box>
  );
}
