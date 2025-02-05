var db = require('../controllers/db.js').db;

module.exports = async function visitCount(req, res, next) {
    //console.log(req.get('user-agent'));
    //console.log(req.header('referrer'));
    //console.log(req.query);
    //console.log(req.path);
    
    var dbget = await db`
        select
            session
        from stats
        where session = ${req.session.id}
    `
  
//console.log(JSON.stringify(dbget.length));

//it still increments by 1 if i restart the server idk why
//prob cause it gives a new cookie
//i prob need to use a session store or ehatever the docs said but im too lazy
//the cookie expires in an hour anyway it doesnt matter

    var visited = true;

    if (dbget.length != 0) {
        var visited = true;
    } else {
        var visited = false;
    }

    //console.log(visited);
    
    if (!visited) {

        var data = {
            session: req.session.id ?? null,
            path: req.path ?? null,
            useragent: req.get('user-agent') ?? null,
            referrer: req.header('referrer') ?? null,
            params: JSON.stringify(req.query) ?? null,
        }

        await db `
        insert into stats ${
            db(data, 'session', 'path', 'useragent', 'referrer', 'params')
        }
        `
        //console.log('first view');
    } else {
      //console.log("not first view")
    }

    //console.log("AAAAAAA" + JSON.stringify(req.query) + req.session.id + req.session.views);
    
    next();
};