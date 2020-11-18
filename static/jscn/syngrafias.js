/*************************************************************************
*
* -*- coding: utf-8 -*-
*
*   Copyright © 2019-2020 Akashdeep Dhar <t0xic0der@fedoraproject.org>
*
*   This copyrighted material is made available to anyone wishing to use,
*   modify, copy, or redistribute it subject to the terms and conditions
*   of the GNU General Public License v.2, or (at your option) any later
*   version.  This program is distributed in the hope that it will be
*   useful, but WITHOUT ANY WARRANTY expressed or implied, including the
*   implied warranties of MERCHANTABILITY or FITNESS FOR A PARTICULAR
*   PURPOSE.  See the GNU General Public License for more details.  You
*   should have received a copy of the GNU General Public License along
*   with this program; if not, write to the Free Software Foundation,
*   Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
*
*************************************************************************/

function autoconv(celliden) {
    let textdata = document.getElementById("textdata-" + celliden).value;
    let htmldata = Asciidoctor().convert(textdata);
    document.getElementById("otptdata-" + celliden).innerHTML = htmldata;
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
    for (let indx = lent; indx > 0; indx--) {
        randstng += list[Math.floor(Math.random() * list.length)];
    }
    return randstng;
}

function sendnote(celliden)
{
    if (webesock.readyState === 3) {
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Connection failed</strong><br/>₹" + celliden + " could not be edited</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
        $("#sockfail").modal("setting", "closable", false).modal("show");
    } else {
        let contents = document.getElementById("textdata-" + celliden).value;
        let writings = JSON.stringify({"taskcomm": "/note", "celliden": celliden, "contents": contents});
        webesock.send(JSON.stringify({username: sessionStorage.getItem("username"), sessiden: sessionStorage.getItem("sessiden"), textmesg: writings}));
        toastr.info("<span class='textbase' style='font-size: 15px;'><strong>Editing in progress</strong><br/>₹" + celliden + " (" + sessionStorage.getItem("username") + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
        makelogs(celliden, "/note", sessionStorage.getItem("username"));
    }
}

function recvnote(celliden, contents, noteauth)
{
    let celllist = JSON.parse(sessionStorage.getItem("celllist"));
    if (celliden in celllist) {
        document.getElementById("textdata-" + celliden).value = contents;
        autoconv(celliden);
        toastr.info("<span class='textbase' style='font-size: 15px;'><strong>Editing in progress</strong><br/>₹" + celliden + " (" + noteauth + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    } else {
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Out-of-sync cell contents</strong><br/>₹" + celliden + " (" + noteauth + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    }
    makelogs(celliden, "/note", noteauth);
}

function sendttle(celliden)
{
    if (webesock.readyState === 3) {
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Connection failed</strong><br/>₹" + celliden + " could not be renamed</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
        $("#sockfail").modal("setting", "closable", false).modal("show");
    } else {
        let contents = document.getElementById("cellname-"+celliden).value;
        let writings = JSON.stringify({"taskcomm": "/ttle", "celliden": celliden, "contents": contents});
        webesock.send(JSON.stringify({username: sessionStorage.getItem("username"), sessiden: sessionStorage.getItem("sessiden"), textmesg: writings}));
        toastr.info("<span class='textbase' style='font-size: 15px;'><strong>Renaming in progress</strong><br/>₹" + celliden + " (" + sessionStorage.getItem("username") + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
        makelogs(celliden, "/ttle", sessionStorage.getItem("username"));
    }
}

function recvttle(celliden, contents, ttleauth)
{
    let celllist = JSON.parse(sessionStorage.getItem("celllist"));
    if (celliden in celllist) {
        document.getElementById("cellname-" + celliden).value = contents;
        toastr.info("<span class='textbase' style='font-size: 15px;'><strong>Renaming in progress</strong><br/>₹" + celliden + " (" + ttleauth + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    } else {
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Out-of-sync cell title</strong><br/>₹" + celliden + " (" + ttleauth + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    }
    makelogs(celliden, "/ttle", ttleauth);
}

function askusdat()
{
    $("#givename").modal("setting", "closable", false).modal("show");
}

function makesess() {
    let username = document.getElementById("username").value;
    let sessiden = document.getElementById("sessiden").value;
    if (username !== "" && sessiden !== "") {
        if (!(/\s/.test(username) || /\s/.test(sessiden))) {
            if (sessiden.match(/^[A-F0-9]{8}$/) && username.match(/^[a-z0-9]+$/i)) {
                sessionStorage.setItem("username", username);
                sessionStorage.setItem("sessiden", sessiden);
                sessionStorage.setItem("celllist", "{}");
                sessionStorage.setItem("actilogs", "[]");
                $('#givename').modal('hide');
                document.getElementById("headuser").innerText = username;
                document.getElementById("headroom").innerText = sessiden;
                toastr.success("<span class='textbase' style='font-size: 15px;'><strong>Welcome to Syngrafias</strong><br/>Share this workspace identity now</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
            } else {
                toastr.error("<span class='textbase' style='font-size: 15px;'>Please rectify your input in either username or workspace identity fields before continuing.</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
            }
        } else {
            toastr.error("<span class='textbase' style='font-size: 15px;'>Please rectify your input in either username or workspace identity fields before continuing.</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
        }
    } else {
        toastr.error("<span class='textbase' style='font-size: 15px;'>Please rectify your input in either username or workspace identity fields before continuing.</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    }
}

function wkeybild()
{
    document.getElementById("sessiden").value = randgene();
    toastr.success("<span class='textbase' style='font-size: 15px;'>A new workspace identity was generated and automatically entered in the form.</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
}

function sendpush()
{
    if (webesock.readyState === 3) {
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Connection failed</strong><br/>Cell could not be created</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
        $("#sockfail").modal("setting", "closable", false).modal("show");
    } else {
        let celliden = randgene();
        let celllist = JSON.parse(sessionStorage.getItem("celllist"));
        celllist[celliden] = {"cellauth": sessionStorage.getItem("username"), "maketime": Date.now()};
        sessionStorage.setItem("celllist", JSON.stringify(celllist));
        makecell(celliden);
        let writings = JSON.stringify({"taskcomm": "/push", "celliden": celliden});
        webesock.send(JSON.stringify({username: sessionStorage.getItem("username"), sessiden: sessionStorage.getItem("sessiden"), textmesg: writings}));
        toastr.success("<span class='textbase' style='font-size: 15px;'><strong>Cell created</strong><br/>₹" + celliden + " (" + sessionStorage.getItem("username") + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
        makelogs(celliden, "/push", sessionStorage.getItem("username"));
    }
}

function recvpush(celliden, username)
{
    let celllist = JSON.parse(sessionStorage.getItem("celllist"));
    celllist[celliden] = {"cellauth": username, "maketime": Date.now()};
    sessionStorage.setItem("celllist", JSON.stringify(celllist));
    makecell(celliden);
    toastr.success("<span class='textbase' style='font-size: 15px;'><strong>Cell created</strong><br/>₹" + celliden + "</strong> (" + username + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    makelogs(celliden, "/push", username);
}

function makecell(celliden)
{
    $("#domelist").append(
        "<div class='ui card' style='margin-left:0.75%; width: 98.5%; margin-right:0.75%;' id='cardiden-" + celliden + "'>" +
        "<div class='content'>" + "<div class='ui tiny labeled input' style='width: 100%;'>" +
        "<div class='ui label monotext' id='celliden' onclick='cellinfo(\"" + celliden + "\")'>" + celliden + "</div>" +
        "<input type='text' class='monotext' id='cellname-" + celliden + "' onkeyup='sendttle(\"" + celliden + "\");' placeholder='Enter the cell name here'>" + "</div>" +
        "<br/><br/>" + "<div class='description'>" + "<div class='ui grid'>" + "<div class='eight wide column'>" +
        "<div class='ui tiny form field'>" + "<textarea rows='2' id='textdata-" + celliden +
        "' class='monotext' onkeyup='autoconv(\"" + celliden + "\"); sendnote(\"" + celliden + "\");'></textarea>" +
        "</div>" + "</div>" + "<div class='eight wide column' style='border-width: 2px; border-radius: 2px;'>" +
        "<div class='ui form textbase' style='border: 1px solid #dedede; border-radius: 5px; height: 100%; padding: 1%;' id='otptdata-" + celliden + "'></div>" +
        "</div>" + "</div>" + "</div>" + "</div>" + "</div>");
}

function sendpull(celliden)
{
    if (webesock.readyState === 3) {
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Connection failed</strong><br/>₹" + celliden + " could not be removed</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
        $("#sockfail").modal("setting", "closable", false).modal("show");
    } else {
        let celllist = JSON.parse(sessionStorage.getItem("celllist"));
        delete celllist[celliden];
        sessionStorage.setItem("celllist", JSON.stringify(celllist));
        document.getElementById("cardiden-"+celliden).remove();
        $("#infomode").modal("hide");
        let writings = JSON.stringify({"taskcomm": "/pull", "celliden": celliden});
        webesock.send(JSON.stringify({username: sessionStorage.getItem("username"), sessiden: sessionStorage.getItem("sessiden"), textmesg: writings}));
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Cell removed</strong><br/>₹" + celliden + " (" + sessionStorage.getItem("username") + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
        makelogs(celliden, "/pull", sessionStorage.getItem("username"));
    }
}

function recvpull(celliden, username)
{
    let celllist = JSON.parse(sessionStorage.getItem("celllist"));
    if (celliden in celllist) {
        delete celllist[celliden];
        sessionStorage.setItem("celllist", JSON.stringify(celllist));
        document.getElementById("cardiden-"+celliden).remove();
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Cell removed</strong><br/>₹" + celliden + " (" + username + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    } else {
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Removal failed</strong><br/>₹" + celliden + " (" + username + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    }
    makelogs(celliden, "/pull", username);
}

function cellinfo(celliden)
{
    let celljson = JSON.parse(sessionStorage.getItem("celllist"));
    document.getElementById("modeiden").innerText = celliden;
    document.getElementById("modeauth").innerText = celljson[celliden]["cellauth"];
    document.getElementById("modetime").innerText = celljson[celliden]["maketime"];
    document.getElementById("modework").innerText = sessionStorage.getItem("sessiden");
    document.getElementById("rmovbutn").setAttribute("onclick", "sendpull('" + celliden + "')");
    $("#infomode").modal("show");
}

function marktime() {
    let curtdate = new Date();
    let hour = curtdate.getHours(); let mint = curtdate.getMinutes(); let secs = curtdate.getSeconds();
    return chektime(hour) + ":" + chektime(mint) + ":" + chektime(secs);
}

function makelogs(celliden, activity, username)
{
    let actilist = JSON.parse(sessionStorage.getItem("actilogs"));
    let actiobjc = "";
    if (username === sessionStorage.getItem("username"))    {actiobjc += "You";}
    else                                                         {actiobjc += username;}
    if (activity === "/push")                                    {actiobjc += " created a cell";}
    else if (activity === "/pull")                               {actiobjc += " removed a cell";}
    else if (activity === "/note")                               {actiobjc += " wrote to a cell";}
    else if (activity === "/ttle")                               {actiobjc += " renamed a cell";}
    actilist[actilist.length] = {"timestmp": marktime(), "actiobjc": actiobjc, "celliden": celliden};
    sessionStorage.setItem("actilogs", JSON.stringify(actilist));
}

function viewlogs()
{
    $("#actiform").remove();
    let actilist = JSON.parse(sessionStorage.getItem("actilogs"));
    $("#actijuxt").append("<table id='actiform' class='ui very compact table'>" + "<tbody id='actitabl'></tbody>" + "</table>");
    for (let indx = 0; indx < actilist.length; indx++) {
        $("#actitabl").append("<tr class='textbase'><td style='font-size: 15px;'>" + actilist[indx]["timestmp"] + "</td><td style='font-size: 15px;'>" + actilist[indx]["actiobjc"] + "<br/><strong class='monotext'>₹" + actilist[indx]["celliden"] + "</strong></td></tr>");
    }
    $("#actilogs").modal("show");
}

function rmovhist()
{
    if (sessionStorage.getItem("actilogs") === "[]") {
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Activity history is empty</strong></span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    } else {
        sessionStorage.setItem("actilogs", "[]");
        toastr.success("<span class='textbase' style='font-size: 15px;'><strong>Activity history is cleared</strong></span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    }
}