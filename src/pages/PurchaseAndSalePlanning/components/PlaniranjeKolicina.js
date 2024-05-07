import React from "react";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { useEffect } from "react";
import {
  CellHeadingStyle,
  CellHeadingStyle2,
  CellHeadingStyle3,
  CellStyle,
} from "./TableStyles";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";

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
  if (OUKom === null) {
    return "";
  }

  const percentage = (OUKM / puKM - 1) * 100;

  if (puKM === 0) {
    return "0";
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
  if (plan === 0) {
    return "0";
  }
  if (ODP === null) {
    return "";
  }
  const percentage = (ODP / dneProm - 1) * 100;

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
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const isFutureMonth = month > currentMonth;
  const isCurrentMonth = month === currentMonth;

  if (plan === 0) {
    return 9999;
  } else if (isFutureMonth) {
    return zalihe / dnevnaProdaja;
  } else if (isCurrentMonth) {
    return zalihe / dnevnaProdaja;
  } else {
    if (ODP === 0) {
      return 9999;
    } else {
      return (zalihe / ODP).toFixed(0);
    }
  }
};

const calculateTZKo = (month, OI, plan, zalihe, pUvoz, OUKom) => {
  const today = new Date();
  const currentMonth = today.getMonth() + 1;
  const isCurrentOrFutureMonth = month >= currentMonth;
  const isOverPlan = OI > plan;

  if (isCurrentOrFutureMonth && isOverPlan) {
    return zalihe + pUvoz - OI;
  } else if (isCurrentOrFutureMonth && !isOverPlan) {
    return zalihe + pUvoz - plan;
  } else {
    return zalihe + OUKom - OI;
  }
};

const calculatePotrebneZalihe = (dneProm, Koe, MinBr) => {
  const potrebneZalihe = dneProm * Koe * MinBr;
  return potrebneZalihe.toFixed(0);
};

const calculateMZKM = (pUvoz, FC) => {
  const MZKM = pUvoz * FC;

  return MZKM.toFixed(0);
};

