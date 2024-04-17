import { IoChevronBack } from "react-icons/io5";
import YearSelection from "./YearSelection";
import TableSelect from "./TableSelect";
import LogoutIcon from "@mui/icons-material/Logout";
import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../auth/AuthContext";
import { IconButton } from "@mui/material";

function Paspheading({ onSelectYear }) {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const handleLogout = () => {
    logout(); // This should clear the token from localStorage
    navigate("/login"); // Redirect to login page after logout
  };

  return (
    <div className="as_header2">
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            width: "60%",
          }}
        >
          <div style={{ display: "flex", alignItems: "center" }}>
            <IoChevronBack style={{ height: "100%" }} />
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginLeft: "8px",
                padding: "0 8px",
                height: "100%",
              }}
            >
              Planiranje nabavke i prodaje
            </div>
          </div>

          <TableSelect />
          <YearSelection onSelectYear={onSelectYear} />
        </div>
        <IconButton
          onClick={handleLogout}
          style={{ color: "white", cursor: "pointer", transform: "scale(1)" }}
          title="Odjavi se"
          sx={{
            "&:hover": {
              transform: "scale(1.2)",
              transition: "transform 0.3s ease-in-out",
            },
          }}
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
