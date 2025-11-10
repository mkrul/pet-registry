import React from "react";
import { Link } from "react-router-dom";
import { Container, Box, Typography, Grid2, Divider, Button } from "@mui/material";
import StorageIcon from "@mui/icons-material/Storage";
import SecurityIcon from "@mui/icons-material/Security";
import GroupIcon from "@mui/icons-material/Group";
import PetsIcon from "@mui/icons-material/Pets";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useAppSelector } from "../../../store/hooks.js";

const AboutPage = () => {
  const user = useAppSelector(state => state.auth.user);

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
        backgroundImage: "url('/images/stray-cat-black-and-white.jpg')",
        backgroundSize: "cover",
        backgroundPosition: { xs: "center center", md: "0% 47%" },
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
          textAlign: { xs: "center", xl: "right" },
          px: { xs: 3, md: 12 },
          maxWidth: "950px",
          ml: "auto",
          mr: { xs: "auto", xl: 0 }
        }}>
          <Typography variant="h1" component="h1" gutterBottom sx={{
            fontWeight: 400,
            fontSize: { xs: "1.85rem", sm: "2.15rem", md: "2.75rem", lg: "3.14rem" },
            mb: 3,
            px: { xs: 1, sm: 4, lg: 0 },
            lineHeight: 1.25,
            letterSpacing: "0.115px",
            color: "white",
            textShadow: "0 2px 4px rgba(0,0,0,0.3)"
          }}>Each year, <span style={{ fontWeight: 700 }}>millions of pets</span> are lost or stolen in the United States.</Typography>
          <Typography variant="h4" component="p" sx={{
            fontSize: { xs: "1.15rem", sm: "1.275rem", md: "1.375rem", lg: "1.475rem" },
            px: { xs: 1, sm: 4, lg: 0 },
            fontWeight: 300,
            lineHeight: { xs: 1.4, md: 1.8 },
            letterSpacing: "0.35px",
            color: "rgba(255, 255, 255, 0.95)",
            textShadow: "0 1px 2px rgba(0,0,0,0.3)"
          }}>
            Many are never reunited with the families who love them.
          </Typography>
        </Box>
      </Box>

      <Container maxWidth="md" sx={{ pt: 3 }}>
        <Box sx={{ mb: 8 }}>
          <Grid2 container spacing={{ xs: 0, sm: 2 }} sx={{ mb: 8, alignItems: "center" }}>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Box sx={{ p: { xs: 1, sm: 0, md: 1 }, mr: { md: 2 } }}>
                <Box sx={{ mb: { xs: 3, sm: 2, md: 4 } }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "1.775rem", sm: "1.5rem", md: "1.675rem" },
                      lineHeight: 1.4,
                      color: "#2c3e50",
                      mb: 1,
                      textAlign: { xs: "center", sm: "left" }
                    }}
                  >
                    The average stray hold period is{" "}
                    <span style={{ fontWeight: 800, color: "#e74c3c" }}>
                      only 2 to 3 days.
                      <sup>
                        <a href="https://lostpetresearch.com/2019/03/lost-pet-statistics/" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", textDecoration: "none", fontSize: "0.7em", fontWeight: "normal" }}>1</a>
                      </sup>
                    </span>
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{
                  fontSize: { xs: "1.125rem", sm: "1.05rem", md: "1.125rem" },
                  lineHeight: { xs: 1.7, sm: 1.65, md: 1.7 },
                  color: "text.secondary",
                  paddingRight: { xs: 0, sm: 1 },
                  marginBottom: { xs: 3, sm: 0, md: 0 },
                  textAlign: { xs: "justify", sm: "left" }
                }}>
                  Shelters will typically hold strays for a short amount of time so that their owners have a chance to reclaim them.
                  Unfortunately, once the stray hold expires, reuniting lost pets with their families becomes far less likely.
                </Typography>
              </Box>
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }}>
              <Box
                component="img"
                src="/images/shelter-dog.jpg"
                alt="Lost dog in shelter"
                sx={{
                  width: "100%",
                  height: { xs: "300px", sm: "350px", md: "380px" },
                  objectFit: "cover",
                  borderRadius: 3,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.15)"
                }}
              />
            </Grid2>
          </Grid2>
        </Box>

        <Box sx={{ mb: 9 }}>
          <Grid2 container spacing={{ xs: 0, sm: 2 }} sx={{ mb: 8, alignItems: "center" }}>
            <Grid2 size={{ xs: 12, sm: 6 }} sx={{ order: { xs: 2, sm: 1 } }}>
              <Box
                component="img"
                src="/images/woman-holding-cat.jpg"
                alt="Woman holding a cat"
                sx={{
                  width: "100%",
                  height: { xs: "300px", sm: "350px", md: "380px" },
                  objectFit: "cover",
                  borderRadius: 3,
                  boxShadow: "0 12px 40px rgba(0,0,0,0.15)"
                }}
              />
            </Grid2>
            <Grid2 size={{ xs: 12, sm: 6 }} sx={{ order: { xs: 1, sm: 2 } }}>
              <Box sx={{ p: { xs: 1, sm: 1, md: 1 }, ml: { md: 2 } }}>
                <Box sx={{ mb: { xs: 3, sm: 2, md: 4 } }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      fontSize: { xs: "1.775rem", sm: "1.5rem", md: "1.675rem" },
                      lineHeight: 1.4,
                      color: "#2c3e50",
                      mb: { xs: 3, sm: 1, md: 3 },
                      textAlign: { xs: "center", sm: "left" }
                    }}
                  >
                    Microchipping helps, but sometimes <span style={{ fontWeight: 800, color: "#e74c3c" }}>it&apos;s not enough.</span>
                  </Typography>
                </Box>
                <Typography variant="body1" sx={{
                  fontSize: { xs: "1.125rem", sm: "1.05rem", md: "1.125rem" },
                  lineHeight: { xs: 1.7, sm: 1.65, md: 1.7 },
                  color: "text.secondary",
                  mb: 3,
                  textAlign: { xs: "justify", sm: "left" }
                }}>
                  Bureaucracy, fines, reclaim fees, and systemic biases can create barriers that are difficult for pet parents to overcome. If not reclaimed in time, lost pets may be adopted out to other families or transferred to a different facility hundreds of miles away.
                  <sup>
                    <a href="https://www.humananimalsupportservices.org/blog/barrier-busting-basics-for-busy-animal-shelters/" target="_blank" rel="noopener noreferrer" style={{ color: "#1976d2", textDecoration: "none" }}>2</a>
                  </sup>
                </Typography>
              </Box>
            </Grid2>
          </Grid2>
          <Typography variant="caption" sx={{
              fontSize: "0.75rem",
              color: "#5a6c7d",
              lineHeight: 1.5,
              mt: 4,
              display: "block",
              textAlign: "center"
            }}>
              Sources: 1.{" "}
              <a href="https://lostpetresearch.com/2019/03/lost-pet-statistics/" target="_blank" rel="noopener noreferrer" style={{ color: "#5a6c7d", textDecoration: "none" }}>Lost Pet Research</a> • 2.{" "}
              <a href="https://www.humananimalsupportservices.org/blog/barrier-busting-basics-for-busy-animal-shelters/" target="_blank" rel="noopener noreferrer" style={{ color: "#5a6c7d", textDecoration: "none" }}>Human Animal Support Services</a>
            </Typography>
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
            <Grid2 size={{ xs: 12, lg: 6 }} sx={{ p: 0, order: { xs: 2, lg: 1 } }}>
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
            <Grid2 size={{ xs: 12, lg: 6 }} sx={{ p: 0, order: { xs: 1, lg: 2 } }}>
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
                        fontSize: { xs: "1.875rem", lg: "2.25rem" },
                        lineHeight: 1.3,
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
                      Our mission is to improve reunification rates in our communities by delivering a platform that is accessible and
                      actionable, putting real-time data about lost pets within reach.
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
                          Information silos inhibit communication between shelters, rescues, and pet parents. We offer a nationwide network that relies on a single database to trace lost pets so they can be found quickly.
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
                          One in three pets will become lost at some point in their lifetime.
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
                          When pets go missing, community support is essential.
                          Our platform connects pet owners, neighbors, and animal welfare professionals in a unified effort to bring lost pets home.
                        </Typography>
                      </Box>
                    </Box>
                  </Box>
                </Box>
              </Grid2>
            </Grid2>
        </Box>
      </Container>

      <Container maxWidth="xl">
        <Box sx={{ mb: 9, mt: 8 }}>
          <Box sx={{ textAlign: "center", mb: 6 }}>
            <Typography
              variant="h2"
              component="h2"
              gutterBottom
              color="#2c3e50"
              sx={{
                fontWeight: 800,
                fontSize: { xs: "1.875rem", lg: "2.25rem" },
                lineHeight: 1.3,
                mb: 3,
                position: "relative",
                display: "inline-block",
                "&::after": {
                  content: '""',
                  position: "absolute",
                  bottom: "-24px",
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "60px",
                  height: "3px",
                  backgroundColor: "#3498db",
                  borderRadius: "2px"
                }
              }}
            >
              How It Works
            </Typography>
          </Box>

          <Grid2 container spacing={4} sx={{ mt: 2, justifyContent: { xs: "center", md: "flex-start" } }}>
            <Grid2 size={{ xs: 12, md: 6, lg: 3 }}>
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                p: 4,
                height: "100%",
                bgcolor: "#f8f9fa",
                borderRadius: 3,
                transition: "all 0.3s ease",
                maxWidth: { xs: "30rem", md: "none" },
                mx: { xs: "auto", md: 0 },
                "&:hover": {
                  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                  transform: "translateY(-4px)"
                }
              }}>
                <Box sx={{
                  p: 3,
                  bgcolor: "#e3f2fd",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3
                }}>
                  <PetsIcon sx={{ fontSize: 40, color: "#1976d2" }} />
                </Box>
                <Typography variant="h5" gutterBottom sx={{
                  fontWeight: 700,
                  color: "#2c3e50",
                  fontSize: "1.4rem",
                  mb: 2
                }}>
                  1. Register Your Pets
                </Typography>
                <Typography variant="body1" sx={{
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  color: "#5a6c7d"
                }}>
                  Create an account and register your pets in our database.
                  This ensures that all of their information is available in case they go missing.
                </Typography>
              </Box>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6, lg: 3 }}>
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                p: 4,
                height: "100%",
                bgcolor: "#f8f9fa",
                borderRadius: 3,
                transition: "all 0.3s ease",
                maxWidth: { xs: "30rem", md: "none" },
                mx: { xs: "auto", md: 0 },
                "&:hover": {
                  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                  transform: "translateY(-4px)"
                }
              }}>
                <Box sx={{
                  p: 3,
                  bgcolor: "#ffebee",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3
                }}>
                  <ReportProblemIcon sx={{ fontSize: 40, color: "#d32f2f" }} />
                </Box>
                <Typography variant="h5" gutterBottom sx={{
                  fontWeight: 700,
                  color: "#2c3e50",
                  fontSize: "1.4rem",
                  mb: 2
                }}>
                  2. Submit a Report
                </Typography>
                <Typography variant="body1" sx={{
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  color: "#5a6c7d"
                }}>
                  If your pet gets lost, you can submit a report with just a few clicks. Others can report sightings or contact you directly if they find your pet.
                </Typography>
              </Box>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6, lg: 3 }}>
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                p: 4,
                height: "100%",
                bgcolor: "#f8f9fa",
                borderRadius: 3,
                transition: "all 0.3s ease",
                maxWidth: { xs: "30rem", md: "none" },
                mx: { xs: "auto", md: 0 },
                "&:hover": {
                  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                  transform: "translateY(-4px)"
                }
              }}>
                <Box sx={{
                  p: 3,
                  bgcolor: "#f3e5f5",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3
                }}>
                  <ArrowUpwardIcon sx={{ fontSize: 40, color: "#9c27b0" }} />
                </Box>
                <Typography variant="h5" gutterBottom sx={{
                  fontWeight: 700,
                  color: "#2c3e50",
                  fontSize: "1.4rem",
                  mb: 2
                }}>
                  3. Boost for Visibility
                </Typography>
                <Typography variant="body1" sx={{
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  color: "#5a6c7d"
                }}>
                  Share lost pet reports on social media to help spread the word, or generate printable flyers to distribute in your community.
                </Typography>
              </Box>
            </Grid2>

            <Grid2 size={{ xs: 12, md: 6, lg: 3 }}>
              <Box sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                textAlign: "center",
                p: 4,
                height: "100%",
                bgcolor: "#f8f9fa",
                borderRadius: 3,
                transition: "all 0.3s ease",
                maxWidth: { xs: "30rem", md: "none" },
                mx: { xs: "auto", md: 0 },
                "&:hover": {
                  boxShadow: "0 4px 20px rgba(0,0,0,0.12)",
                  transform: "translateY(-4px)"
                }
              }}>
                <Box sx={{
                  p: 3,
                  bgcolor: "#e8f5e9",
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 3
                }}>
                  <FavoriteIcon sx={{ fontSize: 40, color: "#2e7d32" }} />
                </Box>
                <Typography variant="h5" gutterBottom sx={{
                  fontWeight: 700,
                  color: "#2c3e50",
                  fontSize: "1.4rem",
                  mb: 2
                }}>
                  4. Support Others
                </Typography>
                <Typography variant="body1" sx={{
                  fontSize: "1.05rem",
                  lineHeight: 1.7,
                  color: "#5a6c7d"
                }}>
                  Provide support for other pet parents by sharing reports, submitting tips, and keeping an eye out for missing pets in your area.
                </Typography>
              </Box>
            </Grid2>
          </Grid2>

          <Box sx={{ textAlign: "center", mt: 5 }}>
            <Typography variant="body1" sx={{
              fontSize: "1.1rem",
              lineHeight: 1.7,
              color: "#5a6c7d",
              fontStyle: "italic",
              maxWidth: "800px",
              mx: "auto"
            }}>
              <span role="img" aria-label="Pro tip" style={{ marginRight: 8 }}>💡</span>
              <strong>Pro tip:</strong> You can submit reports for lost pets that you've found to help them find their way home!
            </Typography>
          </Box>
        </Box>
      </Container>

      <Container maxWidth="xl">
        <Box sx={{
          width: "100vw",
          position: "relative",
          left: "50%",
          right: "50%",
          marginLeft: "-50vw",
          marginRight: "-50vw",
          minHeight: { xs: "50vh", md: "60vh" },
          backgroundImage: "url('/images/man-with-dog.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center 48%",
          backgroundRepeat: "no-repeat",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          pt: { xs: 6, md: 8 },
          pb: { xs: 4, md: 6 },
          px: { xs: 4, md: 6 }
        }}>
          <Box sx={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: "linear-gradient(to bottom, rgba(0, 0, 0, 0.4) 0%, rgba(0, 0, 0, 0.6) 100%)",
            zIndex: 1
          }} />
            <Box sx={{
              position: "relative",
              zIndex: 2,
              textAlign: "center",
              width: "100%",
              maxWidth: "1200px",
              mx: "auto"
            }}>
              <Typography variant="h3" component="h2" gutterBottom sx={{
                  color: "white",
                  textShadow: "0 2px 4px rgba(0,0,0,0.3)",
                fontWeight: 700,
                fontSize: { xs: "1.75rem", sm: "1.75rem", md: "2rem" },
                mb: 3,
                lineHeight: 1.3,
                maxWidth: { xs: "600px", lg: "900px" },
                px: { xs: 1.75, sm: 4, md: 6, lg: 15 },
                mx: "auto"
              }}>
                Because their safety matters — and so does your peace of mind.
              </Typography>
              <Typography variant="h4" component="p" sx={{
                fontSize: { xs: "1.15rem", md: "1.175rem" },
                lineHeight: 1.5,
                fontWeight: 500,
                color: "rgba(255, 255, 255, 0.95)",
                textShadow: "0 1px 2px rgba(0,0,0,0.3)",
                mb: 6,
                pt: 1,
                maxWidth: { xs: "550px", lg: "none" },
                mx: "auto",
                px: { xs: 4, sm: 2, lg: 0 }
              }}>
                Registering your pet is fast, easy, and completely <strong>free</strong>.
            </Typography>
              <Button
                component={Link}
                to={user ? "/dashboard/pets?action=create" : "/signup"}
                variant="contained"
                size="large"
                sx={{
                  mt: { xs: 2, md: 3 },
                  px: { xs: 5, md: 7 },
                  py: { xs: 1.35, md: 1.65 },
                  fontWeight: 700,
                  borderRadius: 2,
                  textTransform: "none",
                  fontSize: { xs: "1.05rem", md: "1.15rem" },
                  letterSpacing: "0.015em",
                  boxShadow: "0 12px 30px rgba(31, 64, 111, 0.35)",
                  backdropFilter: "blur(4px)",
                  background: "linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(96, 165, 250, 0.95) 100%)",
                  "&:hover": {
                    background: "linear-gradient(135deg, rgba(37, 99, 235, 1) 0%, rgba(59, 130, 246, 1) 100%)",
                    boxShadow: "0 16px 40px rgba(37, 99, 235, 0.45)",
                    transform: "translateY(-2px)"
                  }
                }}
              >
                Get Started
              </Button>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default AboutPage;

