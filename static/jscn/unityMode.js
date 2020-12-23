
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
function dispatch()
{
    let contents = document.getElementById("textdata").value;
    let writings = "/note" + " " + contents;
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
                $('#givename').modal('hide');
                document.getElementById("headroom").innerText = sessiden;
                document.getElementById("headuser").innerText = username;
            }
            else
            {
                toastr.error("<span class='textbase'>Please rectify your input in either username or workspace key fields before continuing.</span>","",{"positionClass": "toast-bottom-right"});
            }
        }
        else
        {
            toastr.error("<span class='textbase'>Please rectify your input in either username or workspace key fields before continuing.</span>","",{"positionClass": "toast-bottom-right"});
        }
    }
}
webesock.onmessage = function (event)
{
    console.log("HERE_",event.data);
    let data = JSON.parse(event.data);
    if (!(data.username === sessionStorage.getItem("username")))
    {
        if (data.sessiden === sessionStorage.getItem("sessiden"))
        {
            if (data.textmesg.split(" ")[0] === "/note")
            {
                let textmesg = data.textmesg.replace("/note", "").trim();
                document.getElementById("textdata").value = textmesg;
                autoconv();
            }
        }
    }
}

function copyID() {
    const id = document.getElementById("headroom").innerText;
    var tempIn = document.createElement("input");
    tempIn.value = id;
    document.body.appendChild(tempIn);
    tempIn.select();
    document.execCommand("copy");
    document.body.removeChild(tempIn);
    toastr.success("<span class='textbase'>Workspace id is copied.</span>","",{"positionClass": "toast-bottom-right"})
}