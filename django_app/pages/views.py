from django.http import JsonResponse
from django.conf import settings
from django.contrib.auth.decorators import login_required
from django.shortcuts import render, redirect
from django.views.decorators.http import require_http_methods
from textblob import TextBlob
import requests

# ⚠️ Make sure this matches your Express port (5000 is typical)
API = getattr(settings, "EXPRESS_API_BASE", "http://localhost:3000")

def home(request):
    return render(request, "pages/home.html")

def about(request):
    return render(request, "pages/about.html")

def contact(request):
    return render(request, "pages/contact.html")

def sentiment(request):
    text = request.GET.get("text", "")
    polarity = TextBlob(text).sentiment.polarity
    label = "positive" if polarity > 0.1 else "negative" if polarity < -0.1 else "neutral"
    return JsonResponse({"label": label, "score": round(polarity, 4)})

# --- helpers ---
def _as_str_id(_id):
    """Handle Mongo _id shapes (string or {'$oid': '...'})."""
    if isinstance(_id, dict) and "$oid" in _id:
        return _id["$oid"]
    return str(_id) if _id is not None else ""

# --- dynamic dealer pages ---
def dealers_home(request):
    state = request.GET.get("state")
    url = f"{API}/api/dealerships" if not state else f"{API}/api/dealerships/state/{state}"
    dealers = requests.get(url, timeout=10).json() or []
    # normalize _id → id for template safety
    for d in dealers:
        d["id"] = _as_str_id(d.get("_id"))
    return render(request, "pages/dealers_home.html", {"dealers": dealers, "state": state})

def dealer_detail(request, dealer_id):
    dealer = requests.get(f"{API}/api/dealerships/{dealer_id}", timeout=10).json() or {}
    dealer["id"] = _as_str_id(dealer.get("_id"))
    reviews = requests.get(f"{API}/api/dealer_reviews/{dealer_id}", timeout=10).json() or []
    return render(request, "pages/dealer_detail.html", {"dealer": dealer, "reviews": reviews})

@login_required
@require_http_methods(["GET", "POST"])
def post_review(request, dealer_id):
    if request.method == "GET":
        return render(request, "pages/post_review.html", {"dealer_id": dealer_id})
    # POST → forward to Express API
    payload = {
        "dealerId": dealer_id,  # must match the dealer's ObjectId string
        "reviewer": request.user.username,
        "rating": int(request.POST.get("rating", 5)),
        "reviewText": request.POST.get("reviewText", ""),
        "purchase": request.POST.get("purchase") == "on",
        "purchaseDate": request.POST.get("purchaseDate", ""),
    }
    requests.post(f"{API}/api/dealer_reviews", json=payload, timeout=10)
    return redirect("dealer_detail", dealer_id=dealer_id)