const PlaniranjeKolicina = ({ selectedYear }) => {
  return (
    <div style={{ padding: "1%" }}>
      <TableContainer component={Paper} sx={{ marginTop: 2 }}>
        <Table>
          <TableHead>
            <TableRow>
              <Tooltip title="Mjesec Godina">
                <TableCell sx={CellHeadingStyle3} align="center">
                  MG
                </TableCell>
              </Tooltip>

              <Tooltip title="Zalihe na početku mjeseca">
                <TableCell
                  sx={{ ...CellHeadingStyle3, width: "2rem" }}
                  align="center"
                >
                  Zal.1.1.24
                </TableCell>
              </Tooltip>

              <Tooltip title="Prodaja prethodne godine">
                <TableCell sx={CellHeadingStyle3} align="center">
                  Pro.P.G
                </TableCell>
              </Tooltip>

              <Tooltip title="Postotak uvoza u tekućoj godini na prethodnu godinu">
                <TableCell sx={CellHeadingStyle3} align="center">
                  %
                </TableCell>
              </Tooltip>

              <Tooltip title="Plan prodaje komada za tekuću godinu po mjesecima">
                <TableCell sx={CellHeadingStyle3} align="center">
                  Plan
                </TableCell>
              </Tooltip>

              <Tooltip title="Planirana dnevna prodaja komada proizvoda">
                <TableCell sx={CellHeadingStyle3} align="center">
                  Dne Pro
                </TableCell>
              </Tooltip>

              <Tooltip title="Planirani uvoz komada">
                <TableCell sx={CellHeadingStyle3} align="center">
                  P.Uvoz
                </TableCell>
              </Tooltip>

              <Tooltip title="Fakturna cijena proizvoda">
                <TableCell sx={CellHeadingStyle3} align="center">
                  FC
                </TableCell>
              </Tooltip>

              <Tooltip title="Planirani uvoz u Konvertibilnim markama">
                <TableCell sx={CellHeadingStyle3} align="center">
                  PU KM
                </TableCell>
              </Tooltip>

              <Tooltip title="Ostvareni uvoz komada">
                <TableCell sx={CellHeadingStyle3} align="center">
                  OU Kom
                </TableCell>
              </Tooltip>

              <Tooltip title="Ostvareni uvoz u konvertibilnim markama">
                <TableCell sx={CellHeadingStyle3} align="center">
                  OU KM
                </TableCell>
              </Tooltip>

              <Tooltip title="Postotak planiranog uvoza i ostvarenog uvoza">
                <TableCell sx={CellHeadingStyle3} align="center">
                  %
                </TableCell>
              </Tooltip>

              <Tooltip title="Ostvareni izlaz robe">
                <TableCell sx={CellHeadingStyle3} align="center">
                  O I
                </TableCell>
              </Tooltip>

              <Tooltip title="Ostvarena dnevna prodaja komada">
                <TableCell sx={CellHeadingStyle3} align="center">
                  O D P
                </TableCell>
              </Tooltip>

              <Tooltip title="Postotak ostvarenog izlaza  na  plan ulaza u tekućoj godini">
                <TableCell sx={CellHeadingStyle3} align="center">
                  %OI/M
                </TableCell>
              </Tooltip>

              <Tooltip title="Postotak ostvarenog izlaza proizvoda  tekuća godina na prethodnu godinu">
                <TableCell sx={CellHeadingStyle3} align="center">
                  %OI/G
                </TableCell>
              </Tooltip>

              <Tooltip title="Trenutna zaliha na carinskim skladištu ne ocarinjene robe">
                <TableCell sx={CellHeadingStyle3} align="center">
                  TZZO
                </TableCell>
              </Tooltip>

              <Tooltip title="Trenutna zaliha ocarinjenog na svim skladištima">
                <TableCell sx={CellHeadingStyle3} align="center">
                  TZOC
                </TableCell>
              </Tooltip>

              <Tooltip title="Zalihe broj dana u tekućem mjesecu bez uvoza proizvoda u tekućem mjesecu">
                <TableCell sx={CellHeadingStyle3} align="center">
                  Z Br,da
                </TableCell>
              </Tooltip>

              <Tooltip title="Zaliha na mjesečnoj razini na kraju mjeseca">
                <TableCell sx={CellHeadingStyle3} align="center">
                  TZ Ko
                </TableCell>
              </Tooltip>

              <Tooltip title="Koeficijent koji je vezan za broj dana zaliha, početni 1,75">
                <TableCell sx={CellHeadingStyle3} align="center">
                  Koe
                </TableCell>
              </Tooltip>

              <Tooltip title="Min. broj dana zaliha u tekućem mjesecu Početni 14">
                <TableCell sx={CellHeadingStyle3} align="center">
                  Min br
                </TableCell>
              </Tooltip>

              <Tooltip title="Potrebne zalihe po planu prodaje proizvoda. Potrebno na dupli klik moći upisati podatke po mjesecima: 1. Koeficijent broja dana 2. Minimalan broj dana zaliha 3. Max broj dana zaliha">
                <TableCell sx={CellHeadingStyle3} align="center">
                  Potreb.Z
                </TableCell>
              </Tooltip>

              <Tooltip title="Potrebna financijska sredstva za nabavku robe u tekućem mjesecu">
                <TableCell sx={CellHeadingStyle3} align="center">
                  M,Z KM
                </TableCell>
              </Tooltip>
            </TableRow>
          </TableHead>

          <TableBody>
            <TableRow>
              {/* MJESEC GODINA */}
              <TableCell align="center" sx={CellStyle}>
                {selectedYear}
              </TableCell>

              {/* ZAL*/}
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#FCDC2A ",
                  ...CellStyle,
                }}
              >
                44387
              </TableCell>

              {/* Pro.P.G */}
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#FCDC2A ",
                  ...CellStyle,
                }}
              >
                16698
              </TableCell>

              {/* % */}
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#c8e8ff",
                  ...CellStyle,
                }}
              ></TableCell>
              {/* Plan */}
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#98FB98",
                  ...CellStyle,
                }}
              >
                {" "}
                <TextField
                  //   value={pncValues[index]}
                  //   onChange={(e) =>
                  //     handleInputChange(e.target.value, index, "pnc")
                  //   }
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
              {/* Dne Pro */}
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#c8e8ff",
                  ...CellStyle,
                }}
              >
                {calculateDnevnaProdajaKomadaProizvoda(16967)}
              </TableCell>

              {/* P.Uvoz */}
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#98FB98 ",
                  ...CellStyle,
                }}
              >
                {" "}
                <TextField
                  //   value={pncValues[index]}
                  //   onChange={(e) =>
                  //     handleInputChange(e.target.value, index, "pnc")
                  //   }
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

              {/* FC */}
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#98FB98",
                  ...CellStyle,
                }}
              >
                {" "}
                <TextField
                  //   value={pncValues[index]}
                  //   onChange={(e) =>
                  //     handleInputChange(e.target.value, index, "pnc")
                  //   }
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

              {/* PU KM */}
              <TableCell
                align="center"
                sx={{ backgroundColor: "#c8e8ff", ...CellStyle }}
              >
                {calculatePlaniraniUvozKM(8.56, 15840)}
              </TableCell>

              {/* OU Kom */}
              <TableCell
                align="center"
                sx={{ backgroundColor: "#FCDC2A", ...CellStyle }}
              >
                15810
              </TableCell>

              {/* OU KM */}
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#c8e8ff", // Feel free to change the color as needed
                  ...CellStyle,
                }}
              >
                {calculateOstvareniUvozKM(15810, 8.56)}
              </TableCell>

              {/* % */}
              <TableCell
                align="center"
                sx={{ backgroundColor: "#c8e8ff", ...CellStyle }}
              >
                {calculatePercentage2(135590, 15810, 135334)}
              </TableCell>

              {/* O I */}
              <TableCell
                align="center"
                sx={{ backgroundColor: "#FCDC2A", ...CellStyle }}
              >
                14023
              </TableCell>

              {/* O D P */}
              <TableCell
                align="center"
                sx={{ backgroundColor: "#c8e8ff", ...CellStyle }}
              >
                {calculateODP(14023)}
              </TableCell>

              {/* %OI/M */}
              <TableCell
                align="center"
                sx={{ backgroundColor: "#c8e8ff", ...CellStyle }}
              >
                {calculateOIperM(
                  16967,
                  calculateODP(14023),
                  calculateDnevnaProdajaKomadaProizvoda(16967)
                )}
                {"%"}
              </TableCell>

              {/* %OI/G */}
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#c8e8ff",
                  ...CellStyle,
                }}
              >
                {calculateOIperG(467, 14023, 17124)}
              </TableCell>

              {/* TZZO */}
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#FCDC2A",
                  ...CellStyle,
                }}
              >
                35382
              </TableCell>

              {/* TZOC */}
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#FCDC2A",
                  ...CellStyle,
                }}
              >
                12000
              </TableCell>

              {/* Z Br,da */}
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#c8e8ff",
                  ...CellStyle,
                }}
              >
                {calculateZBrDa(16967, 1, 45595, 566, 467)}
              </TableCell>

              {/* TZ Ko */}
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#c8e8ff",
                  ...CellStyle,
                }}
              >
                {calculateTZKo(1, 14023, 16967, 45595, 15840, 15810)}
              </TableCell>

              {/* Koe */}
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#98FB98",
                  ...CellStyle,
                }}
              >
                <TextField
                  //   value={pncValues[index]}
                  //   onChange={(e) =>
                  //     handleInputChange(e.target.value, index, "pnc")
                  //   }
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

              {/* Min br */}
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#98FB98",
                  ...CellStyle,
                }}
              >
                <TextField
                  //   value={pncValues[index]}
                  //   onChange={(e) =>
                  //     handleInputChange(e.target.value, index, "pnc")
                  //   }
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

              {/* Potreb.Z */}
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#c8e8ff",
                  ...CellStyle,
                }}
              >
                {calculatePotrebneZalihe(565.567, 1.75, 14)}
              </TableCell>

              {/* M,Z KM */}
              <TableCell
                align="center"
                sx={{
                  backgroundColor: "#c8e8ff",
                  ...CellStyle,
                }}
              >
                {calculateMZKM(15840, 8.56)}
              </TableCell>
            </TableRow>

            {/* TOTAL */}
            <TableRow>
              <TableCell align="center" sx={CellStyle}></TableCell>

              <TableCell align="center" sx={CellStyle}></TableCell>

              {/* Pro.P.G SUM */}
              <TableCell align="center" sx={CellStyle}>
                Test
              </TableCell>

              {/* Postotak uvoza u tekućoj godini na prethodnu godinu */}
              <TableCell align="center" sx={CellStyle}>
                Test
              </TableCell>

              {/* Plan SUM */}
              <TableCell align="center" sx={CellStyle}>
                Test
              </TableCell>

              {/* Planirana dnevna prodaja komada proizvoda SUM */}
              <TableCell align="center" sx={CellStyle}></TableCell>

              {/* PPR AVERAGE */}
              <TableCell align="center" sx={CellStyle}>
                g
              </TableCell>

              {/* P.P.K SUM */}
              <TableCell align="center" sx={CellStyle}>
                h
              </TableCell>

              {/* PPKM SUM */}
              <TableCell align="center" sx={CellStyle}>
                i
              </TableCell>

              {/* PM2 % AVERAGE */}
              <TableCell align="center" sx={CellStyle}>
                j
              </TableCell>

              {/* PMKM SUM */}
              <TableCell align="center" sx={CellStyle}>
                j2
              </TableCell>

              {/* OIK SUM */}
              <TableCell align="center" sx={CellStyle}>
                k
              </TableCell>

              {/* OKK SUM */}
              <TableCell align="center" sx={CellStyle}>
                l
              </TableCell>

              {/* ORK K SUM */}
              <TableCell align="center" sx={CellStyle}>
                m
              </TableCell>

              {/* OPKM SUM */}
              <TableCell align="center" sx={CellStyle}>
                n
              </TableCell>

              {/* OP% AVERAGE */}
              <TableCell align="center" sx={CellStyle}>
                o
              </TableCell>

              {/* OM KM SUM */}
              <TableCell align="center" sx={CellStyle}>
                p
              </TableCell>

              {/* OG SUM */}
              <TableCell align="center" sx={CellStyle}>
                r
              </TableCell>

              {/* OIR SUM */}
              <TableCell align="center" sx={CellStyle}>
                s
              </TableCell>

              {/* UPK SUM */}
              <TableCell align="center" sx={CellStyle}>
                t
              </TableCell>

              {/* OM/M% AVERAGE */}
              <TableCell align="center" sx={CellStyle}>
                u
              </TableCell>

              {/* T/G/I SUM */}
              <TableCell align="center" sx={CellStyle}>
                v
              </TableCell>

              <TableCell align="center" sx={CellStyle}>
                z
              </TableCell>

              <TableCell align="center" sx={CellStyle}>
                x
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default PlaniranjeKolicina;
