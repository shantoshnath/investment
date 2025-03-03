import type { Express } from "express";
import { createServer, type Server } from "http";
import { setupAuth } from "./auth";
import { storage } from "./storage";
import { z } from "zod";
import { insertWithdrawalRequestSchema } from "@shared/schema";
import { comparePasswords } from './auth';
import { upayService } from './services/upay';
import crypto from 'crypto';

export async function registerRoutes(app: Express): Promise<Server> {
  setupAuth(app);

  // Task routes
  app.get("/api/tasks", async (_req, res) => {
    const tasks = await storage.getAllTasks();
    res.json(tasks);
  });

  // User task routes
  app.post("/api/tasks/:taskId/start", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const taskId = parseInt(req.params.taskId);
    const task = await storage.getTask(taskId);
    if (!task) return res.status(404).send("Task not found");

    const userTask = await storage.startUserTask(req.user.id, taskId);
    res.json(userTask);
  });

  // Transaction routes
  app.post("/api/transactions/deposit", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const schema = z.object({ amount: z.number().positive() });
    const result = schema.safeParse(req.body);
    if (!result.success) return res.status(400).send(result.error);

    const transaction = await storage.createTransaction({
      userId: req.user.id,
      type: "deposit",
      amount: result.data.amount,
      status: "pending"
    });
    res.json(transaction);
  });

  app.get("/api/transactions", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const transactions = await storage.getUserTransactions(req.user.id);
    res.json(transactions);
  });

  app.post("/api/transactions/withdraw", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const schema = z.object({ amount: z.number().positive() });
    const result = schema.safeParse(req.body);
    if (!result.success) return res.status(400).send(result.error);

    const transaction = await storage.createTransaction({
      userId: req.user.id,
      type: "withdrawal",
      amount: result.data.amount,
      status: "pending"
    });
    res.json(transaction);
  });

  // Team routes
  app.get("/api/team/stats", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const stats = await storage.getTeamStats(req.user.id);
    res.json(stats);
  });

  // Create a withdrawal request
  app.post("/api/withdrawals/request", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const result = insertWithdrawalRequestSchema.safeParse(req.body);
    if (!result.success) return res.status(400).send(result.error);

    // Verify user's account password
    const user = await storage.getUserByUsername(req.user.username);
    if (!user || !(await comparePasswords(result.data.password, user.password))) {
      return res.status(400).send("Invalid password");
    }

    // Verify the withdrawal amount is valid
    if (result.data.amount <= 0) {
      return res.status(400).send("Withdrawal amount must be greater than 0");
    }

    if (result.data.amount > user.balance) {
      return res.status(400).send("Insufficient balance");
    }

    const withdrawalRequest = await storage.createWithdrawalRequest(req.user.id, {
      amount: result.data.amount,
      withdrawalAddress: result.data.withdrawalAddress,
    });

    res.json(withdrawalRequest);
  });

  // Get user's withdrawal requests
  app.get("/api/withdrawals/requests", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const requests = await storage.getUserWithdrawalRequests(req.user.id);
    res.json(requests);
  });

  // Admin routes for managing withdrawal requests
  app.get("/api/admin/withdrawals", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    // TODO: Add proper admin check
    if (req.user.id !== 1) return res.sendStatus(403);

    const requests = await storage.getAllWithdrawalRequests();
    res.json(requests);
  });

  app.post("/api/admin/withdrawals/:requestId/process", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    // TODO: Add proper admin check
    if (req.user.id !== 1) return res.sendStatus(403);

    const schema = z.object({
      status: z.enum(["approved", "rejected"]),
      adminNotes: z.string().optional(),
    });

    const result = schema.safeParse(req.body);
    if (!result.success) return res.status(400).send(result.error);

    const requestId = parseInt(req.params.requestId);
    const request = await storage.processWithdrawalRequest(
      requestId,
      result.data.status,
      result.data.adminNotes
    );

    if (!request) {
      return res.status(404).send("Withdrawal request not found");
    }

    res.json(request);
  });

  // Create UPay payment order
  app.post("/api/payments/create", async (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);

    const schema = z.object({
      amount: z.number().min(1, "Amount must be greater than 0"),
    });

    const result = schema.safeParse(req.body);
    if (!result.success) return res.status(400).send(result.error);

    try {
      // Create an order ID that includes user ID for better tracking
      const orderId = `${req.user.id}_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;

      // Create a pending transaction first
      const transaction = await storage.createTransaction({
        userId: req.user.id,
        type: "deposit",
        amount: result.data.amount.toString(),
        status: "pending"
      });

      console.log('Creating payment order:', {
        userId: req.user.id,
        amount: result.data.amount,
        orderId,
        transactionId: transaction.id
      });

      const paymentOrder = await upayService.createPaymentOrder(
        result.data.amount,
        orderId
      );

      res.json(paymentOrder);
    } catch (error: any) {
      console.error('Payment creation error:', error);
      res.status(500).send(error.message || "Failed to create payment order");
    }
  });

  // UPay payment callback
  app.post("/api/payments/callback", async (req, res) => {
    console.log('Received payment callback:', req.body);
    console.log('Callback headers:', req.headers);

    if (!upayService.verifyCallback(req.headers as Record<string, string>, req.body)) {
      console.error('Invalid callback signature');
      return res.status(400).send("Invalid signature");
    }

    const { order_id, status, amount } = req.body;

    try {
      if (status === 'SUCCESS') {
        // Extract user ID from order_id
        const userId = parseInt(order_id.split('_')[0]);
        const user = await storage.getUser(userId);

        if (!user) {
          throw new Error(`User not found for order ${order_id}`);
        }

        // Update user balance
        await storage.updateUserBalance(userId, {
          balance: (Number(user.balance) + Number(amount)).toString(),
          totalDeposits: (Number(user.totalDeposits) + Number(amount)).toString()
        });

        console.log('Successfully processed payment:', {
          userId,
          amount,
          orderId: order_id
        });
      }

      res.json({ success: true });
    } catch (error) {
      console.error('Payment callback error:', error);
      res.status(500).send("Failed to process payment callback");
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}