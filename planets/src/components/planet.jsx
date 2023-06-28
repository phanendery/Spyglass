import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Typography from "@mui/material/Typography";
import styled from "styled-components";

const PlanetContainer = styled(Card)`
  min-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export default function Planet({ planet }) {
  const formatTerrain = (terrain) => {
    if (!terrain) {
      return "";
    }

    const terrains = terrain.split(",").map((item) => {
      const words = item.trim().split(" ");
      const capitalizedWords = words.map((word) => {
        const capitalizedWord = word.charAt(0).toUpperCase() + word.slice(1);
        return capitalizedWord;
      });
      return capitalizedWords.join(" ");
    });

    return terrains.join(", ");
  };

  const {
    population,
    name,
    orbital_period,
    rotation_period,
    terrain,
    surface_water,
  } = planet;

  const formattedPopulation = parseInt(population, 10).toLocaleString();

  return (
    <PlanetContainer>
      <CardContent>
        <Typography gutterBottom variant="h4" component="div">
          {name}
        </Typography>
        <Typography variant="h6">
          Population:{" "}
          {formattedPopulation === "NaN" ? "Unknown" : formattedPopulation}
        </Typography>
        <Typography variant="h6">
          Year (No. of Days): {orbital_period}
        </Typography>
        <Typography variant="h6">
          Day (No. of Hours): {rotation_period}
        </Typography>
        <Typography variant="h6">Terrain: {formatTerrain(terrain)}</Typography>
        <Typography variant="h6" style={{ marginBottom: "20px" }}>
          Surface Water:{" "}
          {surface_water === "unknown" ? "Unknown" : `${surface_water}%`}{" "}
        </Typography>
        <Typography variant="h5">
          Residents:
          {planet.residents.length === 0 ? (
            <Typography>Unknown</Typography>
          ) : (
            planet.residents.map((resident, i) => (
              <Typography key={i}>{resident}</Typography>
            ))
          )}
        </Typography>
      </CardContent>
    </PlanetContainer>
  );
}
