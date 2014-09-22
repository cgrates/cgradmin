import json
from base64 import b64encode, b64decode
from urllib import quote_plus
import cStringIO as StringIO
from editor.json_client import CGRConnector
from django.http import HttpResponse, HttpResponseForbidden
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.shortcuts import redirect
from django.core.servers.basehttp import FileWrapper

connector = CGRConnector()

@require_POST
def call(request, method):
   if not request.user.is_authenticated():
      return HttpResponseForbidden(json.dumps({"error":"not_autenticated"}), content_type='application/json')
   param = json.loads(request.body) if request.body else ''
   response = connector.call(method, param)
   return HttpResponse(json.dumps(response), content_type='application/json')

@login_required
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
    
@login_required
@require_POST
def exports(request):
   myfile = StringIO.StringIO()
   param = request.POST.dict()
   if param['FieldSeparator'] == '': param['FieldSeparator'] = ','
   param['FieldSeparator'] = ord(param['FieldSeparator'])
    if param['CgrIds']: param['CgrIds'] = param['CgrIds'].split(",")
    if param['MediationRunIds']: param['MediationRunIds'] = param['MediationRunIds'].split(",") 
    if param['TORs']: param['TORs'] = param['TORs'].split(",")
    if param['CdrHosts']: param['CdrHosts'] = param['CdrHosts'].split(",")
    if param['CdrSources']: param['CdrSources'] = param['CdrSources'].split(",")
    if param['ReqTypes']: param['ReqTypes'] = param['ReqTypes'].split(",")
    if param['Directions']: param['Directions'] = param['Directions'].split(",")
    if param['Tenants']: param['Tenants'] = param['Tenants'].split(",")
    if param['Categories']: param['Categories'] = param['Categories'].split(",")
    if param['Accounts']: param['Accounts'] = param['Accounts'].split(",")
    if param['Subjects']: param['Subjects'] = param['Subjects'].split(",")
    if param['DestinationPrefixes']: param['DestinationPrefixes'] = param['DestinationPrefixes'].split(",")
    if param['RatedAccounts']: param['RatedAccounts'] = param['RatedAccounts'].split(",")
    if param['RatedSubjects']: param['RatedSubjects'] = param['RatedSubjects'].split(",")
    if param['DataUsageMultiplyFactor']: param['DataUsageMultiplyFactor'] = float(param['DataUsageMultiplyFactor'])
    if param['CostMultiplyFactor']: param['CostMultiplyFactor'] = float(param['CostMultiplyFactor'])
    if param['CostShiftDigits']: param['CostShiftDigits'] = int(param['CostShiftDigits'])
    if param['RoundDecimals']: param['RoundDecimals'] = int(param['RoundDecimals'])
    if param['MaskLength']: param['MaskLength'] = int(param['MaskLength'])
    if param['OrderIdStart']: param['OrderIdStart'] = int(param['OrderIdStart'])
    if param['OrderIdEnd']: param['OrderIdEnd'] = int(param['OrderIdEnd'])
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
