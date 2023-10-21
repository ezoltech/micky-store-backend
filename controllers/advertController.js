const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();
const advertController = {};

advertController.create = async (req, res) => {
  const { advertName, productName, spec, TelegramLink, price, images } =
    req.body;
  if (
    !advertName ||
    !productName ||
    !spec ||
    !TelegramLink ||
    !price ||
    !images
  ) {
    return res.status(401).send({
      status: 401,
      message: "please enter all fields",
    });
  }

  try {
    const newAdvert = await prisma.advert.create({
      advertName,
      productName,
      spec,
      TelegramLink,
      price,
      images,
    });

    res.status(200).send({
      advert: newAdvert,
    });
  } catch (error) {
    res.status(500).send({
      status: 500,
      message: error.meta || "Internal error check the server log!!",
    });
  }
};

advertController.getAdvertById = async (req, res) => {
  const id = parseInt(req.param.id);

  if (isNaN(id)) {
    return res.status(401).send({
      status: 401,
      message: "Please enter all fields!",
    });
  }

  try {
    const advert = prisma.advert.update({
      where: {
        id,
      },
    });

    return res.status(200).send({
      advert,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
      message: error.meta || "Internal error check the server log!!",
    });
  }
};

advertController.searchAdverts = async (req, res) => {
  const query = req.query.q;

  if (!query) {
    return res.status(401).send({
      status: 401,
      message: "Please enter all fields!",
    });
  }

  try {
    const findAdvert = await prisma.advert.updateMany({
      where: {
        OR: [
          {
            advertName: {
              contains: query,
            },
          },

          {
            Spec: {
              contains: query,
            },
          },
        ],
      },
    });

    return res.status(200).send({
      findAdvert,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
      message: error.meta || "Internal error check the server log!!",
    });
  }
};
advertController.editAdvert = async (req, res) => {
  const { advertName, productName, spec, TelegramLink, price, images } =
    req.body;

  if (
    !advertName ||
    !productName ||
    !spec ||
    !TelegramLink ||
    !price ||
    !images
  ) {
    return res.status(401).send({
      status: 401,
      message: "please enter all fields",
    });
  }

  try {
    const updateAdvert = await prisma.advert.update({
      where: {
        id,
      },
      data: {
        advertName,
        productName,
        spec,
        TelegramLink,
        price,
        images,
      },
    });

    res.status(200).json({
      advert: updateAdvert,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).send({
      status: 500,
      message: error.meta || "Internal error check the server log!!",
    });
  }
};

advertController.deleteAdvert = async (req, res) => {
  const id = parseInt(req.param.id);

  if (isNaN(id)) {
    return res.status(401).send({
      status: 401,
      message: "Please enter all fields!",
    });
  }

  try {
    const deleteAdvert = await prisma.advert.delete({
      where: {
        id,
      },
    });
    res.status(200).send({
      deleteAdvert,
    });
  } catch (error) {
    console.log(error);
    res.status(500).send({
      status: 500,
      message: error.meta || "Internal error check the server log!!",
    });
  }
};
module.exports = advertController;
