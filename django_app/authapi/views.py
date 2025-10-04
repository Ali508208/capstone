from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth import authenticate, login, logout
from django.contrib.auth.models import User
from django.http import JsonResponse
import json

@csrf_exempt
def api_register(request):
    if request.method != "POST": return JsonResponse({"error":"POST required"}, status=405)
    data = json.loads(request.body or "{}")
    u = User.objects.create_user(username=data["username"], password=data["password"])
    return JsonResponse({"ok": True, "username": u.username})

@csrf_exempt
def api_login(request):
    if request.method != "POST": return JsonResponse({"error":"POST required"}, status=405)
    data = json.loads(request.body or "{}")
    user = authenticate(username=data["username"], password=data["password"])
    if not user: return JsonResponse({"ok": False}, status=401)
    login(request, user)
    return JsonResponse({"ok": True, "username": user.username})

@csrf_exempt
def api_logout(request):
    if request.method != "POST": return JsonResponse({"error":"POST required"}, status=405)
    logout(request)
    return JsonResponse({"ok": True})

def api_me(request):
    if request.user.is_authenticated:
        return JsonResponse({"authenticated": True, "username": request.user.username})
    return JsonResponse({"authenticated": False})
