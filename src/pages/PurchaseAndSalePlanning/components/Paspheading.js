import { IoChevronBack } from "react-icons/io5";
import YearSelection from "./YearSelection";
import TableSelect from "./TableSelect";
import LogoutIcon from "@mui/icons-material/Logout";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import { IconButton } from "@mui/material";
import NaprednoPretrazivanjeModal from "./NaprednoPretrazivanjeModal"; // Import the new component

function Paspheading({ onSelectYear }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <div className="as_header2">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "50%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <IoChevronBack style={{ height: "100%" }} />
            <div
              style={{
                marginLeft: "8px",
                height: "100%",
                fontSize: "18px",
              }}
            >
              Planiranje nabavke i prodaje
            </div>
          </div>
          <TableSelect />
          <NaprednoPretrazivanjeModal />{" "}
          {/* Replace the existing button with the modal trigger component */}
          <YearSelection onSelectYear={onSelectYear} />
        </div>
        <IconButton
          onClick={handleLogout}
          style={{ color: "white", cursor: "pointer", transform: "scale(1)" }}
          title="Odjavi se"
        >
          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            Odjavite se
            <LogoutIcon fontSize="large" />
          </div>
        </IconButton>
      </div>
    </div>
  );
}

export default Paspheading;
