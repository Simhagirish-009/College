from rest_framework import status
from rest_framework.response import Response 
from rest_framework.decorators import api_view , permission_classes
from rest_framework.views import APIView
from django.core.mail import send_mail
from .models import *
from .serializers import *
from rest_framework import generics
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
CustomUser = get_user_model()
from django.db.models import Count

# Admin dashboard views
@api_view(['GET', 'POST'])
def count_members(request):
    if request.method == 'POST':
        email = request.data.get('email')
    elif request.method == 'GET':
        email = request.query_params.get('email')

    staff_count_per_course = Staff.objects.values('course__name').annotate(staff_count=Count('id'))
        
        # Create a response dictionary with course names and staff counts
    pie_staff = {
            "courses": [item['course__name'] for item in staff_count_per_course],
            "staff_counts": [item['staff_count'] for item in staff_count_per_course]
        }
    
    stu_count_per_course = Student.objects.values('course__name').annotate(stu_count=Count('id'))
        
        # Create a response dictionary with course names and staff counts
    pie_stu = {
            "courses": [item['course__name'] for item in stu_count_per_course],
            "stu_counts": [item['stu_count'] for item in stu_count_per_course]
        }
    
    stu_count_per_session = Student.objects.values('session__start_year', 'session__end_year').annotate(stu_count=Count('id'))

# Create a response dictionary with session years and student counts
    bar_stu = {
        "sessions": [
            f"{item['session__start_year']} - {item['session__end_year']}" for item in stu_count_per_session
        ],
        "stu_counts": [item['stu_count'] for item in stu_count_per_session],
    }
    
    user = CustomUser.objects.filter(email=email).first()  # Fetch user by email

    if user:
        username = user.username  
    else:
        username = 'nothing'

    staff = Staff.objects.all().count()
    students = Student.objects.all().count()
    courses = Course.objects.all().count()
    subjects = Subject.objects.all().count()
    feedback_student = FeedbackStudent.objects.filter(reply = "No Reply").count()
    feedback_staff = FeedbackStaff.objects.filter(reply = "No Reply").count()
    leave_student = LeaveReportStudent.objects.filter(status = 'pending').count()
    leave_staff = LeaveReportStaff.objects.filter(status = 'pending').count()
    
    return Response({
        'staffs': staff,
        'students': students,
        'courses': courses,
        'subjects': subjects,
        'feedback_staff' : feedback_staff,
        'feedback_student' : feedback_student,
        'leave_staff' : leave_staff,
        'leave_student' : leave_student,
        'username': username,
        'pie_staff' : pie_staff,
        'pie_stu' : pie_stu,
        'bar_stu' : bar_stu,

    }, status=status.HTTP_200_OK)

# Admin management views
@api_view(['GET'])
def admin_details(request):
    email = request.query_params.get('email')
    user = CustomUser.objects.filter(email=email).first()
    admin = Admin.objects.filter(email=email).first()

    if user and admin:
        username = user.username
        admin_serializer = AdminSerializer(admin)  # Serialize specific admin instance
    else:
        username = None
        admin_serializer = None

    return Response({
        'details': admin_serializer.data if admin_serializer else {},
        'username': username
    }, status=status.HTTP_200_OK)

# To update the admin details 
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

# to create the admin
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

class AdminCreateView(generics.ListCreateAPIView) :
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer

class AdminRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer

