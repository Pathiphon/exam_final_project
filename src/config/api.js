import axios from "axios";

export default axios.create({
    baseURL: "http://localhost:8080",
    // baseURL:"https://nodejs-server-project.herokuapp.com/",
    headers: {
        "Content-type": "application/json",
        'Accept': 'application/json'
    },
});
