import { prisma } from "../database/connection";
import { logInfo, logError } from "../utils/logger";

// Custom error classes
export class HabitNotFoundError extends Error {
  constructor(message: string = "Hábito não encontrado") {
    super(message);
    this.name = "HabitNotFoundError";
  }
}

export class UnauthorizedAccessError extends Error {
  constructor(message: string = "Acesso não autorizado") {
    super(message);
    this.name = "UnauthorizedAccessError";
  }
}

export class ValidationError extends Error {
  constructor(message: string = "Dados inválidos") {
    super(message);
    this.name = "ValidationError";
  }
}

export class ForbiddenAccessError extends Error {
  constructor(message: string = "Você não tem permissão para acessar este recurso") {
    super(message);
    this.name = "ForbiddenAccessError";
  }
}

/**
 * Create a new habit for a user
 */
export const createHabit = async (userId: string, data: {
  name: string;
  description?: string;
  frequency?: "Diário" | "Semanal" | "Quinzenal" | "Mensal";
  isActive?: boolean;
}) => {
  try {
    logInfo("Creating habit", { userId, name: data.name });

    // Validate input
    if (!data.name || data.name.trim().length < 2) {
      throw new ValidationError("Nome deve ter pelo menos 2 caracteres");
    }

    // Create habit
    const habit = await prisma.habit.create({
      data: {
        name: data.name,
        description: data.description ?? "",
        frequency: mapFrequency(data.frequency ?? "Diário"),
        isActive: data.isActive ?? true,
        userId
      }
    });

    logInfo("Habit created successfully", { habitId: habit.id });

    return {
      id: habit.id,
      name: habit.name,
      description: habit.description,
      frequency: unmapFrequency(habit.frequency),
      isActive: habit.isActive,
      userId: habit.userId,
      createdAt: habit.createdAt,
      updatedAt: habit.updatedAt,
      message: "Hábito criado com sucesso"
    };
  } catch (error: any) {
    logError("Error creating habit", error);
    
    if (error.name === "ValidationError") {
      throw error;
    }
    
    throw new Error("Erro ao criar hábito");
  }
};

/**
 * Get all habits for a user with optional filtering
 */
export const getHabits = async (userId: string, filters?: any) => {
  try {
    logInfo("Fetching habits", { userId, filters });

    // Build Prisma where
    const where: any = { userId };
    if (filters) {
      if (filters.isActive !== undefined) where.isActive = filters.isActive === 'true';
      if (filters.frequency) where.frequency = mapFrequency(filters.frequency);
      if (filters.name) where.name = { contains: String(filters.name), mode: 'insensitive' };
    }

    const habits = await prisma.habit.findMany({ where, orderBy: { createdAt: 'desc' } });

    logInfo("Habits fetched successfully", { count: habits.length });

    return habits.map(habit => ({
      id: habit.id,
      name: habit.name,
      description: habit.description,
      frequency: unmapFrequency(habit.frequency),
      isActive: habit.isActive,
      userId: habit.userId,
      createdAt: habit.createdAt,
      updatedAt: habit.updatedAt
    }));
  } catch (error) {
    logError("Error fetching habits", error);
    throw new Error("Erro ao buscar hábitos");
  }
};

/**
 * Get a single habit by ID (ensure it belongs to the user)
 */
export const getHabitById = async (userId: string, habitId: string) => {
  try {
    logInfo("Fetching habit by ID", { userId, habitId });

    const habit = await prisma.habit.findUnique({ where: { id: habitId } });

    if (!habit) {
      logError("Habit not found", { habitId });
      throw new HabitNotFoundError();
    }

    // Check if habit belongs to user
    if (habit.userId !== userId) {
      logError("Unauthorized access to habit", { userId, habitId, habitUserId: habit.userId });
      throw new ForbiddenAccessError();
    }

    logInfo("Habit fetched successfully");

    return {
      id: habit.id,
      name: habit.name,
      description: habit.description,
      frequency: unmapFrequency(habit.frequency),
      isActive: habit.isActive,
      userId: habit.userId,
      createdAt: habit.createdAt,
      updatedAt: habit.updatedAt
    };
  } catch (error: any) {
    if (error.name === "HabitNotFoundError" || error.name === "ForbiddenAccessError") {
      throw error;
    }
    logError("Error fetching habit by ID", error);
    throw new Error("Erro ao buscar hábito");
  }
};

/**
 * Update a habit completely (PUT)
 */
