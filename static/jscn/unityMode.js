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
    //makelogs(celliden, "/note", noteauth);
}

function sendttle() {
    if (webesock.readyState === 3) {
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Connection failed</strong><br/>Title could not be edited</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
        $("#sockfail").modal("setting", "closable", false).modal("show");
    } else {
        let docsname = document.getElementById("docsname").value;
        let writings = JSON.stringify({"taskcomm": "/ttle", "contents": docsname});
        webesock.send(JSON.stringify({username: sessionStorage.getItem("username"), sessiden: sessionStorage.getItem("sessiden"), textmesg: writings}));
        toastr.info("<span class='textbase' style='font-size: 15px;'><strong>Renaming in progress</strong><br/>(" + sessionStorage.getItem("username") + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
        //makelogs(celliden, "/ttle", sessionStorage.getItem("username"));
    }
}

function recvttle(contents, ttleauth) {
    document.getElementById("docsname").value = contents;
    toastr.info("<span class='textbase' style='font-size: 15px;'><strong>Renaming in progress</strong><br/>(" + ttleauth + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    //makelogs(celliden, "/note", noteauth);
}

function askusdat() {
    $("#givename").modal('setting', 'closable', false).modal("show");
}

function makesess() {
    let username = document.getElementById("username").value;
    let sessiden = document.getElementById("sessiden").value;
    if (username !== "" && sessiden !== "") {
        if (!(/\s/.test(username) || /\s/.test(sessiden))) {
            if (sessiden.match(/^[A-F0-9]{8}$/) && username.match(/^[a-z0-9]+$/i)) {
                sessionStorage.setItem("username", username);
                sessionStorage.setItem("sessiden", sessiden);
                sessionStorage.setItem("actilogs", "[]");
                sessionStorage.setItem("thmcolor", "#294172");
                $('#givename').modal('hide');
                document.getElementById("headroom").innerText = sessiden;
                document.getElementById("headuser").innerText = username;
                toastr.success("<span class='textbase' style='font-size: 15px;'><strong>Welcome to Syngrafias</strong><br/>Share this workspace identity now</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
            } else {
                toastr.error("<span class='textbase'>Please rectify your input in either username or workspace key fields before continuing.</span>","",{"positionClass": "toast-bottom-right"});
            }
        } else {
            toastr.error("<span class='textbase'>Please rectify your input in either username or workspace key fields before continuing.</span>","",{"positionClass": "toast-bottom-right"});
        }
    } else {
        toastr.error("<span class='textbase'>Please rectify your input in either username or workspace key fields before continuing.</span>","",{"positionClass": "toast-bottom-right"});
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
    toastr.success("<span class='textbase'>Workspace ID is copied.</span>", "", {"positionClass": "toast-bottom-right"})
}

function onloadexecutables() {
    askusdat();
    timeqant();
    randgene();
    document.getElementById("textdata").value = "";
    document.getElementById("docsname").value = "";
    sessionStorage.clear();
}

function saveadoc() {
    let dateobjc = new Date();
    let epochstr = dateobjc.getTime();
    document.getElementById("savename").value = sessionStorage.getItem("username") + "_" + sessionStorage.getItem("sessiden") + "_"  + epochstr;
    $("#saveadoc").modal("show");
    console.log("LEL");
}

function makesave() {
    let filename = document.getElementById("savename").value.trim();
    if (docsname !== "") {
        let dateobjc = new Date();
        let epochstr = dateobjc.getTime();
        let savedict = {
            "username": sessionStorage.getItem("username"),
            "sessiden": sessionStorage.getItem("sessiden"),
            "timestmp": epochstr,
            "adocasst": {
                "docsname": document.getElementById("docsname").value,
                "textdata": document.getElementById("textdata").value
            }
        };
        let printstr = JSON.stringify(savedict);
        $.getJSON($SCRIPT_ROOT + "/saveadoc/", {
            filename: filename,
            document: printstr
        }, function (data) {
            console.log(data.result);
            if (data.result === "savefail") {
                toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Save failed</strong><br/>Internal server error<br/>" + sessionStorage.getItem("username") + "</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
                $("#saveadoc").modal("hide");
            } else {
                toastr.success("<span class='textbase' style='font-size: 15px;'><strong>Save success</strong><br/>Make sure popups are enabled<br/>" + sessionStorage.getItem("username") + "</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
                window.open($SCRIPT_ROOT + "/storage/" + data.result, "_blank");
                $("#saveadoc").modal("hide");
            }
        });
    } else {
        toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Save failed</strong><br/>Invalid name entered<br/>" + sessionStorage.getItem("username") + "</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
        $("#saveadoc").modal("hide");
    }
}

function openadoc() {
    document.getElementById("opdocstt").innerText = "Open documents";
    document.getElementById("opdocsid").innerHTML =
        "<p class='textbase' style='line-height: 1.25; text-align: justify; font-size: 15px;'>" +
        "The document that you open must be in the proper ASCIIDoctor document format. " +
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
            if (textinpt.files[0].size <= 1048576) {
                readobjc.readAsText(textfile);
                $(readobjc).on("load", function (e) {
                    let actifile = e.target.result;
                    if (actifile && actifile.length) {
                        try {
                            let docuvain = actifile;
                            document.getElementById("docsname").value = "Document loaded successfully!"
                            //let docuvain = JSON.parse(actifile);
                            document.getElementById("opdocstt").innerText = "Contents parsed";
                            document.getElementById("opdocsid").innerHTML =
                                "<div class='ui list textbase'>" +
                                "<div class='item'><div class='header monotext'>Load state</div>Load complete</div>" +
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
            } else {
                toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Load failed</strong><br/>Files should be under 1MB<br/>" + sessionStorage.getItem("username") + "</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
            }
        }
    }
}

function parsedoc() {
    let docuvain = JSON.parse(sessionStorage.getItem("lodcache"));
    sessionStorage.setItem("lodcache", "");
    document.getElementById("textdata").value = docuvain;
    autoconv();
    toastr.error("<span class='textbase' style='font-size: 15px;'><strong>Overwrite complete</strong><br/>Previous contents were removed<br/>" + sessionStorage.getItem("username") + "</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    toastr.success("<span class='textbase' style='font-size: 15px;'><strong>Load complete</strong><br/>New cells are not synced<br/>" + sessionStorage.getItem("username") + "</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    $("#opendocs").modal("hide");
}
