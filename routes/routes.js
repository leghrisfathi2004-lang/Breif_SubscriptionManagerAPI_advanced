
const express = require('express');
const router = express.Router();

const {authUser, authAdmin} = require('../middleware/auth.js');
const {validateSub, validateUser, validateTran} = require("../middleware/validate.js");
const {ownSub, owntran} = require('../middleware/ownership.js');


const {register, login, profile, deleteUser, getAllUsers} = require('../controllers/users.controller.js');
const {addSub, deleteSub, getAllSubs, updateSub, cancelSub, filterSub} = require('../controllers/subs.controller.js');
const {addTran, deleteTran, getAllTran} = require('../controllers/tran.controller.js');


//crud user
router.post("/users/new", validateUser, register);
router.post("/users/login", login);
router.get("/users/profile", authUser, profile);

//crud subs
router.post("/users/subs", validateSub, authUser, addSub);
router.delete("/users/subs/:id", authUser, ownSub, deleteSub);
router.put("/users/subs/:id", authUser, ownSub, updateSub);
router.patch("/users/subs/:id", authUser, ownSub, cancelSub);
router.get("/users/subs", authUser, filterSub);


//crud trans
router.post("/users/subs/:id/trans", authUser, ownSub, addTran);
router.delete("/users/subs/trans/:id", authUser, owntran, deleteTran);

//crud routes
router.get("/admin/users", authAdmin, getAllUsers);
router.delete("/admin/users/:id", authAdmin, deleteUser);
router.get("/admin/subs", authAdmin, getAllSubs);
router.get("/admin/trans", authAdmin, getAllTran);

module.exports = router;