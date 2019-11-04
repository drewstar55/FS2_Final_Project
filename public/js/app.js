////////////
// app.js
////////////
// web app Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyCFU7tEY_Sy2AHoCO5BH_Qz0xsDamOkUPo",
    authDomain: "fs2-final-project-68e14.firebaseapp.com",
    databaseURL: "https://fs2-final-project-68e14.firebaseio.com",
    projectId: "fs2-final-project-68e14",
    storageBucket: "fs2-final-project-68e14.appspot.com",
    messagingSenderId: "836919312735",
    appId: "1:836919312735:web:fea715bcf6dbe9f2f036ea",
    measurementId: "G-7YPSFMRB1M"
};

// holds the authenticated user ID
const urlParams = new URLSearchParams(window.location.search);
const parmUID = urlParams.get('uid');

// initialize Firebase
firebase.initializeApp(firebaseConfig);
const dbRef = firebase.database().ref();

// get the authenticating email and UID to display on user profile
firebase.auth().onAuthStateChanged((user) => {
    if (user) {
        document.getElementById('email').value = user.email;
        document.getElementById('userid').value = user.uid;
    }
});

try {
    // 
    const clientRef = dbRef.child('client').orderByChild("uid").equalTo(parmUID);
    const clientListUI = document.getElementById("clientList");
    const addClientBtnUI = document.getElementById("add-client-btn"); 
    addClientBtnUI.addEventListener("click", addClientBtnClicked);
    const cancelAddClientBtnUI = document.getElementById("cancel-add-client-btn"); 
    cancelAddClientBtnUI.addEventListener("click", cancelAddClientBtnClicked);
    const userProfileBtnUI = document.getElementById("open-user-profile-form-btn"); 
    userProfileBtnUI.addEventListener("click", userProfileBtnClicked);
    const systemInfoBtnUI = document.getElementById("open-system-info-form-btn"); 
    systemInfoBtnUI.addEventListener("click", systemInfoBtnClicked);

    // build the list of clients for the authenticated user ID
    clientRef.on("child_added", snapshot => {
        let client = snapshot.val();
        let key = snapshot.key;
        let $li = document.createElement("li");
        $li.innerHTML = client.name;
        // 'edit' icon attached to list element
        let editIconUI = document.createElement("span");
        editIconUI.class = "edit-client";
        editIconUI.innerHTML = "<br>&#9998;";
        editIconUI.setAttribute("clientID", key);
        editIconUI.addEventListener("click", editButtonClicked);
        $li.append(editIconUI);
        // 'delete' icon attached to list element
        let deleteIconUI = document.createElement("span");
        deleteIconUI.class = "delete-client";
        deleteIconUI.innerHTML = "&nbsp;&nbsp;&#9986;";
        deleteIconUI.setAttribute("clientID", key);
        deleteIconUI.addEventListener("click", deleteButtonClicked);
        $li.append(deleteIconUI);
        $li.setAttribute("child-key", snapshot.key);
        $li.addEventListener("click", clientClicked);
        clientListUI.append($li);
    });
}
catch(err) {
    alert("Client list build | Error: " + err.message);
}

// client record clicked, display client details
function clientClicked(e) {
    try {
        var clientID = e.target.getAttribute("child-key");
        //console.log(clientID);
        const clientRef = dbRef.child('client/' + clientID);
        const clientDetailUI = document.getElementById("clientDetail");
        clientDetailUI.innerHTML = "";
        // append a title to the div
        var $p = document.createElement("p");
        $p.innerHTML = "<legend>Client Details</legend>";
        clientDetailUI.append($p);

        clientRef.on("child_added", snapshot => {
            var $p = document.createElement("p");
            $p.innerHTML = snapshot.key.charAt(0).toUpperCase() + snapshot.key.slice(1) + " : " +  snapshot.val();
            clientDetailUI.append($p);
        });
        // display details when a client name is clicked
        document.getElementById('clientDetail').style.display = "block";
    }
    catch(err) {
        alert("fn clientClicked | Error: " + err.message);
    }
}
// add new client
function addClientBtnClicked() {
    try {
        const clientRef = dbRef.child('client');
        const addClientInputsUI = document.getElementsByClassName("client-input");
        
        // object to hold new client info
        let newClient = {};
        // loop through View to get the data for the model 
        const len = addClientInputsUI.length;
        for (i = 0; i < len; i++) {
            let key = addClientInputsUI[i].getAttribute('data-key');
            let value = addClientInputsUI[i].value;
            // the only stipulation for saving a client record is that a client name exists
            if (key == 'name') {
                // if no name entered then alert user and break out of the save fn
                if (!checkNameExist(value)) {
                    return;
                }
            };
            newClient[key] = value;
        }
        // append the uid
        newClient['uid'] = parmUID;
        // push new client object to the database
        clientRef.push(newClient);
        // erase the input fields
        for (i = 0; i < len; i++) {
            addClientInputsUI[i].value = "";
        }
        alert("New client record saved.");
        // reload the page
        location.reload(true);
    }
    catch(err) {
        alert("fn addClientBtnClicked | Error: " + err.message);
    }
}
// cancel adding a new client record
function cancelAddClientBtnClicked() {
    try {
        // remove details from fields
        const addClientInputsUI = document.getElementsByClassName("client-input");
        const len = addClientInputsUI.length;
        for (i = 0; i < len; i++) {
            addClientInputsUI[i].value = "";
        }
    }
    catch(err) {
        alert("fn cancelAddClientBtnClicked | Error: " + err.message);
    }
}

