import { IStorage } from "./storage";
import session from "express-session";
import createMemoryStore from "memorystore";
import { User, Task, UserTask, Transaction, WithdrawalRequest, InsertWithdrawalRequest } from "@shared/schema";

const MemoryStore = createMemoryStore(session);

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private tasks: Map<number, Task>;
  private userTasks: Map<number, UserTask>;
  private transactions: Map<number, Transaction>;
  private withdrawalRequests: Map<number, WithdrawalRequest>;
  private currentId: number;
  sessionStore: session.Store;

  constructor() {
    this.users = new Map();
    this.tasks = new Map();
    this.userTasks = new Map();
    this.transactions = new Map();
    this.withdrawalRequests = new Map();
    this.currentId = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000,
    });

    // Initialize with some mock tasks
    this.initializeMockTasks();
  }

  private initializeMockTasks() {
    const mockTasks = [
      {
        id: 1,
        title: "Basic Survey",
        description: "Complete a simple market research survey",
        investmentRequired: 10,
        reward: 12,
        duration: 5
      },
      {
        id: 2,
        title: "Product Review",
        description: "Write a detailed product review",
        investmentRequired: 50,
        reward: 65,
        duration: 15
      },
      // Add more mock tasks as needed
    ];

    mockTasks.forEach(task => this.tasks.set(task.id, task as Task));
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.currentId++;
    const user: User = {
      ...insertUser,
      id,
      balance: 0,
      level: "Bronze",
      totalDeposits: 0,
      totalWithdrawn: 0,
      referralCode: `REF${id}`,
      referredBy: null
    };
    this.users.set(id, user);
    return user;
  }

  async getAllTasks(): Promise<Task[]> {
    return Array.from(this.tasks.values());
  }

  async getTask(id: number): Promise<Task | undefined> {
    return this.tasks.get(id);
  }

  async startUserTask(userId: number, taskId: number): Promise<UserTask> {
    const id = this.currentId++;
    const userTask: UserTask = {
      id,
      userId,
      taskId,
      status: "pending",
      startedAt: new Date(),
      completedAt: null
    };
    this.userTasks.set(id, userTask);
    return userTask;
  }

  async createTransaction(transaction: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
    const id = this.currentId++;
    const newTransaction: Transaction = {
      ...transaction,
      id,
      createdAt: new Date()
    };
    this.transactions.set(id, newTransaction);
    return newTransaction;
  }

  async getTeamStats(userId: number): Promise<any> {
    const referrals = Array.from(this.users.values()).filter(
      user => user.referredBy === userId
    );
    
    return {
      totalTeamMembers: referrals.length,
      totalTeamDeposits: referrals.reduce((sum, user) => sum + Number(user.totalDeposits), 0),
      totalTeamWithdrawn: referrals.reduce((sum, user) => sum + Number(user.totalWithdrawn), 0),
    };
  }
  async getUserByReferralCode(referralCode: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.referralCode === referralCode,
    );
  }

  async createWithdrawalRequest(userId: number, data: Omit<InsertWithdrawalRequest, "password">): Promise<WithdrawalRequest> {
    const id = this.currentId++;
    const withdrawalRequest: WithdrawalRequest = {
      id,
      userId,
      amount: data.amount,
      withdrawalAddress: data.withdrawalAddress,
      status: "pending",
      adminNotes: null,
      createdAt: new Date(),
      processedAt: null,
    };
    this.withdrawalRequests.set(id, withdrawalRequest);
    return withdrawalRequest;
  }

  async getUserWithdrawalRequests(userId: number): Promise<WithdrawalRequest[]> {
    return Array.from(this.withdrawalRequests.values())
      .filter(request => request.userId === userId)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async getAllWithdrawalRequests(): Promise<WithdrawalRequest[]> {
    return Array.from(this.withdrawalRequests.values())
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async processWithdrawalRequest(
    requestId: number,
    status: "approved" | "rejected",
    adminNotes?: string
  ): Promise<WithdrawalRequest | undefined> {
    const request = this.withdrawalRequests.get(requestId);
    if (!request) return undefined;

    const updatedRequest: WithdrawalRequest = {
      ...request,
      status,
      adminNotes: adminNotes || null,
      processedAt: new Date(),
    };
    this.withdrawalRequests.set(requestId, updatedRequest);
    return updatedRequest;
  }
}

export const storage = new MemStorage();