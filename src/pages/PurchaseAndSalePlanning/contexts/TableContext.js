import React, { useState, createContext } from "react";

export const TableContext = createContext();

export const TableProvider = ({ children }) => {
  const [selectedTable, setSelectedTable] = useState(2);

  return (
    <TableContext.Provider value={{ selectedTable, setSelectedTable }}>
      {children}
    </TableContext.Provider>
  );
};
