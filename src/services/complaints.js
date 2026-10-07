import api from './api';

const IS_MOCK_ENABLED = import.meta.env.VITE_USE_MOCK === 'true' || import.meta.env.VITE_USE_MOCK === true;
const STORAGE_KEY = 'trustlabel_complaints_store';

// Default initial complaints dataset
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
      email: 'aarav.sharma@example.com',
    },
    createdAt: '2026-10-06T10:30:00Z',
    status: 'under_investigation',
    assignedOfficer: {
      id: 'officer-1',
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
        note: 'Grievance assigned to State Legal Metrology Division - North Unit for field verification.',
        by: 'System Administrator',
        at: '2026-10-06T14:00:00Z',
      },
      {
        status: 'under_investigation',
        note: 'Inspector Priya Verma initiated active statutory investigation and physical sampling.',
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
      id: 'officer-1',
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
        note: 'Assigned to Inspector Priya Verma for retail outlet inspection under Section 18.',
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
      id: 'usr-103',
      name: 'Rohan Gupta',
      email: 'rohan.gupta@example.com',
    },
    createdAt: '2026-10-04T11:00:00Z',
    status: 'verified_genuine',
    assignedOfficer: {
      id: 'officer-1',
      name: 'Insp. Priya Verma',
    },
    assignedAt: '2026-10-04T12:30:00Z',
    officerNotes: 'Audited 10 sample packages on-site with certified legal metrology test weights. All packages showed a net deficit ranging from 280g to 340g. Violation confirmed under Rule 24 of PCR 2011. Notice Form-IV issued to packer.',
    resolvedAt: '2026-10-05T15:45:00Z',
    timeline: [
      {
        status: 'submitted',
        note: 'Complaint registered with tare weight receipt photos.',
        by: 'Rohan Gupta (Consumer)',
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
      id: 'officer-1',
      name: 'Insp. Priya Verma',
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
        by: 'Insp. Priya Verma',
        at: '2026-10-03T09:30:00Z',
      },
      {
        status: 'verified_not_genuine',
        note: 'Manufacturer address complies with PCR Rule 6(1)(a). Grievance closed as non-genuine.',
        by: 'Insp. Priya Verma',
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
      id: 'usr-105',
      name: 'Vikram Sethi',
      email: 'vikram.sethi@example.com',
    },
    createdAt: '2026-10-07T08:45:00Z',
    status: 'assigned',
    assignedOfficer: {
      id: 'officer-1',
      name: 'Insp. Priya Verma',
    },
    assignedAt: '2026-10-07T11:00:00Z',
    officerNotes: '',
    resolvedAt: null,
    timeline: [
      {
        status: 'submitted',
        note: 'Grievance submitted by consumer.',
        by: 'Vikram Sethi (Consumer)',
        at: '2026-10-07T08:45:00Z',
      },
      {
        status: 'assigned',
        note: 'Assigned to Inspector Priya Verma for inspection of batch coding.',
        by: 'System Administrator',
        at: '2026-10-07T11:00:00Z',
      },
    ],
  },
];

