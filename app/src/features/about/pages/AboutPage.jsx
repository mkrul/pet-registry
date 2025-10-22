import React from "react";
import { Link } from "react-router-dom";
import { Container, Box, Typography, Grid2, Divider, Button } from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import SecurityIcon from "@mui/icons-material/Security";
import GroupIcon from "@mui/icons-material/Group";

const AboutPage = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "white" }}>
      <Container maxWidth="md" sx={{ py: { xs: 10, md: 10 } }}>
        <Box sx={{ mb: 8 }}>
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            color="#333333"
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
                  color: "#555555"
                }}
              >
                The stray hold period at most animal shelters is just <strong>3 to 7 days</strong>.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "text.secondary", mb: 2 }}>
                Shelters are required to hold stray animals for a certain period of time in order to give their owners a chance to reclaim them.
              </Typography>
              <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "text.secondary", mb: 4 }}>
                After the stray hold expires, the chances of reuniting a lost pet with its family diminish <strong>significantly</strong>.  In order to make room for more intakes, animals are either adopted out, euthanized, or transferred to other shelters or rescue organizations.
              </Typography>
              </Box>
            </Grid2>
          </Grid2>
        </Box>

        <Box sx={{ mb: 7 }}>
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
                    color: "#555555"
                  }}
                >
                  Only 17-19% of lost pets are ever reunited with their owners. <sup><a href="https://www.humananimalsupportservices.org/blog/barriers-to-reclaim/" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", textDecoration: "none" }}>1</a></sup>
                </Typography>
                <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "text.secondary", mb: 2 }}>
                  Animals that are adopted out or transferred may be moved <strong>hundreds of miles away</strong>, across city lines, county borders, or state boundaries.
                </Typography>
                  <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "text.secondary", mb: 4 }}>
                    Someone who is frantically calling their local shelter may not realize that their pet was transferred to a rescue on the other side of the country. Of those pets who are located, reclaim fees, implicit biases, and other barriers can make it difficult to get them back.{" "}<sup><a href="https://www.humananimalsupportservices.org/blog/barrier-busting-basics-for-busy-animal-shelters/" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", textDecoration: "none" }}>2</a></sup>
                  </Typography>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src="/images/golden-retriever.png"
                alt="A golden retriever dog"
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

        <Divider sx={{ mb: 8 }} />

        <Box sx={{ mb: 9 }}>
          <Typography
            variant="h2"
            component="h2"
            gutterBottom
            color="#333333"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.02em",
              fontSize: { xs: "2rem", md: "2rem" },
              lineHeight: 1.5,
              mb: 3,
              textAlign: "center"
            }} >
            A Solution for Lost Pet Reunification
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "text.secondary", mb: 5 }}>
            Our mission is to improve reunification rates and give families and their pets the happy endings they deserve.
            We do this by offering a platform that is:
          </Typography>

          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
              <StorageIcon sx={{ fontSize: 40, color: "info.dark", flexShrink: 0 }} />
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "info.dark" }}>
                  Centralized
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", fontSize: "1.0625rem", lineHeight: 1.7 }}>
                  We provide a single, searchable database where information about lost pets and their whereabouts are easily accessible to <strong>everyone</strong>.
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 4 }} />
          </Box>

          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: "flex", gap: 3, mb: 2 }}>
              <SecurityIcon sx={{ fontSize: 40, color: "success.dark", flexShrink: 0 }} />
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "success.dark" }}>
                  Proactive
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", fontSize: "1.0625rem", lineHeight: 1.7 }}>
                  By registering your pets <strong>before</strong> they go missing, you can be prepared when the worst happens.
                  Quickly make a report, print flyers, and access other helpful features with a few clicks.
                </Typography>
              </Box>
            </Box>
            <Divider sx={{ my: 4 }} />
          </Box>

          <Box sx={{ mb: 5 }}>
            <Box sx={{ display: "flex", gap: 3 }}>
              <GroupIcon sx={{ fontSize: 40, color: "warning.dark", flexShrink: 0 }} />
              <Box>
                <Typography variant="h6" gutterBottom sx={{ fontWeight: 600, color: "warning.dark" }}>
                  Community-Driven
                </Typography>
                <Typography variant="body1" sx={{ color: "text.secondary", fontSize: "1.0625rem", lineHeight: 1.7 }}>
                  Our platform connects pet owners, good samaritans, animal shelters, and rescue organizations in a unified effort to bring lost pets home and increase reunification rates.
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>

        <Divider sx={{ mb: 8 }} />

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h2"
            component="h2"
            gutterBottom
            color="#333333"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.02em",
              fontSize: { xs: "2rem", md: "2rem" }
            }} >
            Want to know the best part?
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "text.secondary", mb: 5 }}>
            It's private, easy to use, and completely <strong>free</strong>.
          </Typography>
          <Box sx={{ display: "flex", gap: 2, justifyContent: "center", flexWrap: "wrap" }}>
            <Button
              component={Link}
              to="/signup"
              variant="contained"
              size="large"
              sx={{
                bgcolor: "info.main",
                color: "white",
                "&:hover": { bgcolor: "info.dark" },
                px: 4,
                py: 1.5,
                fontSize: "1.125rem",
                lineHeight: 1.8,
                textTransform: "none",
                fontWeight: 500,
                borderRadius: 1
              }}
            >
              <Box component="span">
                Sign Up Today
              </Box>
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                color: "info.main",
                "&:hover": {
                  color: "info.medium"
                },
                px: 4,
                py: 1.5,
                fontSize: "1.125rem",
                lineHeight: 1.8,
                textTransform: "none",
                fontWeight: 500,
                borderRadius: 1
              }}
              href="https://www.lostpetsregistry.org/donate"
              target="_blank"
              rel="noopener noreferrer"
            >
              <Box component="span">
                Donate
              </Box>
            </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;

