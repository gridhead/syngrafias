/***********************************************************************************
Syngrafias JS
***********************************************************************************/

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
    for (let indx = lent; indx > 0; indx--)
    {
        randstng += list[Math.floor(Math.random() * list.length)];
    }
    return randstng;
}

function sendtext(celliden)
{
    let contents = document.getElementById("textdata-"+celliden).value;
    let writings = JSON.stringify({"taskcomm": "/note", "celliden": celliden, "contents": contents});
    webesock.send(JSON.stringify({username: sessionStorage.getItem("username"), sessiden: sessionStorage.getItem("sessiden"), textmesg: writings}));
}

function askusdat()
{
    $(".ui.basic.modal").modal('setting', 'closable', false).modal("show");
}

function makesess() {
    let username = document.getElementById("username").value;
    let sessiden = document.getElementById("sessiden").value;
    if (username !== "" && sessiden !== "")
    {
        if (!(/\s/.test(username) || /\s/.test(sessiden)))
        {
            if (sessiden.match(/^[A-F0-9]{8}$/) && username.match(/^[a-z0-9]+$/i))
            {
                sessionStorage.setItem("username", username);
                sessionStorage.setItem("sessiden", sessiden);
                sessionStorage.setItem("celllist", "{}");
                $('#givename').modal('hide');
                document.getElementById("headuser").innerText = username;
                document.getElementById("headroom").innerText = sessiden;
            }
            else
            {
                toastr.error("<span class='textbase' style='font-size: 14px;'>Please rectify your input in either username or workspace identity fields before continuing.</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
            }
        }
        else
        {
            toastr.error("<span class='textbase' style='font-size: 14px;'>Please rectify your input in either username or workspace identity fields before continuing.</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
        }
    }
    else
    {
        toastr.error("<span class='textbase' style='font-size: 14px;'>Please rectify your input in either username or workspace identity fields before continuing.</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    }
}

function wkeybild()
{
    document.getElementById('sessiden').value = randgene();
    toastr.success("<span class='textbase' style='font-size: 14px;'>A new workspace identity was generated and automatically entered in the form.</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
}

function sendcell()
{
    let celliden = randgene();
    let celllist = JSON.parse(sessionStorage.getItem("celllist"));
    celllist[celliden] = {"cellauth": sessionStorage.getItem("username"), "maketime": Date.now()};
    sessionStorage.setItem("celllist", JSON.stringify(celllist));
    makecell(celliden);
    let writings = JSON.stringify({"taskcomm": "/make", "celliden": celliden});
    webesock.send(JSON.stringify({username: sessionStorage.getItem("username"), sessiden: sessionStorage.getItem("sessiden"), textmesg: writings}));
    toastr.success("<span class='textbase' style='font-size: 14px;'>Created <strong>" + celliden + "</strong> (" + sessionStorage.getItem("username") + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
}

function recvcell(celliden, username)
{
    let celllist = JSON.parse(sessionStorage.getItem("celllist"));
    celllist[celliden] = {"cellauth": username, "maketime": Date.now()};
    sessionStorage.setItem("celllist", JSON.stringify(celllist));
    makecell(celliden);
    toastr.success("<span class='textbase' style='font-size: 14px;'>Created <strong>" + celliden + "</strong> (" + username + ")</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
}

function makecell(celliden)
{
    $("body").append(
        "<div class='ui card' style='margin-left:0.75%; width: 98.5%; margin-right:0.75%;'>" +
        "<div class='content'>" +
        "<div class='ui tiny labeled input' style='width: 100%;'>" +
        "<div class='ui label monotext' id='celliden'>" + celliden + "</div>" +
        "<input type='text' class='monotext' placeholder='Enter the cell name here'>" +
        "</div>" +
        "<br/><br/>" +
        "<div class='description'>" +
        "<div class='ui grid'>" +
        "<div class='eight wide column'>" +
        "<div class='ui tiny form field'>" +
        "<textarea rows='2' id='textdata-" + celliden + "' class='monotext' onkeyup='autoconv(\"" + celliden + "\"); sendtext(\"" + celliden + "\");'></textarea>" +
        "</div>" +
        "</div>" +
        "<div class='eight wide column' style='border-width: 2px; border-radius: 2px;'>" +
        "<div class='ui form textbase' style='border: 1px solid #dedede; border-radius: 5px; height: 100%; padding: 1%;' id='otptdata-" + celliden + "'></div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>" +
        "</div>");
}