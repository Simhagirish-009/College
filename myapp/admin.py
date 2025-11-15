from django.contrib import admin
from .models import *

# Custom User Admin
class CustomUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'is_staff', 'is_superuser')
    search_fields = ('email', 'username', 'first_name', 'last_name')
    list_filter = ('is_staff', 'is_superuser')

# Admin Model Admin
class AdminAdmin(admin.ModelAdmin):
    list_display = ('admin', 'username', 'email', 'gender', 'joined_date')
    search_fields = ('username', 'email')
    list_filter = ('gender',)

# Staff Model Admin
class StaffAdmin(admin.ModelAdmin):
    list_display = ('staff_name', 'email', 'gender', 'course')
    search_fields = ('staff_name', 'email')
    list_filter = ('gender', 'course')

# Student Model Admin
class StudentAdmin(admin.ModelAdmin):
    list_display = ('student_name', 'email', 'gender', 'course','session')
    search_fields = ('student_name', 'email')
    list_filter = ('gender', 'course', 'session')

# Course Model Admin
class CourseAdmin(admin.ModelAdmin):
    list_display = ('name', 'created_at', 'updated_at')
    search_fields = ('name',)

# Session Model Admin
class SessionAdmin(admin.ModelAdmin):
    list_display = ('start_year', 'end_year')
    search_fields = ('start_year', 'end_year')

# Subject Model Admin
class SubjectAdmin(admin.ModelAdmin):
    list_display = ('name', 'staff__staff_name', 'course', 'created_at', 'updated_at')
    search_fields = ('name',)
    list_filter = ('staff', 'course')

# OTP Model Admin
class OtpAdmin(admin.ModelAdmin):
    list_display = ('user', 'otp', 'created_at', 'is_valid')
    search_fields = ('user__email', 'otp')
    list_filter = ('created_at',)

# Registering models with their admin classes
admin.site.register(CustomUser, CustomUserAdmin)  # Register CustomUser
admin.site.register(Admin, AdminAdmin)
admin.site.register(Staff, StaffAdmin)
admin.site.register(Student, StudentAdmin)
admin.site.register(Course, CourseAdmin)
admin.site.register(Session, SessionAdmin)
admin.site.register(Subject, SubjectAdmin)
admin.site.register(Otp, OtpAdmin)
admin.site.register(NotificationStaff)
admin.site.register(NotificationStudent)
admin.site.register(LeaveReportStaff)
admin.site.register(LeaveReportStudent)
admin.site.register(FeedbackStaff)
admin.site.register(FeedbackStudent)
admin.site.register(StudentResult)
admin.site.register(Attendance)
admin.site.register(AttendanceReport)
admin.site.register(Unit)
admin.site.register(VerificationCode)
admin.site.register(CourseOutcome)
admin.site.register(CoMarks)