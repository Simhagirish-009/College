from rest_framework import status
from rest_framework.response import Response 
from rest_framework.decorators import api_view , permission_classes
from rest_framework.views import APIView
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from . models import *
from . serializers import *
from rest_framework import generics
import random
from django.conf import settings
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import get_object_or_404
CustomUser = get_user_model()

from django.contrib.auth import get_user_model
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response

User = get_user_model()

@api_view(['GET'])
@permission_classes([AllowAny]) 
def debug_users(request):
    # Add a simple security token so nobody else can call this
    token = request.GET.get("token")
    if token != "MYSECRET123":
        return Response({"error": "unauthorized"}, status=401)

    users = User.objects.all().values("id", "email", "is_active")
    return Response(list(users))

@api_view(['POST'])
@permission_classes([AllowAny])
def debug_create_user(request):
    token = request.GET.get("token")
    if token != "MYSECRET123":
        return Response({"error": "unauthorized"}, status=401)

    email = request.data.get("email")
    password = request.data.get("password")

    if not email or not password:
        return Response({"error": "email and password required"}, status=400)

    if User.objects.filter(email=email).exists():
        return Response({"error": "user already exists"})

    user = User.objects.create_user(email=email, password=password)
    return Response({"status": "user created", "email": user.email})

# <<<<<<< HEAD

# @api_view(['GET', 'POST'])
# def count_members(request):
#     if request.method == 'POST':
#         email = request.data.get('email')
#     elif request.method == 'GET':
#         email = request.query_params.get('email')
    
#     user = CustomUser.objects.filter(email=email).first()  # Fetch user by email

#     if user:
#         username = user.username  
#     else:
#         username = 'nothing'

#     staff = Staff.objects.all().count()
#     students = Student.objects.all().count()
#     courses = Course.objects.all().count()
#     subjects = Subject.objects.all().count()
#     feedback_student = FeedbackStudent.objects.filter(reply = "No Reply").count()
#     feedback_staff = FeedbackStaff.objects.filter(reply = "No Reply").count()
#     leave_student = LeaveReportStudent.objects.filter(status = 'pending').count()
#     leave_staff = LeaveReportStaff.objects.filter(status = 'pending').count()
    
#     return Response({
#         'staffs': staff,
#         'students': students,
#         'courses': courses,
#         'subjects': subjects,
#         'feedback_staff' : feedback_staff,
#         'feedback_student' : feedback_student,
#         'leave_staff' : leave_staff,
#         'leave_student' : leave_student,
#         'username': username
#     }, status=status.HTTP_200_OK)

@api_view(['GET', 'POST'])
def count_students(request):
    if request.method == 'POST':
        email = request.data.get('email')
    elif request.method == 'GET':
        email = request.query_params.get('email')
    
    username = 'nothing'
    course = None

    user = CustomUser.objects.filter(email=email).first()
    staff = Staff.objects.filter(email=email).first()

    if user and staff:
        username = user.username
        course = staff.course

    staff_count = Staff.objects.all().count()
    subject_count = Subject.objects.all().count()
    
    if course:
        student_count = Student.objects.filter(course=course).count()
        students = Student.objects.filter(course=course).all()
        staffs = Staff.objects.filter(course=course).all()
        staff_serializer = StaffSerializer(staffs , many=True)
        student_serializer = StudentSerializer(students, many=True)
        subjects = Subject.objects.filter(course=course).all()
        subject_serializer = SubjectSerializer(subjects,many=True)
    else:
        student_count = 0
        student_serializer = []

    return Response({
        'staffs': staff_count,
        'staff' : staff_serializer.data,
        'students': student_count,
        'student': student_serializer.data,
        'subject' : subject_serializer.data,
        'course': course.name if course else 'none',
        'subjects': subject_count,
        'username': username
    }, status=status.HTTP_200_OK)
# =======
from django.db.models import Count


# >>>>>>> 3188617 (Initial commit)

@api_view(['GET', 'POST'])
def student_dash(request):
    if request.method == 'POST':
        email = request.data.get('email')
    elif request.method == 'GET':
        email = request.query_params.get('email')
    
    username = 'nothing'
    course = None

    user = CustomUser.objects.filter(email=email).first()
    student = Student.objects.filter(email=email).first()

    if user and student:
        username = user.username
        course = student.course

    staff_count = Staff.objects.all().count()
    subject_count = Subject.objects.all().count()
    
    if course:
        student_count = Student.objects.filter(course=course).count()
        students = Student.objects.filter(course=course).all()
        staffs = Staff.objects.filter(course=course).all()
        staff_serializer = StaffSerializer(staffs , many=True)
        student_serializer = StudentSerializer(students, many=True)
        subjects = Subject.objects.filter(course=course,session=student.session).all()
        subject_serializer = SubjectSerializer(subjects,many=True)
    else:
        student_count = 0
        student_serializer = []

    return Response({
        'staffs': staff_count,
        'students': student_count,
        'staff' : staff_serializer.data,
        'student': student_serializer.data,
        'subject' : subject_serializer.data,
        'course': course.name if course else 'none',
        'subjects': subject_count,
        'username': username
    }, status=status.HTTP_200_OK)

