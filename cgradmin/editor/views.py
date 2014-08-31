import json
from base64 import b64encode, b64decode
from urllib import quote_plus
import cStringIO as StringIO
from editor.json_client import CGRConnector
from django.http import HttpResponse
from django.views.decorators.http import require_POST
from django.shortcuts import redirect
from django.core.servers.basehttp import FileWrapper

connector = CGRConnector()

@require_POST
def call(request, method):
   param = json.loads(request.body) if request.body else ''
   response = connector.call(method, param)
   return HttpResponse(json.dumps(response), content_type='application/json')
   
@require_POST
def imports(request):
   if 'file' not in request.FILES or 'tpid' not in request.POST or not request.POST['tpid']:
      return redirect('/static/app/index.html#/import/%s' % quote_plus(b64encode('Invalid data')))
   param = {'TPid': request.POST['tpid']}
   param['File'] = b64encode(request.FILES['file'].read()).decode('utf-8')
   response = connector.call('ApierV1.ImportTPZipFile', param)
   return redirect('/static/app/index.html#/import/%s' % quote_plus(b64encode(response)))
    
@require_POST
def exports(request):
   myfile = StringIO.StringIO()
   response = connector.call('ApierV1.ExportCdrsToZip', param)
   myfile.write(b64decode(response["content"]))
   response = HttpResponse(myfile.getvalue(), content_type='application/x-zip-compressed')
   response['Content-Disposition'] = 'attachment; filename=cdrs.zip'
   return response
