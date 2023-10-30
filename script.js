const socket = io();

socket.on("updateLeaderboard", function( response ) {
    Array.from(document.getElementsByClassName("top-5")).forEach((box) => {
        box.childNodes[1].classList.remove("large-text");
        box.childNodes[1].classList.add("medium-text");
        box.childNodes[3].classList.add("small-text");
    })

    document.getElementById("one").innerHTML = '';
    document.getElementById("two").innerHTML = '';
    document.getElementById("three").innerHTML = '';
    document.getElementById("four").innerHTML = '';
    document.getElementById("five").innerHTML = '';

    try {
        document.getElementById("one").innerHTML = response.data[0].name;
        document.getElementById("two").innerHTML = response.data[1].name;
        document.getElementById("three").innerHTML = response.data[2].name;
        document.getElementById("four").innerHTML = response.data[3].name;
        document.getElementById("five").innerHTML = response.data[4].name;
    } catch(e){}
                // response.data[i].fieldname
        document.getElementById("one-text").innerHTML = response.data[0].points + " Points";
        document.getElementById("two-text").innerHTML = response.data[1].points + " Points";
        document.getElementById("three-text").innerHTML = response.data[2].points + " Points";
        document.getElementById("four-text").innerHTML = response.data[3].points + " Points";
        document.getElementById("five-text").innerHTML = response.data[4].points + " Points";
    });

/*Adding part*/
const addBtn = document.getElementById("add")

addBtn.addEventListener("click", (e) => {
    e.preventDefault()
    const name_field = document.getElementById("name").value;
    const rno_field = document.getElementById("rno").value;

    if (name_field != "" && rno_field != "") {
        axios.post("/add", {
            name: name_field,
            rno: rno_field
        })
        .then((response) => {
            //console.log("Success")
            if (response.status == 200) {
                Toastify({
                    text: "Participant Registered!",
                    duration: 1500,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "linear-gradient(135deg, #2b6082 0%, #8082a3 100%)",
                    },
                    onClick: function(){} // Callback after click
                }).showToast();
            } else {
                Toastify({
                    text: "Some Issue!",
                    duration: 1500,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "linear-gradient(98.3deg, rgb(0, 0, 0) 10.6%, rgb(255, 0, 0) 97.7%)",
                    },
                    onClick: function(){} // Callback after click
                }).showToast();
            }
        })
    }
})
///////////

/*Adding part*/
const increaseBtn = document.getElementById("increase")

increaseBtn.addEventListener("click", (e) => {
    e.preventDefault()
    const rno = document.getElementById("username").value;
    const points = document.getElementById("points").value;


    if (rno != "" && points >= 1 && points <= 1000) {
        axios.post("/increase", {
            name: rno,
            points: points
        })
        .then((response) => {
            if (response.status == 200) {
                socket.emit("dataUpdate", false);

                Toastify({
                    text: `${points} Points Added!`,
                    duration: 1500,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "linear-gradient(135deg, #2b6082 0%, #8082a3 100%)",
                    },
                    onClick: function(){} // Callback after click
                }).showToast();
            } 
        })
        .catch(function (error) {
            if (error.response.status == 400) {
                Toastify({
                    text: "Participant Not Registered",
                    duration: 1500,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "linear-gradient(98.3deg, rgb(0, 0, 0) 10.6%, rgb(255, 0, 0) 97.7%)",
                    },
                    onClick: function(){} // Callback after click
                }).showToast();
            }
        })

    }

    else {
        Toastify({
            text: `Invalid Details`,
            duration: 1500,
            destination: "https://github.com/apvarun/toastify-js",
            newWindow: true,
            close: true,
            gravity: "top", // `top` or `bottom`
            position: "right", // `left`, `center` or `right`
            stopOnFocus: true, // Prevents dismissing of toast on hover
            style: {
                background: "linear-gradient(135deg, #2b6082 0%, #8082a3 100%)",
            },
            onClick: function(){} // Callback after click
        }).showToast();
    }
})

/*Clearing part*/
const clearBtn = document.getElementById("clear")

clearBtn.addEventListener("click", (e) => {
    e.preventDefault()
    let text = "Are you sure you want to clear the scores?"

    if (confirm(text) == true) {
        axios.post("/reset_points", {})
        .then((response) => {
            if (response.status == 200) {
                Toastify({
                    text: "Points cleared!",
                    duration: 1500,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "linear-gradient(135deg, #2b6082 0%, #8082a3 100%)",
                    },
                    onClick: function(){} // Callback after click
                }).showToast();
            } 
        })
        .catch(function (error) {
            if (error.response.status == 400) {
                Toastify({
                    text: "Some error...",
                    duration: 1500,
                    destination: "https://github.com/apvarun/toastify-js",
                    newWindow: true,
                    close: true,
                    gravity: "top", // `top` or `bottom`
                    position: "right", // `left`, `center` or `right`
                    stopOnFocus: true, // Prevents dismissing of toast on hover
                    style: {
                        background: "linear-gradient(98.3deg, rgb(0, 0, 0) 10.6%, rgb(255, 0, 0) 97.7%)",
                    },
                    onClick: function(){} // Callback after click
                }).showToast();
            }
        })
    }
})