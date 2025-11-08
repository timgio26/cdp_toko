from flask_wtf import FlaskForm
from wtforms import StringField,SubmitField,PasswordField,TextAreaField
from wtforms.fields import DateField
from wtforms.validators import DataRequired

class newuser(FlaskForm):
    nama=StringField('Nama :',validators=[DataRequired()])
    username=StringField('Username :',validators=[DataRequired()])
    password=PasswordField('Password :',validators=[DataRequired()])
    submit=SubmitField("Tambah")

class loginform(FlaskForm):
    username=StringField('Username :',validators=[DataRequired()])
    password=PasswordField('Password :',validators=[DataRequired()])
    submit=SubmitField("Masuk")

class newpassform(FlaskForm):
    password_a=PasswordField('Password Baru :',validators=[DataRequired()])
    password_b=PasswordField('Ulangi Password Baru :',validators=[DataRequired()])
    submit=SubmitField("Ganti")

class newcust(FlaskForm):
    nama=StringField("Nama :",validators=[DataRequired()])
    alamat=StringField("Alamat :",validators=[DataRequired()])
    tlp=StringField("Telepon :",validators=[DataRequired()])
    date=DateField("Join Date :")
    submit=SubmitField("Tambah")

class searchcust(FlaskForm):
    namacari=StringField("Nama :")
    submit=SubmitField("Cari")

class serviceform(FlaskForm):
    tanggal=DateField('Tanggal Service :',validators=[DataRequired()])
    keluhan=StringField('Keluhan :',validators=[DataRequired()])
    tindakan=TextAreaField('Tindakan :',validators=[DataRequired()])
    hasil=TextAreaField('Hasil :',validators=[DataRequired()])
    dokumentasi=StringField('dokumentasi :')
    submit=SubmitField("Tambah")

class editserviceform(serviceform):
    submit=SubmitField("Edit")

class editcustform(newcust):
    submit=SubmitField("Edit")

class delcustform(FlaskForm):
    submit=SubmitField("Hapus")