export const initialCentres = [
  {
    id: 'cnt-sonipat',
    name: 'Sonipat Main Procurement Centre',
    district: 'Sonipat',
    state: 'Haryana',
    address: 'G.T. Road, Sector 15, Near Grain Market, Sonipat',
    distanceKm: 6.2,
    lat: 28.9931,
    lng: 77.0151,
    queueCount: 12,
    estWaitMinutes: 24,
    capacityPercent: 58,
    availableSlots: 8,
    totalSlots: 40,
    activeCounters: 4,
    operatingHours: '08:00 AM - 06:00 PM',
    status: 'NORMAL', // NORMAL | MODERATE | CONGESTED
    recommended: true,
    recommendationReason: 'Lowest expected waiting time & optimal capacity load'
  },
  {
    id: 'cnt-karnal',
    name: 'Karnal Grain Mandi Hub',
    district: 'Karnal',
    state: 'Haryana',
    address: 'Old Grain Market Yard, GT Road, Karnal',
    distanceKm: 14.5,
    lat: 29.6857,
    lng: 76.9905,
    queueCount: 38,
    estWaitMinutes: 75,
    capacityPercent: 91,
    availableSlots: 2,
    totalSlots: 50,
    activeCounters: 6,
    operatingHours: '07:30 AM - 07:00 PM',
    status: 'CONGESTED',
    recommended: false,
    recommendationReason: 'High congestion. Consider Sonipat or Panipat.'
  },
  {
    id: 'cnt-panipat',
    name: 'Panipat Sub-Mandi Procurement Yard',
    district: 'Panipat',
    state: 'Haryana',
    address: 'Industrial Area Phase 2, Near Bypass, Panipat',
    distanceKm: 9.8,
    lat: 29.3909,
    lng: 76.9635,
    queueCount: 22,
    estWaitMinutes: 45,
    capacityPercent: 76,
    availableSlots: 5,
    totalSlots: 35,
    activeCounters: 3,
    operatingHours: '08:00 AM - 05:30 PM',
    status: 'MODERATE',
    recommended: false,
    recommendationReason: 'Moderate queue size'
  },
  {
    id: 'cnt-rohtak',
    name: 'Rohtak Kisan Procurement Hub',
    district: 'Rohtak',
    state: 'Haryana',
    address: 'Delhi Road, Opp. New Agriculture Office, Rohtak',
    distanceKm: 18.0,
    lat: 28.8955,
    lng: 76.6066,
    queueCount: 10,
    estWaitMinutes: 20,
    capacityPercent: 40,
    availableSlots: 14,
    totalSlots: 45,
    activeCounters: 4,
    operatingHours: '08:00 AM - 06:00 PM',
    status: 'NORMAL',
    recommended: false,
    recommendationReason: 'Fast clearance rate'
  }
];

export const initialCrops = [
  { id: 'paddy-a', name: 'Paddy (Grade A)', category: 'Kharif', mspRate: 2200, unit: 'Quintal', maxMoisture: 17 },
  { id: 'wheat-sharbati', name: 'Wheat (Kalyan/Sharbati)', category: 'Rabi', mspRate: 2275, unit: 'Quintal', maxMoisture: 12 },
  { id: 'mustard-raya', name: 'Mustard (Raya)', category: 'Rabi', mspRate: 5650, unit: 'Quintal', maxMoisture: 8 },
  { id: 'maize-yellow', name: 'Maize (Yellow Corn)', category: 'Kharif', mspRate: 2090, unit: 'Quintal', maxMoisture: 14 },
  { id: 'cotton-medium', name: 'Cotton (Medium Staple)', category: 'Kharif', mspRate: 6620, unit: 'Quintal', maxMoisture: 10 }
];

export const initialTimeSlots = [
  { id: 'slot-1', time: '09:00 AM - 09:30 AM', status: 'FULL', remaining: 0 },
  { id: 'slot-2', time: '09:30 AM - 10:00 AM', status: 'FULL', remaining: 0 },
  { id: 'slot-3', time: '10:00 AM - 10:30 AM', status: 'FULL', remaining: 0 },
  { id: 'slot-4', time: '10:30 AM - 11:00 AM', status: 'FULL', remaining: 0 },
  { id: 'slot-5', time: '11:00 AM - 11:30 AM', status: 'AVAILABLE', remaining: 3 },
  { id: 'slot-6', time: '11:30 AM - 12:00 PM', status: 'AVAILABLE', remaining: 7 },
  { id: 'slot-7', time: '01:00 PM - 01:30 PM', status: 'AVAILABLE', remaining: 10 },
  { id: 'slot-8', time: '01:30 PM - 02:00 PM', status: 'AVAILABLE', remaining: 12 }
];

