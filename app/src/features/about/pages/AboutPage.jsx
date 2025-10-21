import React from "react";
import { Link } from "react-router-dom";
import { Container, Box, Typography, Grid2, Divider, Button } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import SearchIcon from "@mui/icons-material/Search";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import ReportProblemOutlinedIcon from "@mui/icons-material/ReportProblemOutlined";
import { ShareTwoTone } from "@mui/icons-material";

const AboutPage = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "white" }}>
      <Container maxWidth="md" sx={{ py: { xs: 10, md: 10 } }}>
        <Box sx={{ mb: 10 }}>
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.02em",
              fontSize: { xs: "3rem", md: "3rem" },
              mb: 1,
              textAlign: "center"
            }}
          >
            Did you know?
          </Typography>
        </Box>

        <Box sx={{ mb: 5 }}>
          <Grid2 container spacing={6} sx={{ mb: 6, alignItems: "stretch" }}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src="/images/cat.png"
                alt="Lost pet in shelter"
                sx={{
                  width: "100%",
                  height: { xs: "350px", md: "420px" },
                  objectFit: "cover",
                  borderRadius: 2,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", height: { xs: "auto", md: "450px" } }}>
            <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  fontSize: { xs: "1.5rem", md: "1.47rem" },
                  lineHeight: 1.5,
                  color: "#777777"
                }}
              >
                The stray hold period at most animal shelters is just <strong>3 to 7 days</strong>.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "text.secondary", mb: 2 }}>
                During this window, shelters are required to hold stray animals in order to give their owners a chance to reclaim them.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "text.secondary", mb: 4 }}>
                After the stray hold expires, the chances of being reunited with your pet diminish <strong>significantly</strong>.  In order to make room for more intakes, animals are either adopted out, euthanized, or transferred to other shelters or rescue organizations.
              </Typography>
              </Box>
            </Grid2>
          </Grid2>
        </Box>

        <Box sx={{ mb: 8 }}>
          <Grid2 container spacing={4} sx={{ mb: 6, alignItems: "stretch" }}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", height: { xs: "auto", md: "450px" } }}>
                <Typography
                  variant="h3"
                  sx={{
                    fontWeight: 700,
                    mb: 4,
                    fontSize: { xs: "1.5rem", md: "1.47rem" },
                    lineHeight: 1.5,
                    color: "#777777"
                  }}
                >
                  Only 17-19% of lost pets are ever reunited with their owners.
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "text.secondary", mb: 2 }}>
                  Once an animal enters the <strong>shelter and rescue pipeline</strong>, they can be moved hundreds of miles away, across city lines, county borders, or even state boundaries.
                </Typography>
                  <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "text.secondary", mb: 4 }}>
                    A family frantically calling their local shelter may not realize that their pet was transferred to a rescue on the other side of the country. Of those pets who are located, reclaim fees and other barriers can make it difficult to get them back.<sup><a href="https://www.humananimalsupportservices.org/blog/barriers-to-reclaim/?utm_source=chatgpt.com" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", textDecoration: "none" }}>1</a></sup>
                  </Typography>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src="/images/golden-retriever.png"
                alt="Happy dog reunited with family"
                sx={{
                  width: "100%",
                  height: { xs: "350px", md: "420px" },
                  objectFit: "cover",
                  borderRadius: 2,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
                }}
              />
            </Grid2>
          </Grid2>
        </Box>

        <Box sx={{ mb: 10 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600, mb: 2, letterSpacing: "-0.01em" }}
          >
            A Solution for Lost Pet Reunification
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 6, color: "text.secondary", fontSize: "1.0625rem" }}
          >
            The Lost Pets Registry is designed to improve reunification rates and give families and their pets the happy ending they deserve.
          </Typography>

          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
              <SearchIcon sx={{ fontSize: 40, color: "text.primary", flexShrink: 0 }} />
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Centralized
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", fontSize: "1.0625rem", lineHeight: 1.7 }}>
                  Social media posts and local bulletin boards are scattered and difficult to search. Our platform provides a single, searchable database where information about lost pets is easily accessible.
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 4 }} />
          </Box>

          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
              <AddCircleOutlineIcon sx={{ fontSize: 40, color: "text.primary", flexShrink: 0 }} />
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Proactive
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", fontSize: "1.0625rem", lineHeight: 1.7 }}>
                  By registering your pets before they go missing, you can be prepared when the worst happens. Instantly create a missing pet report with all of your pet's details already in our system.
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 4 }} />
          </Box>

          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: "flex", gap: 3 }}>
              <NotificationsActiveIcon sx={{ fontSize: 40, color: "text.primary", flexShrink: 0 }} />
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Community-Driven
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", fontSize: "1.0625rem", lineHeight: 1.7 }}>
                  Our platform connects pet owners, good samaritans, animal shelters, and rescue organizations in a unified effort to bring lost pets home and increase reunification rates.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 10 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600, mb: 2, letterSpacing: "-0.01em" }}
          >
            How It Works
          </Typography>
          <Typography
            variant="body1"
            sx={{ mb: 6, color: "text.secondary", fontSize: "1.0625rem" }}
          >
            Be proactive and add your pets to our database now, so you're prepared if the worst happens
          </Typography>

          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
              <AddCircleOutlineIcon sx={{ fontSize: 40, color: "text.primary", flexShrink: 0 }} />
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  1. Add Your Pets
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", fontSize: "1.0625rem", lineHeight: 1.7 }}>
                  Create an account and add your pets to our database with photos, descriptions, and identifying details. It's free and only takes a few minutes!
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 4 }} />
          </Box>

          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
              <ReportProblemOutlinedIcon sx={{ fontSize: 40, color: "text.primary", flexShrink: 0 }} />
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  2. Report a missing pet
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", fontSize: "1.0625rem", lineHeight: 1.7 }}>
                  If your pet gets lost, you create a report with a single click. Your pet's information is already in our system.
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 4 }} />
          </Box>

          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: "flex", gap: 3 }}>
              <ShareTwoTone sx={{ fontSize: 40, color: "text.primary", flexShrink: 0 }} />
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  3. Spread the Word
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", fontSize: "1.0625rem", lineHeight: 1.7 }}>
                  Generate printable flyers instantly with your pet's photo and details. Paid users can boost their report to reach a wider audience on social networks.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{
            mt: 5,
            p: 3,
            borderLeft: "3px solid",
            borderColor: "primary.main",
            bgcolor: "grey.50"
          }}>
            <Typography variant="body1" sx={{ fontWeight: 500, fontSize: "1.0625rem" }}>
              <strong>Pro Tip:</strong> Don't wait until your pet is missing. Add them to the registry today so you can act quickly if they ever get lost.
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mb: 10 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600, mb: 5, letterSpacing: "-0.01em" }}
          >
            Key Features
          </Typography>

          <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
            <Box sx={{ display: "flex", gap: 2.5 }}>
              <LocationOnIcon sx={{ fontSize: 28, color: "text.primary", flexShrink: 0, mt: 0.5 }} />
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: "1.125rem" }}>
                  Location-Based Search
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "1rem", lineHeight: 1.6 }}>
                  Search by city, state, or region to find reports near you
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2.5 }}>
              <CameraAltIcon sx={{ fontSize: 28, color: "text.primary", flexShrink: 0, mt: 0.5 }} />
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: "1.125rem" }}>
                  Photo Uploads
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "1rem", lineHeight: 1.6 }}>
                  Upload multiple photos to help identify and locate pets
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2.5 }}>
              <NotificationsActiveIcon sx={{ fontSize: 28, color: "text.primary", flexShrink: 0, mt: 0.5 }} />
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: "1.125rem" }}>
                  Report Management
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "1rem", lineHeight: 1.6 }}>
                  Track and update your reports from your personal dashboard
                </Typography>
              </Box>
            </Box>

            <Box sx={{ display: "flex", gap: 2.5 }}>
              <SearchIcon sx={{ fontSize: 28, color: "text.primary", flexShrink: 0, mt: 0.5 }} />
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, fontSize: "1.125rem" }}>
                  Advanced Filters
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "1rem", lineHeight: 1.6 }}>
                  Filter by species, breed, color, gender, and more
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Box sx={{ mb: 10 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600, mb: 2, letterSpacing: "-0.01em" }}
          >
            Get Involved
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.0625rem", lineHeight: 1.8, mb: 5, color: "text.secondary" }}>
            There are many ways you can help make a difference in the lives of lost pets and their families
          </Typography>
          <Grid2 container spacing={4}>
            <Grid2 xs={6} sm={3}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Report
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                  Found a stray? File a report to help them get home
                </Typography>
              </Box>
            </Grid2>
            <Grid2 xs={6} sm={3}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Share
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                  Spread the word about our platform
                </Typography>
              </Box>
            </Grid2>
            <Grid2 xs={6} sm={3}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Search
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                  Check reports regularly in your area
                </Typography>
              </Box>
            </Grid2>
            <Grid2 xs={6} sm={3}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Donate
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                  Help keep this service free for everyone
                </Typography>
              </Box>
            </Grid2>
          </Grid2>
        </Box>

        <Divider sx={{ mb: 8 }} />

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: 600, mb: 2, letterSpacing: "-0.01em" }}>
            Ready to Help?
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.0625rem", mb: 4, color: "text.secondary" }}>
            Join our community and help bring pets home
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              size="large"
              sx={{
                bgcolor: "text.primary",
                color: "white",
                "&:hover": { bgcolor: "text.secondary" },
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                textTransform: "none",
                fontWeight: 500,
                borderRadius: 1
              }}
            >
              Sign Up Today
            </Button>
            <Button
              component={Link}
              to="/reports"
              variant="outlined"
              size="large"
              sx={{
                borderColor: "text.primary",
                color: "text.primary",
                "&:hover": { borderColor: "text.secondary", bgcolor: "grey.50" },
                px: 4,
                py: 1.5,
                fontSize: "1rem",
                textTransform: "none",
                fontWeight: 500,
                borderRadius: 1
              }}
            >
              Search Reports
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;

