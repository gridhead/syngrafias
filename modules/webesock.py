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


USERLIST = {
    "CELLULAR": {},
    "SINGULAR": {}
}

#Sample pattern for USERLIST

'''
USERLIST = {
    "CELLULAR": {
        "DEADCAFE": {
            "t0xic0der": <websocket-connection-object>,
            "t0xic0der": <websocket-connection-object>,
        }
    },
    "SINGULAR": {
        "DEADCAFE": {
            "t0xic0der": <websocket-connection-object>,
            "t0xic0der": <websocket-connection-object>,
        }
    }    
}
'''


class cellular_userjoin():
    def __init__(self, sockobjc):
        self.sockobjc = sockobjc

    async def convey_username_already_exists_in_session(self, data):
        '''
        This function conveys that the username already exists in the workspace and declines connection.
        '''
        print(" > [" + str(time.ctime()) + "] [CELLULAR] " + data["username"] + " could not connect to " + data["sessiden"] + ".")
        uniqfail = {
            "username": data["username"],
            "sessiden": data["sessiden"],
            "textmesg": {
                "taskcomm": "uniqfail"
            }
        }
        await self.sockobjc.send(json.dumps(uniqfail))
        await self.sockobjc.close()


    async def add_username_to_already_created_session(self, data):
        '''
        This function adds user to an already existing session.
        '''
        print(" > [" + str(time.ctime()) + "] [CELLULAR] " + data["username"] + " joined " + data["sessiden"] + ".")
        USERLIST["CELLULAR"][data["sessiden"]][data["username"]] = self.sockobjc
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
            "userlist": list(USERLIST["CELLULAR"][data["sessiden"]].keys()),
            "textmesg": {
                "taskcomm": "wlcmuser"
            }
        }
        for username in USERLIST["CELLULAR"][data["sessiden"]].keys():
            await USERLIST["CELLULAR"][data["sessiden"]][username].send(json.dumps(wlcmuser))
        await self.sockobjc.send(json.dumps(joindone))


    async def create_a_session_and_add_username_to_it(self, data):
        '''
        This function creates a workspace and adds the user to it.
        '''
        print(" > [" + str(time.ctime()) + "] [CELLULAR] " + data["username"] + " joined " + data["sessiden"] + ".")
        USERLIST["CELLULAR"][data["sessiden"]] = {
            data["username"]: self.sockobjc
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
            "userlist": list(USERLIST["CELLULAR"][data["sessiden"]].keys()),
            "textmesg": {
                "taskcomm": "wlcmuser"
            }
        }
        for username in USERLIST["CELLULAR"][data["sessiden"]].keys():
            await USERLIST["CELLULAR"][data["sessiden"]][username].send(json.dumps(wlcmuser))
        await self.sockobjc.send(json.dumps(joindone))

    async def facilitate_username_addition(self, data):
        '''
        This function facilitates username addition in cellular mode by the following way
            - First, it checks if the workspace identity provided exists in the USERLIST.
                - If it does, it checks if the provided username exists in the workspace of not.
                    - If there exists one, the user trying to attempt connection is informed and connection is declined.
                    - If there is not any, the user is allowed into the workspace and everyone is informed.
                - If it does not, it creates a new workspace with the given identity and adds the user to it.
        '''
        if data["sessiden"] in USERLIST["CELLULAR"].keys():
            if data["username"] in USERLIST["CELLULAR"][data["sessiden"]].keys():
                await self.convey_username_already_exists_in_session(data)
            else:
                await self.add_username_to_already_created_session(data)
        else:
            await self.create_a_session_and_add_username_to_it(data)


