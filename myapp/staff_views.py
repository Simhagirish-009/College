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

# Staff Dasboard View
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

# Staff Update management
@api_view(['GET'])
def staff_details(request):
    email = request.query_params.get('email')
    user = CustomUser.objects.filter(email=email).first()
    admin = Staff.objects.filter(email=email).first()

    if user and admin:
        username = user.username
        admin_serializer = StaffSerializer(admin)  # Serialize specific admin instance
    else:
        username = None
        admin_serializer = None

    return Response({
        'details': admin_serializer.data if admin_serializer else {},
        'username': username
    }, status=status.HTTP_200_OK)

# UPdate the Staff Details
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
