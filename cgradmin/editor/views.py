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
      response = json.dumps('ERROR: Invalid data')
      return redirect('/static/app/index.html#/import/%s' % quote_plus(b64encode(response)))
   param = {'TPid': request.POST['tpid']}
   param['File'] = b64encode(request.FILES['file'].read()).decode('utf-8')
   response = connector.call('ApierV1.ImportTPZipFile', param)
   response = json.dumps(response)
   return redirect('/static/app/index.html#/import/%s' % quote_plus(b64encode(response)))
    
@require_POST
def exports(request):
   myfile = StringIO.StringIO()
   param = request.POST.dict()
   if param['FieldSeparator'] == '':
      param['FieldSeparator'] = ','
   param['FieldSeparator'] = ord(param['FieldSeparator'])
   param['CgrIds'] = param['CgrIds'].split(",")
   param['MediationRunIds'] = param['MediationRunIds'].split(",")
   param['TORs'] = param['TORs'].split(",")
   param['CdrHosts'] = param['CdrHosts'].split(",")
   param['CdrSources'] = param['CdrSources'].split(",")
   param['ReqTypes'] = param['ReqTypes'].split(",")
   param['Directions'] = param['Directions'].split(",")
   param['Tenants'] = param['Tenants'].split(",")
   param['Categories'] = param['Categories'].split(",")
   param['Accounts'] = param['Accounts'].split(",")
   param['Subjects'] = param['Subjects'].split(",")
   param['DestinationPrefixes'] = param['DestinationPrefixes'].split(",")
   param['RatedAccounts'] = param['RatedAccounts'].split(",")
   param['RatedSubjects'] = param['RatedSubjects'].split(",")
   param['DataUsageMultiplyFactor'] = float(param['DataUsageMultiplyFactor'])
   param['CostMultiplyFactor'] = float(param['CostMultiplyFactor'])
   param['CostShiftDigits'] = int(param['CostShiftDigits'])
   param['RoundDecimals'] = int(param['RoundDecimals'])
   param['MaskLength'] = int(param['MaskLength'])
   param['OrderIdStart'] = int(param['OrderIdStart'])
   param['OrderIdEnd'] = int(param['OrderIdEnd'])
   if 'SkipErrors' not in param:
      param['SkipErrors'] = False
   else:
      param['SkipErrors'] = bool(param['SkipErrors'])
   if 'SkipRated' not in param:
      param['SkipRated'] = False
   else:
      param['SkipRated'] = bool(param['SkipRated'])
   if 'SuppressCgrIds' not in param:
      param['SuppressCgrIds'] = False
   else:
      param['SuppressCgrIds'] = bool(param['SuppressCgrIds'])
   for key, value in param.items():
      print(key,value)
   response = connector.call('ApierV1.ExportCdrsToZipString', param)
   if response.startswith("ERROR"):
      response = json.dumps(response)
      return redirect('/static/app/index.html#/export/%s' % quote_plus(b64encode(response)))
   myfile.write(b64decode(response))
   print("ZIP: ", myfile.getvalue())
   response = HttpResponse(myfile.getvalue(), content_type='application/x-zip-compressed')
   response['Content-Disposition'] = 'attachment; filename=cdrs.zip'
   return response