export const updateHabit = async (userId: string, habitId: string, data: {
  name: string;
  description?: string;
  frequency?: "Diário" | "Semanal" | "Quinzenal" | "Mensal";
  isActive?: boolean;
}) => {
  try {
    logInfo("Updating habit (PUT)", { userId, habitId });

    // Validate input
    if (!data.name || data.name.trim().length < 2) {
      throw new ValidationError("Nome deve ter pelo menos 2 caracteres");
    }

    const habit = await prisma.habit.findUnique({ where: { id: habitId } });

    if (!habit) {
      logError("Habit not found", { habitId });
      throw new HabitNotFoundError();
    }

    // Check if habit belongs to user
    if (habit.userId !== userId) {
      logError("Unauthorized access to habit (PUT)", { userId, habitId, habitUserId: habit.userId });
      throw new ForbiddenAccessError();
    }

    const updated = await prisma.habit.update({
      where: { id: habitId },
      data: {
        name: data.name,
        description: data.description !== undefined ? data.description : habit.description,
        frequency: data.frequency !== undefined ? mapFrequency(data.frequency) : habit.frequency,
        isActive: data.isActive !== undefined ? data.isActive : habit.isActive,
      }
    });

    logInfo("Habit updated successfully (PUT)");

    return {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      frequency: unmapFrequency(updated.frequency),
      isActive: updated.isActive,
      userId: updated.userId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      message: "Hábito atualizado com sucesso"
    };
  } catch (error: any) {
    if (error.name === "ValidationError" || error.name === "HabitNotFoundError" || error.name === "ForbiddenAccessError") {
      throw error;
    }
    logError("Error updating habit (PUT)", error);
    throw new Error("Erro ao atualizar hábito");
  }
};

/**
 * Partially update a habit (PATCH)
 */
export const patchHabit = async (userId: string, habitId: string, data: {
  name?: string;
  description?: string;
  frequency?: "Diário" | "Semanal" | "Quinzenal" | "Mensal";
  isActive?: boolean;
}) => {
  try {
    logInfo("Updating habit (PATCH)", { userId, habitId });

    // Validate input if name is being updated
    if (data.name !== undefined && data.name.trim().length < 2) {
      throw new ValidationError("Nome deve ter pelo menos 2 caracteres");
    }

    const habit = await prisma.habit.findUnique({ where: { id: habitId } });

    if (!habit) {
      logError("Habit not found", { habitId });
      throw new HabitNotFoundError();
    }

    // Check if habit belongs to user
    if (habit.userId !== userId) {
      logError("Unauthorized access to habit (PATCH)", { userId, habitId, habitUserId: habit.userId });
      throw new ForbiddenAccessError();
    }

    const updated = await prisma.habit.update({
      where: { id: habitId },
      data: {
        name: data.name !== undefined ? data.name : undefined,
        description: data.description !== undefined ? data.description : undefined,
        frequency: data.frequency !== undefined ? mapFrequency(data.frequency) : undefined,
        isActive: data.isActive !== undefined ? data.isActive : undefined,
      }
    });

    logInfo("Habit updated successfully (PATCH)");

    return {
      id: updated.id,
      name: updated.name,
      description: updated.description,
      frequency: unmapFrequency(updated.frequency),
      isActive: updated.isActive,
      userId: updated.userId,
      createdAt: updated.createdAt,
      updatedAt: updated.updatedAt,
      message: "Hábito atualizado com sucesso"
    };
  } catch (error: any) {
    if (error.name === "ValidationError" || error.name === "HabitNotFoundError" || error.name === "ForbiddenAccessError") {
      throw error;
    }
    logError("Error updating habit (PATCH)", error);
    throw new Error("Erro ao atualizar hábito");
  }
};

/**
 * Delete a habit
 */
export const deleteHabit = async (userId: string, habitId: string) => {
  try {
    logInfo("Deleting habit", { userId, habitId });

    const habit = await prisma.habit.findUnique({ where: { id: habitId } });

    if (!habit) {
      logError("Habit not found", { habitId });
      throw new HabitNotFoundError();
    }

    // Check if habit belongs to user
    if (habit.userId !== userId) {
      logError("Unauthorized access to habit (DELETE)", { userId, habitId, habitUserId: habit.userId });
      throw new ForbiddenAccessError();
    }

    await prisma.habit.delete({ where: { id: habitId } });

    logInfo("Habit deleted successfully");

    return {
      message: "Hábito deletado com sucesso",
      id: habit.id
    };
  } catch (error: any) {
    if (error.name === "HabitNotFoundError" || error.name === "ForbiddenAccessError") {
      throw error;
    }
    logError("Error deleting habit", error);
    throw new Error("Erro ao deletar hábito");
  }
};

// Helpers to map frequency between API strings and Prisma enum
function mapFrequency(value: "Diário" | "Semanal" | "Quinzenal" | "Mensal"): any {
  switch (value) {
    case "Diário":
      return "Diário" as any;
    case "Semanal":
      return "Semanal" as any;
    case "Quinzenal":
      return "Quinzenal" as any;
    case "Mensal":
      return "Mensal" as any;
    default:
      return "Diário" as any;
  }
}

function unmapFrequency(value: any): "Diário" | "Semanal" | "Quinzenal" | "Mensal" {
  return value as any;
}

