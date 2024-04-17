import React, { useEffect, useState } from "react";
import TableContainer from "@mui/material/TableContainer";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import SouthEastIcon from "@mui/icons-material/SouthEast";
import Box from "@mui/material/Box";
import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Paper,
} from "@mui/material";

const SavedPlanSelection = ({ planData, onRowClick }) => {
  const [selectedRowIndex, setSelectedRowIndex] = useState(0);

  useEffect(() => {
    if (planData && planData.length > 0) {
      setSelectedRowIndex(0); // Selects the first plan which is the latest
      onRowClick(planData[0].redni_broj);
    }
  }, [planData]); //prije bilo plan data

  const handleRowClickModified = (index) => {
    const selectedRow = planData[index];
    if (selectedRow) {
      setSelectedRowIndex(index);
      onRowClick(selectedRow.redni_broj);
    }
  };

  const renderPNCChangeIcon = (currentPlan, nextPlan) => {
    if (!nextPlan) return null;
    if (currentPlan.avgPNC > nextPlan.avgPNC) {
      return <NorthEastIcon sx={{ fontSize: 20 }} />;
    } else if (currentPlan.avgPNC < nextPlan.avgPNC) {
      return <SouthEastIcon sx={{ fontSize: 20 }} />;
    }
    return null;
  };

  const renderVPCChangeIcon = (currentPlan, nextPlan) => {
    if (!nextPlan) return null;
    if (currentPlan.avgVPC > nextPlan.avgVPC) {
      return <NorthEastIcon sx={{ fontSize: 20 }} />;
    } else if (currentPlan.avgVPC < nextPlan.avgVPC) {
      return <SouthEastIcon sx={{ fontSize: 20 }} />;
    }
    return null;
  };

  return (
    <div>
      <TableContainer
        component={Paper}
        sx={{
          "& .MuiTableRow-root": {
            height: 32,
          },
          "& .MuiTableCell-root": {
            padding: "4px 16px",
            borderBottom: "2px solid #0c1520",
          },
          borderRadius: 0,
          maxHeight: 150,
          overflow: "auto",
          "&::-webkit-scrollbar": {
            width: "10px",
          },
          "&::-webkit-scrollbar-track": {
            boxShadow: "inset 0 0 5px grey",
            borderRadius: "0px",
          },
          "&::-webkit-scrollbar-thumb": {
            background: "#142131",
            borderRadius: "0px",
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "#555",
          },
        }}
      >
        <Table sx={{ minWidth: 650 }} aria-label="simple table">
          <TableHead sx={{ backgroundColor: "#142131" }}>
            <TableRow>
              <TableCell align="left" sx={{ color: "white" }}>
                Redni broj:
              </TableCell>
              <TableCell align="left" sx={{ color: "white" }}>
                Ime i prezime:
              </TableCell>
              <TableCell align="left" sx={{ color: "white" }}>
                Izmjena PNC
              </TableCell>
              <TableCell align="left" sx={{ color: "white" }}>
                Izmjena VPC
              </TableCell>
              <TableCell align="left" sx={{ color: "white" }}>
                Datum i vrijeme
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {planData.map((plan, index) => (
              <TableRow
                key={index}
                sx={{
                  cursor: "pointer",
                  backgroundColor:
                    selectedRowIndex === index ? "#f9e8c9" : "#98abee",
                  "&:hover": { backgroundColor: "#f9e8c9" },
                }}
                onClick={() => handleRowClickModified(index)}
              >
                <TableCell align="left">{plan.redni_broj}</TableCell>
                <TableCell align="left" component="th" scope="row">
                  {plan.user_name}
                </TableCell>

                <TableCell align="center">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    PNC
                    {renderPNCChangeIcon(plan, planData[index + 1])}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    VPC
                    {renderVPCChangeIcon(plan, planData[index + 1])}
                  </Box>
                </TableCell>
                <TableCell align="left">
                  {new Date(plan.created_at).toLocaleDateString()} {plan.time} h
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SavedPlanSelection;