// In-memory store initialized from localStorage or defaults
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
   * Get all complaints (with search, filter, and pagination)
   */
  async getComplaints(params = {}) {
    const { search = '', status = 'all' } = params;
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
          (c.raisedBy?.name && c.raisedBy.name.toLowerCase().includes(q))
      );
    }

    if (status && status !== 'all') {
      const target = status.toLowerCase();
      if (target === 'completed') {
        list = list.filter((c) => c.status === 'verified_genuine' || c.status === 'verified_not_genuine');
      } else {
        list = list.filter((c) => c.status === target);
      }
    }

    return {
      complaints: list,
      total: list.length,
    };
  },

  /**
   * Get complaints assigned to a specific officer (or general officer queue)
   * @param {string} [officerId]
   * @param {Object} [params]
   */
  async getAssignedComplaints(officerId, params = {}) {
    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    const { search = '', tab = 'all' } = params;
    const store = getStore();
    
    // Filter complaints that belong to officer or assigned pool
    let list = store.filter((c) => {
      if (!c.assignedOfficer) return false;
      if (!officerId) return true;
      return (
        c.assignedOfficer.id === officerId ||
        c.assignedOfficer.name?.toLowerCase().includes('priya') ||
        officerId.includes('officer')
      );
    });

    // Search query filter
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

    // Tab filter: 'all' | 'assigned' | 'under_investigation' | 'completed'
    if (tab && tab !== 'all') {
      if (tab === 'assigned') {
        list = list.filter((c) => c.status === 'assigned');
      } else if (tab === 'under_investigation' || tab === 'investigating') {
        list = list.filter((c) => c.status === 'under_investigation');
      } else if (tab === 'completed' || tab === 'resolved') {
        list = list.filter((c) => c.status === 'verified_genuine' || c.status === 'verified_not_genuine');
      }
    }

    // Tab counts for quick metrics
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
   * @param {string} id
   */
  async getComplaintById(id) {
    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 200));
    }

    const store = getStore();
    const found = store.find((c) => c.id === id || c.id.toLowerCase() === String(id).toLowerCase());
    if (found) return found;

    // Try backend if live
    try {
      let response;
      try {
        response = await api.get(`/api/v1/complaints/${id}`);
      } catch {
        response = await api.get(`/api/complaints/${id}`);
      }
      return response.data?.data || response.data;
    } catch {
      // If not found in store or remote, return first item as fallback
      return store[0];
    }
  },

  /**
   * Officer action: Start Investigation (assigned -> under_investigation)
   * @param {string} id
   * @param {Object} [officer]
   */
  async startInvestigation(id, officer = { name: 'Insp. Priya Verma' }) {
    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 300));
    }

    const store = getStore();
    const index = store.findIndex((c) => c.id === id);
    if (index === -1) {
      throw new Error(`Complaint ${id} not found.`);
    }

    const item = { ...store[index] };
    item.status = 'under_investigation';
    
    // Add timeline entry
    const newTimelineEntry = {
      status: 'under_investigation',
      note: `${officer?.name || 'Officer'} initiated field inspection & label verification.`,
      by: officer?.name || 'Inspector Priya Verma',
      at: new Date().toISOString(),
    };

    item.timeline = [...(item.timeline || []), newTimelineEntry];
    store[index] = item;
    saveStore(store);

    // Try remote update in background
    try {
      await api.patch(`/api/complaints/${id}/status`, {
        status: 'under_investigation',
        officerNotes: item.officerNotes,
      });
    } catch {
      // Ignore background sync errors
    }

    return item;
  },

  /**
   * Officer decision: Verify as Genuine or Mark as Not Genuine
   * @param {string} id
   * @param {'verified_genuine'|'verified_not_genuine'} decision
   * @param {string} notes
   * @param {Object} [officer]
   */
  async submitVerification(id, decision, notes, officer = { name: 'Insp. Priya Verma' }) {
    if (!notes || !notes.trim()) {
      throw new Error('Inspection findings and notes are required before submitting a decision.');
    }

    if (IS_MOCK_ENABLED) {
      await new Promise((resolve) => setTimeout(resolve, 400));
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
      by: officer?.name || 'Inspector Priya Verma',
      at: new Date().toISOString(),
    };

    item.timeline = [...(item.timeline || []), newTimelineEntry];
    store[index] = item;
    saveStore(store);

    // Try remote update in background
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
   * Get total count of pending investigations (assigned + under_investigation)
   * @param {string} [officerId]
   */
  async getPendingInvestigationsCount(officerId) {
    const { counts } = await this.getAssignedComplaints(officerId);
    return (counts?.assigned || 0) + (counts?.underInvestigation || 0);
  },

  /**
   * Create a new complaint (Citizen / User action)
   * @param {Object} data
   * @param {Object} user
   */
  async createComplaint(data, user = { id: 'usr-101', name: 'Citizen User', email: 'citizen@example.com' }) {
    const store = getStore();
    const newId = `CMP-${String(store.length + 1).padStart(4, '0')}`;

    const newComplaint = {
      id: newId,
      title: data.title || 'Product Label Compliance Grievance',
      description: data.description || '',
      productName: data.productName || 'Sampled Packaged Commodity',
      storeOrLocation: data.storeOrLocation || data.location || 'Retail Store',
      imageUrl: data.imageUrl || null,
      raisedBy: {
        id: user.id || 'usr-101',
        name: user.name || 'Citizen User',
        email: user.email || 'user@example.com',
      },
      createdAt: new Date().toISOString(),
      status: 'assigned', // Auto-assigned to Priya Verma for seamless demo flow
      assignedOfficer: {
        id: 'officer-1',
        name: 'Insp. Priya Verma',
      },
      assignedAt: new Date().toISOString(),
      officerNotes: '',
      resolvedAt: null,
      timeline: [
        {
          status: 'submitted',
          note: 'Complaint submitted with label evidence.',
          by: `${user.name || 'Citizen'} (Consumer)`,
          at: new Date().toISOString(),
        },
        {
          status: 'assigned',
          note: 'Assigned to Inspector Priya Verma for statutory verification.',
          by: 'System Administrator',
          at: new Date().toISOString(),
        },
      ],
    };

    store.unshift(newComplaint);
    saveStore(store);
    return newComplaint;
  },

  /**
   * Reset local storage store to initial mock dataset (useful for testing)
   */
  resetStore() {
    saveStore(JSON.parse(JSON.stringify(INITIAL_COMPLAINTS)));
    return localStore;
  },
};

export default complaintsService;
