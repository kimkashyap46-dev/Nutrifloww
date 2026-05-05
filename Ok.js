```react
import React, { useState, useEffect, useMemo } from 'react';
import { 
  Plus, 
  Trash2, 
  ChevronRight, 
  PieChart, 
  Activity, 
  Utensils, 
  Search,
  CheckCircle2,
  X
} from 'lucide-react';

const App = () => {
  // State Management
  const [meals, setMeals] = useState([
    { id: 1, name: 'Oatmeal with Blueberries', calories: 350, protein: 12, carbs: 60, fat: 5, type: 'Breakfast' },
    { id: 2, name: 'Grilled Chicken Salad', calories: 450, protein: 40, carbs: 10, fat: 15, type: 'Lunch' },
  ]);
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: '',
    calories: '',
    protein: '',
    carbs: '',
    fat: '',
    type: 'Breakfast'
  });

  const dailyGoal = 2200;

  // Derived Calculations
  const totals = useMemo(() => {
    return meals.reduce((acc, meal) => ({
      calories: acc.calories + Number(meal.calories || 0),
      protein: acc.protein + Number(meal.protein || 0),
      carbs: acc.carbs + Number(meal.carbs || 0),
      fat: acc.fat + Number(meal.fat || 0),
    }), { calories: 0, protein: 0, carbs: 0, fat: 0 });
  }, [meals]);

  const progressPercentage = Math.min((totals.calories / dailyGoal) * 100, 100);

  // Handlers
  const addMeal = (e) => {
    e.preventDefault();
    if (!newMeal.name || !newMeal.calories) return;
    
    setMeals([...meals, { ...newMeal, id: Date.now() }]);
    setNewMeal({ name: '', calories: '', protein: '', carbs: '', fat: '', type: 'Breakfast' });
    setShowAddModal(false);
  };

  const removeMeal = (id) => {
    setMeals(meals.filter(m => m.id !== id));
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans pb-20">
      {/* Header */}
      <header className="bg-white border-b border-slate-200 px-6 py-4 sticky top-0 z-10">
        <div className="max-w-md mx-auto flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-indigo-600">NutriFlow</h1>
            <p className="text-xs text-slate-500 font-medium">Tuesday, May 5</p>
          </div>
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
            <Activity size={20} className="text-indigo-600" />
          </div>
        </div>
      </header>

      <main className="max-w-md mx-auto px-4 mt-6 space-y-6">
        
        {/* Daily Progress Card */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
          <div className="flex justify-between items-end mb-4">
            <div>
              <p className="text-sm text-slate-500 font-medium uppercase tracking-wider">Calories</p>
              <h2 className="text-3xl font-black text-slate-800">
                {totals.calories} <span className="text-lg font-normal text-slate-400">/ {dailyGoal} kcal</span>
              </h2>
            </div>
            <div className="text-right">
              <span className={`text-sm font-bold px-2 py-1 rounded-lg ${progressPercentage > 90 ? 'bg-orange-100 text-orange-600' : 'bg-indigo-100 text-indigo-600'}`}>
                {Math.round(progressPercentage)}%
              </span>
            </div>
          </div>
          
          <div className="w-full bg-slate-100 h-3 rounded-full overflow-hidden mb-6">
            <div 
              className="bg-indigo-500 h-full transition-all duration-500 ease-out"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="grid grid-cols-3 gap-4">
            <MacroIndicator label="Protein" value={totals.protein} unit="g" color="bg-blue-500" />
            <MacroIndicator label="Carbs" value={totals.carbs} unit="g" color="bg-emerald-500" />
            <MacroIndicator label="Fat" value={totals.fat} unit="g" color="bg-amber-500" />
          </div>
        </section>

        {/* Meal History */}
        <section className="space-y-3">
          <div className="flex justify-between items-center px-2">
            <h3 className="font-bold text-slate-700">Today's Log</h3>
            <button className="text-sm text-indigo-600 font-semibold">View All</button>
          </div>
          
          {meals.length === 0 ? (
            <div className="bg-white rounded-2xl p-8 text-center border-2 border-dashed border-slate-200">
              <Utensils className="mx-auto text-slate-300 mb-2" size={32} />
              <p className="text-slate-400 text-sm">No meals logged yet today</p>
            </div>
          ) : (
            meals.map(meal => (
              <div key={meal.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 shadow-sm border border-slate-100 group">
                <div className="w-12 h-12 rounded-xl bg-slate-50 flex items-center justify-center shrink-0">
                  <Utensils className="text-slate-400" size={20} />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-slate-800 truncate">{meal.name}</h4>
                  <p className="text-xs text-slate-400 font-medium">{meal.type} • {meal.protein}g P • {meal.carbs}g C</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-slate-800">{meal.calories}</p>
                  <p className="text-[10px] text-slate-400 uppercase font-bold">kcal</p>
                </div>
                <button 
                  onClick={() => removeMeal(meal.id)}
                  className="p-2 text-slate-300 hover:text-red-500 transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))
          )}
        </section>
      </main>

      {/* Floating Action Button */}
      <button 
        onClick={() => setShowAddModal(true)}
        className="fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-200 flex items-center justify-center hover:bg-indigo-700 transition-transform active:scale-95 z-20"
      >
        <Plus size={28} />
      </button>

      {/* Add Meal Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setShowAddModal(false)} />
          <div className="relative bg-white w-full max-w-md rounded-t-[2.5rem] sm:rounded-[2.5rem] p-8 shadow-2xl animate-in slide-in-from-bottom duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800">Add Meal</h2>
              <button onClick={() => setShowAddModal(false)} className="p-2 bg-slate-100 rounded-full text-slate-500">
                <X size={20} />
              </button>
            </div>
            
            <form onSubmit={addMeal} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase ml-1">Meal Name</label>
                <input 
                  type="text" 
                  placeholder="e.g. Greek Yogurt"
                  className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none mt-1"
                  value={newMeal.name}
                  onChange={e => setNewMeal({...newMeal, name: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Calories</label>
                  <input 
                    type="number" 
                    placeholder="0"
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none mt-1"
                    value={newMeal.calories}
                    onChange={e => setNewMeal({...newMeal, calories: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-400 uppercase ml-1">Category</label>
                  <select 
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none mt-1 appearance-none"
                    value={newMeal.type}
                    onChange={e => setNewMeal({...newMeal, type: e.target.value})}
                  >
                    <option>Breakfast</option>
                    <option>Lunch</option>
                    <option>Dinner</option>
                    <option>Snack</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Protein (g)</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none mt-1"
                    value={newMeal.protein}
                    onChange={e => setNewMeal({...newMeal, protein: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Carbs (g)</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none mt-1"
                    value={newMeal.carbs}
                    onChange={e => setNewMeal({...newMeal, carbs: e.target.value})}
                  />
                </div>
                <div>
                  <label className="text-[10px] font-bold text-slate-400 uppercase ml-1">Fat (g)</label>
                  <input 
                    type="number" 
                    className="w-full bg-slate-50 border-none rounded-2xl px-4 py-3 focus:ring-2 focus:ring-indigo-500 outline-none mt-1"
                    value={newMeal.fat}
                    onChange={e => setNewMeal({...newMeal, fat: e.target.value})}
                  />
                </div>
              </div>

              <button 
                type="submit"
                className="w-full bg-indigo-600 text-white font-bold py-4 rounded-2xl mt-4 shadow-lg shadow-indigo-100 hover:bg-indigo-700 active:scale-95 transition-all"
              >
                Save Meal
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

const MacroIndicator = ({ label, value, unit, color }) => (
  <div className="flex flex-col items-center p-3 rounded-2xl bg-slate-50">
    <div className={`w-2 h-2 rounded-full ${color} mb-1`} />
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">{label}</p>
    <p className="text-sm font-bold text-slate-700">{value || 0}{unit}</p>
  </div>
);

export default App;

```
