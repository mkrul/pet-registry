import React from "react";
import { Link } from "react-router-dom";
import { Container, Box, Typography, Grid, Paper, Button } from "@mui/material";
import PetsIcon from "@mui/icons-material/Pets";
import SearchIcon from "@mui/icons-material/Search";
import FavoriteIcon from "@mui/icons-material/Favorite";
import CameraAltIcon from "@mui/icons-material/CameraAlt";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box sx={{ textAlign: "center", mb: 8 }}>
          <Typography
            variant="h3"
            component="h3"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#2563eb" }}
          >
            Welcome to the Lost Pets Registry
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ maxWidth: "800px", mx: "auto", mt: 2 }}
          >
            A community-driven platform dedicated to reuniting lost pets with their families
          </Typography>
        </Box>

        <Paper
          elevation={2}
          sx={{ p: 6, mb: 6, borderRadius: 3, bgcolor: "white" }}
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#1e40af", mb: 3 }}
          >
            Our Mission
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8 }}>
            Every year, millions of pets go missing, leaving families heartbroken and searching desperately for their beloved companions. Lost Pets Registry was created to bridge the gap between lost pets and their families by providing a free, accessible platform where anyone can report and search for lost or found animals.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8 }}>
            We believe that every pet deserves to be home, and every family deserves the chance to be reunited with their furry friends. Our platform is built on compassion, community, and the simple idea that together, we can make a difference.
          </Typography>
        </Paper>

        <Paper
          elevation={2}
          sx={{ p: 6, mb: 6, borderRadius: 3, bgcolor: "#fef2f2", border: "2px solid #fca5a5" }}
        >
          <Box sx={{ display: "flex", alignItems: "center", mb: 3 }}>
            <Typography
              variant="h4"
              component="h2"
              sx={{ fontWeight: "bold", color: "#991b1b" }}
            >
              When a Pet Goes Missing, Every Moment Counts
            </Typography>
          </Box>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8 }}>
            When a pet goes missing, every moment counts. Most shelters operate on a <strong>stray hold period</strong> of just 3-7 days, depending on local laws. During this brief window, shelters are required to hold found animals to give owners a chance to reclaim them. But here's the heartbreaking reality: after the stray hold expires, animals become available for adoption or can be transferred to rescue organizations.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8 }}>
            Once an animal enters the <strong>shelter and rescue pipeline</strong>, they can be moved across city lines, county borders, or even state boundaries. A pet picked up in one location might end up hundreds of miles away within weeks. Without a unified national database, owners searching in their local area may never find their beloved companion, even when they're actively looking.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8 }}>
            <strong>There is no centralized system</strong> to track animals across shelters, rescues, and jurisdictions. Each organization maintains its own records, websites, and databases. A family frantically calling their local shelter may not know their pet was transferred to a rescue three counties away or adopted out to a new family before they could be located.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8 }}>
            This is why the <strong>Lost Pets Registry</strong> exists.
            We are building a <strong>centralized platform</strong> where anyone can post and search for lost or found pets across the United States. Whether your pet was found by a neighbor, picked up by animal control, or spotted in another city, the <strong>Lost Pets Registry</strong> gives you a fighting chance to find them.
          </Typography>
        </Paper>

        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#1e40af", mb: 4, textAlign: "center" }}
          >
            How It Works
          </Typography>
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  height: "100%",
                  borderRadius: 3,
                  textAlign: "center",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-4px)" }
                }}
              >
                <PetsIcon sx={{ fontSize: 60, color: "#2563eb", mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                  1. Report
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Create a detailed report with photos, description, and location information for a lost or found pet. Registration is quick and free.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  height: "100%",
                  borderRadius: 3,
                  textAlign: "center",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-4px)" }
                }}
              >
                <SearchIcon sx={{ fontSize: 60, color: "#2563eb", mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                  2. Search
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Browse reports by location, species, breed, color, and more. Our powerful search helps you find matches quickly and efficiently.
                </Typography>
              </Paper>
            </Grid>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  p: 4,
                  height: "100%",
                  borderRadius: 3,
                  textAlign: "center",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-4px)" }
                }}
              >
                <FavoriteIcon sx={{ fontSize: 60, color: "#2563eb", mb: 2 }} />
                <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
                  3. Connect
                </Typography>
                <Typography variant="body1" color="text.secondary">
                  Found a match? Contact the reporter directly and help bring a beloved pet back home where they belong.
                </Typography>
              </Paper>
            </Grid>
          </Grid>
        </Box>

        <Paper
          elevation={2}
          sx={{ p: 6, mb: 6, borderRadius: 3, bgcolor: "#f0f9ff" }}
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#1e40af", mb: 4, textAlign: "center" }}
          >
            Key Features
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                <LocationOnIcon sx={{ fontSize: 32, color: "#2563eb", mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                    Location-Based Search
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Search by city, state, or region to find reports near you
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                <CameraAltIcon sx={{ fontSize: 32, color: "#2563eb", mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                    Photo Uploads
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Upload multiple photos to help identify and locate pets
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                <NotificationsActiveIcon sx={{ fontSize: 32, color: "#2563eb", mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                    Report Management
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Track and update your reports from your personal dashboard
                  </Typography>
                </Box>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6}>
              <Box sx={{ display: "flex", alignItems: "flex-start", mb: 2 }}>
                <SearchIcon sx={{ fontSize: 32, color: "#2563eb", mr: 2, mt: 0.5 }} />
                <Box>
                  <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                    Advanced Filters
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Filter by species, breed, color, gender, and more
                  </Typography>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Paper
          elevation={2}
          sx={{ p: 6, mb: 6, borderRadius: 3, bgcolor: "white" }}
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#1e40af", mb: 3 }}
          >
            Our Community
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8 }}>
            Lost Pets Registry is a free platform built and maintained by volunteers who care deeply about animal welfare. We rely on the generosity of our community to keep this service running and accessible to everyone who needs it.
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8 }}>
            Every report filed, every search conducted, and every pet reunited with their family is a testament to the power of community coming together for a common cause. We stand in solidarity with all communities fighting for justice and freedom.
          </Typography>
          <Box sx={{ mt: 4, p: 3, bgcolor: "#fef3c7", borderRadius: 2 }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              Support Our Mission
            </Typography>
            <Typography variant="body1" paragraph>
              This project runs on the generosity of others. If you've found our platform helpful, please consider supporting us so we can continue helping pets find their way home.
            </Typography>
          </Box>
        </Paper>

        <Paper
          elevation={2}
          sx={{ p: 6, mb: 6, borderRadius: 3, bgcolor: "#ede9fe" }}
        >
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: "bold", color: "#1e40af", mb: 3, textAlign: "center" }}
          >
            Get Involved
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8, textAlign: "center", mb: 4 }}>
            There are many ways you can help make a difference in the lives of lost pets and their families
          </Typography>
          <Grid container spacing={3} justifyContent="center">
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Report
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Found a stray? File a report to help them get home
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Share
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Spread the word about our platform
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Search
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Check reports regularly in your area
                </Typography>
              </Box>
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
              <Box sx={{ textAlign: "center" }}>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
                  Donate
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Help keep this service free for everyone
                </Typography>
              </Box>
            </Grid>
          </Grid>
        </Paper>

        <Box sx={{ textAlign: "center", mt: 8 }}>
          <Typography variant="h4" gutterBottom sx={{ fontWeight: "bold", color: "#1e40af", mb: 3 }}>
            Ready to Help?
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", mb: 4 }}>
            Join our community and help bring pets home
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              size="large"
              sx={{
                bgcolor: "#2563eb",
                "&:hover": { bgcolor: "#1e40af" },
                px: 4,
                py: 1.5,
                fontSize: "1rem"
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
                borderColor: "#2563eb",
                color: "#2563eb",
                "&:hover": { borderColor: "#1e40af", bgcolor: "#f0f9ff" },
                px: 4,
                py: 1.5,
                fontSize: "1rem"
              }}
            >
              Search Reports
            </Button>
          </Box>
        </Box>
      </Container>
    </div>
  );
};

export default AboutPage;

