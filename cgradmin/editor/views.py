import json
from django.http import HttpResponse
from django.views.decorators.http import require_POST
from editor.json_client import CGRConnector

connector = CGRConnector()

@require_POST
def call(request, method):
   param = json.loads(request.body.decode("utf-8")) if request.body else ""
   response = connector.call(method, param)
   return HttpResponse(json.dumps(response), content_type="application/json")
