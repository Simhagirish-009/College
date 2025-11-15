from rest_framework import serializers
from django.contrib.auth import authenticate
from .models import *
from django.contrib.auth import get_user_model
from django.conf import settings
from django.core.mail import send_mail
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.db import IntegrityError

# Serializer for login Admin , Staff and student
class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        UserModel = get_user_model()
        email = attrs.get('email')
        password = attrs.get('password')

        # Check if the email exists in the database
        if not UserModel.objects.filter(email=email).exists():
            raise serializers.ValidationError({"email": "Invalid email."})

        # Check if the password is incorrect
        user = authenticate(username=email, password=password)
        if user is None:
            raise serializers.ValidationError({"password": "Invalid password."})

        # Check if the user is active
        if not user.is_active:
            raise serializers.ValidationError("User account is disabled.")
        
        return {
            'user': user,
            'email': user.email
        }
# OTP serializer for verification
class OtpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Otp
        fields = ['otp']

# Admin Create Serializer class
class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ['id', 'username', 'email', 'password', 'gender', 'address', 'profile_pic', 'joined_date', 'end_date']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        plain_password = validated_data.pop('password')
        username = validated_data.get('username')
        email = validated_data.get('email')

        try:
            user, created = CustomUser.objects.get_or_create(
                username=username,
                email=email,
                defaults={'is_superuser': True, 'is_staff': True}
            )
            if created:
                user.set_password(plain_password)
                user.save()

            admin = Admin.objects.create(
                admin=user,
                username=username,
                email=email,
                password = plain_password,
                gender=validated_data.get('gender'),
                address=validated_data.get('address'),
                joined_date=validated_data.get('joined_date'),
                end_date=validated_data.get('end_date'),
            )
            # html_message = render_to_string('emails/welcome_student.html', {
            # 'admin': admin,
            # 'password' : plain_password,
            # })
            # subject = 'Welcome to Our Platform'
            # plain_message = strip_tags(html_message)
            # from_email = settings.DEFAULT_FROM_EMAIL
            # to_email = [validated_data['email']]  

            # send_mail(
            #     subject,
            #     plain_message,
            #     from_email,
            #     to_email,  
            #     html_message=html_message,
            #     fail_silently=False,
            #  )

            return admin

        except IntegrityError:
            raise serializers.ValidationError("Admin with this user already exists.")

# Admin update Serializer class
class AdminUpdateSerializer(serializers.ModelSerializer):
    class Meta :
        model = Admin
        fields = ['id', 'username', 'email', 'gender', 'address','profile_pic', 'joined_date', 'end_date']

# Course Serializer class
class CourseSerializer(serializers.ModelSerializer) :
    class Meta :
        model = Course
        fields = ['id','name']

# Session Serializer class
class SessionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        fields = ['id','year', 'start_year', 'end_year']

class SubjectSerializer(serializers.ModelSerializer):
    staff_name = serializers.CharField(source='staff.staff_name', read_only=True)
    course_name = serializers.CharField(source='course.name', read_only=True)
    session_start = serializers.CharField(source='session.start_year', read_only=True)  # Ensure your session model has start_year
    session_end = serializers.CharField(source='session.end_year', read_only=True)  # Ensure your session model has end_year
    year = serializers.CharField(source='session.year', read_only=True)  # Ensure your session model has end_year


    class Meta:
        model = Subject
        fields = ['id', 'name', 'staff', 'course', 'session', 'staff_name', 'course_name','year', 'session_start', 'session_end']

class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

    def validate(self, attrs):
        UserModel = get_user_model()
        email = attrs.get('email')
        password = attrs.get('password')

        # Check if the email exists in the database
        try:
            user_instance = UserModel.objects.get(email=email)
        except UserModel.DoesNotExist:
            raise serializers.ValidationError({"email": "Email is invalid."})

        # Authenticate the user
        user = authenticate(username=email, password=password)

        # If authentication fails, it means password is invalid
        if user is None:
            raise serializers.ValidationError({"password": "Password is invalid."})

        # Check if the user is active
        if not user.is_active:
            raise serializers.ValidationError({"user": "User account is disabled."})

        return {
            'user': user,
            'email': user.email  # Return user email for OTP or other use
        }

class OtpSerializer(serializers.ModelSerializer):
    class Meta:
        model = Otp
        fields = ['otp']

