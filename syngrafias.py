#!venv/bin/python3

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

from multiprocessing import Process

import click

from modules import servdocs, webesock


@click.command()
@click.option("-s", "--servport", "servport", help="Set the port value for Interface [0-65536]", required=True)
@click.option("-c", "--sockport", "sockport", help="Set the port value for WebSockets [0-65536]", required=True)
@click.option("-6", "--ipprotv6", "netprotc", flag_value="ipprotv6", help="Start the server on an IPv6 address", required=True)
@click.option("-4", "--ipprotv4", "netprotc", flag_value="ipprotv4", help="Start the server on an IPv4 address", required=True)
@click.version_option(version="09122020", prog_name="Syngrafias")
def main(servport, sockport, netprotc):
    # Additional Thread
    server_thread = Process(target=webesock.mainfunc, args=(sockport, netprotc))
    server_thread.start()
    # Main Thread
    servdocs.mainfunc(servport, sockport, netprotc)
    server_thread.terminate()


if __name__ == "__main__":
    main()
