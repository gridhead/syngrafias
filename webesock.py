#!/usr/bin/env python

"""
##########################################################################
*
* -*- coding: utf-8 -*-
*
*   Copyright © 2019-2020 Akashdeep Dhar <t0xic0der@fedoraproject.org>
*
*   This copyrighted material is made available to anyone wishing to use,
*   modify, copy, or redistribute it subject to the terms and conditions
*   of the GNU General Public License v.2, or (at your option) any later
*   version.  This program is distributed in the hope that it will be
*   useful, but WITHOUT ANY WARRANTY expressed or implied, including the
*   implied warranties of MERCHANTABILITY or FITNESS FOR A PARTICULAR
*   PURPOSE.  See the GNU General Public License for more details.  You
*   should have received a copy of the GNU General Public License along
*   with this program; if not, write to the Free Software Foundation,
*   Inc., 51 Franklin Street, Fifth Floor, Boston, MA 02110-1301, USA.
*
##########################################################################
"""

import asyncio
import click
import json
import sys
import time
import websockets


USERS = set()


def mesej_event(username, sessiden, textmesg):
    return json.dumps({"username": username, "sessiden": sessiden, "textmesg": textmesg})


async def notify_mesej(username, sessiden, textmesg):
    if USERS:
        message = mesej_event(username, sessiden, textmesg)
        await asyncio.wait([user.send(message) for user in USERS])


async def register(websocket):
    USERS.add(websocket)
    print(" > [" + str(time.ctime()) + "] [USERJOIN] User just joined the Syngrafias")


async def unregister(websocket):
    USERS.remove(websocket)
    dir(websocket)
    print(" > [" + str(time.ctime()) + "] [USERLEFT] User just left the Syngrafias")


async def syncmate(websocket, path):
    await register(websocket)
    try:
        async for message in websocket:
            data = json.loads(message)
            print(data)
            print(" > [" + str(time.ctime()) + "] [" + str(data["sessiden"]) + "] User '" + str(data["username"]) + "' made actions.")
            await notify_mesej(data["username"], data["sessiden"], data["textmesg"])
    finally:
        await unregister(websocket)


def servenow(netpdata="127.0.0.1", syncport="9696"):
    try:
        print(" > [" + str(time.ctime()) + "] [HOLAUSER] Syngrafias was started up on 'ws://" + str(netpdata) + ":" + str(syncport) + "/'")
        start_server = websockets.serve(syncmate, netpdata, int(syncport))
        asyncio.get_event_loop().run_until_complete(start_server)
        asyncio.get_event_loop().run_forever()
    except KeyboardInterrupt:
        print("\n" + " > [" + str(time.ctime()) + "] [SEEUSOON] Syngrafias was shut down")
        sys.exit()


@click.command()
@click.option("-c", "--syncport", "syncport", help="Set the port value for WebSockets [0-65536]", required=True)
@click.option("-6", "--ipprotv6", "netprotc", flag_value="ipprotv6", help="Start the server on an IPv6 address", required=True)
@click.option("-4", "--ipprotv4", "netprotc", flag_value="ipprotv4", help="Start the server on an IPv4 address", required=True)
@click.version_option(version="01082020", prog_name="Syngrafias WebSockets by t0xic0der")
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


if __name__ == "__main__":
    mainfunc()