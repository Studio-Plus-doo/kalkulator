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

const SavedKolicineSelection = ({ kolicineData, onRowClick }) => {
  // console.log(kolicineData);

  const [selectedRowIndex, setSelectedRowIndex] = useState(0);

  useEffect(() => {
    if (kolicineData && kolicineData.length > 0) {
      setSelectedRowIndex(0);
      onRowClick(kolicineData[0].redni_broj);
    }
  }, [kolicineData]); //prije bilo plan data

  const handleRowClickModified = (index) => {
    const selectedRow = kolicineData[index];
    if (!selectedRow || !selectedRow.redni_broj) {
      console.error("Selected row data is incomplete or missing:", selectedRow);
      // Optionally, handle this case with user feedback or a fallback state.
      return;
    }
    setSelectedRowIndex(index);
    onRowClick(selectedRow.redni_broj);
  };

  const renderPlanChangeIcon = (currentPlan, nextPlan) => {
    if (!nextPlan) return null;
    if (currentPlan.avgPlan > nextPlan.avgPlan) {
      return <NorthEastIcon sx={{ fontSize: 20 }} />;
    } else if (currentPlan.avgPlan < nextPlan.avgPlan) {
      return <SouthEastIcon sx={{ fontSize: 20 }} />;
    }
    return null;
  };

  const renderPUvozChangeIcon = (currentPlan, nextPlan) => {
    if (!nextPlan) return null;
    if (currentPlan.avgPlaniraniUvoz > nextPlan.avgPlaniraniUvoz) {
      return <NorthEastIcon sx={{ fontSize: 20 }} />;
    } else if (currentPlan.avgPlaniraniUvoz < nextPlan.avgPlaniraniUvoz) {
      return <SouthEastIcon sx={{ fontSize: 20 }} />;
    }
    return null;
  };

  const renderFCChangeIcon = (currentPlan, nextPlan) => {
    if (!nextPlan) return null;
    if (currentPlan.avgFakturnaCijena > nextPlan.avgFakturnaCijena) {
      return <NorthEastIcon sx={{ fontSize: 20 }} />;
    } else if (currentPlan.FakturnaCijena < nextPlan.FakturnaCijena) {
      return <SouthEastIcon sx={{ fontSize: 20 }} />;
    }
    return null;
  };

  const renderKoeChangeIcon = (currentPlan, nextPlan) => {
    if (!nextPlan) return null;
    if (currentPlan.avgKoeficijent > nextPlan.avgKoeficijent) {
      return <NorthEastIcon sx={{ fontSize: 20 }} />;
    } else if (currentPlan.avgKoeficijent < nextPlan.avgKoeficijent) {
      return <SouthEastIcon sx={{ fontSize: 20 }} />;
    }
    return null;
  };

  const renderMinBrChangeIcon = (currentPlan, nextPlan) => {
    if (!nextPlan) return null;
    if (currentPlan.avgMinBrojDanaZaliha > nextPlan.avgMinBrojDanaZaliha) {
      return <NorthEastIcon sx={{ fontSize: 20 }} />;
    } else if (
      currentPlan.avgMinBrojDanaZaliha < nextPlan.avgMinBrojDanaZaliha
    ) {
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
                Izmjena Plan
              </TableCell>
              <TableCell align="left" sx={{ color: "white" }}>
                Izmjena P.Uvoz
              </TableCell>
              <TableCell align="left" sx={{ color: "white" }}>
                Izmjena FC
              </TableCell>
              <TableCell align="left" sx={{ color: "white" }}>
                Izmjena Koe
              </TableCell>
              <TableCell align="left" sx={{ color: "white" }}>
                Izmjena Min br
              </TableCell>
              <TableCell align="left" sx={{ color: "white" }}>
                Datum i vrijeme
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {kolicineData.map((plan, index) => (
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
                <TableCell
                  align="left"
                  component="th"
                  scope="row"
                  sx={{ fontSize: "0.75rem" }}
                >
                  {plan.user_name}
                </TableCell>

                <TableCell align="center">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    Plan
                    {renderPlanChangeIcon(plan, kolicineData[index + 1])}
                  </Box>
                </TableCell>

                <TableCell align="center">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    P.Uvoz{renderPUvozChangeIcon(plan, kolicineData[index + 1])}
                  </Box>
                </TableCell>

                <TableCell align="center">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    FC
                    {renderFCChangeIcon(plan, kolicineData[index + 1])}
                  </Box>
                </TableCell>

                <TableCell align="center">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    Koe
                    {renderKoeChangeIcon(plan, kolicineData[index + 1])}
                  </Box>
                </TableCell>
                <TableCell align="center">
                  <Box
                    display="flex"
                    justifyContent="center"
                    alignItems="center"
                  >
                    Min br
                    {renderMinBrChangeIcon(plan, kolicineData[index + 1])}
                  </Box>
                </TableCell>

                <TableCell align="left" sx={{ fontSize: "0.55rem" }}>
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

export default SavedKolicineSelection;
