import time
import uuid

from django.utils.deprecation import MiddlewareMixin

from .models import VisitEvent


class VisitEventMiddleware(MiddlewareMixin):
    TRACK_COOKIE = "scholar_vid"

    def process_request(self, request):
        request._visit_start_time = time.perf_counter()

    def process_response(self, request, response):
        path = request.path or ""
        if not self._should_track(path, request.method, response.status_code):
            return response

        visitor_id = request.COOKIES.get(self.TRACK_COOKIE) or request.headers.get("X-Visitor-ID") or uuid.uuid4().hex

        if not request.session.session_key:
            request.session.create()

        duration_ms = None
        start_time = getattr(request, "_visit_start_time", None)
        if start_time is not None:
            duration_ms = int((time.perf_counter() - start_time) * 1000)

        VisitEvent.objects.create(
            user=request.user if request.user.is_authenticated else None,
            visitor_id=visitor_id,
            session_key=request.session.session_key or "",
            path=path,
            method=request.method,
            event_type=VisitEvent.EventType.PAGE_VIEW,
            referrer=request.headers.get("Referer", ""),
            ip_address=self._resolve_client_ip(request),
            user_agent=request.headers.get("User-Agent", "")[:1000],
            duration_ms=duration_ms,
            metadata={"status_code": response.status_code},
        )

        response.set_cookie(self.TRACK_COOKIE, visitor_id, max_age=60 * 60 * 24 * 365, samesite="Lax")
        return response

    @staticmethod
    def _should_track(path, method, status_code):
        if method != "GET":
            return False
        if status_code >= 500:
            return False
        excluded_prefixes = ("/static/", "/media/", "/admin/jsi18n/", "/api/v1/analytics/track/")
        return not path.startswith(excluded_prefixes)

    @staticmethod
    def _resolve_client_ip(request):
        x_forwarded_for = request.headers.get("X-Forwarded-For")
        if x_forwarded_for:
            return x_forwarded_for.split(",")[0].strip()
        return request.META.get("REMOTE_ADDR")