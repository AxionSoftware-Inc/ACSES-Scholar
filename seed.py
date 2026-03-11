import os
import django
import sys

# Set up Django environment
sys.path.append('/var/www/acses_backend')
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'project.settings')
django.setup()

from application.models import SchoolClass, Subject, Lesson, Category
from django.utils.text import slugify

def seed():
    print("Starting seeding process...")
    
    # Create Default Category
    cat, _ = Category.objects.get_or_create(
        title="Asosiy",
        defaults={'color': '#3b82f6', 'order': 1}
    )
    
    # Data to seed
    data = [
        {
            "class": "10-sinf",
            "subjects": [
                {
                    "title": "Matematika",
                    "lessons": [
                        {"title": "Funksiyalar va ularning xossalari", "youtube_id": "dQw4w9WgXcQ"},
                        {"title": "Trigonometrik tenglamalar", "youtube_id": "dQw4w9WgXcQ"},
                        {"title": "Hosilaning tatbiqlari", "youtube_id": "dQw4w9WgXcQ"}
                    ]
                },
                {
                    "title": "Fizika",
                    "lessons": [
                        {"title": "Kinematika asoslari", "youtube_id": "dQw4w9WgXcQ"},
                        {"title": "Dinamika qonunlari", "youtube_id": "dQw4w9WgXcQ"}
                    ]
                }
            ]
        },
        {
            "class": "11-sinf",
            "subjects": [
                {
                    "title": "Matematika",
                    "lessons": [
                        {"title": "Integrallar", "youtube_id": "dQw4w9WgXcQ"},
                        {"title": "Ehtimollar nazariyasi", "youtube_id": "dQw4w9WgXcQ"}
                    ]
                }
            ]
        }
    ]

    for item in data:
        cls_title = item['class']
        cls, created = SchoolClass.objects.get_or_create(
            title=cls_title,
            defaults={'slug': slugify(cls_title), 'is_active': True}
        )
        if created:
            print(f"Created class: {cls_title}")
        else:
            print(f"Class exists: {cls_title}")
            
        for sub_item in item['subjects']:
            sub_title = sub_item['title']
            sub_slug = slugify(f"{cls_title}-{sub_title}")
            sub, created = Subject.objects.get_or_create(
                school_class=cls,
                title=sub_title,
                defaults={'slug': sub_slug, 'category': cat, 'is_active': True}
            )
            if created:
                print(f"  Created subject: {sub_title}")
            else:
                print(f"  Subject exists: {sub_title}")

            for idx, lesson_item in enumerate(sub_item['lessons']):
                l_title = lesson_item['title']
                l_slug = slugify(f"{sub_slug}-{l_title}")
                lesson, created = Lesson.objects.get_or_create(
                    subject=sub,
                    title=l_title,
                    defaults={
                        'slug': l_slug,
                        'youtube_id': lesson_item['youtube_id'],
                        'order': idx + 1,
                        'is_published': True
                    }
                )
                if created:
                    print(f"    Created lesson: {l_title}")
                else:
                    print(f"    Lesson exists: {l_title}")

    print("Seeding finished successfully!")

if __name__ == "__main__":
    seed()
