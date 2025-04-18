import { useState, useEffect } from 'react'
import { Button } from "./ui/button"
import { Input } from "./ui/input"
import { supabase } from '../lib/supabaseClient'
import { UserAuth } from "../context/AuthContext"
import CreateTodoModal from './CreateTodoModal'

interface Todo {
  id: number
  title: string
  status: string
  priority: string
  user_id: string
  type: string
}

export default function Todo() {
  const [todos, setTodos] = useState<Todo[]>([])
  const [filterText, setFilterText] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [priorityFilter, setPriorityFilter] = useState('all')
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const { session } = UserAuth()

  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    try {
      const { data, error } = await supabase
        .from('todos')
        .select('*')
        .eq('user_id', session?.user.id)
        .order('created_at', { ascending: false })

      if (error) throw error
      if (data) setTodos(data)
    } catch (error) {
      console.error('Error fetching todos:', error)
    }
  }

  async function createTodo(data: { title: string; type: string; priority: string }) {
    try {
      const { error } = await supabase
        .from('todos')
        .insert([
          {
            title: data.title,
            status: 'Todo',
            priority: data.priority,
            type: data.type,
            user_id: session?.user.id
          }
        ])

      if (error) throw error
      fetchTodos()
    } catch (error) {
      console.error('Error creating todo:', error)
    }
  }

  async function updateTodoStatus(id: number, newStatus: string) {
    try {
      const { error } = await supabase
        .from('todos')
        .update({ status: newStatus })
        .eq('id', id)

      if (error) throw error
      fetchTodos()
    } catch (error) {
      console.error('Error updating todo:', error)
    }
  }

  const filteredTodos = todos.filter(todo => {
    const matchesText = todo.title.toLowerCase().includes(filterText.toLowerCase())
    const matchesStatus = statusFilter === 'all' || todo.status === statusFilter
    const matchesPriority = priorityFilter === 'all' || todo.priority === priorityFilter
    return matchesText && matchesStatus && matchesPriority
  })

  return (
    <div className="w-full max-w-6xl mx-auto bg-[#121212] text-white rounded-lg p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-2xl font-bold">Welcome back!</h2>
            <p className="text-gray-400">Here's a list of your tasks for this month!</p>
          </div>
          <Button onClick={() => setIsCreateModalOpen(true)}>
            Create Task
          </Button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <Input
          type="text"
          placeholder="Filter tasks..."
          value={filterText}
          onChange={(e) => setFilterText(e.target.value)}
          className="flex-1 bg-[#1E1E1E] border-0"
        />
        <div className="flex items-center gap-2">
          <span className="text-sm">Status</span>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-[#1E1E1E] border-0 rounded-md px-2 py-1 text-sm"
          >
            <option value="all">All</option>
            <option value="Todo">Todo</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
            <option value="Backlog">Backlog</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm">Priority</span>
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="bg-[#1E1E1E] border-0 rounded-md px-2 py-1 text-sm"
          >
            <option value="all">All</option>
            <option value="Low">Low</option>
            <option value="Medium">Medium</option>
            <option value="High">High</option>
          </select>
        </div>

      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-800">
              <th className="w-6"></th>
              <th className="text-left py-3 text-sm font-medium text-gray-400">Task</th>
              <th className="text-left py-3 text-sm font-medium text-gray-400">Status</th>
              <th className="text-left py-3 text-sm font-medium text-gray-400">Priority</th>
              <th className="w-8"></th>
            </tr>
          </thead>
          <tbody>
            {filteredTodos.map((todo) => (
              <tr key={todo.id} className="border-b border-gray-800">
                <td className="py-3">
                  <input type="checkbox" className="rounded border-gray-600" />
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <span className={`px-2 py-0.5 text-xs rounded ${
                      todo.type === 'Bug' ? 'bg-red-900 text-red-300' :
                      todo.type === 'Feature' ? 'bg-blue-900 text-blue-300' :
                      'bg-purple-900 text-purple-300'
                    }`}>
                      {todo.type}
                    </span>
                    <span className="text-sm text-gray-200">{todo.title}</span>
                  </div>
                </td>
                <td className="py-3">
                  <div className="flex items-center gap-2">
                    <span className={`w-2 h-2 bg-black  rounded-full ${
                      todo.status === 'Done' ? 'bg-green-500' :
                      todo.status === 'In Progress' ? 'bg-yellow-500' :
                      todo.status === 'Backlog' ? 'bg-gray-500' :
                      todo.status === 'Cancelled' ? 'bg-red-500' :
                      'bg-blue-500'
                    }`}></span>
                    <select
                      value={todo.status}
                      onChange={(e) => updateTodoStatus(todo.id, e.target.value)}
                      className="bg-transparent border-0 text-sm text-gray-300"
                    >
                      <option className='bg-black' value="Todo">Todo</option>
                      <option className='bg-black' value="In Progress">In Progress</option>
                      <option className='bg-black' value="Done">Done</option>
                      <option className='bg-black' value="Backlog">Backlog</option>
                      <option className='bg-black' value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                </td>
                <td className="py-3">
                  <span className={`inline-flex items-center gap-1 text-sm ${
                    todo.priority === 'High' ? 'text-red-400' :
                    todo.priority === 'Medium' ? 'text-yellow-400' :
                    'text-green-400'
                  }`}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      {todo.priority === 'High' ? <path d="m5 15 7-7 7 7"/> :
                       todo.priority === 'Medium' ? <path d="M8 12h8"/> :
                       <path d="m19 9-7 7-7-7"/>}
                    </svg>
                    {todo.priority}
                  </span>
                </td>
                <td className="py-3">
                  <button className="text-gray-400 hover:text-white">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="1"/><circle cx="19" cy="12" r="1"/><circle cx="5" cy="12" r="1"/>
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex justify-between items-center mt-4 text-sm text-gray-400">
          <span>0 of {todos.length} row(s) selected.</span>
          <div className="flex items-center gap-4">
            <span>Rows per page: 10</span>
            <span>Page 1 of {Math.ceil(todos.length / 10)}</span>
            <div className="flex gap-2">
              <button className="p-1 hover:bg-gray-800 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m11 17-5-5 5-5"/><path d="m18 17-5-5 5-5"/>
                </svg>
              </button>
              <button className="p-1 hover:bg-gray-800 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m15 17-5-5 5-5"/>
                </svg>
              </button>
              <button className="p-1 hover:bg-gray-800 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m9 17 5-5-5-5"/>
                </svg>
              </button>
              <button className="p-1 hover:bg-gray-800 rounded">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="m13 17 5-5-5-5"/><path d="m6 17 5-5-5-5"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <CreateTodoModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSubmit={createTodo}
      />
    </div>
  )
} 