'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Calendar as BigCalendar, momentLocalizer, Views } from 'react-big-calendar';
import moment from 'moment';
import { 
  Bell, 
  Plus, 
  Search, 
  Check, 
  Clock, 
  AlertTriangle, 
  Flag,
  Calendar,
  X,
  Trash2,
  CheckCircle2,
  CalendarDays,
  List,
  ChevronLeft,
  ChevronRight,
  Gavel,
  Users
} from 'lucide-react';
import config from '@/config';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Set up the localizer for BigCalendar
const localizer = momentLocalizer(moment);

interface Reminder {
  _id: string;
  title: string;
  description?: string;
  dueDate: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  completedAt?: string;
  caseId?: string;
  caseName?: string;
  createdAt: string;
  updatedAt: string;
}

interface Case {
  _id: string;
  title: string;
  description: string;
  status: string;
  caseType: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  nextHearing?: string;
  hearingLocation?: string;
}

interface EnhancedDispute {
  _id: string;
  title: string;
  description: string;
  status: string;
  category: string;
  priority: string;
  createdAt: string;
  updatedAt: string;
  nextHearing?: string;
  hearingLocation?: string;
  assignedLawyer?: {
    _id: string;
    name: string;
    email: string;
  };
}

interface CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;
  type: 'reminder' | 'case' | 'dispute' | 'hearing';
  priority?: string;
  status?: string;
  description?: string;
  resource?: any;
}

