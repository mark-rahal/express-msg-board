const db = require('./../db');

exports.getThreadView = function (req, res) {
    console.log('finding thread with id ' + req.params.id + ' in DB...');
    let sqlThread = "SELECT * FROM Thread WHERE ID = ?";

    db.query(sqlThread, req.params.id, function (err, result) {
        if (err)
            console.log(err);
        else {
            let resultThread = result[0];
            let sqlReplies = "SELECT * FROM Reply WHERE ParentPost = ?";
            db.query(sqlReplies, req.params.id, function(err, result) {
                if (err)
                    console.log(err);
                else {
                    let resultReplies = result;
                    res.render('thread', {thread: resultThread, replies: resultReplies});
                }
            });
        }
    });
};

exports.getThreadCreate = function (req, res) {
    res.render('create');
};

exports.validateThreadBody = function (req, res, next) {
    if (req.body.title === '' || req.body.content === '') {
        res.status(422).render('error', {error: new Error('Title and Content are required fields.')});
    }
    else {
        next();
    }
};

exports.postThreadCreate = function (req, res) {
    let sql = "INSERT INTO Thread (ID, Title, Content) VALUES (NULL, ?, ?)";
    let params = [req.body.title, req.body.content];
    db.query(sql, params, function (err) {
        if (err) {
            console.log(err);
        } else {
            res.redirect('/');
        }
    });
};

exports.deleteThread = function (req, res) {
    //delete all replies to the post first
    let sqlReplies = "DELETE FROM Reply WHERE ParentPost = ?";
    db.query(sqlReplies, req.params.id, function(err) {
        if (err) {
            console.log(err);
        }
        else {
            let sqlThread = "DELETE FROM Thread WHERE ID = ?";
            db.query(sqlThread, req.params.id, function (err) {
                if (err) {
                    console.log(err);
                } else {
                    res.redirect('/');
                }
            });
        }
    });
};

exports.getThreadEdit = function (req, res) {
    console.log('finding thread with id ' + req.params.id + ' in DB...');
    let sql = "SELECT * FROM Thread WHERE ID = ?";
    db.query(sql, req.params.id, function (err, result) {
        if (err)
            console.log(err);
        else {
            res.render('edit', {thread: result[0]});
        }
    });
};

exports.patchThreadEdit = function (req, res) {
    let sql = "UPDATE Thread SET Title = ?, Content = ? WHERE ID = ?";
    let params = [req.body.title, req.body.content, req.params.id];
    db.query(sql, params, function (err) {
        if (err)
            console.log(err);
        else {
            res.redirect('/');
        }
    });
};

exports.getThreadCreateReply = function (req, res) {
    console.log(req.params.id);
    res.render('createreply', {id: req.params.id});
};

exports.postThreadCreateReply = function (req, res) {
    console.log(req.params.id);
    let sql = "INSERT INTO Reply (id, Content, ParentPost) VALUES (NULL, ?, ?)";
    let params = [req.body.content, req.params.id];
    db.query(sql, params, function (err, result) {
        if (err)
            console.log(err);
        else {
            res.redirect('/thread/view/' + req.params.id);
        }
    });
};