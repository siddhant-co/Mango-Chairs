import axios from 'axios';

const NEXT_PUBLIC_API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL; 

async function fetchData(endpoint: string)   {
  try {
    const response = await axios.get(`${NEXT_PUBLIC_API_BASE_URL}/${endpoint}`);
    return response.data;
  } catch (error: any) {
    console.error(`Failed to fetch data from ${endpoint}:`, error.message);
    throw error;
  }
}

export default fetchData;