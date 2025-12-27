export const getEventRecommendations = async (userId) => {
  try {
    // Assuming you send userId, or your auth token handles it
    const response = await axios.post(`${API_URL}/events/recommendations`, { userId });
    return response.data;
  } catch (error) {
    console.error("Error fetching AI suggestions:", error);
    throw error;
  }
};