# Course Management Views
class CourseCreateView(generics.ListCreateAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class CourseRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Course.objects.all()
    serializer_class = CourseSerializer

class SessionCreateView(generics.ListCreateAPIView) :
     queryset = Session.objects.all()
     serializer_class = SessionSerializer

class SessionRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
     queryset = Session.objects.all()
     serializer_class = SessionSerializer

# Subject Management Views
class SubCreateView(generics.ListCreateAPIView):
    serializer_class = SubjectSerializer
    def get_queryset(self):
        session_id = self.request.query_params.get('session', None)
        staff_email = self.request.query_params.get('email', None)
        print(f"Received session: {session_id}, email: {staff_email}")

        queryset = Subject.objects.all()

        # Apply session filter if provided
        if session_id:
            queryset = queryset.filter(session_id=session_id)

        # Apply staff email filter if provided
        if staff_email:
            try:
                # Retrieve the staff object based on email
                staff = Staff.objects.get(email=staff_email)
                queryset = queryset.filter(staff=staff)
            except Staff.DoesNotExist:
                print("No staff found with the provided email")
                return queryset.none()

        print(f"Filtered queryset: {queryset}")
        return queryset 

class SubRetrieveUpdateDestroyView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Subject.objects.all()
    serializer_class = SubjectSerializer

# to get the staff by selecting the course
@api_view(['GET'])
def get_staff_by_course(request):
    course_id = request.GET.get('course')
    if course_id:
        staff = Staff.objects.filter(course_id=course_id)
        staff_list = [{'id': s.id, 'staff_name': s.staff_name} for s in staff]
        return Response(staff_list, status=status.HTTP_200_OK)
    return Response({'message' : 'Error Occured while fetching staff'},status=status.HTTP_400_BAD_REQUEST) 

class AddUnitView(generics.ListCreateAPIView):
    serializer_class = UnitSerializer

    def get_queryset(self):
        email = self.request.query_params.get('email')
        subject = self.request.query_params.get('subject')
        if email:
            # Filter units by user's subjects (assuming Subject has a staff/email field)
            return Unit.objects.filter(subject__staff__email=email)
            # return Unit.objects.all()  # Customize as needed for staff/user
        elif subject:
            return Unit.objects.filter(subject=subject)
        return Unit.objects.all()

class UpdateUnitView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Unit.objects.all()
    serializer_class = UnitSerializer

# Staff Management Views 
class StaffCreateView(generics.ListCreateAPIView) :
     queryset = Staff.objects.all()
     serializer_class = StaffSerializer

# To add the staff members
@api_view(['POST'])
def addstaff( request):
    serializer = StaffSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Staff member added successfully!'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class staff_view (APIView):
    def get(self, request):
        users = Staff.objects.order_by('course__id').all()
        serializer = StaffSerializer(users, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    def post(self, request):
        staff_name = request.data.get('name')
        print('Staff name:', staff_name)

        # Check if staff name is provided
        if not staff_name:
            return Response({'error': 'Staff name is required'}, status=status.HTTP_400_BAD_REQUEST)

        # Retrieve staff details based on the provided name
        try:
            staff = Staff.objects.get(staff_name=staff_name)
        except Staff.DoesNotExist:
            return Response({'error': 'Staff not found'}, status=status.HTTP_404_NOT_FOUND)

        # Fetch subjects assigned to the retrieved staff member
        subjects = Subject.objects.filter(staff=staff).all()
        subject_serializer = SubjectSerializer(subjects, many=True)

        return Response(subject_serializer.data, status=status.HTTP_200_OK)

# to apply edit and delete operations on staff members
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

# Student Management Views
# to add the students
@api_view(['POST'])
def addstu(request):
    serializer = StudentSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Student added successfully!'}, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# to view the student table
@api_view(['GET'])
def student_view(request):
    students = Student.objects.order_by('course__id','session__start_year').all()
    serializer = StudentSerializer(students, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)

# to apply edit and delete operations on students
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

# To send notifications to the staff

@api_view(['POST'])
def send_notify_staff(request):
    staff_ids = request.data.get('staff_ids', [])
    email_content = request.data.get('email_content', '')

    if not staff_ids or not email_content:
        return Response(
            {'error': 'Staff IDs and email content are required.'},
            status=status.HTTP_400_BAD_REQUEST
        )
    notifications = []
    # failed_emails = []
    # channel_layer = get_channel_layer()

    for staff_id in staff_ids:
        try:
            staff = Staff.objects.get(id=staff_id)
            # Create notification for each staff
            notification = NotificationStaff.objects.create(
                staff=staff,
                message=email_content
            )
            notifications.append(notification)

            # Send email notification
            send_mail(
                subject='Notification from Admin',
                message=email_content,
                from_email='cbi.@gmail.com',
                recipient_list=[staff.email],
                fail_silently=False,
            )
            # sanitized_email = staff.email.replace('@', '-').replace('.', '_')
            # if len(sanitized_email) > 100:
            #     sanitized_email = sanitized_email[:99]
            # group_name = f"staff_notifications_{sanitized_email}"

            # # Send WebSocket notification
            # async_to_sync(channel_layer.group_send)(
            #     group_name,
            #     {
            #         "type": "send_notification",
            #         "message": email_content,
            #         "created_at": str(notification.created_at)
            #     }
            # )

            
        except Staff.DoesNotExist:
            return Response(
                {'error': f'Staff with ID {staff_id} not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        # except Exception as e:
        #     failed_emails.append(staff.email)
        
    # if failed_emails:
    #     return Response(
    #         {'success': f'Notifications sent to {len(notifications)} staff members, but failed to send emails to: {failed_emails}.'},
    #         status=status.HTTP_206_PARTIAL_CONTENT
    #     )
        
    return Response(
        {'success': f'Notifications and emails sent to {len(notifications)} staff members.'},
         status=status.HTTP_201_CREATED
    )

# To send notifications to students
@api_view(['POST'])
def send_notify_student(request):
    student_ids = request.data.get('student_ids', [])
    email_content = request.data.get('email_content', '')
    email = request.data.get('email','')



    if not student_ids:
        return Response({'error': 'No students selected.'}, status=status.HTTP_400_BAD_REQUEST)

    if not email_content:
        return Response({'error': 'Email content is required.'}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch students by their IDs
    students = Student.objects.filter(id__in=student_ids)

    if not students.exists():
        return Response({'error': 'No valid students found.'}, status=status.HTTP_404_NOT_FOUND)
    
    sender_id = CustomUser.objects.filter(email=email).first()

    if sender_id.is_superuser:
        designation = "ADMIN"
    else:
        designation = f"STAFF {sender_id.username}"

    notifications = []
    # failed_emails = []
    # channel_layer = get_channel_layer()

    for student in students:
        try:
            notification = NotificationStudent.objects.create(
                student=student,
                message=email_content,
                sender=designation
            )
            notifications.append(notification)
            send_mail(
                    subject='Notification from Admin',
                    message=email_content,
                    from_email='cbi.@gmail.com',  # Replace with settings.DEFAULT_FROM_EMAIL for production
                    recipient_list=[student.email],
                    fail_silently=False,
                )
            # sanitized_email = student.email.replace('@', '-').replace('.', '_')
            # if len(sanitized_email) > 100:
            #     sanitized_email = sanitized_email[:99]
            # group_name = f"student_notifications_{sanitized_email}"

            # # Send WebSocket notification
            # async_to_sync(channel_layer.group_send)(
            #     group_name,
            #     {
            #         "type": "send_notification",
            #         "message": email_content,
            #         "created_at": str(notification.created_at),
            #     }
            # )
        except Student.DoesNotExist:
            return Response(
                {'error': f'Student with ID {student} not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
    #     except Exception as e:
    #             # Capture any errors related to email sending
    #         failed_emails.append(student.email)

    # if failed_emails:
    #     return Response(
    #             {'success': f'Emails sent to {len(notifications)} students, but failed to send emails to: {failed_emails}.'},
    #             status=status.HTTP_206_PARTIAL_CONTENT  
    #     )
    return Response(
            {'success': f'Notifications and emails sent to {len(notifications)} students.','designation':designation},
            status=status.HTTP_201_CREATED
    )



# Staff leave Request Management
class StaffLeaveReportListView(APIView):
    def get(self, request, *args, **kwargs):
        leave_reports = LeaveReportStaff.objects.order_by('-id').all()  # Get all leave reports
        serializer = LeaveReportStaffSerializer(leave_reports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class LeaveReportStaffUpdateView(generics.RetrieveUpdateAPIView):
    queryset = LeaveReportStaff.objects.all()
    serializer_class = ApproveStaffSerializer

# Student leave Request Management
class StudentLeaveReportListView(APIView):
    def get(self, request, *args, **kwargs):
        leave_reports = LeaveReportStudent.objects.order_by('-id').all()  # Get all leave reports
        serializer = LeaveReportStudentSerializer(leave_reports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class LeaveReportStudentUpdateView(generics.RetrieveUpdateAPIView):
    queryset = LeaveReportStudent.objects.all()
    serializer_class = ApproveStudentSerializer

# View all the results of the Students
@api_view(['GET'])
def all_results(request):
    session_id = request.query_params.get('session')
    course_id = request.query_params.get('course')

    # Validate query parameters
    if not session_id or not course_id:
        return Response(
            {"error": "Both 'session' and 'course' query parameters are required."},
            status=status.HTTP_400_BAD_REQUEST
        )

    try:
        # Get subjects for the given course
        subjects = Subject.objects.filter(course_id=course_id)
        if not subjects.exists():
            return Response(
                {"error": "No subjects found for the given course."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get students for the given session and course
        students = Student.objects.filter(session_id=session_id, course_id=course_id)
        if not students.exists():
            return Response(
                {"error": "No students found for the given session and course."},
                status=status.HTTP_404_NOT_FOUND
            )

        # Get results based on subjects and students
        results = StudentResult.objects.filter(subject__in=subjects, student__in=students)
        if not results.exists():
            return Response(
                {"message": "No results found for the given session and course."},
                status=status.HTTP_200_OK
            )

        # Serialize the results
        serializer = StudentResultSerializer(results, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response(
            {"error": f"An unexpected error occurred: {str(e)}"},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# View the all students attendance
@api_view(['GET'])
def all_attendence(request):
    try:
        course = request.query_params.get('course')
        session = request.query_params.get('session')

        if not course or not session:
            return Response({"error": "Course and Session are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Filter subjects by course
        subjects = Subject.objects.filter(course=course)

        # Fetch attendance based on subjects and session
        att = Attendance.objects.filter(subject__in=subjects, session=session)
        serializer = AttendanceSerializer(att, many=True)
        
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

@api_view(['GET'])
def all_attendence_report(request):
    try:
        course = request.query_params.get('course')
        session = request.query_params.get('session')

        if not course or not session:
            return Response({"error": "Course and Session are required."}, status=status.HTTP_400_BAD_REQUEST)

        # Fetch subjects based on course
        subjects = Subject.objects.filter(course=course)

        # Fetch attendance records based on subjects and session
        attendance = Attendance.objects.filter(subject__in=subjects, session=session)

        # Fetch attendance reports based on the filtered attendance records
        att_report = AttendanceReport.objects.filter(attendance__in=attendance)
        
        serializer = AttendanceReportSerializer(att_report, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# View and Reply to Staff Feedback
class StaffFeedBackView(APIView):
    def get(self, request, *args, **kwargs):
        feedback_reports = FeedbackStaff.objects.order_by('-id').all()  # Get all leave reports
        serializer = FeedbackReportStaffSerializer(feedback_reports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ReplyStaffView(generics.RetrieveUpdateAPIView):
    queryset = FeedbackStaff.objects.order_by('-id').all()
    serializer_class = ReplyStaffSerializer

# View and reply to Student Feedback
class StudentFeedBackView(APIView):
    def get(self, request, *args, **kwargs):
        feedback_reports = FeedbackStudent.objects.order_by('-id').all()  # Get all leave reports
        serializer = FeedbackReportStudentSerializer(feedback_reports, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class ReplyStudentView(generics.RetrieveUpdateAPIView):
    queryset = FeedbackStudent.objects.order_by('-id').all()
    serializer_class = ReplyStudentSerializer