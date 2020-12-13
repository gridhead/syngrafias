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

let tipslist = [
    {
        "head": "Active synchronization",
        "body": "Stay connected at all the times to actively synchronize all changes made in the document."
    }, {
        "head": "Passive synchronization",
        "body": "Load up a file with all the changes made in your absence to quickly keep up with them."
    }, {
        "head": "Work bound to workspace",
        "body": "All the progress made at your end are bound to your workspace so do not close your window before saving."
    }, {
        "head": "The best of all worlds",
        "body": "Syngrafias plans on uniting the best of HackMD, Google Docs and JupyterLab into one application."
    }, {
        "head": "Free and open-source at its core",
        "body": "You can find the GPL3-licensed source code at https://github.com/t0xic0der/syngrafias/."
    }, {
        "head": "Explore your cells",
        "body": "Click on the unique identifier of a cell to view information about its author and creation time."
    }, {
        "head": "We don't need that here",
        "body": "The cell information window would also give you an option, should you want to remove it."
    }, {
        "head": "You can run but you can't hide",
        "body": "All the activities made in your workspace are actively tracked and listed under the activities."
    }, {
        "head": "Paste via a keypress",
        "body": "Only the updates made via keystrokes are the ones which get logged and synchronized."
    }, {
        "head": "Everyone here? Good!",
        "body": "Begin making changes to a workspace only when everyone intended to have those are online."
    }, {
        "head": "Racing against the time",
        "body": "There is a clock at the top right corner of the screen should deadlines be your thing."
    }, {
        "head": "Start from the same situation",
        "body": "All fellow contributors must open up the same document at their ends if they are sharing a workspace."
    }, {
        "head": "Facing failed deletions?",
        "body": "A cell removal fails at your end because there is not any cell with you of that identity to delete."
    }, {
        "head": "Facing out-of-sync cell content issues?",
        "body": "Contents are out-of-sync when a cell is not available with you but is being edited in your workspace."
    }, {
        "head": "Facing out-of-sync cell title issues?",
        "body": "Titles are out-of-sync when a cell is not available with you but is being renamed in your workspace."
    }, {
        "head": "Getting started?",
        "body": "Just type in a username and generate yourself a workspace identity to share with your collaborators."
    }, {
        "head": "Being invited?",
        "body": "Just type in a username and the workspace identity shared by your fellow collaborator."
    }, {
        "head": "Aaargghh! Not again!",
        "body": "Lock cells and make them read-only for others if you are constantly pestered in your cell."
    }, {
        "head": "Nice name you got there",
        "body": "Syngrafias is Greek for authorship. It does sound cool too with a great meaning."
    }, {
        "head": "For all Markdown fanboys out there",
        "body": "The support for Markdown parsing is coming soon. Stay tuned to be the first to know about it."
    }, {
        "head": "Prefer SPACES over TABS",
        "body": "In Syngrafias, tabs are programmed to move you out of the field you are currently editing."
    }, {
        "head": "Revisit these tips anytime in the wiki",
        "body": "These tips appear in a random order so it can be hard going back, but we have a wiki to your rescue."
    }, {
        "head": "Thank you for using Syngrafias",
        "body": "We appreciate you picking this project over the likes of HackMD, Google Drive and Jupyterlab."
    }, {
        "head": "Whoops, that didn't work!",
        "body": "Please let us know about any issues, bugs or suggestions that you have on our issues page."
    }, {
        "head": "Color monotonicity is boring",
        "body": "We agree to that and hence, Syngrafias provides a collection of nine vibrant themes to choose from."
    }, {
        "head": "",
        "body": ""
    }
]

colrjson = {
    "#7289DA": "Discord Purple",
    "#ED1C24": "AMD Red",
    "#008080": "t0xic0der Teal",
    "#294172": "Fedora Blue",
    "#720000": "Mahindra Red",
    "#1DB954": "Spotify Green",
    "#FF5F00": "Mastercard Orange",
    "#005AAC": "Jio Blue",
    "#EA08AE": "T-Mobile Pink"
}

function randtips()
{
    let tipsobjc = tipslist[Math.floor(Math.random() * 25)];
    document.getElementById("tipshead").innerText = tipsobjc["head"];
    document.getElementById("tipscont").innerText = tipsobjc["body"];
}

function chngcolr(colriden)
{
    $(".cardinal").css("background-color", colriden);
    let celllist = JSON.parse(sessionStorage.getItem("celllist"));
    // The following line changes the color of the newly added cells to the color selected by the user
    sessionStorage.setItem("thmcolor", colriden);
    // The following quickly changes the color of the existing cells to the color selected by the user
    for (indx in celllist) {
        $("#colrcell-" + indx).css("background-color", colriden);
    }
    toastr.success("<span class='textbase' style='font-size: 15px;'><strong>Theme changed</strong><br/>" + colrjson[colriden] + "</span>","",{"positionClass": "toast-bottom-right", "preventDuplicates": "true"});
    $("#colrmode").modal("hide");
}