# Unit Serializer Class
class UnitSerializer(serializers.ModelSerializer) :
    class Meta : 
        model = Unit
        fields = ['id','unit_field']

# Staff Creation Serializer Class
class StaffSerializer(serializers.ModelSerializer):
    course_name = serializers.SerializerMethodField()

    class Meta:
        model = Staff
        fields = ['id', 'staff_name', 'email', 'password', 'gender', 'course', 'course_name','contact', 'address', 'profile_pic', 'joined_date', 'end_date']  # Adjust fields as necessary

    def get_course_name(self, obj):
        return obj.course.name  # Assuming 'course' is a ForeignKey to the Course model
    
    def update(self, instance, validated_data):
        # Update the password if provided
        password = validated_data.pop('password', None)
        if password:
            instance.set_password(password)  # Ensure the password is hashed
        for attr, value in validated_data.items():
            setattr(instance, attr, value)
        instance.save()
        return instance
    
    def create(self, validated_data):
        # Extract password from validated data
        plain_password = validated_data.pop('password')

        # Create the CustomUser instance
        user = CustomUser.objects.create_staff_user(
            username=validated_data['staff_name'],
            email=validated_data['email'],
            password=plain_password  # Hashing happens in create_user
        )
        
        staff = Staff.objects.create(
            admin=user,
            course=validated_data['course'],
            staff_name=validated_data['staff_name'],
            email=validated_data['email'],  
            password=plain_password,
            gender=validated_data['gender'],
            address=validated_data['address'],
            contact=validated_data['contact'],
        )

        # Prepare and send email
        html_message = render_to_string('emails/welcome_staff.html', {
            'staff': staff,
            'password' : plain_password,
        })
        subject = 'Welcome to Our Platform'
        plain_message = strip_tags(html_message)
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = [validated_data['email']]  # Ensure it's a list

        send_mail(
            subject,
            plain_message,
            from_email,
            to_email,  # Correctly pass the recipient email as a list
            html_message=html_message,
            fail_silently=False,
        )

        return staff

class StaffUpdateSerializer(serializers.ModelSerializer):
    class Meta :
        model = Staff
        fields = ['id', 'staff_name', 'email', 'gender','contact', 'address','profile_pic', 'joined_date', 'end_date']

class StudentSerializer(serializers.ModelSerializer):
    course_name = serializers.SerializerMethodField()
    session_start = serializers.SerializerMethodField()
    session_end = serializers.SerializerMethodField()
    session_year = serializers.SerializerMethodField()

    class Meta:
        model = Student
        fields = ['id', 'student_name','email','pin','password','contact', 'gender', 'course', 'course_name', 'profile_pic',
                  'session','session_year', 'session_start', 'session_end', 'address', 
                  'joined_date', 'end_date']
        extra_kwargs = {
            'password': {'write_only': True}  # Ensure password is write-only
        }

    def get_course_name(self, obj):
        return obj.course.name if obj.course else None
    
    def get_session_year(self,obj):
        return obj.session.year if obj.session else None
    
    def get_session_start(self, obj):
        return obj.session.start_year if obj.session else None
    
    def get_session_end(self, obj):
        return obj.session.end_year if obj.session else None

    def create(self, validated_data):
        plain_password = validated_data.pop('password')

        # Create the CustomUser instance
        user = CustomUser.objects.create_user(
            username=validated_data['student_name'],
            email=validated_data['email'],
            password=plain_password
        )

        # Create the Student instance
        student = Student.objects.create(
            admin=user,
            student_name=validated_data['student_name'],
            email=validated_data['email'],
            gender=validated_data['gender'],
            course=validated_data['course'],
            session=validated_data.get('session'),
            address=validated_data['address'],
            contact=validated_data['contact'],
            joined_date=validated_data.get('joined_date'),
            end_date=validated_data.get('end_date')
        )
        # Prepare and send email
        html_message = render_to_string('emails/welcome_student.html', {
            'student': student,
            'password' : plain_password,
        })
        subject = 'Welcome to Our Platform'
        plain_message = strip_tags(html_message)
        from_email = settings.DEFAULT_FROM_EMAIL
        to_email = [validated_data['email']]  # Ensure it's a list

        send_mail(
            subject,
            plain_message,
            from_email,
            to_email,  # Correctly pass the recipient email as a list
            html_message=html_message,
            fail_silently=False,
        )

        return student
