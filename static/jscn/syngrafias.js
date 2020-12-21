/*************************************************************************
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
*************************************************************************/

var gutterSize = 10;            // For Split.js

function opendocs() {
    document.getElementById("opdocstt").innerText = "Open documents";
    document.getElementById("opdocsid").innerHTML =
        "<p class='textbase' style='line-height: 1.25; text-align: justify; font-size: 15px;'>" +
        "The document that you open must be in the proper Syngrafias Workspace Document format. " +
        "Also, keep in mind that opening a new document would replace the document that you are " +
        "currently editing.</p>" +
        "<p class='textbase' style='line-height: 1.25; text-align: justify; font-size: 15px;'>" +
        "Browse for the file you want and then select it. Then, click on Open to load up the file. " +
        "Once the file is parsed, you would be given an option to continue with the loaded document " +
        "up for editing.</p>" +
        "<input class='ui small' style='width: 100%; text-align: center;' type='file' id='upldfile'>";
    document.getElementById("opdocsff").innerHTML =
        "<div class='ui mini button textbase' onclick=\"$('#opendocs').modal('hide');\"><span style='color: green;'>Cancel</span></div>" +
        "<div class='ui mini button textbase' onclick='loadupld();'><span style='color: red;'>Load</span></div>";
    document.getElementById('upldfile').value = null;
    $("#opendocs").modal("setting", "closable", false).modal("show");
}

function loadupld() {
    let upldfile = document.getElementById("upldfile").value;
    if (upldfile === "") {
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Load failed</strong><br/>You did not select a file<br/>" + sessionStorage.getItem("username") + "</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
        $("#opendocs").modal("hide");
    } else {
        if (!window.FileReader) {
            toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Load failed</strong><br/>File reader is unavailable<br/>" + sessionStorage.getItem("username") + "</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
            $("#opendocs").modal("hide");
        } else {
            let textinpt = $("#upldfile").get(0);
            let readobjc = new FileReader();
            let textfile = textinpt.files[0];
            readobjc.readAsText(textfile);
            $(readobjc).on("load", function (e) {
                let actifile = e.target.result;
                if (actifile && actifile.length) {
                    try {
                        let docuvain = JSON.parse(actifile);
                        document.getElementById("opdocstt").innerText = "Contents parsed";
                        document.getElementById("opdocsid").innerHTML =
                            "<div class='ui list textbase'>" +
                            "<div class='item'><div class='header monotext'>Workspace ID</div>" + docuvain["sessiden"] + "</div>" +
                            "<div class='item'><div class='header monotext'>Saved by</div>" + docuvain["username"] + "</div>" +
                            "<div class='item'><div class='header monotext'>Last modified</div>" + Date(docuvain["timestmp"]) + "</div>" +
                            "</div>";
                        document.getElementById("opdocsff").innerHTML =
                            "<div class='ui mini button textbase' onclick=\"$('#opendocs').modal('hide');\"><span style='color: green;'>Cancel</span></div>" +
                            "<div class='ui mini button textbase' onclick='parsedoc();'><span style='color: red;'>Continue</span></div>";
                        sessionStorage.setItem("lodcache", JSON.stringify(docuvain));
                    } catch (e) {
                        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Load failed</strong><br/>Unrecognizable format<br/>" + sessionStorage.getItem("username") + "</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
                        $("#opendocs").modal("hide");
                    }
                }
            });
        }
    }
}

