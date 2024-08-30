import { error as displayError } from "../components/messager/messager";

export const handleFetchKORIByName = async (axios, searchTerm) => {
  try {
    const response = await axios.get(
      `/api/kori/search_by_name?search=${encodeURIComponent(searchTerm)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching searched courses from KORI:", error);
    displayError("Kurssitietoja ei saatu haettua");
  }
};

export const handleFetchKORICourseInfo = async (axios, searchTerm) => {
  try {
    const response = await axios.get(
      `/api/kori/get_info_by_id?search=${encodeURIComponent(searchTerm)}`
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching searched courses: ", error);
  }
};
