import React from "react";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import { useState, useEffect } from "react";
import { CellHeadingStyle3, CellStyle } from "./TableStyles";
import SaveKolicineButton from "./SaveKolicineButton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Typography,
} from "@mui/material";

const calculatePostotakProdajeTG = (plan, prodajaPG) => {
  const numericPlan = parseFloat(plan);
  const numericProdajaPG = parseFloat(prodajaPG);

  if (isNaN(numericPlan) || isNaN(numericProdajaPG) || numericProdajaPG === 0) {
    return "";
  }

  const percentage = (numericPlan / numericProdajaPG - 1) * 100;

  if (isNaN(percentage)) {
    return "";
  }

  return percentage.toFixed(2);
};

const calculateDnevnaProdajaKomadaProizvoda = (plan) => {
  const numericPlan = parseFloat(plan || 0);
  const dneProd = numericPlan / 30;

  if (numericPlan === 0) {
    return "0";
  }

  return dneProd.toFixed(0);
};

const calculatePlaniraniUvozKM = (fc, pUvoz) => {
  const planiraniUvoz = fc * pUvoz;
  return planiraniUvoz.toFixed(0);
};

const calculateOstvareniUvozKM = (OUKom, FC) => {
  const numericOstvareniUvozKM = OUKom * FC;

  if (OUKom === 0) {
    return "0";
  }

  return numericOstvareniUvozKM.toFixed(0);
};

const calculatePercentage2 = (puKM, OUKom, OUKM) => {
  const numericPuKM = parseFloat(puKM);
  const numericOUKom = parseFloat(OUKom);
  const numericOUKM = parseFloat(OUKM);

  if (
    isNaN(numericPuKM) ||
    isNaN(numericOUKom) ||
    isNaN(numericOUKM) ||
    numericOUKom === null ||
    numericPuKM === 0
  ) {
    return "";
  }

  const percentage = (numericOUKM / numericPuKM - 1) * 100;

  if (isNaN(percentage)) {
    return "";
  }
  return percentage.toFixed(2);
};

const calculateODP = (OI) => {
  if (OI === null) {
    return "";
  }

  return (OI / 30).toFixed(0);
};

const calculateOIperM = (plan, ODP, dneProm) => {
  const numericPlan = parseFloat(plan);
  const numericODP = parseFloat(ODP);
  const numericDneProm = parseFloat(dneProm);

  if (
    isNaN(numericPlan) ||
    numericPlan === 0 ||
    isNaN(numericODP) ||
    isNaN(numericDneProm) ||
    numericDneProm === 0
  ) {
    return "";
  }

  const percentage = (numericODP / numericDneProm - 1) * 100;

  if (isNaN(percentage) || !isFinite(percentage)) {
    return "";
  }

  return percentage.toFixed(2);
};

const calculateOIperG = (ODP, OI, ProPG) => {
  if (ODP === null) {
    return "";
  }

  const OIperG = (OI / ProPG - 1) * 100;

  return OIperG.toFixed(2);
};

const calculateZBrDa = (plan, month, zalihe, dnevnaProdaja, ODP) => {
  const numericPlan = parseFloat(plan);
  const numericMonth = parseFloat(month);
  const numericZalihe = parseFloat(zalihe);
  const numericDnevnaProdaja = parseFloat(dnevnaProdaja);
  const numericODP = parseFloat(ODP);

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const isFutureMonth = numericMonth > currentMonth;
  const isCurrentMonth = numericMonth === currentMonth;

  if (numericPlan === 0) {
    return 9999;
  }

  if (isFutureMonth || isCurrentMonth) {
    if (
      isNaN(numericZalihe) ||
      isNaN(numericDnevnaProdaja) ||
      numericDnevnaProdaja === 0
    ) {
      return "";
    }
    return (numericZalihe / numericDnevnaProdaja).toFixed(0);
  } else {
    if (isNaN(numericZalihe) || isNaN(numericODP) || numericODP === 0) {
      return 9999;
    }
    return (numericZalihe / numericODP).toFixed(0);
  }
};

const calculateTZKo = (month, OI, plan, zalihe, pUvoz, OUKom) => {
  const numericMonth = parseFloat(month);
  const numericOI = parseFloat(OI);
  const numericPlan = parseFloat(plan);
  const numericZalihe = parseFloat(zalihe);
  const numericPUvoz = parseFloat(pUvoz);
  const numericOUKom = parseFloat(OUKom);

  if (
    isNaN(numericMonth) ||
    isNaN(numericOI) ||
    isNaN(numericPlan) ||
    isNaN(numericZalihe) ||
    isNaN(numericPUvoz) ||
    isNaN(numericOUKom)
  ) {
    return "";
  }

  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const isCurrentOrFutureMonth = numericMonth >= currentMonth;
  const isOverPlan = numericOI > numericPlan;

  let result;

  if (isCurrentOrFutureMonth && isOverPlan) {
    result = numericZalihe + numericPUvoz - numericOI;
  } else if (isCurrentOrFutureMonth) {
    result = numericZalihe + numericPUvoz - numericPlan;
  } else {
    result = numericZalihe + numericOUKom - numericOI;
  }

  if (isNaN(result)) {
    return "";
  }

  return result;
};

