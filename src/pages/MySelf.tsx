import { useEffect, useState } from "react";
import CryptoJS from "crypto-js";
import {
  Container,
  Card,
  CardContent,
  Typography,
  CircularProgress,
} from "@mui/material";

interface User {
  name: string;
  email: string;
}

function Myself() {
  const [profileData, setProfileData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<any | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const key = "MyUserKey"; // O'zingizning kalitni qo'shing
      const secret = "2892678138d8d793a28fc49055095d8b"; // O'zingizning maxfiy kalitni qo'shing
      const method = "GET";
      const url = "/myself";

      const stringToSign = `${method}${url}${secret}`;
      const sign = CryptoJS.MD5(stringToSign).toString();

      try {
        const response = await fetch("https://no23.lavina.tech/myself", {
          method: "GET",
          headers: {
            Key: key,
            Sign: sign,
          },
        });

        if (!response.ok) {
          throw new Error("Network response was not ok");
        }

        const result = await response.json();
        console.log("Javob:", result);
        setProfileData(result.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile data:", error);
        setError(error as any);
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  if (loading) {
    return <CircularProgress />;
  }

  if (error) {
    return <Typography color="error">Error: {error.message}</Typography>;
  }

  return (
    <Container>
      <Card>
        <CardContent>
          <Typography variant="h4" gutterBottom>
            Profile
          </Typography>
          {profileData && (
            <>
              <Typography variant="h6">Name: {profileData.name}</Typography>
              <Typography variant="h6">Email: {profileData.email}</Typography>
            </>
          )}
        </CardContent>
      </Card>
    </Container>
  );
}

export default Myself;
