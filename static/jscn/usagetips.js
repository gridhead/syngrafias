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
        "body": "We appreciate you picking this project over the likes of HackMD, Google Docs and Jupyterlab."
    }, {
        "head": "Whoops, that didn't work!",
        "body": "Please let us know about any issues, bugs or suggestions that you have on our issues page."
    }, {
        "head": "Color monotonicity is boring",
        "body": "We agree to that and hence, Syngrafias provides a collection of nine vibrant themes to choose from."
    },
]

let helpdocs = [
    {
        "head": "Start editing in the presence of all the collaborators",
        "body": "You would want to begin making changes to the document only after all collaborators have joined. " +
                "Any change made in their absence (That is if you edit the document before all the collaborators join " +
                "or continue editing after they leave), those changes would not be made in their copies."
    }, {
        "head": "Do not panic if you see an out-of-sync warning",
        "body": "You get to see such a warning when a cell is either renamed, edited, locked, unlocked or removed " +
                "which is unavailable at your end. Follow the earlier instruction to avoid this or a grab a saved " +
                "copy with updated changes from their end and load it up to continue synchronizing."
    }, {
        "head": "Begin and end collaborating at the same state",
        "body": "Your fellow collaborators can sync only when they open up a copy of the same document at their end " +
                "too. So be doubly sure to save your work at all the ends before logging out of the workspace because " +
                "they will be opening up the very same file at their ends when editing again together."
    }, {
        "head": "Synchronize only when you are actively connected",
        "body": "Be sure to stay connected at all the times while making changes to keep them synchronized at all " +
                "the ends. You would automatically be thrown an error should you get disconnected from the WebSocket " +
                "server and you would not be able to make any changes until you refresh the page."
    }, {
        "head": "Session information bound with your current tab",
        "body": "Your session details are limited only to your current tab so closing the tab or refreshing the page " +
                "would automatically log you out from your current workspace. Be sure to log back into the same " +
                "workspace and open your copy of the file to continue editing collaboratively."
    }, {
        "head": "Stay updated even if you are connected or not",
        "body": "Even if you are not actively collaborating in the edits, you can keep up with the changes made so " +
                "far by simply staying connected to the workspace while the changes are made (active sync) or by " +
                "taking a copy from one of the fellow contributors after changes are complete (passive sync)."
    }, {
        "head": "Be the only one to edit a cell unintrusively",
        "body": "Open the cell settings and lock the cell to keep your fellow collaborators from editing a specific " +
                "cell. You are still open to make your changes and they would still show up at their ends but they " +
                "would not be able to make any changes or delete the cell as it is now read-only."
    },
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

function randtips() {
    let tipsobjc = tipslist[Math.floor(Math.random() * 25)];
    document.getElementById("tipshead").innerText = tipsobjc["head"];
    document.getElementById("tipscont").innerText = tipsobjc["body"];
}

function chngcolr(colriden) {
    $(".cardinal").css("background-color", colriden);
    toastr.success(
        "<span class='textbase' style='font-size: 15px;'>" + "<strong>Theme changed</strong>" +
        "<br/>" + colrjson[colriden] + "</span>",
        "",
        {
            "positionClass": "toast-bottom-right",
            "preventDuplicates": "true"
        }
    );
    $("#colrmode").modal("hide");
}

function helptopc() {
    $("#tipslist").empty();
    $("#helpdocs").empty();
    for (indx in tipslist) {
        let head = tipslist[indx]["head"];
        let body = tipslist[indx]["body"];
        $("#tipslist").append(
            `
            <div class="ui tiny message textbase" style="margin-left:0.75%; width: 98.5%; margin-right:0.75%;" onclick="randtips();">
                <div class="header textbase">${head}</div>
                <span>${body}</span>
                <br/>
            </div>
            `
        )
    }
    for (indx in helpdocs) {
        let head = helpdocs[indx]["head"];
        let body = helpdocs[indx]["body"];
        $("#helpdocs").append(
            `
            <h4 class="ui header textbase">${head}</h4>
            <p class="textbase" style="line-height: 1.25; text-align: justify; font-size: 15px;">${body}</p>
            `
        )
    }
    $('#helptopc').modal('setting', 'closable', false).modal('show');
}