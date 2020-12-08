from multiprocessing import Process

import click

import servdocs
import webesock


@click.command()
@click.option("-s", "--servport", "servport", help="Set the port value for Syngrafias [0-65536]", required=True)
@click.option("-c", "--sockport", "sockport", help="Set the port value for WebSockets [0-65536]", required=True)
@click.option("-6", "--ipprotv6", "netprotc", flag_value="ipprotv6", help="Start the server on an IPv6 address", required=True)
@click.option("-4", "--ipprotv4", "netprotc", flag_value="ipprotv4", help="Start the server on an IPv4 address", required=True)
@click.version_option(version="01082020", prog_name="Syngrafias Collaborator by t0xic0der")

def main(servport, sockport, netprotc):
    # Additional Thread
    server_thread = Process(target=webesock.mainfunc, args=(sockport, netprotc))
    server_thread.start()

    # Main Thread
    servdocs.mainfunc(servport, sockport, netprotc)

    server_thread.terminate()


if __name__ == "__main__":
    main()
