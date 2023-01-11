import express from 'express';
import axios from 'axios';
import cors from 'cors';
import { xml2json } from 'xml-js';

const app = express();
const port = 3000;

const corsOptions = {
    origin: "http://localhost:5173"
}

app.get('/api/drones', cors(corsOptions), async (req, res) => {
    const result = await axios.get("https://assignments.reaktor.com/birdnest/drones");
    res.send(xml2json(result.data));
});
  
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});