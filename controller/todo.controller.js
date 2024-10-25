import Todo from "../model/todo.model.js";

const createTodo = async (req, res) => {
    const todo = new Todo({
        text: req.body.text,
        completed: req.body.completed,
        user: req.user._id
    });
    try {
        const newTodo = await todo.save();
        res.status(201).json({ message: "Todo is created Successfully", newTodo });
    } catch (error) {
        console.log(error)
        res.status(400).json({ message: "Error in creating Todo" });
    }
}
const getTodos = async (req, res) => {
    try {
        const todos = await Todo.find({user:req.user._id})
        res.status(200).json({ message: "Todo is fetch Successfully", todos });
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ message: "Error in fetching Todo" });
    }
}
const updateTodo = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Todo ID is required" });
        }
        const todo = await Todo.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
        })

        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(201).json({ message: "Todo is updated Successfully", todo });
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ message: "Error in updating Todo" });
    }
}
const deleteTodo = async (req, res) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id)
        if (!todo) {
            return res.status(404).json({ message: "Todo not found" });
        }
        res.status(201).json({ message: "Todo is deleted Successfully" });
    }
    catch (error) {
        console.log(error)
        res.status(400).json({ message: "Error in deleting Todo" });
    }
}
export { createTodo, getTodos, updateTodo, deleteTodo }