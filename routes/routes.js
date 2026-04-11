
const express = require('express');
const router = express.Router();


const {auth, authAdmine} = require('../middleware/auth.js');

const {register, login, getUser, deleteUser, getAllUsers} = require('../controllers/users.controller.js');

const {addSub, deleteSub, getAllSubs, getUserSubs, updateSub, filterSubs, addTran} = require('../controllers/subs.controller.js');

const {validateSub, validateUser, validateTran} = require("../middleware/validate.js");

const checkSub = require('../middleware/owner.js');

//crud users
router.post("/users/new", validateUser, register);
router.post("/users/login", validateUser, login);
router.get("/users/profile", auth, getUser);
router.delete("/users/delete", auth, deleteUser);


//crud subs
router.post("/users/subs", validateSub, auth, addSub);
router.get("/users/subs", auth, getUserSubs);
router.post("/users/subs/update", auth, checkSub, updateSub);
router.delete("/users/subs/", auth, checkSub, deleteSub);
router.get("/users/subs/filter", auth, filterSubs); 
//only for email, id, name, price

//crud trans
router.post("/users/subs/tran", validateTran, auth, addTran);

//crud by admin
router.get("/admin/users", authAdmine, getAllUsers);
router.delete("/admin/users", authAdmine, deleteUser);
router.get("/admin/subs", authAdmine, getAllSubs);

module.exports = router;