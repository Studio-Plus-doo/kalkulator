import React, { useState } from "react";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import { useEffect } from "react";
import SavePlanButton from "./SavePlanButton";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

function PlaniranjePrometa({ rowData, selectedYear, onSaved }) {
  const [pncValues, setPncValues] = useState(Array(12).fill(""));
  const [vpcValues, setVpcValues] = useState(Array(12).fill(""));
  const [ppkmValues, setPpkmValues] = useState(Array(12).fill(""));
  const [pprValues, setPprValues] = useState(Array(12).fill(""));
  const [msaValues, setMsaValues] = useState(Array(12).fill(""));
  const [isSaveDisabled, setIsSaveDisabled] = useState(true);

  const [oirValues, setOirValues] = useState(Array(12).fill("0"));

  const [okkValues, setOkkValues] = useState(() => {
    if (rowData && rowData.monthlyData) {
      return rowData.monthlyData.map((data) => data.kolicina || 0);
    }
    return Array(12).fill(0);
  });

  const handleSaveData = async () => {
    const apiEndpoint = "https://apis.moda.ba/ERP-API/public/api/plan";
    const token = localStorage.getItem("userToken");

    if (!token) {
      console.error("Authorization token is missing. Please log in again.");
      return;
    }

    const planData = monthlyData.map((data, index) => ({
      sifra_artikla: rowData.rowDetails.sifraRobe,
      mjesec: index + 1,
      godina: selectedYear,
      PNC: parseFloat(pncValues[index]) || null,
      VPC: parseFloat(vpcValues[index]) || null,
      PPR: parseFloat(pprValues[index]) || null,
      PPK: parseInt(data.plan, 10) || null,
      MSA: msaValues[index] === "" ? null : parseFloat(msaValues[index]),
      OIR: parseFloat(oirValues[index]) || 0,
    }));
    console.log("Data za spremanje: ", planData);

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
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          // const responseData = await response.json();
          // console.log(
          //   `Data saved successfully for month ${monthData.mjesec}`,
          //   responseData
          // );
          return { success: true };
        })
        .catch((error) => {
          console.error(
            `Error saving data for month ${monthData.mjesec}`,
            error
          );
          if (retryCount < 3) {
            // Retry up to 3 times
            console.log(`Retrying for month ${monthData.mjesec}...`);
            return saveMonthData(monthData, apiEndpoint, token, retryCount + 1);
          }
          return { success: false };
        });
    }

    // Use Promise.allSettled to handle each request, skipping the specific month and adding retry logic
    const skipMonth = "MonthToSkip"; // Define the month you want to skip
    const savePromises = planData
      .filter((monthData) => monthData.mjesec !== skipMonth)
      .map((monthData) => saveMonthData(monthData, apiEndpoint, token));

    Promise.allSettled(savePromises).then((results) => {
      results.forEach((result, index) => {
        if (result.status === "fulfilled" && result.value.success) {
          // console.log(
          //   `Successfully saved data for month ${planData[index].mjesec}`
          // );
          console.log(
            `Podatci za spremiti: ${planData[index].mjesec}`,
            planData[index]
          );
        } else if (result.status === "rejected" || !result.value.success) {
          console.log(
            `Failed to save data after retries for month ${planData[index].mjesec}`
          );
        }
      });
    });

    Promise.allSettled(savePromises).then((results) => {
      // Check if all promises were fulfilled successfully
      const allSuccessful = results.every((result) => result.value.success);
      if (allSuccessful) {
        // If all saves are successful, call the onSaved callback
        console.log("All data saved successfully, reloading saved plans...");
        onSaved(); // Assuming onSaved is defined and passed as a prop
      } else {
        console.error("Some saves were unsuccessful. Check logs for details.");
      }
    });
  };

  useEffect(() => {
    // Logic to check if any of the input values are empty and accordingly enable/disable the save button
    const anyEmptyInputs = [
      ...pncValues,
      ...vpcValues,
      ...pprValues,
      ...ppkmValues,
    ].some((value) => value === "");
    setIsSaveDisabled(anyEmptyInputs);
  }, [pncValues, vpcValues, pprValues, ppkmValues]); // Reacting to changes in input values

  useEffect(() => {
    if (rowData && rowData.monthlyData) {
      console.log(rowData);
      const newPncValues = rowData.monthlyData.map((month) => month.PNC || "");
      const newVpcValues = rowData.monthlyData.map((month) => month.VPC || "");
      const newPprValues = rowData.monthlyData.map((month) => month.PPR || "");
      const newMsaValues = rowData.monthlyData.map((month) => month.MSA || "");
      const newOirValues = rowData.monthlyData.map((month) => month.OIR || "0");

      // Set the state with these new values
      setPncValues(newPncValues);
      setVpcValues(newVpcValues);
      setPprValues(newPprValues);
      setMsaValues(newMsaValues);
      setOirValues(newOirValues);
    }
  }, [rowData]);

  useEffect(() => {
    if (rowData && rowData.monthlyData) {
      const newPpkmValues = rowData.monthlyData.map((data, index) => {
        // Assume calculatePPKM expects VPC, Plan, and PPR as inputs
        return calculatePPKM(vpcValues[index], data.plan, pprValues[index]);
      });

      setPpkmValues(newPpkmValues);
    }
  }, [vpcValues, rowData, pprValues]); // Dependencies

  useEffect(() => {
    if (rowData && rowData.monthlyData) {
      const initialOkkValues = rowData.monthlyData.map((data, index) => {
        const oirValue = parseFloat(oirValues[index] || 0);
        return (parseFloat(data.kolicina || 0) + oirValue).toString();
      });
      setOkkValues(initialOkkValues);
    }
  }, [rowData, oirValues]);

  const handleInputChange = (value, rowIndex, type) => {
    let newValue = value.replace(/,/g, ".").replace(/[^0-9.]/g, "");

    newValue = newValue
      .replace(/\./, "_PLACEHOLDER_")
      .replace(/\./g, "")
      .replace("_PLACEHOLDER_", ".");

    if (newValue.match(/^\./)) {
      newValue = "0" + newValue;
    }

    if (type === "oir") {
      const updatedOirValues = [...oirValues];
      updatedOirValues[rowIndex] = newValue === "" ? "0" : newValue;

      // Update okkValues when oir changes
      // Assume the change in OIR should adjust the corresponding OKK value
      const oirChange =
        parseFloat(newValue) - parseFloat(oirValues[rowIndex] || 0);
      const updatedOkkValues = [...okkValues];
      updatedOkkValues[rowIndex] = Math.max(
        0,
        (parseFloat(updatedOkkValues[rowIndex]) || 0) + oirChange
      ).toString();

      setOirValues(updatedOirValues);
      setOkkValues(updatedOkkValues);
    }

    switch (type) {
      case "oir": {
        const updatedOirValues = [...oirValues];
        const oldOirValue = parseFloat(updatedOirValues[rowIndex]) || 0;
        const newOirValue = parseFloat(newValue) || 0;
        updatedOirValues[rowIndex] = newValue === "" ? "0" : newValue;

        // Calculate the difference and update OKK
        const difference = newOirValue - oldOirValue;
        const updatedOkkValues = [...okkValues];
        updatedOkkValues[rowIndex] =
          (parseFloat(updatedOkkValues[rowIndex]) || 0) + difference;

        setOirValues(updatedOirValues);
        setOkkValues(updatedOkkValues); // Assuming you have a state for okkValues similar to oirValues
        break;
      }
      case "pnc":
        const updatedPncValues = [...pncValues];
        for (let i = rowIndex; i < updatedPncValues.length; i++) {
          updatedPncValues[i] = newValue;
        }
        setPncValues(updatedPncValues);
        break;
      case "vpc":
        const updatedVpcValues = [...vpcValues];
        for (let i = rowIndex; i < updatedVpcValues.length; i++) {
          updatedVpcValues[i] = newValue;
        }
        setVpcValues(updatedVpcValues);
        break;
      case "ppr":
        const updatedPprValues = [...pprValues];
        for (let i = rowIndex; i < updatedPprValues.length; i++) {
          updatedPprValues[i] = newValue;
        }
        setPprValues(updatedPprValues);
        break;
      case "msa":
        const updatedMsaValues = [...msaValues];
        for (let i = rowIndex; i < updatedMsaValues.length; i++) {
          updatedMsaValues[i] = newValue !== "" ? newValue : "0";
        }
        setMsaValues(updatedMsaValues);
        break;
      default:
        break;
    }
  };

  const handleOirBlur = (rowIndex) => {
    const updatedOirValues = [...oirValues];
    if (updatedOirValues[rowIndex].trim() === "") {
      updatedOirValues[rowIndex] = "0";
      setOirValues(updatedOirValues);
    }
  };

  /*KALKULACIJE*/

  const calculatePmPercentage = (pnc, vpc, msa) => {
    if (pnc !== "" && vpc !== "" && msa !== "") {
      const pncNumber = parseFloat(pnc);
      const vpcNumber = parseFloat(vpc);
      const msaNumber = parseFloat(msa);

      if (
        !isNaN(pncNumber) &&
        !isNaN(vpcNumber) &&
        !isNaN(msaNumber) &&
        pncNumber + msaNumber !== 0
      ) {
        return ((vpcNumber / (pncNumber + msaNumber) - 1) * 100).toFixed(2);
      }
    }
    return "";
  };

  const calculatePPKM = (vpc, plan, ppr) => {
    const numericPlan = parseFloat(plan);
    const numericPpr = parseFloat(ppr) / 100;
    const numericVpc = parseFloat(vpc);

    if (!isNaN(numericPlan) && !isNaN(numericPpr) && !isNaN(numericVpc)) {
      return (numericVpc * numericPlan * (1 - numericPpr)).toFixed(0);
    }
    return "";
  };

  const calculatePmPercentage2 = (ppkm, pnc, msa, ppk) => {
    const numericPpkm = parseFloat(ppkm);
    const numericPnc = parseFloat(pnc);
    const numericMsa = parseFloat(msa);
    const numericPpk = parseFloat(ppk);

    // Handle division by zero and ensure all numbers are valid
    if (
      numericPpkm === 0 ||
      isNaN(numericPpkm) ||
      isNaN(numericPnc) ||
      isNaN(numericMsa) ||
      isNaN(numericPpk) ||
      numericPnc + numericMsa === 0 ||
      numericPpk === 0
    ) {
      return "0";
    }

    // Calculate the percentage as per the Excel formula
    const result =
      (numericPpkm / ((numericPnc + numericMsa) * numericPpk) - 1) * 100;

    // Format the result to two decimal places
    return result.toFixed(2);
  };

  const calculateOPpercentage = (opkm, ppkm, okk, og, oir) => {
    const numericOpkm = parseFloat(opkm);
    const numericPpkm = parseFloat(ppkm);
    const numericOkk = parseFloat(okk);
    const numericOg = parseFloat(og);
    const numericOir = parseFloat(oir);

    // Check if the sum of OKK, OG, and OIR is 0, or if PPKM is 0 to prevent division by zero
    if (numericOkk + numericOg + numericOir === 0 || numericPpkm === 0) {
      return "0"; // Return an empty string as per the Excel formula condition
    }

    // Perform the calculation according to the formula: OPKM / PPKM
    // Ensure to handle cases where PPKM might be 0 to avoid division by zero
    const result = numericOpkm / numericPpkm;

    // Check if the result is a finite number to avoid displaying Infinity or NaN
    if (isFinite(result)) {
      return (result * 100).toFixed(2);
    } else {
      return "0";
    }
  };

  const calculateOMKM = (opkm, upk, okk, og, oir, pnc, msa, tgi) => {
    const numericOpkm = parseFloat(opkm) || 0; // OPKM
    const numericUpk = parseFloat(upk) || 0; // UPK
    const numericOkk = parseFloat(okk) || 0; // OKK
    const numericOg = parseFloat(og) || 0; // OG
    const numericOir = parseFloat(oir) || 0; // OIR
    const numericPnc = parseFloat(pnc) || 0; // PNC
    const numericMsa = parseFloat(msa) || 0; // MSA
    const numericTgi = parseFloat(tgi) || 0; // TGI
    const rateIncrease = 1.24; // This represents the 24% increase

    if (numericOkk === "") {
      return "0";
    } else if (numericUpk < 0) {
      return (
        numericOpkm -
        numericOpkm * (numericPnc + numericMsa) -
        numericOg * (numericPnc + numericMsa) * rateIncrease -
        numericOir * (numericPnc + numericMsa)
      ).toFixed(2);
    } else {
      return (
        numericOpkm -
        (numericOkk * (numericPnc + numericMsa) + numericTgi)
      ).toFixed(2);
    }
  };

  const calculateUPK = (okk, og, oir) => {
    const numericOkk = parseFloat(okk || 0);
    const numericOg = parseFloat(og || 0);
    const numericOir = parseFloat(oir || 0);

    const sum = numericOkk + numericOg + numericOir;

    if (numericOkk === 0) {
      return "0";
    }

    return sum;
  };

  const calculateOM_M_percentage = (opkm, okk, og, oir, pnc, msa) => {
    const numericOkk = parseFloat(okk);
    const numericOg = parseFloat(og);
    const numericOir = parseFloat(oir);
    const numericPnc = parseFloat(pnc);
    const numericMsa = parseFloat(msa);
    const numericOpkm = parseFloat(opkm); // Changed from omkm to opkm

    // First condition: if OKK is an empty string or zero, return "0"
    if (numericOkk === "" || numericOkk === 0) {
      return "0";
    }

    // Second condition: if UPK (OKK + OG + OIR) is zero
    const upk = numericOkk + numericOg + numericOir;
    if (upk === 0) {
      return (
        ((numericOpkm / (numericOg + numericOir) - 1) * 100).toFixed(2) + "%"
      );
    }

    // Third condition: if UPK is less than zero
    if (upk < 0) {
      return (
        ((-numericOpkm / upk / (numericPnc + numericMsa) - 1) * 100).toFixed(
          2
        ) + "%"
      );
    }

    // Default formula if none of the above conditions are met
    return (
      ((numericOpkm / upk / (numericPnc + numericMsa) - 1) * 100).toFixed(2) +
      "%"
    );
  };

  const calculateTGI = (okk, og, oir, pnc, msa) => {
    // Convert input values to numbers
    const numericOg = parseFloat(og) || 0;
    const numericOir = parseFloat(oir) || 0;
    const numericPnc = parseFloat(pnc) || 0;
    const numericMsa = parseFloat(msa) || 0;

    // If OKK is an empty string or zero (assuming empty string check is equivalent to zero check in your context)
    if (okk === "" || parseFloat(okk) === 0) {
      return "0";
    }

    // Calculate TGI according to the corrected formula:
    // TGI = (OG * (PNC + MSA) * 1.24) + (OIR * (PNC + MSA))
    const rateIncrease = 1.24; // This represents the 24% increase
    const tgi =
      numericOg * (numericPnc + numericMsa) * rateIncrease +
      numericOir * (numericPnc + numericMsa);

    // Format the result to two decimal places
    return tgi.toFixed(2);
  };

  const calculateOTPercentage = (omkm, tgi) => {
    // console.log(`OMKM je: ${omkm}, TGI je  : ${tgi}`);
    const numericOmkm = parseFloat(omkm);
    const numericTgi = parseFloat(tgi);

    // Check if OMKM is an empty string or zero, returning "0" in these cases
    if (isNaN(numericOmkm) || omkm === "" || numericOmkm === 0) {
      return "0%";
    }

    // Calculate the OT percentage based on TGI and OMKM
    const otPercentage = numericTgi / numericOmkm;

    // Ensure the result is finite and format it as a percentage
    return isFinite(otPercentage)
      ? (otPercentage * 100).toFixed(2) + "%"
      : "0%";
  };

  const calculateOMPerKom = (omkm, okk, og, oir) => {
    const numericOmkm = parseFloat(omkm);
    const numericOkk = parseFloat(okk);
    const numericOg = parseFloat(og);
    const numericOir = parseFloat(oir);
    const upk = numericOkk + numericOg + numericOir; // Assuming UPK is the sum of OKK, OG, and OIR

    // Check for blank or zero values
    if (!okk && !og && !oir) {
      return "0"; // Return "" if OPK, OG, and OIR are all blank
    } else if (upk === 0) {
      return "0"; // Return "" if the sum of OKK, OPKM, OIR, and UPK is zero
    } else if (upk < 0) {
      // If UPK is less than zero, return -OMKM / OKK (avoid division by zero)
      if (numericOkk !== 0 && isFinite(-numericOmkm / numericOkk)) {
        return (-numericOmkm / numericOkk).toFixed(2);
      } else {
        return "0"; // Return "" if the result is not finite
      }
    } else if (upk === 0) {
      // If UPK is zero, calculate OMKM / (OG + OIR) (avoid division by zero)
      if (
        numericOg + numericOir !== 0 &&
        isFinite(numericOmkm / (numericOg + numericOir))
      ) {
        return (numericOmkm / (numericOg + numericOir)).toFixed(2);
      } else {
        return "0"; // Return "" if the result is not finite
      }
    } else {
      // Otherwise, return OMKM / UPK
      if (isFinite(numericOmkm / upk)) {
        return (numericOmkm / upk).toFixed(2);
      } else {
        return "0"; // Return "" if the result is not finite
      }
    }
  };

  //SUM
  const calculateAveragePnc = () => {
    const sum = pncValues.reduce((acc, value) => {
      const numericValue = parseFloat(value);
      return acc + (isNaN(numericValue) ? 0 : numericValue);
    }, 0);
    const count = pncValues.filter((value) => value !== "").length;
    return (sum / count || 0).toFixed(2);
  };

  const calculateAverageMsa = () => {
    const sum = msaValues.reduce((acc, value) => {
      const numericValue = parseFloat(value);
      return acc + (isNaN(numericValue) ? 0 : numericValue);
    }, 0);
    const count = msaValues.filter((value) => value !== "").length;
    return count > 0 ? (sum / count).toFixed(2) : "0.00";
  };

  const calculateAverageVpc = () => {
    const sum = vpcValues.reduce((acc, value) => {
      const numericValue = parseFloat(value);
      return acc + (isNaN(numericValue) ? 0 : numericValue);
    }, 0);
    const count = vpcValues.filter((value) => value !== "").length;
    return (sum / count || 0).toFixed(2);
  };

  const calculateAveragePpr = () => {
    let sumPpr = 0;
    let countValidPpr = 0; // Count non-empty, valid PPR values

    pprValues.forEach((ppr) => {
      const numericPpr = parseFloat(ppr);
      if (!isNaN(numericPpr)) {
        sumPpr += numericPpr;
        countValidPpr += 1;
      }
    });

    // Calculate the average, ensuring no division by zero
    const averagePpr = countValidPpr > 0 ? sumPpr / countValidPpr : 0;
    return averagePpr.toFixed(2); // Converts the average to a string with 2 decimal places
  };

  const calculateTotalPpk = () => {
    if (rowData && rowData.monthlyData) {
      return rowData.monthlyData.reduce((acc, data) => {
        const numericPlan = parseFloat(data.plan);
        return acc + (isNaN(numericPlan) ? 0 : numericPlan);
      }, 0);
    }
    return "0.00";
  };

  const calculateAveragePmPercentage2 = () => {
    if (!rowData || !rowData.monthlyData) {
      return "0.00";
    }

    // Calculate PPKsum from rowData.monthlyData
    const PPKsum = rowData.monthlyData.reduce((total, current) => {
      const plan = parseFloat(current.plan);
      return total + (isNaN(plan) ? 0 : plan);
    }, 0);

    // Calculate PPKMsum from ppkmValues
    const PPKMsum = ppkmValues.reduce((total, current) => {
      const ppkm = parseFloat(current);
      return total + (isNaN(ppkm) ? 0 : ppkm);
    }, 0);

    // Early exit if PPKMsum is zero to match the Excel condition "if PPKMsum = 0, '0'"
    if (PPKMsum === 0) {
      return "0";
    }

    // Use previously defined functions to calculate MSAaverage and PNCaverage
    const MSAaverage = parseFloat(calculateAverageMsa()); // Convert MSAaverage to number
    const PNCaverage = parseFloat(calculateAveragePnc()); // Convert PNCaverage to number

    // Ensure all values are numbers and not NaN
    if (
      !isNaN(PPKsum) &&
      PPKsum !== 0 &&
      !isNaN(MSAaverage) &&
      !isNaN(PNCaverage) &&
      PNCaverage + MSAaverage !== 0
    ) {
      // Implement the formula
      const result = PPKMsum / ((PNCaverage + MSAaverage) * PPKsum) - 1;
      // Convert to percentage and format
      return (result * 100).toFixed(2) + "%"; // Converts the result to a percentage string with 2 decimal places
    }

    return "0";
  };

  const calculateTotalPpkm = () => {
    return ppkmValues.reduce((acc, value) => {
      const numericValue = parseFloat(value);
      return acc + (isNaN(numericValue) ? 0 : numericValue);
    }, 0);
  };

  const calculateTotalOkk = () => {
    const total = okkValues.reduce((acc, okkValue) => {
      const numericValue = parseFloat(okkValue || 0);
      return acc + (isNaN(numericValue) ? 0 : numericValue);
    }, 0);

    return total;
  };

  const calculateTotalOrkK = () => {
    return monthlyData.reduce((acc, data) => {
      // Assuming the property name for ORK K values in monthlyData is 'refKolicina'
      const numericValue = parseFloat(data.refKolicina || 0); // Use 0 as fallback if data.refKolicina is undefined or null
      return acc + (isNaN(numericValue) ? 0 : numericValue);
    }, 0);
  };

  const calculateTotalOpkm = () => {
    const totalOpkm = monthlyData.reduce((acc, data) => {
      // Attempt to parse each data.promet value as a float. If it's not a number,
      // use 0 as a fallback to avoid adding NaN to the accumulator.
      const numericValue = parseFloat(data.promet);
      return acc + (isNaN(numericValue) ? 0 : numericValue);
    }, 0);

    // Return the total sum as a numeric value, without converting it to a string
    return totalOpkm;
  };

  const calculateAverageOPpercentage = (okk, og, oir, opkmTotal, ppkmTotal) => {
    // console.log("OP% podatci!: ", okk, og, oir, opkmTotal, ppkmTotal);
    const numericOkk = parseFloat(okk);
    const numericOg = parseFloat(og);
    const numericOir = parseFloat(oir);
    const numericOpkmTotal = parseFloat(opkmTotal);
    const numericPpkmTotal = parseFloat(ppkmTotal);

    if (
      numericOkk + numericOg + numericOir === 0 ||
      isNaN(numericOpkmTotal) ||
      isNaN(numericPpkmTotal) ||
      numericPpkmTotal === 0
    ) {
      return "";
    }

    const result = numericOpkmTotal / numericPpkmTotal;

    return isFinite(result) ? `${(result * 100).toFixed(2)}%` : "";
  };

  const calculateTotalOmKm = () => {
    let totalOmKm = 0;

    monthlyData.forEach((data, index) => {
      const upk = calculateUPK(data.kolicina, data.gratis, oirValues[index]);
      const tgi = calculateTGI(
        okkValues[index], // OKK value
        data.gratis, // OG value from 'gratis'
        oirValues[index], // OIR value
        pncValues[index], // PNC value
        msaValues[index] // MSA value
      );
      const omkmValue = calculateOMKM(
        data.promet,
        upk,
        data.kolicina, // OKK is derived from monthly data kolicina in your implementation
        data.gratis,
        oirValues[index],
        pncValues[index],
        msaValues[index],
        tgi
      );

      const numericOmkmValue = parseFloat(omkmValue);
      if (!isNaN(numericOmkmValue)) {
        totalOmKm += numericOmkmValue;
      }
    });

    return totalOmKm.toFixed(0); // Assuming you want to round to the nearest whole number for total
  };

  const calculateTotalOg = () => {
    let totalOg = 0;

    monthlyData.forEach((data) => {
      // Assuming data.gratis is where the "OG" values are stored. Adjust the property name as needed.
      const ogValue = parseFloat(data.gratis);
      if (!isNaN(ogValue)) {
        totalOg += ogValue;
      }
    });

    return totalOg;
  };

  const calculateTotalOir = () => {
    let totalOir = 0;

    // Iterate over the oirValues array, which contains the OIR values for each month
    oirValues.forEach((oirValue) => {
      // Convert the OIR value to a number using parseFloat.
      // If the result is NaN (not a number), default to 0.
      const numericOir = parseFloat(oirValue) || 0;

      // Accumulate the total OIR value.
      totalOir += numericOir;
    });

    return totalOir;
  };

  const calculateTotalUPK = () => {
    let totalUPK = 0;

    // Assuming monthlyData, okkValues, and oirValues are all arrays of equal length
    // and correctly aligned to each month.
    for (let index = 0; index < monthlyData.length; index++) {
      // Extract OKK, OG, and OIR values for the current month.
      const okkValue = parseFloat(okkValues[index] || 0); // Default to 0 if undefined/null
      const ogValue = parseFloat(monthlyData[index].gratis || 0); // Assuming .gratis holds the OG values
      const oirValue = parseFloat(oirValues[index] || 0); // Use current OIR value from state

      // Calculate UPK for the month: UPK = OKK - OG - OIR
      const upkValue = okkValue + ogValue + oirValue;

      // Accumulate total UPK
      totalUPK += upkValue;
    }

    // Return the total UPK, ensuring to return it as a string with 2 decimal places for consistency
    return totalUPK.toFixed(2);
  };

  const calculateAverageOmMPercentage = () => {
    const totalOpkm = calculateTotalOpkm(); // Assuming this function calculates the sum of OPKM
    const totalOkk = calculateTotalOkk();
    const totalOg = calculateTotalOg();
    const totalOir = calculateTotalOir();
    const averagePnc = parseFloat(calculateAveragePnc());
    const averageMsa = parseFloat(calculateAverageMsa());

    // Check if OKK total is an empty string or zero
    if (totalOkk === "" || parseFloat(totalOkk) === 0) {
      return "0";
    }

    // Calculate UPK sum
    const upkSum =
      parseFloat(totalOkk) + parseFloat(totalOg) + parseFloat(totalOir);

    // Implement conditions as per the Excel logic
    if (upkSum === 0) {
      return (
        (
          (parseFloat(totalOpkm) /
            (parseFloat(totalOg) + parseFloat(totalOir)) -
            1) *
          100
        ).toFixed(2) + "%"
      );
    }

    if (upkSum < 0) {
      return (
        (
          (-parseFloat(totalOpkm) / upkSum / (averagePnc + averageMsa) - 1) *
          100
        ).toFixed(2) + "%"
      );
    }

    return (
      (
        (parseFloat(totalOpkm) / upkSum / (averagePnc + averageMsa) - 1) *
        100
      ).toFixed(2) + "%"
    );
  };

  const calculateTotalTGI = () => {
    // Assuming calculateAveragePnc, calculateTotalOg, and calculateTotalOir are defined elsewhere and correctly calculate the required values
    const averagePNC = parseFloat(calculateAveragePnc());
    const totalOG = parseFloat(calculateTotalOg());
    const totalOIR = parseFloat(calculateTotalOir());

    // Applying the formula as per the Excel formula provided
    const totalTGI = totalOG * averagePNC * 1.24 + totalOIR * averagePNC;

    // If the calculated totalTGI equals 0, return an empty string; otherwise, return the calculated value
    return totalTGI === 0 ? "" : totalTGI.toFixed(2); // toFixed(2) to match typical currency precision, adjust as needed
  };

  const calculateOTPercentageAverage = () => {
    // Calculate the total of OMKM and TGI values across all months
    let totalOMKM = 0;
    let totalTGI = 0;

    monthlyData.forEach((data, index) => {
      const upk = calculateUPK(data.kolicina, data.gratis, oirValues[index]);
      const tgi = calculateTGI(
        okkValues[index],
        data.gratis,
        oirValues[index],
        pncValues[index],
        msaValues[index]
      );

      const omKmValue = calculateOMKM(
        data.promet,
        upk,
        okkValues[index],
        data.gratis,
        oirValues[index],
        pncValues[index],
        msaValues[index],
        tgi
      );

      // Parse to float to ensure numeric calculations
      const numericOmKm = parseFloat(omKmValue);
      const numericTgi = parseFloat(tgi);

      if (!isNaN(numericOmKm)) {
        totalOMKM += numericOmKm;
      }

      if (!isNaN(numericTgi)) {
        totalTGI += numericTgi;
      }
    });

    // Applying the provided Excel logic
    if (totalOMKM === 0 || totalOMKM === "") {
      return "0%";
    } else {
      const otPercentage = (totalTGI / totalOMKM) * 100;
      return `${otPercentage.toFixed(2)}%`;
    }
  };

  const calculateAverageOMPerKom = () => {
    const totalOKK = calculateTotalOkk();
    const totalOG = calculateTotalOg();
    const totalOIR = calculateTotalOir();
    const totalOMKM = calculateTotalOmKm();
    const upkSum =
      parseFloat(totalOKK) + parseFloat(totalOG) + parseFloat(totalOIR);

    // Check if OKK, OG, and OIR sums are all blank or zero
    if (!totalOKK && !totalOG && !totalOIR) {
      return "0";
    }

    // Check if the sum of OKK, ORKK, OPKM, and UPK is zero
    if (upkSum === 0) {
      return "0";
    }

    // Handling cases based on UPK values
    if (upkSum < 0) {
      // When UPK is less than zero, return negative OMKM / OKK (avoiding division by zero)
      return totalOKK !== 0
        ? (-parseFloat(totalOMKM) / parseFloat(totalOKK)).toFixed(2)
        : "0";
    } else if (upkSum === 0) {
      // When UPK is zero, calculate OMKM / (OG + OIR)
      const ogOirSum = parseFloat(totalOG) + parseFloat(totalOIR);
      return ogOirSum !== 0
        ? (parseFloat(totalOMKM) / ogOirSum).toFixed(2)
        : "0";
    } else {
      // Otherwise, calculate OMKM / UPK
      return (parseFloat(totalOMKM) / upkSum).toFixed(2);
    }
  };

  // FORMAT NUMBERS WITH DOTTS
  const formatNumberWithDots = (number) => {
    // First, ensure the number is rounded to remove any decimals
    const roundedNumber = Math.round(number);
    // Convert the number to a string and format it with dots for thousands separators
    return roundedNumber.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  };

  // FONT
  const adjustFontSize = (content) => {
    let fontSize = 16; // Default font size
    if (content && content.length > 5) {
      fontSize = 13; // Smaller font size for longer content
    }
    if (content && content.length > 8) {
      fontSize = 12; // Even smaller font size for very long content
    }
    if (content && content.length > 9) {
      fontSize = 11; // Even smaller font size for very long content
    }
    if (content && content.length > 10) {
      fontSize = 10; // Even smaller font size for very long content
    }
    return { fontSize: `${fontSize}px` };
  };

  // Check if rowData is available
  if (!rowData) {
    return <div></div>;
  }

  const { monthlyData } = rowData;

  const CellHeadingStyle = {
    borderRight: "2px solid #0c1520",
    borderBottom: "2px solid #0c1520",
    borderTop: "2px solid #0c1520", // Added top border
    width: "6rem",
    // cursor: "help",
    fontSize: "16px",
    fontWeight: "bold",
    padding: "0.1rem",
    backgroundColor: "#7BA8FF",
  };

  const CellHeadingStyle2 = {
    borderRight: "2px solid #0c1520",
    borderBottom: "2px solid #0c1520",
    borderTop: "2px solid #0c1520",
    width: "6rem",
    // cursor: "help",
    fontSize: "16px",
    fontWeight: "bold",
    padding: "0.1rem",
    backgroundColor: "#7bc9ff",
  };

  const CellHeadingStyle3 = {
    borderRight: "2px solid #0c1520",
    borderBottom: "2px solid #0c1520",
    borderTop: "2px solid #0c1520",
    borderLeft: "2px solid #0c1520",
    width: "3rem",
    // cursor: "help",
    fontSize: "16px",
    fontWeight: "bold",
    padding: "0.1rem",
    backgroundColor: "#7bc9ff",
  };

  const CellStyle = {
    borderRight: "2px solid #0c1520",
    borderBottom: "2px solid #0c1520",
    borderLeft: "2px solid #0c1520",
    fontSize: "15px",
    width: "6rem",
    minWidth: 30,
    maxWidth: 30,
    padding: "0.1rem",
  };

  return (
    <div style={{ padding: "1%" }}>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={CellHeadingStyle3} align="center">
                God
              </TableCell>
              <Tooltip title="Mjesec">
                <TableCell
                  sx={{ ...CellHeadingStyle3, width: "2rem" }}
                  align="center"
                >
                  MM
                </TableCell>
              </Tooltip>
              <TableCell sx={CellHeadingStyle} align="center">
                PNC
              </TableCell>
              <TableCell sx={CellHeadingStyle} align="center">
                PM %
              </TableCell>
              <TableCell sx={CellHeadingStyle} align="center">
                MSA
              </TableCell>
              <TableCell sx={CellHeadingStyle} align="center">
                VPC
              </TableCell>
              <TableCell sx={CellHeadingStyle} align="center">
                PPR
              </TableCell>
              <TableCell sx={CellHeadingStyle} align="center">
                P.P.K
              </TableCell>
              <TableCell sx={CellHeadingStyle} align="center">
                PPKM
              </TableCell>
              <TableCell sx={CellHeadingStyle} align="center">
                PM2 %
              </TableCell>
              <TableCell sx={CellHeadingStyle2} align="center">
                OKK
              </TableCell>
              <TableCell sx={CellHeadingStyle2} align="center">
                ORK K
              </TableCell>
              <TableCell sx={CellHeadingStyle2} align="center">
                OPKM
              </TableCell>
              <TableCell sx={CellHeadingStyle2} align="center">
                OP%
              </TableCell>
              <TableCell sx={CellHeadingStyle2} align="center">
                OM KM
              </TableCell>
              <TableCell sx={CellHeadingStyle2} align="center">
                OG
              </TableCell>
              <TableCell sx={CellHeadingStyle2} align="center">
                OIR
              </TableCell>
              <TableCell sx={CellHeadingStyle2} align="center">
                UPK
              </TableCell>
              <TableCell sx={CellHeadingStyle2} align="center">
                OM/M%
              </TableCell>
              <TableCell sx={CellHeadingStyle2} align="center">
                T/G/I
              </TableCell>
              <TableCell sx={CellHeadingStyle2} align="center">
                OT%
              </TableCell>
              <TableCell sx={CellHeadingStyle2} align="center">
                OM/kom
              </TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {monthlyData.map((data, index) => (
              <TableRow key={index}>
                {/* GODINA */}
                <TableCell align="center" sx={CellStyle}>
                  {selectedYear}
                </TableCell>
                {/* MJESEC */}
                <TableCell align="center" sx={CellStyle}>
                  {index + 1}
                </TableCell>
                {/* PNC */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#98FB98",
                    ...CellStyle,
                  }}
                >
                  <TextField
                    value={pncValues[index]}
                    onChange={(e) =>
                      handleInputChange(e.target.value, index, "pnc")
                    }
                    size="small"
                    InputProps={{
                      style: {
                        fontSize: "12px",
                        padding: "2px 2px",
                      },
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

                {/* PM% */}
                <TableCell align="center" sx={CellStyle}>
                  {calculatePmPercentage(
                    pncValues[index],
                    vpcValues[index],
                    msaValues[index]
                  ) !== ""
                    ? `${calculatePmPercentage(
                        pncValues[index],
                        vpcValues[index],
                        msaValues[index]
                      )}`
                    : ""}
                </TableCell>
                {/* MSA */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#98FB98", // Adjust the background color as needed
                    ...CellStyle,
                  }}
                >
                  <TextField
                    value={msaValues[index]}
                    onChange={(e) =>
                      handleInputChange(e.target.value, index, "msa")
                    }
                    size="small"
                    InputProps={{
                      style: {
                        fontSize: "12px", // Smaller font size
                        padding: "2px 2px", // Reduced padding
                      },
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
                {/* VPC */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#98FB98",
                    ...CellStyle,
                  }}
                >
                  <TextField
                    value={vpcValues[index]}
                    onChange={(e) =>
                      handleInputChange(e.target.value, index, "vpc")
                    }
                    size="small"
                    InputProps={{
                      style: {
                        fontSize: "12px", // Smaller font size
                        padding: "2px 2px", // Reduced padding
                      },
                    }}
                    sx={{
                      height: "1rem", // Reduced height of the TextField for a more compact look
                      "& .MuiInputBase-input": {
                        height: "1rem", // Adjust the height of the input field directly for more control
                        padding: "0px 0px", // Further reduce padding inside the input field if necessary
                      },
                    }} // Adjust height of the TextField
                  />
                </TableCell>
                {/* PPR */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#98FB98",
                    ...CellStyle,
                  }}
                >
                  <TextField
                    value={pprValues[index]}
                    onChange={(e) =>
                      handleInputChange(e.target.value, index, "ppr")
                    }
                    size="small"
                    InputProps={{
                      style: {
                        fontSize: "12px", // Smaller font size
                        padding: "2px 2px", // Reduced padding
                      },
                    }}
                    sx={{
                      height: "1rem", // Reduced height of the TextField for a more compact look
                      "& .MuiInputBase-input": {
                        height: "1rem", // Adjust the height of the input field directly for more control
                        padding: "0px 0px", // Further reduce padding inside the input field if necessary
                      },
                    }} // Adjust height of the TextField
                  />
                </TableCell>

                {/* P.P.K */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#FCDC2A ",
                    ...CellStyle,
                  }}
                >
                  {rowData && rowData.monthlyData && rowData.monthlyData[index]
                    ? formatNumberWithDots(rowData.monthlyData[index].plan)
                    : "N/A"}
                </TableCell>

                {/* PPKM */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#FCDC2A ",
                    ...CellStyle,
                    ...adjustFontSize(
                      calculatePPKM(
                        vpcValues[index],
                        rowData.monthlyData[index].plan,
                        pprValues[index]
                      )
                    ),
                  }}
                >
                  {vpcValues[index] !== "" &&
                  pprValues[index] !== "" &&
                  rowData &&
                  rowData.monthlyData &&
                  rowData.monthlyData[index] &&
                  rowData.monthlyData[index].plan !== ""
                    ? formatNumberWithDots(
                        calculatePPKM(
                          vpcValues[index],
                          rowData.monthlyData[index].plan,
                          pprValues[index]
                        )
                      )
                    : ""}
                </TableCell>

                {/* PM2 % */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#FCDC2A ",
                    ...CellStyle,
                  }}
                >
                  {ppkmValues[index] !== "" && data.plan !== null
                    ? calculatePmPercentage2(
                        ppkmValues[index],
                        pncValues[index],
                        msaValues[index],
                        data.plan
                      )
                    : "0"}
                </TableCell>

                {/* OKK */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#c8e8ff", ...CellStyle }}
                >
                  {okkValues[index]
                    ? formatNumberWithDots(okkValues[index])
                    : ""}
                </TableCell>

                {/* ORK K */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#c8e8ff",
                    ...CellStyle,
                  }}
                >
                  {data.refKolicina
                    ? formatNumberWithDots(data.refKolicina)
                    : "0"}
                </TableCell>

                {/* OPKM */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#c8e8ff",
                    ...CellStyle,
                    ...adjustFontSize(data.promet),
                  }}
                >
                  {data.promet !== null && data.promet !== undefined
                    ? formatNumberWithDots(
                        Number.isFinite(Number(data.promet))
                          ? Number(data.promet).toFixed(0)
                          : ""
                      )
                    : "0"}
                </TableCell>

                {/* OP% */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#c8e8ff",
                    ...CellStyle,
                    ...adjustFontSize(
                      (() => {
                        const opPercentage = calculateOPpercentage(
                          data.promet,
                          ppkmValues[index],
                          okkValues[index],
                          data.gratis,
                          oirValues[index]
                        );

                        if (opPercentage === 0 || isNaN(opPercentage)) {
                          return "0";
                        } else if (opPercentage === "") {
                          return "";
                        } else {
                          const formattedOpPercentage = `${opPercentage.replace(
                            ".",
                            ","
                          )}%`;
                          return formattedOpPercentage;
                        }
                      })()
                    ),
                  }}
                >
                  {(() => {
                    const opPercentage = calculateOPpercentage(
                      data.promet,
                      ppkmValues[index],
                      okkValues[index],
                      data.gratis,
                      oirValues[index]
                    );

                    if (opPercentage === 0 || isNaN(opPercentage)) {
                      return "0";
                    } else if (opPercentage === "") {
                      return "";
                    } else {
                      return `${opPercentage.replace(".", ",")}%`;
                    }
                  })()}
                </TableCell>

                {/* OM KM */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#c8e8ff",
                    ...CellStyle,
                    ...adjustFontSize(
                      calculateOMKM(
                        data.promet,
                        calculateUPK(
                          data.kolicina,
                          data.gratis,
                          oirValues[index]
                        ),
                        okkValues[index],
                        data.gratis,
                        oirValues[index],
                        pncValues[index],
                        msaValues[index],
                        calculateTGI(
                          data.gratis,
                          oirValues[index],
                          pncValues[index]
                        )
                      )
                    ),
                  }}
                >
                  {(() => {
                    const upk = calculateUPK(
                      data.kolicina,
                      data.gratis,
                      oirValues[index]
                    );
                    const tgi = calculateTGI(
                      okkValues[index], // OKK value
                      data.gratis, // OG value from 'gratis'
                      oirValues[index], // OIR value
                      pncValues[index], // PNC value
                      msaValues[index] // MSA value
                    );

                    const omKmResult = calculateOMKM(
                      data.promet,
                      upk,
                      okkValues[index],
                      data.gratis,
                      oirValues[index],
                      pncValues[index],
                      msaValues[index],
                      tgi
                    );

                    return omKmResult !== ""
                      ? formatNumberWithDots(parseFloat(omKmResult).toFixed(0))
                      : "";
                  })()}
                </TableCell>

                {/* OG */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#c8e8ff ",
                    ...CellStyle,
                  }}
                >
                  {data.gratis ? formatNumberWithDots(data.gratis) : ""}
                </TableCell>

                {/* OIR */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#98FB98",
                    ...CellStyle,
                  }}
                >
                  <TextField
                    value={oirValues[index]}
                    onChange={(e) =>
                      handleInputChange(e.target.value, index, "oir")
                    }
                    onBlur={() => handleOirBlur(index)}
                    size="small"
                    InputProps={{
                      style: {
                        fontSize: "12px",
                        padding: "2px 2px",
                      },
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

                {/* UPK */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#c8e8ff",
                    ...CellStyle,
                  }}
                >
                  {(() => {
                    const upkResult = calculateUPK(
                      okkValues[index],
                      data.gratis,
                      oirValues[index]
                    );
                    // If upkResult is not an empty string, format it
                    if (upkResult !== "") {
                      const numericResult = Number(upkResult);
                      return formatNumberWithDots(numericResult);
                    }
                    // If upkResult is an empty string, just return it
                    return upkResult;
                  })()}
                </TableCell>

                {/* OM/M% */}
                <TableCell
                  align="center"
                  sx={{
                    ...CellStyle,
                    backgroundColor: (() => {
                      const opkm = data.promet; // Assuming data.promet is now considered as OPKM
                      const omMPercentage = calculateOM_M_percentage(
                        opkm,
                        okkValues[index],
                        data.gratis,
                        oirValues[index],
                        pncValues[index],
                        msaValues[index]
                      );
                      return parseFloat(omMPercentage.replace("%", "")) < 0
                        ? "#ff0000"
                        : "#c8e8ff";
                    })(),
                    color: (() => {
                      const opkm = data.promet;
                      const omMPercentage = calculateOM_M_percentage(
                        opkm,
                        okkValues[index],
                        data.gratis,
                        oirValues[index],
                        pncValues[index],
                        msaValues[index]
                      );
                      return parseFloat(omMPercentage.replace("%", "")) < 0
                        ? "#ffffff"
                        : "";
                    })(),
                  }}
                >
                  {(() => {
                    const opkm = data.promet;
                    const omMPercentage = calculateOM_M_percentage(
                      opkm,
                      okkValues[index],
                      data.gratis,
                      oirValues[index],
                      pncValues[index],
                      msaValues[index]
                    );
                    return omMPercentage;
                  })()}
                </TableCell>

                {/* T/G/I */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#c8e8ff",
                    ...CellStyle,
                  }}
                >
                  {(() => {
                    // Assuming okkValues corresponds to OKK for each month
                    const tgiResult = calculateTGI(
                      okkValues[index], // OKK value
                      data.gratis, // OG value from 'gratis'
                      oirValues[index], // OIR value
                      pncValues[index], // PNC value
                      msaValues[index] // MSA value
                    );

                    // Check if the result is not "0" and format it for display
                    return tgiResult !== "0"
                      ? formatNumberWithDots(tgiResult)
                      : tgiResult; // Return "0" if the result is "0" to avoid formatting
                  })()}
                </TableCell>

                {/* OT% */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#c8e8ff",
                    ...CellStyle,
                  }}
                >
                  {(() => {
                    // Assuming calculateTGI function is correct and returns a properly formatted TGI value
                    const tgiValue = calculateTGI(
                      okkValues[index], // OKK value
                      data.gratis, // OG value from 'gratis'
                      oirValues[index], // OIR value
                      pncValues[index], // PNC value
                      msaValues[index] // MSA value
                    );
                    const upk = calculateUPK(
                      data.kolicina,
                      data.gratis,
                      oirValues[index]
                    );
                    // Assuming calculateOMKM function is correct and returns OM KM value properly
                    // Ensure to pass the correct parameters if your function definition changes
                    const omKmValue = calculateOMKM(
                      data.promet,
                      upk,
                      okkValues[index],
                      data.gratis,
                      oirValues[index],
                      pncValues[index],
                      msaValues[index],
                      tgiValue
                    );

                    // Calculating OT Percentage with the OM KM and TGI values
                    const otPercentage = calculateOTPercentage(
                      omKmValue,
                      tgiValue
                    );
                    return otPercentage !== "" ? otPercentage : "0%";
                  })()}
                </TableCell>

                {/* OM/kom */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#c8e8ff", ...CellStyle }}
                >
                  {(() => {
                    const upk = calculateUPK(
                      data.kolicina,
                      data.gratis,
                      oirValues[index]
                    );
                    const tgi = calculateTGI(
                      okkValues[index], // OKK value
                      data.gratis, // OG value from 'gratis'
                      oirValues[index], // OIR value
                      pncValues[index], // PNC value
                      msaValues[index] // MSA value
                    );
                    const omkm = calculateOMKM(
                      data.promet,
                      upk,
                      okkValues[index],
                      data.gratis,
                      oirValues[index],
                      pncValues[index],
                      msaValues[index],
                      tgi
                    );
                    return calculateOMPerKom(
                      omkm,
                      data.kolicina,
                      data.gratis,
                      oirValues[index]
                    );
                  })()}
                </TableCell>
              </TableRow>
            ))}

            {/* TOTAL */}
            <TableRow>
              <TableCell align="center" sx={CellStyle}></TableCell>

              <TableCell align="center" sx={CellStyle}></TableCell>

              {/* PNC AVERAGE */}
              <TableCell
                align="left"
                sx={{
                  ...CellStyle,
                  ...adjustFontSize(calculateAveragePnc()),
                }}
              >
                {calculateAveragePnc()}
              </TableCell>

              {/* PM% AVERAGE */}
              <TableCell align="center" sx={CellStyle}>
                {/* {calculateAveragePmPercentage()} % */}
              </TableCell>

              {/* MSA AVERAGE */}
              <TableCell align="left" sx={CellStyle}>
                {calculateAverageMsa()}
              </TableCell>

              {/* VPC AVERAGE */}
              <TableCell align="left" sx={CellStyle}>
                {calculateAverageVpc()}
              </TableCell>

              {/* PPR AVERAGE */}
              <TableCell align="left" sx={CellStyle}>
                {calculateAveragePpr()}%
              </TableCell>

              {/* P.P.K SUM */}
              <TableCell
                align="center"
                sx={{
                  ...CellStyle,
                  ...adjustFontSize(formatNumberWithDots(calculateTotalPpk())),
                }}
              >
                {formatNumberWithDots(calculateTotalPpk())}
              </TableCell>

              {/* PPKM SUM */}
              <TableCell
                align="center"
                sx={{
                  ...CellStyle,
                  ...adjustFontSize(formatNumberWithDots(calculateTotalPpkm())),
                }}
              >
                {formatNumberWithDots(calculateTotalPpkm())}
              </TableCell>

              {/* PM2 % AVERAGE */}
              <TableCell align="center" sx={CellStyle}>
                {calculateAveragePmPercentage2()}
              </TableCell>

              {/* OKK SUM */}
              <TableCell
                align="center"
                sx={{
                  ...CellStyle,
                  ...adjustFontSize(formatNumberWithDots(calculateTotalOkk())),
                }}
              >
                {formatNumberWithDots(calculateTotalOkk())}
              </TableCell>

              {/* ORK K SUM */}
              <TableCell
                align="center"
                sx={{
                  ...CellStyle,
                  ...adjustFontSize(formatNumberWithDots(calculateTotalOrkK())),
                }}
              >
                {formatNumberWithDots(calculateTotalOrkK())}
              </TableCell>

              {/* OPKM SUM */}
              <TableCell
                align="center"
                sx={{
                  ...CellStyle,
                  ...adjustFontSize(
                    formatNumberWithDots(calculateTotalOpkm().toFixed(0))
                  ),
                }}
              >
                {formatNumberWithDots(calculateTotalOpkm().toFixed(0))}
              </TableCell>

              {/* OP% AVERAGE */}
              <TableCell align="center" sx={CellStyle}>
                {(() => {
                  const totalOKK = calculateTotalOkk();
                  const totalOG = calculateTotalOg();
                  const totalOIR = calculateTotalOir();
                  const totalOPKM = calculateTotalOpkm();
                  const totalPPKM = calculateTotalPpkm();

                  const averageOPpercentage = calculateAverageOPpercentage(
                    totalOKK.toString(),
                    totalOG.toString(),
                    totalOIR.toString(),
                    totalOPKM.toString(),
                    totalPPKM.toString()
                  );

                  return averageOPpercentage !== ""
                    ? averageOPpercentage.replace(".", ",") // Use replace to ensure the decimal separator is a comma for consistency
                    : "";
                })()}
              </TableCell>

              {/* OM KM SUM */}
              <TableCell
                align="center"
                sx={{
                  ...CellStyle,
                  ...adjustFontSize(formatNumberWithDots(calculateTotalOmKm())),
                }}
              >
                {formatNumberWithDots(calculateTotalOmKm())}
              </TableCell>

              {/* OG SUM */}
              <TableCell align="center" sx={CellStyle}>
                {formatNumberWithDots(calculateTotalOg())}
              </TableCell>

              {/* OIR SUM */}
              <TableCell align="left" sx={CellStyle}>
                {formatNumberWithDots(calculateTotalOir())}
              </TableCell>

              {/* UPK SUM */}
              <TableCell align="center" sx={{ ...CellStyle }}>
                {formatNumberWithDots(calculateTotalUPK())}
              </TableCell>

              {/* OM/M% AVERAGE */}
              <TableCell
                align="center"
                sx={{
                  ...(calculateAverageOmMPercentage() < 0
                    ? {
                        backgroundColor: "red",
                        color: "white",
                      }
                    : CellStyle), // Apply original CellStyle if the condition is not met
                }}
              >
                {calculateAverageOmMPercentage()}%
              </TableCell>

              {/* T/G/I SUM */}
              <TableCell align="center" sx={CellStyle}>
                {formatNumberWithDots(calculateTotalTGI())}
              </TableCell>

              {/* OTPercentageAverage */}
              <TableCell align="center" sx={CellStyle}>
                {calculateOTPercentageAverage()}
              </TableCell>

              {/* OMkom AVERAGE */}
              <TableCell align="center" sx={CellStyle}>
                {calculateAverageOMPerKom()}
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>

      <div style={{ marginTop: "1%" }}>
        <SavePlanButton onSave={handleSaveData} disabled={isSaveDisabled} />
      </div>
    </div>
  );
}

export default PlaniranjePrometa;
