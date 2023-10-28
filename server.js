const express = require('express');
const bodyParser = require('body-parser');
import { db } from './firebase';
import {doc, setDoc} from "firebase/firestore";

const app = express();

urlEncodingObject = bodyParser.urlencoded({extended:false});

app.use(urlEncodingObject)

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get("/admin", (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

app.post("/add", async (req, res) => {
    const name = req.body.name;
    const roll_no = req.body.roll_no;

    try {
        await setDoc(doc(db, "students", roll_no), {
            roll_no: roll_no,
            name: name
        })
    } catch (e) {
        console.log(e);
    }
})


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
