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

import asyncio
import json
import sys
import time
import websockets


USERLIST = {}

#Sample pattern for USERLIST

'''
USERLIST = {
    "DEADCAFE": {
        "t0xic0der": <websocket-connection-object>,
        "t0xic0der": <websocket-connection-object>,
    }
}
'''

async def syncmate(websocket, path):
    try:
        async for message in websocket:
            data = json.loads(message)
            if data["textmesg"] == "/iden":
                if data["sessiden"] in USERLIST.keys():
                    if data["username"] in USERLIST[data["sessiden"]].keys():
                        print(" > [" + str(time.ctime()) + "] " + data["username"] + " could not connect to " + data["sessiden"] + ".")
                        uniqfail = {
                            "username": data["username"],
                            "sessiden": data["sessiden"],
                            "textmesg": {
                                "taskcomm": "uniqfail"
                            }
                        }
                        await websocket.send(json.dumps(uniqfail))
                        await websocket.close()
                    else:
                        print(" > [" + str(time.ctime()) + "] " + data["username"] + " joined " + data["sessiden"] + ".")
                        USERLIST[data["sessiden"]][data["username"]] = websocket
                        joindone = {
                            "username": data["username"],
                            "sessiden": data["sessiden"],
                            "textmesg": {
                                "taskcomm": "joindone"
                            }
                        }
                        wlcmuser = {
                            "username": data["username"],
                            "sessiden": data["sessiden"],
                            "userlist": list(USERLIST[data["sessiden"]].keys()),
                            "textmesg": {
                                "taskcomm": "wlcmuser"
                            }
                        }
                        for username in USERLIST[data["sessiden"]].keys():
                            await USERLIST[data["sessiden"]][username].send(json.dumps(wlcmuser))
                        await websocket.send(json.dumps(joindone))
                else:
                    print(" > [" + str(time.ctime()) + "] " + data["username"] + " joined " + data["sessiden"] + ".")
                    USERLIST[data["sessiden"]] = {
                        data["username"]: websocket
                    }
                    joindone = {
                        "username": data["username"],
                        "sessiden": data["sessiden"],
                        "textmesg": {
                            "taskcomm": "joindone"
                        }
                    }
                    wlcmuser = {
                        "username": data["username"],
                        "sessiden": data["sessiden"],
                        "userlist": list(USERLIST[data["sessiden"]].keys()),
                        "textmesg": {
                            "taskcomm": "wlcmuser"
                        }
                    }
                    for username in USERLIST[data["sessiden"]].keys():
                        await USERLIST[data["sessiden"]][username].send(json.dumps(wlcmuser))
                    await websocket.send(json.dumps(joindone))
            else:
                if data["sessiden"] in USERLIST.keys():
                    for username in USERLIST[data["sessiden"]].keys():
                        if username != data["username"]:
                            operdata = {
                                "username": data["username"],
                                "sessiden": data["sessiden"],
                                "textmesg": data["textmesg"]
                            }
                            print(" > [" + str(time.ctime()) + "] " + data["username"] + " of " + data["sessiden"] + " made actions.")
                            await USERLIST[data["sessiden"]][username].send(json.dumps(operdata))
    finally:
        usernmlt, sessidlt = 0, 0
        for sessiden in USERLIST.keys():
            for username in USERLIST[sessiden].keys():
                if USERLIST[sessiden][username] == websocket:
                    USERLIST[sessiden].pop(username)
                    print(" > [" + str(time.ctime()) + "] " + username + " left " + sessiden + ".")
                    usernmlt = username
                    sessidlt = sessiden
                    break
        if usernmlt != 0 and sessidlt != 0:
            leftuser = {
                "username": username,
                "sessiden": sessiden,
                "userlist": list(USERLIST[sessiden].keys()),
                "textmesg": {
                    "taskcomm": "leftuser"
                }
            }
            for userindx in USERLIST[sessidlt].keys():
                await USERLIST[sessidlt][userindx].send(json.dumps(leftuser))


def servenow(netpdata="127.0.0.1", syncport="9696"):
    try:
        print(" > [" + str(time.ctime()) + "] [HOLAUSER] Syngrafias was started up on 'ws://" + str(netpdata) + ":" + str(syncport) + "/'")
        start_server = websockets.serve(syncmate, netpdata, int(syncport))
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()
    except KeyboardInterrupt:
        print("\n" + " > [" + str(time.ctime()) + "] [SEEUSOON] Syngrafias was shut down")
        sys.exit()


def mainfunc(syncport, netprotc):
    print(" > [" + str(time.ctime()) + "] [HOLAUSER] Starting Syngrafias...")
    netpdata = ""
    if netprotc == "ipprotv6":
        print(" > [" + str(time.ctime()) + "] [HOLAUSER] IP version : 6")
        netpdata = "::"
    elif netprotc == "ipprotv4":
        print(" > [" + str(time.ctime()) + "] [HOLAUSER] IP version : 4")
        netpdata = "0.0.0.0"
    servenow(netpdata, syncport)
