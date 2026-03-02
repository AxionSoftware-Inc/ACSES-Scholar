import re

from django.contrib.auth import authenticate
from rest_framework import serializers

from .models import ContactRequest, Lesson, SchoolClass, Subject, SubjectCategory, VisitEvent

YOUTUBE_ID_PATTERN = re.compile(r"^[a-zA-Z0-9_-]{6,40}$")


class SubjectCategorySerializer(serializers.ModelSerializer):
    subjects_count = serializers.IntegerField(read_only=True)

    class Meta:
        model = SubjectCategory
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "color",
            "icon_url",
            "order",
            "is_active",
            "subjects_count",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["slug"]


class LessonSerializer(serializers.ModelSerializer):
    duration = serializers.CharField(source="duration_label", read_only=True)
    class_id = serializers.CharField(source="subject.school_class.slug", read_only=True)
    class_title = serializers.CharField(source="subject.school_class.title", read_only=True)
    subject_id = serializers.CharField(source="subject.slug", read_only=True)
    subject_title = serializers.CharField(source="subject.title", read_only=True)

    class Meta:
        model = Lesson
        fields = [
            "id",
            "subject",
            "class_id",
            "class_title",
            "subject_id",
            "subject_title",
            "title",
            "slug",
            "youtube_id",
            "description",
            "short_description",
            "duration_seconds",
            "duration",
            "order",
            "is_published",
            "views_count",
            "thumbnail_url",
            "resource_url",
            "external_link",
            "seo_title",
            "seo_description",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["slug", "views_count"]

    def validate_youtube_id(self, value):
        if value and not YOUTUBE_ID_PATTERN.match(value):
            raise serializers.ValidationError("youtube_id format noto'g'ri")
        return value


class SubjectSerializer(serializers.ModelSerializer):
    lessons = LessonSerializer(many=True, required=False)
    class_id = serializers.CharField(source="school_class.slug", read_only=True)
    class_title = serializers.CharField(source="school_class.title", read_only=True)
    category_slug = serializers.CharField(source="category.slug", read_only=True)
    category_title = serializers.CharField(source="category.title", read_only=True)

    class Meta:
        model = Subject
        fields = [
            "id",
            "school_class",
            "class_id",
            "class_title",
            "category",
            "category_slug",
            "category_title",
            "title",
            "slug",
            "color",
            "description",
            "order",
            "is_active",
            "thumbnail_url",
            "external_link",
            "seo_title",
            "seo_description",
            "lessons",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["slug"]

    def create(self, validated_data):
        lessons = validated_data.pop("lessons", [])
        subject = Subject.objects.create(**validated_data)
        _replace_lessons(subject, lessons)
        return subject

    def update(self, instance, validated_data):
        lessons = validated_data.pop("lessons", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if lessons is not None:
            _replace_lessons(instance, lessons)
        return instance


class SchoolClassSerializer(serializers.ModelSerializer):
    subjects = SubjectSerializer(many=True, required=False)

    class Meta:
        model = SchoolClass
        fields = [
            "id",
            "title",
            "slug",
            "description",
            "order",
            "is_active",
            "hero_image_url",
            "cover_image_url",
            "external_link",
            "seo_title",
            "seo_description",
            "subjects",
            "created_at",
            "updated_at",
        ]
        read_only_fields = ["slug"]

    def create(self, validated_data):
        subjects = validated_data.pop("subjects", [])
        school_class = SchoolClass.objects.create(**validated_data)
        self._replace_subjects(school_class, subjects)
        return school_class

    def update(self, instance, validated_data):
        subjects = validated_data.pop("subjects", None)
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()

        if subjects is not None:
            self._replace_subjects(instance, subjects)
        return instance

    def _replace_subjects(self, school_class, subjects):
        school_class.subjects.all().delete()
        for subject_data in subjects:
            lessons = subject_data.pop("lessons", [])
            subject = Subject.objects.create(school_class=school_class, **subject_data)
            _replace_lessons(subject, lessons)


class PublicLessonSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="slug", read_only=True)
    youtubeId = serializers.CharField(source="youtube_id", read_only=True)
    duration = serializers.CharField(source="duration_label", read_only=True)

    class Meta:
        model = Lesson
        fields = [
            "id",
            "title",
            "youtubeId",
            "description",
            "duration",
            "thumbnail_url",
            "resource_url",
            "external_link",
        ]


class PublicSubjectSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="slug", read_only=True)
    lessons = serializers.SerializerMethodField()
    category = serializers.CharField(source="category.slug", read_only=True)

    class Meta:
        model = Subject
        fields = [
            "id",
            "title",
            "color",
            "category",
            "thumbnail_url",
            "external_link",
            "lessons",
        ]

    def get_lessons(self, obj):
        published_lessons = obj.lessons.filter(is_published=True)
        return PublicLessonSerializer(published_lessons, many=True).data


class PublicClassSerializer(serializers.ModelSerializer):
    id = serializers.CharField(source="slug", read_only=True)
    subjects = serializers.SerializerMethodField()

    class Meta:
        model = SchoolClass
        fields = [
            "id",
            "title",
            "description",
            "hero_image_url",
            "cover_image_url",
            "external_link",
            "subjects",
        ]

    def get_subjects(self, obj):
        active_subjects = obj.subjects.filter(is_active=True)
        return PublicSubjectSerializer(active_subjects, many=True).data


class ContactRequestSerializer(serializers.ModelSerializer):
    class Meta:
        model = ContactRequest
        fields = [
            "id",
            "full_name",
            "email",
            "phone",
            "telegram",
            "message",
            "source",
            "status",
            "created_at",
            "updated_at",
        ]


class VisitEventSerializer(serializers.ModelSerializer):
    class Meta:
        model = VisitEvent
        fields = [
            "id",
            "visitor_id",
            "session_key",
            "path",
            "method",
            "event_type",
            "label",
            "referrer",
            "duration_ms",
            "metadata",
            "created_at",
        ]
        read_only_fields = ["id", "created_at"]
        extra_kwargs = {
            "visitor_id": {"required": False},
            "method": {"required": False},
            "session_key": {"required": False},
            "referrer": {"required": False},
            "metadata": {"required": False},
        }


class AdminLoginSerializer(serializers.Serializer):
    username = serializers.CharField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        user = authenticate(username=attrs["username"], password=attrs["password"])
        if not user:
            raise serializers.ValidationError("Username yoki password noto'g'ri")
        if not user.is_staff:
            raise serializers.ValidationError("Admin panel uchun staff user kerak")
        attrs["user"] = user
        return attrs


def _replace_lessons(subject, lessons):
    subject.lessons.all().delete()
    Lesson.objects.bulk_create([Lesson(subject=subject, **lesson_data) for lesson_data in lessons])