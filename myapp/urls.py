from django.urls import path
from . import views
from . import form_views
from . import admin_views
from . import staff_views

urlpatterns = [
    # Login Based Urls 
    path("debug-users/", views.debug_users,name='debug'),
    path("debug-create-user/", views.debug_create_user,name='create'),


    path('login/',form_views.LoginView,name='login'),
    path('verify_otp/',form_views.verify_otp,name='verify_otp'),
    path('resend-otp/', form_views.resend_otp, name='resend-otp'),
    path('send-reset-code/', form_views.send_reset_code, name='send_reset_code'),
    path('reset-password/',form_views.reset_password, name='reset_password'), 

    # Admin Dashboard urls
    path('count/',admin_views.count_members, name='count'),
    path('admin/', admin_views.admin_details, name='admin_details'),

    # Admin management
    path('addadmin/',admin_views.AdminCreateView.as_view(),name='addadimn'),
    path('admin/<int:pk>/',admin_views.update_admin,name='crudadmin'),

    # Course Management
    path('addcourse/',admin_views.CourseCreateView.as_view(),name='addcourse'),
    path('addcourse/<int:pk>/',admin_views.CourseRetrieveUpdateDestroyView.as_view(),name='crudcourse'),

    # Session Manageemnt
    path('addsession/',admin_views.SessionCreateView.as_view(),name='session'), 
    path('addsession/<int:pk>/',admin_views.SessionRetrieveUpdateDestroyView.as_view(),name='crudsession'),

    # Subject Management
    path('addsub/',admin_views.SubCreateView.as_view(),name='addsub'),
    path('addsub/<int:pk>/',admin_views.SubRetrieveUpdateDestroyView.as_view(),name='crudsub'),
    path('course_staff/',admin_views.get_staff_by_course, name='get_staff_by_course'),

    # Unit exam Management
    path('addunit/',admin_views.AddUnitView.as_view(),name='addunit'),
    path('addunit/<int:pk>/',admin_views.UpdateUnitView.as_view(),name='crudunit'),

    path("fetchco/", views.FetchCOView.as_view(), name="fetch_co"),
    path("stu_fetch/", views.FetchStudentView.as_view(), name="fetch_students"),

    # Staff Management
    path('addstaff/', admin_views.addstaff, name='add_staff'),
    path('staff/',admin_views.StaffCreateView.as_view(),name='staff'),
    path('staff_view/',admin_views.staff_view.as_view(),name='staff_view'),
    path('staff/<int:pk>/',admin_views.edit_delete_staff,name='crudstaff'),

    # Student Management
    path('addstudent/',admin_views.addstu,name = 'addstu'),
    path('student_view/',admin_views.student_view,name='stuview'),
    path('student_view/<int:pk>/',admin_views.edit_delete_student,name='crudstu'),

    # send email notification to staff
    path('send_email_staff/', admin_views.send_notify_staff, name='send_staff_email'),

    # send email notifications to students
    path('send_email_student/', admin_views.send_notify_student, name='send_student_email'),

    # Staff leave Request Management
    path('staff_leave_request/', admin_views.StaffLeaveReportListView.as_view(), name='staff-approve'),
    path('staff_leave_request/<int:pk>/', admin_views.LeaveReportStaffUpdateView.as_view(), name='staff-approve-update'),

    # Student leave Request Management
    path('stu_leave_request/',admin_views.StudentLeaveReportListView.as_view(),name='student-approve'),
    path('stu_leave_request/<int:pk>/', admin_views.LeaveReportStudentUpdateView.as_view(), name='student-approve-update'),

    # View All Results 
    path('all_results/',admin_views.all_results,name = 'all_results'),

    # View Attendance of the students 
    path('all_att/',admin_views.all_attendence,name='allatt'),
    path('all_attreport/',admin_views.all_attendence_report,name='all_report'),

    # Staff Feedback and Reply
    path('replystaff/',admin_views.StaffFeedBackView.as_view(), name = 'replystaff'),
    path('replystaff/<int:pk>/',admin_views.ReplyStaffView.as_view(),name='replystaff'),

    # Student Feedback and Reply
    path('replystu/',admin_views.StudentFeedBackView.as_view(), name = 'replystudent'),
    path('replystu/<int:pk>/',admin_views.ReplyStudentView.as_view(),name='replystudent'),

    # Staff Dashboard
    path('count_stu/',staff_views.count_students,name='count_stu'),
    path('staff_details/',staff_views.staff_details,name='staff_details'),
    path('staff_update/<int:pk>/',staff_views.update_staff,name='update_staff'),

    path('studentdash/',views.student_dash,name='studash'),

    path('student_details/',views.student_details,name='student_details'),
    
    path('student/<int:pk>/',views.update_student,name='update_student'),

    path('staffnotifications/<str:email>/',views.view_staff_notify,name='stafnotify'),
    path('stunotifications/<str:email>/',views.view_student_notify,name='stunotify'),

    path('staffleave/',views.leave_report_staff, name='leave_report_staff'),
    path('stuleave/',views.leave_report_student,name='leave_report_student'),

    path('staffleave/<str:staff_email>/', views.LeaveReportStaffListView.as_view(), name='staff-leave-list'),
    path('stuleave/<str:student_email>/', views.LeaveReportStudentListView.as_view(), name='student-leave-list'),

    path('staffapprove/', views.StaffLeaveReportListView.as_view(), name='staff-approve'),
    path('staffapprove/<int:pk>/', views.LeaveReportStaffUpdateView.as_view(), name='staff-approve-update'),
    path('stuapprove/',views.StudentLeaveReportListView.as_view(),name='student-approve'),
    path('stuapprove/<int:pk>/', views.LeaveReportStudentUpdateView.as_view(), name='student-approve-update'),

    # path('replystaff/',views.StaffFeedBackView.as_view(), name = 'replystaff'),
    # path('replystaff/<int:pk>/',views.ReplyStaffView.as_view(),name='replystaff'),

    path('stafffeedback/<str:staff_email>/',views.FeedbackStaffListView.as_view(),name='staffeed'),
    path('stafffeedback/',views.feedback_report_staff, name='feed_report_staff'),
    
    # path('replystu/',views.StudentFeedBackView.as_view(), name = 'replystudent'),
    # path('replystu/<int:pk>/',views.ReplyStudentView.as_view(),name='replystudent'),

    path('stufeedback/<str:student_email>/',views.FeedbackStudentListView.as_view(),name='stufeed'),
    path('stufeedback/',views.feedback_report_student, name='feed_report_student'),

    path('addunit/',views.AddUnitView.as_view(),name='addunit'),
    path('addunit/<int:pk>/',views.UpdaetUnitView.as_view(),name='crudunit'),

    path('add-student-result/', views.AddStudentResultView.as_view(), name='add_student_result'),
    path('result_stu/',views.ResultStudentListView.as_view(),name='result_student_lilst'),
    path('edit_result/<int:pk>/',views.EditResultView.as_view(),name='edit_result'),
    path('allresults/',views.EditResultView.as_view(),name='allresults'),

    # path('stafffeedback/<str:staff_email>/',views.FeedbackStaffListView.as_view(),name='staffeed'),
    # path('stafffeedback/',views.feedback_report_staff, name='feed_report_staff'),
    
    # path('stufeedback/<str:student_email>/',views.FeedbackStudentListView.as_view(),name='stufeed'),
    # path('stufeedback/',views.feedback_report_student, name='feed_report_student'),

    # path('add-student-result/', views.AddStudentResultView.as_view(), name='add_student_result'),
    
    path('view_result/',views.view_result,name = 'view_result'),

    path('takeatt/',views.take_attendance,name='takeatt'),
    path('viewatt/',views.attendence,name='view_att'),
    path('viewarr_report/',views.attendence_report,name='view_att_report'),
    path('update_attendance_report/<int:report_id>/', views.update_attendance_report, name='update_attendance_report'),

    path('viewattstu/',views.attendence_student,name='view_att_stu'),
    path('viewatt_report_stu/',views.attendence_report_student,name='view_att_report_stu'),

    # path('all_att/',views.all_attendence,name='allatt'),
    # path('all_attreport/',views.all_attendence_report,name='all_report'),
]
