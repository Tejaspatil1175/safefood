import api from './api';
import complaintsService from './complaints';

const IS_MOCK_ENABLED = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === true;
const USERS_STORAGE_KEY = 'trustlabel_admin_users';
const OFFICERS_STORAGE_KEY = 'trustlabel_admin_officers';

// Initial Mock Users (Citizens)
export const INITIAL_USERS = [
  { id: 'usr-101', name: 'Aarav Sharma', email: 'user@test.com', joinedAt: '2026-08-12', totalScans: 18, complaintsRaised: 3, status: 'Active', phone: '+91 98111 23456', city: 'New Delhi' },
  { id: 'usr-102', name: 'Meera Nair', email: 'meera.nair@example.com', joinedAt: '2026-08-19', totalScans: 9, complaintsRaised: 1, status: 'Active', phone: '+91 98222 34567', city: 'Bengaluru' },
  { id: 'usr-103', name: 'Rohan Gupta', email: 'rohan.gupta@example.com', joinedAt: '2026-08-25', totalScans: 24, complaintsRaised: 2, status: 'Active', phone: '+91 98333 45678', city: 'Mumbai' },
  { id: 'usr-104', name: 'Kavita Sundaram', email: 'kavita.s@example.com', joinedAt: '2026-09-02', totalScans: 14, complaintsRaised: 1, status: 'Active', phone: '+91 98444 56789', city: 'Chennai' },
  { id: 'usr-105', name: 'Vikram Sethi', email: 'vikram.sethi@example.com', joinedAt: '2026-09-08', totalScans: 6, complaintsRaised: 1, status: 'Active', phone: '+91 98555 67890', city: 'Chandigarh' },
  { id: 'usr-106', name: 'Ananya Deshmukh', email: 'ananya.d@example.com', joinedAt: '2026-09-14', totalScans: 11, complaintsRaised: 1, status: 'Active', phone: '+91 98666 78901', city: 'Pune' },
  { id: 'usr-107', name: 'Siddharth Patel', email: 'siddharth.p@example.com', joinedAt: '2026-09-18', totalScans: 31, complaintsRaised: 0, status: 'Active', phone: '+91 98777 89012', city: 'Ahmedabad' },
  { id: 'usr-108', name: 'Pooja Bhattacharya', email: 'pooja.b@example.com', joinedAt: '2026-09-21', totalScans: 4, complaintsRaised: 0, status: 'Suspended', phone: '+91 98888 90123', city: 'Kolkata' },
  { id: 'usr-109', name: 'Arjun Reddy', email: 'arjun.reddy@example.com', joinedAt: '2026-09-24', totalScans: 16, complaintsRaised: 2, status: 'Active', phone: '+91 98999 01234', city: 'Hyderabad' },
  { id: 'usr-110', name: 'Divya Chawla', email: 'divya.c@example.com', joinedAt: '2026-09-28', totalScans: 8, complaintsRaised: 0, status: 'Active', phone: '+91 98123 45678', city: 'Gurugram' },
  { id: 'usr-111', name: 'Manish Trivedi', email: 'manish.t@example.com', joinedAt: '2026-10-01', totalScans: 2, complaintsRaised: 0, status: 'Active', phone: '+91 98234 56789', city: 'Jaipur' },
  { id: 'usr-112', name: 'Sneha Kulkarni', email: 'sneha.k@example.com', joinedAt: '2026-10-04', totalScans: 19, complaintsRaised: 1, status: 'Active', phone: '+91 98345 67890', city: 'Nagpur' },
];

// Initial Mock Enforcement Officers
export const INITIAL_OFFICERS = [
  {
    id: 'off-1',
    name: 'Insp. Priya Verma',
    email: 'officer@test.com',
    badgeNumber: 'LM-DEL-884',
    jurisdiction: 'State Legal Metrology Cell - North Division',
    totalScansDone: 48,
    phone: '+91 99111 88401',
    status: 'Active',
    joinedAt: '2025-06-15',
  },
  {
    id: 'off-2',
    name: 'Insp. Rajesh Kumar',
    email: 'rajesh.kumar@legalmetrology.gov.in',
    badgeNumber: 'LM-DEL-712',
    jurisdiction: 'State Legal Metrology Cell - South Division',
    totalScansDone: 62,
    phone: '+91 99222 71202',
    status: 'Active',
    joinedAt: '2025-04-10',
  },
  {
    id: 'off-3',
    name: 'Insp. Sunita Rao',
    email: 'sunita.rao@legalmetrology.gov.in',
    badgeNumber: 'LM-MUM-429',
    jurisdiction: 'Maharashtra State Enforcement - Zone 2',
    totalScansDone: 35,
    phone: '+91 99333 42903',
    status: 'Active',
    joinedAt: '2025-09-01',
  },
  {
    id: 'off-4',
    name: 'Insp. Amitav Sengupta',
    email: 'amitav.s@legalmetrology.gov.in',
    badgeNumber: 'LM-WB-105',
    jurisdiction: 'Eastern Region Surveillance Division',
    totalScansDone: 29,
    phone: '+91 99444 10504',
    status: 'Active',
    joinedAt: '2025-11-20',
  },
  {
    id: 'off-5',
    name: 'Insp. Deepak Choudhary',
    email: 'deepak.c@legalmetrology.gov.in',
    badgeNumber: 'LM-BLR-553',
    jurisdiction: 'Karnataka Central Legal Metrology Unit',
    totalScansDone: 51,
    phone: '+91 99555 55305',
    status: 'Active',
    joinedAt: '2025-03-05',
  },
];

