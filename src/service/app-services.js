import axios from "axios";

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

const TRANSLATE_TEXT_URL = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;
const GET_LANGUAGES_URL = `https://translation.googleapis.com/language/translate/v2/languages?key=${API_KEY}`;


export class AppService {

    static getLanguages() {
        return axios.post(GET_LANGUAGES_URL);
    }
    static translateText(text, language) {
        return axios.post(TRANSLATE_TEXT_URL, {
            q: text,
            source: "en",
            target: language
        });
    }

}

export default AppService;