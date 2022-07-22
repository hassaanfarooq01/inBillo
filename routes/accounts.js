const express = require("express");
const router = express.Router();
const models = require("../models");

const User = models.default.User;
const Account = models.default.Accounts;

/**
 * @swagger
 * components:
 *   schemas:
 *     Accounts:
 *       type: object
 *       required:
 *         - id
 *         - userId
 *       properties:
 *         id:
 *           type: number
 *           description: Account Id
 *         userId:
 *           type: number
 *           description: User Id Foreign Key
 *         account_balance:
 *           type: float
 *           description: Account Balance
 *         last-updated:
 *           type: string
 *           description: Account Last Update
 *       example:
 *         id: 1
 *         userId: 2
 *         account_balance: 34234
 *         last-updated: 20-02-2020
 */

/**
 * @swagger
 * tags:
 *   name: Accounts
 *   description: The accounts managing API
 */

/**
 * @swagger
 * /accounts:
 *   get:
 *     summary: Returns the list of all the accounts
 *     tags: [Accounts]
 *     responses:
 *       200:
 *         description: The list of the accounts
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Accounts'
 */

router.get("/", async (req, res) => {
  try {
    const records = await Account.findAll({ where: {} });
    return res.json(records);
  } catch (e) {
    console.log(e);
    return res.json({
      msg: "Fail to fectch Accounts",
      status: 500,
      route: "/get",
    });
  }
});

/**
 * @swagger
 * /accounts/{id}:
 *   get:
 *     summary: Get the account by id
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The account id
 *     responses:
 *       200:
 *         description: account by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Accounts'
 *       404:
 *         description: The account was not found
 */

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findOne({ where: { id } });
    if (!account) {
      return res.json({ msg: "Can not find existing record" });
    }
    return res.json(account);
  } catch (e) {
    console.log(e);
    return res.json({
      msg: "Fail to get Account",
      status: 500,
      route: "get/:id",
    });
  }
});

/**
 * @swagger
 * /accounts:
 *   post:
 *     summary: Create a new account
 *     tags: [Accounts]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Accounts'
 *     responses:
 *       200:
 *         description: The account was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Accounts'
 *       500:
 *         description: Some server error
 */

router.post("/", async (req, res) => {
  try {
    const userId = Number(req.body.userId);
    if (userId && (await User.findOne({ where: { id: userId } }))) {
      await Account.create(req.body);
      return res.json({ msg: "Successfully create Account" });
    } else {
      return res.json({ msg: "UserId does not exist" });
    }
  } catch (e) {
    console.log(e);
    return res.json({ msg: "Fail to create", status: 500, route: "/put" });
  }
});

/**
 * @swagger
 * /accounts/{id}:
 *  put:
 *    summary: Update the account by the id
 *    tags: [Accounts]
 *    parameters:
 *      - in: path
 *        name: id
 *        schema:
 *          type: string
 *        required: true
 *        description: The account id
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            $ref: '#/components/schemas/Accounts'
 *    responses:
 *      200:
 *        description: The account was updated
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/Accounts'
 *      404:
 *        description: The account was not found
 *      500:
 *        description: Some error happened
 */

router.put("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findOne({ where: { id } });
    if (!account) {
      return res.json({ msg: "Can not find existing record" });
    } else {
      const userId = Number(req.body.userId);
      if (userId && (await User.findOne({ where: { id: userId } }))) {
        const updateAccount = await account.update(req.body, { where: { id } });
        return res.json({
          account: updateAccount,
          msg: "User updated successfully",
        });
      } else {
        return res.json({ msg: "UserId does not exist" });
      }
    }
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
 * /accounts/{id}:
 *   delete:
 *     summary: Remove the accounts by id
 *     tags: [Accounts]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The account id
 *
 *     responses:
 *       200:
 *         description: The account was deleted
 *       404:
 *         description: The account account not found
 */

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const account = await Account.findOne({ where: { id } });
    if (!account) {
      return res.json({ msg: "Can not find existing record" });
    }
    const deletedAccount = await account.destroy();
    return res.json({ account: deletedAccount });
  } catch (e) {
    console.log(e);
    return res.json({
      msg: "Fail to get Account",
      status: 500,
      route: "/delete/:id",
    });
  }
});

module.exports = router;
