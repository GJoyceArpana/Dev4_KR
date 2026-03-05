import axios from "axios";

export const calculateProfit = async (input: any) => {
  const response = await axios.post(
    "http://localhost:5000/api/calculate",
    input
  );
  return response.data;
};
