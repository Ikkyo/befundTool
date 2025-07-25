import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  Alert,
  InputAdornment,
  IconButton,
  Divider,
  Link,
  styled,
  useTheme,
  alpha,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Lock,
  Person,
  Login as LoginIcon,
} from "@mui/icons-material";

// Styled components
const StyledContainer = styled(Box)(({ theme }) => ({
  minHeight: "100vh",
  width: "100vw",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  background: `linear-gradient(135deg, ${alpha(
    theme.palette.primary.main,
    0.1
  )} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
  padding: theme.spacing(2),
  position: "relative",
  overflow: "hidden",
}));

const StyledCard = styled(Card)(({ theme }) => ({
  width: "100%",
  maxWidth: 500,
  borderRadius: theme.spacing(2),
  boxShadow: theme.shadows[10],
  backdropFilter: "blur(10px)",
  background: alpha(theme.palette.background.paper, 0.95),
  margin: "0 auto",
  [theme.breakpoints.down("sm")]: {
    maxWidth: "100%",
    margin: theme.spacing(1),
    borderRadius: theme.spacing(1),
  },
  [theme.breakpoints.up("sm")]: {
    minWidth: 400,
  },
}));

const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(4),
  "&:last-child": {
    paddingBottom: theme.spacing(4),
  },
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  width: "100%",
  [theme.breakpoints.down("sm")]: {
    padding: theme.spacing(3),
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
  borderRadius: theme.spacing(1),
  padding: theme.spacing(1.5, 2),
  textTransform: "none",
  fontSize: "1rem",
  fontWeight: 600,
  boxShadow: theme.shadows[4],
  "&:hover": {
    boxShadow: theme.shadows[8],
    transform: "translateY(-2px)",
  },
  transition: "all 0.2s ease-in-out",
}));

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();
  const theme = useTheme();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleTogglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      // Basic validation
      if (!formData.email || !formData.password) {
        throw new Error("Please fill in all fields");
      }

      if (!formData.email.includes("@")) {
        throw new Error("Please enter a valid email address");
      }

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // For demo purposes, accept any email/password combination
      console.log("Login attempt:", formData);

      // Navigate to dashboard or home page after successful login
      navigate("/dashboard");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <StyledContainer>
      <StyledCard>
        <StyledCardContent>
          {/* Header */}
          <Box
            display="flex"
            flexDirection="column"
            alignItems="center"
            mb={3}
            width="100%"
          >
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              width={60}
              height={60}
              borderRadius="50%"
              bgcolor={alpha(theme.palette.primary.main, 0.1)}
              mb={2}
            >
              <LoginIcon
                sx={{
                  fontSize: 30,
                  color: theme.palette.primary.main,
                }}
              />
            </Box>
            <Typography
              variant="h4"
              component="h1"
              gutterBottom
              textAlign="center"
              fontWeight="bold"
              color="primary"
            >
              Welcome Back
            </Typography>
            <Typography
              variant="body1"
              color="text.secondary"
              textAlign="center"
            >
              Please sign in to your account
            </Typography>
          </Box>

          {/* Error Alert */}
          {error && (
            <Alert severity="error" sx={{ mb: 3, width: "100%" }}>
              {error}
            </Alert>
          )}

          {/* Login Form */}
          <Box component="form" onSubmit={handleSubmit} width="100%">
            <StyledTextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Person color="action" />
                  </InputAdornment>
                ),
              }}
              disabled={isLoading}
            />

            <StyledTextField
              fullWidth
              label="Password"
              name="password"
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={handleInputChange}
              margin="normal"
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Lock color="action" />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      onClick={handleTogglePasswordVisibility}
                      edge="end"
                      disabled={isLoading}
                    >
                      {showPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              disabled={isLoading}
            />

            <Box mt={3} mb={2} width="100%">
              <StyledButton
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={isLoading}
                startIcon={<LoginIcon />}
              >
                {isLoading ? "Signing In..." : "Sign In"}
              </StyledButton>
            </Box>
          </Box>

          <Divider sx={{ my: 3, width: "100%" }}>
            <Typography variant="body2" color="text.secondary">
              OR
            </Typography>
          </Divider>

          {/* Additional Options */}
          <Box textAlign="center" width="100%">
            <Link
              component="button"
              variant="body2"
              onClick={() => {
                // Handle forgot password
                console.log("Forgot password clicked");
              }}
              sx={{
                textDecoration: "none",
                "&:hover": {
                  textDecoration: "underline",
                },
              }}
            >
              Forgot your password?
            </Link>
          </Box>

          <Box textAlign="center" mt={2} width="100%">
            <Typography variant="body2" color="text.secondary">
              Don't have an account?{" "}
              <Link
                component="button"
                variant="body2"
                onClick={() => {
                  // Navigate to signup page
                  navigate("/signup");
                }}
                sx={{
                  textDecoration: "none",
                  fontWeight: 600,
                  "&:hover": {
                    textDecoration: "underline",
                  },
                }}
              >
                Sign up here
              </Link>
            </Typography>
          </Box>
        </StyledCardContent>
      </StyledCard>
    </StyledContainer>
  );
};

export default LoginPage;
