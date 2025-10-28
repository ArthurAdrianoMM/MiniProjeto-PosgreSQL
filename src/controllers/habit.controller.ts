import { Request, Response } from "express";
import * as habitService from "../services/habit.service";

/**
 * POST /habits - Create a new habit
 */
const createHabit = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const { name, description, frequency, isActive } = req.body;
    
    const result = await habitService.createHabit(userId, {
      name,
      description,
      frequency,
      isActive
    });

    res.status(201).json(result);
  } catch (err: any) {
    console.error("Create habit error:", err.message);
    
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    
    res.status(500).json({ error: "Erro ao criar hábito" });
  }
};

/**
 * GET /habits - List all habits for authenticated user with optional filtering
 */
const getHabits = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    // Get query parameters for filtering
    const { isActive, frequency, name } = req.query;
    const filters = { isActive, frequency, name };

    const habits = await habitService.getHabits(userId, filters);

    res.status(200).json({
      habits,
      count: habits.length,
      message: "Hábitos listados com sucesso"
    });
  } catch (err: any) {
    console.error("Get habits error:", err.message);
    res.status(500).json({ error: "Erro ao listar hábitos" });
  }
};

/**
 * GET /habits/:id - Get a single habit by ID
 */
const getHabitById = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const { id } = req.params;
    
    const habit = await habitService.getHabitById(userId, id);

    res.status(200).json(habit);
  } catch (err: any) {
    console.error("Get habit by ID error:", err.message);
    
    if (err.name === "HabitNotFoundError") {
      return res.status(404).json({ error: err.message });
    }
    
    if (err.name === "ForbiddenAccessError") {
      return res.status(403).json({ error: err.message });
    }
    
    res.status(500).json({ error: "Erro ao buscar hábito" });
  }
};

/**
 * PUT /habits/:id - Update all data of a habit
 */
const updateHabit = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const { id } = req.params;
    const { name, description, frequency, isActive } = req.body;

    const result = await habitService.updateHabit(userId, id, {
      name,
      description,
      frequency,
      isActive
    });

    res.status(200).json(result);
  } catch (err: any) {
    console.error("Update habit error:", err.message);
    
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    
    if (err.name === "HabitNotFoundError") {
      return res.status(404).json({ error: err.message });
    }
    
    if (err.name === "ForbiddenAccessError") {
      return res.status(403).json({ error: err.message });
    }
    
    res.status(500).json({ error: "Erro ao atualizar hábito" });
  }
};

/**
 * PATCH /habits/:id - Partially update a habit
 */
const patchHabit = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const { id } = req.params;
    const { name, description, frequency, isActive } = req.body;

    const result = await habitService.patchHabit(userId, id, {
      name,
      description,
      frequency,
      isActive
    });

    res.status(200).json(result);
  } catch (err: any) {
    console.error("Patch habit error:", err.message);
    
    if (err.name === "ValidationError") {
      return res.status(400).json({ error: err.message });
    }
    
    if (err.name === "HabitNotFoundError") {
      return res.status(404).json({ error: err.message });
    }
    
    if (err.name === "ForbiddenAccessError") {
      return res.status(403).json({ error: err.message });
    }
    
    res.status(500).json({ error: "Erro ao atualizar hábito" });
  }
};

/**
 * DELETE /habits/:id - Delete a habit
 */
const deleteHabit = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ error: "Usuário não autenticado" });
    }

    const { id } = req.params;
    
    const result = await habitService.deleteHabit(userId, id);

    res.status(200).json(result);
  } catch (err: any) {
    console.error("Delete habit error:", err.message);
    
    if (err.name === "HabitNotFoundError") {
      return res.status(404).json({ error: err.message });
    }
    
    if (err.name === "ForbiddenAccessError") {
      return res.status(403).json({ error: err.message });
    }
    
    res.status(500).json({ error: "Erro ao deletar hábito" });
  }
};

export {
  createHabit,
  getHabits,
  getHabitById,
  updateHabit,
  patchHabit,
  deleteHabit
};

