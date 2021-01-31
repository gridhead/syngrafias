FROM khallnayak/alpine-python

RUN git clone https://github.com/khallnayak/syngrafias.git

WORKDIR /syngrafias

RUN pip3 install -r requirements.txt

EXPOSE 9696

CMD python3 modules/webesock.py
