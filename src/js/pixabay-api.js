import axios from "axios";
import iziToast from 'izitoast';
import 'izitoast/dist/css/iziToast.min.css';

const API_KEY = '44745838-36a359f27047326ac7e1bdda5';
const BASE_URL = 'https://pixabay.com/api/';
const PER_PAGE = 15;

export async function getPicturesByQuery(query, page = 1) {
  const url = `${BASE_URL}?key=${API_KEY}&q=${query}&image_type=photo&orientation=horizontal&safesearch=true&page=${page}&per_page=${PER_PAGE}`;
  try {
      const response = await axios.get(url);
    return response.data;
  } catch (error) {console.log(error);
  }
}