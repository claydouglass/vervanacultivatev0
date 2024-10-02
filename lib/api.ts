// src/lib/api.ts
// Mock data
const rooms = [
    {
      id: 1,
      name: "Room 1",
      strain: "Lemon Terpz",
      stage: "Flowering",
      day: 40,
      environmentalData: [
        { day: 1, temperature: 23.5, humidity: 65, ppfd: 850, co2: 1000, vpd: 1.2 },
        { day: 10, temperature: 24.0, humidity: 60, ppfd: 950, co2: 1100, vpd: 1.3 },
        { day: 20, temperature: 24.2, humidity: 58, ppfd: 1000, co2: 1150, vpd: 1.4 },
        { day: 30, temperature: 24.5, humidity: 56, ppfd: 1050, co2: 1200, vpd: 1.45 },
        { day: 40, temperature: 24.3, humidity: 55, ppfd: 1100, co2: 1210, vpd: 1.5 },
      ],
      recipe: {
        temperature: { min: 23, max: 25 },
        humidity: { min: 50, max: 60 },
        ppfd: { min: 1000, max: 1200 },
        co2: { min: 1100, max: 1300 },
        vpd: { min: 1.3, max: 1.6 },
      },
      qualityForecast: {
        overall: 8.7,
        appearance: 9.0,
        aroma: 8.5,
        flavor: 8.8,
        effect: 8.6,
      },
      yieldForecast: 475,
      terpenesForecast: {
        total: 3.2,
        topThree: [
          { name: "Myrcene", percentage: 1.2 },
          { name: "Limonene", percentage: 0.8 },
          { name: "Caryophyllene", percentage: 0.6 },
        ],
      },
      thcForecast: { min: 22, max: 25 },
    },
    // Add more rooms as needed
  ]
  
  const financialData = {
    costPerGram: [
      { category: "Labor", cost: 0.60 },
      { category: "Facility", cost: 0.30 },
      { category: "Energy", cost: 0.25 },
      { category: "Nutrients", cost: 0.15 },
      { category: "Clones/Seeds", cost: 0.10 },
      { category: "Other Inputs", cost: 0.10 },
    ]
  }
  
  const processingData = [
    { 
      id: 1,
      batch: "LT-001",
      strain: "Lemon Terpz",
      currentStage: "Drying",
      daysInStage: 5,
      temperature: 18.5,
      humidity: 60,
      light: 0,
      nextStage: "Curing",
      expectedTransition: "2023-10-04"
    },
    { 
      id: 2,
      batch: "KT-002",
      strain: "Kandy Terpz",
      currentStage: "Curing",
      daysInStage: 12,
      temperature: 20,
      humidity: 62,
      light: 0,
      nextStage: "Trimming",
      expectedTransition: "2023-10-10"
    },
    // Add more batches as needed
  ]
  
  const staffData = [
    {
      id: 1,
      name: "Emily Johnson",
      todayTasks: ["Prune Room 1", "Check nutrient levels in Room 2"],
      upcomingTasks: ["Harvest Room 3", "Train new hires"],
    },
    {
      id: 2,
      name: "Michael Chen",
      todayTasks: ["Monitor drying process", "Update inventory"],
      upcomingTasks: ["Prepare for next batch", "Conduct quality checks"],
    },
    // Add more staff members as needed
  ]
  
  // API functions
  export async function getRooms() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    return rooms
  }
  
  export async function getRoom(id: number) {
    await new Promise(resolve => setTimeout(resolve, 500))
    return rooms.find(room => room.id === id) || null
  }
  
  export async function getFinancialData() {
    await new Promise(resolve => setTimeout(resolve, 500))
    return financialData
  }
  
  export async function getProcessingData() {
    await new Promise(resolve => setTimeout(resolve, 500))
    return processingData
  }
  
  export async function getStaffData() {
    await new Promise(resolve => setTimeout(resolve, 500))
    return staffData
  }