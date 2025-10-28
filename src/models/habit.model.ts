import mongoose from "mongoose";

const habitSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: [true, "Nome do hábito é obrigatório"], 
    minlength: [2, "Nome deve ter pelo menos 2 caracteres"],
    maxlength: [100, "Nome deve ter no máximo 100 caracteres"],
    trim: true
  },
  description: { 
    type: String, 
    maxlength: [500, "Descrição deve ter no máximo 500 caracteres"],
    trim: true,
    default: ""
  },
  frequency: {
    type: String,
    enum: {
      values: ["Diário", "Semanal", "Quinzenal", "Mensal"],
      message: "Frequência deve ser: Diário, Semanal, Quinzenal ou Mensal"
    },
    required: [true, "Frequência é obrigatória"],
    default: "Diário"
  },
  isActive: {
    type: Boolean,
    default: true
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: "User", 
    required: [true, "Usuário é obrigatório"],
    index: true
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc, ret: any) {
      delete ret.__v;
      return ret;
    }
  }
});

// Index for efficient querying by user
habitSchema.index({ userId: 1, name: 1 });
habitSchema.index({ userId: 1, isActive: 1 });

const Habit = mongoose.model("Habit", habitSchema);
export default Habit;

