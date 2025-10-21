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
      <Container maxWidth="md" sx={{ py: { xs: 6, md: 10 } }}>
        <Box sx={{ mb: 10 }}>
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.02em",
              fontSize: { xs: "3rem", md: "3rem" },
              mb: 2,
              textAlign: "center"
            }}
          >
            Did you know?
          </Typography>
        </Box>

        <Box sx={{ mb: 16 }}>
          <Grid2 container spacing={8} alignItems="center" sx={{ mb: 12 }}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src="/images/cat.png"
                alt="Lost pet in shelter"
                sx={{
                  width: "100%",
                  height: { xs: "300px", md: "400px" },
                  objectFit: "cover",
                  borderRadius: 2,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
            <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  fontSize: { xs: "1.75rem", md: "1.5rem" },
                  lineHeight: 1.3,
                  color: "#777777"
                }}
              >
                The stray hold period at most animal shelters is just <strong>3 to 7 days</strong>.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "text.secondary", mb: 2 }}>
                During this window, shelters are required to hold stray animals in order to give their owners a chance to reclaim them.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "text.secondary", mb: 4 }}>
                After the stray hold expires, the chances of being reunited with your pet diminish significantly.  In order to make room for more intakes, animals are either adopted out, euthanized, or transferred to other shelters or rescue organizations.
              </Typography>
            </Grid2>
          </Grid2>

          <Grid2 container spacing={8} alignItems="center" sx={{ mb: 12 }}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Typography
                variant="h3"
                sx={{
                  fontWeight: 700,
                  mb: 4,
                  fontSize: { xs: "1.75rem", md: "1.5rem" },
                  lineHeight: 1.3,
                  color: "#1a1a1a"
                }}
              >
                The Problem Gets Worse
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "text.secondary", mb: 4 }}>
                Once an animal enters the <strong>shelter and rescue pipeline</strong>, they can be moved across city lines, county borders, or even state boundaries. A pet picked up in one location might end up hundreds of miles away within weeks. Without a unified national database, owners searching in their local area may never find their beloved companion, even when they're actively looking.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "text.secondary", mb: 4 }}>
                <strong>There is no centralized system</strong> to track animals across shelters, rescues, and jurisdictions. Each organization maintains its own records, websites, and databases. A family frantically calling their local shelter may not know their pet was transferred to a rescue three counties away or adopted out to a new family before they could be located.
              </Typography>
              <Box sx={{
                p: 4,
                bgcolor: "#fef2f2",
                borderRadius: 2,
                borderLeft: "4px solid #ef4444"
              }}>
                <Typography variant="body1" sx={{ fontWeight: 600, color: "#991b1b", fontSize: "1.125rem" }}>
                  "The longer you wait, the harder it becomes to find them."
                </Typography>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src="/images/golden-retriever.png"
                alt="Lost pet in shelter system"
                sx={{
                  width: "100%",
                  height: { xs: "300px", md: "400px" },
                  objectFit: "cover",
                  borderRadius: 2,
                  boxShadow: "0 8px 32px rgba(0,0,0,0.12)"
                }}
              />
            </Grid2>
          </Grid2>

          <Box sx={{
            bgcolor: "#1a1a1a",
            color: "white",
            p: { xs: 6, md: 8 },
            borderRadius: 3,
            position: "relative",
            overflow: "hidden"
          }}>
            <Box sx={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "6px",
              height: "100%",
              bgcolor: "#ef4444"
            }} />

            <Box sx={{
              my: 6,
              py: 6,
              borderTop: "1px solid rgba(255,255,255,0.2)",
              borderBottom: "1px solid rgba(255,255,255,0.2)",
              textAlign: "center"
            }}>
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 700,
                  fontSize: { xs: "1.5rem", md: "2rem" },
                  mb: 2
                }}
              >
                This is why the Lost Pets Registry exists.
              </Typography>
            </Box>

            <Typography variant="body1" sx={{ fontSize: "1.125rem", lineHeight: 1.9, opacity: 0.95, textAlign: "center" }}>
              We are a <strong>centralized platform</strong> where anyone can post and search for lost or found pets across the United States. Whether your pet was found by a neighbor, picked up by animal control, or spotted in another city, the <strong>Lost Pets Registry</strong> gives you a fighting chance to find them.
            </Typography>
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
            sx={{ fontWeight: 600, mb: 3, letterSpacing: "-0.01em" }}
          >
            Our Community
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.0625rem", lineHeight: 1.8, color: "text.secondary" }}>
            Lost Pets Registry is a free platform built and maintained by volunteers who care deeply about animal welfare. We rely on the generosity of our community to keep this service running and accessible to everyone who needs it.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.0625rem", lineHeight: 1.8, color: "text.secondary" }}>
            Every report filed, every search conducted, and every pet reunited with their family is a testament to the power of community coming together for a common cause. We stand in solidarity with all communities fighting for justice and freedom.
          </Typography>
          <Box sx={{
            mt: 4,
            p: 4,
            border: "1px solid",
            borderColor: "warning.light",
            borderRadius: 1
          }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Support Our Mission
            </Typography>
            <Typography variant="body1" sx={{ color: "text.secondary", fontSize: "1.0625rem", lineHeight: 1.7 }}>
              This project runs on the generosity of others. If you've found our platform helpful, please consider supporting us so we can continue helping pets find their way home.
            </Typography>
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

