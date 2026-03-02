from datetime import timedelta
import csv
import uuid

from django.contrib.auth import login
from django.db.models import Count, F, Q, Sum
from django.db.models.functions import TruncDate
from django.http import HttpResponse
from django.utils import timezone
from rest_framework import filters, permissions, status, viewsets
from rest_framework.authtoken.models import Token
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import ContactRequest, Lesson, SchoolClass, Subject, SubjectCategory, VisitEvent
from .serializers import (
    AdminLoginSerializer,
    ContactRequestSerializer,
    LessonSerializer,
    PublicClassSerializer,
    SchoolClassSerializer,
    SubjectCategorySerializer,
    SubjectSerializer,
    VisitEventSerializer,
)


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return bool(request.user and request.user.is_staff)


class SubjectCategoryViewSet(viewsets.ModelViewSet):
    serializer_class = SubjectCategorySerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "description", "slug"]
    ordering_fields = ["order", "title", "created_at"]
    ordering = ["order", "title"]

    def get_queryset(self):
        queryset = SubjectCategory.objects.annotate(subjects_count=Count("subjects"))
        is_active = self.request.query_params.get("is_active")
        if is_active in {"true", "false"}:
            queryset = queryset.filter(is_active=(is_active == "true"))
        return queryset


class SchoolClassViewSet(viewsets.ModelViewSet):
    queryset = SchoolClass.objects.prefetch_related("subjects__lessons")
    serializer_class = SchoolClassSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["title", "description", "slug", "seo_title", "seo_description"]
    ordering_fields = ["order", "title", "created_at"]
    ordering = ["order", "title"]


class SubjectViewSet(viewsets.ModelViewSet):
    queryset = Subject.objects.select_related("school_class", "category").prefetch_related("lessons")
    serializer_class = SubjectSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "title",
        "description",
        "slug",
        "school_class__title",
        "category__title",
        "seo_title",
        "seo_description",
    ]
    ordering_fields = ["order", "title", "created_at"]
    ordering = ["school_class__order", "order", "title"]

    def get_queryset(self):
        queryset = super().get_queryset()
        class_slug = self.request.query_params.get("class")
        category_slug = self.request.query_params.get("category")
        is_active = self.request.query_params.get("is_active")

        if class_slug:
            queryset = queryset.filter(school_class__slug=class_slug)
        if category_slug:
            queryset = queryset.filter(category__slug=category_slug)
        if is_active in {"true", "false"}:
            queryset = queryset.filter(is_active=(is_active == "true"))
        return queryset


class LessonViewSet(viewsets.ModelViewSet):
    queryset = Lesson.objects.select_related("subject", "subject__school_class", "subject__category")
    serializer_class = LessonSerializer
    permission_classes = [IsAdminOrReadOnly]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = [
        "title",
        "description",
        "short_description",
        "subject__title",
        "subject__school_class__title",
        "subject__category__title",
        "seo_title",
        "seo_description",
    ]
    ordering_fields = ["order", "title", "views_count", "created_at"]
    ordering = ["subject__order", "order", "title"]

    def get_queryset(self):
        queryset = super().get_queryset()
        class_slug = self.request.query_params.get("class")
        subject_slug = self.request.query_params.get("subject")
        category_slug = self.request.query_params.get("category")
        is_published = self.request.query_params.get("is_published")

        if class_slug:
            queryset = queryset.filter(subject__school_class__slug=class_slug)
        if subject_slug:
            queryset = queryset.filter(subject__slug=subject_slug)
        if category_slug:
            queryset = queryset.filter(subject__category__slug=category_slug)
        if is_published in {"true", "false"}:
            queryset = queryset.filter(is_published=(is_published == "true"))
        return queryset

    @action(detail=True, methods=["post"], permission_classes=[permissions.AllowAny])
    def increment_view(self, request, pk=None):
        lesson = self.get_object()
        Lesson.objects.filter(pk=lesson.pk).update(views_count=F("views_count") + 1)
        lesson.refresh_from_db(fields=["views_count"])
        return Response({"views_count": lesson.views_count})


