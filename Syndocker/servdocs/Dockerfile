FROM khallnayak/alpine-python

RUN git clone https://github.com/khallnayak/syngrafias.git

WORKDIR /syngrafias

RUN pip3 install -r requirements.txt

EXPOSE 6969

CMD python3 modules/servdocs.py