const priorityConfig = {
  high: {
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: AlertTriangle,
    label: 'High Priority'
  },
  medium: {
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: Flag,
    label: 'Medium Priority'
  },
  low: {
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Clock,
    label: 'Low Priority'
  }
};

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [cases, setCases] = useState<Case[]>([]);
  const [disputes, setDisputes] = useState<EnhancedDispute[]>([]);
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  
  const [showNewReminderModal, setShowNewReminderModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('all');
  const [showCompleted, setShowCompleted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'calendar' | 'list'>('calendar');
  
  // Calendar state
  const [date, setDate] = useState(new Date());
  const [currentView, setCurrentView] = useState('month');
  
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: '',
    description: '',
    dueDate: '',
    priority: 'medium',
    completed: false
  });

  // Load all data on mount
  useEffect(() => {
    fetchAllData();
  }, []);

  // Combine all events for calendar
  useEffect(() => {
    const reminderEvents = reminders.map(reminder => ({
      id: reminder._id,
      title: `📋 ${reminder.title}`,
      start: new Date(reminder.dueDate),
      end: new Date(reminder.dueDate),
      type: 'reminder' as const,
      priority: reminder.priority,
      description: reminder.description,
      resource: reminder
    }));
    
    const casesWithHearings = cases.filter(c => c.nextHearing);
    
    const caseEvents = casesWithHearings.map(caseItem => ({
      id: `case-${caseItem._id}`,
      title: `⚖️ ${caseItem.title}`,
      start: new Date(caseItem.nextHearing!),
      end: new Date(caseItem.nextHearing!),
      type: 'case' as const,
      status: caseItem.status,
      description: `Case hearing: ${caseItem.description}`,
      resource: caseItem
    }));
    
    const disputesWithHearings = disputes.filter(d => d.nextHearing);
    
    const disputeEvents = disputesWithHearings.map(dispute => ({
      id: `dispute-${dispute._id}`,
      title: `🤝 ${dispute.title}`,
      start: new Date(dispute.nextHearing!),
      end: new Date(dispute.nextHearing!),
      type: 'dispute' as const,
      status: dispute.status,
      description: `Dispute hearing: ${dispute.description}`,
      resource: dispute
    }));
    
    const combinedEvents: CalendarEvent[] = [
      ...reminderEvents,
      ...caseEvents,
      ...disputeEvents
    ];
    
    setEvents(combinedEvents);
  }, [reminders, cases, disputes]);

  // Fetch all data (reminders, cases, disputes)
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');

      // Always try to fetch real data first
      if (token) {
        try {
          // Fetch reminders, cases, and disputes in parallel
          const [remindersRes, casesRes, disputesRes] = await Promise.all([
            fetch(`${config.BASE_URL}/api/v1/reminders`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }),
            fetch(`${config.BASE_URL}/api/v1/cases`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            }),
            fetch(`${config.BASE_URL}/api/v1/disputes`, {
              headers: {
                'Authorization': `Bearer ${token}`,
                'Content-Type': 'application/json'
              }
            })
          ]);

          console.log('API Response status:', {
            reminders: remindersRes.status,
            cases: casesRes.status,
            disputes: disputesRes.status
          });

          if (remindersRes.ok) {
            const remindersData = await remindersRes.json();
            setReminders(remindersData.data || remindersData || []);
          } else {
            setReminders([]);
          }

          if (casesRes.ok) {
            const casesData = await casesRes.json();
            setCases(casesData.data || casesData || []);
          } else {
            setCases([]);
          }

          if (disputesRes.ok) {
            const disputesData = await disputesRes.json();
            setDisputes(disputesData.data || disputesData || []);
          } else {
            setDisputes([]);
          }

        } catch (apiError) {
          console.error('API Error:', apiError);
          // If API calls fail, set empty arrays for now
          setReminders([]);
          setCases([]);
          setDisputes([]);
        }
      } else {
        // No token - user not logged in, set empty arrays
        setReminders([]);
        setCases([]);
        setDisputes([]);
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      // Fallback to empty data on error
      setReminders([]);
      setCases([]);
      setDisputes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleAddReminder = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        console.error('No authentication token found');
        return;
      }

      const response = await fetch(`${config.BASE_URL}/api/v1/reminders`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(newReminder)
      });

      if (!response.ok) {
        throw new Error('Failed to create reminder');
      }

      const data = await response.json();
      setReminders(prev => [data.data, ...prev]);
      setShowNewReminderModal(false);
      resetForm();
    } catch (err) {
      console.error('Error creating reminder:', err);
    }
  };

  const resetForm = () => {
    setNewReminder({
      title: '',
      description: '',
      dueDate: '',
      priority: 'medium',
      completed: false
    });
  };

  // Utility functions
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const isOverdue = (dueDate: string) => {
    return new Date(dueDate) < new Date();
  };

  const toggleReminderComplete = async (reminderId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const reminder = reminders.find(r => r._id === reminderId);
      if (!reminder) return;

      const response = await fetch(`${config.BASE_URL}/api/v1/reminders/${reminderId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...reminder,
          completed: !reminder.completed,
          completedAt: !reminder.completed ? new Date().toISOString() : undefined
        })
      });

      if (response.ok) {
        const data = await response.json();
        setReminders(prev => prev.map(r => 
          r._id === reminderId ? data.data : r
        ));
      }
    } catch (err) {
      console.error('Error toggling reminder:', err);
    }
  };

  const deleteReminder = async (reminderId: string) => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const response = await fetch(`${config.BASE_URL}/api/v1/reminders/${reminderId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setReminders(prev => prev.filter(r => r._id !== reminderId));
      }
    } catch (err) {
      console.error('Error deleting reminder:', err);
    }
  };

  // Custom event styling for calendar
  const eventStyleGetter = (event: CalendarEvent) => {
    let backgroundColor = '#10b981'; // emerald-500
    let color = 'white';
    
    switch (event.type) {
      case 'reminder':
        switch (event.priority) {
          case 'high':
            backgroundColor = '#ef4444'; // red-500
            break;
          case 'medium':
            backgroundColor = '#f59e0b'; // amber-500
            break;
          default:
            backgroundColor = '#10b981'; // emerald-500
        }
        break;
      case 'case':
        backgroundColor = '#14b8a6'; // teal-500
        break;
      case 'dispute':
        backgroundColor = '#059669'; // emerald-600
        break;
    }
    
    return {
      style: {
        backgroundColor,
        color,
        borderRadius: '8px',
        border: 'none',
        fontSize: '13px',
        padding: '2px 6px'
      }
    };
  };

  // Filter functions
  const filteredReminders = reminders.filter(reminder => {
    const matchesSearch = reminder.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (reminder.description?.toLowerCase().includes(searchQuery.toLowerCase()) ?? false);
    const matchesPriority = selectedPriority === 'all' || reminder.priority === selectedPriority;
    const matchesCompleted = showCompleted || !reminder.completed;
    
    return matchesSearch && matchesPriority && matchesCompleted;
  });

  const sortedReminders = filteredReminders.sort((a, b) => {
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
  });

  const pendingCount = reminders.filter(r => !r.completed).length;
  const overdueCount = reminders.filter(r => !r.completed && isOverdue(r.dueDate)).length;

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white flex items-center justify-center"
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full mx-auto mb-4"
          />
          <span className="text-lg text-slate-600">Loading your schedule...</span>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-white via-emerald-50/30 to-white relative overflow-hidden"
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          animate={{
            backgroundPosition: ['0% 0%', '100% 100%'],
          }}
          transition={{
            duration: 30,
            repeat: Infinity,
            repeatType: 'reverse',
          }}
          className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 via-white to-teal-50/30"
          style={{
            backgroundSize: '400% 400%',
          }}
        />
        
        {/* Floating particles */}
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-emerald-300/20 rounded-full"
            animate={{
              y: [0, -100, 0],
              x: [0, Math.random() * 100 - 50, 0],
              opacity: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              delay: Math.random() * 5,
            }}
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
            }}
          />
        ))}
      </div>

      <div className="relative z-10 max-w-7xl mx-auto p-6">
        {/* Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8"
        >
          <div className="flex items-center gap-4 mb-4 lg:mb-0">
            <motion.div 
              className="w-14 h-14 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-2xl flex items-center justify-center shadow-lg"
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            >
              <Calendar className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Schedule & Reminders
              </h1>
              <p className="text-slate-600">Manage your cases, disputes, and personal reminders</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {/* View Toggle */}
            <div className="bg-white rounded-xl border border-slate-200 p-1 shadow-lg">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('calendar')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  viewMode === 'calendar' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CalendarDays className="w-4 h-4" />
                Calendar
              </motion.button>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 p-1 shadow-lg">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setViewMode('list')}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <List className="w-4 h-4" />
                List
              </motion.button>
            </div>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNewReminderModal(true)}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white rounded-xl font-semibold shadow-lg transition-all duration-200"
            >
              <Plus className="w-5 h-5" />
              New Reminder
            </motion.button>
          </div>
        </motion.div>

        {/* Enhanced Stats Dashboard */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8"
        >
          <motion.div 
            className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center">
                <Bell className="w-6 h-6 text-emerald-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{pendingCount}</p>
                <p className="text-sm text-slate-600">Pending Reminders</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Gavel className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{cases.length}</p>
                <p className="text-sm text-slate-600">Active Cases</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <Users className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{disputes.length}</p>
                <p className="text-sm text-slate-600">Disputes</p>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6"
            whileHover={{ y: -5, boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)" }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
          >
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                overdueCount > 0 ? 'bg-red-100' : 'bg-green-100'
              }`}>
                {overdueCount > 0 ? (
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                ) : (
                  <CheckCircle2 className="w-6 h-6 text-green-600" />
                )}
              </div>
              <div>
                <p className="text-2xl font-bold text-slate-900">{overdueCount}</p>
                <p className="text-sm text-slate-600">Overdue Items</p>
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* Main Content - Calendar or List View */}
        <AnimatePresence mode="wait">
          {viewMode === 'calendar' ? (
            <motion.div
              key="calendar"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden"
            >
              <div className="p-6 border-b border-slate-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-xl font-bold text-slate-900">Schedule Overview</h2>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                      <span className="text-slate-600">Reminders</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-teal-500 rounded-full"></div>
                      <span className="text-slate-600">Cases</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 bg-emerald-600 rounded-full"></div>
                      <span className="text-slate-600">Disputes</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="p-6" style={{ height: '600px' }}>
                <BigCalendar
                  localizer={localizer}
                  events={events}
                  startAccessor="start"
                  endAccessor="end"
                  eventPropGetter={eventStyleGetter}
                  views={['month', 'week', 'day', 'agenda']}
                  defaultView={Views.MONTH}
                  style={{ height: '100%' }}
                  date={date}
                  onNavigate={(newDate) => {
                    console.log('Calendar navigated to:', newDate);
                    setDate(newDate);
                  }}
                  onView={(view) => {
                    console.log('Calendar view changed to:', view);
                    setCurrentView(view);
                  }}
                  onSelectEvent={(event: any) => {
                    console.log('Selected event:', event);
                  }}
                  showMultiDayTimes
                  popup
                  step={60}
                  timeslots={2}
                  messages={{
                    today: 'Today',
                    previous: '<',
                    next: '>',
                    month: 'Month',
                    week: 'Week',
                    day: 'Day',
                    agenda: 'Agenda',
                    noEventsInRange: 'No events scheduled for this time period.',
                    showMore: (total) => `+${total} more`
                  }}
                />
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="list"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ delay: 0.3 }}
            >
              {/* Filters for List View */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl border border-slate-200 shadow-lg p-6 mb-6"
              >
                <div className="flex flex-col lg:flex-row gap-4">
                  {/* Search */}
                  <div className="flex-1 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                    <input
                      type="text"
                      placeholder="Search reminders..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 transition-all duration-200"
                    />
                  </div>

                  {/* Priority Filter */}
                  <select
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                    className="px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 transition-all duration-200"
                  >
                    <option value="all">All Priorities</option>
                    <option value="high">High Priority</option>
                    <option value="medium">Medium Priority</option>
                    <option value="low">Low Priority</option>
                  </select>

                  {/* Show Completed Toggle */}
                  <label className="flex items-center gap-2 px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl cursor-pointer">
                    <input
                      type="checkbox"
                      checked={showCompleted}
                      onChange={(e) => setShowCompleted(e.target.checked)}
                      className="w-4 h-4 text-emerald-600 bg-white border-slate-300 rounded focus:ring-emerald-300"
                    />
                    <span className="text-slate-700 font-medium">Show Completed</span>
                  </label>
                </div>
              </motion.div>

              {/* Reminders List */}
              <AnimatePresence>
                {sortedReminders.length === 0 ? (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-16 bg-white rounded-2xl border border-slate-200 shadow-lg"
                  >
                    <motion.div
                      animate={{ 
                        rotate: [0, 5, -5, 0],
                        scale: [1, 1.05, 1]
                      }}
                      transition={{ 
                        duration: 4,
                        repeat: Infinity,
                        repeatType: "reverse"
                      }}
                      className="w-24 h-24 bg-gradient-to-br from-slate-100 to-slate-200 rounded-3xl flex items-center justify-center mx-auto mb-6"
                    >
                      <Bell className="w-12 h-12 text-slate-400" />
                    </motion.div>
                    
                    <h3 className="text-xl font-bold text-slate-800 mb-4">No reminders found</h3>
                    <p className="text-slate-600 mb-8">
                      {searchQuery || selectedPriority !== 'all' 
                        ? 'No reminders match your current filters.' 
                        : 'Create your first reminder to get started.'}
                    </p>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setShowNewReminderModal(true)}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-200"
                    >
                      <Plus className="w-5 h-5" />
                      Create First Reminder
                    </motion.button>
                  </motion.div>
                ) : (
                  <div className="space-y-4">
                    {sortedReminders.map((reminder, index) => {
                      const priorityInfo = priorityConfig[reminder.priority];
                      const PriorityIcon = priorityInfo.icon;
                      const overdue = isOverdue(reminder.dueDate);
                      
                      return (
                        <motion.div
                          key={reminder._id}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.05 }}
                          whileHover={{ y: -2, boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
                          className={`bg-white rounded-2xl border shadow-lg p-6 transition-all duration-200 ${
                            reminder.completed 
                              ? 'border-slate-200 opacity-60' 
                              : overdue 
                                ? 'border-red-200 bg-red-50/30' 
                                : 'border-slate-200 hover:border-emerald-200'
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            {/* Checkbox */}
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => toggleReminderComplete(reminder._id)}
                              className={`flex-shrink-0 w-6 h-6 rounded-full border-2 transition-all duration-200 flex items-center justify-center ${
                                reminder.completed
                                  ? 'bg-emerald-600 border-emerald-600'
                                  : 'border-slate-300 hover:border-emerald-400'
                              }`}
                            >
                              {reminder.completed && <Check className="w-4 h-4 text-white" />}
                            </motion.button>

                            {/* Content */}
                            <div className="flex-1 min-w-0">
                              <div className="flex items-start justify-between mb-2">
                                <h3 className={`font-semibold text-lg ${
                                  reminder.completed ? 'line-through text-slate-500' : 'text-slate-900'
                                }`}>
                                  {reminder.title}
                                </h3>
                                
                                <div className="flex items-center gap-2 ml-4">
                                  <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-full border ${priorityInfo.color}`}>
                                    <PriorityIcon className="w-3 h-3" />
                                    {reminder.priority}
                                  </span>
                                  
                                  <motion.button
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    onClick={() => deleteReminder(reminder._id)}
                                    className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all duration-200"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </motion.button>
                                </div>
                              </div>

                              {reminder.description && (
                                <p className={`text-sm mb-3 ${
                                  reminder.completed ? 'text-slate-400' : 'text-slate-600'
                                }`}>
                                  {reminder.description}
                                </p>
                              )}

                              <div className="flex items-center gap-4 text-sm">
                                <div className={`flex items-center gap-1.5 ${
                                  overdue && !reminder.completed ? 'text-red-600' : 'text-slate-500'
                                }`}>
                                  <Calendar className="w-4 h-4" />
                                  {formatDate(reminder.dueDate)}
                                </div>
                                
                                {overdue && !reminder.completed && (
                                  <motion.span 
                                    animate={{ scale: [1, 1.05, 1] }}
                                    transition={{ duration: 2, repeat: Infinity }}
                                    className="inline-flex items-center gap-1 text-red-600 text-xs font-medium"
                                  >
                                    <AlertTriangle className="w-3 h-3" />
                                    Overdue
                                  </motion.span>
                                )}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      );
                    })}
                  </div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Enhanced New Reminder Modal */}
      <AnimatePresence>
        {showNewReminderModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-6"
            onClick={() => setShowNewReminderModal(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg relative overflow-hidden"
            >
              {/* Gradient header */}
              <div className="h-2 bg-gradient-to-r from-emerald-500 to-teal-600"></div>
              
              <div className="flex items-center justify-between p-6 border-b border-slate-200">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">New Reminder</h2>
                </div>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setShowNewReminderModal(false)}
                  className="p-2 hover:bg-slate-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5 text-slate-500" />
                </motion.button>
              </div>

              <form onSubmit={handleAddReminder} className="p-6 space-y-6">
                {/* Title */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Reminder Title
                  </label>
                  <input
                    type="text"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, title: e.target.value }))}
                    placeholder="Enter reminder title"
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 transition-all duration-200"
                    required
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-3">
                    Description (Optional)
                  </label>
                  <textarea
                    value={newReminder.description}
                    onChange={(e) => setNewReminder(prev => ({ ...prev, description: e.target.value }))}
                    placeholder="Brief description"
                    rows={3}
                    className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 resize-none transition-all duration-200"
                  />
                </div>

                {/* Due Date & Priority */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Due Date
                    </label>
                    <input
                      type="datetime-local"
                      value={newReminder.dueDate}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, dueDate: e.target.value }))}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 transition-all duration-200"
                      required
                    />
                  </div>
                  
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-3">
                      Priority
                    </label>
                    <select
                      value={newReminder.priority}
                      onChange={(e) => setNewReminder(prev => ({ ...prev, priority: e.target.value as 'high' | 'medium' | 'low' }))}
                      className="w-full px-4 py-3 border border-slate-200 rounded-xl focus:ring-2 focus:ring-emerald-300 focus:border-emerald-400 text-slate-900 transition-all duration-200"
                    >
                      <option value="low">Low Priority</option>
                      <option value="medium">Medium Priority</option>
                      <option value="high">High Priority</option>
                    </select>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3 pt-4">
                  <motion.button
                    type="button"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setShowNewReminderModal(false)}
                    className="flex-1 px-4 py-3 border border-slate-200 text-slate-700 rounded-xl font-medium hover:bg-slate-50 transition-colors"
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 shadow-lg transition-all duration-200"
                  >
                    Create Reminder
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
