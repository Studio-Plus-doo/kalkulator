import React, { useState, createContext } from "react";

export const TableContext = createContext();

export const TableProvider = ({ children }) => {
  const [selectedTable, setSelectedTable] = useState(1);

  return (
    <TableContext.Provider value={{ selectedTable, setSelectedTable }}>
      {children}
    </TableContext.Provider>
  );
};
