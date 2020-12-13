"""
##########################################################################
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
##########################################################################
"""

import json
import time
from flask import Flask, render_template, request, jsonify


storedir = "../storage"
servchat = Flask(__name__, template_folder="../templates", static_folder="../static")


@servchat.route("/")
def asciidoc():
    return render_template("asciidoc.html", sockport=sockp0rt, servport=servp0rt)

@servchat.route("/single/")
def singleDoc():
    return render_template("singleFile.html", sockport=sockp0rt, servport=servp0rt)


@servchat.route("/<themcolr>/")
def themable(themcolr):
    return render_template("themable.html", sockport=sockp0rt, servport=servp0rt, themcolr=themcolr)


@servchat.route("/savedocs/")
def savedocs():
    try:
        username = request.args.get("username", "0", type=str)
        workspec = request.args.get("workspec", "0", type=str)
        docsname = request.args.get("docsname", "0", type=str)
        document = request.args.get("document", "0", type=str)
        curttime = time.time()
        filename = username + "_" + workspec + "_" + str(curttime) + ".swd"
        docsdict = {
            "username": username,
            "workspec": workspec,
            "docsname": docsname,
            "maketime": time.ctime(curttime),
            "document": json.loads(document),
        }
        with open(storedir+"/"+filename, "w") as jsonfile:
            json.dump(docsdict, jsonfile)
        return jsonify(result=filename)
    except:
        return jsonify(result="savefail")


def colabnow(netpdata, servport):
    servchat.config["TEMPLATES_AUTO_RELOAD"] = True
    servchat.run(host=netpdata, port=servport)


def mainfunc(servport, sockport, netprotc):
    global sockp0rt
    sockp0rt = sockport
    global servp0rt
    servp0rt = servport
    print(" * Starting Syngrafias...")
    if servport == sockport:
        print(" * [FAILMESG] The port values for Syngrafias server and WebSocket server cannot be the same!")
    else:
        print(" * Collaborator server started on port " + str(servport) + ".")
        print(" * WebSocket server started on port " + str(sockport) + ".")
        netpdata = ""
        if netprotc == "ipprotv6":
            print(" * IP version  : 6")
            netpdata = "::"
        elif netprotc == "ipprotv4":
            print(" * IP version  : 4")
            netpdata = "0.0.0.0"
        colabnow(netpdata, servport)
