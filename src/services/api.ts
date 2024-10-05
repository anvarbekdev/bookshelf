import CryptoJS from "crypto-js";
const secret = import.meta.env.VITE_SECRET;
const key = import.meta.env.VITE_KEY;
const apiUrl = import.meta.env.VITE_API_URL;

export const fetchBooks = async (title?: string) => {
  const method = "GET";
  const url = `/books`;
  const stringToSign = `${method}${url}${secret}`;
  const sign = CryptoJS.MD5(stringToSign).toString();

  try {
    const response = await fetch(`${apiUrl}/books`, {
      method: "GET",
      headers: {
        Key: key,
        Sign: sign,
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching books:", error);
  }
};
