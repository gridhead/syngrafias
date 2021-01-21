"""
##########################################################################
*
*   Copyright © 2019-2021 Akashdeep Dhar <t0xic0der@fedoraproject.org>
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

async def convey_username_already_exists_in_session(websocket, data):
    '''
    This function conveys that the username already exists in the workspace and declines connection.
    '''
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


async def add_username_to_already_created_session(websocket, data):
    '''
    This function adds user to an already existing session.
    '''
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


async def create_a_session_and_add_username_to_it(websocket, data):
    '''
    This function creates a workspace and adds the user to it.
    '''
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


async def perform_general_workspace_operations(websocket, data):
    '''
    This function pushes out general workspace operation request specifically to the workspace - they are intended to
    go to and not to everyone else - which is far more efficient than client-side acceptance/declination.
    '''
    print(" > [" + str(time.ctime()) + "] " + data["username"] + " of " + data["sessiden"] + " made actions.")
    if data["sessiden"] in USERLIST.keys():
        for username in USERLIST[data["sessiden"]].keys():
            if username != data["username"]:
                operdata = {
                    "username": data["username"],
                    "sessiden": data["sessiden"],
                    "textmesg": data["textmesg"]
                }
                await USERLIST[data["sessiden"]][username].send(json.dumps(operdata))


async def make_informed_removal_from_a_workspace(websocket):
    '''
    This function looks up the websocket object throughout the dictionary and informs the workspace about the user's
    leaving - whenever that happens so that other collaborators can get to know about it.
    '''
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
            "username": usernmlt,
            "sessiden": sessidlt,
            "userlist": list(USERLIST[sessiden].keys()),
            "textmesg": {
                "taskcomm": "leftuser"
            }
        }
        for userindx in USERLIST[sessidlt].keys():
            await USERLIST[sessidlt][userindx].send(json.dumps(leftuser))


async def facilitate_username_addition_in_cellular_mode(websocket, data):
    '''
    This function facilitates username addition in cellular mode by the following way
        - First, it checks if the workspace identity provided exists in the USERLIST.
            - If it does, it checks if the provided username exists in the workspace of not.
                - If there exists one, the user trying to attempt connection is informed and connection is declined.
                - If there is not any, the user is allowed into the workspace and everyone is informed.
            - If it does not, it creates a new workspace with the given identity and adds the user to it.
    '''
    if data["sessiden"] in USERLIST.keys():
        if data["username"] in USERLIST[data["sessiden"]].keys():
            await convey_username_already_exists_in_session(websocket, data)
        else:
            await add_username_to_already_created_session(websocket, data)
    else:
        await create_a_session_and_add_username_to_it(websocket, data)


async def syncmate(websocket, path):
    '''
    This function asynchronously receives and sends out JSON responses based on requests.
    '''
    try:
        async for message in websocket:
            data = json.loads(message)
            if data["textmesg"] == "/iden":
                await facilitate_username_addition_in_cellular_mode(websocket, data)
            else:
                await perform_general_workspace_operations(websocket, data)
    finally:
        await make_informed_removal_from_a_workspace(websocket)


def servenow(netpdata="127.0.0.1", syncport="9696"):
    '''
    This function starts the WebSocket server.
    '''
    try:
        print(" > [" + str(time.ctime()) + "] [HOLAUSER] Syngrafias was started up on 'ws://" + str(netpdata) + ":" + str(syncport) + "/'")
        start_server = websockets.serve(syncmate, netpdata, int(syncport))
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()
    except KeyboardInterrupt:
        print("\n" + " > [" + str(time.ctime()) + "] [SEEUSOON] Syngrafias was shut down")
        sys.exit()


def mainfunc(syncport, netprotc):
    '''
    This function facilitates the WebSocket server.
    '''
    print(" > [" + str(time.ctime()) + "] [HOLAUSER] Starting Syngrafias...")
    netpdata = ""
    if netprotc == "ipprotv6":
        print(" > [" + str(time.ctime()) + "] [HOLAUSER] IP version : 6")
        netpdata = "::"
    elif netprotc == "ipprotv4":
        print(" > [" + str(time.ctime()) + "] [HOLAUSER] IP version : 4")
        netpdata = "0.0.0.0"
    servenow(netpdata, syncport)
