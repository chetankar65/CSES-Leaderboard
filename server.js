const express = require('express');
const bodyParser = require('body-parser');

const admin = require("firebase-admin");

// Initialize Firebase Admin SDK with the downloaded JSON key file
const serviceAccount = require("./key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Initialize Firestore
const db = admin.firestore();

const app = express();

urlEncodingObject = bodyParser.urlencoded({extended:false});

app.use(urlEncodingObject)

app.get("/", (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

app.get("/admin", (req, res) => {
    res.sendFile(__dirname + '/admin.html');
});

app.get("/css", (req, res) => {
    res.sendFile(__dirname + "/styles.css")
})

app.get("/firebase", (req, res) => {
    res.sendFile(__dirname + "/firebase.js")
})

app.post("/add", (req, res) => {
    const name = req.body.name;
    const roll_no = req.body.rno;

    const object = {
        name: name,
        roll_no: roll_no,
        points: 0
    }
    
    const newDocRef = db.collection("students").doc(); // Generates a new document ID

    newDocRef.set(object)
        .then(() => {
            console.log("Document added!");
            res.redirect("/admin")
        })
        .catch(error => {
            res.status(500).send("Error")
    });
})

app.get("/getData", async (req, res) => {
    /*
    const docRef = db.collection("students");

    docRef.get()
        .then(doc => {
            if (doc.exists) {
                console.log("Document data:", doc.data());
            } else {
                console.log("No such document!");
            }
        })
        .catch(error => {
            console.error("Error getting document: ", error);
        });

        */

        const studentsRef = db.collection("students");
        const snapshot = await studentsRef.get()

        snapshot.forEach(doc => {
            console.log(doc.id, '=>', doc.data())
        })
    
        res.send("Msg")
})


const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});