const calculatePotrebneZalihe = (dneProm, Koe, MinBr) => {
  const potrebneZalihe = dneProm * Koe * MinBr;
  return potrebneZalihe.toFixed(0);
};

const calculateMZKM = (pUvoz, FC) => {
  const MZKM = pUvoz * FC;
  return MZKM.toFixed(0);
};

const calculateTotalMZKM = (planiraniUvozValues, fakturnaCijenaValues) => {
  return planiraniUvozValues.reduce((acc, pUvozValue, index) => {
    const numericMZKMValue = parseFloat(
      calculateMZKM(pUvozValue, fakturnaCijenaValues[index])
    );
    return acc + (isNaN(numericMZKMValue) ? 0 : numericMZKMValue);
  }, 0);
};

// TOTAL AVERAGE

const calculateTotalZalihe = (kolicinePlanData) => {
  return kolicinePlanData.reduce((acc, monthData) => {
    const numericZaliha = parseFloat(monthData.zaliha);
    return acc + (isNaN(numericZaliha) ? 0 : numericZaliha);
  }, 0);
};

const calculateTotalProdajaLani = (kolicinePlanData) => {
  return kolicinePlanData.reduce((acc, monthData) => {
    const numericProdajaLani = parseFloat(monthData.prodaja_lani);
    return acc + (isNaN(numericProdajaLani) ? 0 : numericProdajaLani);
  }, 0);
};

const calculateAveragePostotakProdajeTG = (planValues, kolicinePlanData) => {
  const total = kolicinePlanData.reduce((acc, monthData, index) => {
    const postotakProdajeTG = parseFloat(
      calculatePostotakProdajeTG(planValues[index], monthData.prodaja_lani)
    );
    return acc + (isNaN(postotakProdajeTG) ? 0 : postotakProdajeTG);
  }, 0);
  const count = kolicinePlanData.filter(
    (monthData, index) =>
      !isNaN(
        parseFloat(
          calculatePostotakProdajeTG(planValues[index], monthData.prodaja_lani)
        )
      )
  ).length;
  return count > 0 ? (total / count).toFixed(2) : "0.00";
};

const calculateTotalPlan = (planValues) => {
  return planValues.reduce((acc, planValue) => {
    const numericPlanValue = parseFloat(planValue);
    return acc + (isNaN(numericPlanValue) ? 0 : numericPlanValue);
  }, 0);
};

const calculateTotalPUvoz = (planiraniUvozValues) => {
  return planiraniUvozValues.reduce((acc, pUvozValue) => {
    const numericPUvozValue = parseFloat(pUvozValue);
    return acc + (isNaN(numericPUvozValue) ? 0 : numericPUvozValue);
  }, 0);
};

const calculateTotalPUKM = (fakturnaCijenaValues, planiraniUvozValues) => {
  return planiraniUvozValues.reduce((acc, pUvozValue, index) => {
    const numericPUKMValue = parseFloat(
      calculatePlaniraniUvozKM(fakturnaCijenaValues[index], pUvozValue)
    );
    return acc + (isNaN(numericPUKMValue) ? 0 : numericPUKMValue);
  }, 0);
};

const calculateTotalOUKom = (kolicinePlanData) => {
  return kolicinePlanData.reduce((acc, monthData) => {
    const numericOUKomValue = parseFloat(monthData.uvezeno);
    return acc + (isNaN(numericOUKomValue) ? 0 : numericOUKomValue);
  }, 0);
};

const calculateTotalOUKM = (kolicinePlanData, fakturnaCijenaValues) => {
  return kolicinePlanData.reduce((acc, monthData, index) => {
    const numericOUKMValue = parseFloat(
      calculateOstvareniUvozKM(monthData.uvezeno, fakturnaCijenaValues[index])
    );
    return acc + (isNaN(numericOUKMValue) ? 0 : numericOUKMValue);
  }, 0);
};

const calculateSumPUvozUpToCurrentMonth = (planiraniUvozValues) => {
  const currentMonth = new Date().getMonth() + 1; // Get the current month (1-12)
  return planiraniUvozValues.reduce((acc, pUvozValue, index) => {
    if (index + 1 <= currentMonth) {
      const numericPUvozValue = parseFloat(pUvozValue);
      return acc + (isNaN(numericPUvozValue) ? 0 : numericPUvozValue);
    }
    return acc;
  }, 0);
};

const calculatePercentage2Average = (kolicinePlanData, planiraniUvozValues) => {
  const totalOUKom = calculateTotalOUKom(kolicinePlanData);
  const sumPUvozUpToCurrentMonth =
    calculateSumPUvozUpToCurrentMonth(planiraniUvozValues);

  if (sumPUvozUpToCurrentMonth === 0) {
    return "0.00";
  }

  const percentage = (totalOUKom / sumPUvozUpToCurrentMonth - 1) * 100;
  return percentage.toFixed(2);
};

const calculateTotalOI = (kolicinePlanData) => {
  return kolicinePlanData.reduce((acc, monthData) => {
    const numericOIValue = parseFloat(monthData.izlaz);
    return acc + (isNaN(numericOIValue) ? 0 : numericOIValue);
  }, 0);
};