# <<<<<<< HEAD
from django.db import IntegrityError

class AdminSerializer(serializers.ModelSerializer):
    class Meta:
        model = Admin
        fields = ['id', 'username', 'email', 'password', 'gender', 'address', 'profile_pic', 'joined_date', 'end_date']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        plain_password = validated_data.pop('password')
        username = validated_data.get('username')
        email = validated_data.get('email')

        try:
            user, created = CustomUser.objects.get_or_create(
                username=username,
                email=email,
                defaults={'is_superuser': True, 'is_staff': True}
            )
            if created:
                user.set_password(plain_password)
                user.save()

            admin = Admin.objects.create(
                admin=user,
                username=username,
                email=email,
                password = plain_password,
                gender=validated_data.get('gender'),
                address=validated_data.get('address'),
                joined_date=validated_data.get('joined_date'),
                end_date=validated_data.get('end_date'),
                profile_pic=validated_data.get('profile_pic'),
            )
            html_message = render_to_string('emails/welcome_student.html', {
            'admin': admin,
            'password' : plain_password,
            })
            subject = 'Welcome to Our Platform'
            plain_message = strip_tags(html_message)
            from_email = settings.DEFAULT_FROM_EMAIL
            to_email = [validated_data['email']]  

            send_mail(
                subject,
                plain_message,
                from_email,
                to_email,  
                html_message=html_message,
                fail_silently=False,
             )

            return admin

        except IntegrityError:
            raise serializers.ValidationError("Admin with this user already exists.")


class AdminUpdateSerializer(serializers.ModelSerializer):
    class Meta :
        model = Admin
        fields = ['id', 'username', 'email', 'gender','contact', 'address','profile_pic', 'joined_date', 'end_date']

class StaffUpdateSerializer(serializers.ModelSerializer):
    class Meta :
        model = Staff
        fields = ['id', 'staff_name', 'email', 'gender','contact', 'address','profile_pic', 'joined_date', 'end_date']

class StudentUpdateSerializer(serializers.ModelSerializer):
    class Meta :
        model = Student
        fields = ['id', 'student_name', 'email', 'gender','contact', 'address','profile_pic', 'joined_date', 'end_date']

class NotificationStaffSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationStaff
        fields = ['id', 'staff', 'message', 'created_at', 'updated_at']

class NotificationStudentSerializer(serializers.ModelSerializer):
    class Meta:
        model = NotificationStudent
        fields = ['id', 'student','sender', 'message', 'created_at', 'updated_at']

class LeaveReportStaffSerializer(serializers.ModelSerializer):
    staff_email = serializers.EmailField(write_only=True)  # To accept staff email from the frontend
    staff_name = serializers.CharField(source='staff.staff_name', read_only=True)
    course = serializers.CharField(source='staff.course.name',read_only=True)
    class Meta:
        model = LeaveReportStaff
        fields = ['id','staff_email', 'fromdate','todate', 'message', 'status', 'created_at','staff_name','course']

    def create(self, validated_data):
        # Get the staff using email
        staff_email = validated_data.pop('staff_email')
        try:
            staff = Staff.objects.get(email=staff_email)
        except Staff.DoesNotExist:
            raise serializers.ValidationError("Staff with this email does not exist.")

        # Create the leave report for the staff
        leave_report = LeaveReportStaff.objects.create(staff=staff, **validated_data)
        return leave_report

class LeaveReportStudentSerializer(serializers.ModelSerializer):
    student_email = serializers.EmailField(write_only=True)  # To accept staff email from the frontend
    student_name = serializers.CharField(source='student.student_name', read_only=True)
    course = serializers.CharField(source='student.course.name',read_only=True)
    year = serializers.CharField(source='student.session.year',read_only=True)

    class Meta:
        model = LeaveReportStaff
        fields = ['id','student_email', 'fromdate','todate', 'message', 'status', 'created_at','student_name','year','course']

    def create(self, validated_data):
        # Get the staff using email
        student_email = validated_data.pop('student_email')
        try:
            student = Student.objects.get(email=student_email)
        except Staff.DoesNotExist:
            raise serializers.ValidationError("Staff with this email does not exist.")

        # Create the leave report for the staff
        leave_report = LeaveReportStudent.objects.create(student=student, **validated_data)
        return leave_report
    
class StaffEditSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.name', read_only=True)
    class Meta:
        model = Staff
        fields = ['id','staff_name', 'email','contact', 'course', 'course_name']  # course should be writable for updates

class StudentEditSerializer(serializers.ModelSerializer):
    course_name = serializers.CharField(source='course.name', read_only=True)
    session_start = serializers.CharField(source='session.start_year', read_only=True)  # Add this for session
    class Meta:
        model = Student
        fields = ['id', 'student_name', 'email','contact','course', 'course_name', 'session', 'session_start']

class ApproveStaffSerializer(serializers.ModelSerializer):
    class Meta :
        model = LeaveReportStaff
        fields = ['status']

class ApproveStudentSerializer(serializers.ModelSerializer):
    class Meta :
        model = LeaveReportStudent
        fields = ['status']

class FeedbackReportStaffSerializer(serializers.ModelSerializer):
    staff_email = serializers.EmailField(write_only=True)  # Accept staff email
    staff_name = serializers.CharField(source='staff.staff_name', read_only=True)
    course = serializers.CharField(source='staff.course.name',read_only=True)

    class Meta:
        model = FeedbackStaff
        fields = ['id', 'staff_email', 'feedback', 'staff_name','course','reply','created_at','updated_at']

    def create(self, validated_data):
        staff_email = validated_data.pop('staff_email')
        try:
            staff = Staff.objects.get(email=staff_email)
        except Staff.DoesNotExist:
            raise serializers.ValidationError("Staff with this email does not exist.")

        feedback_report = FeedbackStaff.objects.create(staff=staff, **validated_data)
        return feedback_report

class FeedbackReportStudentSerializer(serializers.ModelSerializer):
    student_email = serializers.EmailField(write_only=True)  # Accept staff email
    student_name = serializers.CharField(source='student.student_name', read_only=True)
    course = serializers.CharField(source='student.course.name',read_only=True)
    year = serializers.CharField(source='student.session.year',read_only=True)

    class Meta:
        model = FeedbackStaff
        fields = ['id', 'student_email', 'feedback', 'student_name','course','year','reply','created_at','updated_at']

    def create(self, validated_data):
        student_email = validated_data.pop('student_email')
        try:
            student = Student.objects.get(email=student_email)
        except Student.DoesNotExist:
            raise serializers.ValidationError("Student with this email does not exist.")

        feedback_report = FeedbackStudent.objects.create(student=student, **validated_data)
        return feedback_report

class ReplyStaffSerializer(serializers.ModelSerializer):
    class Meta :
        model = FeedbackStaff
        fields = ['reply']

class ReplyStudentSerializer(serializers.ModelSerializer):
    class Meta :
        model = FeedbackStudent
        fields = ['reply']

class CourseOutcomeSerializer(serializers.ModelSerializer):
    class Meta:
        model = CourseOutcome
        fields = ['id', 'co_number', 'description']

class CoMarksSerializer(serializers.ModelSerializer):
    course_outcome = CourseOutcomeSerializer()
    co_number = serializers.CharField(source='course_outcome.co_number',read_only=True)
    class Meta:
        model = CoMarks
        fields = ['id', 'course_outcome','co_number', 'max_marks']

# class StudentResultSerializer(serializers.ModelSerializer):
#     student_name = serializers.CharField(source='student.student_name', read_only=True)
#     subject_name = serializers.CharField(source="subject.name",read_only=True)
#     pin = serializers.CharField(source='student.pin', read_only=True)
#     co_marks = serializers.SerializerMethodField()

#     class Meta:
#         model = StudentResult
#         fields = [
#             'id', 'unit', 'student', 'student_name', 'pin',
#             'subject','subject_name', 'exam', 'co_marks'
#         ]

#     def get_co_marks(self, obj):
#         # ✅ Filter via the related CourseOutcome model
#         co_marks = CoMarks.objects.filter(
#             unit=obj.unit,
#             course_outcome__subject=obj.subject  # notice this change
#         )
#         return CoMarksSerializer(co_marks, many=True).data

class StudentResultSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.student_name', read_only=True)
    subject_name = serializers.CharField(source="subject.name", read_only=True)
    pin = serializers.CharField(source='student.pin', read_only=True)
    co_marks = serializers.SerializerMethodField()

    class Meta:
        model = StudentResult
        fields = [
            'id', 'unit', 'student', 'student_name', 'pin',
            'subject', 'subject_name', 'exam', 'co_marks'
        ]

    def get_co_marks(self, obj):
        co_marks = CoMarks.objects.filter(
            unit=obj.unit,
            course_outcome__subject=obj.subject
        )
        return CoMarksSerializer(co_marks, many=True).data

    # 🔥 ADD THIS
    def create(self, validated_data):
        co_data = self.initial_data.get("coMarks", {})   # frontend sends {CO1:19, CO2:19}
        subject = validated_data["subject"]
        unit = validated_data["unit"]

        # First create the StudentResult
        result = StudentResult.objects.create(**validated_data)

        # Now create CO + CoMarks
        for co_number, marks in co_data.items():

            # Create or get the CO for this subject
            co_obj, _ = CourseOutcome.objects.get_or_create(
                co_number=co_number,
                subject=subject
            )

            # Create CoMarks for this unit
            CoMarks.objects.update_or_create(
                unit=unit,
                course_outcome=co_obj,
                defaults={"max_marks": marks}
            )

        return result

    

class UnitSerializer(serializers.ModelSerializer):

    subject = serializers.PrimaryKeyRelatedField(
        queryset=Subject.objects.all(),
        required=False
    )
    # Include subject ID or details
    # subject = serializers.PrimaryKeyRelatedField(queryset=Subject.objects.all())
    subject_name = serializers.CharField(source = 'subject.name',read_only = True)
    
    # For nested COs list and marks
    course_outcomes = serializers.SerializerMethodField()

    class Meta:
        model = Unit
        fields = ['id', 'unit_field', 'subject','subject_name', 'course_outcomes']

    def get_course_outcomes(self, obj):
        # List all CoMarks for this Unit, nested
        return [
            {
                'co_number': cm.course_outcome.co_number,
                'description': cm.course_outcome.description,
                'max_marks': cm.max_marks,
            }
            for cm in obj.co_marks.select_related('course_outcome').all()
        ]

    def create(self, validated_data):
        # Parse COs and marks from 'Cos' in initial data as sent by frontend
        cos_data = self.initial_data.get('Cos', {})
        # Remove to avoid double assignment
        subject = validated_data.pop('subject')
        unit = Unit.objects.create(subject=subject, **validated_data)

        # cos_data: { "CO1": 10, "CO2": 15 }
        for co_number, marks in cos_data.items():
            # Lookup CourseOutcome for given subject/co_number
            co_obj, _ = CourseOutcome.objects.get_or_create(
                co_number=co_number,
                subject=subject
            )
            CoMarks.objects.create(
                unit=unit,
                course_outcome=co_obj,
                max_marks=marks
            )
        return unit

    def update(self, instance, validated_data):
        cos_data = self.initial_data.get('Cos', {})
        instance.unit_field = validated_data.get('unit_field', instance.unit_field)
        instance.save()

    # Keep track of COs that should remain
        existing_cos = set()

        for co_number, marks in cos_data.items():
            co_obj, _ = CourseOutcome.objects.get_or_create(
            co_number=co_number,
            subject=instance.subject
            )
            co_marks, created = CoMarks.objects.update_or_create(
            unit=instance,
            course_outcome=co_obj,
            defaults={'max_marks': marks}
            )
            existing_cos.add(co_number)

    # Delete old CoMarks that are no longer selected
        instance.co_marks.exclude(course_outcome__co_number__in=existing_cos).delete()

        return instance




class AttendanceSerializer(serializers.ModelSerializer):
    subject_name = serializers.CharField(source = 'subject.name',read_only = True)
    course_name = serializers.CharField(source = 'course.name',read_only=True)
    session_name = serializers.CharField(source = 'session.start_year',read_only=True)
    class Meta:
        model = Attendance
        fields = ['id', 'session', 'subject', 'date', 'created_at', 'updated_at','subject_name','course_name','session_name']

class AttendanceReportSerializer(serializers.ModelSerializer):
    student_name = serializers.CharField(source='student.student_name', read_only=True)
    
    class Meta:
        model = AttendanceReport
        fields = ['id', 'student', 'attendance', 'att_status', 'created_at', 'updated_at', 'student_name']