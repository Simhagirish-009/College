from django.contrib.auth.hashers import make_password
from django.contrib.auth.models import AbstractUser, UserManager
from django.db import models
from django.utils import timezone
from django.dispatch import receiver
from django.db.models.signals import post_save
from django.core.validators import MaxValueValidator, MinValueValidator

# Gender choices
GENDER_CHOICES = [("M", "Male"), ("F", "Female")]

# Custom User Manager
class CustomUserManager(UserManager):
    def _create_user(self, email, password, **extra_fields):
        email = self.normalize_email(email)
        user = CustomUser(email=email, **extra_fields)
        user.password = make_password(password)
        user.save(using=self._db)
        return user

    def create_user(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", False)
        extra_fields.setdefault("is_active", True)  # Ensure user is active by default
        return self._create_user(email, password, **extra_fields)

    def create_staff_user(self, email, password=None, **extra_fields):

        extra_fields.setdefault("is_staff", True)  # Ensure staff privileges
        extra_fields.setdefault("is_active", True)  # Ensure active user

        user = self._create_user(email, password, **extra_fields)

        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)
        extra_fields.setdefault("is_active", True)  # Superusers are always active
        user = self._create_user(email, password, **extra_fields)

        # Create Admin instance for the superuser
        Admin.objects.create(admin=user, username=user.username, email=user.email ,password=user.password)

        return user
    
# Course Model
class Course(models.Model):
    name = models.CharField(max_length=120)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

from django.db import models
from django.db.models.signals import post_migrate
from django.dispatch import receiver
from datetime import date


class Session(models.Model):
    YEAR_CHOICES = [
        ('1st_Year', '1st Year'),
        ('2nd_Year', '2nd Year'),
        ('3rd_Year', '3rd Year'),
    ]

    year = models.CharField(max_length=20, choices=YEAR_CHOICES, unique=True)
    start_year = models.DateField(null=True, blank=True)
    end_year = models.DateField(null=True, blank=True)

    def __str__(self):
        if self.start_year and self.end_year:
            return f"{self.year} — From {self.start_year.year} to {self.end_year.year}"
        return self.year


@receiver(post_migrate)
def create_default_sessions(sender, **kwargs):
    """
    Automatically creates 1st, 2nd, and 3rd-year session records.
    Example:
      - 1st Year: June 2025 – May 2026 (current session)
      - 2nd Year: June 2024 – May 2025
      - 3rd Year: June 2023 – May 2024
    """
    if sender.name == "myapp":  # 🔹 Replace with your Django app name
        today = date.today()
        current_year = today.year

        default_data = [
            {
                "year": "1st_Year",
                "start_year": date(current_year, 6, 1),
                "end_year": date(current_year + 1, 5, 31),
            },
            {
                "year": "2nd_Year",
                "start_year": date(current_year - 1, 6, 1),
                "end_year": date(current_year, 5, 31),
            },
            {
                "year": "3rd_Year",
                "start_year": date(current_year - 2, 6, 1),
                "end_year": date(current_year - 1, 5, 31),
            },
        ]

        for data in default_data:
            Session.objects.update_or_create(
                year=data["year"],
                defaults={
                    "start_year": data["start_year"],
                    "end_year": data["end_year"],
                },
            )



# CustomUser Model
class CustomUser(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=False)  # Allow duplicate usernames
    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']  # Username is required but not unique

    objects = CustomUserManager()

from django.core.validators import RegexValidator

# Staff Model
class Staff(models.Model):
    admin = models.OneToOneField(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    staff_name = models.CharField(max_length=120)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=30)
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True)  
    address = models.TextField()
    contact = models.CharField(
        max_length=10,
        validators=[RegexValidator(r'^\d{10}$', 'Enter a valid 10-digit contact number.')],
        null=True,
        blank=True
    )
    course = models.ForeignKey(Course, on_delete=models.DO_NOTHING, null=True, blank=False)
    joined_date = models.DateField(auto_now_add=True)
    end_date = models.DateField(null=True,blank=True)
    profile_pic = models.ImageField(default='profile_pic/profile.jpg', upload_to='profile_pics/', null=True, blank=True)

    def __str__(self):
        return f"Staff: {self.staff_name}"


