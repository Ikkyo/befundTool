import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  AppBar,
  Toolbar,
  TextField,
  IconButton,
  Avatar,
  Menu,
  MenuItem,
  Divider,
  Alert,
  CircularProgress,
  styled,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Logout,
  Dashboard as DashboardIcon,
  Person,
  Settings,
  Description,
  Assessment,
} from "@mui/icons-material";

// Styled components
const StyledAppBar = styled(AppBar)(({ theme }) => ({
  background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)`,
  boxShadow: theme.shadows[8],
}));

const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: "calc(100vh - 64px)",
  width: "100%",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  padding: theme.spacing(2),
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(1),
  },
}));

const StyledCard = styled(Card)(({ theme }) => ({
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[10],
  background: alpha(theme.palette.background.paper, 0.95),
  backdropFilter: "blur(10px)",
  width: "100%",
  maxWidth: 600,
  margin: "0 auto",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
    margin: theme.spacing(1),
    borderRadius: theme.spacing(1),
  },
  [theme.breakpoints.up("sm")]: {
    minWidth: 500,
  },
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: alpha(theme.palette.primary.main, 0.3),
    },
    "&:hover fieldset": {
      borderColor: alpha(theme.palette.primary.main, 0.5),
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.primary.main,
    },
  },
}));

const StyledButton = styled(Button)(({ theme }) => ({
  borderRadius: theme.spacing(1.5),
  padding: theme.spacing(1.5, 4),
  textTransform: "none",
  fontSize: "1rem",
  fontWeight: 600,
  boxShadow: theme.shadows[4],
  "&:hover": {
    boxShadow: theme.shadows[8],
    transform: "translateY(-2px)",
  },
  transition: "all 0.3s ease-in-out",
}));

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [code, setCode] = useState("");
  const [isGenerating, setIsGenerating] = useState<string | null>(null);
  const [message, setMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    localStorage.removeItem("authToken");
    sessionStorage.clear();
    handleProfileMenuClose();
    navigate("/login");
  };

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCode(e.target.value);
    if (message) setMessage(null);
  };

  const generateReport = async (reportType: string) => {
    if (!code.trim()) {
      setMessage({ type: "error", text: "Please enter a code first" });
      return;
    }

    setIsGenerating(reportType);
    setMessage(null);

    try {
      // API call to backend
      const response = await fetch("/api/generate-report", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          code: code.trim(),
          reportType: reportType,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate report");
      }

      // Handle file download
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `${reportType}-report-${code}.docx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      setMessage({
        type: "success",
        text: `${reportType} report generated successfully!`,
      });
    } catch (error) {
      console.error("Error generating report:", error);
      setMessage({
        type: "error",
        text: "Failed to generate report. Please try again.",
      });
    } finally {
      setIsGenerating(null);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        backgroundColor: alpha(theme.palette.primary.main, 0.02),
      }}
    >
      {/* App Bar */}
      <StyledAppBar position="static" elevation={0}>
        <Toolbar>
          <DashboardIcon sx={{ mr: 2, fontSize: 28 }} />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, fontWeight: 600 }}
          >
            Report Generator
          </Typography>

          {/* Profile Menu */}
          <IconButton
            onClick={handleProfileMenuOpen}
            color="inherit"
            sx={{ ml: 1 }}
          >
            <Avatar
              sx={{
                width: 32,
                height: 32,
                bgcolor: alpha(theme.palette.common.white, 0.2),
              }}
            >
              <Person />
            </Avatar>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
            transformOrigin={{ vertical: "top", horizontal: "right" }}
          >
            <MenuItem onClick={handleProfileMenuClose}>
              <Person sx={{ mr: 2 }} />
              Profile
            </MenuItem>
            <MenuItem onClick={handleProfileMenuClose}>
              <Settings sx={{ mr: 2 }} />
              Settings
            </MenuItem>
            <Divider />
            <MenuItem onClick={handleLogout}>
              <Logout sx={{ mr: 2 }} />
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </StyledAppBar>

      {/* Main Content */}
      <StyledContainer>
        <StyledCard>
          <CardContent sx={{ p: { xs: 3, sm: 5 } }}>
            {/* Header */}
            <Box textAlign="center" mb={4}>
              <Typography
                variant="h4"
                component="h1"
                gutterBottom
                fontWeight="bold"
                color="primary"
                sx={{ fontSize: { xs: "1.75rem", sm: "2.125rem" } }}
              >
                Generate Reports
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Enter a code and generate your reports
              </Typography>
            </Box>

            {/* Input Field */}
            <Box mb={4}>
              <StyledTextField
                fullWidth
                label="Enter Code"
                value={code}
                onChange={handleCodeChange}
                placeholder="Enter your code here..."
                variant="outlined"
                sx={{ mb: 2 }}
              />
            </Box>

            {/* Message Alert */}
            {message && (
              <Alert severity={message.type} sx={{ mb: 3 }}>
                {message.text}
              </Alert>
            )}

            {/* Buttons */}
            <Box
              display="flex"
              gap={2}
              flexDirection={{ xs: "column", sm: "row" }}
              justifyContent="center"
              width="100%"
            >
              <StyledButton
                variant="contained"
                startIcon={
                  isGenerating === "Standard" ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Description />
                  )
                }
                onClick={() => generateReport("Standard")}
                disabled={isGenerating !== null}
                sx={{ flex: { sm: 1 }, width: { xs: "100%" } }}
              >
                {isGenerating === "Standard"
                  ? "Generating..."
                  : "Generate Standard Report"}
              </StyledButton>

              <StyledButton
                variant="outlined"
                startIcon={
                  isGenerating === "Detailed" ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <Assessment />
                  )
                }
                onClick={() => generateReport("Detailed")}
                disabled={isGenerating !== null}
                sx={{ flex: { sm: 1 }, width: { xs: "100%" } }}
              >
                {isGenerating === "Detailed"
                  ? "Generating..."
                  : "Generate Detailed Report"}
              </StyledButton>
            </Box>

            {/* Info */}
            <Box mt={4} textAlign="center">
              <Typography variant="body2" color="text.secondary">
                Reports will be automatically downloaded once generated
              </Typography>
            </Box>
          </CardContent>
        </StyledCard>
      </StyledContainer>
    </Box>
  );
};

export default Dashboard;
