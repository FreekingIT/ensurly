import express from 'express';
import { createServer } from 'http';
import { privateKey } from '../../config/privateKeys.js';
import path from "path";
import session from 'express-session';
import cookieParser from 'cookie-parser';

const PORT = privateKey.PORT || 3000;


const appLoader = async (app, router) => new Promise(resolve => {
    const server = createServer(app);
    app.use(express.json());
    app.use(cookieParser('secret'));
    app.use(session({
        secret:privateKey.SessionKey,
        resave:false,
        saveUninitialized:false,
    }));
    const __dirname = path.resolve(path.dirname(""));
    app.use(express.static(__dirname + "/public"));
    app.use("/public", express.static("public"));
    app.use(express.static(path.join(__dirname, "views")));
    app.use(express.urlencoded({ extended: true }));
    app.set("view engine", "ejs");
    app.use('/v1/', router);
    // app.get('*',(req,res)=>{
    //     if(req.session.currentPath){
    //      res.redirect(req.session.currentPath)
    //     }else{
    //     res.redirect('/v1/admin/homepage')
    //     }
    // })
    app.get('*',(req,res)=>{
        if(req.session.accessToken){
         res.redirect('/v1/admin/dashboard')
        }else{
        res.redirect('/v1/admin/homepage')
        }
    })
    server.listen(PORT, () => {
        console.log(`App is running on port: ${PORT}`);
    });
});

export { appLoader };
