const mysql = require('mysql');
const dbconfig = require('../mysql/database');
const connection = mysql.createConnection(dbconfig);
const multer = require('multer');
let number;
const storage = multer.diskStorage({
    destination: function (req, file, cd) {
        cd(null, 'public/images/room/')
    },
    filename: function (req, file, cd) {
        cd(null, number+".png");
    }
})
let upload = multer({storage: storage});

module.exports = (app, fs) => {

    app.get('/chatList', (req, res) => {
        sess = req.session;
        const id = req.session.userid;
        const sql = `SELECT room, room_name, m.type msgtype, message ,DATE_FORMAT(m.BOARD_YMD, '%p %l:%i') date, l.type roomtype, l.name friend FROM (SELECT * FROM messages WHERE num in (SELECT MAX(num) FROM messages GROUP BY room)) m, (SELECT * FROM room_list WHERE id = '${id}') l WHERE m.room = l.num AND m.BOARD_YMD >= l.BOARD_YMD ORDER BY m.num DESC`
        connection.query(sql, (error, result) => {
            if (error) throw error;
            console.log(result);
            res.render('chatList',{'list' : result});
        });
    });

    app.get('/roomList', (req, res) => {
        const {userid} = req.session;
        const sql = `SELECT * FROM room_list WHERE id = '${userid}'`;
        connection.query(sql, (error, result) => {
            if (error) throw error;
            res.json(result);
        });
    });

    app.get('/roomMake', (req, res) => {
        res.render('roomMake');
    });

    app.post('/roomMakeProgram',(req,res) => {
        const {userid,username} = req.session;
        const {name,pw} = req.body;
        let sql = `insert into rooms (name,type,owner,pw) value('${name}','group','${userid}','${pw}')`;
        let number = 0;
        connection.query(sql, (error, result) => {
            number = result.insertId;
            sql = `INSERT INTO room_list VALUES(${number},'${userid}','${username}','${name}','group',DEFAULT)`;
            console.log(sql);
            connection.query(sql, (error, result) => {
                sql = `INSERT INTO messages (room,id,name,type,message,BOARD_YMD) VALUE(${number},'sys','sys','sys','${userid}님이 방을 생성하였습니다.',DEFAULT)`;
                connection.query(sql, (error, result) => {
                    if (error) res.redirect('/roomMake');
                    else res.redirect(`chatRoom?num=${number}`);
                });
            });
        });
    });

    app.get('/roomSearch', (req, res) => {
        res.render('roomSearch');
    });

    app.get('/roomSearchProgram', (req, res) => {
        const {name} = req.query;
        const sql = `SELECT * FROM rooms WHERE name like '%${name}%' AND type = 'group'`;
        connection.query(sql, (error, result) => {
            if (error) throw error;
            res.json(result)
        });
    });

    app.get('/roomJoinProgram', (req, res) => {
        const {userid, username} = req.session;
        const {num,name} = req.query;
        let sql = `INSERT INTO room_list VALUES(${num},'${userid}','${username}','${name}','group',DEFAULT)`;
        connection.query(sql, (error, result) => {
            if (error) console.log('already');
            res.redirect(`/chatRoom?num=${num}`);
        });
    });

    app.get('/chatRoom', (req, res) => {
        sess = req.session;
        const {userid} = req.session;
        const {num} = req.query;
        let sql = `SELECT * FROM room_list WHERE id = '${userid}' AND num = ${num}`;
        connection.query(sql, (error, result) => {
            if (result.length == 0) res.redirect('/');
            else {
                sql = `SELECT num, room, id, name, type,message, DATE_FORMAT(BOARD_YMD, '%p %l:%m') date FROM messages WHERE room = ${num} AND BOARD_YMD >= (SELECT BOARD_YMD FROM room_list where id = '${userid}' AND num = ${num})`;
                connection.query(sql, (error, list) => {
                    sql = `SELECT * FROM (SELECT l.id id, l.name name, room_name, owner, r.type FROM room_list l, rooms r WHERE l.num = r.num AND l.num = ${num}) l left JOIN (select friend, num from friend where id = '${userid}') f on l.id = f.friend`;
                    connection.query(sql, (error, member) => {
                        if (error) throw error;
                        console.log(member);
                        res.render('chatRoom', {'list': list, 'num': num, 'member': member});
                    });
                });
            }
        });
    });

    app.get('/roomDetachProgram', (req, res) => {
        const {userid,username} = req.session;
        const {num} = req.query;
        let sql = `DELETE FROM room_list WHERE num = ${num} AND id = '${userid}'`;
        connection.query(sql, (error, list) => {
            if (error) throw error;
            res.redirect('chatList');
        });
    });

    app.get('/kickOutProgram', (req, res) => {
        const {num, id} = req.query;
        let sql = `DELETE FROM room_list WHERE num = ${num} AND id = '${id}'`;
        connection.query(sql, (error, list) => {
            if (error) throw error;
            res.redirect(`chatRoom?num=${num}`);
        });
    });

    app.get('/handOverProgram', (req, res) => {
        const {num, id} = req.query;
        let sql = `UPDATE rooms SET owner = '${id}' WHERE num = ${num}`;
        connection.query(sql, (error, list) => {
            if (error) throw error;
            res.redirect(`chatRoom?num=${num}`);
        });
    });

    app.get('/roomRevise',(req,res) => {
        const {num} = req.query;
        number = num;
        res.render('roomRevise', {num:num});
    })

    app.post('/pwRevise',(req,res) => {
        const {num, pw} = req.body;
        const {userid} = req.session;
        let sql = `SELECT * FROM rooms WHERE owner = '${userid}' AND num = ${num}`;
        connection.query(sql, (error, check) => {
            if (check.length == 1){
                sql = `UPDATE rooms SET pw = '${pw}' WHERE num = ${num}`;
                connection.query(sql, (error, revies) => {
                });
            }
        })
        res.redirect(`roomRevise?num=${num}`);
    })

    app.post('/imgRevise',upload.single('img'),(req,res) => {
        const {num} = req.body;
        res.redirect(`roomRevise?num=${num}`);
    })
}