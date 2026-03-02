from django.contrib.auth import get_user_model
from django.db import models
from django.utils.text import slugify


class TimeStampedModel(models.Model):
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True


class SubjectCategory(TimeStampedModel):
    title = models.CharField(max_length=160, unique=True)
    slug = models.SlugField(max_length=180, unique=True, blank=True)
    description = models.TextField(blank=True)
    color = models.CharField(max_length=30, blank=True)
    icon_url = models.URLField(blank=True)
    order = models.PositiveSmallIntegerField(default=1)
    is_active = models.BooleanField(default=True)

    class Meta:
        ordering = ["order", "title"]
        verbose_name_plural = "Subject categories"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = _generate_unique_slug(SubjectCategory, self.title, self.pk)
        super().save(*args, **kwargs)


class SchoolClass(TimeStampedModel):
    title = models.CharField(max_length=120)
    slug = models.SlugField(max_length=140, unique=True, blank=True)
    description = models.TextField(blank=True)
    order = models.PositiveSmallIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    hero_image_url = models.URLField(blank=True)
    cover_image_url = models.URLField(blank=True)
    external_link = models.URLField(blank=True)
    seo_title = models.CharField(max_length=160, blank=True)
    seo_description = models.CharField(max_length=320, blank=True)

    class Meta:
        ordering = ["order", "title"]
        verbose_name_plural = "School classes"

    def __str__(self):
        return self.title

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = _generate_unique_slug(SchoolClass, self.title, self.pk)
        super().save(*args, **kwargs)


class Subject(TimeStampedModel):
    school_class = models.ForeignKey(
        SchoolClass,
        on_delete=models.CASCADE,
        related_name="subjects",
    )
    category = models.ForeignKey(
        SubjectCategory,
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="subjects",
    )
    title = models.CharField(max_length=160)
    slug = models.SlugField(max_length=180, unique=True, blank=True)
    color = models.CharField(max_length=30, blank=True)
    description = models.TextField(blank=True)
    order = models.PositiveSmallIntegerField(default=1)
    is_active = models.BooleanField(default=True)
    thumbnail_url = models.URLField(blank=True)
    external_link = models.URLField(blank=True)
    seo_title = models.CharField(max_length=160, blank=True)
    seo_description = models.CharField(max_length=320, blank=True)

    class Meta:
        ordering = ["school_class__order", "order", "title"]
        constraints = [
            models.UniqueConstraint(fields=["school_class", "title"], name="unique_subject_per_class")
        ]

    def __str__(self):
        return f"{self.school_class.title} - {self.title}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = _generate_unique_slug(Subject, f"{self.school_class.title}-{self.title}", self.pk)
        super().save(*args, **kwargs)


class Lesson(TimeStampedModel):
    subject = models.ForeignKey(
        Subject,
        on_delete=models.CASCADE,
        related_name="lessons",
    )
    title = models.CharField(max_length=255)
    slug = models.SlugField(max_length=280, unique=True, blank=True)
    youtube_id = models.CharField(max_length=40)
    description = models.TextField(blank=True)
    short_description = models.CharField(max_length=280, blank=True)
    duration_seconds = models.PositiveIntegerField(default=0)
    order = models.PositiveSmallIntegerField(default=1)
    is_published = models.BooleanField(default=True)
    views_count = models.PositiveIntegerField(default=0)
    thumbnail_url = models.URLField(blank=True)
    resource_url = models.URLField(blank=True)
    external_link = models.URLField(blank=True)
    seo_title = models.CharField(max_length=160, blank=True)
    seo_description = models.CharField(max_length=320, blank=True)

    class Meta:
        ordering = ["subject__order", "order", "title"]
        constraints = [
            models.UniqueConstraint(fields=["subject", "title"], name="unique_lesson_per_subject")
        ]

    def __str__(self):
        return f"{self.subject.title} - {self.title}"

    @property
    def duration_label(self):
        if not self.duration_seconds:
            return ""
        minutes, seconds = divmod(self.duration_seconds, 60)
        return f"{minutes:02d}:{seconds:02d}"

    def save(self, *args, **kwargs):
        if not self.slug:
            self.slug = _generate_unique_slug(Lesson, f"{self.subject.title}-{self.title}", self.pk)
        super().save(*args, **kwargs)


class ContactRequest(TimeStampedModel):
    class Status(models.TextChoices):
        NEW = "new", "New"
        IN_PROGRESS = "in_progress", "In progress"
        RESOLVED = "resolved", "Resolved"
        SPAM = "spam", "Spam"

    full_name = models.CharField(max_length=140)
    email = models.EmailField()
    phone = models.CharField(max_length=30, blank=True)
    telegram = models.CharField(max_length=100, blank=True)
    message = models.TextField()
    source = models.CharField(max_length=80, blank=True)
    status = models.CharField(max_length=20, choices=Status.choices, default=Status.NEW)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return f"{self.full_name} ({self.email})"


class VisitEvent(TimeStampedModel):
    class EventType(models.TextChoices):
        PAGE_VIEW = "page_view", "Page view"
        LESSON_OPEN = "lesson_open", "Lesson open"
        LESSON_PLAY = "lesson_play", "Lesson play"
        SEARCH = "search", "Search"
        CLICK = "click", "Click"
        CONTACT_SUBMIT = "contact_submit", "Contact submit"

    user = models.ForeignKey(
        get_user_model(),
        null=True,
        blank=True,
        on_delete=models.SET_NULL,
        related_name="visit_events",
    )
    visitor_id = models.CharField(max_length=64, db_index=True)
    session_key = models.CharField(max_length=64, blank=True)
    path = models.CharField(max_length=500, db_index=True)
    method = models.CharField(max_length=12, blank=True)
    event_type = models.CharField(max_length=20, choices=EventType.choices, default=EventType.PAGE_VIEW)
    label = models.CharField(max_length=150, blank=True)
    referrer = models.CharField(max_length=500, blank=True)
    ip_address = models.GenericIPAddressField(null=True, blank=True)
    user_agent = models.TextField(blank=True)
    duration_ms = models.PositiveIntegerField(null=True, blank=True)
    metadata = models.JSONField(default=dict, blank=True)

    class Meta:
        ordering = ["-created_at"]
        indexes = [
            models.Index(fields=["created_at", "event_type"]),
            models.Index(fields=["path", "created_at"]),
            models.Index(fields=["label", "created_at"]),
        ]

    def __str__(self):
        return f"{self.event_type} {self.path}"


def _generate_unique_slug(model, value, instance_pk=None):
    base = slugify(value)[:220] or "item"
    slug = base
    counter = 2
    while model.objects.filter(slug=slug).exclude(pk=instance_pk).exists():
        slug = f"{base}-{counter}"[:280]
        counter += 1
    return slug