const getUsersStore = () => {
  try {
    const raw = localStorage.getItem(USERS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load users from localStorage', err);
  }
  const init = JSON.parse(JSON.stringify(INITIAL_USERS));
  localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(init));
  return init;
};

const saveUsersStore = (data) => {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to persist users to localStorage', err);
  }
};

const getOfficersStore = () => {
  try {
    const raw = localStorage.getItem(OFFICERS_STORAGE_KEY);
    if (raw) return JSON.parse(raw);
  } catch (err) {
    console.warn('Failed to load officers from localStorage', err);
  }
  const init = JSON.parse(JSON.stringify(INITIAL_OFFICERS));
  localStorage.setItem(OFFICERS_STORAGE_KEY, JSON.stringify(init));
  return init;
};

const saveOfficersStore = (data) => {
  try {
    localStorage.setItem(OFFICERS_STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to persist officers to localStorage', err);
  }
};

export const adminService = {
  /**
   * Get dynamic Admin Dashboard metrics
   */
  async getDashboardStats() {
    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    const users = getUsersStore();
    const officers = getOfficersStore();
    const { counts } = await complaintsService.getAllComplaints();

    return {
      totalUsers: users.length,
      totalOfficers: officers.length,
      totalComplaints: counts.all,
      pendingAssignment: counts.unassigned,
      underInvestigation: counts.underInvestigation,
      verifiedGenuine: counts.verifiedGenuine,
      verifiedNotGenuine: counts.verifiedNotGenuine,
    };
  },

  /**
   * Get registered system users with search, status filtering, and pagination
   */
  async getUsers(params = {}) {
    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    const { search = '', status = 'all', page = 1, limit = 10 } = params;
    let list = getUsersStore();

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (u) =>
          u.name.toLowerCase().includes(q) ||
          u.email.toLowerCase().includes(q) ||
          (u.city && u.city.toLowerCase().includes(q))
      );
    }

    if (status && status !== 'all') {
      list = list.filter((u) => u.status.toLowerCase() === status.toLowerCase());
    }

    const total = list.length;
    const numPage = Number(page) || 1;
    const numLimit = Number(limit) || 10;
    const totalPages = Math.ceil(total / numLimit) || 1;
    const startIndex = (numPage - 1) * numLimit;
    const paginated = list.slice(startIndex, startIndex + numLimit);

    return {
      users: paginated,
      total,
      page: numPage,
      totalPages,
    };
  },

  /**
   * Toggle user active/suspended status
   */
  async toggleUserStatus(userId) {
    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    const users = getUsersStore();
    const index = users.findIndex((u) => u.id === userId);
    if (index === -1) throw new Error('User not found');

    users[index].status = users[index].status === 'Active' ? 'Suspended' : 'Active';
    saveUsersStore(users);
    return users[index];
  },

  /**
   * Get enforcement officers list with live computed workload
   */
  async getOfficers(params = {}) {
    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    const { search = '' } = params;
    let officers = getOfficersStore();

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      officers = officers.filter(
        (o) =>
          o.name.toLowerCase().includes(q) ||
          o.email.toLowerCase().includes(q) ||
          o.badgeNumber.toLowerCase().includes(q) ||
          o.jurisdiction.toLowerCase().includes(q)
      );
    }

    // Attach real-time computed workload
    const officersWithWorkload = officers.map((o) => {
      const workload = complaintsService.computeOfficerWorkload(o.id);
      return {
        ...o,
        complaintsAssigned: workload.totalAssigned,
        activeWorkload: workload.activeWorkload,
        complaintsCompleted: workload.completed,
      };
    });

    return {
      officers: officersWithWorkload,
      total: officersWithWorkload.length,
    };
  },

  /**
   * Get officers formatted for assignment dropdown/modal
   */
  async getOfficersWithWorkload() {
    const res = await this.getOfficers();
    return res.officers;
  },

  /**
   * Create a new enforcement officer account
   */
  async createOfficer(data) {
    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    const officers = getOfficersStore();
    const newOfficer = {
      id: `off-${officers.length + 1}`,
      name: data.name || 'Enforcement Inspector',
      email: data.email || 'officer@legalmetrology.gov.in',
      badgeNumber: data.badgeNumber || `LM-DEL-${Math.floor(100 + Math.random() * 900)}`,
      jurisdiction: data.jurisdiction || 'State Legal Metrology Surveillance Wing',
      totalScansDone: 0,
      phone: data.phone || '+91 99111 00000',
      status: 'Active',
      joinedAt: new Date().toISOString().split('T')[0],
    };

    officers.unshift(newOfficer);
    saveOfficersStore(officers);
    return newOfficer;
  },
};

export default adminService;
