from django.contrib.auth import get_user_model
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Lesson, SchoolClass, Subject, SubjectCategory, VisitEvent


class PublicCatalogTests(APITestCase):
    def setUp(self):
        category = SubjectCategory.objects.create(title="Matematika", slug="matematika")
        school_class = SchoolClass.objects.create(title="7-sinf", slug="7-sinf", order=1)
        subject = Subject.objects.create(
            school_class=school_class,
            category=category,
            title="Matematika",
            slug="matematika-7",
            color="blue",
            order=1,
        )
        Lesson.objects.create(
            subject=subject,
            title="1-dars",
            slug="mat-7-1",
            youtube_id="abc123",
            duration_seconds=930,
            order=1,
            is_published=True,
        )

    def test_public_catalog_returns_nested_classes(self):
        response = self.client.get(reverse("public-catalog"))

        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data["classes"]), 1)
        self.assertEqual(response.data["classes"][0]["id"], "7-sinf")


class AnalyticsTests(APITestCase):
    def setUp(self):
        self.staff = get_user_model().objects.create_user(
            username="admin",
            password="password123",
            is_staff=True,
        )

    def test_track_event_creates_row(self):
        response = self.client.post(
            reverse("analytics-track"),
            {
                "path": "/classes/7-sinf",
                "event_type": "page_view",
                "label": "7-sinf",
            },
            format="json",
        )

        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(VisitEvent.objects.count(), 1)

    def test_dashboard_requires_admin(self):
        response = self.client.get(reverse("analytics-dashboard"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        self.client.force_authenticate(user=self.staff)
        response = self.client.get(reverse("analytics-dashboard"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("summary", response.data)

    def test_dashboard_export_requires_admin(self):
        response = self.client.get(reverse("analytics-export"))
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

        self.client.force_authenticate(user=self.staff)
        response = self.client.get(reverse("analytics-export"))
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertIn("text/csv", response["Content-Type"])


class CategoryCrudTests(APITestCase):
    def setUp(self):
        self.staff = get_user_model().objects.create_user(
            username="admin2",
            password="password123",
            is_staff=True,
        )

    def test_category_crud(self):
        self.client.force_authenticate(user=self.staff)
        create_response = self.client.post(
            "/api/v1/categories/",
            {"title": "Fizika", "color": "orange", "is_active": True},
            format="json",
        )
        self.assertEqual(create_response.status_code, status.HTTP_201_CREATED)
        category_id = create_response.data["id"]

        patch_response = self.client.patch(
            f"/api/v1/categories/{category_id}/",
            {"description": "Fizika fani"},
            format="json",
        )
        self.assertEqual(patch_response.status_code, status.HTTP_200_OK)

        delete_response = self.client.delete(f"/api/v1/categories/{category_id}/")
        self.assertEqual(delete_response.status_code, status.HTTP_204_NO_CONTENT)