# <<<<<<< HEAD
class AdminCreateView(APIView):
    def post(self, request):
        serializer = AdminSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({
                "message": "Admin created successfully.",
                "admin": serializer.data
            }, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def get(self,request) :
        admins = Admin.objects.all()
        serializer = AdminSerializer(admins , many=True)
        return Response(serializer.data,status=status.HTTP_200_OK)
    
# @api_view(['GET'])
# def admin_details(request):
#     email = request.query_params.get('email')
#     user = CustomUser.objects.filter(email=email).first()
#     admin = Admin.objects.filter(email=email).first()

#     if user and admin:
#         username = user.username
#         admin_serializer = AdminSerializer(admin)  # Serialize specific admin instance
#     else:
#         username = None
#         admin_serializer = None

#     return Response({
#         'details': admin_serializer.data if admin_serializer else {},
#         'username': username
#     }, status=status.HTTP_200_OK)

# @api_view(['GET'])
# def staff_details(request):
#     email = request.query_params.get('email')
#     user = CustomUser.objects.filter(email=email).first()
#     admin = Staff.objects.filter(email=email).first()

#     if user and admin:
#         username = user.username
#         admin_serializer = StaffSerializer(admin)  # Serialize specific admin instance
#     else:
#         username = None
#         admin_serializer = None

#     return Response({
#         'details': admin_serializer.data if admin_serializer else {},
#         'username': username
#     }, status=status.HTTP_200_OK)
# =======
# >>>>>>> 3188617 (Initial commit)

@api_view(['GET'])
def student_details(request):
    email = request.query_params.get('email')
    user = CustomUser.objects.filter(email=email).first()
    admin = Student.objects.filter(email=email).first()

    if user and admin:
        username = user.username
        admin_serializer = StudentSerializer(admin)  # Serialize specific admin instance
    else:
        username = None
        admin_serializer = None

    return Response({
        'details': admin_serializer.data if admin_serializer else {},
        'username': username
    }, status=status.HTTP_200_OK)


# # <<<<<<< HEAD
# class CourseCreateView(generics.ListCreateAPIView):
#     queryset = Course.objects.all()
#     serializer_class = CourseSerializer

# class CourseRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Course.objects.all()
#     serializer_class = CourseSerializer

# class SessionCreateView(generics.ListCreateAPIView) :
#      queryset = Session.objects.all()
#      serializer_class = SessionSerializer

# class SessionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
#      queryset = Session.objects.all()
#      serializer_class = SessionSerializer

# class SubCreateView(generics.ListCreateAPIView):
#     serializer_class = SubjectSerializer

#     def get_queryset(self):
#         session_id = self.request.query_params.get('session', None)
#         staff_email = self.request.query_params.get('email', None)
#         print(f"Received session: {session_id}, email: {staff_email}")

#         queryset = Subject.objects.all()

#         # Apply session filter if provided
#         if session_id:
#             queryset = queryset.filter(session_id=session_id)

#         # Apply staff email filter if provided
#         if staff_email:
#             try:
#                 # Retrieve the staff object based on email
#                 staff = Staff.objects.get(email=staff_email)
#                 queryset = queryset.filter(staff=staff)
#             except Staff.DoesNotExist:
#                 print("No staff found with the provided email")
#                 return queryset.none()

#         print(f"Filtered queryset: {queryset}")
#         return queryset   

# class SubRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
#     queryset = Subject.objects.all()
#     serializer_class = SubjectSerializer
#_-----------------------------------------------------------------------------------------------------------------------------
class AdminCreateView(generics.ListCreateAPIView) :
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer

class AdminRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer

@api_view(['PUT'])
def update_admin(request, pk):
    try:
        admin = Admin.objects.get(pk=pk)
    except Admin.DoesNotExist:
        return Response({"detail": "Admin not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = AdminUpdateSerializer(admin, data=request.data)
        if serializer.is_valid():
            try:
                admin_user = CustomUser.objects.get(email=admin.email)
                admin_user.username = request.data.get('username', admin_user.username)
                admin_user.email = request.data.get('email', admin_user.email)  # Update only if provided
                admin_user.save()  # Save changes to the user

                serializer.save()  # Save the updated staff instance
                return Response(serializer.data, status=status.HTTP_200_OK)
            except CustomUser.DoesNotExist:
                return Response({"detail": "Associated user not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['PUT'])
def update_staff(request, pk):
    try:
        staff = Staff.objects.get(pk=pk)
    except Staff.DoesNotExist:
        return Response({"detail": "Staff not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = StaffUpdateSerializer(staff, data=request.data)
        if serializer.is_valid():
            try:
                staff_user = CustomUser.objects.get(email=staff.email)
                staff_user.username = request.data.get('staff_name', staff_user.username)
                staff_user.email = request.data.get('email', staff_user.email)  # Update only if provided
                staff_user.save()  # Save changes to the user

                serializer.save()  # Save the updated staff instance
                return Response(serializer.data, status=status.HTTP_200_OK)
            except CustomUser.DoesNotExist:
                return Response({"detail": "Associated user not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
# =======

#_-----------------------------------------------------------------------------------------------------------------------------



    
# >>>>>>> 3188617 (Initial commit)
    
@api_view(['PUT'])
def update_student(request, pk):
    try:
        student = Student.objects.get(pk=pk)
    except Student.DoesNotExist:
        return Response({"detail": "Admin not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = StudentUpdateSerializer(student, data=request.data)
        if serializer.is_valid():
            try:
                student_user = CustomUser.objects.get(email=student.email)
                student_user.username = request.data.get('student_name', student_user.username)
                student_user.email = request.data.get('email', student_user.email)  
                student_user.save()  # Save changes to the user

                serializer.save()  # Save the updated staff instance
                return Response(serializer.data, status=status.HTTP_200_OK)
            except CustomUser.DoesNotExist:
                return Response({"detail": "Associated user not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# <<<<<<< HEAD
class StaffCreateView(generics.ListCreateAPIView) :
     queryset = Staff.objects.all()
     serializer_class = StaffSerializer

@api_view(['POST'])
def addstaff( request):
    serializer = StaffSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Staff member added successfully!'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def staff_view(request):
    users = Staff.objects.order_by('course__id').all()
    serializer = StaffSerializer(users, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

@api_view(['POST'])
def addstu(request):
    serializer = StudentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Student added successfully!'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
def student_view(request):
    students = Student.objects.order_by('course__id','session__start_year').all()
    serializer = StudentSerializer(students, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# @api_view(['POST'])
# def LoginView(request):
#     serializer = LoginSerializer(data=request.data)

#     if not serializer.is_valid():
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     user = serializer.validated_data['user']
#     email = user.email

#     # Generate OTP and delete recent OTP entries
#     otp_value = str(random.randint(100000, 999999))
#     Otp.objects.all().delete()  # Remove all previous OTPs (adjust as needed)
    
#     otp_instance = Otp.objects.create(user=user, otp=otp_value)
#     otp_instance.save()

#     # Attempt to send email with OTP
#     try:
#         send_mail(
#             'Your OTP is Received',
#             f'Your One Time Password is {otp_value}',
#             settings.DEFAULT_FROM_EMAIL,
#             [email],
#             fail_silently=False
#         )
#     except Exception as e:
#         return Response({'error': "An error occurred while sending the email: " + str(e)}, 
#                         status=status.HTTP_500_INTERNAL_SERVER_ERROR)

#     # Return success message and email
#     return Response({"message": "OTP has been sent to your email.", "email": email}, status=status.HTTP_200_OK)

# def generate_tokens(user):
#     refresh = RefreshToken.for_user(user)  

#     return {
#         'access': str(refresh.access_token),  
#         'refresh': str(refresh),              
#     }

# @api_view(['POST'])
# def verify_otp(request):
#     otp_value = request.data.get('otp', '').strip()
#     email = request.data.get('email', '').strip() 

#     if not otp_value or not email:
#         return Response({'error': 'OTP and email are required.'}, status=status.HTTP_400_BAD_REQUEST)

#     try:
#         otp_instance = Otp.objects.filter(user__email=email).order_by('-created_at').first()
#         if otp_instance.user.is_superuser :
#             user_type = 1
#         elif otp_instance.user.is_staff and otp_instance.user.is_active :
#             user_type = 2
#         else :
#             user_type = 3

#         if not otp_instance:
#             return Response({'error': 'No OTP found for this email.'}, status=status.HTTP_404_NOT_FOUND)

#         if not otp_instance.is_valid():
#             return Response({'error': 'OTP has expired.'}, status=status.HTTP_400_BAD_REQUEST)

#         if otp_instance.otp != otp_value:
#             return Response({'error': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)

#         tokens = generate_tokens(otp_instance.user) 
#         return Response({'access': tokens['access'], 'refresh': tokens['refresh'], 'role': user_type}, status=status.HTTP_200_OK)

#     except Exception as e:
#         return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
# @api_view(['POST'])
# def resend_otp(request):
#     email = request.data.get('email', '').strip()

#     if not email:
#         return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
#     try:
#         # Find the user by email
#         user = CustomUser.objects.filter(email=email).first()

#         if not user:
#             return Response({'error': 'No user found with this email.'}, status=status.HTTP_404_NOT_FOUND)

#         # Determine user type
#         if user.is_superuser:
#             user_type = 1
#         elif user.is_staff and user.is_active:
#             user_type = 2
#         else:
#             user_type = 3

#         # Generate new OTP
#         otp_value = str(random.randint(100000, 999999))
        
#         # Remove previous OTPs for this user (optional, depending on your use case)
#         Otp.objects.filter(user=user).delete()
        
#         # Create and save new OTP
#         otp_instance = Otp.objects.create(user=user, otp=otp_value)
#         otp_instance.save()

#         # Attempt to send email with new OTP
#         try:
#             send_mail(
#                 'Your OTP is Resent',
#                 f'Your One Time Password is {otp_value}',
#                 settings.DEFAULT_FROM_EMAIL,
#                 [email],
#                 fail_silently=False
#             )
#         except Exception as e:
#             return Response({'error': "An error occurred while sending the email: " + str(e)}, 
#                             status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
#         # Generate and return JWT tokens
#         tokens = generate_tokens(user)
#         return Response({
#             'message': 'OTP has been resent to your email.',
#             'access': tokens['access'],
#             'refresh': tokens['refresh'],
#             'role': user_type
#         }, status=status.HTTP_200_OK)

#     except Exception as e:
#         return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
# @api_view(['POST'])
# def send_reset_code(request):
#     email = request.data.get('email')
#     user = CustomUser.objects.filter(email=email).first()
    
#     if user:
#         # Generate and save a new code
#         code = str(random.randint(100000, 999999))
#         VerificationCode.objects.filter(user=user).delete()  # Delete any old codes for the user
#         VerificationCode.objects.create(user=user, code=code)

#         # Send the code to the user's email
#         send_mail(
#             'Password Reset Code',
#             f'Your password reset code is: {code}',
#             'from@example.com',
#             [email],
#             fail_silently=False,
#         )
#         return Response({"message": "Verification code sent."}, status=status.HTTP_200_OK)
#     else:
#         return Response({"error": "Email not found."}, status=status.HTTP_404_NOT_FOUND)

# @api_view(['POST'])
# def reset_password(request):
#     email = request.data.get('cleanedEmail')  
#     print("The email:", email)  
#     code = request.data.get('verificationCode')
#     new_password = request.data.get('newPassword')

#     # Check if the user exists
#     try:
#         user = CustomUser.objects.get(email=email)

#         if user.is_superuser and user.is_staff:
#             admin = Admin.objects.get(email = email)
#             admin.password = new_password
#             admin.save()
#         elif user.is_staff : 
#             staff = Staff.objects.get(email = email)
#             staff.password = new_password
#             staff.save()
#         else : 
#             student = Student.objects.get(email = email)
#             student.password = new_password
#             student.save()
            
#     except CustomUser.DoesNotExist:
#         return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)

#     # Check if the verification code is valid and not expired
#     verification = VerificationCode.objects.filter(user=user, code=code).first()
#     if verification and not verification.is_expired():
#         user.set_password(new_password)  # Set the new password
#         user.save()  # Save the user instance
#         verification.delete()  # Delete the used verification code
#         return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)
#     else:
#         return Response({"error": "Invalid or expired verification code."}, status=status.HTTP_400_BAD_REQUEST)
    
# Notification Management ---------------------------------------------------------------------------------------------------------------

# @api_view(['POST'])
# def send_notify_staff(request):
#     staff_ids = request.data.get('staff_ids', [])
#     email_content = request.data.get('email_content', '')

#     if not staff_ids or not email_content:
#         return Response(
#             {'error': 'Staff IDs and email content are required.'},
#                 status=status.HTTP_400_BAD_REQUEST
#             )
#     notifications = []
#     failed_emails = []
        
#     for staff_id in staff_ids:
#         try:
#             staff = Staff.objects.get(id=staff_id)
            
#             # Create notification for each staff
#             notification = NotificationStaff.objects.create(
#                 staff=staff,
#                 message=email_content
#             )
#             notifications.append(notification)

#             # Send email notification
#             send_mail(
#                     subject='Notification from Admin',  # You can customize the subject
#                     message=email_content,  # Email content
#                     from_email=settings.DEFAULT_FROM_EMAIL,  # Make sure to set this in settings.py
#                     recipient_list=[staff.email],  # Staff's email address
#                     fail_silently=False,  # Set to True to ignore errors
#                 )
#         except Staff.DoesNotExist:
#             return Response(
#                 {'error': f'Staff with ID {staff_id} not found.'},
#                 status=status.HTTP_404_NOT_FOUND
#             )
#         except Exception as e:
#             # Capture any other exceptions (e.g., email sending failures)
#             failed_emails.append(staff.email)
        
#     if failed_emails:
#         return Response(
#             {'success': f'Notifications sent to {len(notifications)} staff members, but failed to send emails to: {failed_emails}.'},
#             status=status.HTTP_206_PARTIAL_CONTENT  # Partial success response
#         )
        
#     return Response(
#         {'success': f'Notifications and emails sent to {len(notifications)} staff members.'},
#           status=status.HTTP_201_CREATED
#     )

# @api_view(['POST'])
# def send_notify_student(request):
#     student_ids = request.data.get('student_ids', [])
#     email_content = request.data.get('email_content', '')

#     if not student_ids:
#         return Response({'error': 'No students selected.'}, status=status.HTTP_400_BAD_REQUEST)

#     if not email_content:
#         return Response({'error': 'Email content is required.'}, status=status.HTTP_400_BAD_REQUEST)

#         # Fetch students by their IDs
#     students = Student.objects.filter(id__in=student_ids)

#     if not students.exists():
#         return Response({'error': 'No valid students found.'}, status=status.HTTP_404_NOT_FOUND)

#     notifications = []
#     failed_emails = []

#     for student in students:
#         try:
#             notification = NotificationStudent.objects.create(
#                 student=student,
#                 message=email_content
#             )
#             notifications.append(notification)
#             send_mail(
#                     subject='Notification from Admin',
#                     message=email_content,
#                     from_email=settings.DEFAULT_FROM_EMAIL,  # Replace with settings.DEFAULT_FROM_EMAIL for production
#                     recipient_list=[student.email],
#                     fail_silently=False,
#                 )
#         except Exception as e:
#                 # Capture any errors related to email sending
#             failed_emails.append(student.email)

#     if failed_emails:
#         return Response(
#                 {'success': f'Emails sent to {len(notifications)} students, but failed to send emails to: {failed_emails}.'},
#                 status=status.HTTP_206_PARTIAL_CONTENT  
#         )

#     return Response(
#             {'success': f'Notifications and emails sent to {len(notifications)} students.'},
#             status=status.HTTP_201_CREATED
#     )

# Notification Management ---------------------------------------------------------------------------------------------------------------
    
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_staff_notify(request, email):
    try:
        # Ensure only the authenticated staff can access their notifications
        staff = Staff.objects.get(email=email)
        if not staff:
            return Response({'error': 'Not authorized to view these notifications'}, status=status.HTTP_403_FORBIDDEN)
        
        notifications = NotificationStaff.objects.filter(staff=staff)
        serializer = NotificationStaffSerializer(notifications, many=True)
        return Response({'notifications': serializer.data}, status=status.HTTP_200_OK)
    except Staff.DoesNotExist:
        return Response({'error': 'Staff not found'}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def view_student_notify(request, email):
    try:
        student = Student.objects.get(email=email)
        notifications = NotificationStudent.objects.filter(student=student)
        serializer = NotificationStudentSerializer(notifications, many=True)
        return Response({'notifications': serializer.data}, status=status.HTTP_200_OK)
    except Student.DoesNotExist:
        return Response({'error': 'Student not found'}, status=status.HTTP_404_NOT_FOUND)

# Leave Report Management ---------------------------------------------------------------------------------------------------------------
@api_view(['POST'])
def leave_report_staff(request):
    serializer = LeaveReportStaffSerializer(data=request.data)
    if serializer.is_valid():
        leave_report = serializer.save() 
        try:
            admins = Admin.objects.all()

            subject = f"Leave Application Submitted by {leave_report.staff.staff_name}"
            message = f"""
            A new leave application has been submitted.
            Staff: {leave_report.staff.staff_name}
            From: {leave_report.fromdate}
            To: {leave_report.todate}
            Message: {leave_report.message}
            Please review the leave application in the admin panel.
            """
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [admin.email for admin in admins]

            # send_mail(subject, message, from_email, recipient_list, fail_silently=False)

            return Response({
                "success": "Leave application submitted successfully.",
                "leave_report": {
                    "staff": leave_report.staff.staff_name,
                    "fromdate": leave_report.fromdate,
                    "todate": leave_report.todate,
                    "message": leave_report.message,
                    "status": leave_report.status
                }
            }, status=status.HTTP_200_OK)

        except Admin.DoesNotExist:
            return Response({"error": "No admins found to notify."}, status=status.HTTP_404_NOT_FOUND)

    # ⛔ If serializer invalid, return errors
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
def leave_report_student(request):
    serializer = LeaveReportStudentSerializer(data=request.data)
    if serializer.is_valid():
        leave_report = serializer.save() 
        try:
            admins = Admin.objects.all()

            subject = f"Leave Application Submitted by {leave_report.student.student_name}"
            message = f"""
            A new leave application has been submitted.
            Staff: {leave_report.student.student_name}
            From: {leave_report.fromdate}
            To: {leave_report.todate}
            Message: {leave_report.message}
            Please review the leave application in the admin panel.
            """
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [admin.email for admin in admins]

            # send_mail(subject, message, from_email, recipient_list, fail_silently=False)

            return Response({
                "success": "Leave application submitted successfully.",
                "leave_report": {
                    "staff": leave_report.student.student_name,
                    "fromdate": leave_report.fromdate,
                    "todate": leave_report.todate,
                    "message": leave_report.message,
                    "status": leave_report.status
                }
            }, status=status.HTTP_200_OK)

        except Admin.DoesNotExist:
            return Response({"error": "No admins found to notify."}, status=status.HTTP_404_NOT_FOUND)

    # ⛔ If serializer invalid, return errors
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class LeaveReportStaffListView(APIView):
    def get(self, request, staff_email, *args, **kwargs):
        try:
            staff = Staff.objects.get(email=staff_email)
            leave_reports = LeaveReportStaff.objects.filter(staff=staff).order_by('-created_at')
            serializer = LeaveReportStaffSerializer(leave_reports, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Staff.DoesNotExist:
            return Response({"error": "Staff not found."}, status=status.HTTP_404_NOT_FOUND)
        
class LeaveReportStudentListView(APIView):
    def get(self, request, student_email, *args, **kwargs):
        try:
            student = Student.objects.get(email=student_email)
            leave_reports = LeaveReportStudent.objects.filter(student=student).order_by('-created_at')
            serializer = LeaveReportStudentSerializer(leave_reports, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Staff.DoesNotExist:
            return Response({"error": "Staff not found."}, status=status.HTTP_404_NOT_FOUND)

# <<<<<<< HEAD
class StaffLeaveReportListView(APIView):
    def get(self, request, *args, **kwargs):
        leave_reports = LeaveReportStaff.objects.filter(status = 'pending').all()  # Get all leave reports
        serializer = LeaveReportStaffSerializer(leave_reports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class StudentLeaveReportListView(APIView):
    def get(self, request, *args, **kwargs):
        leave_reports = LeaveReportStudent.objects.filter(status = 'pending').all()  # Get all leave reports
        serializer = LeaveReportStudentSerializer(leave_reports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

# Edit and Delete Students and Staff ---------------------------------------------------------------------------------------------------------------

@api_view(['PUT', 'DELETE'])
def edit_delete_staff(request, pk):
    try:
        staff = Staff.objects.get(pk=pk)
    except Staff.DoesNotExist:
        return Response({"detail": "Staff not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = StaffEditSerializer(staff, data=request.data)
        if serializer.is_valid():
            try:
                staff_user = CustomUser.objects.get(email=staff.email)
                staff_user.username = request.data.get('staff_name', staff_user.username)
                staff_user.email = request.data.get('email', staff_user.email)  # Update only if provided
                staff_user.save()  # Save changes to the user

                serializer.save()  # Save the updated staff instance
                return Response(serializer.data, status=status.HTTP_200_OK)
            except CustomUser.DoesNotExist:
                return Response({"detail": "Associated user not found."}, status=status.HTTP_404_NOT_FOUND)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        try:
            staff_user = CustomUser.objects.get(email=staff.email)
            staff_user.delete()  # Delete the associated user
            staff.delete()  # Delete the staff record
            return Response({"detail": "Staff and associated user deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except CustomUser.DoesNotExist:
            return Response({"detail": "Associated user not found."}, status=status.HTTP_404_NOT_FOUND)

    return Response({"detail": "Invalid request."}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT', 'DELETE'])
def edit_delete_student(request, pk):
    try:
        # Fetch the student object
        student = Student.objects.get(pk=pk)
        
    except Student.DoesNotExist:
        return Response({"detail": "Student not found."}, status=status.HTTP_404_NOT_FOUND)

    if request.method == 'PUT':
        serializer = StudentEditSerializer(student, data=request.data)
        if serializer.is_valid():
            try:
                student_user = CustomUser.objects.get(email=student.email)
                student_user.username = request.data.get('student_name', student_user.username)
                student_user.email = request.data.get('email', student_user.email)  # Update email only if changed
                student_user.save()
                serializer.save()

            except CustomUser.DoesNotExist:
                return Response({"detail": "Associated user not found."}, status=status.HTTP_404_NOT_FOUND)

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        try:
            student_user = CustomUser.objects.get(email=student.email)
            student_user.delete()
            student.delete()
            return Response({"detail": "Student and associated user deleted successfully."}, status=status.HTTP_204_NO_CONTENT)
        except CustomUser.DoesNotExist:
            return Response({"detail": "Associated user not found."}, status=status.HTTP_404_NOT_FOUND)

    return Response({"detail": "Invalid request."}, status=status.HTTP_400_BAD_REQUEST)

class LeaveReportStaffUpdateView(generics.RetrieveUpdateAPIView):
    queryset = LeaveReportStaff.objects.all()
    serializer_class = ApproveStaffSerializer

class LeaveReportStudentUpdateView(generics.RetrieveUpdateAPIView):
    queryset = LeaveReportStudent.objects.all()
    serializer_class = ApproveStudentSerializer

# Feedback Management ---------------------------------------------------------------------------------------------------------------

@api_view(['GET','POST'])
def feedback_report_staff(request):
    serializer = FeedbackReportStaffSerializer(data=request.data)
    if serializer.is_valid():
        feedback_report = serializer.save()  # Save feedback report
        try:
            # Get all admins to notify
            admins = Admin.objects.all()
            subject = f"Feedback Submitted by {feedback_report.staff.staff_name}"
            message = f"""
            A new feedback has been submitted by a staff member.
            Staff: {feedback_report.staff.staff_name}
            Feedback: {feedback_report.feedback}
            Please review the feedback in the admin panel.
            """
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [admin.email for admin in admins]

            # Send email notification to all admins
            if recipient_list:
                send_mail(subject, message, from_email, recipient_list, fail_silently=False)

            return Response({
                "success": "Feedback submitted successfully and email notifications sent to the admins.",
                "feedback_report": {
                    "staff": feedback_report.staff.staff_name,
                    "feedback": feedback_report.feedback,
                    "reply": feedback_report.reply or "No reply yet"  # Handle empty reply
                }
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FeedbackStaffListView(APIView):
    def get(self, request, staff_email, *args, **kwargs):
        try:
            staff = Staff.objects.get(email=staff_email)
            leave_reports = FeedbackStaff.objects.filter(staff=staff)
            serializer = FeedbackReportStaffSerializer(leave_reports, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Staff.DoesNotExist:
            return Response({"error": "Staff not found."}, status=status.HTTP_404_NOT_FOUND)
        
@api_view(['GET','POST'])
def feedback_report_student(request):
    serializer = FeedbackReportStudentSerializer(data=request.data)
    if serializer.is_valid():
        feedback_report = serializer.save()  # Save feedback report
        try:
            # Get all admins to notify
            admins = Admin.objects.all()
            subject = f"Feedback Submitted by {feedback_report.student.student_name}"
            message = f"""
            A new feedback has been submitted by a staff member.
            Staff: {feedback_report.student.student_name}
            Feedback: {feedback_report.feedback}
            Please review the feedback in the admin panel.
            """
            from_email = settings.DEFAULT_FROM_EMAIL
            recipient_list = [admin.email for admin in admins]

            # Send email notification to all admins
            if recipient_list:
                send_mail(subject, message, from_email, recipient_list, fail_silently=False)

            return Response({
                "success": "Feedback submitted successfully and email notifications sent to the admins.",
                "feedback_report": {
                    "staff": feedback_report.student.student_name,
                    "feedback": feedback_report.feedback,
                    "reply": feedback_report.reply or "No reply yet"  # Handle empty reply
                }
            }, status=status.HTTP_201_CREATED)
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class FeedbackStudentListView(APIView):
    def get(self, request, student_email, *args, **kwargs):
        try:
            student = Student.objects.get(email=student_email)
            leave_reports = FeedbackStudent.objects.filter(student = student)
            serializer = FeedbackReportStudentSerializer(leave_reports, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Staff.DoesNotExist:
            return Response({"error": "Staff not found."}, status=status.HTTP_404_NOT_FOUND)
        
# <<<<<<< HEAD
# class StaffFeedBackView(APIView):
#     def get(self, request, *args, **kwargs):
#         feedback_reports = FeedbackStaff.objects.all()  # Get all leave reports
#         serializer = FeedbackReportStaffSerializer(feedback_reports, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
    
# class StudentFeedBackView(APIView):
#     def get(self, request, *args, **kwargs):
#         feedback_reports = FeedbackStudent.objects.all()  # Get all leave reports
#         serializer = FeedbackReportStudentSerializer(feedback_reports, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)

# class ReplyStaffView(generics.RetrieveUpdateAPIView):
#     queryset = FeedbackStaff.objects.all()
#     serializer_class = ReplyStaffSerializer

# class ReplyStudentView(generics.RetrieveUpdateAPIView):
#     queryset = FeedbackStudent.objects.all()
#     serializer_class = ReplyStudentSerializer

# Result Management ---------------------------------------------------------------------------------------------------------------------------

class AddUnitView(generics.ListCreateAPIView):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer

class UpdaetUnitView(generics.RetrieveUpdateDestroyAPIView) :
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer
    
class FetchCOView(APIView):
    def get(self, request, *args, **kwargs):
        unit_id = request.GET.get("unit")
        if not unit_id:
            return Response({"error": "Unit ID is required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            unit = Unit.objects.get(id=unit_id)
            co_marks = CoMarks.objects.filter(unit=unit).select_related("course_outcome")
            serializer = CoMarksSerializer(co_marks, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Unit.DoesNotExist:
            return Response({"error": "Unit not found"}, status=status.HTTP_404_NOT_FOUND)
        
class FetchStudentView(APIView):
    def get(self, request, *args, **kwargs):
        email = request.GET.get("email")
        session_id = request.GET.get("session")

        if not email or not session_id:
            return Response({"error": "Email and Session are required"}, status=status.HTTP_400_BAD_REQUEST)

        try:
            staff = Staff.objects.get(email=email)
            session = Session.objects.get(id=session_id)

            # 🧩 Example logic: get students under this session
            students = Student.objects.filter(session=session,course=staff.course)
            serializer = StudentSerializer(students, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)

        except Staff.DoesNotExist:
            return Response({"error": "Staff not found"}, status=status.HTTP_404_NOT_FOUND)
        except Session.DoesNotExist:
            return Response({"error": "Session not found"}, status=status.HTTP_404_NOT_FOUND)

# Result Management ---------------------------------------------------------------------------------------------------------------------------

class AddStudentResultView(APIView):
    def get(self, request):
        results = StudentResult.objects.order_by('student__student_name').all()
        serializer = StudentResultSerializer(results, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        student = request.data.get("student")
        unit = request.data.get("unit")
        subject = request.data.get("subject")
        exam = request.data.get("exam")
        # Check if a result record for the student already exists
        if StudentResult.objects.filter(student=student , unit = unit , subject = subject,exam=exam).exists():
            return Response(
                {"error": "Result record for this student already exists."},
                status=status.HTTP_400_BAD_REQUEST
            )
        serializer = StudentResultSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
class ResultStudentListView(APIView):
    def get(self, request, *args, **kwargs):
        session = request.GET.get("session")
        subject = request.GET.get("subject")
        unit = request.GET.get("unit")

        if not (session and subject and unit):
            return Response(
                {"error": "Missing required parameters"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Get related objects safely
        try:
            session_obj = Session.objects.get(id=session)
            subject_obj = Subject.objects.get(id=subject)
            unit_obj = Unit.objects.get(id=unit)
        except (Session.DoesNotExist, Subject.DoesNotExist, Unit.DoesNotExist):
            return Response(
                {"error": "Invalid session, subject, or unit"},
                status=status.HTTP_400_BAD_REQUEST
            )

        # ✅ Get course from subject
        course = subject_obj.course

        # ✅ Get all students in that course and session
        students = Student.objects.filter(course=course, session=session_obj)
        if not students.exists():
            return Response(
                {"error": "No students found for this course and session"},
                status=status.HTTP_404_NOT_FOUND
            )

        # ✅ Fetch results for all those students
        results = StudentResult.objects.filter(
            student__in=students,
            subject=subject_obj,
            unit=unit_obj
        )

        serializer = StudentResultSerializer(results, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)


class EditResultView(generics.RetrieveUpdateAPIView):
    queryset = StudentResult.objects.all()
    serializer_class = StudentResultSerializer
    
    def get_queryset(self):
        email = self.request.query_params.get('email')
        if email:
            staff = Staff.objects.filter(email=email).first()
            if staff:
                students = Student.objects.filter(course=staff.course)
                return StudentResult.objects.filter(student__in=students)
        return StudentResult.objects.none()  

    def get(self, request, *args, **kwargs):
        queryset = self.get_queryset()
        serializer = self.get_serializer(queryset, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def put(self, request, pk):
        try:
            # Get the StudentResult by primary key
            result = StudentResult.objects.get(pk=pk)
        except StudentResult.DoesNotExist:
            return Response({"error": "Result not found"}, status=status.HTTP_404_NOT_FOUND)

        # Extract the fields you actually allow to update
        allowed_fields = {'exam', 'unit', 'subject'}
        update_data = {key: value for key, value in request.data.items() if key in allowed_fields}

        # If exam (total_marks) is given, ensure it’s numeric
        if 'exam' in update_data:
            try:
                update_data['exam'] = float(update_data['exam'])
            except ValueError:
                return Response({"error": "Invalid exam mark"}, status=status.HTTP_400_BAD_REQUEST)

        # Use partial=True so it only updates what's provided
        serializer = StudentResultSerializer(result, data=update_data, partial=True)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
@api_view(['GET'])
def view_result(request): 
    student_email = request.query_params.get('email') 
    unit = request.query_params.get('unit')
    
    student = Student.objects.get(email=student_email)
    student_result = StudentResult.objects.filter(
        student=student, 
        unit__unit_field=unit  # adjust if field is just 'id'
    ).all()

    serializer = StudentResultSerializer(student_result, many=True)
    results = serializer.data  # serialized list

    # ✅ Calculate dynamic max marks based on number of records
    record_count = len(results)
    max_marks = record_count * 40 if record_count > 0 else 0

    s_results = []
    total_exam_marks = 0

    # ✅ Sum all exam marks across records
    for res in results:
        exam_marks = res.get("exam", 0)
        total_exam_marks += exam_marks

    # ✅ Compute percentage once based on total marks and dynamic max marks
    percentage = round((total_exam_marks / max_marks) * 100, 2) if max_marks > 0 else 0.0

    # ✅ Attach same percentage for each record
    for res in results:
        s_results.append({
            **res,
            "percentage": percentage
        })

    return Response(s_results, status=status.HTTP_200_OK)

# >>>>>>> 3188617 (Initial commit)
@api_view(['POST'])
def take_attendance(request):
    session_id = request.data.get('session')
    subject_id = request.data.get('subject')
    date = request.data.get('date')
    att = request.data.get('statuses', {})

    if not (session_id and subject_id and date):
        return Response({'error': 'Session, Subject, and Date are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        session = Session.objects.get(id=session_id)
        subject = Subject.objects.get(id=subject_id)
    except (Session.DoesNotExist, Subject.DoesNotExist):
        return Response({'error': 'Invalid session or subject ID.'}, status=status.HTTP_404_NOT_FOUND)
    
    if Attendance.objects.filter(session=session, subject=subject, date=date).exists():
        return Response(
            {'error': 'Attendance already recorded for this date.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    
    attendance, created = Attendance.objects.get_or_create(
        session=session,
        subject=subject,
        date=date
    )
    for student_id, att in att.items():
        try:
            student = Student.objects.get(id=student_id)
            AttendanceReport.objects.update_or_create(
                student=student,
                attendance=attendance,
                defaults={'att_status': att}  # Use the correct field name here
            )
        except Student.DoesNotExist:
            continue

    return Response({'success': 'Attendance recorded successfully.'}, status=status.HTTP_201_CREATED)

@api_view(['GET'])
def attendence(request):
    staff_email = request.query_params.get('email')
    try:
        staff = Staff.objects.get(email=staff_email)
        subjects = Subject.objects.filter(staff=staff)
        att = Attendance.objects.filter(subject__in=subjects)
        serializer = AttendanceSerializer(att, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Staff.DoesNotExist:
        return Response({"error": "Staff with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)

@api_view(['GET'])
def attendence_report(request):
    staff_email = request.query_params.get('email')
    try:
        staff = Staff.objects.get(email=staff_email)
        subjects = Subject.objects.filter(staff=staff)
        attendance_records = Attendance.objects.filter(subject__in=subjects)
        att_report = AttendanceReport.objects.filter(attendance__in=attendance_records)
        serializer = AttendanceReportSerializer(att_report, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    except Staff.DoesNotExist:
        return Response({"error": "Staff with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)
    
# <<<<<<< HEAD
# @api_view(['GET'])
# def all_attendence(request):
#     try:
#         att = Attendance.objects.all()
#         serializer = AttendanceSerializer(att, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
#     except Staff.DoesNotExist:
#         return Response({"error": "Staff with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)

# @api_view(['GET'])
# def all_attendence_report(request):
#     try:
#         att_report = AttendanceReport.objects.all()
#         serializer = AttendanceReportSerializer(att_report, many=True)
#         return Response(serializer.data, status=status.HTTP_200_OK)
#     except Staff.DoesNotExist:
#         return Response({"error": "Staff with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)
# =======

# >>>>>>> 3188617 (Initial commit)
    
@api_view(['PUT'])
def update_attendance_report(request, report_id):
    try:
        report = AttendanceReport.objects.get(id=report_id)
        report.att_status = request.data.get('att_status', report.att_status)
        report.save()
        return Response({"message": "Attendance status updated successfully"}, status=status.HTTP_200_OK)
    except AttendanceReport.DoesNotExist:
        return Response({"error": "Attendance report not found"}, status=status.HTTP_404_NOT_FOUND)
    
@api_view(['GET'])
def attendence_student(request):
    student_email = request.query_params.get('email')
    month = request.query_params.get('month')

    try:
        student = Student.objects.get(email=student_email)
        subjects = Subject.objects.filter(course=student.course, session=student.session)

        # Filter by month if provided
        if month:
            attendance_records = Attendance.objects.filter(
                subject__in=subjects,
                date__month=month
            )
        else:
            attendance_records = Attendance.objects.filter(subject__in=subjects)

        serializer = AttendanceSerializer(attendance_records, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Student.DoesNotExist:
        return Response({"error": "Student with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)


@api_view(['GET'])
def attendence_report_student(request):
    student_email = request.query_params.get('email')
    month = request.query_params.get('month')

    try:
        student = Student.objects.get(email=student_email)
        subjects = Subject.objects.filter(course=student.course, session=student.session)

        # Get all attendance records for student's subjects
        all_attendances = Attendance.objects.filter(subject__in=subjects)

        # Filter for selected month if given
        attendances = all_attendances
        if month:
            attendances = attendances.filter(date__month=month)

        reports = AttendanceReport.objects.filter(attendance__in=attendances, student=student)

        # ✅ Monthly percentage (filtered month)
        total_classes = reports.count()
        present_count = reports.filter(att_status=True).count()
        attendance_percentage = round((present_count / total_classes) * 100, 2) if total_classes > 0 else 0.0

        # ✅ Overall (all months) attendance percentage
        all_reports = AttendanceReport.objects.filter(attendance__in=all_attendances, student=student)
        total_all_classes = all_reports.count()
        present_all = all_reports.filter(att_status=True).count()
        month_attendance_percentage = round((present_all / total_all_classes) * 100, 2) if total_all_classes > 0 else 0.0

        serializer = AttendanceReportSerializer(reports, many=True)
        return Response({
            "attendance_data": serializer.data,
            "attendance_percentage": attendance_percentage,        # This month only
            "month_attendance_percentage": month_attendance_percentage,  # Across all months
            "months_attended": all_attendances.dates('date', 'month').count(),
            "total_months": all_attendances.dates('date', 'month').count()
        }, status=status.HTTP_200_OK)

    except Student.DoesNotExist:
        return Response({"error": "Student with this email does not exist"}, status=status.HTTP_404_NOT_FOUND)
