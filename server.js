const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var http = require("http").createServer(app);

var io = require("socket.io")(http);

const admin = require("firebase-admin");

// Initialize Firebase Admin SDK with the downloaded JSON key file
const serviceAccount = require("./key.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

// Initialize Firestore
const db = admin.firestore();
app.use(express.json());


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

app.get("/css2", (req, res) => {
    res.sendFile(__dirname + "/styles2.css")
})

app.get("/firebase", (req, res) => {
    res.sendFile(__dirname + "/firebase.js")
})

app.get("/black_pattern", (req, res) => {
    res.sendFile(__dirname + "/black-pattern.png")
})

app.get("/design", (req, res) => {
    res.sendFile(__dirname + "/design.png")
})

app.post("/add", (req, res) => {
    const name = req.body.name;
    const roll_no = req.body.rno;

    const object = {
        name: name,
        roll_no: roll_no.toUpperCase(),
        points: 0
    }
    
    const newDocRef = db.collection("students").doc(roll_no.toUpperCase()); // Generates a new document ID

    newDocRef.set(object)
        .then(() => {
            //res.redirect("/admin")
            res.status(200).send("Success!")
        })
        .catch(error => {
            res.status(500).send("Error")
    });
})

app.post("/increase", async (req, res) => {
    const points = req.body.points;
    var roll_no = req.body.name;
    roll_no = roll_no.toUpperCase();

    const newDocRef = db.collection("students").doc(roll_no);
    const doc = await newDocRef.get(); 

    if (doc.data() != undefined) {
        var current_points = doc.data().points;
        current_points += Number(points);

        const object = {
            name: doc.data().name,
            roll_no: doc.data().roll_no,
            points: current_points
        }

        newDocRef.set(object)
            .then(() => {
                res.status(200).send("Success!")
            })
            .catch(error => {
                res.status(500).send("Error")
        });
    } else {
        res.status(400).send("Invalid argument!")
    }

})

app.post("/decrease", async (req, res) => {
    const points = req.body.points;
    var roll_no = req.body.name;
    roll_no = roll_no.toUpperCase();

    const newDocRef = db.collection("students").doc(roll_no);
    const doc = await newDocRef.get(); 

    if (doc.data() != undefined) {
        var current_points = doc.data().points;
        current_points -= Number(points);

        const object = {
            name: doc.data().name,
            roll_no: doc.data().roll_no,
            points: current_points
        }

        newDocRef.set(object)
            .then(() => {
                res.status(200).send("Success!")
            })
            .catch(error => {
                res.status(500).send("Error")
        });
    } else {
        res.status(400).send("Invalid argument!")
    }
})

app.get("/getData", async (req, res) => {
    const studentsRef = db.collection("students");
    const snapshot = await studentsRef.orderBy('points', 'desc').get()

    let returnedArray = [];

    snapshot.forEach(doc => {
        //console.log(doc.id, '=>', doc.data())
        returnedArray.push(doc.data());
    })

    
    res.status(200).send({data: returnedArray})
})

app.post("/reset_points", async (req, res) => {
    const collectionRef = db.collection("students");

    collectionRef.get()
    .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
        doc.ref.update({ points: 0 });
        });
    })
    .then(() => {
        console.log("Field updated in all documents.");
        res.status(200).send("Success!")
    })
    .catch((error) => {
        console.error("Error updating field:", error);
        res.status(400).send("Error!")
    });
})


const PORT = process.env.PORT || 8080;
http.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}.`);
});

// adding socket functionality
io.on('connection', (socket) => {
    console.log('A user connected');

    socket.on('updateLeaderboard', async () => {
        const snapshot = await studentsRef.orderBy('points', 'desc').get();
        let returnedArray = [];

        snapshot.forEach(doc => {
            returnedArray.push(doc.data());
        });

        io.emit('dataUpdated', { data: returnedArray });
    });

    socket.on('disconnect', () => {
        console.log('A user disconnected');
    });
});