export const initialQueueItems = [
  {
    token: 'SNP-011',
    farmerName: 'Harpreet Singh',
    crop: 'Paddy (Grade A)',
    expectedQty: 45,
    actualQty: 44.2,
    counter: 'Counter 1',
    status: 'COMPLETED',
    arrivalTime: '09:12 AM',
    completedTime: '10:15 AM',
    paymentStatus: 'DISBURSED'
  },
  {
    token: 'SNP-012',
    farmerName: 'Jaipal Yadav',
    crop: 'Paddy (Grade A)',
    expectedQty: 30,
    actualQty: 29.8,
    counter: 'Counter 1',
    status: 'COMPLETED',
    arrivalTime: '09:40 AM',
    completedTime: '10:45 AM',
    paymentStatus: 'DISBURSED'
  },
  {
    token: 'SNP-013',
    farmerName: 'Baldev Ram',
    crop: 'Paddy (Grade A)',
    expectedQty: 50,
    actualQty: null,
    counter: 'Counter 2',
    status: 'CHECKED_IN',
    arrivalTime: '10:05 AM',
    completedTime: null,
    paymentStatus: 'PENDING'
  },
  {
    token: 'SNP-014',
    farmerName: 'Ramesh Singh (YOU)',
    mobile: '+91 98765 43210',
    aadhaarLast4: '4821',
    crop: 'Paddy (Grade A)',
    expectedQty: 40,
    actualQty: null, // Will be updated to 38.5 by operator
    moisturePercent: null, // Will be updated to 12.4
    qualityGrade: null, // Will be updated to 'Grade A'
    counter: 'Counter 2',
    slotTime: '11:00 AM - 11:30 AM',
    centreId: 'cnt-sonipat',
    centreName: 'Sonipat Main Procurement Centre',
    status: 'WAITING', // WAITING | CHECKED_IN | PROCESSING | COMPLETED
    arrivalTime: '10:22 AM',
    bookingId: 'BK-2026-8812',
    ratePerQuintal: 2200,
    paymentStatus: 'PENDING' // PENDING | PENDING_DISBURSAL | DISBURSED
  },
  {
    token: 'SNP-015',
    farmerName: 'Vikramjit Sharma',
    crop: 'Paddy (Grade A)',
    expectedQty: 35,
    actualQty: null,
    counter: 'Unassigned',
    status: 'WAITING',
    arrivalTime: '10:45 AM',
    paymentStatus: 'PENDING'
  }
];

export const initialPastHistory = [
  {
    id: 'HIST-2026-01',
    season: 'Rabi 2025-26',
    date: '18 Mar 2026',
    centre: 'Sonipat Main Procurement Centre',
    crop: 'Wheat (Kalyan/Sharbati)',
    expectedQty: 50.0,
    actualQty: 52.0,
    ratePerQuintal: 2275,
    totalAmount: 118300,
    formula: '52.0 quintals × ₹2,275/quintal = ₹1,18,300',
    qualityGrade: 'Grade A',
    moisturePercent: 11.2,
    procurementStatus: 'COMPLETED',
    paymentStatus: 'DISBURSED',
    dbtReference: 'DBT-UTIB000762198',
    bankAccount: 'State Bank of India (****4092)'
  },
  {
    id: 'HIST-2025-04',
    season: 'Kharif 2025',
    date: '24 Oct 2025',
    centre: 'Karnal Grain Mandi Hub',
    crop: 'Mustard (Raya)',
    expectedQty: 25.0,
    actualQty: 24.0,
    ratePerQuintal: 5650,
    totalAmount: 135600,
    formula: '24.0 quintals × ₹5,650/quintal = ₹1,35,600',
    qualityGrade: 'Grade A',
    moisturePercent: 7.8,
    procurementStatus: 'COMPLETED',
    paymentStatus: 'DISBURSED',
    dbtReference: 'DBT-UTIB000541902',
    bankAccount: 'State Bank of India (****4092)'
  }
];

export const initialNotifications = [
  {
    id: 'notif-1',
    timestamp: '10:30 AM',
    title: 'Slot Booking Confirmed',
    message: 'Your slot at Sonipat Procurement Centre for Paddy (40 quintals) is confirmed. Token: SNP-014.',
    type: 'success',
    read: false,
    forRole: 'farmer'
  },
  {
    id: 'notif-2',
    timestamp: '10:35 AM',
    title: 'Centre Capacity Alert',
    message: 'Sonipat Procurement Centre is currently operating at 58% capacity with ~24 min average wait time.',
    type: 'info',
    read: true,
    forRole: 'farmer'
  }
];
