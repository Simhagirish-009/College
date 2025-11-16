from rest_framework import status
from rest_framework.response import Response 
from rest_framework.decorators import api_view , permission_classes
from django.core.mail import send_mail
from rest_framework_simplejwt.tokens import RefreshToken
from . models import *
from . serializers import *
import random
from django.contrib.auth import get_user_model
from rest_framework.permissions import IsAuthenticated
CustomUser = get_user_model()
@api_view(['POST'])
def LoginView(request):
    serializer = LoginSerializer(data=request.data)

    if not serializer.is_valid():
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    user = serializer.validated_data['user']
    email = user.email
    
    # Generate OTP and delete recent OTP entries
    otp_value = str(random.randint(100000, 999999))
    Otp.objects.filter(user=user).delete()

    otp_instance = Otp.objects.create(user=user, otp=otp_value)
    otp_instance.save()

    # Attempt to send email with OTP
    try:
        send_mail(
            'Your OTP is Received',
            f'Your One Time Password is {otp_value}',
            'cbi.gov@gmail.com',
            [email],
            fail_silently=False
        )
    except Exception as e:
        return Response({'message': "An error occurred while sending the email: " + str(e)}, 
                        status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    # Return success message and email
    return Response({"message": "OTP has been sent to your email.", "email": email}, status=status.HTTP_200_OK)

def generate_tokens(user):
    refresh = RefreshToken.for_user(user)  

    return {
        'access': str(refresh.access_token),  
        'refresh': str(refresh),              
    }

@api_view(['POST'])
def verify_otp(request):
    otp_value = request.data.get('otp', '').strip()
    email = request.data.get('email', '').strip() 

    if not otp_value or not email:
        return Response({'error': 'OTP and email are required.'}, status=status.HTTP_400_BAD_REQUEST)

    try:
        otp_instance = Otp.objects.filter(user__email=email).order_by('-created_at').first()
        if otp_instance.user.is_superuser :
            user_type = 1
        elif otp_instance.user.is_staff and otp_instance.user.is_active :
            user_type = 2
        else :
            user_type = 3

        if not otp_instance:
            return Response({'error': 'No OTP found for this email.'}, status=status.HTTP_404_NOT_FOUND)

        if not otp_instance.is_valid():
            return Response({'error': 'OTP has expired.'}, status=status.HTTP_400_BAD_REQUEST)

        if otp_instance.otp != otp_value:
            return Response({'error': 'Invalid OTP.'}, status=status.HTTP_400_BAD_REQUEST)

        tokens = generate_tokens(otp_instance.user) 
        return Response({'access': tokens['access'], 'refresh': tokens['refresh'], 'role': user_type}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    
@api_view(['POST'])
def resend_otp(request):
    email = request.data.get('email', '').strip()

    if not email:
        return Response({'error': 'Email is required.'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Find the user by email
        user = CustomUser.objects.filter(email=email).first()

        if not user:
            return Response({'error': 'No user found with this email.'}, status=status.HTTP_404_NOT_FOUND)

        # Determine user type
        if user.is_superuser:
            user_type = 1
        elif user.is_staff and user.is_active:
            user_type = 2
        else:
            user_type = 3

        # Generate new OTP
        otp_value = str(random.randint(100000, 999999))
        
        # Remove previous OTPs for this user (optional, depending on your use case)
        Otp.objects.filter(user=user).delete()
        
        # Create and save new OTP
        otp_instance = Otp.objects.create(user=user, otp=otp_value)
        otp_instance.save()

        # Attempt to send email with new OTP
        try:
            send_mail(
                'Your OTP is Resent',
                f'Your One Time Password is {otp_value}',
                'cbi.gov@gmail.com',
                [email],
                fail_silently=False
            )
        except Exception as e:
            return Response({'error': "An error occurred while sending the email: " + str(e)}, 
                            status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        
        # Generate and return JWT tokens
        tokens = generate_tokens(user)
        return Response({
            'message': 'OTP has been resent to your email.',
            'access': tokens['access'],
            'refresh': tokens['refresh'],
            'role': user_type
        }, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

    
@api_view(['POST'])
def send_reset_code(request):
    email = request.data.get('email')
    user = CustomUser.objects.filter(email=email).first()
    
    if user:
        # Generate and save a new code
        code = str(random.randint(100000, 999999))
        VerificationCode.objects.filter(user=user).delete()  # Delete any old codes for the user
        VerificationCode.objects.create(user=user, code=code)

        # Send the code to the user's email
        send_mail(
            'Password Reset Code',
            f'Your password reset code is: {code}',
            'from@example.com',
            [email],
            fail_silently=False,
        )
        return Response({"message": "Verification code sent."}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Email not found."}, status=status.HTTP_404_NOT_FOUND)

@api_view(['POST'])
def reset_password(request):
    email = request.data.get('cleanedEmail')  
    print("The email:", email)  
    code = request.data.get('verificationCode')
    new_password = request.data.get('newPassword')

    # Check if the user exists
    try:
        user = CustomUser.objects.get(email=email)

        if user.is_superuser and user.is_staff:
            admin = Admin.objects.get(email = email)
            admin.password = new_password
            admin.save()
        elif user.is_staff : 
            staff = Staff.objects.get(email = email)
            staff.password = new_password
            staff.save()
        else : 
            student = Student.objects.get(email = email)
            student.password = new_password
            student.save()
            
    except CustomUser.DoesNotExist:
        return Response({"error": "User does not exist."}, status=status.HTTP_404_NOT_FOUND)

    # Check if the verification code is valid and not expired
    verification = VerificationCode.objects.filter(user=user, code=code).first()
    if verification and not verification.is_expired():
        user.set_password(new_password)  # Set the new password
        user.save()  # Save the user instance
        verification.delete()  # Delete the used verification code
        return Response({"message": "Password has been reset successfully."}, status=status.HTTP_200_OK)
    else:
        return Response({"error": "Invalid or expired verification code."}, status=status.HTTP_400_BAD_REQUEST)
    
