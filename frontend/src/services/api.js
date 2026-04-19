import axios from 'axios'

const api = axios.create({ baseURL: 'http://localhost:8000' })

// ── Auth ─────────────────────────────────────────────────────────────────────
export const loginUser = (username) => api.post('/api/auth/login', { username })

// ── Users ────────────────────────────────────────────────────────────────────
export const getUser         = (userId)          => api.get(`/api/users/${userId}`)
export const createUser      = (data)            => api.post('/api/users', data)
export const updateUser      = (userId, data)    => api.put(`/api/users/${userId}`, data)
export const deleteUser      = (userId)          => api.delete(`/api/users/${userId}`)
export const getUserWorkouts = (userId)          => api.get(`/api/users/${userId}/workouts`)

// ── Exercises ─────────────────────────────────────────────────────────────────
export const searchExercises   = (name, limit = 10) => api.get('/api/exercises/search', { params: { name, limit } })
export const getExerciseDetails = (exerciseId)       => api.get(`/api/exercises/${exerciseId}`)

// ── Workouts ──────────────────────────────────────────────────────────────────
export const createWorkout   = (data)                           => api.post('/api/workouts', data)
export const getWorkout      = (workoutId)                      => api.get(`/api/workouts/${workoutId}`)
export const updateWorkout   = (workoutId, data)                => api.put(`/api/workouts/${workoutId}`, data)
export const deleteWorkout   = (workoutId)                      => api.delete(`/api/workouts/${workoutId}`)

export const addExerciseToWorkout      = (workoutId, exercise)               => api.post(`/api/workouts/${workoutId}/exercises`, exercise)
export const updateExerciseInWorkout   = (workoutId, exerciseIndex, exercise) => api.put(`/api/workouts/${workoutId}/exercises/${exerciseIndex}`, exercise)
export const deleteExerciseFromWorkout = (workoutId, exerciseIndex)           => api.delete(`/api/workouts/${workoutId}/exercises/${exerciseIndex}`)

// ── Chat ──────────────────────────────────────────────────────────────────────
export const askQuestion = (userId, question) => api.post('/api/chat', { user_id: userId, question })
