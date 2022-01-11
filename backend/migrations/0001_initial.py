# Generated by Django 4.0 on 2022-01-11 14:51

import django.core.validators
from django.db import migrations, models
import django.db.models.deletion
import uuid


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='DoctorDetails',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('doctor_name', models.TextField()),
                ('doctor_email', models.TextField()),
                ('doctor_password', models.CharField(max_length=10, validators=[django.core.validators.MinLengthValidator(5)])),
            ],
        ),
        migrations.CreateModel(
            name='PatientDetails',
            fields=[
                ('id', models.UUIDField(default=uuid.uuid4, primary_key=True, serialize=False)),
                ('name', models.CharField(max_length=30)),
                ('email_id', models.EmailField(max_length=254, unique=True)),
                ('gender', models.CharField(choices=[('M', 'Male'), ('F', 'Female'), ('T', 'Trans')], default='M', max_length=1)),
                ('address', models.CharField(max_length=255)),
                ('dob', models.DateTimeField()),
                ('phone_number', models.CharField(max_length=10)),
                ('Doctor', models.ForeignKey(on_delete=django.db.models.deletion.PROTECT, to='backend.doctordetails')),
            ],
        ),
    ]