class ContactRequestViewSet(viewsets.ModelViewSet):
    queryset = ContactRequest.objects.all()
    serializer_class = ContactRequestSerializer
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["full_name", "email", "phone", "telegram", "message", "source"]
    ordering_fields = ["created_at", "status"]
    ordering = ["-created_at"]

    def get_permissions(self):
        if self.action == "create":
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def perform_create(self, serializer):
        payload = {"source": serializer.validated_data.get("source") or "website"}
        if not (self.request.user and self.request.user.is_staff):
            payload["status"] = ContactRequest.Status.NEW
        contact = serializer.save(**payload)
        VisitEvent.objects.create(
            user=self.request.user if self.request.user.is_authenticated else None,
            visitor_id=self.request.COOKIES.get("scholar_vid") or self.request.headers.get("X-Visitor-ID") or uuid.uuid4().hex,
            session_key=getattr(self.request.session, "session_key", "") or "",
            path=self.request.path,
            method=self.request.method,
            event_type=VisitEvent.EventType.CONTACT_SUBMIT,
            label=contact.source or "contact",
            referrer=self.request.headers.get("Referer", ""),
            ip_address=_resolve_client_ip(self.request),
            user_agent=self.request.headers.get("User-Agent", "")[:1000],
            metadata={"contact_id": contact.id},
        )


class VisitEventViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = VisitEvent.objects.all()
    serializer_class = VisitEventSerializer
    permission_classes = [permissions.IsAdminUser]
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ["path", "label", "visitor_id", "event_type"]
    ordering_fields = ["created_at", "event_type"]
    ordering = ["-created_at"]


class PublicCatalogAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def get(self, request):
        classes = (
            SchoolClass.objects.filter(is_active=True)
            .prefetch_related("subjects__lessons")
            .order_by("order", "title")
        )
        data = PublicClassSerializer(classes, many=True).data
        return Response({"classes": data})


class TrackVisitEventAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = VisitEventSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        visitor_id = (
            serializer.validated_data.get("visitor_id")
            or request.COOKIES.get("scholar_vid")
            or request.headers.get("X-Visitor-ID")
            or uuid.uuid4().hex
        )
        method = serializer.validated_data.get("method") or request.method
        if not request.session.session_key:
            request.session.create()

        event = serializer.save(
            user=request.user if request.user.is_authenticated else None,
            visitor_id=visitor_id,
            ip_address=_resolve_client_ip(request),
            user_agent=request.headers.get("User-Agent", "")[:1000],
            referrer=serializer.validated_data.get("referrer") or request.headers.get("Referer", ""),
            method=method,
            session_key=request.session.session_key or "",
        )

        response = Response({"id": event.id}, status=status.HTTP_201_CREATED)
        response.set_cookie("scholar_vid", visitor_id, max_age=60 * 60 * 24 * 365, samesite="Lax")
        return response


