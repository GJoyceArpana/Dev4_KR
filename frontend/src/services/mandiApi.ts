import axios from "axios";

export const getMandis = async () => {
  const response = await axios.get("/api/mandis");
  return response.data;
};
