/*
**************************************************************************
*
*   Copyright © 2019-2020 Akashdeep Dhar <t0xic0der@fedoraproject.org>
*
*   This program is free software: you can redistribute it and/or modify
*   it under the terms of the GNU General Public License as published by
*   the Free Software Foundation, either version 3 of the License, or
*   (at your option) any later version.
*
*   This program is distributed in the hope that it will be useful,
*   but WITHOUT ANY WARRANTY; without even the implied warranty of
*   MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
*   GNU General Public License for more details.
*
*   You should have received a copy of the GNU General Public License
*   along with this program.  If not, see <https://www.gnu.org/licenses/>.
*
**************************************************************************
*/

function autoconv() {
    let textdata = document.getElementById("textdata").value;
    let htmldata = Asciidoctor().convert(textdata);
    document.getElementById("otptdata").innerHTML = htmldata;
}

function chektime(chekqant)
{
    if (chekqant < 10)  return "0" + chekqant;
    else                return chekqant;
}

function timeqant()
{
    let curtdate = new Date();
    let hour = curtdate.getHours(); let mint = curtdate.getMinutes(); let secs = curtdate.getSeconds();
    hour = chektime(hour); mint = chektime(mint); secs = chektime(secs);
    document.getElementById("timehead").innerHTML = hour + ":" + mint + ":" + secs;
    let time = setTimeout(timeqant, 500);
}

function randgene()
{
    let randstng = "";
    let lent = 8; let list = "0123456789ABCDEF";
    for (let indx = lent; indx > 0; indx--)
    {
        randstng += list[Math.floor(Math.random() * list.length)];
    }
    // document.getElementById('sessiden').value = randstng;
    // toastr.success("<span class='textbase' style='font-size: 15px;'>A new workspace identity was generated and automatically entered in the form.</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    return randstng;
}

function wkeybuild() {
    document.getElementById("sessiden").value = randgene();
    toastr.success("<span class='textbase' style='font-size: 15px;'>A new workspace identity was generated and automatically entered in the form.</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
}

function sendnote() {
    if (webesock.readyState === 3) {
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Connection failed</strong><br/>Contents could not be edited</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
        $("#sockfail").modal("setting", "closable", false).modal("show");
    } else {
        let contents = document.getElementById("textdata").value;
        let writings = JSON.stringify({"taskcomm": "/note", "contents": contents});
        webesock.send(JSON.stringify({username: sessionStorage.getItem("username"), sessiden: sessionStorage.getItem("sessiden"), textmesg: writings}));
        toastr.info("<span class='textbase' style='font-size: 15px;'><strong>Editing in progress</strong><br/>(" + sessionStorage.getItem("username") + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
        //makelogs(celliden, "/note", sessionStorage.getItem("username"));
    }
}

function recvnote(contents, noteauth) {
    document.getElementById("textdata").value = contents;
    autoconv();
    toastr.info("<span class='textbase' style='font-size: 15px;'><strong>Editing in progress</strong><br/>(" + noteauth + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    /*
    if (celliden in celllist) {
        document.getElementById("textdata").value = contents;
        autoconv(celliden);
        toastr.info("<span class='textbase' style='font-size: 15px;'><strong>Editing in progress</strong><br/>₹" + celliden + " (" + noteauth + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    } else {
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Out-of-sync cell contents</strong><br/>₹" + celliden + " (" + noteauth + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    }
    */
    //makelogs(celliden, "/note", noteauth);
}

/*
function sendnote() {
    let contents = document.getElementById("textdata").value;
    let writings = "/note" + " " + contents;
    webesock.send(JSON.stringify({username: sessionStorage.getItem("username"), sessiden: sessionStorage.getItem("sessiden"), textmesg: writings}));
}
*/

function docsname() {
    let docsname = document.getElementById("docsname").value;
}

function askusdat() {
    $(".ui.basic.modal").modal('setting', 'closable', false).modal("show");
}

function makesess() {
    let username = document.getElementById("username").value;
    let sessiden = document.getElementById("sessiden").value;
    if (username !== "" && sessiden !== "") {
        if (!(/\s/.test(username) || /\s/.test(sessiden))) {
            if (sessiden.match(/^[A-F0-9]{8}$/) && username.match(/^[a-z0-9]+$/i)) {
                sessionStorage.setItem("username", username);
                sessionStorage.setItem("sessiden", sessiden);
                $('#givename').modal('hide');
                document.getElementById("headroom").innerText = sessiden;
                document.getElementById("headuser").innerText = username;
            } else {
                toastr.error("<span class='textbase'>Please rectify your input in either username or workspace key fields before continuing.</span>","",{"positionClass": "toast-bottom-right"});
            }
        } else {
            toastr.error("<span class='textbase'>Please rectify your input in either username or workspace key fields before continuing.</span>","",{"positionClass": "toast-bottom-right"});
        }
    }
    return false;
}

function copyID() {
    const id = document.getElementById("headroom").innerText;
    var tempIn = document.createElement("input");
    tempIn.value = id;
    document.body.appendChild(tempIn);
    tempIn.select();
    document.execCommand("copy");
    document.body.removeChild(tempIn);
    toastr.success("<span class='textbase'>Workspace ID is copied.</span>","",{"positionClass": "toast-bottom-right"})
}