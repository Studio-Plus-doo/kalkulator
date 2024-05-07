/*KALKULACIJE*/

export const calculatePmPercentage = (pnc, vpc, msa) => {
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

export const calculatePPKM = (vpc, plan, ppr) => {
  const numericPlan = parseFloat(plan);
  const numericPpr = parseFloat(ppr) / 100; // Converting percentage to a decimal
  const numericVpc = parseFloat(vpc);

  if (!isNaN(numericPlan) && !isNaN(numericPpr) && !isNaN(numericVpc)) {
    if (numericPpr === 1) {
      console.log("PPR is 100%, applying alternative calculation or handling.");
      // Example: Maybe in this case, you want just the plan to be the output or some other business logic
      return numericPlan.toFixed(0); // Or apply any other specific logic for this scenario
    }

    return (numericVpc * (1 - numericPpr) * numericPlan).toFixed(0);
  }
  return "";
};

export const calculatePmPercentage2 = (ppkm, pnc, msa, ppk) => {
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

  const result =
    (numericPpkm / ((numericPnc + numericMsa) * numericPpk) - 1) * 100;

  return result.toFixed(2);
};

export const calculateOPpercentage = (opkm, ppkm, okk) => {
  const numericOpkm = parseFloat(opkm);
  const numericPpkm = parseFloat(ppkm);

  if (okk === "") {
    return "0";
  }

  if (numericPpkm === 0) {
    return "0";
  }

  const result = numericOpkm / numericPpkm;

  if (isFinite(result)) {
    return (result * 100).toFixed(2);
  } else {
    return "0";
  }
};

export const calculateOMKM = (opkm, upk, okk, og, oir, pnc, msa, tgi) => {
  const numericOpkm = parseFloat(opkm) || 0; // OPKM
  const numericUpk = parseFloat(upk) || 0; // UPK
  const numericOkk = parseFloat(okk) || 0; // OKK
  const numericOg = parseFloat(og) || 0; // OG
  const numericOir = parseFloat(oir) || 0; // OIR
  const numericPnc = parseFloat(pnc) || 0; // PNC
  const numericMsa = parseFloat(msa) || 0; // MSA
  const rateIncrease = 1.24; // This represents the 24% increase (1 + 24%)

  if (numericOkk === 0) {
    // Check if OKK is 0
    return "0";
  } else {
    return (
      numericOpkm -
      numericUpk * (numericPnc + numericMsa) -
      numericOg * (numericPnc + numericMsa) * rateIncrease -
      numericOir * (numericPnc + numericMsa)
    ).toFixed(2);
  }
};

export const calculateUPK = (okk, og, oir) => {
  const numericOkk = parseFloat(okk || 0);
  const numericOg = parseFloat(og || 0);

  const difference = numericOkk - numericOg;

  if (numericOkk === 0) {
    return "0";
  }

  return difference;
};

export const calculateOM_M_percentage = (omkm, okk, pnc, msa) => {
  // console.log("VRIJEDNOSTI OMKM,OKK,PNC,MSA : ", omkm, okk, pnc, msa);
  const numericOkk = parseFloat(okk);
  const numericOmkm = parseFloat(omkm);
  const numericPnc = parseFloat(pnc);
  const numericMsa = parseFloat(msa);

  // Additional check to ensure PNC and MSA are numbers and their sum is not zero
  if (isNaN(numericPnc) || isNaN(numericMsa) || numericPnc + numericMsa === 0) {
    return ""; // Return an empty string if PNC or MSA is not a number or their sum is zero
  }

  if (numericOkk === 0) {
    return ""; // Return an empty string if OKK is 0
  } else if (numericOkk < 0) {
    return (
      ((-numericOmkm / numericOkk / (numericPnc + numericMsa)) * 100).toFixed(
        2
      ) + "%"
    ); // Formula when OKK is negative
  } else if (numericOkk === "" || isNaN(numericOkk)) {
    return "0"; // Return "0" if OKK is an empty string or not a number
  } else {
    return (
      ((numericOmkm / numericOkk / (numericPnc + numericMsa)) * 100).toFixed(
        2
      ) + "%"
    ); // Standard formula
  }
};

export const calculateTGI = (okk, og, oir, pnc, msa) => {
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

export const calculateOTPercentage = (omkm, tgi) => {
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
  return isFinite(otPercentage) ? (otPercentage * 100).toFixed(2) + "%" : "0%";
};

export const calculateOMPerKom = (
  omkm,
  okk,
  og,
  oir,
  kolicina,
  orkk,
  opkm,
  upk
) => {
  // Convert all inputs to numbers, treating empty strings or undefined values as zero
  const numericOmkm = parseFloat(omkm) || 0;
  const numericOkk = parseFloat(okk) || 0;
  const numericOg = parseFloat(og) || 0;
  const numericOir = parseFloat(oir) || 0;
  const numericKolicina = parseFloat(kolicina) || 0;
  const numericOrkk = parseFloat(orkk) || 0;
  const numericOpkm = parseFloat(opkm) || 0;
  const numericUpk = parseFloat(upk) || 0;

  // Check if all values are effectively zero or blank
  if (!okk && !og && !oir) {
    return "";
  }

  // Calculate the sum of the related values
  const sum =
    numericKolicina +
    numericOrkk +
    numericOpkm +
    numericOg +
    numericOir +
    numericUpk;

  // Return an empty string if the sum is zero to avoid division by zero
  if (sum === 0) {
    return "";
  }

  // Apply conditional logic based on the value of OKK and OMKM
  if (numericOkk < 0) {
    return (-numericOmkm / numericOkk).toFixed(2);
  } else if (numericOmkm < 0) {
    return (numericOmkm / numericOkk).toFixed(2);
  } else {
    return (numericOmkm / numericOkk).toFixed(2);
  }
};
