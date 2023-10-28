const firebase = require("./firebase");
const Firestore = require("firebase/firestore")

const db = firebase.db;


const handleRegister = async (e) => {
    const name = e.target[0].value;
    const roll_no = e.target[1].value;

    console.log(name, roll_no)

    try {
        await Firestore.setDoc(Firestore.doc(db, "students", roll_no), {
            roll_no: roll_no,
            name: name
        })
    } catch (e) {
        console.log(e);
    }
}