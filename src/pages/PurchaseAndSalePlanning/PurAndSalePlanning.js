import Paspheading from "./components/Paspheading";
import ItemSelection from "./components/ItemSelection";
import { TableProvider } from "./contexts/TableContext";
import "./PurAndSalePlanning.css";
import React, { useState } from "react";

function PurchaseAndSalePlanning() {
  const currentYear = new Date().getFullYear().toString();
  const [selectedYear, setSelectedYear] = useState(currentYear);

  return (
    <div>
      <TableProvider>
        <Paspheading onSelectYear={setSelectedYear} />
        <ItemSelection selectedYear={selectedYear} />
      </TableProvider>
    </div>
  );
}

export default PurchaseAndSalePlanning;
