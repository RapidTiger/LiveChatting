const mysql = require('mysql');
const dbconfig = require('../mysql/database');
const connection = mysql.createConnection(dbconfig);
const multer = require('multer');
const storage = multer.diskStorage({
    destination: function (req, file, cd) {
        cd(null, 'public/images/user/')
    },
    filename: function (req, file, cd) {
        cd(null, req.session.userid+".png");
    }
})
const upload = multer({storage: storage});

module.exports = (app, fs) => {

    app.get('/joinPage', (req, res) => {
        res.render('joinPage');
    });

    app.get('/joinidCheck', (req, res) => {
        const {id} = req.query;
        const sql = `SELECT id FROM member WHERE id = '${id}'`;
        connection.query(sql, (error, result) => {
            console.log(result);
            res.json(result);
        })
    });

    app.post('/joinProgram', (req, res) => {
        const {id, pw, name} = req.body;
        const sql = `insert into member values('${id}','${pw}','${name}')`;
        connection.query(sql, (error, result) => {
            if (error) res.redirect('/joinPage');
            else res.redirect('/index');
        });
    });

    app.get('/index', (req, res) => {
        res.render('loginPage');
    });

    app.post('/loginProgram', (req, res) => {
        const {id, pw} = req.body
        const sql = `select * from member where id = '${id}' and pw = '${pw}'`;
        connection.query(sql, (error, result) => {
            if (error) throw error;
            if (result.length > 0) {
                sess = req.session;
                sess.userid = result[0].id;
                sess.username = result[0].name;
                res.redirect('/friendList');
            } else {
                res.redirect('/index');
            }
        });
    });

    app.get('/myPage', (req, res) => {
        sess = req.session;
        res.render('myPage');
    });

    app.post('/myPageUpdate', upload.single('img'), (req, res) => {
        upload;
        res.redirect('/myPage');
    })

    app.get('/logout', (req, res) => {
        sess = req.session;
        if (sess.userid) {
            req.session.destroy((err) => {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/index');
                }
            })
        } else {
            res.redirect('/index');
        }
    });
};