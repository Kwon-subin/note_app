// 서버
// 패키지 연결
const express = require('express');
const session = require('express-session');
const {Firestore} = require('@google-cloud/firestore');
const {FirestoreStore} = require('@google-cloud/connect-firestore');
const { response } = require('express');

//express 사용
const app = express();

//express 사용 기본 설정
app.use(express.json());
app.use(express.urlencoded({extended: false}));


//페이지를 렌더링 하기위한 설정
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname+'/public');
app.set('view engine', 'ejs');
app.engine('html', require('ejs').renderFile);

//세션 설정
app.use(session({
    store: new FirestoreStore({
        dataset: new Firestore({
            projectId: 'noteappsubin',
            keyFilename: './servicekey.json',
        }),
        kind: 'express-sessions',
    }),
    secret: 'subin-key',
    resave: false,
    saveUninitialized: true,
}));

//데이터베이스 초기화
const db = new Firestore({
    projectid: 'noteappsubin',
    keyFilename: './servicekey.json',
}).collection('users');

//앤드포인트 (주소+경로)
//메인페이지 접속
app.get('/', async (request, response) => {
    if (!request.session.account){
        response.redirect('/login');
        return;
    }

    const {uid} = request.session.account;

    const memo_list = await db.doc(uid).collection('memos').get();

    const memos = [];

    memo_list.forEach((memo) => {
        const memo_data = memo.data();
        memo_data.id = memo.id;
        /**
         * { content: '메모2', id : '~~~~~' }
         */

        memos.push(memo_data);
    });

    response.render('main.html', {memos});
});

//작성 요청을 위한 엔드포인트
app.post('/', async (req, res) => {
    
    if (!req.session.account){
        res.redirect('/login');
        return;
    }
    
    const {uid} = req.session.account;

    const memo_data = req.body.content;
    
    await db.doc(uid).collection('memos').add({
        content: memo_data,
    });

    res.redirect('/');
});

//수정페이지 접속
app.get('/edit', async (req, res) => {

    if (!req.session.account){
        res.redirect('/login');
        return;
    }
    
    
    const id = req.query.id;  // { id: '~~~~' }

    // id가 없을 경우
    if (!id) {
        res.send('아이디를 적어야 합니다..');
        return;
    }

    const {uid} = req.session.account;
    
    const doc = await db.doc(uid).collection('memos').doc(id).get();

    // 이 문서가 없을 경우
    if (!doc.exists) {
        res.send('메모가 없습니다.');
        return;
    }

    const {content} = doc.data(); // { content: '~~~~' }

    res.render('edit.html', {content});
});


//메모 수정하기
app.post('/edit', async (req,res) => {
    
        if (!req.session.account){
            res.redirect('/login');
            return;
        }
        
    // 1. content
    const content = req.body.content;
    // 2. 주소
    const id = req.query.id;
    const {uid} = req.session.account;

    await db.doc(uid).collection('memos').doc(id).update({
        content: content,
    });
    
    res.redirect('/');
});

//메모 삭제하기

app.post('/delete', async (req,res) => {
    
    if (!req.session.account){
        res.redirect('/login');
        return;
    }
    
    const id = req.query.id;
    
    const {uid} = req.session.account;

    await db.doc(uid).collection('memos').doc(id).delete();
    
    res.redirect('/');
});


//로그인 페이지 접속
app.get('/login', (req, res) => {
    if(req.session.account){
        res.redirect('/');
        return;
    }

    res.render('login.html');
});

//로그인 요청
app.post('/login', async (req, res) => {
    if(req.session.account){
        res.redirect('/');
        return;
    }

    const {email, password} = req.body;

    const user_doc = await db.where('id','==',email).get();

    if (user_doc.empty){
        res.send('없는 아이디입니다.');
        return;
    }

    const user_data = user_doc.docs[0].data();
    const user_id = user_doc.docs[0].id;

    if (password !== user_data.password){
        res.send('비밀번호가 다릅니다.');
        return;
    }

    req.session.account = {
        email,
        uid: user_id,
    }

    res.redirect('/');
});

//로그아웃
app.post('/logout', (req,res) => {
    if (!req.session.account) {
        res.redirect('/login');
        return;
    }

    delete req.session.account;
    
    res.redirect('/login');
});

//회원가입 페이지 접속
app.get('/register', (req, res) => {
    res.render('register.html');
});

//회원가입할 때
app.post('/register', async (req, res) => {
    if(req.session.account){
        res.redirect('/');
        return;
    }

    const {email, password} = req.body;

    const user = await db.where('id', '==', email).get();

    if (!user.empty) {
        res.send('이미 가입된 이메일입니다.');
        return;
    }

    const {id} = await db.add({
        id: email,
        password: password,
    });

    //세션을 등록
    req.session.account = {
        email,
        uid: id,

    } // { account: {email: '~~~', uid: '~~~~'}}

    res.redirect('/');
});


app.all('*', async (req, res) => {
    res.status(404).send('없는 페이지입니다.');
});

//서버 열기
app.listen(8080);