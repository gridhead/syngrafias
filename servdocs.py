from flask import Flask, render_template
import click


servchat = Flask(__name__)


@servchat.route("/")
def editdocs():
    return render_template("editdocs.html", sockport=sockp0rt)


def colabnow(netpdata, servport):
    servchat.run(host=netpdata, port=servport)


@click.command()
@click.option("-s", "--servport", "servport", help="Set the port value for Syngrafias [0-65536]", required=True)
@click.option("-c", "--sockport", "sockport", help="Set the port value for WebSockets [0-65536]", required=True)
@click.option("-6", "--ipprotv6", "netprotc", flag_value="ipprotv6", help="Start the server on an IPv6 address", required=True)
@click.option("-4", "--ipprotv4", "netprotc", flag_value="ipprotv4", help="Start the server on an IPv4 address", required=True)
@click.version_option(version="27072020", prog_name="Syngrafias by t0xic0der")
def mainfunc(servport, sockport, netprotc):
    global sockp0rt
    sockp0rt = sockport
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


if __name__ == "__main__":
    mainfunc()