// FONT
const adjustFontSize = (content) => {
  let fontSize = 12; // Default font size
  if (content && content.length > 5) {
    fontSize = 10; // Smaller font size for longer content
  }
  if (content && content.length > 8) {
    fontSize = 9; // Even smaller font size for very long content
  }
  if (content && content.length > 9) {
    fontSize = 8; // Even smaller font size for very long content
  }
  if (content && content.length > 10) {
    fontSize = 7; // Even smaller font size for very long content
  }
  if (content && content.length > 11) {
    fontSize = 6; // Even smaller font size for very long content
  }
  if (content && content.length > 12) {
    fontSize = 5; // Even smaller font size for very long content
  }
  return { fontSize: `${fontSize}px` };
};

// FORMAT NUMBERS WITH DOTTS
const formatNumberWithDots = (number) => {
  // First, ensure the number is rounded to remove any decimals
  const roundedNumber = Math.round(number);
  // Convert the number to a string and format it with dots for thousands separators
  return roundedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
};

const PlaniranjeKolicina = ({
  selectedYear,
  kolicinePlanData,
  rowData,
  onSaved,
}) => {
  // console.log("PLANIRANJE sifra robe je :", rowData.rowDetails.sifraRobe);
  const [planValues, setPlanValues] = useState(Array(12).fill(""));
  const [planiraniUvozValues, setPlaniraniUvozValues] = useState(
    Array(12).fill("")
  );
  const [fakturnaCijenaValues, setFakturnaCijenaValues] = useState(
    Array(12).fill("")
  );
  const [koeficijentValues, setKoeficijentValues] = useState(
    Array(12).fill("")
  );
  const [minBrValues, setMinBrValues] = useState(Array(12).fill(""));

  useEffect(() => {
    if (kolicinePlanData && kolicinePlanData.monthlyData) {
      const newPlanValues = kolicinePlanData.monthlyData.map(
        (month) => month.Plan || ""
      );
      const newPlaniraniUvozValues = kolicinePlanData.monthlyData.map(
        (month) => month.PlaniraniUvoz || ""
      );
      const newFakturnaCijenaValues = kolicinePlanData.monthlyData.map(
        (month) => month.FakturnaCijena
      );
      const newKoeficijentValues = kolicinePlanData.monthlyData.map(
        (month) => month.Koeficijent
      );
      const newMinBrValues = kolicinePlanData.monthlyData.map(
        (month) => month.MinBr
      );
      setPlanValues(newPlanValues);
      setPlaniraniUvozValues(newPlaniraniUvozValues);
      setFakturnaCijenaValues(newFakturnaCijenaValues);
      setKoeficijentValues(newKoeficijentValues);
      setMinBrValues(newMinBrValues);
    }
  }, [kolicinePlanData]);

  const handleInputChange = (value, index, type) => {
    let newValue = value.replace(/,/g, ".").replace(/[^0-9.]/g, "");

    newValue = newValue
      .replace(/\./, "_PLACEHOLDER_")
      .replace(/\./g, "")
      .replace("_PLACEHOLDER_", ".");

    if (newValue.match(/^\./)) {
      newValue = "0" + newValue;
    }

    if (type === "plan") {
      const newPlanValues = [...planValues];
      newPlanValues[index] = newValue;
      setPlanValues(newPlanValues);
    } else if (type === "planiraniUvoz") {
      const newPlaniraniUvozValues = [...planiraniUvozValues];
      newPlaniraniUvozValues[index] = newValue;
      setPlaniraniUvozValues(newPlaniraniUvozValues);
    } else if (type === "fakturnaCijena") {
      const newFakturnaCijenaValues = [...fakturnaCijenaValues];
      for (let i = index; i < newFakturnaCijenaValues.length; i++) {
        newFakturnaCijenaValues[i] = newValue;
      }
      setFakturnaCijenaValues(newFakturnaCijenaValues);
    } else if (type === "koeficijent") {
      const newKoeficijentValues = [...koeficijentValues];
      for (let i = index; i < newKoeficijentValues.length; i++) {
        newKoeficijentValues[i] = newValue;
      }
      setKoeficijentValues(newKoeficijentValues);
    } else if (type === "minBr") {
      const newMinBrValues = [...minBrValues];
      for (let i = index; i < newMinBrValues.length; i++) {
        newMinBrValues[i] = newValue;
      }
      setMinBrValues(newMinBrValues);
    }
  };

  const handleSaveData = async () => {
    const apiEndpoint = "http://192.168.2.100/ERP-API/public/api/kolicine";
    const token = localStorage.getItem("userToken");

    if (!token) {
      console.error("Authorization token is missing. Please log in again.");
      return;
    }

    const kolicinaDataToSave = kolicinePlanData.map((data, index) => ({
      mjesec: index + 1,
      godina: selectedYear,
      sifra_artikla: rowData.rowDetails.sifraRobe,
      zaliha_prvog: parseInt(data.zaliha, 10) || 0,
      prodaja_prosle_godine: parseInt(data.prodaja_lani, 10) || 0,
      postotak_ptg_pg:
        parseFloat(
          calculatePostotakProdajeTG(planValues[index], data.prodaja_lani)
        ).toFixed(2) || 0.0,
      plan: parseInt(planValues[index], 10) || 0,
      dnevna_prodaja:
        parseInt(calculateDnevnaProdajaKomadaProizvoda(planValues[index])) || 0,
      planirani_uvoz: parseInt(planiraniUvozValues[index]) || 0,
      fakturna_cijena:
        parseFloat(fakturnaCijenaValues[index]).toFixed(2) || 0.0,
      planirani_uvoz_km:
        parseInt(
          calculatePlaniraniUvozKM(
            fakturnaCijenaValues[index],
            planiraniUvozValues[index]
          )
        ) || 0,
      ostvareni_uvoz_komada: parseInt(data.uvezeno) || 0,
      ostvareni_uvoz_km:
        parseInt(
          calculateOstvareniUvozKM(data.uvezeno, fakturnaCijenaValues[index])
        ) || 0,
      postotak_pu_ou:
        calculatePercentage2(
          parseFloat(
            calculatePlaniraniUvozKM(
              fakturnaCijenaValues[index],
              planiraniUvozValues[index]
            ),
            data.uvezeno,
            calculateOstvareniUvozKM(data.uvezeno, fakturnaCijenaValues[index])
          ).toFixed(2)
        ) || 0.0,
      ostvareni_izlaz: parseInt(data.izlaz) || 0,
      ostvareni_dnevni_izlaz: parseInt(calculateODP(data.izlaz)) || 0,
      postotak_oi_putg:
        calculateOIperM(
          planValues[index],
          calculateODP(data.izlaz),
          calculateDnevnaProdajaKomadaProizvoda(planValues[index])
        ) || 0.0,
      postotak_oitg_pg:
        parseFloat(
          calculateOIperG(
            calculateODP(data.izlaz),
            data.izlaz,
            data.prodaja_lani
          )
        ).toFixed(2) || 0.0,
      zaliha_neocarinjeno: parseInt(data.neocarinjeno) || 0,
      zaliha_ocarinjeno: parseInt(data.ocarinjeno) || 0,

      broj_dana_zaliha:
        parseInt(
          calculateZBrDa(
            planValues[index],
            index + 1,
            data.zaliha,
            calculateDnevnaProdajaKomadaProizvoda(planValues[index]),
            calculateODP(data.izlaz)
          )
        ) || 0,
      zaliha_kraj_mjeseca:
        parseInt(
          calculateTZKo(
            index + 1,
            data.izlaz,
            planValues[index],
            data.zaliha,
            planiraniUvozValues[index],
            data.uvezeno
          )
        ) || 0,
      koeficijent: parseFloat(koeficijentValues[index]).toFixed(2) || 0.0,
      min_broj_dana_zaliha: parseInt(minBrValues[index]) || 0,
      potrebne_zalihe:
        parseInt(
          calculatePotrebneZalihe(
            calculateDnevnaProdajaKomadaProizvoda(planValues[index]),
            koeficijentValues[index],
            minBrValues[index]
          )
        ) || 0,
      potrebna_financijska_sredstva:
        parseInt(
          calculateMZKM(planiraniUvozValues[index], fakturnaCijenaValues[index])
        ) || 0,
    }));

    console.log("Data for saving: ", kolicinaDataToSave);

    // Function to save a single month's data, with retry logic
    function saveMonthData(monthData, apiEndpoint, token, retryCount = 0) {
      return fetch(apiEndpoint, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Cache-Control": "no-cache",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(monthData),
      })
        .then(async (response) => {
          console.log(response); // Log the entire response for debugging

          if (response.redirected) {
            console.error(`Request was redirected to: ${response.url}`);
            throw new Error(`Request was redirected`);
          }

          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }

          return { success: true };
        })
        .catch((error) => {
          console.error(
            `Error saving data for month ${monthData.mjesec}`,
            error
          );
          if (retryCount < 3) {
            console.log(`Retrying for month ${monthData.mjesec}...`);
            return saveMonthData(monthData, apiEndpoint, token, retryCount + 1);
          }
          return { success: false };
        });
    }

    // Use Promise.allSettled to handle each request, skipping the specific month and adding retry logic
    const skipMonth = "MonthToSkip"; // Define the month you want to skip
    const savePromises = kolicinaDataToSave
      .filter((monthData) => monthData.mjesec !== skipMonth)
      .map((monthData) => saveMonthData(monthData, apiEndpoint, token));

    Promise.allSettled(savePromises).then((results) => {
      results.forEach((result, index) => {
        if (result.status === "fulfilled" && result.value.success) {
          console.log(
            `Podatci za spremiti: ${kolicinaDataToSave[index].mjesec}`,
            kolicinaDataToSave[index]
          );
        } else if (result.status === "rejected" || !result.value.success) {
          console.log(
            `Failed to save data after retries for month ${kolicinaDataToSave[index].mjesec}`
          );
        }
      });
    });

    Promise.allSettled(savePromises).then((results) => {
      // Check if all promises were fulfilled successfully
      const allSuccessful = results.every(
        (result) => result.status === "fulfilled" && result.value.success
      );
      if (allSuccessful) {
        console.log("All data saved successfully, reloading saved plans...");
        onSaved(); // Assuming onSaved is defined and passed as a prop
      } else {
        console.error("Some saves were unsuccessful. Check logs for details.");
      }
    });
  };

  // console.log("", kolicinePlanData);

  return (
    <div style={{ padding: "1%" }}>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <Tooltip
                title={<Typography fontSize={15}>Mjesec Godina</Typography>}
                placement="top"
              >
                <TableCell sx={CellHeadingStyle3} align="center">
                  MG
                </TableCell>
              </Tooltip>

              <Tooltip
                title={
                  <Typography fontSize={15}>
                    Zalihe na početku mjeseca
                  </Typography>
                }
                placement="top"
              >
                <TableCell
                  sx={{ ...CellHeadingStyle3, width: "2rem" }}
                  align="center"
                >
                  Zal.1.1.24
                </TableCell>
              </Tooltip>

              <Tooltip
                title={
                  <Typography fontSize={15}>
                    Prodaja prethodne godine
                  </Typography>
                }
                placement="top"
              >
                <TableCell sx={CellHeadingStyle3} align="center">
                  Pro.P.G
                </TableCell>
              </Tooltip>

              <Tooltip
                title={
                  <Typography fontSize={15}>
                    Postotak uvoza u tekućoj godini na prethodnu godinu
                  </Typography>
                }
                placement="top"
              >
                <TableCell sx={CellHeadingStyle3} align="center">
                  %
                </TableCell>
              </Tooltip>

              <Tooltip
                title={
                  <Typography fontSize={15}>
                    Plan prodaje komada za tekuću godinu po mjesecima
                  </Typography>
                }
                placement="top"
              >
                <TableCell sx={CellHeadingStyle3} align="center">
                  Plan
                </TableCell>
              </Tooltip>

              <Tooltip
                title={
                  <Typography fontSize={15}>
                    Planirana dnevna prodaja komada proizvoda
                  </Typography>
                }
                placement="top"
              >
                <TableCell sx={CellHeadingStyle3} align="center">
                  Dne Pro
                </TableCell>
              </Tooltip>

              <Tooltip
                title={
                  <Typography fontSize={15}>Planirani uvoz komada</Typography>
                }
                placement="top"
              >
                <TableCell sx={CellHeadingStyle3} align="center">
                  P.Uvoz
                </TableCell>
              </Tooltip>

              <Tooltip
                title={
                  <Typography fontSize={15}>
                    Fakturna cijena proizvoda
                  </Typography>
                }
                placement="top"
              >
                <TableCell sx={CellHeadingStyle3} align="center">
                  FC
                </TableCell>
              </Tooltip>

              <Tooltip
                title={
                  <Typography fontSize={15}>
                    Planirani uvoz u Konvertibilnim markama
                  </Typography>
                }
                placement="top"
              >
                <TableCell sx={CellHeadingStyle3} align="center">
                  PU KM
                </TableCell>
              </Tooltip>

              <Tooltip
                title={
                  <Typography fontSize={15}>Ostvareni uvoz komada</Typography>
                }
                placement="top"
              >
                <TableCell sx={CellHeadingStyle3} align="center">
                  OU Kom
                </TableCell>
              </Tooltip>

              <Tooltip
                title={
                  <Typography fontSize={15}>
                    Ostvareni uvoz u konvertibilnim markama
                  </Typography>
                }
                placement="top"
              >
                <TableCell sx={CellHeadingStyle3} align="center">
                  OU KM
                </TableCell>
              </Tooltip>

              <Tooltip
                title={
                  <Typography fontSize={15}>
                    Postotak planiranog uvoza i ostvarenog uvoza
                  </Typography>
                }
                placement="top"
              >
                <TableCell sx={CellHeadingStyle3} align="center">
                  %
                </TableCell>
              </Tooltip>

              <Tooltip
                title={
                  <Typography fontSize={15}>Ostvareni izlaz robe</Typography>
                }
                placement="top"
              >
                <TableCell sx={CellHeadingStyle3} align="center">
                  O I
                </TableCell>
              </Tooltip>

              <Tooltip
                title={
                  <Typography fontSize={15}>
                    Ostvarena dnevna prodaja komada
                  </Typography>
                }
                placement="top"
              >
                <TableCell sx={CellHeadingStyle3} align="center">
                  O D P
                </TableCell>
              </Tooltip>

              <Tooltip
                title={
                  <Typography fontSize={15}>
                    Postotak ostvarenog izlaza na plan ulaza u tekućoj godini
                  </Typography>
                }
                placement="top"
              >
                <TableCell sx={CellHeadingStyle3} align="center">
                  %OI/M
                </TableCell>
              </Tooltip>

              <Tooltip
                title={
                  <Typography fontSize={15}>
                    Postotak ostvarenog izlaza proizvoda tekuća godina na
                    prethodnu godinu
                  </Typography>
                }
                placement="top"
              >
                <TableCell sx={CellHeadingStyle3} align="center">
                  %OI/G
                </TableCell>
              </Tooltip>

              <Tooltip
                title="Trenutna zaliha na carinskim skladištu ne ocarinjene robe"
                placement="top"
              >
                <TableCell sx={CellHeadingStyle3} align="center">
                  TZZO
                </TableCell>
              </Tooltip>

              <Tooltip
                title="Trenutna zaliha ocarinjenog na svim skladištima"
                placement="top"
              >
                <TableCell sx={CellHeadingStyle3} align="center">
                  TZOC
                </TableCell>
              </Tooltip>

              <Tooltip
                title="Zalihe broj dana u tekućem mjesecu bez uvoza proizvoda u tekućem mjesecu"
                placement="top"
              >
                <TableCell sx={CellHeadingStyle3} align="center">
                  Z Br,da
                </TableCell>
              </Tooltip>

              <Tooltip
                title="Zaliha na mjesečnoj razini na kraju mjeseca"
                placement="top"
              >
                <TableCell sx={CellHeadingStyle3} align="center">
                  TZ Ko
                </TableCell>
              </Tooltip>

              <Tooltip
                title="Koeficijent koji je vezan za broj dana zaliha, početni 1,75"
                placement="top"
              >
                <TableCell sx={CellHeadingStyle3} align="center">
                  Koe
                </TableCell>
              </Tooltip>

              <Tooltip
                title="Min. broj dana zaliha u tekućem mjesecu Početni 14"
                placement="top"
              >
                <TableCell sx={CellHeadingStyle3} align="center">
                  Min br
                </TableCell>
              </Tooltip>

              <Tooltip
                title="Potrebne zalihe po planu prodaje proizvoda. Potrebno na dupli klik moći upisati podatke po mjesecima: 1. Koeficijent broja dana 2. Minimalan broj dana zaliha 3. Max broj dana zaliha"
                placement="top"
              >
                <TableCell sx={CellHeadingStyle3} align="center">
                  Potreb.Z
                </TableCell>
              </Tooltip>

              <Tooltip
                title="Potrebna financijska sredstva za nabavku robe u tekućem mjesecu"
                placement="top"
              >
                <TableCell sx={CellHeadingStyle3} align="center">
                  M,Z KM
                </TableCell>
              </Tooltip>
            </TableRow>
          </TableHead>

          <TableBody>
            {kolicinePlanData.map((monthData, index) => (
              <TableRow key={index}>
                {/* Month */}
                <TableCell align="center" sx={CellStyle}>
                  {index + 1}. {selectedYear}
                </TableCell>

                {/* Zalihe na početku mjeseca */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#FCDC2A", ...CellStyle }}
                >
                  {formatNumberWithDots(monthData.zaliha)}
                </TableCell>

                {/* Prodaja prethodne godine */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#FCDC2A", ...CellStyle }}
                >
                  {formatNumberWithDots(monthData.prodaja_lani)}
                </TableCell>

                {/* Postotak uvoza u tekućoj godini na prethodnu godinu */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#c8e8ff", ...CellStyle }}
                >
                  {calculatePostotakProdajeTG(
                    planValues[index],
                    monthData.prodaja_lani
                  )}
                </TableCell>

                {/* Plan */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#98FB98", ...CellStyle }}
                >
                  <TextField
                    value={planValues[index]}
                    onChange={(e) =>
                      handleInputChange(e.target.value, index, "plan")
                    }
                    size="small"
                    InputProps={{
                      style: { fontSize: "12px", padding: "2px 2px" },
                    }}
                    sx={{
                      height: "1rem",
                      "& .MuiInputBase-input": {
                        height: "1rem",
                        padding: "0px 0px",
                      },
                    }}
                  />
                </TableCell>

                {/* Dne Pro */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#c8e8ff", ...CellStyle }}
                >
                  {formatNumberWithDots(
                    calculateDnevnaProdajaKomadaProizvoda(planValues[index])
                  )}
                </TableCell>

                {/* P.Uvoz */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#98FB98", ...CellStyle }}
                >
                  <TextField
                    value={planiraniUvozValues[index]}
                    onChange={(e) =>
                      handleInputChange(e.target.value, index, "planiraniUvoz")
                    }
                    size="small"
                    InputProps={{
                      style: { fontSize: "12px", padding: "2px 2px" },
                    }}
                    sx={{
                      height: "1rem",
                      "& .MuiInputBase-input": {
                        height: "1rem",
                        padding: "0px 0px",
                      },
                    }}
                  />
                </TableCell>

                {/* FC */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#98FB98", ...CellStyle }}
                >
                  <TextField
                    value={fakturnaCijenaValues[index]}
                    onChange={(e) =>
                      handleInputChange(e.target.value, index, "fakturnaCijena")
                    }
                    size="small"
                    InputProps={{
                      style: { fontSize: "12px", padding: "2px 2px" },
                    }}
                    sx={{
                      height: "1rem",
                      "& .MuiInputBase-input": {
                        height: "1rem",
                        padding: "0px 0px",
                      },
                    }}
                  />
                </TableCell>

                {/* PU KM */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#c8e8ff", ...CellStyle }}
                >
                  {formatNumberWithDots(
                    calculatePlaniraniUvozKM(
                      fakturnaCijenaValues[index],
                      planiraniUvozValues[index]
                    )
                  )}
                </TableCell>

                {/* OU Kom -> Ostvareni uvoz komada*/}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#FCDC2A", ...CellStyle }}
                >
                  {formatNumberWithDots(monthData.uvezeno)}
                </TableCell>

                {/* OU KM */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#c8e8ff", ...CellStyle }}
                >
                  {formatNumberWithDots(
                    calculateOstvareniUvozKM(
                      monthData.uvezeno,
                      fakturnaCijenaValues[index]
                    )
                  )}
                </TableCell>

                {/* % */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#c8e8ff", ...CellStyle }}
                >
                  {calculatePercentage2(
                    calculatePlaniraniUvozKM(
                      fakturnaCijenaValues[index],
                      planiraniUvozValues[index]
                    ),
                    monthData.uvezeno,
                    calculateOstvareniUvozKM(
                      monthData.uvezeno,
                      fakturnaCijenaValues[index]
                    )
                  )}
                </TableCell>

                {/* O I */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#FCDC2A", ...CellStyle }}
                >
                  {formatNumberWithDots(monthData.izlaz)}
                </TableCell>

                {/* O D P */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#c8e8ff", ...CellStyle }}
                >
                  {formatNumberWithDots(calculateODP(monthData.izlaz))}
                </TableCell>

                {/* %OI/M */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor:
                      calculateOIperM(
                        planValues[index],
                        calculateODP(monthData.izlaz),
                        calculateDnevnaProdajaKomadaProizvoda(planValues[index])
                      ) < 2.5
                        ? "red"
                        : "#c8e8ff",
                    color:
                      calculateOIperM(
                        planValues[index],
                        calculateODP(monthData.izlaz),
                        calculateDnevnaProdajaKomadaProizvoda(planValues[index])
                      ) < 2.5
                        ? "white"
                        : "black",
                    ...CellStyle,
                  }}
                >
                  {calculateOIperM(
                    planValues[index],
                    calculateODP(monthData.izlaz),
                    calculateDnevnaProdajaKomadaProizvoda(planValues[index])
                  )}
                </TableCell>

                {/* %OI/G */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor:
                      calculateOIperG(
                        calculateODP(monthData.izlaz),
                        monthData.izlaz,
                        monthData.prodaja_lani
                      ) < 2.5
                        ? "red"
                        : "#c8e8ff",
                    color:
                      calculateOIperG(
                        calculateODP(monthData.izlaz),
                        monthData.izlaz,
                        monthData.prodaja_lani
                      ) < 2.5
                        ? "white"
                        : "black",
                    ...CellStyle,
                  }}
                >
                  {calculateOIperG(
                    calculateODP(monthData.izlaz),
                    monthData.izlaz,
                    monthData.prodaja_lani
                  )}
                </TableCell>

                {/* TZZO */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#FCDC2A", ...CellStyle }}
                >
                  {monthData.neocarinjeno}
                </TableCell>

                {/* TZOC */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#FCDC2A", ...CellStyle }}
                >
                  {" "}
                  {monthData.ocarinjeno}
                </TableCell>

                {/* Z Br,da */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: (() => {
                      const zBrDaValue = calculateZBrDa(
                        monthData.plan,
                        index + 1,
                        monthData.zaliha,
                        calculateDnevnaProdajaKomadaProizvoda(
                          planValues[index]
                        ),
                        calculateODP(monthData.izlaz)
                      );
                      const koeValue = parseFloat(koeficijentValues[index]);
                      const minBrValue = parseFloat(minBrValues[index]);

                      if (
                        !isNaN(zBrDaValue) &&
                        !isNaN(koeValue) &&
                        !isNaN(minBrValue)
                      ) {
                        if (
                          zBrDaValue > koeValue * minBrValue &&
                          zBrDaValue < minBrValue
                        ) {
                          return "red";
                        }
                      }
                      return "#c8e8ff";
                    })(),
                    color: (() => {
                      const zBrDaValue = calculateZBrDa(
                        monthData.plan,
                        index + 1,
                        monthData.zaliha,
                        calculateDnevnaProdajaKomadaProizvoda(
                          planValues[index]
                        ),
                        calculateODP(monthData.izlaz)
                      );
                      const koeValue = parseFloat(koeficijentValues[index]);
                      const minBrValue = parseFloat(minBrValues[index]);

                      if (
                        !isNaN(zBrDaValue) &&
                        !isNaN(koeValue) &&
                        !isNaN(minBrValue)
                      ) {
                        if (
                          zBrDaValue > koeValue * minBrValue &&
                          zBrDaValue < minBrValue
                        ) {
                          return "white";
                        }
                      }
                      return "black";
                    })(),
                    ...CellStyle,
                  }}
                >
                  {calculateZBrDa(
                    monthData.plan,
                    index + 1,
                    monthData.zaliha,
                    calculateDnevnaProdajaKomadaProizvoda(planValues[index]),
                    calculateODP(monthData.izlaz)
                  )}
                </TableCell>

                {/* TZ Ko */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#c8e8ff",
                    ...CellStyle,
                    ...adjustFontSize(
                      calculateTZKo(
                        index + 1,
                        monthData.izlaz,
                        planValues[index],
                        monthData.zaliha,
                        planiraniUvozValues[index],
                        monthData.uvezeno
                      )
                    ),
                  }}
                >
                  {formatNumberWithDots(
                    calculateTZKo(
                      index + 1,
                      monthData.izlaz,
                      planValues[index],
                      monthData.zaliha,
                      planiraniUvozValues[index],
                      monthData.uvezeno
                    )
                  )}
                </TableCell>

                {/* Koe */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#98FB98", ...CellStyle }}
                >
                  <TextField
                    value={koeficijentValues[index]}
                    onChange={(e) =>
                      handleInputChange(e.target.value, index, "koeficijent")
                    }
                    size="small"
                    InputProps={{
                      style: { fontSize: "12px", padding: "2px 2px" },
                    }}
                    sx={{
                      height: "1rem",
                      "& .MuiInputBase-input": {
                        height: "1rem",
                        padding: "0px 0px",
                      },
                    }}
                  />
                </TableCell>

                {/* Min br */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#98FB98", ...CellStyle }}
                >
                  <TextField
                    value={minBrValues[index]}
                    onChange={(e) =>
                      handleInputChange(e.target.value, index, "minBr")
                    }
                    size="small"
                    InputProps={{
                      style: { fontSize: "12px", padding: "2px 2px" },
                    }}
                    sx={{
                      height: "1rem",
                      "& .MuiInputBase-input": {
                        height: "1rem",
                        padding: "0px 0px",
                      },
                    }}
                  />
                </TableCell>

                {/* Potreb.Z */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#c8e8ff", ...CellStyle }}
                >
                  {formatNumberWithDots(
                    calculatePotrebneZalihe(
                      calculateDnevnaProdajaKomadaProizvoda(planValues[index]),
                      koeficijentValues[index],
                      minBrValues[index]
                    )
                  )}
                </TableCell>

                {/* M,Z KM */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#c8e8ff", ...CellStyle }}
                >
                  {formatNumberWithDots(
                    calculateMZKM(
                      planiraniUvozValues[index],
                      fakturnaCijenaValues[index]
                    )
                  )}
                </TableCell>
              </TableRow>
            ))}

            {/* TOTAL */}
            <TableRow>
              <TableCell align="center" sx={CellStyle}></TableCell>

              {/* Total for Zalihe na početku mjeseca */}
              <TableCell align="center" sx={CellStyle}>
                {formatNumberWithDots(calculateTotalZalihe(kolicinePlanData))}
              </TableCell>

              {/* Total for Prodaja prethodne godine */}
              <TableCell align="center" sx={CellStyle}>
                {formatNumberWithDots(
                  calculateTotalProdajaLani(kolicinePlanData)
                )}
              </TableCell>

              {/* Average for Postotak uvoza u tekućoj godini na prethodnu godinu */}
              <TableCell align="center" sx={CellStyle}>
                {calculateAveragePostotakProdajeTG(
                  planValues,
                  kolicinePlanData
                )}
              </TableCell>

              {/* Total for Plan */}
              <TableCell align="center" sx={CellStyle}>
                {formatNumberWithDots(calculateTotalPlan(planValues))}
              </TableCell>

              {/* Planirana dnevna prodaja komada proizvoda SUM */}
              <TableCell align="center" sx={CellStyle}></TableCell>

              {/* Total for P.Uvoz */}
              <TableCell align="center" sx={CellStyle}>
                {formatNumberWithDots(calculateTotalPUvoz(planiraniUvozValues))}
              </TableCell>

              <TableCell align="center" sx={CellStyle}></TableCell>

              {/* Total for PU KM */}
              <TableCell
                align="center"
                sx={{ backgroundColor: "#c8e8ff", ...CellStyle }}
              >
                {formatNumberWithDots(
                  calculateTotalPUKM(fakturnaCijenaValues, planiraniUvozValues)
                )}
              </TableCell>

              {/* Total for OU Kom */}
              <TableCell align="center" sx={CellStyle}>
                {formatNumberWithDots(calculateTotalOUKom(kolicinePlanData))}
              </TableCell>

              {/* Total for OU KM */}
              <TableCell align="center" sx={CellStyle}>
                {formatNumberWithDots(
                  calculateTotalOUKM(kolicinePlanData, fakturnaCijenaValues)
                )}
              </TableCell>

              {/* Percentage2 */}
              <TableCell
                align="center"
                sx={{ backgroundColor: "#c8e8ff", ...CellStyle }}
              >
                {calculatePercentage2Average(
                  kolicinePlanData,
                  planiraniUvozValues
                )}
              </TableCell>

              {/* Total for O I */}
              <TableCell align="center" sx={CellStyle}>
                {formatNumberWithDots(calculateTotalOI(kolicinePlanData))}
              </TableCell>

              <TableCell align="center" sx={CellStyle}></TableCell>

              {/* OI/M */}
              <TableCell align="center" sx={CellStyle}>
                OI/M
              </TableCell>

              {/* OI/G */}
              <TableCell align="center" sx={CellStyle}>
                OI/G
              </TableCell>

              <TableCell align="center" sx={CellStyle}>
                TZZO F
              </TableCell>

              <TableCell align="center" sx={CellStyle}>
                TZOC F
              </TableCell>

              <TableCell align="center" sx={CellStyle}></TableCell>

              {/* TZ Ko */}
              <TableCell align="center" sx={CellStyle}>
                TZ Ko
              </TableCell>

              <TableCell align="center" sx={CellStyle}></TableCell>

              <TableCell align="center" sx={CellStyle}></TableCell>

              <TableCell align="center" sx={CellStyle}></TableCell>

              {/* Total for MZ KM */}
              <TableCell align="center" sx={CellStyle}>
                {formatNumberWithDots(
                  calculateTotalMZKM(planiraniUvozValues, fakturnaCijenaValues)
                )}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
      <div style={{ marginTop: "1%" }}>
        {/* <SaveKolicineButton onSave={handleSaveData} disabled={isSaveDisabled} /> */}
        <SaveKolicineButton onSave={handleSaveData} />
      </div>
    </div>
  );
};

export default PlaniranjeKolicina;