class singular_userjoin():
    def __init__(self, sockobjc):
        self.sockobjc = sockobjc

    async def convey_username_already_exists_in_session(self, data):
        '''
        This function conveys that the username already exists in the workspace and declines connection.
        '''
        print(" > [" + str(time.ctime()) + "] [SINGULAR] " + data["username"] + " could not connect to " + data["sessiden"] + ".")
        uniqfail = {
            "username": data["username"],
            "sessiden": data["sessiden"],
            "textmesg": {
                "taskcomm": "uniqfail"
            }
        }
        await self.sockobjc.send(json.dumps(uniqfail))
        await self.sockobjc.close()


    async def add_username_to_already_created_session(self, data):
        '''
        This function adds user to an already existing session.
        '''
        print(" > [" + str(time.ctime()) + "] [SINGULAR] " + data["username"] + " joined " + data["sessiden"] + ".")
        USERLIST["SINGULAR"][data["sessiden"]][data["username"]] = self.sockobjc
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
            "userlist": list(USERLIST["SINGULAR"][data["sessiden"]].keys()),
            "textmesg": {
                "taskcomm": "wlcmuser"
            }
        }
        for username in USERLIST["SINGULAR"][data["sessiden"]].keys():
            await USERLIST["SINGULAR"][data["sessiden"]][username].send(json.dumps(wlcmuser))
        await self.sockobjc.send(json.dumps(joindone))


    async def create_a_session_and_add_username_to_it(self, data):
        '''
        This function creates a workspace and adds the user to it.
        '''
        print(" > [" + str(time.ctime()) + "] [SINGULAR] " + data["username"] + " joined " + data["sessiden"] + ".")
        USERLIST["SINGULAR"][data["sessiden"]] = {
            data["username"]: self.sockobjc
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
            "userlist": list(USERLIST["SINGULAR"][data["sessiden"]].keys()),
            "textmesg": {
                "taskcomm": "wlcmuser"
            }
        }
        for username in USERLIST["SINGULAR"][data["sessiden"]].keys():
            await USERLIST["SINGULAR"][data["sessiden"]][username].send(json.dumps(wlcmuser))
        await self.sockobjc.send(json.dumps(joindone))

    async def facilitate_username_addition(self, data):
        '''
        This function facilitates username addition in singular mode by the following way
            - First, it checks if the workspace identity provided exists in the USERLIST.
                - If it does, it checks if the provided username exists in the workspace of not.
                    - If there exists one, the user trying to attempt connection is informed and connection is declined.
                    - If there is not any, the user is allowed into the workspace and everyone is informed.
                - If it does not, it creates a new workspace with the given identity and adds the user to it.
        '''
        if data["sessiden"] in USERLIST["SINGULAR"].keys():
            if data["username"] in USERLIST["SINGULAR"][data["sessiden"]].keys():
                await self.convey_username_already_exists_in_session(data)
            else:
                await self.add_username_to_already_created_session(data)
        else:
            await self.create_a_session_and_add_username_to_it(data)


async def make_informed_removal_from_a_workspace(sockobjc):
    '''
    This function looks up the websocket object throughout the dictionary and informs the workspace about the user's
    leaving - whenever that happens so that other collaborators can get to know about it.
    '''
    usernmlt, sessidlt, sesstylt = 0, 0, 0
    for sesstype in USERLIST.keys():
        for sessiden in USERLIST[sesstype].keys():
            for username in USERLIST[sesstype][sessiden].keys():
                if USERLIST[sesstype][sessiden][username] == sockobjc:
                    USERLIST[sesstype][sessiden].pop(username)
                    print(" > [" + str(time.ctime()) + "] [" + sesstype + "] " + username + " left " + sessiden + ".")
                    usernmlt = username
                    sessidlt = sessiden
                    sesstylt = sesstype
                    break
    if sesstylt != 0 and sessidlt != 0 and usernmlt != 0:
        leftuser = {
            "username": usernmlt,
            "sessiden": sessidlt,
            "userlist": list(USERLIST[sesstylt][sessidlt].keys()),
            "textmesg": {
                "taskcomm": "leftuser"
            }
        }
        for userindx in USERLIST[sesstylt][sessidlt].keys():
            await USERLIST[sesstylt][sessidlt][userindx].send(json.dumps(leftuser))


async def perform_general_workspace_operations(sockobjc, data):
    '''
    This function pushes out general workspace operation request specifically to the workspace - they are intended to
    go to and not to everyone else - which is far more efficient than client-side acceptance/declination.
    '''
    print(" > [" + str(time.ctime()) + "] [" + data["docsmode"] + "] " + data["username"] + " of " + data["sessiden"] + " made actions.")
    if data["docsmode"] == "CELLULAR":
        CELLULAR = USERLIST["CELLULAR"]
        if data["sessiden"] in CELLULAR.keys():
            for username in CELLULAR[data["sessiden"]].keys():
                if username != data["username"]:
                    operdata = {
                        "username": data["username"],
                        "sessiden": data["sessiden"],
                        "textmesg": data["textmesg"]
                    }
                    await CELLULAR[data["sessiden"]][username].send(json.dumps(operdata))
    elif data["docsmode"] == "SINGULAR":
        SINGULAR = USERLIST["SINGULAR"]
        if data["sessiden"] in SINGULAR.keys():
            for username in SINGULAR[data["sessiden"]].keys():
                if username != data["username"]:
                    operdata = {
                        "username": data["username"],
                        "sessiden": data["sessiden"],
                        "textmesg": data["textmesg"]
                    }
                    await SINGULAR[data["sessiden"]][username].send(json.dumps(operdata))


async def syncmate(sockobjc, path):
    '''
    This function asynchronously receives and sends out JSON responses based on requests.
    '''
    try:
        async for message in sockobjc:
            try:
                data = json.loads(message)
                if data["textmesg"] == "/iden":
                    await cellular_userjoin(sockobjc).facilitate_username_addition(data)
                elif data["textmesg"] == "/isin":
                    await singular_userjoin(sockobjc).facilitate_username_addition(data)
                else:
                    await perform_general_workspace_operations(sockobjc, data)
            except json.decoder.JSONDecodeError:
                print(" > [" + str(time.ctime()) + "] Malformed JSON received.")
    finally:
        await make_informed_removal_from_a_workspace(sockobjc)


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
if __name__=='__main__':
    mainfunc(9696,"ipprotv4")