#!/usr/bin/env python

import asyncio, json, websockets, sys, click, time

USERS = set()


def mesej_event(username, roomiden, textmesg):
    return json.dumps({"username": username, "roomiden": roomiden, "textmesg": textmesg})


async def notify_mesej(username, roomiden, textmesg):
    if USERS:
        message = mesej_event(username, roomiden, textmesg)
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
            print(" > [" + str(time.ctime()) + "] [" + str(data["roomiden"]) + "] User '" + str(data["username"]) + "' made actions.")
            await notify_mesej(data["username"], data["roomiden"], data["textmesg"])
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
@click.version_option(version="27072020", prog_name="Syngrafias by t0xic0der")
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