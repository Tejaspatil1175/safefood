import api from './api';

const IS_MOCK_ENABLED = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === true;
const STORAGE_KEY = 'trustlabel_complaints_store';

// Default initial complaints dataset with a realistic variety of lifecycle stages
export const INITIAL_COMPLAINTS = [
  {
    id: 'CMP-0001',
    title: 'Missing Mandatory Unit Sale Price (USP) & Faded Font',
    description: 'The cooking oil package purchased from Metro Mart does not declare Unit Sale Price (USP) per 100ml / 1L as mandated by Legal Metrology PCR Rule 6(11). Additionally, the net quantity numerals are printed below 3mm.',
    productName: 'Sunrise Sunflower Cooking Oil 1L',
    storeOrLocation: 'Metro Mart #14, Sector 18, Noida, UP',
    imageUrl: 'https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=800&q=80',
    raisedBy: {
      id: 'usr-101',
      name: 'Aarav Sharma',
      email: 'user@test.com',
    },
    createdAt: '2026-10-06T10:30:00Z',
    status: 'under_investigation',
    assignedOfficer: {
      id: 'off-1',
      name: 'Insp. Priya Verma',
    },
    assignedAt: '2026-10-06T14:00:00Z',
    officerNotes: 'Preliminary field verification conducted at Metro Mart. Initial sample photographed. Unit Sale Price is completely absent on the rear label panel.',
    resolvedAt: null,
    timeline: [
      {
        status: 'submitted',
        note: 'Consumer grievance registered on TrustLabel Citizen portal with photographic evidence.',
        by: 'Aarav Sharma (Consumer)',
        at: '2026-10-06T10:30:00Z',
      },
      {
        status: 'assigned',
        note: 'Grievance assigned to Insp. Priya Verma for field verification.',
        by: 'System Administrator',
        at: '2026-10-06T14:00:00Z',
      },
      {
        status: 'under_investigation',
        note: 'Insp. Priya Verma initiated active statutory investigation and physical sampling.',
        by: 'Insp. Priya Verma',
        at: '2026-10-07T09:15:00Z',
      },
    ],
  },
  {
    id: 'CMP-0002',
    title: 'Dual MRP Over-Sticker on Imported Beverage',
    description: 'A higher price sticker of ₹220 was pasted over the original printed MRP of ₹160 on an imported energy drink can at the fuel station convenience store.',
    productName: 'Alpine Turbo Energy Drink 250ml',
    storeOrLocation: 'Highway Fuel Station #12, NH-44, Sonipat',
    imageUrl: 'https://images.unsplash.com/photo-1622543925917-763c34d1a86e?auto=format&fit=crop&w=800&q=80',
    raisedBy: {
      id: 'usr-102',
      name: 'Meera Nair',
      email: 'meera.nair@example.com',
    },
    createdAt: '2026-10-05T16:20:00Z',
    status: 'assigned',
    assignedOfficer: {
      id: 'off-1',
      name: 'Insp. Priya Verma',
    },
    assignedAt: '2026-10-06T09:00:00Z',
    officerNotes: '',
    resolvedAt: null,
    timeline: [
      {
        status: 'submitted',
        note: 'Citizen uploaded receipt and dual price sticker comparison photos.',
        by: 'Meera Nair (Consumer)',
        at: '2026-10-05T16:20:00Z',
      },
      {
        status: 'assigned',
        note: 'Assigned to Insp. Priya Verma for retail outlet inspection under Section 18.',
        by: 'System Administrator',
        at: '2026-10-06T09:00:00Z',
      },
    ],
  },
  {
    id: 'CMP-0003',
    title: 'Net Quantity Deficit & Missing Consumer Care Email',
    description: 'Basmati rice 5kg pack weighed 4.68kg on calibrated digital scale (320g deficit beyond Maximum Permissible Error). Furthermore, no customer care email is printed on the pouch.',
    productName: 'Kohinoor Harvest Basmati Rice 5kg',
    storeOrLocation: 'Grain Wholesale Bazaar, Chandni Chowk, Delhi',
    imageUrl: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?auto=format&fit=crop&w=800&q=80',
    raisedBy: {
      id: 'usr-101',
      name: 'Aarav Sharma',
      email: 'user@test.com',
    },
    createdAt: '2026-10-04T11:00:00Z',
    status: 'verified_genuine',
    assignedOfficer: {
      id: 'off-1',
      name: 'Insp. Priya Verma',
    },
    assignedAt: '2026-10-04T12:30:00Z',
    officerNotes: 'Audited 10 sample packages on-site with certified legal metrology test weights. All packages showed a net deficit ranging from 280g to 340g. Violation confirmed under Rule 24 of PCR 2011. Notice Form-IV issued to packer.',
    resolvedAt: '2026-10-05T15:45:00Z',
    timeline: [
      {
        status: 'submitted',
        note: 'Complaint registered with tare weight receipt photos.',
        by: 'Aarav Sharma (Consumer)',
        at: '2026-10-04T11:00:00Z',
      },
      {
        status: 'assigned',
        note: 'Assigned to Insp. Priya Verma for urgent sample seizure.',
        by: 'System Administrator',
        at: '2026-10-04T12:30:00Z',
      },
      {
        status: 'under_investigation',
        note: 'On-site measurement inspection started at Grain Wholesale Bazaar.',
        by: 'Insp. Priya Verma',
        at: '2026-10-04T15:00:00Z',
      },
      {
        status: 'verified_genuine',
        note: 'Statutory violation confirmed. Systematic net weight deficit verified. Statutory notice served.',
        by: 'Insp. Priya Verma',
        at: '2026-10-05T15:45:00Z',
      },
    ],
  },
  {
    id: 'CMP-0004',
    title: 'Alleged Non-Compliance of Manufacturer Address Format',
    description: 'Complainant claimed the manufacturer address only stated "Industrial Area Phase 1" without city postal PIN code.',
    productName: 'NutriPure Organic Almond Milk 1L',
    storeOrLocation: 'Nature Basket Supermarket, Vasant Vihar',
    imageUrl: 'https://images.unsplash.com/photo-1568651316314-2fa84b806d20?auto=format&fit=crop&w=800&q=80',
    raisedBy: {
      id: 'usr-104',
      name: 'Kavita Sundaram',
      email: 'kavita.s@example.com',
    },
    createdAt: '2026-10-02T14:10:00Z',
    status: 'verified_not_genuine',
    assignedOfficer: {
      id: 'off-2',
      name: 'Insp. Rajesh Kumar',
    },
    assignedAt: '2026-10-02T16:00:00Z',
    officerNotes: 'Inspected original retail batch #NM-4029. Full postal address including registered state and 6-digit PIN code (400088) is printed on the carton shoulder fold. Complaint is not genuine / dismissed.',
    resolvedAt: '2026-10-03T11:20:00Z',
    timeline: [
      {
        status: 'submitted',
        note: 'Consumer grievance filed.',
        by: 'Kavita Sundaram (Consumer)',
        at: '2026-10-02T14:10:00Z',
      },
      {
        status: 'assigned',
        note: 'Assigned for retail pack examination.',
        by: 'System Administrator',
        at: '2026-10-02T16:00:00Z',
      },
      {
        status: 'under_investigation',
        note: 'Carton examined with high-resolution optical magnifier.',
        by: 'Insp. Rajesh Kumar',
        at: '2026-10-03T09:30:00Z',
      },
      {
        status: 'verified_not_genuine',
        note: 'Manufacturer address complies with PCR Rule 6(1)(a). Grievance closed as non-genuine.',
        by: 'Insp. Rajesh Kumar',
        at: '2026-10-03T11:20:00Z',
      },
    ],
  },
  {
    id: 'CMP-0005',
    title: 'Absence of Expiry Date on Packaged Spices',
    description: 'Purchased 200g chilli powder polybag with missing Best Before / Expiry date declaration.',
    productName: 'Spices Of India Extra Hot Chilli Powder 200g',
    storeOrLocation: 'Heritage Kirana #2, Karol Bagh, Delhi',
    imageUrl: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?auto=format&fit=crop&w=800&q=80',
    raisedBy: {
      id: 'usr-101',
      name: 'Aarav Sharma',
      email: 'user@test.com',
    },
    createdAt: '2026-10-07T08:45:00Z',
    status: 'submitted',
    assignedOfficer: null,
    assignedAt: null,
    officerNotes: '',
    resolvedAt: null,
    timeline: [
      {
        status: 'submitted',
        note: 'Grievance submitted by consumer. Pending assignment to enforcement officer.',
        by: 'Aarav Sharma (Consumer)',
        at: '2026-10-07T08:45:00Z',
      },
    ],
  },
  {
    id: 'CMP-0006',
    title: 'Illegible Customer Care Phone Number & Blurred Text',
    description: 'The customer service telephone number on the detergent package is completely smudged and unreadable.',
    productName: 'CleanGlow Detergent Powder 2kg',
    storeOrLocation: 'Super Hypermarket #8, Ghaziabad',
    imageUrl: 'https://images.unsplash.com/photo-1583947215259-38e31be8751f?auto=format&fit=crop&w=800&q=80',
    raisedBy: {
      id: 'usr-106',
      name: 'Ananya Deshmukh',
      email: 'ananya.d@example.com',
    },
    createdAt: '2026-10-07T12:15:00Z',
    status: 'submitted',
    assignedOfficer: null,
    assignedAt: null,
    officerNotes: '',
    resolvedAt: null,
    timeline: [
      {
        status: 'submitted',
        note: 'Complaint lodged with rear package photo.',
        by: 'Ananya Deshmukh (Consumer)',
        at: '2026-10-07T12:15:00Z',
      },
    ],
  },
];

