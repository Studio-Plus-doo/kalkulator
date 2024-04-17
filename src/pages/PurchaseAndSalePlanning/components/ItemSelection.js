import React, { useContext, useState, useEffect } from "react";
import { Button } from "@mui/material";

import PlaniranjePrometa from "./PlaniranjePrometa";
import { TableContext } from "../contexts/TableContext";
import SavedPlanSelection from "./SavedPlanSelection";
import TableContainer from "@mui/material/TableContainer";

import {
  Table,
  TableHead,
  TableRow,
  TableCell,
  TextField,
  TableBody,
  Paper,
  Typography,
} from "@mui/material";

import CircularProgress from "@mui/material/CircularProgress";

function ItemSelection({ selectedYear }) {
  const { selectedTable } = useContext(TableContext);
  const [selectedRowIndex, setSelectedRowIndex] = useState(null);
  const [selectedRowData, setSelectedRowData] = useState(null);
  const [lastSelectedRowSifraRobe, setLastSelectedRowSifraRobe] =
    useState(null);
  const [data, setData] = useState([]);
  const [searchTermSifra, setSearchTermSifra] = useState("");
  const [searchTermNaziv, setSearchTermNaziv] = useState("");
  const [searchTermGrupa, setSearchTermGrupa] = useState("");
  const [searchTermNazivGrupa, setSearchTermNazivGrupa] = useState("");

  const [isLoading, setIsLoading] = useState(false);
  const [planData, setPlanData] = useState([]);
  const [inputSifra, setInputSifra] = useState("");
  const [inputNaziv, setInputNaziv] = useState("");
  const [inputGrupa, setInputGrupa] = useState("");
  const [inputNazivGrupe, setInputNazivGrupe] = useState("");

  const rowStyle = (index) => ({
    borderBottom: "3px solid black",
    backgroundColor: selectedRowIndex === index ? "#F9E8C9" : "#98ABEE",
    cursor: "pointer",
    fontWeight: selectedRowIndex === index ? "bold" : "normal",
    "&:hover": {
      backgroundColor: "#F9E8C9",
    },
    "& > *": { width: "25%" },
  });

  useEffect(() => {
    const fetchData = async () => {
      // Check if the token exists
      const token = localStorage.getItem("userToken");
      if (!token) {
        // Redirect to login page or show a login modal
        console.error("No token found, redirecting to login.");
        // Redirect logic here, e.g., history.push('/login') with react-router
        return;
      }

      try {
        const initialDataURL =
          "https://apis.moda.ba/ERP-API/public/api/artikli";
        const response = await fetch(initialDataURL, {
          headers: {
            Authorization: `Bearer ${token}`, // Use the token
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const responseData = await response.json();
        if (responseData && Array.isArray(responseData.data)) {
          setData(responseData.data);
        } else {
          console.error(
            "Received data is not in the expected format:",
            responseData
          );
        }
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchData();
  }, []); // Dependency array remains the same

  // useEffect to re-fetch row data when selectedYear changes, if a row is selected
  useEffect(() => {
    if (lastSelectedRowSifraRobe !== null) {
      handleRowClick(selectedRowIndex, { sifraRobe: lastSelectedRowSifraRobe });
    }
  }, [selectedYear]); // Dependency array includes selectedYear

  const handleRowClick = async (index, rowData) => {
    console.log("ROWDATA je: ", rowData);
    setIsLoading(true);
    setSelectedRowIndex(index);
    setSelectedRowData(null); // Reset the detailed data for the new selection
    setPlanData([]); // Clear previously loaded plan data for the new selection
    setLastSelectedRowSifraRobe(rowData.sifraRobe);

    // Set input fields and search terms with clicked row's data to immediately trigger the filtering
    const sifra = rowData.sifraRobe;
    const naziv = rowData.nazivRobe;
    const grupa = rowData.sifraGrupe;
    const nazivGrupe = rowData.nazivGrupe;

    setInputSifra(sifra);
    setInputNaziv(naziv);
    setInputGrupa(grupa);
    setInputNazivGrupe(nazivGrupe);

    setSearchTermSifra(sifra);
    setSearchTermNaziv(naziv);
    setSearchTermGrupa(grupa);
    setSearchTermNazivGrupa(nazivGrupe);

    console.log("Šifra robe clicked:", rowData.sifraRobe);
    const urlBase = "https://apis.moda.ba/ERP-API/public/api/artikli";
    const token = localStorage.getItem("userToken");

    const planUrl = `https://apis.moda.ba/ERP-API/public/api/plan/${rowData.sifraRobe}/${selectedYear}`;

    // First, fetch the plan data
    try {
      const planResponse = await fetch(planUrl, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!planResponse.ok) {
        throw new Error(`HTTP error! status: ${planResponse.status}`);
      }

      const planData = await planResponse.json();
      console.log("Spremljeni plan:", planData);
      setPlanData(planData.data);
    } catch (error) {
      console.error(`Error fetching plan data: ${error.message}`);
    }

    const fetchWithRetry = async (month, retries = 3) => {
      const url = `${urlBase}/${rowData.sifraRobe}/${selectedYear}/${month}`;
      try {
        const response = await fetch(url, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      } catch (error) {
        if (retries > 0) {
          console.error(
            `Retry fetch for month ${month}: ${error.message}, attempts left: ${retries}`
          );
          return fetchWithRetry(month, retries - 1);
        } else {
          console.error(
            `Failed to fetch for month ${month} after multiple retries.`
          );
          return {
            error: `Fetch failed for month ${month} after retries`,
            data: null,
          };
        }
      }
    };

    const promises = [];
    for (let month = 1; month <= 12; month++) {
      promises.push(fetchWithRetry(month));
    }

    try {
      const monthlyData = await Promise.all(promises);
      const formattedData = monthlyData.map((data) =>
        data.data ? data.data : {}
      );

      const combinedData = {
        rowDetails: rowData,
        monthlyData: formattedData,
      };

      setSelectedRowData(combinedData);
    } catch (error) {
      console.error("Error processing fetched data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetInputs = () => {
    // Reset input fields
    setInputSifra("");
    setInputNaziv("");
    setInputGrupa("");
    setInputNazivGrupe("");

    // Reset search terms to clear the filter
    setSearchTermSifra("");
    setSearchTermNaziv("");
    setSearchTermGrupa("");
    setSearchTermNazivGrupa("");

    setSelectedRowData(null); // Reset the detailed data for the new selection
    setPlanData([]); // Clear previously loaded plan data for the new selection
  };

  // Simplified for clarity - fetching initial data
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true); // Start loading
      try {
        // Your fetch logic here...
      } catch (error) {
        console.error("Error:", error);
      } finally {
        setIsLoading(false); // End loading
      }
    };
    fetchData();
  }, []);

  // Update input change handlers to set both input values and search terms
  const handleInputChange = (setInputFunc, setSearchTermFunc) => (e) => {
    const value = e.target.value;
    setInputFunc(value);
    setSearchTermFunc(value); // Update search term on input change to trigger filtering
  };

  const handlePlanSelection = async (redniBroj) => {
    setIsLoading(true); // Indicate the start of data loading

    const token = localStorage.getItem("userToken");
    if (!token) {
      console.error("No token found, redirecting to login.");
      setIsLoading(false); // Make sure to stop the loading indicator on early return
      return;
    }

    const sifraRobe = selectedRowData?.rowDetails?.sifraRobe;

    if (!sifraRobe) {
      // console.error("Sifra Robe is not available.");
      setIsLoading(false); // Make sure to stop the loading indicator on early return
      return;
    }

    const updatedMonthlyData = [...selectedRowData.monthlyData]; // Clone the current monthlyData array

    // Prepare fetch promises for all months
    const fetchPromises = Array.from({ length: 12 }, (_, i) => {
      const month = i + 1;
      const formattedMonth = month.toString().padStart(2, "0");
      const url = `https://apis.moda.ba/ERP-API/public/api/plan/${sifraRobe}/${selectedYear}/${formattedMonth}/${redniBroj}`;

      return fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error(
              `Network response was not ok for month ${formattedMonth}.`
            );
          }
          return response.json();
        })
        .then((planDetailsData) => {
          updatedMonthlyData[i] = planDetailsData.data; // Adjust the index for 0-based array
        })
        .catch((error) => {
          console.error(
            `Error fetching plan details for month ${formattedMonth}: `,
            error
          );
        });
    });

    // Execute all fetch requests in parallel
    try {
      await Promise.all(fetchPromises);
    } catch (error) {
      console.error("Error fetching plan details:", error);
    } finally {
      // Update the selectedRowData state with the new monthly data
      setSelectedRowData((prevState) => ({
        ...prevState, // Copy all other properties of the selectedRowData
        monthlyData: updatedMonthlyData, // Update the monthlyData with the new details
      }));

      setIsLoading(false); // Indicate the end of data loading
    }
  };

  const reloadSavedPlans = async () => {
    setIsLoading(true);
    try {
      // Assuming sifraRobe is available from selectedRowData, and you're interested in reloading plans for the entire year
      const sifraRobe = selectedRowData?.rowDetails?.sifraRobe;
      if (!sifraRobe) {
        console.error("Sifra Robe is not available for reloading plans.");
        setIsLoading(false);
        return;
      }

      // Here you would adjust the API endpoint as necessary. Assuming you're fetching an overview or aggregated data for the year
      const url = `https://apis.moda.ba/ERP-API/public/api/plan/${sifraRobe}/${selectedYear}`;
      const token = localStorage.getItem("userToken");

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) throw new Error("Failed to fetch saved plans.");
      const planData = await response.json();
      setPlanData(planData.data || []);
    } catch (error) {
      console.error("Error fetching saved plans:", error);
    } finally {
      setIsLoading(false);
    }
  };

  //KRAJ

  const filteredData = data.filter(
    (row) =>
      (row.sifraRobe?.toLowerCase() || "").includes(
        searchTermSifra.toLowerCase()
      ) &&
      (row.nazivRobe?.toLowerCase() || "").includes(
        searchTermNaziv.toLowerCase()
      ) &&
      (row.nazivGrupe?.toLowerCase() || "").includes(
        searchTermNazivGrupa.toLowerCase()
      ) &&
      (row.sifraGrupe?.toLowerCase() || "").includes(
        searchTermGrupa.toLowerCase()
      )
  );

  return (
    <div>
      <div style={{ marginTop: "1%", marginLeft: "1%", display: "flex" }}>
        <div>
          <TableContainer style={{ width: "100%" }}>
            <Table sx={{ minWidth: 650 }} aria-label="simple table">
              <TableHead
                style={{
                  backgroundColor: "#0c1520",
                }}
              >
                <TableRow>
                  <TableCell style={{ width: "15%" }}>
                    <TextField
                      label="Šifra robe"
                      focused
                      fullWidth
                      variant="outlined"
                      size="small"
                      placeholder="Pretražite po Šifri robe"
                      value={inputSifra} // Bind state value
                      onChange={handleInputChange(
                        setInputSifra,
                        setSearchTermSifra
                      )}
                      InputLabelProps={{
                        style: { color: "white" },
                      }}
                      InputProps={{
                        sx: {
                          color: "white",
                          backgroundColor: "#0c1520",
                          "&::placeholder": {
                            color: "white",
                          },
                          "label + &": {
                            color: "white",
                          },
                        },
                      }}
                    />
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      style={{ color: "white" }}
                    >
                      {/* Šifra robe */}
                    </Typography>
                  </TableCell>

                  <TableCell style={{ width: "40%" }}>
                    <TextField
                      label="Naziv robe"
                      focused
                      fullWidth
                      variant="outlined"
                      size="small"
                      placeholder="Pretražite po Nazivu robe"
                      value={inputNaziv} // Bind state value
                      onChange={handleInputChange(
                        setInputNaziv,
                        setSearchTermNaziv
                      )}
                      InputLabelProps={{
                        style: { color: "white" },
                      }}
                      InputProps={{
                        sx: {
                          color: "white",
                          backgroundColor: "#0c1520",
                          "&::placeholder": {
                            color: "white",
                          },
                          "label + &": {
                            color: "white",
                          },
                        },
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    <TextField
                      label="Grupa"
                      focused
                      fullWidth
                      variant="outlined"
                      size="small"
                      placeholder="Pretražite po Grupi"
                      value={inputNazivGrupe} // Bind state value
                      onChange={handleInputChange(
                        setInputNazivGrupe,
                        setSearchTermNazivGrupa
                      )}
                      InputLabelProps={{
                        style: { color: "white" },
                      }}
                      InputProps={{
                        sx: {
                          color: "white",
                          backgroundColor: "#0c1520",
                          "&::placeholder": {
                            color: "white",
                          },
                          "label + &": {
                            color: "white",
                          },
                        },
                      }}
                    />{" "}
                  </TableCell>

                  <TableCell>
                    {" "}
                    <TextField
                      label="Nadgrupa"
                      focused
                      fullWidth
                      variant="outlined"
                      size="small"
                      placeholder="Pretražite po nadgrupi"
                      value={inputGrupa} // Bind state value
                      onChange={handleInputChange(
                        setInputGrupa,
                        setSearchTermGrupa
                      )}
                      InputLabelProps={{
                        style: { color: "white" },
                      }}
                      InputProps={{
                        sx: {
                          color: "white",
                          backgroundColor: "#0c1520",
                          "&::placeholder": {
                            color: "white",
                          },
                          "label + &": {
                            color: "white",
                          },
                        },
                      }}
                    />{" "}
                  </TableCell>

                  <TableCell>
                    <Button
                      variant="contained"
                      onClick={handleResetInputs}
                      style={{
                        backgroundColor: "#0063cc",
                        color: "white",
                        fontWeight: "bold",
                        height: "40px", // Set the height as desired
                      }}
                    >
                      Reset
                    </Button>
                  </TableCell>
                </TableRow>
              </TableHead>
            </Table>
          </TableContainer>

          <TableContainer
            style={{ width: "100%" }}
            component={Paper}
            sx={{
              "& .MuiTableRow-root": {
                // Apply styles to TableRow here, e.g., reducing height
                height: 32, // Example height, adjust as needed
              },
              "& .MuiTableCell-root": {
                // Reduce padding to decrease space
                padding: "4px 16px", // Adjust padding as needed
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
              <TableBody>
                {filteredData.map((row, index) => (
                  <TableRow
                    key={row.id}
                    onClick={() => handleRowClick(index, row)}
                    sx={rowStyle(index)}
                  >
                    <TableCell
                      component="th"
                      scope="row"
                      style={{ width: "15%" }}
                    >
                      {row.sifraRobe}
                    </TableCell>
                    <TableCell
                      sx={{
                        maxWidth: 0,
                        overflow: "hidden",
                        textOverflow: "ellipsis",
                        whiteSpace: "nowrap",
                        width: "40%",
                      }}
                    >
                      {row.nazivRobe}
                    </TableCell>
                    <TableCell>{row.nazivGrupe}</TableCell>
                    <TableCell>{row.sifraGrupe}</TableCell>
                    <TableCell>{row.sifraNadgrupe}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </div>
        <div style={{ marginRight: "1%", marginLeft: "1%", width: "100%" }}>
          <SavedPlanSelection
            planData={planData}
            onRowClick={handlePlanSelection}
            selectedYear={selectedYear}
          />
        </div>
      </div>
      {isLoading ? (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <CircularProgress />
        </div>
      ) : (
        <>
          {/* {selectedTable === 5 && <Koeficijent />}
          {selectedTable === 3 && <PlaniranjeBrutoMarze />} */}
          {selectedTable === 2 && (
            <PlaniranjePrometa
              rowData={selectedRowData}
              selectedYear={selectedYear}
              key={selectedRowIndex}
              onSaved={reloadSavedPlans} // Passing the callback as a prop
            />
          )}
          {/* {selectedTable === 1 && <PlaniranjeNabavkeIProdaje />} */}
        </>
      )}
    </div>
  );
}

export default ItemSelection;
