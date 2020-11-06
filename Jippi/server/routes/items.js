const itemsRouter = require("express").Router();
const db = require("../../database/models");
const multer = require("multer");
const { Op } = require("sequelize");

var cloudinary = require("cloudinary").v2;

const newItem = db.items;

cloudinary.config({
  cloud_name: "jipi",
  api_key: "895721462325433",
  api_secret: "jwt587tJi2fPSuNYmcgq-w4svHU",
});

const up = multer({
  dest: "upload",
});

itemsRouter.put("/update", up.single("itemImage"), (req, res) => {
  console.log("req", req.body);

  if (!!req.body.itemImage) {
    const item = {
      itemName: req.body.itemName,
      itemPrice: req.body.itemPrice,
      itemDescription: req.body.itemDescription,
      itemCompany: req.body.companyID,
      itemCategory: req.body.selectedCategory,
      itemKind: req.body.selectedKind,
    };
    newItem
      .update(item, {
        where: {
          id: req.body.id,
        },
      })
      .then(() => {
        res.send({
          status: 200,
        });
      });
  } else {
    const itelmImg = req.file.path;
    cloudinary.uploader
      .upload(itelmImg, (error, result) => {
        error && console.log("cloudinary [error] ==> ", error);
        const item = {
          itemName: req.body.itemName,
          itemPrice: req.body.itemPrice,
          itemDescription: req.body.itemDescription,
          itemImage: result.url,
          itemCompany: req.body.companyID,
          itemCategory: req.body.selectedCategory,
          itemKind: req.body.selectedKind,
        };
        console.log("im the item to update", item);
        //update the item with item id down bellow!!!!
        newItem.update(item, {
          where: {
            id: req.body.id,
          },
        });
      })
      .then(() => {
        res.send({
          status: 200,
        });
      });
  }
});

// posting an Item
itemsRouter.post("/add", up.single("itemImage"), (req, res) => {
  var img = req.file.path;
  cloudinary.uploader
    .upload(img, (error, result) => {
      error && console.log("cloudinary [error] ==> ", error);
    })
    .then((result) => {
      console.log("result9898989*", result);
      const item = {
        itemName: req.body.itemName,
        itemPrice: req.body.itemPrice,
        itemDescription: req.body.itemDescription,
        itemImage: result.url,
        itemRating: req.body.itemRating,
        itemCompany: req.body.companyID,
        itemCategory: req.body.selectedCategory,
        itemKind: req.body.selectedKind,
      };
      newItem
        .create(item)
        .then((theItem) => {
          console.log("theItem=========>", theItem);
          res.send(theItem);
        })
        .catch((err) => {
          res.send(err);
        });
    });
});
// to get a certain item by it's id
itemsRouter.post("/get/:id", (req, res) => {
  // console.log("res", req.body);
  // console.log("req.params **", req.params);
  newItem
    .findOne({
      where: {
        id: req.params.id,
      },
    })
    .then((data) => {
      // console.log("data", data);
      res.status(200).send(data);
    })
    .catch((err) => {
      if (err) {
        res.send("there is no data");
      }
    });
});

itemsRouter.get("/", async (req, res) => {
  try {
    const companies = await db.companies.findAll({
      attributes: ["id"],
      where: { baned: "false" },
    });
    var clearCompanies = [];
    for (var i = 0; i < companies.length; i++) {
      clearCompanies.push(companies[i].dataValues.id);
    }
    console.log("companies", clearCompanies);
    const items = await newItem.findAll({
      where: { itemCompany: clearCompanies },
    });
    console.log("items", items);
    res.send(items);
  } catch (e) {
    console.log(e);
  }
});

itemsRouter.delete(`/:itemId`, async (req, res) => {
  newItem.destroy({
    where: {
      id: req.params.itemId,
    },
  });
  console.log("heyyyyyyy", req.params.itemId);
  res.send({
    status: 200,
  });
});

itemsRouter.get(`/Company/:id`, async (req, res) => {
  try {
    const items = await newItem.findAll({
      where: {
        itemCompany: req.params.id,
      },
    });
    res.status(200).send(items);
  } catch (e) {
    console.error(e);
  }
});
// get items form the same company
itemsRouter.get("/getfour/:id", async (req, res) => {
  try {
    console.log("=============>", req.params);
    const items = await newItem.findAll({
      where: {
        itemCompany: req.params.id,
      },
    });
    res.send(items);
  } catch (err) {
    res.status(400).send(err);
  }
});
module.exports = itemsRouter;