let localStore = null;

const getStore = () => {
  if (localStore) return localStore;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      localStore = JSON.parse(raw);
      return localStore;
    }
  } catch (err) {
    console.warn('Failed to load complaints from localStorage', err);
  }
  localStore = JSON.parse(JSON.stringify(INITIAL_COMPLAINTS));
  saveStore(localStore);
  return localStore;
};

const saveStore = (data) => {
  localStore = data;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (err) {
    console.warn('Failed to persist complaints to localStorage', err);
  }
};

export const complaintsService = {
  /**
   * Get all complaints (Admin / Global view)
   */
  async getAllComplaints(params = {}) {
    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    const { search = '', status = 'all', page = 1, limit = 10 } = params;
    const store = getStore();
    let list = [...store];

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.productName.toLowerCase().includes(q) ||
          (c.storeOrLocation && c.storeOrLocation.toLowerCase().includes(q)) ||
          (c.raisedBy?.name && c.raisedBy.name.toLowerCase().includes(q)) ||
          (c.raisedBy?.email && c.raisedBy.email.toLowerCase().includes(q)) ||
          (c.assignedOfficer?.name && c.assignedOfficer.name.toLowerCase().includes(q))
      );
    }

    if (status && status !== 'all') {
      const target = status.toLowerCase();
      if (target === 'unassigned') {
        list = list.filter((c) => !c.assignedOfficer || c.status === 'submitted');
      } else if (target === 'assigned') {
        list = list.filter((c) => c.status === 'assigned');
      } else if (target === 'under_investigation' || target === 'investigating') {
        list = list.filter((c) => c.status === 'under_investigation');
      } else if (target === 'verified_genuine' || target === 'genuine') {
        list = list.filter((c) => c.status === 'verified_genuine');
      } else if (target === 'verified_not_genuine' || target === 'not_genuine' || target === 'dismissed') {
        list = list.filter((c) => c.status === 'verified_not_genuine');
      } else if (target === 'completed' || target === 'resolved') {
        list = list.filter((c) => c.status === 'verified_genuine' || c.status === 'verified_not_genuine');
      } else {
        list = list.filter((c) => c.status === target);
      }
    }

    const counts = {
      all: store.length,
      unassigned: store.filter((c) => !c.assignedOfficer || c.status === 'submitted').length,
      assigned: store.filter((c) => c.status === 'assigned').length,
      underInvestigation: store.filter((c) => c.status === 'under_investigation').length,
      verifiedGenuine: store.filter((c) => c.status === 'verified_genuine').length,
      verifiedNotGenuine: store.filter((c) => c.status === 'verified_not_genuine').length,
      completed: store.filter((c) => c.status === 'verified_genuine' || c.status === 'verified_not_genuine').length,
    };

    const total = list.length;
    const numPage = Number(page) || 1;
    const numLimit = Number(limit) || 10;
    const totalPages = Math.ceil(total / numLimit) || 1;
    const startIndex = (numPage - 1) * numLimit;
    const paginated = list.slice(startIndex, startIndex + numLimit);

    return {
      complaints: paginated,
      total,
      page: numPage,
      totalPages,
      counts,
    };
  },

  /**
   * Alias for compatibility
   */
  async getComplaints(params = {}) {
    return this.getAllComplaints(params);
  },

  /**
   * Get complaints raised by a specific Citizen / User
   * @param {string} [userId]
   * @param {Object} [params]
   */
  async getMyComplaints(userId, params = {}) {
    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    const { status = 'all', search = '' } = params;
    const store = getStore();

    // In demo mode, if user is logged in as user@test.com, match raisedBy.id or user email or default user pool
    let list = store.filter((c) => {
      if (!userId) return true;
      if (c.raisedBy?.id === userId) return true;
      if (c.raisedBy?.email?.toLowerCase().includes('user') || c.raisedBy?.id === 'usr-101') return true;
      return false;
    });

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.productName.toLowerCase().includes(q) ||
          (c.storeOrLocation && c.storeOrLocation.toLowerCase().includes(q))
      );
    }

    if (status && status !== 'all') {
      const target = status.toLowerCase();
      if (target === 'submitted') {
        list = list.filter((c) => c.status === 'submitted');
      } else if (target === 'in_progress' || target === 'in-progress' || target === 'assigned' || target === 'under_investigation') {
        list = list.filter((c) => c.status === 'assigned' || c.status === 'under_investigation');
      } else if (target === 'resolved' || target === 'completed') {
        list = list.filter((c) => c.status === 'verified_genuine' || c.status === 'verified_not_genuine');
      }
    }

    const baseList = store.filter((c) => !userId || c.raisedBy?.id === userId || c.raisedBy?.id === 'usr-101' || c.raisedBy?.email?.includes('user'));
    const counts = {
      all: baseList.length,
      submitted: baseList.filter((c) => c.status === 'submitted').length,
      inProgress: baseList.filter((c) => c.status === 'assigned' || c.status === 'under_investigation').length,
      resolved: baseList.filter((c) => c.status === 'verified_genuine' || c.status === 'verified_not_genuine').length,
    };

    return {
      complaints: list,
      total: list.length,
      counts,
    };
  },

  /**
   * Get complaints assigned to a specific officer
   */
  async getAssignedComplaints(officerId, params = {}) {
    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    const { search = '', tab = 'all' } = params;
    const store = getStore();

    let list = store.filter((c) => {
      if (!c.assignedOfficer) return false;
      if (!officerId) return true;
      return (
        c.assignedOfficer.id === officerId ||
        c.assignedOfficer.name?.toLowerCase().includes('priya') ||
        officerId.includes('officer')
      );
    });

    if (search && search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter(
        (c) =>
          c.id.toLowerCase().includes(q) ||
          c.title.toLowerCase().includes(q) ||
          c.productName.toLowerCase().includes(q) ||
          (c.storeOrLocation && c.storeOrLocation.toLowerCase().includes(q)) ||
          (c.raisedBy?.name && c.raisedBy.name.toLowerCase().includes(q))
      );
    }

    if (tab && tab !== 'all') {
      if (tab === 'assigned') {
        list = list.filter((c) => c.status === 'assigned');
      } else if (tab === 'under_investigation' || tab === 'investigating') {
        list = list.filter((c) => c.status === 'under_investigation');
      } else if (tab === 'completed' || tab === 'resolved') {
        list = list.filter((c) => c.status === 'verified_genuine' || c.status === 'verified_not_genuine');
      }
    }

    const baseOfficerList = store.filter((c) => Boolean(c.assignedOfficer));
    const counts = {
      all: baseOfficerList.length,
      assigned: baseOfficerList.filter((c) => c.status === 'assigned').length,
      underInvestigation: baseOfficerList.filter((c) => c.status === 'under_investigation').length,
      completed: baseOfficerList.filter((c) => c.status === 'verified_genuine' || c.status === 'verified_not_genuine').length,
    };

    return {
      complaints: list,
      total: list.length,
      counts,
    };
  },

  /**
   * Get single complaint by ID
   */
  async getComplaintById(id) {
    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 150));
    }

    const store = getStore();
    const found = store.find((c) => c.id === id || c.id.toLowerCase() === String(id).toLowerCase());
    if (found) return found;

    try {
      let response;
      try {
        response = await api.get(`/api/v1/complaints/${id}`);
      } catch {
        response = await api.get(`/api/complaints/${id}`);
      }
      return response.data?.data || response.data;
    } catch {
      return store[0];
    }
  },

  /**
   * Create a new complaint (Citizen Action)
   */
  async createComplaint(data, user = { id: 'usr-101', name: 'Citizen User', email: 'user@test.com' }) {
    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    const store = getStore();
    const newId = `CMP-${String(store.length + 1).padStart(4, '0')}`;

    const newComplaint = {
      id: newId,
      title: data.title || 'Product Label Non-Compliance Grievance',
      description: data.description || '',
      productName: data.productName || 'Sampled Packaged Commodity',
      storeOrLocation: data.storeOrLocation || data.location || 'Retail Store',
      imageUrl: data.imageUrl || null,
      scanId: data.scanId || null,
      raisedBy: {
        id: user?.id || 'usr-101',
        name: user?.name || 'Citizen User',
        email: user?.email || 'user@test.com',
      },
      createdAt: new Date().toISOString(),
      status: 'submitted',
      assignedOfficer: null,
      assignedAt: null,
      officerNotes: '',
      resolvedAt: null,
      timeline: [
        {
          status: 'submitted',
          note: 'Complaint submitted with label evidence on TrustLabel portal.',
          by: `${user?.name || 'Citizen'} (Consumer)`,
          at: new Date().toISOString(),
        },
      ],
    };

    store.unshift(newComplaint);
    saveStore(store);

    // Sync in background if backend is online
    try {
      await api.post('/api/complaints', newComplaint);
    } catch {
      // Ignore background sync errors
    }

    return newComplaint;
  },

  /**
   * Admin Action: Assign / Reassign complaint to an officer
   * @param {string} complaintId
   * @param {string|Object} officer - ID string or officer object { id, name }
   * @param {string} [instructionsNote]
   * @param {string} [adminName]
   */
  async assignComplaint(complaintId, officer, instructionsNote = '', adminName = 'System Administrator') {
    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    const store = getStore();
    const index = store.findIndex((c) => c.id === complaintId);
    if (index === -1) {
      throw new Error(`Complaint ${complaintId} not found.`);
    }

    const item = { ...store[index] };

    // Reassignment check: once investigation is started or completed, reassignment is disallowed
    if (item.status === 'under_investigation' || item.status === 'verified_genuine' || item.status === 'verified_not_genuine') {
      throw new Error('Cannot reassign complaint after active investigation has commenced.');
    }

    const officerObj = typeof officer === 'object' ? officer : { id: officer, name: 'Insp. Priya Verma' };
    item.assignedOfficer = officerObj;
    item.assignedAt = new Date().toISOString();
    item.status = 'assigned';

    const noteText = instructionsNote && instructionsNote.trim()
      ? `Assigned to ${officerObj.name} for statutory audit. Instructions: "${instructionsNote.trim()}"`
      : `Assigned to ${officerObj.name} for Legal Metrology PCR 2011 inspection.`;

    const timelineEntry = {
      status: 'assigned',
      note: noteText,
      by: adminName,
      at: new Date().toISOString(),
    };

    item.timeline = [...(item.timeline || []), timelineEntry];
    store[index] = item;
    saveStore(store);

    try {
      await api.patch(`/api/complaints/${complaintId}/assign`, {
        officerId: officerObj.id,
        note: instructionsNote,
      });
    } catch {
      // Ignore background sync errors
    }

    return item;
  },

  /**
   * Officer action: Start Investigation
   */
  async startInvestigation(id, officer = { name: 'Insp. Priya Verma' }) {
    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 250));
    }

    const store = getStore();
    const index = store.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Complaint ${id} not found.`);
    }

    const item = { ...store[index] };
    item.status = 'under_investigation';

    const newTimelineEntry = {
      status: 'under_investigation',
      note: `${officer?.name || 'Officer'} initiated field inspection & label verification.`,
      by: officer?.name || 'Insp. Priya Verma',
      at: new Date().toISOString(),
    };

    item.timeline = [...(item.timeline || []), newTimelineEntry];
    store[index] = item;
    saveStore(store);

    try {
      await api.patch(`/api/complaints/${id}/status`, {
        status: 'under_investigation',
      });
    } catch {
      // Ignore background sync errors
    }

    return item;
  },

  /**
   * Officer decision: Verify as Genuine or Mark as Not Genuine
   */
  async submitVerification(id, decision, notes, officer = { name: 'Insp. Priya Verma' }) {
    if (!notes || !notes.trim()) {
      throw new Error('Inspection findings and notes are required before submitting a decision.');
    }

    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    const store = getStore();
    const index = store.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Complaint ${id} not found.`);
    }

    const isGenuine = decision === 'verified_genuine';
    const item = { ...store[index] };
    item.status = decision;
    item.officerNotes = notes.trim();
    item.resolvedAt = new Date().toISOString();

    const decisionNote = isGenuine
      ? `Statutory violation confirmed. Grievance verified as genuine. Notes: "${notes.trim()}"`
      : `Grievance verified as not genuine / compliant. Case dismissed. Notes: "${notes.trim()}"`;

    const newTimelineEntry = {
      status: decision,
      note: decisionNote,
      by: officer?.name || 'Insp. Priya Verma',
      at: new Date().toISOString(),
    };

    item.timeline = [...(item.timeline || []), newTimelineEntry];
    store[index] = item;
    saveStore(store);

    try {
      await api.patch(`/api/complaints/${id}/status`, {
        status: decision,
        notes: notes.trim(),
        actionTaken: isGenuine ? 'NOTICE_ISSUED' : 'DISMISSED',
      });
    } catch {
      // Ignore background sync errors
    }

    return item;
  },

  /**
   * Compute officer workload metrics
   */
  computeOfficerWorkload(officerId) {
    const store = getStore();
    const assigned = store.filter(
      (c) => c.assignedOfficer && (c.assignedOfficer.id === officerId || c.assignedOfficer.name?.includes(officerId))
    );
    const active = assigned.filter((c) => c.status === 'assigned' || c.status === 'under_investigation').length;
    const completed = assigned.filter((c) => c.status === 'verified_genuine' || c.status === 'verified_not_genuine').length;
    return {
      totalAssigned: assigned.length,
      activeWorkload: active,
      completed,
    };
  },

  /**
   * Count pending investigations for officer dashboard
   */
  async getPendingInvestigationsCount(officerId) {
    const { counts } = await this.getAssignedComplaints(officerId);
    return (counts?.assigned || 0) + (counts?.underInvestigation || 0);
  },

  /**
   * Reset store to default
   */
  resetStore() {
    saveStore(JSON.parse(JSON.stringify(INITIAL_COMPLAINTS)));
    return localStore;
  },
};

export default complaintsService;
