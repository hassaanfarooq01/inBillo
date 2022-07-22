const express = require("express");
const router = express.Router();
const models = require("../models");

const User = models.default.User;

/**
 * @swagger
 * components:
 *   schemas:
 *     Users:
 *       type: object
 *       required:
 *         - username
 *         - password
 *       properties:
 *         id:
 *           type: number
 *           description: The auto-generated id of the user
 *         username:
 *           type: string
 *           description: Username
 *         email:
 *           type: string
 *           description: Email
 *         password:
 *           type: string
 *           description: Password
 *       example:
 *         id: 1
 *         username: user1
 *         email: abcd@gmail.com
 *         password: asdf_adsf
 */

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: The users managing API
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Returns the list of all the users
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: The list of the users
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Users'
 */

router.get("/", async (req, res) => {
  try {
    const records = await User.findAll({ where: {} });
    return res.json(records);
  } catch (e) {
    console.log(e);
    return res.json({
      msg: "Fail to fectch Users",
      status: 500,
      route: "/get",
    });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *     responses:
 *       200:
 *         description: User by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       404:
 *         description: The user was not found
 */

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.json({ msg: "Can not find any record" });
    }
    return res.json(user);
  } catch (e) {
    console.log(e);
    return res.json({ msg: "Fail to get User", status: 500, route: "get/:id" });
  }
});

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a new user
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Users'
 *     responses:
 *       200:
 *         description: The user was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Users'
 *       500:
 *         description: Some server error
 */

router.post("/", async (req, res) => {
  try {
    await User.create(req.body);
    return res.json({ msg: "Successfully create user" });
  } catch (e) {
    console.log(e);
    return res.json({
      msg: "Fail to create and id must be unique.",
      status: 500,
      route: "/put",
    });
  }
});

/**
 * @swagger
 * /users/{id}:
 *  put:
 *    summary: Update the user by the id
 *    tags: [Users]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The user id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Users'
 *    responses:
 *      200:
 *        description: The user was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Users'
 *      404:
 *        description: The user was not found
 *      500:
 *        description: Some error happened
 */

router.put("/:id", async (req, res) => {
  try {
    console.log(req);
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.json({ msg: "Can not find any record" });
    }
    const updatedUser = await user.update(req.body, { where: { id } });
    return res.json({ user: updatedUser, msg: "User updated successfully" });
  } catch (e) {
    console.log(e);
    return res.json({
      msg: "Fail to get User",
      status: 500,
      route: "/put/:id",
    });
  }
});

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Remove the user by id
 *     tags: [Users]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The user id
 *
 *     responses:
 *       200:
 *         description: The user was deleted
 *       404:
 *         description: The user was not found
 */

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findOne({ where: { id } });
    if (!user) {
      return res.json({ msg: "Can not find any record" });
    }
    const deletedUser = await user.destroy();
    return res.json({ user: deletedUser });
  } catch (e) {
    console.log(e);
    return res.json({
      msg: "Fail to get User",
      status: 500,
      route: "/delete/:id",
    });
  }
});

module.exports = router;
