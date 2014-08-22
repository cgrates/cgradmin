import json, socket, itertools

class JSONClient(object):
   def __init__(self, addr):
      self.socket = socket.create_connection(addr)
      self.id_counter = itertools.count()
      self.BUFFER_SIZE = 4096

   def __del__(self):
      if hasattr(self, 'socket'):
         self.socket.close()
   def call(self, name, *params):
      request = dict(id=next(self.id_counter),
                     params=list(params),
                     method=name)
      self.socket.sendall(json.dumps(request).encode())
      # This must loop if resp is bigger than 4K
      resp = self.socket.recv(self.BUFFER_SIZE)
      response = resp
      while(len(resp) == self.BUFFER_SIZE):
         resp = self.socket.recv(self.BUFFER_SIZE)
         response += resp
      response = json.loads(response.decode())
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

    def connect(self):
        try:
            print("Connecting to cgr-engine...")
            self.rpc = JSONClient(("localhost", 2012))
        except Exception as e:
            print(e)

    def call(self, method, param):
        try:
            return self.rpc.call(method, param)
        except BrokenPipeError as inst:
           self.connect()
           try:
              return self.rpc.call(method, param)
           except Exception as e:
              return "ERROR: %s" % e
        except Exception as e:
           print("ERROR: ", type(e))
           return "ERROR: %s" % e 
        
