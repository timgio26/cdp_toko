
# A very simple Flask Hello World app for you to get started with...

from flask import Flask,render_template,url_for,redirect,session,request,make_response,jsonify
from flask_wtf import FlaskForm
from wtforms import StringField,SubmitField,PasswordField,TextField
from wtforms.fields.html5 import DateField
from wtforms.validators import DataRequired
from flask_migrate import Migrate
from flask_sqlalchemy import SQLAlchemy
from flask_bootstrap import Bootstrap
from sqlalchemy import desc,create_engine
from flask_restful import Resource,Api
from werkzeug.utils import secure_filename
import pandas as pd
import json,os

app = Flask(__name__)
# app.config['SECRET_KEY'] = 'you-will-never-guess'
# SQLALCHEMY_DATABASE_URI = "mysql+mysqlconnector://timgio26:bumimarinaemas@timgio26.mysql.pythonanywhere-services.com/timgio26$asdasas"
# app.config["SQLALCHEMY_DATABASE_URI"] = SQLALCHEMY_DATABASE_URI
# app.config["SQLALCHEMY_POOL_RECYCLE"] = 299
# app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
# app.config["ROW_PER_PAGE"] = 15
app.config.from_pyfile('config.py')
db = SQLAlchemy(app)
migrate = Migrate(app, db)
bootstrap = Bootstrap(app)
api=Api(app)



