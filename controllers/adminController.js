const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const prisma = new PrismaClient();
const adminController = {};

adminController.signUp = async (req, res) => {
  const { UserName, Email, password, profilePhoto, Bio } = req.body;

  if (!UserName || !Email || !password || !profilePhoto || !Bio) {
    return res.status(401).send({
      status: 401,
      message: "Please enter all fields!!",
    });
  }

  try {
    const n = await prisma.admin({
      where: {
        Email,
      },
    });

    //check if the user by email exists
    let isFound = n > 0 ? true : false;

    if (isFound) {
      return res.status(401).send({
        status: 401,
        message: "Admin already exists!!",
      });
    } else {
      let salt = await bcrypt.genSalt(10);
      let pwd = await bcrypt.hash(password, salt);

      const newAdmin = await prisma.admin.create({
        data: {
          UserName,
          Email,
          password: pwd,
        },
      });

      const token = jwt.sign({ newAdmin }, process.env.JWT_SECRET, {
        expiresIn: "30d",
      });

      res.status(200).json({
        token,
        admin: newAdmin,
      });
    }
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: error.meta || "Internal error check the server log!!",
    });
  }
};

adminController.logIn = async (req, res) => {
  const { Email, password } = req.body;

  if (!Email || !password) {
    return res.status(401).send({
      status: 401,
      message: "Please enter all fields!",
    });
  }
  try {
    const admin = await prisma.admin.findFirst({
      where: {
        Email,
      },
    });

    //decrypt password and compare with the one sent from body
    if (admin) {
      const isMatch = bcrypt.compareSync(password, admin.passWord);

      if (isMatch) {
        const token = jwt.sign(admin[0], process.env.JWT_SECRET, {
          expiresIn: "1d",
        });

        res.status(200).json({ token: token, admin: admin });
      } else {
        return res.status(401).send({
          status: 401,
          message: "Invalid credentials!",
        });
      }
    } else {
      return res.status(401).send({
        status: 401,
        message: "Admin doesn't exist!",
      });
    }
  } catch (error) {
    return res.status(500).send({
      status: 500,
      message: error.meta || "Internal error check the server log!!",
    });
  }
};

adminController.editProfile = async (req, res) => {
  const { UserName, Email, password, profilePhoto, Bio } = req.body;

  if (!UserName || !Email || !password || !profilePhoto || !Bio) {
    return res.status(401).send({
      status: 401,
      message: "Please enter all fields!!",
    });
  }

  try {
    const updateProfile = await prisma.admin.update({
      where: {
        id,
      },
      data: {
        UserName,
        Email,
        password: pwd,
        profilepictureurl: profilePhoto,
      },
    });

    res.status(200).json({
      token,
      admin: updateProfile,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: error.meta || "Internal error check the server log!!",
    });
  }
};

adminController.deleteProfile = async (req, res) => {
  const { UserName, Email, password, profilePhoto, Bio } = req.body;

  try {
    const deleteAdmin = await prisma.admin.delete({
      where: {
        id,
      },
      data: {
        UserName,
        Email,
        password: pwd,
        profilepictureurl: profilePhoto,
      },
    });

    res.status(200).json({
      token,
      admin: deleteAdmin,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: error.meta || "Internal error check the server log!!",
    });
  }
};

adminController.getAdminById = async (req, res) => {
  const id = parseInt(req.query.id);

  if (isNaN(id)) {
    return res.status(401).send({
      status: 401,
      message: "Please Enter all fields!",
    });
  }

  try {
    const admin = await prisma.admin.findFirst({
      where: {
        id,
      },
    });

    res.status(200).send({
      admin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
      message: error.meta || "Internal error check the server log!!",
    });
  }
};

adminController.getAdminByEmail = async (req, res) => {
  const { Email } = req.body;

  if (Email) {
    return res.status(401).send({
      status: 401,
      message: "Please Enter all fields!",
    });
  }

  try {
    const admin = await prisma.admin.findFirst({
      where: {
        Email,
      },
    });

    res.status(200).send({
      admin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
      message: error.meta || "Internal error check the server log!!",
    });
  }
};

adminController.getAdminByUserName = async (req, res) => {
  const { userName } = req.body;

  if (!userName) {
    return res.status(401).send({
      status: 401,
      message: "Please Enter all fields!",
    });
  }

  try {
    const admin = await prisma.admin.findFirst({
      where: {
        userName: userName,
      },
    });

    res.status(200).send({
      admin,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
      message: error.meta || "Internal error check the server log!!",
    });
  }
};
module.exports = adminController;
