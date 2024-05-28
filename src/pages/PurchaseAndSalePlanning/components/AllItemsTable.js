import React from "react";
import Tooltip from "@mui/material/Tooltip";
import { useState } from "react";
import { useEffect } from "react";
import {
  CellHeadingStyle,
  CellHeadingStyle2,
  CellHeadingStyle3,
  CellStyle,
} from "./TableStyles";

import {
  calculatePmPercentage,
  calculatePPKM,
  calculatePmPercentage2,
  calculateOPpercentage,
  calculateOMKM,
  calculateUPK,
  calculateOM_M_percentage,
  calculateTGI,
  calculateOTPercentage,
  calculateOMPerKom,
} from "./Calculations";

import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
} from "@mui/material";
const AllItemsTable = ({ selectedYear }) => {
  const [data, setData] = useState(Array(12).fill(null));

  useEffect(() => {
    const fetchData = async (month) => {
      try {
        const response = await fetch(
          `http://192.168.2.100/ERP-API/public/api/plan/sve/${selectedYear}/${month}`
        );
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const json = await response.json();
        console.log("Data received for month " + month + ":", json.data); // Log the data
        return json.data;
      } catch (error) {
        console.error("Error fetching data for month " + month + ": ", error);
        return null;
      }
    };

    const fetchAllData = async () => {
      const results = await Promise.all(
        Array.from({ length: 12 }, (_, i) => fetchData(i + 1))
      );
      setData(results);
      console.log(results);
    };

    fetchAllData();
  }, []);

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
              <TableCell sx={CellHeadingStyle} align="center">
                PMKM
              </TableCell>
              <TableCell sx={CellHeadingStyle} align="center">
                OIK
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
            {data.map((monthData, index) => (
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
                  {monthData ? monthData.PNC : "Učitavanje..."}
                </TableCell>

                {/* PM% */}
                <TableCell align="center" sx={CellStyle}>
                  {monthData && monthData.PNC && monthData.VPC && monthData.MSA
                    ? calculatePmPercentage(
                        monthData.PNC,
                        monthData.VPC,
                        monthData.MSA
                      )
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
                  {" "}
                  {monthData ? monthData.MSA : "Učitavanje..."}
                </TableCell>
                {/* VPC */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#98FB98",
                    ...CellStyle,
                  }}
                >
                  {monthData ? monthData.VPC : "Učitavanje..."}
                </TableCell>
                {/* PPR */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#98FB98",
                    ...CellStyle,
                  }}
                >
                  {monthData ? monthData.PPR : "Učitavanje..."}
                </TableCell>

                {/* P.P.K */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#FCDC2A ",
                    ...CellStyle,
                  }}
                >
                  {monthData ? monthData.plan : "Učitavanje..."}
                </TableCell>

                {/* PPKM */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#FCDC2A",
                    ...CellStyle,
                  }}
                >
                  {monthData && monthData.VPC && monthData.plan && monthData.PPR
                    ? calculatePPKM(
                        monthData.VPC,
                        monthData.plan,
                        monthData.PPR
                      )
                    : ""}
                </TableCell>

                {/* PM2 % */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#FCDC2A", ...CellStyle }}
                >
                  {monthData &&
                  monthData.PNC &&
                  monthData.MSA &&
                  monthData.plan &&
                  monthData.VPC &&
                  monthData.PPR
                    ? calculatePmPercentage2(
                        calculatePPKM(
                          monthData.VPC,
                          monthData.plan,
                          monthData.PPR
                        ), // PPKM value
                        monthData.PNC,
                        monthData.MSA,
                        monthData.plan
                      )
                    : ""}
                </TableCell>

                {/* PMKM % */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#FCDC2A", ...CellStyle }}
                ></TableCell>

                {/* OIK */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#FCDC2A", // Feel free to change the color as needed
                    ...CellStyle,
                  }}
                >
                  {monthData &&
                  monthData.kolicina !== undefined &&
                  monthData.OIR !== undefined
                    ? monthData.kolicina + monthData.OIR
                    : "Učitavanje..."}
                </TableCell>

                {/* OKK */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#c8e8ff", ...CellStyle }}
                >
                  {monthData ? monthData.kolicina : "Učitavanje..."}
                </TableCell>

                {/* ORK K */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#c8e8ff", ...CellStyle }}
                >
                  {monthData
                    ? monthData.refKolicina.toFixed(0)
                    : "Učitavanje..."}
                </TableCell>

                {/* OPKM */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#c8e8ff", ...CellStyle }}
                >
                  {monthData ? monthData.promet.toFixed(0) : "Učitavanje..."}
                </TableCell>

                {/* OP% */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#c8e8ff", ...CellStyle }}
                >
                  {monthData &&
                  monthData.promet &&
                  monthData.kolicina &&
                  monthData.VPC &&
                  monthData.plan &&
                  monthData.PPR
                    ? calculateOPpercentage(
                        monthData.promet,
                        calculatePPKM(
                          monthData.VPC,
                          monthData.plan,
                          monthData.PPR
                        ), // Calculating PPKM value to use as an input
                        monthData.kolicina
                      )
                    : ""}
                </TableCell>

                {/* OMKM */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#c8e8ff", // Adjust the color as needed
                    ...CellStyle,
                  }}
                >
                  {monthData &&
                  monthData.promet !== undefined &&
                  monthData.kolicina !== undefined &&
                  monthData.gratis !== undefined &&
                  monthData.OIR !== undefined &&
                  monthData.PNC !== undefined &&
                  monthData.MSA !== undefined
                    ? calculateOMKM(
                        monthData.promet.toFixed(0), // Assuming you want OPKM as promet rounded to integer
                        calculateUPK(monthData.kolicina, monthData.gratis),
                        monthData.kolicina,
                        monthData.gratis,
                        monthData.OIR,
                        monthData.PNC,
                        monthData.MSA
                      )
                    : "Učitavanje..."}
                </TableCell>

                {/* OG */}
                <TableCell
                  align="center"
                  sx={{ backgroundColor: "#c8e8ff", ...CellStyle }}
                >
                  {monthData ? monthData.gratis : "Učitavanje..."}
                </TableCell>

                {/* OIR */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#98FB98",
                    ...CellStyle,
                  }}
                >
                  {monthData ? monthData.OIR : "Učitavanje..."}
                </TableCell>

                {/* UPK */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#c8e8ff", // Feel free to adjust the color as needed
                    ...CellStyle,
                  }}
                >
                  {monthData &&
                  monthData.kolicina !== undefined &&
                  monthData.gratis !== undefined
                    ? calculateUPK(monthData.kolicina, monthData.gratis)
                    : "Učitavanje..."}
                </TableCell>

                {/* OM/M% */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#c8e8ff", // Adjust the color as needed
                    ...CellStyle,
                  }}
                >
                  {monthData &&
                  monthData.kolicina !== undefined &&
                  monthData.PNC !== undefined &&
                  monthData.MSA !== undefined
                    ? calculateOM_M_percentage(
                        calculateOMKM(
                          monthData.promet.toFixed(0),
                          calculateUPK(monthData.kolicina, monthData.gratis),
                          monthData.kolicina,
                          monthData.gratis,
                          monthData.OIR,
                          monthData.PNC,
                          monthData.MSA
                        ),
                        monthData.kolicina,
                        monthData.PNC,
                        monthData.MSA
                      )
                    : "Učitavanje..."}
                </TableCell>

                {/* T/G/I */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#c8e8ff", // Feel free to adjust the color as needed
                    ...CellStyle,
                  }}
                >
                  {monthData &&
                  monthData.kolicina !== undefined &&
                  monthData.gratis !== undefined &&
                  monthData.OIR !== undefined &&
                  monthData.PNC !== undefined &&
                  monthData.MSA !== undefined
                    ? calculateTGI(
                        monthData.kolicina,
                        monthData.gratis,
                        monthData.OIR,
                        monthData.PNC,
                        monthData.MSA
                      )
                    : "Učitavanje..."}
                </TableCell>

                {/* OT% */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#c8e8ff", // Adjust the color as needed
                    ...CellStyle,
                  }}
                >
                  {monthData &&
                  monthData.kolicina !== undefined &&
                  monthData.gratis !== undefined &&
                  monthData.OIR !== undefined &&
                  monthData.PNC !== undefined &&
                  monthData.MSA !== undefined &&
                  monthData.promet !== undefined
                    ? calculateOTPercentage(
                        calculateOMKM(
                          monthData.promet.toFixed(0),
                          calculateUPK(monthData.kolicina, monthData.gratis),
                          monthData.kolicina,
                          monthData.gratis,
                          monthData.OIR,
                          monthData.PNC,
                          monthData.MSA
                        ),
                        calculateTGI(
                          monthData.kolicina,
                          monthData.gratis,
                          monthData.OIR,
                          monthData.PNC,
                          monthData.MSA
                        )
                      )
                    : "Učitavanje..."}
                </TableCell>

                {/* OM/kom */}
                <TableCell
                  align="center"
                  sx={{
                    backgroundColor: "#c8e8ff", // Adjust the color as needed
                    ...CellStyle,
                  }}
                >
                  {monthData &&
                  monthData.kolicina !== undefined &&
                  monthData.gratis !== undefined &&
                  monthData.OIR !== undefined &&
                  monthData.promet !== undefined &&
                  monthData.refKolicina !== undefined
                    ? calculateOMPerKom(
                        calculateOMKM(
                          monthData.promet.toFixed(0), // Assuming OPKM is promet rounded to integer
                          calculateUPK(monthData.kolicina, monthData.gratis),
                          monthData.kolicina,
                          monthData.gratis,
                          monthData.OIR,
                          monthData.PNC, // Assuming you need this for OMKM calculation
                          monthData.MSA // Assuming you need this for OMKM calculation
                        ),
                        monthData.kolicina,
                        monthData.gratis,
                        monthData.OIR,
                        monthData.kolicina + monthData.OIR, // This is OIK
                        monthData.refKolicina,
                        monthData.promet,
                        calculateUPK(monthData.kolicina, monthData.gratis)
                      )
                    : "Učitavanje..."}
                </TableCell>
              </TableRow>
            ))}
            {/* TOTAL */}
            <TableRow>
              <TableCell align="center" sx={CellStyle}>
                a
              </TableCell>

              <TableCell align="center" sx={CellStyle}>
                b
              </TableCell>

              {/* PNC AVERAGE */}
              <TableCell align="center" sx={CellStyle}>
                c
              </TableCell>

              {/* PM% AVERAGE */}
              <TableCell align="center" sx={CellStyle}>
                d
              </TableCell>

              {/* MSA AVERAGE */}
              <TableCell align="center" sx={CellStyle}>
                e
              </TableCell>

              {/* VPC AVERAGE */}
              <TableCell align="center" sx={CellStyle}>
                f
              </TableCell>

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

              {/* OTPercentageAverage */}
              <TableCell align="center" sx={CellStyle}>
                z
              </TableCell>

              {/* OMkom AVERAGE */}
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

export default AllItemsTable;
