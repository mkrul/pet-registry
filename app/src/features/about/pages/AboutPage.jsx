import React from "react";
import { Link } from "react-router-dom";
import { Container, Box, Typography, Grid, Divider, Button } from "@mui/material";
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
            variant="h2"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.02em",
              fontSize: { xs: "2.5rem", md: "3.5rem" },
              mb: 3
            }}
          >
            Why build a lost pet registry?
          </Typography>
        </Box>

        <Box sx={{
          mb: 10,
          borderLeft: "4px solid",
          borderColor: "error.main",
          pl: 4,
          py: 2
        }}>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.0625rem", lineHeight: 1.8, color: "text.secondary" }}>
            Most shelters operate on a <strong>stray hold period</strong> of just 3-7 days, depending on local laws. During this brief window, shelters are required to hold found animals to give owners a chance to reclaim them. But here's the heartbreaking reality: after the stray hold expires, animals become available for adoption or can be transferred to rescue organizations.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.0625rem", lineHeight: 1.8, color: "text.secondary" }}>
            Once an animal enters the <strong>shelter and rescue pipeline</strong>, they can be moved across city lines, county borders, or even state boundaries. A pet picked up in one location might end up hundreds of miles away within weeks. Without a unified national database, owners searching in their local area may never find their beloved companion, even when they're actively looking.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.0625rem", lineHeight: 1.8, color: "text.secondary" }}>
            <strong>There is no centralized system</strong> to track animals across shelters, rescues, and jurisdictions. Each organization maintains its own records, websites, and databases. A family frantically calling their local shelter may not know their pet was transferred to a rescue three counties away or adopted out to a new family before they could be located.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.0625rem", lineHeight: 1.8, color: "text.secondary" }}>
            This is why the <strong>Lost Pets Registry</strong> exists.
          </Typography>
          <Typography variant="body1" sx={{ fontSize: "1.0625rem", lineHeight: 1.8, color: "text.secondary" }}>
            We are a <strong>centralized platform</strong> where anyone can post and search for lost or found pets across the United States. Whether your pet was found by a neighbor, picked up by animal control, or spotted in another city, the <strong>Lost Pets Registry</strong> gives you a fighting chance to find them.
          </Typography>
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
          <Grid container spacing={4}>
            <Grid item xs={6} sm={3}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Report
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                  Found a stray? File a report to help them get home
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Share
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                  Spread the word about our platform
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Search
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                  Check reports regularly in your area
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={6} sm={3}>
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
                  Donate
                </Typography>
                <Typography variant="body2" sx={{ color: "text.secondary", fontSize: "0.9375rem", lineHeight: 1.6 }}>
                  Help keep this service free for everyone
                </Typography>
              </Box>
            </Grid>
          </Grid>
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