class usercdp(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    name=db.Column(db.String(60))
    username=db.Column(db.String(60),unique=True)
    password=db.Column(db.String(60))

class mycart(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    username=db.Column(db.String(60))
    itemid=db.Column(db.Integer)
    itemqty=db.Column(db.Integer)

class dbcust(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    custname=db.Column(db.String(60))
    custadd=db.Column(db.String(60))
    custtel=db.Column(db.String(15))
    custjoin=db.Column(db.Date)

class dbservice(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    custid=db.Column(db.Integer)
    servicedate=db.Column(db.Date)
    keluhan=db.Column(db.Text)
    tindakan=db.Column(db.Text)
    hasil=db.Column(db.Text)
    dokumentasi=db.Column(db.String(120))

class dbprod(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    # sku = db.Column(db.String(64))
    prodname = db.Column(db.String(64))
    prodprice=db.Column(db.Integer)
    prodpricedisc=db.Column(db.Integer)
    imgurl = db.Column(db.String(64))
    proddesc = db.Column(db.Text)

class dbtrialapi(db.Model):
    id=db.Column(db.Integer,primary_key=True)
    nama=db.Column(db.String(120))
    kota=db.Column(db.String(120))


class restrialapinew(Resource):
    def post(self):
        nama=request.args.get('nama')
        kota=request.args.get('kota')
        newdata=dbtrialapi(nama=nama,kota=kota)
        if len(nama)>0 and len(kota)>0:
            db.session.add(newdata)
            db.session.commit()
            return {'status':'added new api'}
    def delete(self):
        delid=request.args.get('iddel')
        deldata=dbtrialapi.query.get(delid)
        db.session.delete(deldata)
        db.session.commit()
        return {'status':'deleted'}
    def get(self):
        # df=dbtrialapi.query.all()
        engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
        df = pd.read_sql_query("SELECT * FROM dbtrialapi", con=engine)
        engine.dispose()
        df=df.to_json()
        df=json.loads(df)
        # print(df.to_dict())
        return df




# class apiall(Resource):
#     def get(self):
#         # df=dbtrialapi.query.all()
#         engine = create_engine(SQLALCHEMY_DATABASE_URI)
#         df = pd.read_sql_query("SELECT * FROM dbtrialapi", con=engine)
#         df=df.to_json()
#         df=json.loads(df)
#         # print(df.to_dict())
#         return df

# api.add_resource(restrialapi,'/api/<inpnama>')
api.add_resource(restrialapinew,'/apinew')
# api.add_resource(apiall,'/apiall')

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
    tindakan=TextField('Tindakan :',validators=[DataRequired()])
    hasil=TextField('Hasil :',validators=[DataRequired()])
    dokumentasi=StringField('dokumentasi :')
    submit=SubmitField("Tambah")

class editserviceform(serviceform):
    submit=SubmitField("Edit")

class editcustform(newcust):
    submit=SubmitField("Edit")

class delcustform(FlaskForm):
    submit=SubmitField("Hapus")


@app.route('/',methods=['GET','POST'])
def index():
    print(session.get('user', None))
    df=dbprod.query.all()
    df2=mycart.query.filter_by(username=session.get('user', None))
    return render_template('home.html',df=df,df2=df2)

@app.route('/addcustlama',methods=['GET','POST'])
def tambahcustomerlama():
    page = request.args.get('page', 1, type=int)
    form=newcust()
    formcari=searchcust()
    df=dbcust.query.order_by(desc(dbcust.custjoin)).paginate(page, app.config['ROW_PER_PAGE'], False)
    next_url = url_for('tambahcustomer', page=df.next_num) \
        if df.has_next else None
    prev_url = url_for('tambahcustomer', page=df.prev_num) \
        if df.has_prev else None
    if form.validate_on_submit():
        addcust=dbcust(custname=form.nama.data,custadd=form.alamat.data,custtel=form.tlp.data,custjoin=form.date.data)
        db.session.add(addcust)
        db.session.commit()
        return redirect(url_for('tambahcustomer'))
    if formcari.validate_on_submit():

        df=dbcust.query.filter(dbcust.custname.contains(formcari.namacari.data)).order_by(desc(dbcust.custjoin)).paginate(page, app.config['ROW_PER_PAGE'], False)
        next_url = url_for('tambahcustomer', page=df.next_num) \
            if df.has_next else None
        prev_url = url_for('tambahcustomer', page=df.prev_num) \
            if df.has_prev else None
        return render_template('addcust.html',page=1,form=form,formcari=formcari,df=df,next_url=next_url, prev_url=prev_url)
    return render_template('addcust.html',form=form,formcari=formcari,df=df,next_url=next_url, prev_url=prev_url)

@app.route('/addcust',methods=['GET','POST'])
def tambahcustomer():
    form=newcust()
    formcari=searchcust()
    df=dbcust.query.all()
    if form.validate_on_submit():
        addcust=dbcust(custname=form.nama.data,custadd=form.alamat.data,custtel=form.tlp.data,custjoin=form.date.data)
        db.session.add(addcust)
        db.session.commit()
        return redirect(url_for('tambahcustomer'))
    if formcari.validate_on_submit():
        df=dbcust.query.filter(dbcust.custname.contains(formcari.namacari.data)).all()
        return render_template('addcust2.html',form=form,formcari=formcari,df=df)
    return render_template('addcust2.html',form=form,formcari=formcari,df=df)

@app.route('/editcust<cid>',methods=['GET','POST'])
def editcust(cid):
    cust=dbcust.query.get(cid)
    form=editcustform()
    if request.method =='GET':
        form.nama.data=cust.custname
        form.alamat.data=cust.custadd
        form.tlp.data=cust.custtel
        form.date.data=cust.custjoin
    if form.validate_on_submit():
        cust.custname=form.nama.data
        cust.custadd=form.alamat.data
        cust.custtel=form.tlp.data
        cust.custjoin=form.date.data
        db.session.add(cust)
        db.session.commit()
        return redirect(url_for("tambahcustomer"))
    return render_template('editcust.html',form=form)

@app.route('/deletecust<cid>',methods=['GET','POST'])
def deletecust(cid):
    form=delcustform()
    cust=dbcust.query.get(cid)
    if form.validate_on_submit():
        service=dbservice.query.filter_by(custid=cid)
        db.session.delete(cust)
        db.session.commit()
        for i in service:
            db.session.delete(i)
            db.session.commit()
        return redirect(url_for('tambahcustomer'))
    return render_template('deletecustomer.html',cust=cust,form=form)


@app.route('/addservice<cid>',methods=['GET','POST'])
def tambahservice(cid):
    form=serviceform()
    df=dbservice.query.filter_by(custid=cid).order_by(desc(dbservice.servicedate)).all()
    cust=dbcust.query.get(cid)
    if form.validate_on_submit():
        service=dbservice(custid=cid,servicedate=form.tanggal.data,keluhan=form.keluhan.data,tindakan=form.tindakan.data,hasil=form.hasil.data,dokumentasi=form.dokumentasi.data)
        db.session.add(service)
        db.session.commit()
        return redirect(url_for('tambahservice',cid=cid))
    return render_template('addservice.html',form=form,df=df,cust=cust)

@app.route('/editservice<sid>',methods=['GET','POST'])
def editservice(sid):
    form=editserviceform()
    service=dbservice.query.get(sid)
    if request.method =='GET':
        form.tanggal.data=service.servicedate
        form.keluhan.data=service.keluhan
        form.tindakan.data=service.tindakan
        form.hasil.data=service.hasil
        form.dokumentasi.data=service.dokumentasi
    if form.validate_on_submit():
        service.servicedate=form.tanggal.data
        service.keluhan=form.keluhan.data
        service.tindakan=form.tindakan.data
        service.hasil=form.hasil.data
        service.dokumentasi=form.dokumentasi.data
        db.session.add(service)
        db.session.commit()
        return redirect(url_for("tambahservice",cid=service.custid))
    return render_template('editservice.html',form=form)

@app.route('/delservice<cid>_<sid>',methods=['GET','POST'])
def delservice(cid,sid):
    service=dbservice.query.get(sid)
    db.session.delete(service)
    db.session.commit()
    return redirect(url_for("tambahservice",cid=cid))


@app.route('/register',methods=['GET','POST'])
def daftar():
    form=newuser()
    df=usercdp.query.all()
    if form.validate_on_submit():
        adduser=usercdp(name=form.nama.data,username=form.username.data,password=form.password.data)
        db.session.add(adduser)
        db.session.commit()
        return redirect(url_for('masuk'))
    return render_template('register.html',form=form,df=df)

@app.route('/login',methods=['GET','POST'])
def masuk():
    form=loginform()
    if form.validate_on_submit():
        usercek=usercdp.query.filter_by(username=form.username.data).first()
        if usercek is None or usercek.password!=form.password.data:
            msg='username / password salah'
            return render_template('masuk.html',form=form,msg=msg)
        else:
            session['user']=form.username.data
            return redirect(url_for('index'))
    return render_template('masuk.html',form=form,msg="")

@app.route('/mnguser',methods=['GET','POST'])
def mnguser():
    df=usercdp.query.all()
    print(session.get('user', 'not set'))
    if session.get('user', 'not set')=='admin' :
        return render_template('mnguser.html',df=df)
    else:
        return redirect(url_for('index'))

@app.route('/logout',methods=['GET','POST'])
def keluar():
    session.pop('user', None)
    return redirect(url_for('index'))

@app.route('/deluser<id>',methods=['GET','POST'])
def hapususer(id):
    if session.get('user', 'not set')=='admin':
        user=usercdp.query.get(id)
        if user.username=='admin':
            return redirect(url_for('index'))
        else:
            db.session.delete(user)
            db.session.commit()
            return redirect(url_for('index'))
    else:
        return redirect(url_for('index'))

@app.route('/editpass',methods=['GET','POST'])
def editpass():
    msg=""
    form=newpassform()
    user=usercdp.query.filter_by(username=session.get('user', 'not set')).first()
    if form.validate_on_submit():
        if form.password_a.data==form.password_b.data:
            user.password=form.password_a.data
            db.session.add(user)
            db.session.commit()
            return redirect(url_for('index'))
        else:
            msg='password tidak sama'
            return render_template('editpass.html',user=user,form=form,msg=msg)
    return render_template('editpass.html',user=user,form=form,msg=msg)

@app.route('/profile',methods=['GET','POST'])
def profile():
    return render_template('profile.html')

@app.route('/data',methods=['GET','POST'])
def data():
    return render_template('data.html')

@app.route('/data<tbl>',methods=['GET','POST'])
def downloaddata(tbl):
    if session.get('user', 'not set')=='admin':
        if tbl == 'dbcust':
            fname="data_customer"
        else:
            fname="data_service"
        engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
        df = pd.read_sql_query("SELECT * FROM {}".format(tbl), con=engine)
        engine.dispose()
        resp = make_response(df.to_csv(index=False))
        resp.headers["Content-Disposition"] = "attachment; filename={}.csv".format(fname)
        resp.headers["Content-Type"] = "text/csv"
        return resp
    else:
        return redirect(url_for('index'))

@app.route('/addprod',methods=['GET','POST'])
def addprod():
    if request.method=='POST':
        f=request.files['formHero']
        filedir=os.path.join(app.config['UPLOAD_FOLDER'],secure_filename(f.filename))
        if f:
            f.save(filedir)
        newprod=dbprod(prodname=request.form['formNama'],prodprice=request.form['formHarga'],prodpricedisc=request.form['formDisc'],proddesc=request.form['editordata'],imgurl=filedir)
        db.session.add(newprod)
        db.session.commit()
        return redirect (url_for('allprod'))
    return render_template('addprod.html')

@app.route('/allprod',methods=['GET','POST'])
def allprod():
    df=dbprod.query.all()
    return render_template('allprod.html',df=df)

@app.route('/trialapi',methods=['GET','POST'])
def trialapi():
    df=dbtrialapi.query.all()
    return render_template('trialapi.html',df=df)

@app.route('/deltrialapi/<id>',methods=['GET','POST'])
def deltrialapi(id):
    itemdel=dbtrialapi.query.get(id)
    db.session.delete(itemdel)
    db.session.commit()
    return redirect(url_for('trialapi'))

@app.route('/delcartitem/<id>',methods=['POST'])
def delcartitem(id):
    if session.get('user', None):
        itemdel=mycart.query.get(id)
        db.session.delete(itemdel)
        db.session.commit()
        curuser=session.get('user', None)
        return jsonify({'curuser':curuser})
    return ("error please refresh")

@app.route('/addajax',methods=['POST'])
def addajax():
    itemdel=mycart.query.filter_by(username=request.form.get('username'),itemid=request.form.get('itemid')).first()
    if itemdel:
        # print(itemdel.id)
        item=mycart.query.get(itemdel.id)
        item.itemqty=item.itemqty+1
        db.session.add(item)
        db.session.commit()
    else:
        newdata=mycart(username=request.form.get('username'),itemid=request.form.get('itemid'),itemqty=request.form.get('itemqty'))
        db.session.add(newdata)
        db.session.commit()
    engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
    df = pd.read_sql_query("SELECT * FROM mycart WHERE mycart.username = '"+f"{request.form.get('username')}"+"'", con=engine)
    engine.dispose()
    dfjson=df.to_json(orient="table")
    return jsonify({'mycart':dfjson})

@app.route('/updateCart',methods=['GET'])
def updateCart():
    username=request.args.get('username')
    engine = create_engine(app.config['SQLALCHEMY_DATABASE_URI'])
    df = pd.read_sql_query(f"SELECT * FROM mycart WHERE mycart.username = '{username}'", con=engine)
    engine.dispose()
    dfjson=json.loads(df.to_json(orient="records"))
    print(type(dfjson))
    return jsonify({'mycart':dfjson})

@app.route('/addCartitem',methods=['POST'])
def addCartitem():
    cartitemid=request.form.get('itemid')
    cal=request.form.get('cal')
    if cal=='1':
        print('masuk plus')
        item=mycart.query.get(cartitemid)
        item.itemqty=item.itemqty+1
        db.session.add(item)
        db.session.commit()
        curuser=session.get('user', None)
        return jsonify({'curuser':curuser})
    else:
        print('masuk min')
        item=mycart.query.get(cartitemid)
        if item.itemqty==1:
            db.session.delete(item)
            db.session.commit()
            # curuser=session.get('user', None)
            # return jsonify({'curuser':curuser})
        else:
            item.itemqty=item.itemqty-1
            db.session.add(item)
            db.session.commit()
        curuser=session.get('user', None)
        return jsonify({'curuser':curuser})

if __name__ =='__main__':
    app.run(debug=True)

