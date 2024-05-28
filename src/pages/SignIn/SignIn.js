import React, { useState } from "react";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import CircularProgress from "@mui/material/CircularProgress";
import logo from "../../../src/assets/g3_spirits_doo_logo.jpg";
import { useAuth } from "../../auth/AuthContext";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import Stack from "@mui/material/Stack";

function SignIn() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loginError, setLoginError] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    const data = new FormData(event.currentTarget);
    const email = data.get("email");
    const password = data.get("password");

    try {
      const response = await fetch(
        "http://192.168.2.100/ERP-API/public/api/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) throw new Error("Network response was not ok");

      const { access_token } = await response.json();
      login(access_token);

      navigate("/purandsaleplanning");
      setLoginError(false);
    } catch (error) {
      console.error("Error during login:", error);
      setLoginError(true);
    } finally {
      setLoading(false);
    }
  };

  const theme = createTheme();
  return (
    <ThemeProvider theme={theme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
          }}
        >
          <img
            src={logo}
            alt="Logo"
            style={{
              margin: "8px",
              borderRadius: "50%",
              height: "10rem",
            }}
          />
          <Typography component="h1" variant="h5" style={{ color: "#1a4b6e" }}>
            Prijava korisnika
          </Typography>
          {loginError && (
            <Stack sx={{ width: "100%", marginTop: "5%" }} spacing={2}>
              <Alert severity="error">
                Došlo je do pogreške prilikom prijave
              </Alert>
            </Stack>
          )}

          <Box
            component="form"
            noValidate
            onSubmit={handleSubmit}
            sx={{ mt: 3 }}
          >
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Adresa"
              name="email"
              autoComplete="email"
              autoFocus
            />

            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="Lozinka"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="Zapamti me"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
              disabled={loading}
            >
              {loading ? <CircularProgress size={24} /> : "Prijavi se"}
            </Button>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}

export default SignIn;
