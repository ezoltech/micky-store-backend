const router = require("express").Router();
const adminController = require("../controllers/adminController");
const advertController = require("../controllers/advertController");
// admin post requests
router.post("/admins/signup", adminController.signUp);
router.post("/admins/login", adminController.logIn);

//admin get requests
router.get("/admins/id/:id", adminController.getAdminById);
router.get("/admins/Email/Email:", adminController.getAdminByEmail);
router.get("/admins/UserName/UserName:", adminController.getAdminByUserName);

//admin put requests
router.put("/admins/edit", adminController.editProfile);

//admin delete requests
router.delete("/admins/id/:id", adminController.deleteProfile);

module.exports = router;
