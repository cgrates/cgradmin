import json
from django.http import HttpResponse
from django.views.decorators.http import require_POST
from editor.json_client import CGRConnector
from base64 import b64encode
from django.shortcuts import redirect

connector = CGRConnector()

@require_POST
def call(request, method):
   param = json.loads(request.body.decode('utf-8')) if request.body else ''
   response = connector.call(method, param)
   return HttpResponse(json.dumps(response), content_type='application/json')
   
@require_POST
def imports(request):
   if 'file' not in request.FILES or 'tpid' not in request.POST or not request.POST['tpid']:
      return redirect('/static/app/index.html#/import/ERROR: invalid data')
   param = {'TPid': request.POST['tpid']}
   param['File'] = b64encode(request.FILES['file'].read()).decode('utf-8')
   response = connector.call('ApierV1.ImportTPZipFile', param)
   return redirect('/static/app/index.html#/import')
    
