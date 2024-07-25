import axios from "axios";

const API_KEY = process.env.REACT_APP_GOOGLE_API_KEY;

// const apiKey = 'AIzaSyDLzvFjaBMgjaYjUKHsZjvFVRaG4QQu6HA';
const url = `https://translation.googleapis.com/language/translate/v2?key=${API_KEY}`;


export class AppService {

    static translateText(text, language) {
        return axios.post(url, {
            q: text,
            source: "en",
            target: language
        });
    }

}

export default AppService;