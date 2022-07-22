const express = require("express");
const router = express.Router();

const models = require("../models");

const User = models.default.User;
const Account = models.default.Accounts;
const Transaction = models.default.Transactions;

/**
 * @swagger
 * components:
 *   schemas:
 *     Transactions:
 *       type: object
 *       required:
 *         - id
 *       properties:
 *         id:
 *           type: number
 *           description: Transaction Id
 *         senderAccount:
 *           type: number
 *           description: transaction Id Foreign Key
 *         receiverAccount:
 *           type: number
 *           description: transaction Id Foreign Key
 *         amount:
 *           type: float
 *           description: Amount
 *         date:
 *           type: string
 *           description: Transaction Date
 *       example:
 *         id: 1
 *         senderAccount: 2
 *         receiverAccount: 1
 *         amount: 234
 *         date: 20-02-2020
 */

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: The Transactions managing API
 */

/**
 * @swagger
 * /transactions:
 *   get:
 *     summary: Returns the list of all the transactions
 *     tags: [Transactions]
 *     responses:
 *       200:
 *         description: The list of the transactions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Transactions'
 */

router.get("/", async (req, res) => {
  try {
    const records = await Transaction.findAll({ where: {} });
    return res.json(records);
  } catch (e) {
    console.log(e);
    return res.json({
      msg: "Fail to fectch Transactions",
      status: 500,
      route: "/get",
    });
  }
});

/**
 * @swagger
 * /transactions/{id}:
 *   get:
 *     summary: Get the transaction by id
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The transaction id
 *     responses:
 *       200:
 *         description: Transaction by id
 *         contens:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transactions'
 *       404:
 *         description: The transaction was not found
 */

router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({ where: { id } });
    if (!transaction) {
      return res.json({ msg: "Can not find existing record" });
    }
    return res.json(transaction);
  } catch (e) {
    console.log(e);
    return res.json({
      msg: "Fail to get Transaction",
      status: 500,
      route: "get/:id",
    });
  }
});

/**
 * @swagger
 * /transactions:
 *   post:
 *     summary: Make a new transaction
 *     tags: [Transactions]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Transactions'
 *     responses:
 *       200:
 *         description: The transaction was successfully created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Transactions'
 *       500:
 *         description: Some server error
 */

router.post("/", async (req, res) => {
  try {
    console.log(req.body.senderAccount, req.body.receiverAccount);
    const senderAccount = Number(req.body.senderAccount);
    const receiverAccount = Number(req.body.receiverAccount);
    const amount = Number(req.body.amount);
    const sender = await Account.findOne({ where: { id: senderAccount } });
    const receiver = await Account.findOne({ where: { id: receiverAccount } });
    if (
      senderAccount !== receiverAccount &&
      sender &&
      receiver &&
      Number(sender.account_balance) >= amount
    ) {
      await Transaction.create(req.body);
      await Account.update(
        { account_balance: sender.account_balance - amount },
        { where: { id: senderAccount } }
      );
      await Account.update(
        { account_balance: receiver.account_balance + amount },
        { where: { id: receiverAccount } }
      );
      return res.json({ msg: "Successfully create Account" });
    } else {
      return res.json({
        msg: "Sender and Receiver Account Must be different and Account's Objects. And Sender must have enough balance too.",
      });
    }
  } catch (e) {
    console.log(e);
    return res.json({ msg: "Fail to create", status: 500, route: "/put" });
  }
});

/**
 * @swagger
 * /transactions/{id}:
 *   delete:
 *     summary: Remove the transaction by id
 *     tags: [Transactions]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The transaction id
 *
 *     responses:
 *       200:
 *         description: The transaction was deleted
 *       404:
 *         description: The transaction transaction not found
 */

router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const transaction = await Transaction.findOne({ where: { id } });
    if (!transaction) {
      return res.json({ msg: "Can not find existing record" });
    }
    const deletedTransaction = await transaction.destroy();
    return res.json({ transaction: deletedTransaction });
  } catch (e) {
    console.log(e);
    return res.json({
      msg: "Fail to get Transation",
      status: 500,
      route: "/delete/:id",
    });
  }
});

module.exports = router;