function parsedoc() {
    let docuvain = JSON.parse(sessionStorage.getItem("lodcache"));
    sessionStorage.setItem("lodcache", "");
    let curtlist = sessionStorage.getItem("celllist");
    if (curtlist !== "{}") {
        for (indx in JSON.parse(curtlist)) {
            document.getElementById("cardiden-" + indx).remove();
        }
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Overwrite complete</strong><br/>Previous cells were removed<br/>" + sessionStorage.getItem("username") + "</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    }
    let newelist = {};
    for (indx in docuvain["cellcoll"]) {
        newelist[indx] = docuvain["cellcoll"][indx]["metadata"];
        /*
        UNCOMMENT ONCE THE SPECIAL READ-ONLY CELLS PR IS MERGED
        THIS WOULD RESET THE LOCK STATE OF ALL THE CELLS!
        newelist[indx]["lockstat"]["islocked"] = false;
        newelist[indx]["lockstat"]["lockedby"] = null;
        */
        makecell(indx);
        document.getElementById("cellname-" + indx).value = docuvain["cellcoll"][indx]["contents"]["cellname"];
        document.getElementById("textdata-" + indx).value = docuvain["cellcoll"][indx]["contents"]["textdata"];
        autoconv(indx);
    }
    toastr.success("<span class='textbase' style='font-size: 15px;'><strong>Load complete</strong><br/>New cells are not synced<br/>" + sessionStorage.getItem("username") + "</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    sessionStorage.setItem("celllist", JSON.stringify(newelist));
    $("#opendocs").modal("hide");
}

function autoconv(celliden) {
    let textdata = document.getElementById("textdata-" + celliden).value;
    let htmldata = Asciidoctor().convert(textdata);
    document.getElementById("otptdata-" + celliden).innerHTML = htmldata;
}

function chektime(chekqant) {
    if (chekqant < 10)
        return "0" + chekqant;
    else
        return chekqant;
}

function timeqant() {
    let curtdate = new Date();
    let hour = curtdate.getHours(); let mint = curtdate.getMinutes(); let secs = curtdate.getSeconds();
    hour = chektime(hour); mint = chektime(mint); secs = chektime(secs);
    document.getElementById("timehead").innerHTML = hour + ":" + mint + ":" + secs;
    let time = setTimeout(timeqant, 500);
}

function randgene() {
    let randstng = "";
    let lent = 8; let list = "0123456789ABCDEF";
    for (let indx = lent; indx > 0; indx--) {
        randstng += list[Math.floor(Math.random() * list.length)];
    }
    return randstng;
}

function sendnote(celliden) {
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

function recvnote(celliden, contents, noteauth) {
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

function sendttle(celliden) {
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

function recvttle(celliden, contents, ttleauth) {
    let celllist = JSON.parse(sessionStorage.getItem("celllist"));
    if (celliden in celllist) {
        document.getElementById("cellname-" + celliden).value = contents;
        toastr.info("<span class='textbase' style='font-size: 15px;'><strong>Renaming in progress</strong><br/>₹" + celliden + " (" + ttleauth + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    } else {
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Out-of-sync cell title</strong><br/>₹" + celliden + " (" + ttleauth + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    }
    makelogs(celliden, "/ttle", ttleauth);
}

function askusdat() {
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
                sessionStorage.setItem("thmcolor", "#294172");
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

function wkeybild() {
    document.getElementById("sessiden").value = randgene();
    toastr.success("<span class='textbase' style='font-size: 15px;'>A new workspace identity was generated and automatically entered in the form.</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
}

function sendpush() {
    if (webesock.readyState === 3) {
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Connection failed</strong><br/>Cell could not be created<br/>" + sessionStorage.getItem("username") + "</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
        $("#sockfail").modal("setting", "closable", false).modal("show");
    } else {
        let celliden = randgene();
        let celllist = JSON.parse(sessionStorage.getItem("celllist"));
        celllist[celliden] = {
            "cellauth": sessionStorage.getItem("username"),
            "maketime": Date.now(),
            "lockstat": {
                "islocked": false,
                "lockedby": null
            }
        };
        sessionStorage.setItem("celllist", JSON.stringify(celllist));
        makecell(celliden);
        let writings = JSON.stringify({"taskcomm": "/push", "celliden": celliden});
        webesock.send(JSON.stringify({username: sessionStorage.getItem("username"), sessiden: sessionStorage.getItem("sessiden"), textmesg: writings}));
        toastr.success("<span class='textbase' style='font-size: 15px;'><strong>Cell created</strong><br/>Creation was conveyed<br/>₹" + celliden + " (" + sessionStorage.getItem("username") + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
        makelogs(celliden, "/push", sessionStorage.getItem("username"));
    }
}

function recvpush(celliden, username) {
    let celllist = JSON.parse(sessionStorage.getItem("celllist"));
    celllist[celliden] = {
        "cellauth": username,
        "maketime": Date.now(),
        "lockstat": {
            "islocked": false,
            "lockedby": null
        }
    };
    sessionStorage.setItem("celllist", JSON.stringify(celllist));
    makecell(celliden);
    toastr.success("<span class='textbase' style='font-size: 15px;'><strong>Cell created</strong><br/>Creation was received<br/>₹" + celliden + "</strong> (" + username + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    makelogs(celliden, "/push", username);
}

function makecell(celliden) {
    $("#domelist").append(
        "<div class='ui card' style='margin-left:0.75%; width: 98.5%; margin-right:0.75%;' id='cardiden-" + celliden + "'>" +
        "<button onclick='toggleCell(\""+celliden+"\")'>toggle</button>"+
        "<div class='content' style='background-color: #f6f8fa;'>" + "<div class='ui tiny labeled input' style='width: 100%;'>" +
        "<div class='ui label monotext' id='celliden' onclick='cellinfo(\"" + celliden + "\")'>" + celliden + "</div>" +
        "<input type='text' class='monotext' id='cellname-" + celliden + "' onkeyup='sendttle(\"" + celliden + "\");' placeholder='Enter the cell name here'>" +
        "<i class='inverted circular eye link icon' onclick='toggleCell(\""+celliden+"\")'></i>" + "</div>" + "</div>" +
        "<br/><br/>" + "<div class='description'>" + "<div class='' style='display: flex;'>" + "<div id='txtar-" + celliden + "' class='default' style='height: 100%;'>" +
        "<div class='ui tiny form field'>" + "<textarea rows='2' id='textdata-" + celliden +
        "' class='monotext' onkeyup='autoconv(\"" + celliden + "\"); sendnote(\"" + celliden + "\");'></textarea>" +
        "</div>" + "</div>" + "<div id='op-" + celliden + "' class='' style='border-width: 2px; border-radius: 2px;'>" +

        "<div class='ui form textbase' style='border: 1px solid #dedede; border-radius: 5px; height: 100%; padding: 1%; background-color: #FFFFFF;' id='otptdata-" + celliden + "'></div>" +
        "</div>" + "</div>" + "</div>" + "</div>" + "</div>");
    
    Split([`#txtar-${celliden}`, `#op-${celliden}`], {
        sizes: [50, 50],
        minSize: [150, 150],
        gutterSize: gutterSize
    });
}

function sendunlk(celliden) {
    if (webesock.readyState === 3) {
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Connection failed</strong><br/>Cell could not be locked<br/>₹" + celliden + " (" + sessionStorage.getItem("username") + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
        $("#sockfail").modal("setting", "closable", false).modal("show");
    } else {
        let celllist = JSON.parse(sessionStorage.getItem("celllist"));
        if (celliden in celllist) {
            if (celllist[celliden].lockstat.islocked === true) {
                if (celllist[celliden].lockstat.lockedby === sessionStorage.getItem("username")) {
                    celllist[celliden].lockstat.islocked = false;
                    celllist[celliden].lockstat.lockedby = null;
                    sessionStorage.setItem("celllist", JSON.stringify(celllist));
                    let writings = JSON.stringify({"taskcomm": "/unlk", "celliden": celliden});
                    webesock.send(JSON.stringify({username: sessionStorage.getItem("username"), sessiden: sessionStorage.getItem("sessiden"), textmesg: writings}));
                    toastr.success("<span class='textbase' style='font-size: 15px;'><strong>Cell unlocked</strong><br/>Unlocking was conveyed<br/>₹" + celliden + " (" + sessionStorage.getItem("username") + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
                    makelogs(celliden, "/lock", sessionStorage.getItem("username"));
                    $("#infomode").modal("hide");
                } else {
                    toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Unlocking failed</strong><br/>Cell was not locked by you<br/>₹" + celliden + " (" + sessionStorage.getItem("username") + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
                    $("#infomode").modal("hide");
                }
            } else {
                toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Unlocking failed</strong><br/>Cell is already unlocked<br/>₹" + celliden + " (" + sessionStorage.getItem("username") + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
                $("#infomode").modal("hide");
            }
        } else {
            toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Unlocking failed</strong><br/>Cell does not exist<br/>₹" + celliden + " (" + sessionStorage.getItem("username") + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
            $("#infomode").modal("hide");
        }
    }
}

function recvunlk(celliden, username) {
    let celllist = JSON.parse(sessionStorage.getItem("celllist"));
    if (celliden in celllist) {
        if (celllist[celliden].lockstat.islocked === true) {
            if (celllist[celliden].lockstat.lockedby === username) {
                celllist[celliden].lockstat.islocked = false;
                celllist[celliden].lockstat.lockedby = null;
                sessionStorage.setItem("celllist", JSON.stringify(celllist));
                document.getElementById("textdata-"+celliden).disabled = false;
                document.getElementById("cellname-"+celliden).disabled = false;
                toastr.success("<span class='textbase' style='font-size: 15px;'><strong>Cell unlocked</strong><br/>Unlocking was received<br/>₹" + celliden + " (" + username + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
                makelogs(celliden, "/unlk", username);
            } else {
                toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Unlocking failed</strong><br/>Cell was not locked by " + username + "<br/>₹" + celliden + " (" + username + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
            }
        } else {
            toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Unlocking failed</strong><br/>Cell is already unlocked<br/>₹" + celliden + " (" + username + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
        }
    } else {
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Unlocking failed</strong><br/>Cell does not exist<br/>₹" + celliden + " (" + username + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    }
}

function sendlock(celliden) {
    if (webesock.readyState === 3) {
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Connection failed</strong><br/>Cell could not be locked<br/>₹" + celliden + " (" + sessionStorage.getItem("username") + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
        $("#sockfail").modal("setting", "closable", false).modal("show");
    } else {
        let celllist = JSON.parse(sessionStorage.getItem("celllist"));
        if (celliden in celllist) {
            if (celllist[celliden].lockstat.islocked === false) {
                celllist[celliden].lockstat.islocked = true;
                celllist[celliden].lockstat.lockedby = sessionStorage.getItem("username");
                sessionStorage.setItem("celllist", JSON.stringify(celllist));
                //console.log("textdata-"+celliden);
                let writings = JSON.stringify({"taskcomm": "/lock", "celliden": celliden});
                webesock.send(JSON.stringify({username: sessionStorage.getItem("username"), sessiden: sessionStorage.getItem("sessiden"), textmesg: writings}));
                toastr.success("<span class='textbase' style='font-size: 15px;'><strong>Cell locked</strong><br/>Locking was conveyed<br/>₹" + celliden + " (" + sessionStorage.getItem("username") + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
                makelogs(celliden, "/lock", sessionStorage.getItem("username"));
                $("#infomode").modal("hide");
            } else {
                toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Locking failed</strong><br/>Cell is already locked<br/>₹" + celliden + " (" + sessionStorage.getItem("username") + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
                $("#infomode").modal("hide");
            }
        } else {
            toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Locking failed</strong><br/>Cell does not exist<br/>₹" + celliden + " (" + sessionStorage.getItem("username") + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
            $("#infomode").modal("hide");
        }
    }
    $("#infomode").modal("hide");
}

function recvlock(celliden, username) {
    let celllist = JSON.parse(sessionStorage.getItem("celllist"));
    console.log("textdata-"+celliden);
    if (celliden in celllist) {
        celllist[celliden].lockstat.islocked = true;
        celllist[celliden].lockstat.lockedby = username;
        sessionStorage.setItem("celllist", JSON.stringify(celllist));
        console.log("textdata-"+celliden);
        document.getElementById("textdata-"+celliden).disabled = true;
        document.getElementById("cellname-"+celliden).disabled = true;
        toastr.success("<span class='textbase' style='font-size: 15px;'><strong>Cell locked</strong><br/>Locking was received<br/>₹" + celliden + " (" + username + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    } else {
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Locking failed</strong><br/>Cell does not exist<br/>₹" + celliden + " (" + username + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    }
    makelogs(celliden, "/lock", username);
}

function toggleCell(celliden) {
    let ta = document.getElementById("txtar-"+celliden);
    let op = document.getElementById("op-"+celliden);
    let gt = ta.nextElementSibling;

    if (ta.classList.value === "default") {
        document.getElementById("txtar-"+celliden).classList.value = "open";
        document.getElementById("txtar-"+celliden).style.width = "100%";
        document.getElementById("op-"+celliden).style.display = "none";
        gt.style.display = "none";
    } else if (ta.classList.value === "open") {
        document.getElementById("txtar-"+celliden).classList.value = "close";
        document.getElementById("txtar-"+celliden).style.display = "none";
        document.getElementById("op-"+celliden).style.display = "block";
        document.getElementById("op-"+celliden).style.width = "100%";
        gt.style.display = "none";
    } else if (ta.classList.value === "close") {
        document.getElementById("txtar-"+celliden).classList.value = "default";
        document.getElementById("txtar-"+celliden).style.width = "calc(50% - "+(gutterSize/2)+"px)";
        document.getElementById("txtar-"+celliden).style.display = "block";
        document.getElementById("op-"+celliden).style.width = "calc(50% - "+(gutterSize/2)+"px)";
        document.getElementById("op-"+celliden).style.display = "block";
        gt.style.display = "block";
    } 
}

function sendpull(celliden) {
    if (webesock.readyState === 3) {
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Connection failed</strong><br/>Cell could not be removed<br/>₹" + celliden + " (" + sessionStorage.getItem("username") + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
        $("#sockfail").modal("setting", "closable", false).modal("show");
    } else {
        let celllist = JSON.parse(sessionStorage.getItem("celllist"));
        if (celliden in celllist) {
            if (celllist[celliden].lockstat.islocked === false) {
                delete celllist[celliden];
                sessionStorage.setItem("celllist", JSON.stringify(celllist));
                document.getElementById("cardiden-"+celliden).remove();
                $("#infomode").modal("hide");
                let writings = JSON.stringify({"taskcomm": "/pull", "celliden": celliden});
                webesock.send(JSON.stringify({username: sessionStorage.getItem("username"), sessiden: sessionStorage.getItem("sessiden"), textmesg: writings}));
                toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Cell removed</strong><br/>Removal was conveyed<br/>₹" + celliden + " (" + sessionStorage.getItem("username") + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
                makelogs(celliden, "/pull", sessionStorage.getItem("username"));
            } else {
                toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Removal failed</strong><br/>Unlock cell before removing<br/>₹" + celliden + " (" + sessionStorage.getItem("username") + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
                $("#infomode").modal("hide");
            }
        } else {
            toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Removal failed</strong><br/>Cell does not exist<br/>₹" + celliden + " (" + sessionStorage.getItem("username") + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
            $("#infomode").modal("hide");
        }
    }
}

function recvpull(celliden, username) {
    let celllist = JSON.parse(sessionStorage.getItem("celllist"));
    if (celliden in celllist) {
        delete celllist[celliden];
        sessionStorage.setItem("celllist", JSON.stringify(celllist));
        document.getElementById("cardiden-"+celliden).remove();
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Cell removed</strong><br/>Removal was received<br/>₹" + celliden + " (" + username + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
        makelogs(celliden, "/pull", username);
    } else {
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Removal failed</strong><br/>Cell does not exist<br/>₹" + celliden + " (" + username + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    }
}

function cellinfo(celliden) {
    let celljson = JSON.parse(sessionStorage.getItem("celllist"));
    document.getElementById("modeiden").innerText = celliden;
    document.getElementById("modeauth").innerText = celljson[celliden]["cellauth"];
    document.getElementById("modetime").innerText = celljson[celliden]["maketime"];
    document.getElementById("modework").innerText = sessionStorage.getItem("sessiden");
    document.getElementById("islocked").innerText = celljson[celliden].lockstat.islocked;
    if (celljson[celliden].lockstat.lockedby === null) {
        document.getElementById("lockedby").innerText = "None";
    } else {
        document.getElementById("lockedby").innerText = celljson[celliden].lockstat.lockedby;
    }
    if (celljson[celliden].lockstat.islocked === false) {
        document.getElementById("lockbutn").innerHTML = "<span style='color: orange;'><i class='ui lock icon'></i>Lock</span>";
        document.getElementById("lockbutn").setAttribute("onclick", "sendlock('" + celliden + "')");
    } else {
        document.getElementById("lockbutn").innerHTML = "<span style='color: green;'><i class='ui lock open icon'></i>Unlock</span>";
        document.getElementById("lockbutn").setAttribute("onclick", "sendunlk('" + celliden + "')");
    }
    document.getElementById("rmovbutn").setAttribute("onclick", "sendpull('" + celliden + "')");
    $("#infomode").modal("show");
}

function marktime() {
    let curtdate = new Date();
    let hour = curtdate.getHours(); let mint = curtdate.getMinutes(); let secs = curtdate.getSeconds();
    return chektime(hour) + ":" + chektime(mint) + ":" + chektime(secs);
}

function makelogs(celliden, activity, username) {
    let actilist = JSON.parse(sessionStorage.getItem("actilogs"));
    let actiobjc = "";
    if (username === sessionStorage.getItem("username"))    {actiobjc += "You";}
    else                                                         {actiobjc += username;}
    if (activity === "/push")                                    {actiobjc += " created a cell";}
    else if (activity === "/pull")                               {actiobjc += " removed a cell";}
    else if (activity === "/note")                               {actiobjc += " wrote to a cell";}
    else if (activity === "/ttle")                               {actiobjc += " renamed a cell";}
    else if (activity === "/lock")                               {actiobjc += " locked a cell";}
    actilist[actilist.length] = {"timestmp": marktime(), "actiobjc": actiobjc, "celliden": celliden};
    sessionStorage.setItem("actilogs", JSON.stringify(actilist));
}

function viewlogs() {
    $("#actiform").remove();
    let actilist = JSON.parse(sessionStorage.getItem("actilogs"));
    $("#actijuxt").append("<table id='actiform' class='ui very compact table'>" + "<tbody id='actitabl'></tbody>" + "</table>");
    for (let indx = 0; indx < actilist.length; indx++) {
        $("#actitabl").append("<tr class='textbase'><td style='font-size: 15px;'>" + actilist[indx]["timestmp"] + "</td><td style='font-size: 15px;'>" + actilist[indx]["actiobjc"] + "<br/><strong class='monotext'>₹" + actilist[indx]["celliden"] + "</strong></td></tr>");
    }
    $("#actilogs").modal("setting", "closable", false).modal("show");
}

function rmovhist() {
    if (sessionStorage.getItem("actilogs") === "[]") {
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Activity history is empty</strong></span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    } else {
        sessionStorage.setItem("actilogs", "[]");
        toastr.success("<span class='textbase' style='font-size: 15px;'><strong>Activity history is cleared</strong></span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    }
}
