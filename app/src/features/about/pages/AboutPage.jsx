import React from "react";
import { Link } from "react-router-dom";
import { Container, Box, Typography, Grid2, Divider, Button } from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import SecurityIcon from "@mui/icons-material/Security";
import GroupIcon from "@mui/icons-material/Group";

const AboutPage = () => {
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "white" }}>
      <Box sx={{
        width: "100vw",
        position: "relative",
        left: "50%",
        right: "50%",
        marginLeft: "-50vw",
        marginRight: "-50vw",
        minHeight: { xs: "60vh", md: "70vh" },
        backgroundImage: "url('/images/cat-black-and-white.jpg')",
        backgroundSize: "cover",
        backgroundPosition: { xs: "center center", md: "10% 44%" },
        backgroundRepeat: "no-repeat",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        mb: 8
      }}>
        <Box sx={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: "rgba(0, 0, 0, 0.5)",
          zIndex: 1
        }} />
        <Box sx={{
          position: "relative",
          zIndex: 2,
          textAlign: "right",
          px: { xs: 3, md: 12 },
          maxWidth: "900px",
          ml: "auto"
        }}>
          <Typography
            variant="h1"
            component="h1"
            gutterBottom
            sx={{
              fontWeight: 400,
              fontSize: { xs: "1.75rem", md: "2.75rem" },
              mb: 3,
              lineHeight: 1.25,
              letterSpacing: "0.125px",
              color: "white",
              textShadow: "0 2px 4px rgba(0,0,0,0.3)"
            }}
          >
            <strong>10 million pets</strong> are lost or stolen in the United States each year.
          </Typography>
          <Typography variant="h4" component="p" sx={{
            fontSize: { xs: "1.125rem", sm: "1.25rem", md: "1.375rem" },
            fontWeight: 300,
            lineHeight: 1.8,
            letterSpacing: "0.35px",
            color: "rgba(255, 255, 255, 0.95)",
            textShadow: "0 1px 2px rgba(0,0,0,0.3)"
          }}>
            Very few of them are ever reunited with their families.
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="md" sx={{ py: 0 }}>

        <Box sx={{ mb: 8 }}>
          <Grid2 container spacing={6} sx={{ mb: 8, alignItems: "center" }}>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box
                component="img"
                src="/images/cat.png"
                alt="Lost pet in shelter"
                sx={{
                  width: "100%",
                  height: { xs: "300px", md: "380px" },
                  objectFit: "cover",
                  borderRadius: 3,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.15)"
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }}>
              <Box sx={{ p: { xs: 2, md: 4 } }}>
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: "4rem", md: "4rem" },
                      lineHeight: 1,
                      color: "#e74c3c",
                      mb: 1
                    }}
                  >
                    3 to 7 days
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "1.375rem", md: "1.375rem" },
                      lineHeight: 1.4,
                      color: "#2c3e50",
                      mb: 3
                    }}
                  >
                    is all the time that shelters have to hold stray animals.
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{
                  fontSize: "1.125rem",
                  lineHeight: 1.7,
                  color: "text.secondary"
                }}>
                  Shelters are required to hold lost pets for a short period so that their owners have time to reclaim them.
                  But once that time is up, a reunion becomes far less likely.
                </Typography>
              </Box>
            </Grid2>
          </Grid2>
        </Box>

        <Box sx={{ mb: 9 }}>
          <Grid2 container spacing={6} sx={{ alignItems: "center" }}>
            <Grid2 size={{ xs: 12, md: 6 }} sx={{ order: { xs: 2, md: 1 } }}>
              <Box sx={{ p: { xs: 2, md: 4 } }}>
                <Box sx={{ mb: 4 }}>
                  <Typography
                    variant="h2"
                    sx={{
                      fontWeight: 800,
                      fontSize: { xs: "4rem", md: "4rem" },
                      lineHeight: 1,
                      color: "#e74c3c",
                      mb: 1
                    }}
                  >
                    17 to 19%
                  </Typography>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "1.375rem", md: "1.375rem" },
                      lineHeight: 1.3,
                      color: "#2c3e50",
                      mb: 3
                    }}
                  >
                    of lost pets make it home.
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{
                  fontSize: "1.125rem",
                  lineHeight: 1.7,
                  color: "text.secondary",
                  mb: 3
                }}>
                  After the stray hold expires, pets may be adopted by new families or transferred hundreds of miles away, making reunification nearly impossible.
                  <sup><a href="https://www.humananimalsupportservices.org/blog/barriers-to-reclaim/" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", textDecoration: "none" }}>1</a></sup>
                </Typography>
                <Typography variant="body2" sx={{
                  fontSize: "1rem",
                  fontStyle: "italic",
                  color: "text.secondary"
                }}>
                  Even when pets are located successfully, reclaim fees, implicit biases, & other barriers can make it difficult to get them back.{" "}
                  <sup><a href="https://www.humananimalsupportservices.org/blog/barrier-busting-basics-for-busy-animal-shelters/" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", textDecoration: "none" }}>2</a></sup>
                </Typography>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, md: 6 }} sx={{ order: { xs: 1, md: 2 } }}>
              <Box
                component="img"
                src="/images/golden-retriever.png"
                alt="A golden retriever dog"
                sx={{
                  width: "100%",
                  height: { xs: "300px", md: "380px" },
                  objectFit: "cover",
                  borderRadius: 3,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.15)"
                }}
              />
            </Grid2>
          </Grid2>
        </Box>

        <Box sx={{
          mb: 9,
          backgroundColor: "white",
          borderRadius: 0,
          border: "none",
          width: "100vw",
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw"
        }}>
          <Grid2 container spacing={0} sx={{ alignItems: "stretch" }}>
            <Grid2 size={{ xs: 12, lg: 6 }} sx={{ p: 0 }}>
              <Box
                component="img"
                src="/images/woman-and-puppy.jpg"
                alt="Woman with puppy"
                sx={{
                  width: "100%",
                  height: { xs: "350px", lg: "100%" },
                  objectFit: "cover",
                  objectPosition: { lg: "80% 0%" },
                  display: "block"
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, lg: 6 }} sx={{ p: 0 }}>
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                minHeight: { lg: "600px" },
                py: { xs: 8, lg: 10 },
                px: { xs: 4, lg: 6 },
                bgcolor: "#f8f9fa",
                position: "relative"
              }}>
                  <Box sx={{ mb: 5, textAlign: { xs: "center", lg: "left" } }}>
                    <Typography
                      variant="h2"
                      component="h2"
                      gutterBottom
                      color="#2c3e50"
                      sx={{
                        fontWeight: 800,
                        letterSpacing: "-0.03em",
                        fontSize: { xs: "1.875rem", lg: "2.25rem" },
                        lineHeight: 1.2,
                        mb: 3,
                        position: "relative",
                        "&::after": {
                          content: '""',
                          position: "absolute",
                          bottom: "-24px",
                          left: { xs: "50%", lg: "0" },
                          transform: { xs: "translateX(-50%)", lg: "none" },
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
                      mt: 6,
                      fontWeight: 500,
                      maxWidth: { xs: "800px", lg: "none" },
                      mx: { xs: "auto", lg: "0" }
                    }}>
                      Our mission is to improve reunification rates and give families and their pets the happy endings they deserve
                      by offering a platform that is:
                    </Typography>
                  </Box>

                  <Box sx={{ display: "flex", flexDirection: "column", gap: 4, alignItems: { xs: "center", lg: "stretch" } }}>
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
                      maxWidth: { xs: "800px", lg: "none" },
                      width: "100%",
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
                      maxWidth: { xs: "800px", lg: "none" },
                      width: "100%",
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
                      maxWidth: { xs: "800px", lg: "none" },
                      width: "100%",
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

        <Box sx={{ textAlign: "center", py: { xs: 6, md: 8 }, py: { xs: 4, md: 5 }, paddingBottom: { xs: 11, md: 8 } }}>
          <Typography variant="h3" component="h2" gutterBottom color="#2c3e50" sx={{
            fontWeight: 700,
            fontSize: { xs: "1.75rem", md: "1.75rem" },
            mb: 3,
            lineHeight: 1.3,
            maxWidth: { xs: "600px", lg: "none" },
            px: { xs: 1, lg: 12 },
            mx: "auto"
          }}>
            Your pet's safety matters, and so does your peace of mind.
          </Typography>
          <Typography variant="h4" component="p" sx={{
            fontSize: { xs: "1.25rem", md: "1.375rem" },
            lineHeight: 1.5,
            fontWeight: 500,
            color: "text.secondary",
            mb: 6,
            pt: 1,
            maxWidth: { xs: "550px", lg: "none" },
            mx: "auto",
            px: { xs: 4, sm: 2, lg: 0 }
          }}>
            Getting started is fast, easy, and completely <strong>free</strong>.
          </Typography>
          <Button
            component={Link}
            to="/signup"
            variant="contained"
            size="large"
            sx={{
              bgcolor: "info.main",
              color: "white",
              "&:hover": { bgcolor: "info.dark" },
              px: 6,
              py: 2,
              fontSize: "1.125rem",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              mb: { xs: 1, md: 4 }
            }}
          >
            Sign Up Today
          </Button>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;

