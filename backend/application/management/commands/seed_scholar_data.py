import json
from pathlib import Path

from django.core.management.base import BaseCommand, CommandError

from application.models import Lesson, SchoolClass, Subject, SubjectCategory


class Command(BaseCommand):
    help = "Seed school classes, subjects, and lessons from app/content/scholar.json"

    def add_arguments(self, parser):
        parser.add_argument(
            "--file",
            dest="file",
            default=None,
            help="Path to scholar.json file. Defaults to <repo>/app/content/scholar.json",
        )
        parser.add_argument(
            "--reset",
            action="store_true",
            help="Delete current classes/subjects/lessons/categories before import",
        )

    def handle(self, *args, **options):
        data_file = options["file"]
        if data_file:
            content_path = Path(data_file)
        else:
            content_path = Path(__file__).resolve().parents[4] / "app" / "content" / "scholar.json"

        if not content_path.exists():
            raise CommandError(f"File not found: {content_path}")

        with content_path.open("r", encoding="utf-8") as f:
            payload = json.load(f)

        classes = payload.get("classes", [])
        if not isinstance(classes, list):
            raise CommandError("Invalid scholar.json format: 'classes' must be a list")

        if options["reset"]:
            Lesson.objects.all().delete()
            Subject.objects.all().delete()
            SchoolClass.objects.all().delete()
            SubjectCategory.objects.all().delete()

        class_counter = 0
        subject_counter = 0
        lesson_counter = 0

        for class_index, class_item in enumerate(classes, start=1):
            class_obj, _ = SchoolClass.objects.update_or_create(
                slug=class_item["id"],
                defaults={
                    "title": class_item["title"],
                    "description": f"{class_item['title']} uchun video darslar to'plami",
                    "order": class_index,
                    "is_active": True,
                    "seo_title": f"{class_item['title']} darslari | ACSES Scholar",
                    "seo_description": f"{class_item['title']} bo'yicha barcha darslarni bir joyda ko'ring",
                },
            )
            class_counter += 1

            for subject_index, subject_item in enumerate(class_item.get("subjects", []), start=1):
                category_obj, _ = SubjectCategory.objects.get_or_create(
                    title=subject_item["title"],
                    defaults={
                        "color": subject_item.get("color", ""),
                        "description": f"{subject_item['title']} fani uchun kategoriyalar",
                        "order": subject_index,
                        "is_active": True,
                    },
                )

                subject_obj, _ = Subject.objects.update_or_create(
                    slug=subject_item["id"],
                    defaults={
                        "school_class": class_obj,
                        "category": category_obj,
                        "title": subject_item["title"],
                        "color": subject_item.get("color", ""),
                        "description": f"{class_item['title']} uchun {subject_item['title']} darslari",
                        "order": subject_index,
                        "is_active": True,
                        "seo_title": f"{subject_item['title']} - {class_item['title']} | ACSES Scholar",
                        "seo_description": f"{class_item['title']} bo'yicha {subject_item['title']} video darslari",
                    },
                )
                subject_counter += 1

                for lesson_index, lesson_item in enumerate(subject_item.get("lessons", []), start=1):
                    youtube_id = lesson_item.get("youtubeId", "")
                    Lesson.objects.update_or_create(
                        slug=lesson_item["id"],
                        defaults={
                            "subject": subject_obj,
                            "title": lesson_item["title"],
                            "youtube_id": youtube_id,
                            "description": lesson_item.get("description", ""),
                            "short_description": lesson_item.get("description", "")[:250],
                            "duration_seconds": _duration_to_seconds(lesson_item.get("duration", "")),
                            "order": lesson_index,
                            "is_published": True,
                            "thumbnail_url": f"https://img.youtube.com/vi/{youtube_id}/hqdefault.jpg" if youtube_id else "",
                            "seo_title": f"{lesson_item['title']} | ACSES Scholar",
                            "seo_description": lesson_item.get("description", "")[:300],
                        },
                    )
                    lesson_counter += 1

        self.stdout.write(
            self.style.SUCCESS(
                f"Imported: {class_counter} classes, {subject_counter} subjects, {lesson_counter} lessons"
            )
        )


def _duration_to_seconds(value):
    if not value or ":" not in value:
        return 0

    try:
        minutes, seconds = value.split(":", 1)
        return int(minutes) * 60 + int(seconds)
    except (ValueError, TypeError):
        return 0