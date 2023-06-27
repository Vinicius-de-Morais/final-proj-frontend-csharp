import axios from "axios";

const connection = axios;

connection.defaults.baseURL = "https://localhost:7284";
connection.defaults.headers = {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Cache': 'no-cache',
    'SameSite': 'Lax'
  }
connection.defaults.withCredentials = true;

export default connection;