class AnalyticsDashboardAPIView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        days = _safe_int(request.query_params.get("days"), 30)
        days = min(max(days, 1), 365)

        now = timezone.now()
        window_start = now - timedelta(days=days)

        category_slug = request.query_params.get("category")
        class_slug = request.query_params.get("class")
        subject_slug = request.query_params.get("subject")

        recent_events = VisitEvent.objects.filter(created_at__gte=window_start)
        page_views = recent_events.filter(event_type=VisitEvent.EventType.PAGE_VIEW)

        lessons = Lesson.objects.select_related("subject", "subject__school_class", "subject__category")
        if category_slug:
            lessons = lessons.filter(subject__category__slug=category_slug)
            recent_events = recent_events.filter(Q(label__icontains=category_slug) | Q(path__icontains=category_slug))
            page_views = page_views.filter(path__icontains=category_slug)
        if class_slug:
            lessons = lessons.filter(subject__school_class__slug=class_slug)
            recent_events = recent_events.filter(Q(label__icontains=class_slug) | Q(path__icontains=class_slug))
            page_views = page_views.filter(path__icontains=class_slug)
        if subject_slug:
            lessons = lessons.filter(subject__slug=subject_slug)
            recent_events = recent_events.filter(Q(label__icontains=subject_slug) | Q(path__icontains=subject_slug))
            page_views = page_views.filter(path__icontains=subject_slug)

        unique_visitors = recent_events.values("visitor_id").distinct().count()
        total_page_views = page_views.count()
        total_sessions = recent_events.values("session_key").exclude(session_key="").distinct().count()
        returning_visitors = recent_events.values("visitor_id").annotate(total=Count("id")).filter(total__gt=1).count()

        top_pages = list(page_views.values("path").annotate(visits=Count("id")).order_by("-visits")[:12])

        daily_activity = list(
            page_views.annotate(day=TruncDate("created_at"))
            .values("day")
            .annotate(visits=Count("id"), visitors=Count("visitor_id", distinct=True))
            .order_by("day")
        )

        demand_labels = list(
            recent_events.exclude(label="")
            .values("label")
            .annotate(total=Count("id"))
            .order_by("-total")[:12]
        )

        top_lessons = list(
            lessons.filter(is_published=True)
            .values("title", "slug", "subject__title", "subject__school_class__title", "subject__category__title")
            .annotate(views=Sum("views_count"))
            .order_by("-views")[:10]
        )

        event_breakdown = list(recent_events.values("event_type").annotate(total=Count("id")).order_by("-total"))

        class_popularity = list(
            VisitEvent.objects.filter(created_at__gte=window_start, event_type=VisitEvent.EventType.LESSON_OPEN)
            .values("label")
            .annotate(total=Count("id"))
            .order_by("-total")[:10]
        )

        summary = {
            "range_days": days,
            "unique_visitors": unique_visitors,
            "total_page_views": total_page_views,
            "total_sessions": total_sessions,
            "returning_visitors": returning_visitors,
            "total_classes": SchoolClass.objects.count(),
            "total_subjects": Subject.objects.count(),
            "total_lessons": Lesson.objects.count(),
            "total_categories": SubjectCategory.objects.count(),
            "contact_requests": ContactRequest.objects.count(),
            "avg_session_depth": round(total_page_views / total_sessions, 2) if total_sessions else 0,
        }

        return Response(
            {
                "summary": summary,
                "top_pages": top_pages,
                "daily_activity": daily_activity,
                "event_breakdown": event_breakdown,
                "high_demand_topics": demand_labels,
                "top_lessons": top_lessons,
                "class_popularity": class_popularity,
            }
        )


class AnalyticsExportAPIView(APIView):
    permission_classes = [permissions.IsAdminUser]

    def get(self, request):
        export_type = request.query_params.get("type", "top_pages")
        days = min(max(_safe_int(request.query_params.get("days"), 30), 1), 365)
        since = timezone.now() - timedelta(days=days)

        response = HttpResponse(content_type="text/csv")
        response["Content-Disposition"] = f'attachment; filename="analytics_{export_type}_{days}d.csv"'

        writer = csv.writer(response)
        if export_type == "events":
            writer.writerow(["created_at", "event_type", "path", "label", "visitor_id"])
            for event in VisitEvent.objects.filter(created_at__gte=since).order_by("-created_at")[:10000]:
                writer.writerow([event.created_at.isoformat(), event.event_type, event.path, event.label, event.visitor_id])
        else:
            writer.writerow(["path", "visits"])
            rows = (
                VisitEvent.objects.filter(created_at__gte=since, event_type=VisitEvent.EventType.PAGE_VIEW)
                .values("path")
                .annotate(visits=Count("id"))
                .order_by("-visits")[:1000]
            )
            for row in rows:
                writer.writerow([row["path"], row["visits"]])

        return response


class AdminLoginAPIView(APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        serializer = AdminLoginSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.validated_data["user"]
        token, _ = Token.objects.get_or_create(user=user)
        login(request, user)
        return Response(
            {
                "token": token.key,
                "user": {
                    "id": user.id,
                    "username": user.username,
                    "is_staff": user.is_staff,
                },
            }
        )


def _resolve_client_ip(request):
    x_forwarded_for = request.headers.get("X-Forwarded-For")
    if x_forwarded_for:
        return x_forwarded_for.split(",")[0].strip()
    return request.META.get("REMOTE_ADDR")


def _safe_int(value, default):
    try:
        return int(value)
    except (TypeError, ValueError):
        return default
