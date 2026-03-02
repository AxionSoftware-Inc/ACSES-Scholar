from django.urls import include, path
from rest_framework.routers import DefaultRouter

from .views import (
    AdminLoginAPIView,
    AnalyticsDashboardAPIView,
    AnalyticsExportAPIView,
    ContactRequestViewSet,
    LessonViewSet,
    PublicCatalogAPIView,
    SchoolClassViewSet,
    SubjectCategoryViewSet,
    SubjectViewSet,
    TrackVisitEventAPIView,
    VisitEventViewSet,
)

router = DefaultRouter()
router.register("categories", SubjectCategoryViewSet, basename="subject-category")
router.register("classes", SchoolClassViewSet, basename="school-class")
router.register("subjects", SubjectViewSet, basename="subject")
router.register("lessons", LessonViewSet, basename="lesson")
router.register("contact-requests", ContactRequestViewSet, basename="contact-request")
router.register("visit-events", VisitEventViewSet, basename="visit-event")

urlpatterns = [
    path("", include(router.urls)),
    path("public/catalog/", PublicCatalogAPIView.as_view(), name="public-catalog"),
    path("analytics/dashboard/", AnalyticsDashboardAPIView.as_view(), name="analytics-dashboard"),
    path("analytics/export/", AnalyticsExportAPIView.as_view(), name="analytics-export"),
    path("analytics/track/", TrackVisitEventAPIView.as_view(), name="analytics-track"),
    path("auth/admin-login/", AdminLoginAPIView.as_view(), name="admin-login"),
]
