from django.contrib.auth import get_user_model
from django.test import TestCase

from .serializers import LoginSerializer


class LoginSerializerTests(TestCase):
    def setUp(self):
        self.email = "student@example.com"
        self.password = "correct-horse-battery-staple"
        self.user = get_user_model().objects.create_user(
            username="student",
            email=self.email,
            password=self.password,
        )

    def test_valid_credentials_return_user_and_email_with_one_lookup(self):
        serializer = LoginSerializer(
            data={"email": self.email, "password": self.password}
        )

        # Authentication should fetch the user once, without a separate
        # existence check before checking the password.
        with self.assertNumQueries(1):
            self.assertTrue(serializer.is_valid(), serializer.errors)

        self.assertEqual(serializer.validated_data["user"], self.user)
        self.assertEqual(serializer.validated_data["email"], self.email)

    def test_wrong_password_is_rejected(self):
        serializer = LoginSerializer(
            data={"email": self.email, "password": "wrong-password"}
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("non_field_errors", serializer.errors)

    def test_unknown_email_is_rejected(self):
        serializer = LoginSerializer(
            data={"email": "missing@example.com", "password": self.password}
        )

        self.assertFalse(serializer.is_valid())
        self.assertIn("non_field_errors", serializer.errors)