// user profile
function userProfileBtnClicked() {
    try {
        document.getElementById('system-info-module').style.display = "block";
    }
    catch(err) {
        alert("fn userProfileBtnClicked | Error: " + err.message);
    }
}

// system info
function systemInfoBtnClicked() {
    // currently display only info
    // this function could be used in future to contain
    // interactivity for contacting the developer
}

// delete client record
function deleteButtonClicked(e) {
    try {
        e.stopPropagation();
        // ask user if they are sure
        var del = confirm("Delete client record.\n\nAre you sure?");
        if (del) {
            var clientID = e.target.getAttribute("clientID");
            const clientRef = dbRef.child('client/' + clientID);
            clientRef.remove();
            // reload the page
            location.reload(true);
        }
    }
    catch(err) {
        alert("fn deleteButtonClicked | Error: " + err.message);
    }   
}
 
// edit client record
function editButtonClicked(e) {
    try {
        document.getElementById('edit-client-module').style.display = "block";
        //set client id to the hidden input field
        document.querySelector(".edit-clientID").value = e.target.getAttribute("clientID");
        const clientRef = dbRef.child('client/' + e.target.getAttribute("clientID"));
        // set data to the client field
        const editClientInputsUI = document.querySelectorAll(".edit-client-input");
        // populate 
        clientRef.on("value", snapshot => {
            let len = editClientInputsUI.length;
            for(var i = 0; i < len; i++) {
                var key = editClientInputsUI[i].getAttribute("data-key");
                        editClientInputsUI[i].value = snapshot.val()[key];
            }
        });
        const saveBtn = document.querySelector("#edit-client-btn");
        saveBtn.addEventListener("click", saveClientBtnClicked);
        const cancelBtn = document.querySelector("#cancel-edit-client-btn");
        cancelBtn.addEventListener("click", cancelClientBtnClicked);
        // remove details form when a client name is clicked
        document.getElementById('clientDetail').style.display = "none";
    }
    catch(err) {
        alert("fn editButtonClicked | Error: " + err.message);
    } 
}
// update edited client
function saveClientBtnClicked() {
    try {
        const clientID = document.querySelector(".edit-clientID").value;
        const clientRef = dbRef.child('client/' + clientID);
        var editedClientObject = {};
        var clientNameExists = true;
        const editClientInputsUI = document.querySelectorAll(".edit-client-input");
        editClientInputsUI.forEach(function(textField) {
            let key = textField.getAttribute("data-key");
            editedClientObject[key] = textField.value;
            // the only stipulation for saving a client record is that
            // something has been entered for client name
            if (key == 'name') {
                if (!checkNameExist(textField.value)) {
                    // if false then alert user and break out of the save fn
                    clientNameExists = false;
                    return;
                }
            }
        });
        if (clientNameExists) {
            clientRef.update(editedClientObject);
            // reload the page
            location.reload(true);
        }
    }
    catch(err) {
        alert("fn saveClientBtnClicked | Error: " + err.message);
    }
}
// cancel client details edit
function cancelClientBtnClicked() {
    try {
        //console.log("cancel record edit btn clicked");
        document.getElementById('edit-client-module').style.display = "none";
    }
    catch(err) {
        alert("fn cancelClientBtnClicked | Error: " + err.message);
    }
}
function checkNameExist(clientName) {
    try {
        if (clientName == "") {
            alert('Please enter a client name.');
            return false;
        }else{
            return true;
        }
    }
    catch(err) {
        alert('Please enter a client name.');
        return false;
    }
}
