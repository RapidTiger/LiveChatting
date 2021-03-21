const mysql = require('mysql');
const dbconfig = require('../mysql/database');
const connection = mysql.createConnection(dbconfig);

module.exports = (app, fs) => {
    app.get('/friendList', (req, res) => {
        const id = req.session.userid;
        const sql = `SELECT * FROM friend WHERE id = '${id}'`;
        connection.query(sql, (error, result) => {
            if (error) throw error;
            res.render('friendList',{'list' : result});
        });
    });

    app.get('/friendSearch', (req, res) => {
        res.render('friendSearch');
    });

    app.get('/friendSearchProgram', (req, res) => {
        const {id} = req.query;
        const sql = `SELECT * FROM member WHERE id like '${id}'`;
        connection.query(sql, (error, result) => {
            if (error) throw error;
            res.json(result)
        });
    });

    app.get('/friendRequest', (req, res) => {
        const id = req.session.userid;
        const sql = `SELECT * FROM friend_request WHERE receive = '${id}'`;
        connection.query(sql, (error, result) => {
            if (error) throw error;
            console.log(result);
            res.render('friendRequest',{'list' : result});
        });
    });

    app.get('/friendRequestProgram', (req, res) => {
        const {userid, username} = req.session;
        const {friend, name} = req.query;
        const sql = `INSERT INTO friend_request VALUES('${userid}','${friend}','${username}','${name}')`;
        connection.query(sql, (error, result) => {
            if (error) res.redirect('friendSearch');
            else res.redirect('/friendList');
        });
    });

    app.get('/friendInsertProgram', (req, res) => {
        const {userid, username} = req.session;
        const {friend, name} = req.query;
        const sql1 = `insert into rooms (name,type,owner) value('friend','1:1',null)`;
        connection.query(sql1, (error, result) => {
            if (error) throw error;
            else{
                const num = result.insertId;
                const sql2 = `INSERT INTO friend VALUES('${friend}','${userid}','${username}','${num}')`;
                connection.query(sql2, (error, result) => {
                    if (error) throw error;
                });
                const sql3 = `INSERT INTO friend VALUES('${userid}','${friend}','${name}','${num}')`;
                connection.query(sql3, (error, result) => {
                    if (error) throw error;
                });
                const sql4 = `INSERT INTO room_list VALUES(${num},'${userid}','${friend}','${name}','1:1',DEFAULT)`;
                connection.query(sql4, (error, result) => {
                    if (error) throw error;
                });
                const sql5 = `INSERT INTO room_list VALUES(${num},'${friend}','${userid}','${username}','1:1',DEFAULT)`;
                connection.query(sql5, (error, result) => {
                    if (error) throw error;
                });
                const sql6 = `DELETE FROM friend_request WHERE (send = '${userid}' AND receive = '${friend}') OR (send = '${friend}' AND receive = '${userid}')`
                connection.query(sql6, (error, result) => {
                    if (error) throw error;
                    res.json(result)
                });
            }
        });
    });
}