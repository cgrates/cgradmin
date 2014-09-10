import json, socket, itertools
from threading import Lock

class JSONClient(object):
    socket = None
    def __init__(self, addr):
        self.socket = socket.create_connection(addr)
        self.id_counter = itertools.count()
    def __del__(self):
        if self.socket is not None:
            self.socket.close()
    def call(self, name, *params):
        request = dict(id=next(self.id_counter),
                    params=list(params),
                    method=name)
        self.socket.sendall(json.dumps(request).encode())
        # This must loop if resp is bigger than 4K
        #response = self.socket.recv(4096)
        buffer = ''
        data = True
        while data:
            data = self.socket.recv(4096)
            buffer += data
            if len(data) < 4096:
                break
        response = json.loads(buffer.decode())
        if response.get('id') != request.get('id'):
            raise Exception("expected id=%s, received id=%s: %s"
                    %(request.get('id'), response.get('id'),
                        response.get('error')))
        if response.get('error') is not None:
            raise Exception(response.get('error'))
        return response.get('result')

class CGRConnector(object):
    def __init__(self):
        self.connect()
        self.lock= Lock()

    def connect(self):
        try:
            print("Connecting to cgr-engine...")
            self.rpc = JSONClient(("localhost", 2012))
        except Exception as e:
            print(e)

    def call(self, method, param):
        try:
            self.lock.acquire()
            return self.rpc.call(method, param)
        except Exception as e:
           print("ERROR: ", type(e), e)
           self.connect()
           try:
              return self.rpc.call(method, param)
           except Exception as e:
              return "ERROR: %s" % e
        finally:
           self.lock.release()
        