# Student Model
class Student(models.Model):
    admin = models.OneToOneField(CustomUser, on_delete=models.CASCADE, null=True, blank=True)
    student_name = models.CharField(max_length=100)
    pin = models.CharField(max_length=20, unique=True, blank=True)  # Store the PIN
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=30)
    contact = models.CharField(
        max_length=10,
        validators=[RegexValidator(r'^\d{10}$', 'Enter a valid 10-digit contact number.')],
        null=True,
        blank=True
    )
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True)  
    address = models.TextField()
    course = models.ForeignKey(Course, on_delete=models.DO_NOTHING, null=True, blank=False)
    session = models.ForeignKey(Session, on_delete=models.DO_NOTHING, null=True, blank=False)
    joined_date = models.DateField(auto_now_add=True)
    end_date = models.DateField(null=True,blank=True)
    profile_pic = models.ImageField(default='profile_pic/profile.jpg',upload_to='profile_pics/', null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.pin:  # Generate PIN only if it doesn't exist
            session = self.session
            year = str(session.start_year)[2:4]  # Use the last two digits of the start year
            code = "072"  # Fixed code; can also be dynamic
            serial_number = (
                Student.objects.filter(session=self.session, course=self.course).count() + 1
            )
            serial_number = f"{serial_number:03}"  # Zero-padded to 3 digits
            self.pin = f"{year}{code}-{self.course}-{serial_number}"
        super().save(*args, **kwargs)

    def __str__(self):
        return f"Student: {self.student_name}"

# Admin (HOD) Model
class Admin(models.Model):
    admin = models.OneToOneField(CustomUser, on_delete=models.CASCADE)
    username = models.CharField(max_length=120)
    email = models.EmailField(unique=True)
    password = models.CharField(max_length=30)  
    gender = models.CharField(max_length=1, choices=GENDER_CHOICES, null=True, blank=True)
    contact = models.CharField(
        max_length=10,
        validators=[RegexValidator(r'^\d{10}$', 'Enter a valid 10-digit contact number.')],
        null=True,
        blank=True
    )
    address = models.TextField()
    joined_date = models.DateField(null=True)
    end_date = models.DateField(null=True)

    profile_pic = models.ImageField(default='profile_pic/profile.jpg',upload_to='profile_pics/', null=True, blank=True)

    def __str__(self):
        return f"HOD: {self.admin.first_name} {self.admin.last_name}"

# Subject Model
class Subject(models.Model):
    name = models.CharField(max_length=120)
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    course = models.ForeignKey(Course, on_delete=models.CASCADE)
    session = models.ForeignKey(Session,on_delete=models.CASCADE)
    updated_at = models.DateTimeField(auto_now=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.name 
# Otp Model
class Otp(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    otp = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_valid(self):
        return timezone.now() < self.created_at + timezone.timedelta(seconds=60)

    def __str__(self):
        return f"OTP for {self.user}"

class NotificationStaff(models.Model):
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class NotificationStudent(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    sender = models.CharField(max_length=20)
    message = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class LeaveReportStudent(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    fromdate = models.CharField(max_length=60)
    todate = models.CharField(max_length=60)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class LeaveReportStaff(models.Model):
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    fromdate = models.CharField(max_length=60)
    todate = models.CharField(max_length=60)
    message = models.TextField()
    status = models.CharField(max_length=20, choices=[('pending', 'Pending'), ('approved', 'Approved'), ('rejected', 'Rejected')], default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class FeedbackStudent(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    feedback = models.TextField()
    reply = models.TextField(default="No Reply")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class FeedbackStaff(models.Model):
    staff = models.ForeignKey(Staff, on_delete=models.CASCADE)
    feedback = models.TextField()
    reply = models.TextField(default="No Reply")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class Unit(models.Model) :
    unit_field = models.IntegerField(validators=[MinValueValidator(1)])
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='units')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    class Meta:
        unique_together = ('unit_field','subject')

class CourseOutcome(models.Model):
    CO_CHOICES = [
        ('CO1', 'CO1'),
        ('CO2', 'CO2'),
        ('CO3', 'CO3'),
        ('CO4', 'CO4'),
        ('CO5', 'CO5'),
    ]
    co_number = models.CharField(max_length=4, choices=CO_CHOICES)
    description = models.TextField(blank=True)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE, related_name='course_outcomes')

    class Meta:
        unique_together = ('co_number', 'subject')

    def __str__(self):
        return f"{self.co_number} - {self.subject.name}"
    
class CoMarks(models.Model):
    unit = models.ForeignKey(Unit, on_delete=models.CASCADE, related_name='co_marks')
    course_outcome = models.ForeignKey(CourseOutcome, on_delete=models.CASCADE, related_name='marks')
    max_marks = models.PositiveIntegerField(validators=[MinValueValidator(0)])

    class Meta:
        unique_together = ('unit', 'course_outcome')

    def __str__(self):
        return f"{self.course_outcome.co_number} ({self.max_marks} marks) for Unit {self.unit.unit_field}"

class StudentResult(models.Model):
    student = models.ForeignKey(Student, on_delete=models.CASCADE)
    subject = models.ForeignKey(Subject, on_delete=models.CASCADE)
    unit = models.ForeignKey(Unit,on_delete=models.CASCADE)
    test = models.FloatField(default=0 ,validators=[MinValueValidator(0), MaxValueValidator(100)])
    exam = models.FloatField(default=0 , validators=[MinValueValidator(0), MaxValueValidator(100)])
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.student} - {self.subject}"

class Attendance(models.Model):
    session = models.ForeignKey(Session, on_delete=models.DO_NOTHING)
    subject = models.ForeignKey(Subject, on_delete=models.DO_NOTHING)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

class AttendanceReport(models.Model):
    student = models.ForeignKey(Student, on_delete=models.DO_NOTHING)
    attendance = models.ForeignKey(Attendance, on_delete=models.CASCADE)
    att_status = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

from datetime import timedelta

class VerificationCode(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE, related_name="verification_codes")
    code = models.CharField(max_length=6)
    created_at = models.DateTimeField(auto_now_add=True)

    def is_expired(self):
        # Set code expiry time (e.g., 10 minutes)
        return timezone.now() > self.created_at + timedelta(minutes=10)
