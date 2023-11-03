const express = require('express');
const bodyParser = require('body-parser');
const app = express();

var http = require("http").createServer(app);

var io = require("socket.io")(http);

const admin = require("firebase-admin");

// Initialize Firebase Admin SDK with the downloaded JSON key file
//const serviceAccount = require("./key.json");

const serviceAccount = require("./key.json")
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

app.get("/scripts", (req, res) => {
    res.sendFile(__dirname + "/script.js")
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
        points1: 0,
        points2: 0
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
///////// GAME 1 BACKEND CODE
app.post("/increaseGame1", async (req, res) => {
    const points = req.body.points1;
    var roll_no = req.body.name;
    roll_no = roll_no.toUpperCase();

    const newDocRef = db.collection("students").doc(roll_no);
    const doc = await newDocRef.get(); 

    if (doc.data() != undefined) {
        var current_points = doc.data().points1;
        var current_points_2 = doc.data().points2;
        current_points += Number(points);

        const object = {
            name: doc.data().name,
            roll_no: doc.data().roll_no,
            points1: current_points,
            points2: current_points_2
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

app.post("/decreaseGame1", async (req, res) => {
    const points = req.body.points1;
    var roll_no = req.body.name;
    roll_no = roll_no.toUpperCase();

    const newDocRef = db.collection("students").doc(roll_no);
    const doc = await newDocRef.get(); 

    if (doc.data() != undefined) {
        var current_points = doc.data().points1;
        var current_points_2 = doc.data().points2;
        current_points -= Number(points);

        const object = {
            name: doc.data().name,
            roll_no: doc.data().roll_no,
            points1: current_points,
            points2: current_points_2
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
///////////////

/////////////////////// GAME 2 BACKEND CODE
app.post("/increaseGame2", async (req, res) => {
    const points = req.body.points2;
    var roll_no = req.body.name;
    roll_no = roll_no.toUpperCase();

    const newDocRef = db.collection("students").doc(roll_no);
    const doc = await newDocRef.get(); 

    if (doc.data() != undefined) {
        let current_points = doc.data().points2;
        let current_points_1 = doc.data().points1; 
        current_points += Number(points);

        const object = {
            name: doc.data().name,
            roll_no: doc.data().roll_no,
            points1: current_points_1,
            points2: current_points
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

app.post("/decreaseGame2", async (req, res) => {
    const points = req.body.points2;
    var roll_no = req.body.name;
    roll_no = roll_no.toUpperCase();

    const newDocRef = db.collection("students").doc(roll_no);
    const doc = await newDocRef.get(); 

    if (doc.data() != undefined) {
        var current_points = doc.data().points2;
        let current_points_1 = doc.data().points1; 
        current_points -= Number(points);

        const object = {
            name: doc.data().name,
            roll_no: doc.data().roll_no,
            points1: current_points_1,
            point2: current_points
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

///////////////////

///////// GETTING DATA for the two games
app.get("/getDataGame1", async (req, res) => {
    const studentsRef = db.collection("students");
    const snapshot = await studentsRef.orderBy('points1', 'desc').get()

    let returnedArray = [];

    snapshot.forEach(doc => {
        //console.log(doc.id, '=>', doc.data())
        returnedArray.push(doc.data());
    })

    
    res.status(200).send({data: returnedArray})
})

app.get("/getDataGame2", async (req, res) => {
    const studentsRef = db.collection("students");
    const snapshot = await studentsRef.orderBy('points2', 'desc').get()

    let returnedArray = [];

    snapshot.forEach(doc => {
        //console.log(doc.id, '=>', doc.data())
        returnedArray.push(doc.data());
    })

    
    res.status(200).send({data: returnedArray})
})

/// get the full leaderbpard
app.get("/fullLeaderboardGame1", async (req, res) => {
    const studentsRef = db.collection("students")
    const snapshot = await studentsRef.orderBy('points1', 'desc').get()

    let returnedArray = [];

    snapshot.forEach(doc => {
        returnedArray.push(doc.data())
    })

    res.status(200).send({data: returnedArray})
})

app.get("/fullLeaderboardGame2", async (req, res) => {
    const studentsRef = db.collection("students")
    const snapshot = await studentsRef.orderBy('points2', 'desc').get()

    let returnedArray = [];

    snapshot.forEach(doc => {
        returnedArray.push(doc.data())
    })

    res.status(200).send({data: returnedArray})
})

//////////// Full leaderboard section

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

// open socket connection
io.on('connection', (socket) => {

    // for the first time
    socket.on('dataFirstTime', async () => {
        const studentsRef = db.collection("students");
        const snapshot = await studentsRef.orderBy('points1', 'desc').limit(5).get();
        let returnedArray = [];

        snapshot.forEach(doc => {
            returnedArray.push(doc.data());
        });

        io.emit('displayLeaderboard', { data: returnedArray });
    });

    socket.on('dataUpdate', async () => {
        const studentsRef = db.collection("students");
        const snapshot = await studentsRef.orderBy('points1', 'desc').limit(5).get();
        let returnedArray = [];

        snapshot.forEach(doc => {
            returnedArray.push(doc.data());
        });

        io.emit('displayLeaderboard', { data: returnedArray });
    });

    /////////////////////////////////////////
    socket.on('dataFirstTime2', async () => {
        const studentsRef = db.collection("students");
        const snapshot = await studentsRef.orderBy('points2', 'desc').get();
        let returnedArray = [];

        snapshot.forEach(doc => {
            returnedArray.push(doc.data());
        });

        io.emit('displayLeaderboard2', { data: returnedArray });
    });

    socket.on('dataUpdate2', async () => {
        const studentsRef = db.collection("students");
        const snapshot = await studentsRef.orderBy('points2', 'desc').get();
        let returnedArray = [];

        snapshot.forEach(doc => {
            returnedArray.push(doc.data());
        });

        io.emit('displayLeaderboard2', { data: returnedArray });
    });

    socket.on('disconnect', () => {
    });
});

