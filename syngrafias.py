#!venv/bin/python3

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

from multiprocessing import Process

import click

from modules import servdocs, webesock


@click.command()
@click.option("-s", "--servport", "servport", help="Set the port value for Syngrafias [0-65536]", required=True)
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
