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
              <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.6, color: "text.secondary", mb: 2 }}>
                Shelters are required to hold stray animals for a certain period of time in order to give their owners a chance to reclaim them.
                But after the stray hold expires, the chances of reuniting a lost pet with its family diminish <strong>significantly</strong>.
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
                <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.6, color: "text.secondary", mb: 2 }}>
                  After the stray hold expires, animals may be adopted out or transferred to other organizations, sometimes <strong>hundreds of miles away</strong>.
                  If a pet is lucky enough to be located by their owner, reclaim fees, implicit biases, and other barriers can make it difficult to get them back.{" "}<sup><a href="https://www.humananimalsupportservices.org/blog/barrier-busting-basics-for-busy-animal-shelters/" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", textDecoration: "none" }}>2</a></sup>
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

        <Box sx={{
          mb: 9,
          backgroundColor: "white",
          borderRadius: 0,
          p: 0,
          border: "none",
          width: "100vw",
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw"
        }}>
          <Grid2 container spacing={0} sx={{ alignItems: "stretch", minHeight: { xs: "auto", md: "600px" } }}>
            <Grid2 size={{ xs: 12, md: 6 }} sx={{ p: 0 }}>
              <Box
                component="img"
                src="/images/woman-and-puppy.jpg"
                alt="Woman with puppy"
                sx={{
                  width: "100%",
                  height: { xs: "350px", md: "100%" },
                  objectFit: "cover",
                  objectPosition: "80% 0%",
                  display: "block"
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }} sx={{ p: 0 }}>
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                height: "100%",
                p: { xs: 4, md: 12 },
                bgcolor: "#f8f9fa",
                position: "relative"
              }}>
                  <Box sx={{ mb: 5 }}>
                    <Typography
                      variant="h2"
                      component="h2"
                      gutterBottom
                      color="#2c3e50"
                      sx={{
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                        fontSize: { xs: "1.875rem", md: "2.25rem" },
                        lineHeight: 1.2,
                        mb: 3,
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: "-24px",
                          left: 0,
                          width: "60px",
                          height: "3px",
                          backgroundColor: "#3498db",
                          borderRadius: "2px"
                        }
                      }} >
                      The Future of Lost Pet Reunification
                    </Typography>
                    <Typography variant="body1" paragraph sx={{
                      fontSize: "1.15rem",
                      lineHeight: 1.7,
                      color: "#5a6c7d",
                      mb: 0,
                      mt: 5,
                      fontWeight: 500
                    }}>
                      Our mission is to improve reunification rates and give families and their pets the happy endings they deserve
                      by offering a platform that is:
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <Box sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 3,
                      p: 3,
                      bgcolor: "white",
                      borderRadius: 3,
                      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                      border: "1px solid #e9ecef",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                        transform: "translateY(-2px)"
                      }
                    }}>
                      <Box sx={{
                        p: 2,
                        bgcolor: "#e3f2fd",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}>
                        <StorageIcon sx={{ fontSize: 28, color: "#1976d2" }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom sx={{
                          fontWeight: 700,
                          color: "#1976d2",
                          fontSize: "1.25rem",
                          mb: 1
                        }}>
                          Centralized
                        </Typography>
                        <Typography variant="body2" paragraph sx={{
                          fontSize: "1rem",
                          lineHeight: 1.6,
                          color: "#495057",
                          mb: 0
                        }}>
                          A nationwide network that puts real-time data about lost pets within reach, improving their chances of being found.
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 3,
                      p: 3,
                      bgcolor: "white",
                      borderRadius: 3,
                      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                      border: "1px solid #e9ecef",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                        transform: "translateY(-2px)"
                      }
                    }}>
                      <Box sx={{
                        p: 2,
                        bgcolor: "#e8f5e8",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}>
                        <SecurityIcon sx={{ fontSize: 28, color: "#2e7d32" }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom sx={{
                          fontWeight: 700,
                          color: "#2e7d32",
                          fontSize: "1.25rem",
                          mb: 1
                        }}>
                          Proactive
                        </Typography>
                        <Typography variant="body2" paragraph sx={{
                          fontSize: "1rem",
                          lineHeight: 1.6,
                          color: "#495057",
                          mb: 0
                        }}>
                          By registering pets <i>before</i> they go missing, owners can
                          be prepared to act quickly when the unexpected occurs.
                        </Typography>
                      </Box>
                    </Box>

                    <Box sx={{
                      display: "flex",
                      alignItems: "flex-start",
                      gap: 3,
                      p: 3,
                      bgcolor: "white",
                      borderRadius: 3,
                      boxShadow: "0 2px 12px rgba(0,0,0,0.08)",
                      border: "1px solid #e9ecef",
                      transition: "all 0.3s ease",
                      "&:hover": {
                        boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                        transform: "translateY(-2px)"
                      }
                    }}>
                      <Box sx={{
                        p: 2,
                        bgcolor: "#fff3e0",
                        borderRadius: "50%",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        flexShrink: 0
                      }}>
                        <GroupIcon sx={{ fontSize: 28, color: "#f57c00" }} />
                      </Box>
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="h6" gutterBottom sx={{
                          fontWeight: 700,
                          color: "#f57c00",
                          fontSize: "1.25rem",
                          mb: 1
                        }}>
                          Community-Driven
                        </Typography>
                        <Typography variant="body2" paragraph sx={{
                          fontSize: "1rem",
                          lineHeight: 1.6,
                          color: "#495057",
                          mb: 0
                        }}>
                          We connect pet owners, neighbors, and animal welfare professionals in a unified effort to bring lost pets home.
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid2>
            </Grid2>
        </Box>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="h2"
            component="h2"
            gutterBottom
            color="#333333"
            sx={{
              fontWeight: 700,
              letterSpacing: "-0.02em",
              fontSize: { xs: "2rem", md: "2rem" },
              mb: 2
            }} >
            The best part?
          </Typography>
          <Typography
          variant="body1" paragraph sx={{ fontWeight: 500,
            mb: 4,
            fontSize: { xs: "1.3rem", md: "1.3rem", padding: "0 1.75rem" },
            lineHeight: 1.5,
            color: "#555555" }}>
            It's private, easy to use, and completely <strong>free</strong>.<br />
          </Typography>
          <Typography variant="body1" paragraph sx={{ fontSize: "1.125rem", lineHeight: 1.8, color: "text.secondary", mb: 5 }}>
            Your pet's safety and your peace of mind are important. <br />Sign up now to get started, or consider donating if you want to support our work.
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
                Sign Up
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

