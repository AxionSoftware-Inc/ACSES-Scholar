from django.contrib import admin

from .models import ContactRequest, Lesson, SchoolClass, Subject, SubjectCategory, VisitEvent


class LessonInline(admin.TabularInline):
    model = Lesson
    extra = 1


@admin.register(SubjectCategory)
class SubjectCategoryAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "color", "order", "is_active", "created_at")
    list_filter = ("is_active", "color")
    search_fields = ("title", "slug", "description")
    prepopulated_fields = {"slug": ("title",)}


@admin.register(Subject)
class SubjectAdmin(admin.ModelAdmin):
    list_display = ("title", "school_class", "category", "color", "order", "is_active")
    list_filter = ("school_class", "category", "is_active", "color")
    search_fields = ("title", "school_class__title", "category__title", "description", "seo_title")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [LessonInline]


class SubjectInline(admin.TabularInline):
    model = Subject
    extra = 1


@admin.register(SchoolClass)
class SchoolClassAdmin(admin.ModelAdmin):
    list_display = ("title", "slug", "order", "is_active", "created_at")
    list_filter = ("is_active",)
    search_fields = ("title", "description", "seo_title")
    prepopulated_fields = {"slug": ("title",)}
    inlines = [SubjectInline]


@admin.register(Lesson)
class LessonAdmin(admin.ModelAdmin):
    list_display = (
        "title",
        "subject",
        "duration_seconds",
        "order",
        "is_published",
        "views_count",
    )
    list_filter = ("is_published", "subject__school_class", "subject", "subject__category")
    search_fields = (
        "title",
        "description",
        "short_description",
        "subject__title",
        "subject__school_class__title",
        "seo_title",
    )
    prepopulated_fields = {"slug": ("title",)}


@admin.register(ContactRequest)
class ContactRequestAdmin(admin.ModelAdmin):
    list_display = ("full_name", "email", "phone", "telegram", "source", "status", "created_at")
    list_filter = ("status", "source", "created_at")
    search_fields = ("full_name", "email", "phone", "telegram", "message")


@admin.register(VisitEvent)
class VisitEventAdmin(admin.ModelAdmin):
    list_display = ("event_type", "path", "visitor_id", "label", "created_at")
    list_filter = ("event_type", "created_at")
    search_fields = ("path", "visitor_id", "label", "referrer")
    readonly_fields = (
        "user",
        "visitor_id",
        "session_key",
        "path",
        "method",
        "event_type",
        "label",
        "referrer",
        "ip_address",
        "user_agent",
        "duration_ms",
        "metadata",
        "created_at",
        "updated_at",
    )

    def has_add_permission(self, request):
        return False

    def has_change_permission(self, request, obj=None):
        return False