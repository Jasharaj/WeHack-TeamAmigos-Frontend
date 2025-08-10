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
  Users,
  Scale,
  FileText
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

export default function LawyerRemindersPage() {
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
    console.log('Lawyer Raw data:', { 
      reminders: reminders.length, 
      cases: cases.length, 
      disputes: disputes.length 
    });
    
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
    console.log('Lawyer Cases with hearings:', casesWithHearings.length, casesWithHearings);
    
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
    console.log('Lawyer Disputes with hearings:', disputesWithHearings.length, disputesWithHearings);
    
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
    
    console.log('Lawyer Generated calendar events:', combinedEvents);
    console.log('Lawyer Event breakdown - Reminders:', reminderEvents.length, 'Cases:', caseEvents.length, 'Disputes:', disputeEvents.length);
    setEvents(combinedEvents);
  }, [reminders, cases, disputes]);

  // Fetch all data (reminders, cases, disputes)
  const fetchAllData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      if (!token) {
        console.error('No authentication token found');
        // For testing purposes, add some sample data when no token
        const sampleReminders: Reminder[] = [
          {
            _id: 'lawyer-reminder-1',
            title: 'Client consultation',
            description: 'Meeting with new client regarding case',
            dueDate: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
            priority: 'high',
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        
        const sampleCases: Case[] = [
          {
            _id: 'lawyer-case-1',
            title: 'Criminal Defense Case',
            description: 'Defending client in theft case',
            status: 'in progress',
            caseType: 'criminal',
            priority: 'high',
            nextHearing: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            hearingLocation: 'Criminal Court Room 1',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        
        const sampleDisputes: EnhancedDispute[] = [
          {
            _id: 'lawyer-dispute-1',
            title: 'Contract Dispute Resolution',
            description: 'Business contract disagreement',
            status: 'active',
            category: 'business',
            priority: 'medium',
            nextHearing: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
            hearingLocation: 'Civil Court',
            assignedLawyer: {
              _id: 'lawyer-1',
              name: 'John Doe',
              email: 'john@law.com'
            },
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ];
        
        setReminders(sampleReminders);
        setCases(sampleCases);
        setDisputes(sampleDisputes);
        return;
      }

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

      if (remindersRes.ok) {
        const remindersData = await remindersRes.json();
        setReminders(remindersData.data || []);
      } else {
        console.log('Reminders API failed:', await remindersRes.text());
      }

      if (casesRes.ok) {
        const casesData = await casesRes.json();
        setCases(casesData.data || []);
      } else {
        console.log('Cases API failed:', await casesRes.text());
      }

      if (disputesRes.ok) {
        const disputesData = await disputesRes.json();
        setDisputes(disputesData.data || []);
      } else {
        console.log('Disputes API failed:', await disputesRes.text());
      }

    } catch (err) {
      console.error('Error fetching data:', err);
      // Fallback to sample data on error
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
    let backgroundColor = '#10b981';
    let color = 'white';
    
    switch (event.type) {
      case 'reminder':
        switch (event.priority) {
          case 'high':
            backgroundColor = '#ef4444';
            break;
          case 'medium':
            backgroundColor = '#f59e0b';
            break;
          default:
            backgroundColor = '#10b981';
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
  const assignedCasesCount = cases.length;
  const assignedDisputesCount = disputes.filter(d => d.assignedLawyer).length;

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
          <span className="text-lg text-slate-600">Loading your legal schedule...</span>
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
              <Scale className="w-7 h-7 text-white" />
            </motion.div>
            <div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 bg-clip-text text-transparent">
                Legal Calendar & Reminders
              </h1>
              <p className="text-slate-600">Track cases, hearings, disputes, and personal tasks</p>
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
                <p className="text-2xl font-bold text-slate-900">{assignedCasesCount}</p>
                <p className="text-sm text-slate-600">Assigned Cases</p>
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
                <p className="text-2xl font-bold text-slate-900">{assignedDisputesCount}</p>
                <p className="text-sm text-slate-600">Active Disputes</p>
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

        {/* Main Content - Calendar View Only for simplicity */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden mb-8"
        >
          <div className="p-6 border-b border-slate-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Legal Schedule Overview</h2>
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
              key={events.length} // Force re-render when events change
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              eventPropGetter={eventStyleGetter}
              views={['month', 'week', 'day', 'agenda']}
              defaultView={Views.MONTH}
              popup
              style={{ height: '100%' }}
              onSelectEvent={(event: any) => {
                console.log('Selected event:', event);
              }}
            />
          </div>
        </motion.div>
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
                  <div className="w-10 h-10 bg-gradient-to-br from-emerald-600 to-teal-600 rounded-xl flex items-center justify-center">
                    <Plus className="w-5 h-5 text-white" />
                  </div>
                  <h2 className="text-xl font-bold text-slate-900">New Legal Reminder</h2>
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
                    placeholder="e.g., Court hearing preparation, Client meeting, File submission deadline"
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
                    placeholder="Additional details or notes"
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
                      Priority Level
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
